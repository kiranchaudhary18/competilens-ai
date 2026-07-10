import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AIEngineClient } from "../clients/ai-engine.client";
import { MemoryRetriever } from "../../memory/retrieval/memory-retriever";
import { MemoryContextBuilder } from "../../memory/retrieval/context-builder";

export class StrategyStage extends AnalysisStage {
  readonly name = "STRATEGIC_ANALYSIS";
  readonly jobStatus = AnalysisJobStatus.STRATEGIC_ANALYSIS;
  readonly progress = 60;

  private validateStrategicAnalysis(analysis: any, evidencePack: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!analysis) {
      errors.push("Analysis is empty.");
      return { valid: false, errors };
    }

    // Check basic structural schema
    if (!analysis.swot || typeof analysis.swot !== "object") {
      errors.push("Missing SWOT analysis object.");
    } else {
      const swotKeys = ["strengths", "weaknesses", "opportunities", "threats"];
      for (const key of swotKeys) {
        if (!Array.isArray(analysis.swot[key])) {
          errors.push(`SWOT is missing array for key: ${key}`);
        }
      }
    }

    if (!analysis.gap_analysis || !Array.isArray(analysis.gap_analysis.gaps)) {
      errors.push("Missing or malformed gaps list.");
    }

    if (!Array.isArray(analysis.recommendations)) {
      errors.push("Missing or malformed recommendations list.");
    }

    // Grounding validation: Gather all evidence_id references
    const validEvidenceIds = new Set(evidencePack.items.map((item: any) => item.evidence_id));
    const referencedEvidenceIds = new Set<string>();

    const collectRefIds = (arr: any[]) => {
      if (!Array.isArray(arr)) return;
      for (const item of arr) {
        if (item.evidence_ids && Array.isArray(item.evidence_ids)) {
          for (const refId of item.evidence_ids) {
            referencedEvidenceIds.add(refId);
          }
        }
      }
    };

    if (analysis.swot) {
      collectRefIds(analysis.swot.strengths);
      collectRefIds(analysis.swot.weaknesses);
      collectRefIds(analysis.swot.opportunities);
      collectRefIds(analysis.swot.threats);
    }
    if (analysis.gap_analysis?.gaps) {
      collectRefIds(analysis.gap_analysis.gaps);
    }
    if (analysis.recommendations) {
      collectRefIds(analysis.recommendations);
    }

    // Verify all referenced evidence IDs exist
    const invalidIds: string[] = [];
    for (const refId of referencedEvidenceIds) {
      if (!validEvidenceIds.has(refId)) {
        invalidIds.push(refId);
      }
    }

    if (invalidIds.length > 0) {
      errors.push(`Strategy references invalid or hallucinated Evidence IDs: ${invalidIds.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public async run(context: AnalysisPipelineContext): Promise<any> {
    const rawSignalsFormatted = context.signals.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type,
      summary: s.summary,
      url: s.url,
      source: s.source,
      metadata: s.metadata,
    }));

    // Retrieve relevant historical context
    const memories = await MemoryRetriever.retrieve({
      workspaceId: context.workspaceId,
      competitorId: context.competitorId,
      limit: 10,
    }).catch((err) => {
      console.warn("[StrategyStage] Failed to retrieve historical memories:", err.message);
      return [];
    });

    const historicalContext = MemoryContextBuilder.buildPromptBlock(memories);

    // Trigger AI Strategic Analysis
    const response = await AIEngineClient.analyzeStrategic({
      workspace_id: context.workspaceId,
      competitor_id: context.competitorId,
      competitor_name: context.competitorName,
      raw_signals: rawSignalsFormatted,
      change_detection_results: context.changeDetectionResults || [],
      sentiment_metrics: context.sentimentMetrics || [],
      historical_context: historicalContext,
      provider: "gemini",
      model: "gemini-1.5-flash",
    });

    if (response.status !== "success" || !response.analysis) {
      throw new Error(`Strategic Analysis failed: ${response.error || "Unknown Error"}`);
    }

    // Perform strategy validation
    const validationResult = this.validateStrategicAnalysis(response.analysis, context.evidencePack);
    context.strategicAnalysis = response.analysis;
    context.strategicValidation = validationResult;

    if (!validationResult.valid) {
      console.warn("[StrategyStage] Validation failed with errors:", validationResult.errors);
      // We can fail or flag the job, but we'll store validation results and raise an error to prevent invalid reports.
      throw new Error(`Strategic Analysis validation failed: ${validationResult.errors[0]}`);
    }

    return {
      strategicAnalysis: response.analysis,
      strategicValidation: validationResult,
    };
  }
}
