import { SSRFGuard } from "../security/ssrf-guard";
import { FetchOptions, FetchResult } from "../collection.types";
import { URL } from "url";

export class HttpFetcher {
  private static USER_AGENT = "CompetiLensBot/1.0 (+https://competilens.com/bot)";
  private static MAX_REDIRECTS = 5;

  public static async fetchUrl(
    urlStr: string,
    options: FetchOptions = {}
  ): Promise<FetchResult> {
    const timeoutMs = options.timeoutMs || 15000;
    const maxSize = options.maxSize || 5 * 1024 * 1024; // Default 5MB

    let currentUrl = urlStr;
    let redirectCount = 0;

    const startTime = Date.now();

    while (redirectCount <= this.MAX_REDIRECTS) {
      // 1. SSRF Validation
      const isValid = await SSRFGuard.validateUrl(currentUrl);
      if (!isValid) {
        throw new Error(`SSRF Guard rejected URL: ${currentUrl}`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const headers: Record<string, string> = {
        "User-Agent": this.USER_AGENT,
        "Accept-Encoding": "gzip, deflate, br",
      };

      if (options.etag) {
        headers["If-None-Match"] = options.etag;
      }
      if (options.lastModified) {
        headers["If-Modified-Since"] = options.lastModified;
      }

      try {
        const response = await fetch(currentUrl, {
          method: "GET",
          headers,
          redirect: "manual", // Intercept redirects for SSRF validation
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // 2. Check Redirects
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get("location");
          if (!location) {
            throw new Error(`Redirect status ${response.status} returned without Location header`);
          }

          // Resolve relative redirect location against current URL
          const resolvedUrl = new URL(location, currentUrl).toString();
          currentUrl = resolvedUrl;
          redirectCount++;
          continue;
        }

        // 3. Check 304 Not Modified
        if (response.status === 304) {
          return {
            status: 304,
            body: "",
            contentType: "",
            notModified: true,
            responseTimeMs: Date.now() - startTime,
          };
        }

        // 4. Content Type & Size validation
        const contentType = response.headers.get("content-type") || "";
        const contentLengthHeader = response.headers.get("content-length");
        if (contentLengthHeader) {
          const size = parseInt(contentLengthHeader, 10);
          if (size > maxSize) {
            throw new Error(`Response size limit exceeded: ${size} bytes`);
          }
        }

        // 5. Read response stream chunks and limit size
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Unable to read response body stream");
        }

        let loaded = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            loaded += value.length;
            if (loaded > maxSize) {
              throw new Error(`Response body exceeded size limit of ${maxSize} bytes`);
            }
            chunks.push(value);
          }
        }

        // Decode body
        const mergedArray = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          mergedArray.set(chunk, offset);
          offset += chunk.length;
        }

        const bodyText = new TextDecoder("utf-8").decode(mergedArray);

        return {
          status: response.status,
          body: bodyText,
          contentType,
          etag: response.headers.get("etag") || undefined,
          lastModified: response.headers.get("last-modified") || undefined,
          notModified: false,
          responseTimeMs: Date.now() - startTime,
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw err;
      }
    }

    throw new Error(`Max redirects (${this.MAX_REDIRECTS}) exceeded`);
  }
}
