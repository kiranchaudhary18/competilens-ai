import { NotificationPayload } from "../notification.types";
import prisma from "../../../config/db";

export class EmailChannel {
  /**
   * Simulated email dispatch.
   */
  public static async send(payload: NotificationPayload): Promise<void> {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        console.warn(`[EmailChannel] User ${payload.userId} not found. Skipping email.`);
        return;
      }

      console.log("==========================================");
      console.log(`[EMAIL DISPATCH] To: ${user.email}`);
      console.log(`[EMAIL DISPATCH] Subject: [CompetiLens Alert] ${payload.title}`);
      console.log(`[EMAIL DISPATCH] Message:`);
      console.log(payload.message);
      console.log(`[EMAIL DISPATCH] Severity: ${payload.severity}`);
      console.log("==========================================");
    } catch (err: any) {
      console.error("[EmailChannel] Failed to send email alert:", err.message);
    }
  }
}
