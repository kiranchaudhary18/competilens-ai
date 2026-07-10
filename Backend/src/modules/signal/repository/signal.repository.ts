import prisma from "../../../config/db";
import { SignalStatus, SignalSeverity, SignalType, Prisma } from "@prisma/client";

export class SignalRepository {
  public static async create(workspaceId: string, data: any) {
    const {
      competitorId,
      type,
      title,
      summary,
      url,
      source,
      status,
      publishedAt,
      severity,
      metadata,
      attachments, // array of { fileUrl, fileType }
    } = data;

    return prisma.signal.create({
      data: {
        workspaceId,
        competitorId,
        type,
        title,
        summary,
        url,
        source,
        status: status || SignalStatus.NEW,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        severity: severity || SignalSeverity.LOW,
        metadata: metadata || undefined,
        attachments: attachments ? {
          createMany: {
            data: attachments,
          },
        } : undefined,
      },
      include: {
        attachments: true,
        competitor: true,
      },
    });
  }

  public static async list(workspaceId: string, params: any) {
    const {
      competitorId,
      severity,
      source,
      type,
      status,
      startDate,
      endDate,
      search,
      pageSize = 10,
      cursor,
    } = params;

    const limit = parseInt(pageSize as string) || 10;

    const where: Prisma.SignalWhereInput = {
      workspaceId,
    };

    // Filters
    if (competitorId) {
      where.competitorId = competitorId;
    }
    if (severity) {
      where.severity = severity as SignalSeverity;
    }
    if (source) {
      where.source = { equals: source, mode: "insensitive" };
    }
    if (type) {
      where.type = type as SignalType;
    }
    if (status) {
      where.status = status as SignalStatus;
    }
    if (startDate || endDate) {
      where.capturedAt = {};
      if (startDate) {
        where.capturedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.capturedAt.lte = new Date(endDate);
      }
    }

    // Searching (Title, Summary, Source, Competitor Name)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { source: { contains: search, mode: "insensitive" } },
        { competitor: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const totalCount = await prisma.signal.count({ where });

    const signals = await prisma.signal.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: {
        attachments: true,
        competitor: true,
      },
    });

    let nextCursor: string | null = null;
    let paginatedSignals = signals;

    if (signals.length > limit) {
      nextCursor = signals[limit].id;
      paginatedSignals = signals.slice(0, limit);
    }

    return {
      signals: paginatedSignals,
      nextCursor,
      totalCount,
    };
  }

  public static async findById(id: string, workspaceId: string) {
    return prisma.signal.findFirst({
      where: {
        id,
        workspaceId,
      },
      include: {
        attachments: true,
        competitor: true,
      },
    });
  }

  public static async updateStatus(id: string, workspaceId: string, status: SignalStatus) {
    return prisma.signal.update({
      where: {
        id,
        workspaceId,
      },
      data: {
        status,
      },
      include: {
        attachments: true,
        competitor: true,
      },
    });
  }

  public static async getStatistics(workspaceId: string) {
    const [statusGroups, severityGroups, typeGroups, totalCount] = await Promise.all([
      prisma.signal.groupBy({
        by: ["status"],
        where: { workspaceId },
        _count: true,
      }),
      prisma.signal.groupBy({
        by: ["severity"],
        where: { workspaceId },
        _count: true,
      }),
      prisma.signal.groupBy({
        by: ["type"],
        where: { workspaceId },
        _count: true,
      }),
      prisma.signal.count({
        where: { workspaceId },
      }),
    ]);

    // Format statistics helper
    const stats = {
      total: totalCount,
      byStatus: {
        NEW: 0,
        READ: 0,
        ARCHIVED: 0,
      } as Record<string, number>,
      bySeverity: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      } as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    statusGroups.forEach((group) => {
      stats.byStatus[group.status] = group._count;
    });

    severityGroups.forEach((group) => {
      stats.bySeverity[group.severity] = group._count;
    });

    typeGroups.forEach((group) => {
      stats.byType[group.type] = group._count;
    });

    return stats;
  }
}
