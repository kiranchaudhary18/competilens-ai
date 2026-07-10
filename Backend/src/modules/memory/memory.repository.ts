import prisma from "../../config/db";
import { MemoryRecordData, MemoryLinkData, HistoricalTrendData, TrendObservationData } from "./memory.types";

export class MemoryRepository {
  public static async createMemoryRecord(data: MemoryRecordData) {
    return prisma.memoryRecord.create({
      data: {
        workspaceId: data.workspaceId,
        competitorId: data.competitorId,
        memoryType: data.memoryType,
        title: data.title,
        summary: data.summary,
        importanceScore: data.importanceScore,
        confidenceScore: data.confidenceScore,
        observedAt: data.observedAt,
        evidenceIds: data.evidenceIds,
        metadata: data.metadata || {},
      },
    });
  }

  public static async getMemoryRecordById(id: string) {
    return prisma.memoryRecord.findUnique({
      where: { id },
      include: {
        linksFrom: true,
        linksTo: true,
      },
    });
  }

  public static async linkMemoryRecords(fromId: string, toId: string, linkType: "DUP" | "CAUSAL" | "SEQUENCE" | "RELATED") {
    return prisma.memoryLink.upsert({
      where: {
        fromId_toId_linkType: {
          fromId,
          toId,
          linkType,
        },
      },
      create: {
        fromId,
        toId,
        linkType,
      },
      update: {},
    });
  }

  public static async createHistoricalTrend(data: HistoricalTrendData) {
    return prisma.historicalTrend.create({
      data: {
        workspaceId: data.workspaceId,
        competitorId: data.competitorId,
        trendType: data.trendType,
        name: data.name,
        summary: data.summary,
        status: data.status,
      },
    });
  }

  public static async addTrendObservation(data: TrendObservationData) {
    return prisma.trendObservation.create({
      data: {
        trendId: data.trendId,
        value: data.value || {},
        observedAt: data.observedAt,
        evidenceIds: data.evidenceIds,
      },
    });
  }

  public static async getMemoryRecords(workspaceId: string, competitorId?: string, memoryType?: string, limit = 50) {
    return prisma.memoryRecord.findMany({
      where: {
        workspaceId,
        ...(competitorId ? { competitorId } : {}),
        ...(memoryType ? { memoryType } : {}),
      },
      orderBy: { observedAt: "desc" },
      take: limit,
    });
  }

  public static async getMemoryTimeline(
    workspaceId: string,
    competitorId: string,
    startDate?: Date,
    endDate?: Date,
    types?: string[]
  ) {
    return prisma.memoryRecord.findMany({
      where: {
        workspaceId,
        competitorId,
        observedAt: {
          ...(startDate ? { gte: startDate } : {}),
          ...(endDate ? { lte: endDate } : {}),
        },
        ...(types && types.length > 0 ? { memoryType: { in: types } } : {}),
      },
      orderBy: { observedAt: "desc" },
    });
  }

  public static async getHistoricalTrends(workspaceId: string, competitorId: string, trendType?: "PRICING" | "SENTIMENT" | "FEATURE_RECURRENCE") {
    return prisma.historicalTrend.findMany({
      where: {
        workspaceId,
        competitorId,
        ...(trendType ? { trendType } : {}),
      },
      include: {
        observations: { orderBy: { observedAt: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  public static async logRetrieval(workspaceId: string, queryType: string, count: number, latencyMs: number) {
    return prisma.memoryRetrievalLog.create({
      data: {
        workspaceId,
        queryType,
        resultsCount: count,
        latencyMs,
      },
    });
  }
}
