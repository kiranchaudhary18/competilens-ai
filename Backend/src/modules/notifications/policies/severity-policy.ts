import { NotificationChannel, NotificationPayload } from "../notification.types";

export class SeverityPolicy {
  /**
   * Determine allowed delivery channels based on notification severity.
   */
  public static getTargetChannels(payload: NotificationPayload): NotificationChannel[] {
    const channels: NotificationChannel[] = ["IN_APP"];

    // Only send email for critical security alerts, pricing adjustments, or strategic threats
    if (
      payload.severity === "ERROR" || 
      payload.event === "PRICING_CHANGE" || 
      payload.event === "STRATEGIC_THREAT" || 
      payload.event === "SECURITY_ALERT"
    ) {
      channels.push("EMAIL");
    }

    return channels;
  }
}
