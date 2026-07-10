export interface FetchOptions {
  timeoutMs?: number;
  maxSize?: number;
  etag?: string;
  lastModified?: string;
}

export interface FetchResult {
  status: number;
  body: string;
  contentType: string;
  etag?: string;
  lastModified?: string;
  notModified: boolean;
  responseTimeMs: number;
}

export interface ExtractedPage {
  title: string;
  metaDescription?: string;
  canonicalUrl?: string;
  headings: { h1: string[]; h2: string[] };
  mainText: string;
  links: string[];
}

export interface DiscoveredPage {
  url: string;
  priority: number;
  depth: number;
  source: string;
}
