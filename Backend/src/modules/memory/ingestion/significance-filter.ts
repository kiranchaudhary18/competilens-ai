import { SignalSeverity, SignalType } from "@prisma/client";
import { MemoryType } from "../memory.types";

export class SignificanceFilter {
  /**
   * Evaluates if a raw input event is significant enough to store in long-term AI memory.
   */
  public static shouldIngest(params: {
    type: MemoryType;
    severity?: string;
    confidence?: number;
    title: string;
    metadata?: any;
  }): { eligible: boolean; reason: string } {
    const { type, severity, confidence = 1.0, title, metadata } = params;

    // 1. Trivial noise and boilerplate updates rejection
    if (
      title.toLowerCase().includes("cookie banner") ||
      title.toLowerCase().includes("session update") ||
      title.toLowerCase().includes("navigation change")
    ) {
      return { eligible: false, reason: "Trivial boilerplate update filtered out." };
    }

    // 2. Reject extremely low confidence inputs
    if (confidence < 0.7) {
      return { eligible: false, reason: `Low confidence score (${confidence}) below threshold.` };
    }

    switch (type) {
      case "PRICING_EVENT":
        // Pricing updates are always highly significant
        return { eligible: true, reason: "Pricing events are high priority." };

      case "SIGNAL":
        // Ingest only high severity or pricing/product signals
        if (severity === SignalSeverity.HIGH || severity === SignalSeverity.CRITICAL) {
          return { eligible: true, reason: `High signal severity: ${severity}.` };
        }
        if (metadata?.type === SignalType.PRICING || metadata?.type === SignalType.PRODUCT) {
          return { eligible: true, reason: `Significant signal category: ${metadata.type}.` };
        }
        return { eligible: false, reason: `Signal severity (${severity}) is too low.` };

      case "CHANGE_EVENT":
        if (severity === "HIGH" || severity === "CRITICAL" || severity === "MEDIUM") {
          return { eligible: true, reason: `Significant change event severity: ${severity}.` };
        }
        return { eligible: false, reason: `Change event severity (${severity}) is below MEDIUM.` };

      case "SENTIMENT_TREND":
        const volume = metadata?.volume || 0;
        const shift = Math.abs(metadata?.shift || 0);
        if (volume >= 5 && shift >= 0.15) {
          return { eligible: true, reason: `Significant sentiment shift of ${Math.round(shift * 100)}% over ${volume} signals.` };
        }
        return { eligible: false, reason: "Sentiment change/volume not statistically significant." };

      case "STRATEGIC_INSIGHT":
      case "EXECUTIVE_REPORT":
      case "USER_VALIDATED_INSIGHT":
        // Validated outcomes of AI runs or human validations are always ingested
        return { eligible: true, reason: "Validated strategic artifacts are critical memory nodes." };

      default:
        return { eligible: false, reason: `Unsupported memory ingestion type: ${type}` };
    }
  }
}
