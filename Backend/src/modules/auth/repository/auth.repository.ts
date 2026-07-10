import { Prisma } from "@prisma/client";
import prisma from "../../../config/db";

export class AuthRepository {
  public static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        workspace: true,
      },
    });
  }

  public static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        workspace: true,
      },
    });
  }

  public static async findByVerificationToken(token: string) {
    return prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  public static async findByRefreshToken(token: string) {
    return prisma.user.findFirst({
      where: { refreshToken: token },
      include: {
        workspace: true,
      },
    });
  }

  public static async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: {
        workspace: true,
      },
    });
  }

  public static async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        workspace: true,
      },
    });
  }
}
