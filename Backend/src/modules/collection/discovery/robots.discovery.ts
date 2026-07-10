import { HttpFetcher } from "../fetch/http-fetcher";
import { URL } from "url";

export class RobotsDiscovery {
  private static cache: Record<string, { rules: string[]; delay: number; expires: number }> = {};

  private static async getRobotsRules(domain: string): Promise<{ rules: string[]; delay: number }> {
    const cached = this.cache[domain];
    if (cached && cached.expires > Date.now()) {
      return cached;
    }

    const robotsUrl = `https://${domain}/robots.txt`;
    const rules: string[] = [];
    let crawlDelay = 0;

    try {
      const res = await HttpFetcher.fetchUrl(robotsUrl);
      if (res.status === 200) {
        const lines = res.body.split(/\r?\n/);
        let activeAgent = false;

        for (const line of lines) {
          const clean = line.trim().toLowerCase();
          if (!clean || clean.startsWith("#")) continue;

          if (clean.startsWith("user-agent:")) {
            const agent = clean.replace("user-agent:", "").trim();
            activeAgent = agent === "*" || agent === "competilensbot";
          } else if (activeAgent) {
            if (clean.startsWith("disallow:")) {
              const disallowPath = line.substring(line.indexOf(":") + 1).trim();
              if (disallowPath) rules.push(disallowPath);
            } else if (clean.startsWith("crawl-delay:")) {
              const delay = parseInt(clean.replace("crawl-delay:", "").trim(), 10);
              if (!isNaN(delay)) crawlDelay = delay;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[RobotsDiscovery] Failed to fetch robots.txt for ${domain}, proceeding with default crawl decision. Error:`, err);
    }

    // Cache rules for 6 hours
    this.cache[domain] = {
      rules,
      delay: crawlDelay,
      expires: Date.now() + 6 * 60 * 60 * 1000,
    };

    return { rules, delay: crawlDelay };
  }

  public static async isAllowed(urlStr: string): Promise<{ allowed: boolean; crawlDelay: number }> {
    try {
      const parsed = new URL(urlStr);
      const { rules, delay } = await this.getRobotsRules(parsed.hostname);

      const path = parsed.pathname + parsed.search;

      for (const rule of rules) {
        // Convert robots.txt rule glob to simple regex matching
        const regexStr = "^" + rule.replace(/[-/\\^$*+?.()|[\]{}]/g, (m) => (m === "*" ? ".*" : "\\" + m));
        const regex = new RegExp(regexStr);
        if (regex.test(path)) {
          return { allowed: false, crawlDelay: delay };
        }
      }

      return { allowed: true, crawlDelay: delay };
    } catch {
      return { allowed: true, crawlDelay: 0 };
    }
  }
}
