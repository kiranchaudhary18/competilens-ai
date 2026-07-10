import { AnalysisRepository } from "./analysis.repository";
import { AnalysisPipelineContext } from "./orchestration/pipeline-context";
import { AnalysisOrchestrator } from "./orchestration/analysis-orchestrator";
import { AnalysisJobStatus } from "@prisma/client";
import { startAnalysisSchema } from "./analysis.validation";
import prisma from "../../config/db";

export class AnalysisService {
  public static async startAnalysis(
    workspaceId: string,
    userId: string,
    payload: any,
    idempotencyKey?: string
  ) {
    // 1. Validate payload
    const parsed = startAnalysisSchema.parse(payload);

    // 2. Verify competitor exists and belongs to the workspace
    const competitor = await prisma.competitor.findFirst({
      where: {
        id: parsed.competitorId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!competitor) {
      const err: any = new Error("Competitor not found in this workspace");
      err.statusCode = 404;
      throw err;
    }

    // 3. Idempotency Check: check if a running/queued job already exists with same idempotencyKey
    if (idempotencyKey) {
      const existingJob = await AnalysisRepository.getJobByIdempotencyKey(
        workspaceId,
        parsed.competitorId,
        idempotencyKey
      );
      if (existingJob) {
        return {
          jobId: existingJob.id,
          status: existingJob.status,
          progress: existingJob.progress,
        };
      }
    }

    // 4. Create new job
    const job = await AnalysisRepository.createJob(
      workspaceId,
      parsed.competitorId,
      userId,
      idempotencyKey
    );

    // 5. Trigger Orchestrator in background
    const context = new AnalysisPipelineContext({
      jobId: job.id,
      workspaceId,
      competitorId: parsed.competitorId,
      competitorName: competitor.name,
      analysisType: parsed.analysisType,
      timeRange: parsed.timeRange,
      userId,
    });

    // Run asynchronously
    AnalysisOrchestrator.run(context).catch((err) => {
      console.error(`[AnalysisService] Background pipeline failed for job ${job.id}:`, err);
    });

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
    };
  }

  public static async getJobStatus(workspaceId: string, jobId: string) {
    const job = await AnalysisRepository.getJobById(jobId);
    if (!job) {
      const err: any = new Error("Analysis job not found");
      err.statusCode = 404;
      throw err;
    }

    // Workspace Isolation check
    if (job.workspaceId !== workspaceId) {
      const err: any = new Error("Access Denied: Workspace mismatch");
      err.statusCode = 403;
      throw err;
    }

    return job;
  }

  public static async cancelJob(workspaceId: string, jobId: string) {
    const job = await this.getJobStatus(workspaceId, jobId);

    if (
      job.status === AnalysisJobStatus.COMPLETED ||
      job.status === AnalysisJobStatus.FAILED ||
      job.status === AnalysisJobStatus.CANCELLED
    ) {
      const err: any = new Error(`Cannot cancel a job that is already in ${job.status} state`);
      err.statusCode = 400;
      throw err;
    }

    await AnalysisRepository.updateJobStatus(jobId, AnalysisJobStatus.CANCELLED, job.progress, "CANCELLED");

    return {
      jobId,
      status: AnalysisJobStatus.CANCELLED,
    };
  }

  public static async retryJob(workspaceId: string, userId: string, jobId: string) {
    const job = await this.getJobStatus(workspaceId, jobId);

    if (job.status !== AnalysisJobStatus.FAILED && job.status !== AnalysisJobStatus.CANCELLED) {
      const err: any = new Error(`Cannot retry a job that is in ${job.status} state. Only FAILED or CANCELLED jobs can be retried.`);
      err.statusCode = 400;
      throw err;
    }

    // Update job status back to QUEUED
    await AnalysisRepository.updateJobStatus(jobId, AnalysisJobStatus.QUEUED, 0, "RETRYING");

    // Fetch latest competitor info
    const competitor = await prisma.competitor.findUnique({
      where: { id: job.competitorId },
    });

    if (!competitor) {
      const err: any = new Error("Competitor no longer exists");
      err.statusCode = 404;
      throw err;
    }

    // Reconstruct context
    const context = new AnalysisPipelineContext({
      jobId: job.id,
      workspaceId,
      competitorId: job.competitorId,
      competitorName: competitor.name,
      analysisType: "FULL",
      // Re-use timeRange if saved, else default to past 30 days
      timeRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
      },
      userId,
    });

    // Run asynchronously
    AnalysisOrchestrator.run(context).catch((err) => {
      console.error(`[AnalysisService] Retry background pipeline failed for job ${job.id}:`, err);
    });

    return {
      jobId: job.id,
      status: AnalysisJobStatus.QUEUED,
      progress: 0,
    };
  }

  public static async getStrategicAnalysis(workspaceId: string, jobId: string) {
    // Access validation
    await this.getJobStatus(workspaceId, jobId);

    const strategic = await AnalysisRepository.getStrategicAnalysis(jobId);
    if (!strategic) {
      const err: any = new Error("Strategic analysis data not found for this job");
      err.statusCode = 404;
      throw err;
    }
    return strategic;
  }

  public static async getExecutiveReport(workspaceId: string, jobId: string) {
    // Access validation
    await this.getJobStatus(workspaceId, jobId);

    const report = await AnalysisRepository.getExecutiveReport(jobId);
    if (!report) {
      const err: any = new Error("Executive report data not found for this job");
      err.statusCode = 404;
      throw err;
    }
    return report;
  }

  public static async listJobs(workspaceId: string, competitorId?: string) {
    if (competitorId) {
      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });
      if (!competitor) {
        const err: any = new Error("Competitor not found in this workspace");
        err.statusCode = 404;
        throw err;
      }
    }
    return AnalysisRepository.listJobs(workspaceId, competitorId);
  }
}
