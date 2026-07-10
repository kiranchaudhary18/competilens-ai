import { HttpFetcher } from "../fetch/http-fetcher";
import crypto from "crypto";

export interface FeedItemData {
  guid: string;
  title: string;
  link: string;
  pubDate?: Date;
  contentHash: string;
}

export class RSSDiscovery {
  public static async discoverFeedItems(feedUrl: string): Promise<FeedItemData[]> {
    const items: FeedItemData[] = [];

    try {
      const res = await HttpFetcher.fetchUrl(feedUrl);
      if (res.status !== 200) return [];

      const body = res.body;

      // 1. Detect if RSS or Atom
      if (body.includes("<rss") || body.includes("<channel")) {
        // Parse RSS Items
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        while ((match = itemRegex.exec(body)) !== null) {
          const itemXml = match[1];
          const title = this.extractTagValue(itemXml, "title");
          const link = this.extractTagValue(itemXml, "link");
          const guid = this.extractTagValue(itemXml, "guid") || link;
          const pubDateStr = this.extractTagValue(itemXml, "pubDate");

          if (title && link) {
            const pubDate = pubDateStr ? new Date(pubDateStr) : undefined;
            const contentHash = crypto.createHash("sha256").update(title + link).digest("hex");

            items.push({
              guid,
              title,
              link,
              pubDate: isNaN(pubDate?.getTime() || NaN) ? undefined : pubDate,
              contentHash,
            });
          }
        }
      } else if (body.includes("<feed")) {
        // Parse Atom Entry items
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
        let match;
        while ((match = entryRegex.exec(body)) !== null) {
          const entryXml = match[1];
          const title = this.extractTagValue(entryXml, "title");
          // Atom Link parsing
          let link = "";
          const linkMatch = /<link[^>]*?href=["']([^"']+)["']/i.exec(entryXml);
          if (linkMatch) link = linkMatch[1];
          
          const guid = this.extractTagValue(entryXml, "id") || link;
          const pubDateStr = this.extractTagValue(entryXml, "updated") || this.extractTagValue(entryXml, "published");

          if (title && link) {
            const pubDate = pubDateStr ? new Date(pubDateStr) : undefined;
            const contentHash = crypto.createHash("sha256").update(title + link).digest("hex");

            items.push({
              guid,
              title,
              link,
              pubDate: isNaN(pubDate?.getTime() || NaN) ? undefined : pubDate,
              contentHash,
            });
          }
        }
      }
    } catch (err) {
      console.warn(`[RSSDiscovery] Failed to parse feed from ${feedUrl}:`, err);
    }

    return items;
  }

  private static extractTagValue(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*?>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = regex.exec(xml);
    if (!match) return "";
    
    let val = match[1].trim();
    // Strip CDATA wrapper if present
    if (val.startsWith("<![CDATA[")) {
      val = val.substring(9, val.length - 3).trim();
    }
    return val;
  }
}
