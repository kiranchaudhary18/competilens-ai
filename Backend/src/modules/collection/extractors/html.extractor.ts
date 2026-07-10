import { ExtractedPage } from "../collection.types";
import { URL } from "url";

export class HtmlExtractor {
  public static extract(html: string, pageUrl: string): ExtractedPage {
    const title = this.extractTitle(html);
    const metaDescription = this.extractMetaDescription(html);
    const canonicalUrl = this.extractCanonicalUrl(html) || pageUrl;
    const headings = this.extractHeadings(html);
    const links = this.extractLinks(html, pageUrl);

    // Clean body HTML to leave only main article/text content
    let cleanedHtml = html;

    // 1. Remove script & style tags completely
    cleanedHtml = cleanedHtml.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<!--[\s\S]*?-->/g, ""); // comments

    // 2. Remove typical navigation / footer / header elements
    cleanedHtml = cleanedHtml.replace(/<header[^>]*?>[\s\S]*?<\/header>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<footer[^>]*?>[\s\S]*?<\/footer>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<nav[^>]*?>[\s\S]*?<\/nav>/gi, "");

    // 3. Remove cookie banner containers where confidently detected
    cleanedHtml = cleanedHtml.replace(/<div[^>]*?(?:cookie|gdpr|consent|banner)[^>]*?>[\s\S]*?<\/div>/gi, "");

    // 4. Strip all HTML tags to get pure text
    let mainText = cleanedHtml.replace(/<[^>]*?>/g, " ");

    // 5. Normalize whitespace
    mainText = mainText.replace(/\s+/g, " ").trim();

    return {
      title,
      metaDescription,
      canonicalUrl,
      headings,
      mainText,
      links,
    };
  }

  private static extractTitle(html: string): string {
    const match = /<title[^>]*?>([\s\S]*?)<\/title>/i.exec(html);
    return match ? match[1].trim() : "";
  }

  private static extractMetaDescription(html: string): string {
    const match = /<meta[^>]*?name=["']description["'][^>]*?content=["']([^"']+)["']/i.exec(html) ||
                  /<meta[^>]*?content=["']([^"']+)["'][^>]*?name=["']description["']/i.exec(html);
    return match ? match[1].trim() : "";
  }

  private static extractCanonicalUrl(html: string): string {
    const match = /<link[^>]*?rel=["']canonical["'][^>]*?href=["']([^"']+)["']/i.exec(html);
    return match ? match[1].trim() : "";
  }

  private static extractHeadings(html: string): { h1: string[]; h2: string[] } {
    const h1: string[] = [];
    const h2: string[] = [];

    const h1Regex = /<h1[^>]*?>([\s\S]*?)<\/h1>/gi;
    let match;
    while ((match = h1Regex.exec(html)) !== null) {
      h1.push(match[1].replace(/<[^>]*?>/g, " ").trim());
    }

    const h2Regex = /<h2[^>]*?>([\s\S]*?)<\/h2>/gi;
    while ((match = h2Regex.exec(html)) !== null) {
      h2.push(match[1].replace(/<[^>]*?>/g, " ").trim());
    }

    return { h1, h2 };
  }

  private static extractLinks(html: string, pageUrl: string): string[] {
    const links = new Set<string>();
    const regex = /<a[^>]*?href=["']([^"']+)["']/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const href = match[1].trim();
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;

      try {
        const resolved = new URL(href, pageUrl).toString();
        links.add(resolved);
      } catch {
        // ignore malformed URLs
      }
    }

    return Array.from(links);
  }
}
