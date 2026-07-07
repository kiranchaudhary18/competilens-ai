import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";
import { registerSchema, loginSchema, updateProfileSchema } from "../validation/auth.validation";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class AuthController {
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);

      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, AuthController.COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get refresh token from cookie or request body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token missing",
          data: null,
        });
        return;
      }

      const result = await AuthService.refresh(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== "string") {
        res.status(400).json({
          success: false,
          message: "Verification token is required",
          data: null,
        });
        return;
      }

      const result = await AuthService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (userId) {
        await AuthService.logout(userId);
      }

      // Clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(200).json({
        success: true,
        message: "Logout successful",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null,
        });
        return;
      }

      const user = await AuthService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        message: "Current user retrieved successfully",
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null,
        });
        return;
      }

      const validatedData = updateProfileSchema.parse(req.body);
      const user = await AuthService.updateProfile(userId, validatedData);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}
