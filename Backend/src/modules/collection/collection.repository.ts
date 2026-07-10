import prisma from "../../config/db";
import { DataSourceType, CrawlJobStatus } from "@prisma/client";

export class CollectionRepository {
  public static async createDataSource(
    workspaceId: string,
    competitorId: string,
    type: DataSourceType,
    url: string,
    schedule = "0 0 * * *" // Default daily schedule
  ) {
    return prisma.dataSource.create({
      data: {
        workspaceId,
        competitorId,
        type,
        url,
        status: "ACTIVE",
        schedule,
        config: {},
      },
    });
  }

  public static async getDataSourcesByCompetitor(workspaceId: string, competitorId: string) {
    return prisma.dataSource.findMany({
      where: {
        workspaceId,
        competitorId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getDataSourceById(id: string) {
    return prisma.dataSource.findUnique({
      where: { id },
    });
  }

  public static async updateDataSource(id: string, data: any) {
    return prisma.dataSource.update({
      where: { id },
      data,
    });
  }

  public static async createCrawlJob(workspaceId: string, competitorId: string, dataSourceId: string) {
    return prisma.crawlJob.create({
      data: {
        workspaceId,
        competitorId,
        dataSourceId,
        status: CrawlJobStatus.QUEUED,
      },
    });
  }

  public static async updateCrawlJob(id: string, data: any) {
    return prisma.crawlJob.update({
      where: { id },
      data,
    });
  }

  public static async createCrawlAttempt(
    crawlJobId: string,
    url: string,
    status: string,
    durationMs?: number,
    httpStatus?: number,
    errorMessage?: string,
    pageSizeBytes?: number
  ) {
    return prisma.crawlAttempt.create({
      data: {
        crawlJobId,
        url,
        status,
        durationMs,
        httpStatus,
        errorMessage,
        pageSizeBytes,
      },
    });
  }

  public static async createPageSnapshot(params: {
    workspaceId: string;
    competitorId: string;
    dataSourceId: string;
    url: string;
    rawHtml: string;
    normalizedText: string;
    contentHash: string;
    structuredContent?: any;
    etag?: string;
    lastModified?: string;
    pageType?: string;
    httpStatus?: number;
  }) {
    return prisma.pageSnapshot.create({
      data: {
        workspaceId: params.workspaceId,
        competitorId: params.competitorId,
        dataSourceId: params.dataSourceId,
        url: params.url,
        rawHtml: params.rawHtml,
        normalizedText: params.normalizedText,
        contentHash: params.contentHash,
        structuredContent: params.structuredContent || {},
        etag: params.etag,
        lastModified: params.lastModified,
        pageType: params.pageType || "WEBSITE",
        httpStatus: params.httpStatus || 200,
      },
    });
  }

  public static async getLatestSnapshot(dataSourceId: string, url: string) {
    return prisma.pageSnapshot.findFirst({
      where: {
        dataSourceId,
        url,
      },
      orderBy: { capturedAt: "desc" },
    });
  }

  public static async createDiscoveredUrl(params: {
    workspaceId: string;
    competitorId: string;
    dataSourceId: string;
    url: string;
    priority?: number;
    depth?: number;
    source?: string;
  }) {
    const existing = await prisma.discoveredUrl.findFirst({
      where: {
        workspaceId: params.workspaceId,
        competitorId: params.competitorId,
        url: params.url,
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.discoveredUrl.create({
      data: {
        workspaceId: params.workspaceId,
        competitorId: params.competitorId,
        url: params.url,
        status: "PENDING",
        priority: params.priority ?? 0.5,
        depth: params.depth ?? 0,
        source: params.source ?? "CRAWLER",
      },
    });
  }

  // Note: DiscoveredUrl doesn't have a direct relation to DataSource in the schema.
  // We query pending URLs in the workspace for the competitor.
  public static async getUncrawledDiscoveredUrls(workspaceId: string, competitorId: string, limit = 50) {
    return prisma.discoveredUrl.findMany({
      where: {
        workspaceId,
        competitorId,
        status: "PENDING",
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "asc" },
      ],
      take: limit,
    });
  }

  public static async markDiscoveredUrlCrawled(id: string, status: string) {
    return prisma.discoveredUrl.update({
      where: { id },
      data: {
        status,
        lastCrawl: new Date(),
      },
    });
  }

  public static async createFeedSubscription(
    workspaceId: string,
    competitorId: string,
    dataSourceId: string,
    feedUrl: string
  ) {
    return prisma.feedSubscription.create({
      data: {
        workspaceId,
        competitorId,
        feedUrl,
      },
    });
  }

  public static async getFeedSubscriptions(workspaceId: string, competitorId: string) {
    return prisma.feedSubscription.findMany({
      where: { workspaceId, competitorId },
    });
  }

  public static async createFeedItem(params: {
    workspaceId: string;
    competitorId: string;
    feedUrl: string;
    guid: string;
    title: string;
    link: string;
    pubDate?: Date;
    contentHash: string;
  }) {
    return prisma.feedItem.create({
      data: {
        workspaceId: params.workspaceId,
        competitorId: params.competitorId,
        feedUrl: params.feedUrl,
        guid: params.guid,
        title: params.title,
        link: params.link,
        pubDate: params.pubDate,
        contentHash: params.contentHash,
      },
    });
  }

  public static async getFeedItemByGuid(workspaceId: string, competitorId: string, feedUrl: string, guid: string) {
    return prisma.feedItem.findFirst({
      where: {
        workspaceId,
        competitorId,
        feedUrl,
        guid,
      },
    });
  }
}
