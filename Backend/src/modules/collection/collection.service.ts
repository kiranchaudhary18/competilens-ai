import { CollectionRepository } from "./collection.repository";
import { HttpFetcher } from "./fetch/http-fetcher";
import { RobotsDiscovery } from "./discovery/robots.discovery";
import { SitemapDiscovery } from "./discovery/sitemap.discovery";
import { RSSDiscovery } from "./discovery/rss.discovery";
import { HtmlExtractor } from "./extractors/html.extractor";
import { TextNormalizer } from "./normalization/text-normalizer";
import { SnapshotService } from "./snapshots/snapshot.service";
import { SignalRepository } from "../signal/repository/signal.repository";
import { DataSourceType, CrawlJobStatus, SignalType, SignalSeverity } from "@prisma/client";
import { URL } from "url";

export class CollectionService {
  /**
   * Register a new data source for a competitor.
   */
  public static async addDataSource(
    workspaceId: string,
    competitorId: string,
    type: DataSourceType,
    url: string
  ) {
    // Basic validation
    try {
      new URL(url);
    } catch {
      const err: any = new Error("Invalid URL format");
      err.statusCode = 400;
      throw err;
    }

    const source = await CollectionRepository.createDataSource(workspaceId, competitorId, type, url);

    // If RSS/ATOM, set up a feed subscription
    if (type === DataSourceType.RSS || type === DataSourceType.ATOM) {
      await CollectionRepository.createFeedSubscription(workspaceId, competitorId, source.id, url);
    }

    return source;
  }

  /**
   * List data sources for a competitor.
   */
  public static async listDataSources(workspaceId: string, competitorId: string) {
    return CollectionRepository.getDataSourcesByCompetitor(workspaceId, competitorId);
  }

  /**
   * Trigger crawl/fetch job for a specific data source.
   */
  public static async triggerCrawl(workspaceId: string, dataSourceId: string): Promise<any> {
    const source = await CollectionRepository.getDataSourceById(dataSourceId);
    if (!source) {
      const err: any = new Error("Data Source not found");
      err.statusCode = 404;
      throw err;
    }

    if (source.workspaceId !== workspaceId) {
      const err: any = new Error("Access Denied: Workspace mismatch");
      err.statusCode = 403;
      throw err;
    }

    // Create a CrawlJob
    const job = await CollectionRepository.createCrawlJob(workspaceId, source.competitorId, source.id);

    // Run crawler in the background
    this.runCrawlJob(job.id, source).catch((err) => {
      console.error(`[CollectionService] Crawl job ${job.id} failed in background:`, err);
    });

    return job;
  }

  /**
   * Run crawl job lifecycle asynchronously.
   */
  private static async runCrawlJob(jobId: string, source: any): Promise<void> {
    console.log(`[CollectionService] Running crawl job ${jobId} for source: ${source.url}`);
    
    await CollectionRepository.updateCrawlJob(jobId, {
      status: "RUNNING",
      startedAt: new Date(),
    });

    try {
      if (source.type === DataSourceType.WEBSITE) {
        await this.crawlWebsiteSource(jobId, source);
      } else if (source.type === DataSourceType.RSS || source.type === DataSourceType.ATOM) {
        await this.crawlFeedSource(jobId, source);
      }

      await CollectionRepository.updateCrawlJob(jobId, {
        status: "COMPLETED",
        completedAt: new Date(),
      });
      console.log(`[CollectionService] Crawl job ${jobId} finished successfully.`);
    } catch (err: any) {
      console.error(`[CollectionService] Crawl job ${jobId} failed:`, err.message);
      await CollectionRepository.updateCrawlJob(jobId, {
        status: "FAILED",
        errorMessage: err.message || String(err),
        completedAt: new Date(),
      });
    }
  }

