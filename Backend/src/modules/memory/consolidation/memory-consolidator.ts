import { DuplicateMerger } from "./duplicate-merger";
import { RecurrenceDetector } from "../trends/recurrence-detector";
import { PersistenceDetector } from "../trends/persistence-detector";
import { TrendDetector } from "../trends/trend-detector";

export class MemoryConsolidator {
  /**
   * Consolidation pipeline that aggregates signals, updates trends, groups duplicates,
   * and identifies recurrence patterns.
   */
  public static async consolidate(workspaceId: string, competitorId: string): Promise<void> {
    console.log(`[MemoryConsolidator] Running memory consolidation for competitor: ${competitorId}`);
    try {
      // 1. Analyze and record new historical trends
      await TrendDetector.analyzeTrends(workspaceId, competitorId);

      // 2. Identify and link duplicates
      await DuplicateMerger.mergeDuplicates(workspaceId, competitorId);

      // 3. Assess recurring events
      await RecurrenceDetector.detectRecurrence(workspaceId, competitorId);

      // 4. Assess persistence of negative / pricing patterns
      await PersistenceDetector.checkPersistence(workspaceId, competitorId);

      console.log(`[MemoryConsolidator] Memory consolidation completed for competitor: ${competitorId}`);
    } catch (err: any) {
      console.error(`[MemoryConsolidator] Consolidation failed:`, err.message);
    }
  }
}
