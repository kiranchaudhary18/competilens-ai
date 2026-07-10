import { NotificationPayload, NotificationEvent } from "./notification.types";
import { DeduplicationPolicy } from "./policies/deduplication-policy";
import { NotificationPolicy } from "./policies/notification-policy";
import { SeverityPolicy } from "./policies/severity-policy";
import { InAppChannel } from "./channels/in-app.channel";
import { EmailChannel } from "./channels/email.channel";
import prisma from "../../config/db";

export class NotificationService {
  /**
   * Dispatches a notification to a specific user after checking policies.
   */
  public static async sendNotification(
    payload: NotificationPayload,
    dedupeKey?: string
  ): Promise<void> {
    const { userId, event } = payload;

    // 1. Apply Deduplication Policy
    if (DeduplicationPolicy.shouldSuppress(userId, event, dedupeKey)) {
      return;
    }

    // 2. Apply Workspace/User Preferences Check
    const allowed = await NotificationPolicy.isAllowed(payload);
    if (!allowed) {
      return;
    }

    // 3. Resolve Delivery Channels
    const channels = SeverityPolicy.getTargetChannels(payload);

    // 4. Dispatch Alert across Channels
    const promises: Promise<void>[] = [];

    if (channels.includes("IN_APP")) {
      promises.push(InAppChannel.send(payload));
    }
    if (channels.includes("EMAIL")) {
      promises.push(EmailChannel.send(payload));
    }

    await Promise.all(promises).catch((err) => {
      console.error("[NotificationService] Dispatch error occurred:", err);
    });
  }

  /**
   * Send notification alert to all active users inside a workspace.
   */
  public static async notifyWorkspace(params: {
    workspaceId: string;
    event: NotificationEvent;
    title: string;
    message: string;
    severity: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    dedupeKey?: string;
  }): Promise<void> {
    try {
      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: params.workspaceId },
      });

      const promises = members.map((member) =>
        this.sendNotification(
          {
            userId: member.userId,
            event: params.event,
            title: params.title,
            message: params.message,
            severity: params.severity,
          },
          params.dedupeKey
        )
      );

      await Promise.all(promises);
    } catch (err: any) {
      console.error("[NotificationService] Failed to notify workspace:", err.message);
    }
  }
}
