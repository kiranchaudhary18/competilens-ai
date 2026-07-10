export class TextNormalizer {
  /**
   * Normalize webpage text to produce clean, reproducible versions for hashing and LLM analysis.
   */
  public static normalize(text: string): string {
    if (!text) return "";

    // 1. Unicode Normalization (compatibility decomposition/composition)
    let normalized = text.normalize("NFKC");

    // 2. Strip session IDs, hex hashes, and CSRF tokens (32-128 chars hex/base64-like)
    normalized = normalized.replace(/\b[a-fA-F0-9]{32,128}\b/gi, "[TOKEN]");
    normalized = normalized.replace(/\bcsrf[-_]?token\s*[:=]\s*["']?[a-zA-Z0-9\-_]{20,128}["']?/gi, "csrf-token: [TOKEN]");

    // 3. Strip Page Generation metrics / load times
    normalized = normalized.replace(/page\s+generated\s+in\s+\d+(?:\.\d+)?\s*(?:ms|seconds|sec|s)/gi, "");
    normalized = normalized.replace(/rendered\s+at\s+[^.]+\b/gi, "");
    normalized = normalized.replace(/load\s+time\s*:\s*\d+(?:\.\d+)?\s*(?:ms|s)/gi, "");

    // 4. Strip dynamic clocks, dates, and times
    // ISO timestamps
    normalized = normalized.replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\b/g, "[TIMESTAMP]");
    // Clock times: 12:30 PM, 14:05:22
    normalized = normalized.replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?\b/gi, "[TIME]");
    // Common date patterns
    normalized = normalized.replace(/\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b/gi, "[DATE]");

    // 5. Replace multiple whitespace characters with a single space
    normalized = normalized.replace(/\s+/g, " ");

    return normalized.trim();
  }
}
