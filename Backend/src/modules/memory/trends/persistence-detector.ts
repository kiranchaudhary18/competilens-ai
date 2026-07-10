import { MemoryRepository } from "../memory.repository";
import { IngestionPolicy } from "../ingestion/ingestion-policy";

export class PersistenceDetector {
  /**
   * Evaluates if observed trends have consolidated into a long-term persistent market condition.
   */
  public static async checkPersistence(workspaceId: string, competitorId: string): Promise<void> {
    const memories = await MemoryRepository.getMemoryTimeline(workspaceId, competitorId);

    // Filter sentiment trends
    const sentimentTrends = memories.filter((m) => m.memoryType === "SENTIMENT_TREND");

    if (sentimentTrends.length >= 3) {
      const consecutiveNegative = sentimentTrends.slice(0, 3).every(
        (t) => (t.metadata?.shift || 0) < 0 || (t.metadata?.newPositiveRatio || 1) < 0.25
      );

      if (consecutiveNegative) {
        await IngestionPolicy.evaluateAndIngest({
          workspaceId,
          competitorId,
          memoryType: "MARKET_PATTERN",
          title: "Sustained Low Customer Sentiment",
          summary: "Aggregated customer feedback shows persistent negative sentiment across 3 or more consecutive checks, indicating systemic product or service delivery issues.",
          importanceScore: 0.85,
          confidenceScore: 0.9,
          observedAt: new Date(),
          evidenceIds: sentimentTrends.slice(0, 3).map((e) => e.id),
        });
      }
    }
  }
}
