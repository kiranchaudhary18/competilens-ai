import { MemoryRepository } from "../memory.repository";
import { RelevanceRanker, RankableMemory } from "./relevance-ranker";

export class MemoryRetriever {
  /**
   * Retrieve relevant historical memories for context injection.
   */
  public static async retrieve(params: {
    workspaceId: string;
    competitorId: string;
    keywords?: string[];
    limit?: number;
  }): Promise<RankableMemory[]> {
    const { workspaceId, competitorId, keywords = [], limit = 15 } = params;
    const startTime = Date.now();

    // Fetch memory records
    const rawMemories = await MemoryRepository.getMemoryRecords(
      workspaceId,
      competitorId,
      undefined,
      100 // pull a larger candidate pool to rank
    );

    const rankable: RankableMemory[] = rawMemories.map((m) => ({
      id: m.id,
      memoryType: m.memoryType,
      title: m.title,
      summary: m.summary,
      importanceScore: m.importanceScore,
      confidenceScore: m.confidenceScore,
      observedAt: m.observedAt,
      metadata: m.metadata || {},
    }));

    // Rank by relevance
    const ranked = RelevanceRanker.rank(rankable, keywords);

    // Record retrieval metrics
    const duration = Date.now() - startTime;
    await MemoryRepository.logRetrieval(workspaceId, "CONTEXT_INJECTION", ranked.length, duration).catch(
      (err) => console.error("[MemoryRetriever] Failed to log retrieval metrics:", err.message)
    );

    return ranked.slice(0, limit);
  }
}
