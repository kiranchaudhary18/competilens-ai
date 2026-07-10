export interface SentimentComparisonResult {
  oldPositiveRatio: number;
  newPositiveRatio: number;
  oldNegativeRatio: number;
  newNegativeRatio: number;
  shift: number; // positive ratio change
  volume: number; // total size
  sentimentState: "IMPROVED" | "DEGRADED" | "STABLE";
}

export class SentimentComparator {
  /**
   * Compares average sentiment metrics across two epochs.
   */
  public static compare(
    oldMetrics: { positiveCount: number; neutralCount: number; negativeCount: number },
    newMetrics: { positiveCount: number; neutralCount: number; negativeCount: number }
  ): SentimentComparisonResult {
    const oldTotal = oldMetrics.positiveCount + oldMetrics.neutralCount + oldMetrics.negativeCount;
    const newTotal = newMetrics.positiveCount + newMetrics.neutralCount + newMetrics.negativeCount;

    const oldPosRatio = oldTotal > 0 ? oldMetrics.positiveCount / oldTotal : 0;
    const oldNegRatio = oldTotal > 0 ? oldMetrics.negativeCount / oldTotal : 0;

    const newPosRatio = newTotal > 0 ? newMetrics.positiveCount / newTotal : 0;
    const newNegRatio = newTotal > 0 ? newMetrics.negativeCount / newTotal : 0;

    const shift = newPosRatio - oldPosRatio;
    let sentimentState: "IMPROVED" | "DEGRADED" | "STABLE" = "STABLE";

    if (shift > 0.1) sentimentState = "IMPROVED";
    if (shift < -0.1) sentimentState = "DEGRADED";

    return {
      oldPositiveRatio: oldPosRatio,
      newPositiveRatio: newPosRatio,
      oldNegativeRatio: oldNegRatio,
      newNegativeRatio: newNegRatio,
      shift,
      volume: newTotal,
      sentimentState,
    };
  }
}
