import prisma from "../../../config/db";
import { PricingComparator, PricingPlanDelta } from "./pricing-comparator";
import { SentimentComparator, SentimentComparisonResult } from "./sentiment-comparator";

export class TemporalComparator {
  /**
   * Compare pricing plans between the two most recent competitor page snapshots.
   */
  public static async comparePricing(
    workspaceId: string,
    competitorId: string
  ): Promise<PricingPlanDelta[]> {
    // Get historical pricing data from competitor pricing records
    const pricingHistory = await prisma.competitorPricing.findMany({
      where: { competitorId },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    if (pricingHistory.length < 2) return [];

    // Group pricing into two periods
    const midpoint = Math.floor(pricingHistory.length / 2);
    const newPricing = pricingHistory.slice(0, midpoint).map((p) => ({
      name: p.planName,
      price: Number(p.price),
      billingPeriod: p.billingPeriod,
    }));

    const oldPricing = pricingHistory.slice(midpoint).map((p) => ({
      name: p.planName,
      price: Number(p.price),
      billingPeriod: p.billingPeriod,
    }));

    return PricingComparator.comparePlans(oldPricing, newPricing);
  }

  /**
   * Compare sentiment between two time windows (e.g., past 30 days vs previous 30 days).
   */
  public static async compareSentiment(
    workspaceId: string,
    competitorId: string
  ): Promise<SentimentComparisonResult | null> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Fetch signals in past 30 days
    const recentSignals = await prisma.signal.findMany({
      where: {
        workspaceId,
        competitorId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Fetch signals from 60 to 30 days ago
    const olderSignals = await prisma.signal.findMany({
      where: {
        workspaceId,
        competitorId,
        createdAt: { gte: sixtyDaysAgo, lte: thirtyDaysAgo },
      },
    });

    if (recentSignals.length === 0 || olderSignals.length === 0) {
      return null;
    }

    // Helper to count sentiments
    const aggregateSentiment = (signals: any[]) => {
      let positiveCount = 0;
      let neutralCount = 0;
      let negativeCount = 0;

      for (const sig of signals) {
        const sentiment = sig.metadata?.sentiment?.toLowerCase() || "neutral";
        if (sentiment === "positive") positiveCount++;
        else if (sentiment === "negative") negativeCount++;
        else neutralCount++;
      }

      return { positiveCount, neutralCount, negativeCount };
    };

    return SentimentComparator.compare(
      aggregateSentiment(olderSignals),
      aggregateSentiment(recentSignals)
    );
  }
}
