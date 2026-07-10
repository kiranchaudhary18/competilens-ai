import { MemoryRepository } from "../memory.repository";
import { IngestionPolicy } from "../ingestion/ingestion-policy";

export class RecurrenceDetector {
  /**
   * Scans memory timeline to detect recurring events (e.g. repeated pricing changes, recurring product launches).
   */
  public static async detectRecurrence(workspaceId: string, competitorId: string): Promise<void> {
    const memories = await MemoryRepository.getMemoryTimeline(workspaceId, competitorId);

    // 1. Detect Repeated Pricing Adjustments
    const pricingEvents = memories.filter((m) => m.memoryType === "PRICING_EVENT");
    if (pricingEvents.length >= 3) {
      // Check if they happened recently (e.g., within past 12 months)
      const oldest = pricingEvents[pricingEvents.length - 1].observedAt;
      const newest = pricingEvents[0].observedAt;
      const diffMonths = (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (diffMonths <= 12) {
        // Trigger high recurrence alert
        await IngestionPolicy.evaluateAndIngest({
          workspaceId,
          competitorId,
          memoryType: "MARKET_PATTERN",
          title: "Repeated Pricing Hikes",
          summary: `Competitor pricing was updated ${pricingEvents.length} times within a ${Math.round(diffMonths)} month period, indicating active monetization adjustments.`,
          importanceScore: 0.8,
          confidenceScore: 0.95,
          observedAt: new Date(),
          evidenceIds: pricingEvents.map((e) => e.id),
        });
      }
    }

    // 2. Detect Recurring Sentiment Swings
    const sentimentTrends = memories.filter((m) => m.memoryType === "SENTIMENT_TREND");
    const negativeSentimentTrends = sentimentTrends.filter((t) => t.metadata?.shift < -0.1);
    if (negativeSentimentTrends.length >= 2) {
      await IngestionPolicy.evaluateAndIngest({
        workspaceId,
        competitorId,
        memoryType: "MARKET_PATTERN",
        title: "Recurring Sentiment Degradations",
        summary: `Competitor suffered multiple distinct drops in customer sentiment, showing potential stability or pricing friction points.`,
        importanceScore: 0.75,
        confidenceScore: 0.9,
        observedAt: new Date(),
        evidenceIds: negativeSentimentTrends.map((e) => e.id),
      });
    }
  }
}
