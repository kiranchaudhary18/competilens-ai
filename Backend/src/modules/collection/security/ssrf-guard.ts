import { URL } from "url";
import dns from "dns";
import { promisify } from "util";

const lookupAsync = promisify(dns.lookup);

export class SSRFGuard {
  private static isPrivateIPv4(ip: string): boolean {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return false;

    // 127.0.0.0/8 (loopback)
    if (parts[0] === 127) return true;

    // 10.0.0.0/8 (private)
    if (parts[0] === 10) return true;

    // 172.16.0.0/12 (private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (private)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 169.254.0.0/16 (link-local / AWS metadata endpoint)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 0.0.0.0
    if (parts.join(".") === "0.0.0.0") return true;

    return false;
  }

  private static isPrivateIPv6(ip: string): boolean {
    const formatted = ip.toLowerCase();
    // Loopback
    if (formatted === "::1" || formatted === "0:0:0:0:0:0:0:1") return true;

    // Link-local (fe80::/10)
    if (formatted.startsWith("fe80:")) return true;

    // Unique local address (fc00::/7)
    if (formatted.startsWith("fc00:") || formatted.startsWith("fd00:")) return true;

    return false;
  }

  public static async validateUrl(urlStr: string): Promise<boolean> {
    try {
      const parsed = new URL(urlStr);

      // 1. Validate Scheme
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        console.warn(`[SSRF Guard] Rejected URL due to invalid protocol: ${parsed.protocol}`);
        return false;
      }

      const hostname = parsed.hostname;

      // 2. Perform DNS Lookup
      const lookupResult = await lookupAsync(hostname);
      const ip = lookupResult.address;

      // 3. Validate Resolved IP
      if (lookupResult.family === 4) {
        if (this.isPrivateIPv4(ip)) {
          console.warn(`[SSRF Guard] Blocked private IPv4 address: ${ip} for host ${hostname}`);
          return false;
        }
      } else if (lookupResult.family === 6) {
        if (this.isPrivateIPv6(ip)) {
          console.warn(`[SSRF Guard] Blocked private IPv6 address: ${ip} for host ${hostname}`);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error(`[SSRF Guard] URL validation failed for ${urlStr}:`, err);
      return false;
    }
  }
}
