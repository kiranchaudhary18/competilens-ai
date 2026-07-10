export interface TimelineEvent {
  id: string;
  type: string; // SNAPSHOT, SIGNAL, PRICING, SENTIMENT, etc.
  title: string;
  description: string;
  timestamp: Date;
  importance: number;
  confidence: number;
  evidenceIds: string[];
  metadata: any;
}

export class TimelineBuilder {
  /**
   * Aggregate various elements into a unified timeline.
   */
  public static build(params: {
    memories: any[];
    signals: any[];
    snapshots: any[];
  }): TimelineEvent[] {
    const events: TimelineEvent[] = [];

    // 1. Process Memory Records
    for (const mem of params.memories) {
      events.push({
        id: mem.id,
        type: mem.memoryType,
        title: mem.title,
        description: mem.summary,
        timestamp: mem.observedAt,
        importance: mem.importanceScore,
        confidence: mem.confidenceScore,
        evidenceIds: mem.evidenceIds,
        metadata: mem.metadata || {},
      });
    }

    // 2. Process Signals (if they aren't already captured in memory)
    const existingSignalIds = new Set(
      params.memories.flatMap((m) => m.evidenceIds)
    );

    for (const sig of params.signals) {
      if (existingSignalIds.has(sig.id)) continue;
      events.push({
        id: sig.id,
        type: "RAW_SIGNAL",
        title: sig.title,
        description: sig.summary,
        timestamp: sig.publishedAt || sig.createdAt,
        importance: sig.severity === "CRITICAL" ? 0.9 : sig.severity === "HIGH" ? 0.7 : 0.4,
        confidence: 0.85,
        evidenceIds: [sig.id],
        metadata: {
          source: sig.source,
          type: sig.type,
          severity: sig.severity,
        },
      });
    }

    // 3. Sort chronologically (newest first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
