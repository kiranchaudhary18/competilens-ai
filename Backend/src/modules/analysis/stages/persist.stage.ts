import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AnalysisRepository } from "../analysis.repository";
import { MemoryIngestor } from "../../memory/ingestion/memory-ingestor";
import { MemoryConsolidator } from "../../memory/consolidation/memory-consolidator";
import { NotificationService } from "../../notifications/notification.service";

export class PersistStage extends AnalysisStage {
  readonly name = "PERSIST";
  readonly jobStatus = AnalysisJobStatus.PERSISTING;
  readonly progress = 95;

  public async run(context: AnalysisPipelineContext): Promise<any> {
    // 1. Save Strategic Analysis
    const savedStrategy = await AnalysisRepository.saveStrategicAnalysis(
      context.jobId,
      context.workspaceId,
      context.competitorId,
      context.competitorName,
      context.strategicAnalysis,
      "1.0.0", // modelVersion
      "gemini" // provider
    );

    // 2. Save Executive Report
    const savedReport = await AnalysisRepository.saveExecutiveReport(
      context.jobId,
      context.workspaceId,
      context.competitorId,
      context.executiveReport.title || `Executive Competitor Report - ${context.competitorName}`,
      context.executiveReport,
      "WEEKLY_BRIEF",
      context.reportValidation || {},
      "1.0.0", // modelVersion
      "gemini" // provider
    );

    // 3. Mark job as COMPLETED
    await AnalysisRepository.completeJob(context.jobId);

    // Ingest results into long-term hindsight memory
    await MemoryIngestor.ingestStrategicAnalysis(savedStrategy).catch((err) =>
      console.error("[PersistStage] Failed to ingest strategic analysis to memory:", err.message)
    );

    await MemoryIngestor.ingestExecutiveReport(savedReport).catch((err) =>
      console.error("[PersistStage] Failed to ingest executive report to memory:", err.message)
    );

    // Consolidate memory trends/patterns
    await MemoryConsolidator.consolidate(context.workspaceId, context.competitorId).catch((err) =>
      console.error("[PersistStage] Failed to consolidate competitor memory:", err.message)
    );

    // Notify workspace members that report is ready
    await NotificationService.notifyWorkspace({
      workspaceId: context.workspaceId,
      event: "REPORT_READY",
      title: `Executive Report Ready: ${context.competitorName}`,
      message: `A new competitor brief and strategic analysis report has been generated. Title: ${savedReport.title}`,
      severity: "SUCCESS",
      dedupeKey: `report_ready_${context.competitorId}_${context.jobId}`,
    }).catch((err) =>
      console.error("[PersistStage] Failed to dispatch report notification:", err.message)
    );

    return {
      strategicAnalysisId: savedStrategy.id,
      executiveReportId: savedReport.id,
    };
  }
}
