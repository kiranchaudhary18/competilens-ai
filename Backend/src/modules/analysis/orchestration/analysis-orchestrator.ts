import { AnalysisRepository } from "../analysis.repository";
import { AnalysisPipelineContext } from "./pipeline-context";
import { StageRunner, AnalysisStage } from "./stage-runner";
import { PrepareStage } from "../stages/prepare.stage";
import { ClassifyStage } from "../stages/classify.stage";
import { SentimentStage } from "../stages/sentiment.stage";
import { ChangeDetectionStage } from "../stages/change-detection.stage";
import { EvidenceStage } from "../stages/evidence.stage";
import { StrategyStage } from "../stages/strategy.stage";
import { ReportStage } from "../stages/report.stage";
import { PersistStage } from "../stages/persist.stage";
import { AnalysisJobStatus } from "@prisma/client";

export class AnalysisOrchestrator {
  private static getStages(): AnalysisStage[] {
    return [
      new PrepareStage(),
      new ClassifyStage(),
      new SentimentStage(),
      new ChangeDetectionStage(),
      new EvidenceStage(),
      new StrategyStage(),
      new ReportStage(),
      new PersistStage(),
    ];
  }

  public static async run(context: AnalysisPipelineContext): Promise<void> {
    const stages = this.getStages();
    
    // Fetch job with existing stage executions (in case of retry)
    const job = await AnalysisRepository.getJobById(context.jobId);
    if (!job) {
      throw new Error(`Job ${context.jobId} not found`);
    }

    console.log(`[AnalysisOrchestrator] Starting pipeline for job ${context.jobId}`);

    try {
      for (const stage of stages) {
        // Check if this stage was already completed successfully in a previous run
        const existingExecution = job.stageExecutions.find(
          (ex) => ex.stageName === stage.name && ex.status === "SUCCESS"
        );

        if (existingExecution) {
          console.log(`[AnalysisOrchestrator] Skipping stage ${stage.name} (already succeeded). Restoring context.`);
          this.restoreContextFromStage(stage.name, existingExecution.outputData, context);
          continue;
        }

        // Run the stage
        await StageRunner.executeStage(stage, context);
      }

      console.log(`[AnalysisOrchestrator] Pipeline completed successfully for job ${context.jobId}`);
    } catch (err: any) {
      console.error(`[AnalysisOrchestrator] Pipeline failed for job ${context.jobId}:`, err.message);
      await AnalysisRepository.failJob(
        context.jobId,
        "PIPELINE_RUN_FAILED",
        err.message || String(err)
      );
    }
  }

  private static restoreContextFromStage(stageName: string, outputData: any, context: AnalysisPipelineContext) {
    if (!outputData) return;

    switch (stageName) {
      case "PREPARE":
        context.competitorName = outputData.competitorName || context.competitorName;
        context.signals = outputData.signals || [];
        break;
      case "CLASSIFY":
        context.classifiedSignals = outputData.classifiedSignals || [];
        break;
      case "SENTIMENT":
        context.sentimentMetrics = outputData.sentimentMetrics || [];
        break;
      case "CHANGE_DETECTION":
        context.changeDetectionResults = outputData.changeDetectionResults || [];
        break;
      case "EVIDENCE_BUILD":
        context.evidencePack = outputData.evidencePack || null;
        break;
      case "STRATEGIC_ANALYSIS":
        context.strategicAnalysis = outputData.strategicAnalysis || null;
        context.strategicValidation = outputData.strategicValidation || null;
        break;
      case "EXECUTIVE_REPORT":
        context.executiveReport = outputData.executiveReport || null;
        context.reportValidation = outputData.reportValidation || null;
        break;
      default:
        break;
    }
  }
}
