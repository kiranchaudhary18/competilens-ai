import { NotificationRepository } from "../notification.repository";
import { NotificationPayload } from "../notification.types";
import { NotificationType } from "@prisma/client";

export class InAppChannel {
  public static async send(payload: NotificationPayload): Promise<void> {
    const typeMap: Record<string, NotificationType> = {
      INFO: NotificationType.INFO,
      SUCCESS: NotificationType.SUCCESS,
      WARNING: NotificationType.WARNING,
      ERROR: NotificationType.ERROR,
    };

    await NotificationRepository.createNotification({
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: typeMap[payload.severity] || NotificationType.INFO,
    });

    console.log(`[InAppChannel] Dispatched alert to User ID: ${payload.userId}`);
  }
}
