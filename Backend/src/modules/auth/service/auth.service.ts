import { v4 as uuidv4 } from "uuid";
import { AuthRepository } from "../repository/auth.repository";
import { HashService } from "./hash.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import prisma from "../../../config/db";
import { Prisma } from "@prisma/client";

export class AuthService {
  public static async register(payload: any) {
    const { fullName, email, password, role } = payload;

    // Check unique email
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      const error: any = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await HashService.hashPassword(password);

    // Verification token
    const verificationToken = uuidv4();

    // Create User inside transaction along with default Workspace
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          role,
          verificationToken: null,
          emailVerified: true,
          isVerified: true,
        },
      });

      // 2. Create default Workspace
      const workspaceSlug = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${uuidv4().substring(0, 6)}`;
      const workspace = await tx.workspace.create({
        data: {
          name: `${fullName}'s Workspace`,
          slug: workspaceSlug,
          ownerId: user.id,
        },
      });

      // 3. Create default Workspace Setting
      await tx.workspaceSetting.create({
        data: {
          workspaceId: workspace.id,
          theme: "light",
          language: "en",
          timezone: "UTC",
        },
      });

      // 4. Update User with Workspace reference
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { workspaceId: workspace.id },
        include: {
          workspace: {
            include: {
              settings: true,
            },
          },
        },
      });

      return updatedUser;
    });

    // Email verification bypassed for direct signup dev flow

    return {
      message: "Registration successful.",
    };
  }

  public static async login(payload: any) {
    const { email, password } = payload;

    // Find User
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Compare Password
    const isMatch = await HashService.comparePassword(password, user.password);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Check if email verified
    if (!user.emailVerified) {
      const error: any = new Error("Please verify your email address before logging in");
      error.statusCode = 403;
      throw error;
    }

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    // Save refresh token to database
    await AuthRepository.updateUser(user.id, { refreshToken });

    // Remove password hash from response payload
    const { password: _, refreshToken: __, ...userData } = user;

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  public static async verifyEmail(token: string) {
    const user = await AuthRepository.findByVerificationToken(token);
    if (!user) {
      const error: any = new Error("Invalid or expired verification token");
      error.statusCode = 400;
      throw error;
    }

    // Update verified properties
    await AuthRepository.updateUser(user.id, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      isVerified: true,
      verificationToken: null,
    });

    return {
      message: "Email verified successfully",
    };
  }

  public static async refresh(refreshToken: string) {
    try {
      // Decode
      const decoded = TokenService.verifyRefreshToken(refreshToken);

      // Find user
      const user = await AuthRepository.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        const error: any = new Error("Invalid session or refresh token");
        error.statusCode = 401;
        throw error;
      }

      // Generate new Access token
      const newAccessToken = TokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (err: any) {
      const error: any = new Error("Session expired or invalid refresh token");
      error.statusCode = 401;
      throw error;
    }
  }

  public static async logout(userId: string) {
    await AuthRepository.updateUser(userId, { refreshToken: null });
    return {
      message: "Logged out successfully",
    };
  }

  public static async getCurrentUser(userId: string) {
    const user = await AuthRepository.findById(userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Remove secrets
    const { password, refreshToken, ...userData } = user;

    return userData;
  }

  public static async updateProfile(userId: string, data: any) {
    const { fullName, avatar, company, phone, timezone } = data;

    const user = await AuthRepository.findById(userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Update User core fields
    const userUpdate: Prisma.UserUpdateInput = {};
    if (fullName) userUpdate.fullName = fullName;
    if (avatar !== undefined) userUpdate.avatar = avatar;

    const updatedUser = await AuthRepository.updateUser(userId, userUpdate);

    // Update Workspace name if provided
    if (company && updatedUser.workspaceId) {
      await prisma.workspace.update({
        where: { id: updatedUser.workspaceId },
        data: { name: company },
      });
    }

    // Update WorkspaceSettings timezone if provided
    if (timezone && updatedUser.workspaceId) {
      await prisma.workspaceSetting.upsert({
        where: { workspaceId: updatedUser.workspaceId },
        update: { timezone },
        create: {
          workspaceId: updatedUser.workspaceId,
          timezone,
        },
      });
    }

    // Fetch updated user with changes
    const finalUser = await AuthRepository.findById(userId);
    const { password, refreshToken, ...userData } = finalUser!;

    return userData;
  }
}
