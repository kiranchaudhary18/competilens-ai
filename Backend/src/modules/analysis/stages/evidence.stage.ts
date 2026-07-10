import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export class EvidenceStage extends AnalysisStage {
  readonly name = "EVIDENCE_BUILD";
  readonly jobStatus = AnalysisJobStatus.BUILDING_EVIDENCE;
  readonly progress = 45;

  private sanitizeContent(rawText: string): string {
    if (!rawText) return "";
    return rawText
      .replace(/ignore\s+previous\s+instructions/gi, "[REDACTED INJECTION ATTEMPT]")
      .replace(/ignore\s+all\s+instructions/gi, "[REDACTED INJECTION ATTEMPT]")
      .replace(/system\s+prompt/gi, "[REDACTED KEYWORD]")
      .replace(/you\s+must/gi, "they must")
      .substring(0, 5000); // Truncate to avoid payload overflow
  }

  public async run(context: AnalysisPipelineContext): Promise<any> {
    const items: any[] = [];

    // 1. Process Signals (with classification and sentiment if present)
    for (const signal of context.classifiedSignals) {
      const sentimentInfo = context.sentimentMetrics.find((s) => s.signalId === signal.id);

      items.push({
        evidence_id: `sig_${signal.id}`,
        workspace_id: context.workspaceId,
        competitor_id: context.competitorId,
        evidence_type: "SIGNAL",
        source_type: signal.type,
        source_reference: signal.url || signal.source || "Unknown Source",
        observed_at: signal.publishedAt?.toISOString() || signal.capturedAt.toISOString(),
        content: this.sanitizeContent(signal.summary || signal.title || ""),
        reliability_score: 1.0,
        classifier_label: signal.classification?.label || null,
        classifier_confidence: signal.classification?.confidence || null,
        sentiment_label: sentimentInfo?.sentiment?.label || null,
        sentiment_confidence: sentimentInfo?.sentiment?.confidence || null,
        metadata: signal.metadata || {},
      });
    }

    // 2. Process Change Events
    if (context.changeDetectionResults && Array.isArray(context.changeDetectionResults)) {
      for (const change of context.changeDetectionResults) {
        items.push({
          evidence_id: `chg_${uuidv4().substring(0, 8)}`,
          workspace_id: context.workspaceId,
          competitor_id: context.competitorId,
          evidence_type: "CHANGE_DETECTION",
          source_type: change.sourceType || "WEBSITE",
          source_reference: change.sourceUrl || "Competitor Website",
          observed_at: new Date().toISOString(),
          content: this.sanitizeContent(`Detected change in entity ${change.entity || "unknown"}: Old Value was '${change.old_value || ""}' and New Value is '${change.new_value || ""}'`),
          reliability_score: change.confidence_score || 0.9,
          change_type: change.change_type || "UNKNOWN",
          change_severity: change.severity || "MEDIUM",
          change_confidence: change.confidence_score || null,
          old_value: change.old_value || null,
          new_value: change.new_value || null,
          metadata: {
            semantic_similarity: change.semantic_similarity,
            importance_score: change.importance_score,
          },
        });
      }
    }

    const pack = {
      pack_id: `pack_${context.jobId}`,
      workspace_id: context.workspaceId,
      competitor_id: context.competitorId,
      competitor_name: context.competitorName,
      generated_at: new Date().toISOString(),
      items,
      total_signals: context.signals.length,
      total_change_events: context.changeDetectionResults?.length || 0,
      negative_sentiment_count: items.filter((i) => i.sentiment_label === "NEGATIVE").length,
      positive_sentiment_count: items.filter((i) => i.sentiment_label === "POSITIVE").length,
    };

    context.evidencePack = pack;

    return {
      evidencePack: pack,
    };
  }
}
