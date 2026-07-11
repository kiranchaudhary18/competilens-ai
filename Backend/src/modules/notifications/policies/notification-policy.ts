import prisma from "../../../config/db";
import { NotificationPayload } from "../notification.types";

export class NotificationPolicy {
  /**
   * Evaluates user/workspace preferences to see if the notification is permitted.
   */
  public static async isAllowed(payload: NotificationPayload): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) return false;

      const memberships = await prisma.workspaceMember.findMany({
        where: { userId: payload.userId },
        include: {
          workspace: {
            include: { settings: true },
          },
        },
      });

      // Check if user has global workspace notifications enabled
      const defaultSetting = memberships.find((m) => m.workspace?.settings?.notificationsEnabled);
      if (defaultSetting && !defaultSetting.workspace.settings?.notificationsEnabled) {
        console.log(`[NotificationPolicy] Alerts disabled for user's workspace settings. Suppressing.`);
        return false;
      }

      return true;
    } catch (err) {
      console.error("[NotificationPolicy] Preferences evaluation failed:", err);
      return true; // fail open to avoid losing alerts
    }
  }
}
