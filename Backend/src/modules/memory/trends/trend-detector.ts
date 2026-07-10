import { MemoryRepository } from "../memory.repository";
import { TemporalComparator } from "../comparison/temporal-comparator";
import prisma from "../../../config/db";

export class TrendDetector {
  /**
   * Evaluates competitor metrics to discover and update active historical trends.
   */
  public static async analyzeTrends(workspaceId: string, competitorId: string): Promise<void> {
    // 1. Process Pricing Trends
    const priceDeltas = await TemporalComparator.comparePricing(workspaceId, competitorId);
    const activePricingDeltas = priceDeltas.filter((d) => d.changeType !== "NO_CHANGE");

    if (activePricingDeltas.length > 0) {
      // Find or create pricing trend
      let trend = await prisma.historicalTrend.findFirst({
        where: { workspaceId, competitorId, trendType: "PRICING", status: "ACTIVE" },
      });

      if (!trend) {
        trend = await MemoryRepository.createHistoricalTrend({
          workspaceId,
          competitorId,
          trendType: "PRICING",
          name: "Pricing adjustments & plans evolution",
          summary: "Tracks evolution and fluctuations in billing models.",
          status: "ACTIVE",
        });
      }

      // Add observation
      await MemoryRepository.addTrendObservation({
        trendId: trend.id,
        value: { deltas: activePricingDeltas },
        observedAt: new Date(),
        evidenceIds: [],
      });
    }

    // 2. Process Sentiment Trends
    const sentimentShift = await TemporalComparator.compareSentiment(workspaceId, competitorId);
    if (sentimentShift && Math.abs(sentimentShift.shift) > 0.15) {
      let trend = await prisma.historicalTrend.findFirst({
        where: { workspaceId, competitorId, trendType: "SENTIMENT", status: "ACTIVE" },
      });

      if (!trend) {
        trend = await MemoryRepository.createHistoricalTrend({
          workspaceId,
          competitorId,
          trendType: "SENTIMENT",
          name: "Sustained sentiment shift",
          summary: "Tracks public/media sentiment fluctuations.",
          status: "ACTIVE",
        });
      }

      await MemoryRepository.addTrendObservation({
        trendId: trend.id,
        value: sentimentShift,
        observedAt: new Date(),
        evidenceIds: [],
      });
    }
  }
}
