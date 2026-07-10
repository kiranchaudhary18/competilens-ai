import { HttpFetcher } from "../fetch/http-fetcher";
import { DiscoveredPage } from "../collection.types";
import { URL } from "url";

export class SitemapDiscovery {
  private static MAX_SITEMAPS = 10; // Protect against recursive loops
  private static MAX_URLS = 1000;

  public static async discoverUrls(domain: string): Promise<DiscoveredPage[]> {
    const urls: DiscoveredPage[] = [];
    const visitedSitemaps = new Set<string>();
    const queue: string[] = [`https://${domain}/sitemap.xml`];

    let sitemapCount = 0;

    while (queue.length > 0 && sitemapCount < this.MAX_SITEMAPS && urls.length < this.MAX_URLS) {
      const currentSitemapUrl = queue.shift()!;
      if (visitedSitemaps.has(currentSitemapUrl)) continue;

      visitedSitemaps.add(currentSitemapUrl);
      sitemapCount++;

      try {
        const res = await HttpFetcher.fetchUrl(currentSitemapUrl);
        if (res.status !== 200) continue;

        const body = res.body;

        // 1. Detect nested sitemaps
        const sitemapLocs = this.extractXmlLocations(body, "sitemap");
        for (const loc of sitemapLocs) {
          if (!visitedSitemaps.has(loc)) {
            queue.push(loc);
          }
        }

        // 2. Detect page URLs
        const urlLocs = this.extractXmlLocations(body, "url");
        for (const loc of urlLocs) {
          if (urls.length >= this.MAX_URLS) break;
          
          // Verify URL belongs to the target domain
          try {
            const parsedLoc = new URL(loc);
            const parsedDomain = parsedLoc.hostname.replace("www.", "");
            const targetDomain = domain.replace("www.", "");

            if (parsedDomain === targetDomain) {
              urls.push({
                url: loc,
                priority: 0.8, // Priority boost for sitemap-listed pages
                depth: 1,
                source: "SITEMAP",
              });
            }
          } catch {
            // Ignore malformed url
          }
        }
      } catch (err) {
        console.warn(`[SitemapDiscovery] Failed to crawl sitemap ${currentSitemapUrl}:`, err);
      }
    }

    return urls;
  }

  private static extractXmlLocations(xml: string, tag: "sitemap" | "url"): string[] {
    const locs: string[] = [];
    // Matches: <loc>http://...</loc> or <loc><![CDATA[http://...]]></loc>
    // inside <sitemap>...</sitemap> or <url>...</url>
    const elementRegex = new RegExp(`<${tag}>[\\s\\S]*?<loc>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/loc>[\\s\\S]*?<\\/${tag}>|<${tag}>[\\s\\S]*?<loc>\\s*([^\\s<]+)\\s*<\\/loc>[\\s\\S]*?<\\/${tag}>`, "gi");

    let match;
    while ((match = elementRegex.exec(xml)) !== null) {
      const url = match[1] || match[2];
      if (url) {
        locs.push(url.trim());
      }
    }

    return locs;
  }
}