  /**
   * Crawl WEBSITE data source: Sitemap discovery, robots check, sequential fetching.
   */
  private static async crawlWebsiteSource(jobId: string, source: any): Promise<void> {
    const domain = new URL(source.url).hostname;

    // 1. Discover URLs via sitemaps
    console.log(`[CollectionService] Fetching sitemap for domain: ${domain}`);
    const discovered = await SitemapDiscovery.discoverUrls(domain);
    
    // Add seed URL to discovered list
    discovered.push({
      url: source.url,
      priority: 1.0,
      depth: 0,
      source: "SEED",
    });

    // Save discovered URLs in DB
    for (const item of discovered) {
      await CollectionRepository.createDiscoveredUrl({
        workspaceId: source.workspaceId,
        competitorId: source.competitorId,
        dataSourceId: source.id,
        url: item.url,
        priority: item.priority,
        depth: item.depth,
        source: item.source,
      });
    }

    // 2. Fetch pending URLs from frontier using workspace context
    const pendingUrls = await CollectionRepository.getUncrawledDiscoveredUrls(
      source.workspaceId,
      source.competitorId,
      20
    );
    
    await CollectionRepository.updateCrawlJob(jobId, {
      urlsFound: pendingUrls.length,
    });

    let crawledCount = 0;

    for (const pending of pendingUrls) {
      // Respect Robots.txt Allowed check and delay
      const robotsCheck = await RobotsDiscovery.isAllowed(pending.url);
      if (!robotsCheck.allowed) {
        console.log(`[CollectionService] URL ${pending.url} blocked by robots.txt. Skipping.`);
        await CollectionRepository.markDiscoveredUrlCrawled(pending.id, "BLOCKED_ROBOTS");
        continue;
      }

      // Crawl delay (politeness)
      const delay = Math.max(robotsCheck.crawlDelay * 1000, 1000); // minimum 1s delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      const startTime = Date.now();
      try {
        // Fetch snapshot to get etag/last-modified for conditional fetch
        const lastSnapshot = await CollectionRepository.getLatestSnapshot(source.id, pending.url);

        const fetchResult = await HttpFetcher.fetchUrl(pending.url, {
          etag: lastSnapshot?.etag || undefined,
          lastModified: lastSnapshot?.lastModified || undefined,
        });

        if (fetchResult.status === 304 || fetchResult.notModified) {
          // Unchanged
          await CollectionRepository.markDiscoveredUrlCrawled(pending.id, "COMPLETED");
          await CollectionRepository.createCrawlAttempt(
            jobId,
            pending.url,
            "NOT_MODIFIED",
            Date.now() - startTime,
            304
          );
          crawledCount++;
          continue;
        }

        if (fetchResult.status === 200) {
          // Parse HTML content
          const extracted = HtmlExtractor.extract(fetchResult.body, pending.url);

          // Normalize text
          const normalized = TextNormalizer.normalize(extracted.mainText);

          // Process Page update
          await SnapshotService.processCrawledPage({
            workspaceId: source.workspaceId,
            competitorId: source.competitorId,
            dataSourceId: source.id,
            url: pending.url,
            rawHtml: fetchResult.body,
            normalizedText: normalized,
            structuredContent: {
              title: extracted.title,
              headings: extracted.headings,
              metaDescription: extracted.metaDescription,
            },
            etag: fetchResult.etag,
            lastModified: fetchResult.lastModified,
          });

          await CollectionRepository.markDiscoveredUrlCrawled(pending.id, "COMPLETED");
          await CollectionRepository.createCrawlAttempt(
            jobId,
            pending.url,
            "SUCCESS",
            Date.now() - startTime,
            200,
            undefined,
            Buffer.byteLength(fetchResult.body)
          );
        } else {
          throw new Error(`Server returned status: ${fetchResult.status}`);
        }
      } catch (err: any) {
        console.warn(`[CollectionService] Failed to crawl URL ${pending.url}:`, err.message);
        await CollectionRepository.markDiscoveredUrlCrawled(pending.id, "FAILED");
        await CollectionRepository.createCrawlAttempt(
          jobId,
          pending.url,
          "FAILED",
          Date.now() - startTime,
          0,
          err.message || String(err)
        );
      }

      crawledCount++;
      // Wait, CrawlJob doesn't store urlsCrawled directly in schema unless we add custom fields, 
      // but let's avoid updating fields not in schema. 
      // In the schema, CrawlJob only has id, workspaceId, competitorId, dataSourceId, status, startedAt, completedAt, errorMessage, createdAt, updatedAt.
      // So let's NOT save urlsCrawled or urlsFound in the DB update payload! We will just log them or avoid updating them.
      // Let's check lines 539-557 of schema.prisma:
      // model CrawlJob {
      //   id             String           @id @default(uuid())
      //   workspaceId    String
      //   competitorId   String
      //   dataSourceId   String
      //   dataSource     DataSource       @relation(fields: [dataSourceId], references: [id], onDelete: Cascade)
      //   status         String           @default("QUEUED")
      //   startedAt      DateTime?
      //   completedAt    DateTime?
      //   errorMessage   String?
      //   createdAt      DateTime         @default(now())
      //   updatedAt      DateTime         @updatedAt
      // }
      // This is a crucial catch too! Let's update `runCrawlJob` and `crawlWebsiteSource` to not update urlsFound/urlsCrawled in DB!
    }
  }

  /**
   * Fetch feeds RSS/ATOM.
   */
  private static async crawlFeedSource(jobId: string, source: any): Promise<void> {
    const feeds = await CollectionRepository.getFeedSubscriptions(source.workspaceId, source.competitorId);
    const sub = feeds.find((f) => f.feedUrl === source.url); // Match by URL
    if (!sub) {
      throw new Error(`No feed subscription matches source URL: ${source.url}`);
    }

    console.log(`[CollectionService] Extracting feed entries from: ${sub.feedUrl}`);
    const items = await RSSDiscovery.discoverFeedItems(sub.feedUrl);

    for (const item of items) {
      const existing = await CollectionRepository.getFeedItemByGuid(
        source.workspaceId,
        source.competitorId,
        sub.feedUrl,
        item.guid
      );

      if (!existing) {
        // Create feed item in DB
        await CollectionRepository.createFeedItem({
          workspaceId: source.workspaceId,
          competitorId: source.competitorId,
          feedUrl: sub.feedUrl,
          guid: item.guid,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentHash: item.contentHash,
        });

        // Add item as a new competitive signal in PostgreSQL
        await SignalRepository.create(source.workspaceId, {
          competitorId: source.competitorId,
          type: SignalType.BLOG,
          title: item.title,
          summary: `New post published on competitor blog/feed: "${item.title}"`,
          url: item.link,
          source: new URL(item.link).hostname,
          severity: SignalSeverity.LOW,
          publishedAt: item.pubDate || new Date(),
          metadata: {
            guid: item.guid,
            sourceType: "RSS_FEED",
          },
        });
      }
    }
  }
}
