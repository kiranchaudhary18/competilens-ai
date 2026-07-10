export type MemoryType =
  | "SNAPSHOT"
  | "SIGNAL"
  | "CHANGE_EVENT"
  | "PRICING_EVENT"
  | "SENTIMENT_TREND"
  | "STRATEGIC_INSIGHT"
  | "EXECUTIVE_REPORT"
  | "MARKET_PATTERN"
  | "USER_VALIDATED_INSIGHT";

export interface MemoryRecordData {
  workspaceId: string;
  competitorId: string;
  memoryType: MemoryType;
  title: string;
  summary: string;
  importanceScore: number;
  confidenceScore: number;
  observedAt: Date;
  evidenceIds: string[];
  metadata?: any;
}

export interface MemoryLinkData {
  fromId: string;
  toId: string;
  linkType: "DUP" | "CAUSAL" | "SEQUENCE" | "RELATED";
}

export interface HistoricalTrendData {
  workspaceId: string;
  competitorId: string;
  trendType: "PRICING" | "SENTIMENT" | "FEATURE_RECURRENCE";
  name: string;
  summary: string;
  status: "ACTIVE" | "COMPLETED";
}

export interface TrendObservationData {
  trendId: string;
  value: any;
  observedAt: Date;
  evidenceIds: string[];
}
