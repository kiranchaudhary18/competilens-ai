import { AnalysisRepository } from "../analysis.repository";
import { AnalysisPipelineContext } from "./pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";

export abstract class AnalysisStage {
  abstract readonly name: string;
  abstract readonly jobStatus: AnalysisJobStatus;
  abstract readonly progress: number;
  
  abstract run(context: AnalysisPipelineContext): Promise<any>;
}

export class StageRunner {
  public static async executeStage(
    stage: AnalysisStage,
    context: AnalysisPipelineContext
  ): Promise<boolean> {
    console.log(`[StageRunner] Starting stage: ${stage.name} for job: ${context.jobId}`);
    
    // Update Job stage status
    await AnalysisRepository.updateJobStatus(
      context.jobId,
      stage.jobStatus,
      stage.progress,
      stage.name
    );

    // Create stage execution log
    const execution = await AnalysisRepository.createStageExecution(
      context.jobId,
      stage.name,
      { competitorId: context.competitorId, timeRange: context.timeRange }
    );

    const startTime = Date.now();
    try {
      const output = await stage.run(context);
      const durationMs = Date.now() - startTime;

      // Update execution status
      await AnalysisRepository.updateStageExecution(
        execution.id,
        "SUCCESS",
        durationMs,
        output
      );

      console.log(`[StageRunner] Stage ${stage.name} completed successfully in ${durationMs}ms`);
      return true;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      console.error(`[StageRunner] Stage ${stage.name} failed:`, err);

      await AnalysisRepository.updateStageExecution(
        execution.id,
        "FAILED",
        durationMs,
        null,
        err.message || String(err)
      );

      await AnalysisRepository.saveFailure(
        context.jobId,
        stage.name,
        `STAGE_${stage.name}_FAILED`,
        err.message || String(err),
        err.stack
      );

      throw err; // Propagate to orchestrator
    }
  }
}
