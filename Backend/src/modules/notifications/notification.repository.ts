import prisma from "../../config/db";
import { NotificationType } from "@prisma/client";

export class NotificationRepository {
  public static async createNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
  }) {
    return prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        isRead: false,
      },
    });
  }

  public static async getUserNotifications(userId: string, limit = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  public static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  public static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  public static async deleteNotification(id: string, userId: string) {
    return prisma.notification.deleteMany({
      where: { id, userId },
    });
  }
}
