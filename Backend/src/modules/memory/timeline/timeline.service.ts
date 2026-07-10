import { MemoryRepository } from "../memory.repository";
import { TimelineBuilder, TimelineEvent } from "./timeline-builder";
import prisma from "../../../config/db";

export class TimelineService {
  /**
   * Get chronological events timeline for a competitor.
   */
  public static async getTimeline(params: {
    workspaceId: string;
    competitorId: string;
    startDate?: string;
    endDate?: string;
    types?: string[];
    minImportance?: number;
  }): Promise<TimelineEvent[]> {
    const { workspaceId, competitorId, startDate, endDate, types, minImportance = 0 } = params;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    // Fetch memory records
    const memories = await MemoryRepository.getMemoryTimeline(
      workspaceId,
      competitorId,
      start,
      end,
      types
    );

    // Filter memory records by importance
    const filteredMemories = memories.filter((m) => m.importanceScore >= minImportance);

    // Fetch signals
    const signals = await prisma.signal.findMany({
      where: {
        workspaceId,
        competitorId,
        publishedAt: {
          ...(start ? { gte: start } : {}),
          ...(end ? { lte: end } : {}),
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Build unified timeline
    const timeline = TimelineBuilder.build({
      memories: filteredMemories,
      signals,
      snapshots: [],
    });

    return timeline;
  }
}
