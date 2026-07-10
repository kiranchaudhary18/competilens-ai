import { RankableMemory } from "./relevance-ranker";

export class MemoryContextBuilder {
  /**
   * Compiles retrieved memories into a safe prompt context block.
   */
  public static buildPromptBlock(memories: RankableMemory[]): string {
    if (memories.length === 0) {
      return "No historical context or trends available.";
    }

    const lines: string[] = [
      "=== HISTORICAL INTELLIGENCE & PATTERNS (Hindsight Memory) ===",
      "Use this historical context to detect trends, pricing movements, or pattern repetitions over time.",
      "Every claim referring to these must cite the Memory ID and its original Evidence IDs.",
      "",
    ];

    memories.forEach((mem, index) => {
      // Sanitize inputs to prevent prompt injection inside memory summary
      const cleanTitle = mem.title.replace(/[\{\}\[\]]/g, "");
      const cleanSummary = mem.summary.replace(/[\{\}\[\]]/g, "");

      lines.push(`Memory [Index: ${index} | ID: ${mem.id}]`);
      lines.push(`- Type: ${mem.memoryType}`);
      lines.push(`- Title: ${cleanTitle}`);
      lines.push(`- Observed Date: ${mem.observedAt.toISOString()}`);
      lines.push(`- Significance (0-1): ${mem.importanceScore}`);
      lines.push(`- Confidence (0-1): ${mem.confidenceScore}`);
      lines.push(`- Summary: ${cleanSummary}`);
      if (mem.metadata?.evidenceIds && mem.metadata.evidenceIds.length > 0) {
        lines.push(`- Original Evidence IDs: ${mem.metadata.evidenceIds.join(", ")}`);
      }
      lines.push("");
    });

    return lines.join("\n");
  }
}
