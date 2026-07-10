import { IngestionPolicy } from "./ingestion-policy";
import { MemoryRecordData } from "../memory.types";

export class MemoryIngestor {
  public static async ingestSignal(signal: any): Promise<any> {
    const isPricing = signal.type === "PRICING";
    const candidate: MemoryRecordData = {
      workspaceId: signal.workspaceId,
      competitorId: signal.competitorId,
      memoryType: isPricing ? "PRICING_EVENT" : "SIGNAL",
      title: signal.title,
      summary: signal.summary,
      importanceScore: signal.severity === "CRITICAL" ? 0.9 : signal.severity === "HIGH" ? 0.75 : 0.5,
      confidenceScore: 0.95, // Signals are human/API-vetted
      observedAt: signal.publishedAt || signal.createdAt || new Date(),
      evidenceIds: [signal.id],
      metadata: {
        severity: signal.severity,
        type: signal.type,
        source: signal.source,
      },
    };

    return IngestionPolicy.evaluateAndIngest(candidate);
  }

  public static async ingestChange(params: {
    workspaceId: string;
    competitorId: string;
    change: any;
    url: string;
    evidenceId: string;
  }): Promise<any> {
    const { workspaceId, competitorId, change, url, evidenceId } = params;

    const isPricing = change.change_type === "pricing" || url.includes("pricing");
    const title = isPricing ? `Pricing adjustment on ${url}` : `Web update on ${url}`;
    const summary = `Detected "${change.change_type}" change in "${change.entity}". Changed from "${change.old_value || "none"}" to "${change.new_value || "none"}".`;

    const candidate: MemoryRecordData = {
      workspaceId,
      competitorId,
      memoryType: isPricing ? "PRICING_EVENT" : "CHANGE_EVENT",
      title,
      summary,
      importanceScore: change.severity === "CRITICAL" ? 0.95 : change.severity === "HIGH" ? 0.8 : 0.4,
      confidenceScore: 0.9, // Change detection scores
      observedAt: new Date(),
      evidenceIds: [evidenceId],
      metadata: {
        severity: change.severity,
        changeType: change.change_type,
        entity: change.entity,
        url,
      },
    };

    return IngestionPolicy.evaluateAndIngest(candidate);
  }

  public static async ingestStrategicAnalysis(analysis: any): Promise<any> {
    const swot = analysis.swot || {};
    const summary = `SWOT analysis computed. Strengths: ${JSON.stringify(swot.strengths || [])}. Opportunities: ${JSON.stringify(swot.opportunities || [])}.`;

    const candidate: MemoryRecordData = {
      workspaceId: analysis.workspaceId,
      competitorId: analysis.competitorId,
      memoryType: "STRATEGIC_INSIGHT",
      title: `Strategic analysis for competitor: ${analysis.competitorId}`,
      summary,
      importanceScore: 0.85,
      confidenceScore: 0.9,
      observedAt: analysis.createdAt || new Date(),
      evidenceIds: [analysis.id],
      metadata: {
        analysisType: analysis.analysisType,
        jobId: analysis.jobId,
      },
    };

    return IngestionPolicy.evaluateAndIngest(candidate);
  }

  public static async ingestExecutiveReport(report: any): Promise<any> {
    const candidate: MemoryRecordData = {
      workspaceId: report.workspaceId,
      competitorId: report.competitorId,
      memoryType: "EXECUTIVE_REPORT",
      title: `Executive Report: ${report.title}`,
      summary: report.content?.executiveSummary || "No summary provided",
      importanceScore: 0.9,
      confidenceScore: 0.95,
      observedAt: report.createdAt || new Date(),
      evidenceIds: [report.id],
      metadata: {
        reportType: report.reportType,
        jobId: report.jobId,
      },
    };

    return IngestionPolicy.evaluateAndIngest(candidate);
  }

  public static async ingestSentimentTrend(params: {
    workspaceId: string;
    competitorId: string;
    title: string;
    shift: number; // e.g. -0.25 (drop of 25%)
    volume: number;
    observations: any[];
    evidenceIds: string[];
  }): Promise<any> {
    const { workspaceId, competitorId, title, shift, volume, observations, evidenceIds } = params;

    const candidate: MemoryRecordData = {
      workspaceId,
      competitorId,
      memoryType: "SENTIMENT_TREND",
      title,
      summary: `Sentiment shift of ${Math.round(shift * 100)}% observed over ${volume} communications.`,
      importanceScore: Math.abs(shift) > 0.3 ? 0.8 : 0.6,
      confidenceScore: 0.85,
      observedAt: new Date(),
      evidenceIds,
      metadata: {
        shift,
        volume,
        observations,
      },
    };

    return IngestionPolicy.evaluateAndIngest(candidate);
  }
}
