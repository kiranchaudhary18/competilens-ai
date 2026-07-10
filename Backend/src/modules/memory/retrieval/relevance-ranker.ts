import { MemoryType } from "../memory.types";

export interface RankableMemory {
  id: string;
  memoryType: string;
  title: string;
  summary: string;
  importanceScore: number;
  confidenceScore: number;
  observedAt: Date;
  metadata: any;
}

export class RelevanceRanker {
  /**
   * Ranks retrieved memory records based on relevance factors.
   */
  public static rank(
    memories: RankableMemory[],
    queryKeywords: string[] = []
  ): RankableMemory[] {
    const scored = memories.map((mem) => {
      let score = 0;

      // 1. Core significance factors
      score += mem.importanceScore * 1.5;
      score += mem.confidenceScore * 1.0;

      // 2. Recency decay (past month gets boost, decays over time)
      const daysOld = (Date.now() - mem.observedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld <= 30) {
        score += 1.0; // highly recent
      } else if (daysOld <= 90) {
        score += 0.5;
      } else if (daysOld <= 180) {
        score += 0.2;
      }

      // 3. Keyword matching (e.g. "pricing", "plans", plan names)
      if (queryKeywords.length > 0) {
        const text = `${mem.title} ${mem.summary}`.toLowerCase();
        let matchCount = 0;
        for (const word of queryKeywords) {
          if (text.includes(word.toLowerCase())) {
            matchCount++;
          }
        }
        score += matchCount * 0.8;
      }

      return { mem, score };
    });

    // Sort descending by score
    return scored.sort((a, b) => b.score - a.score).map((s) => s.mem);
  }
}
