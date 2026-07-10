export type NotificationEvent =
  | "ANALYSIS_COMPLETED"
  | "REPORT_READY"
  | "CRITICAL_CHANGE"
  | "PRICING_CHANGE"
  | "SENTIMENT_SURGE"
  | "SECURITY_ALERT"
  | "STRATEGIC_THREAT"
  | "COLLECTION_FAILURE"
  | "SYSTEM";

export type NotificationChannel = "IN_APP" | "EMAIL";

export interface NotificationPayload {
  userId: string;
  event: NotificationEvent;
  title: string;
  message: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  metadata?: any;
}
