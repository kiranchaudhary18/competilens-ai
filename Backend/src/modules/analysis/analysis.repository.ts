import prisma from "../../config/db";
import { AnalysisJobStatus } from "@prisma/client";

export class AnalysisRepository {
  public static async createJob(
    workspaceId: string,
    competitorId: string,
    requestedById: string,
    idempotencyKey?: string
  ) {
    return prisma.analysisJob.create({
      data: {
        workspaceId,
        competitorId,
        requestedById,
        status: AnalysisJobStatus.QUEUED,
        idempotencyKey,
        progress: 0,
      },
    });
  }

  public static async getJobByIdempotencyKey(
    workspaceId: string,
    competitorId: string,
    idempotencyKey: string
  ) {
    return prisma.analysisJob.findFirst({
      where: {
        workspaceId,
        competitorId,
        idempotencyKey,
        status: {
          in: [
            AnalysisJobStatus.QUEUED,
            AnalysisJobStatus.PREPARING,
            AnalysisJobStatus.CLASSIFYING,
            AnalysisJobStatus.ANALYZING_SENTIMENT,
            AnalysisJobStatus.DETECTING_CHANGES,
            AnalysisJobStatus.BUILDING_EVIDENCE,
            AnalysisJobStatus.STRATEGIC_ANALYSIS,
            AnalysisJobStatus.VALIDATING_STRATEGY,
            AnalysisJobStatus.GENERATING_REPORT,
            AnalysisJobStatus.VALIDATING_REPORT,
            AnalysisJobStatus.PERSISTING,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async updateJobStatus(
    jobId: string,
    status: AnalysisJobStatus,
    progress: number,
    currentStage?: string
  ) {
    const data: any = { status, progress };
    if (currentStage !== undefined) {
      data.currentStage = currentStage;
    }
    if (status === AnalysisJobStatus.PREPARING && progress === 5) {
      data.startedAt = new Date();
    }
    return prisma.analysisJob.update({
      where: { id: jobId },
      data,
    });
  }

  public static async completeJob(jobId: string) {
    return prisma.analysisJob.update({
      where: { id: jobId },
      data: {
        status: AnalysisJobStatus.COMPLETED,
        progress: 100,
        completedAt: new Date(),
      },
    });
  }

  public static async failJob(jobId: string, errorCode: string, errorMessage: string) {
    return prisma.analysisJob.update({
      where: { id: jobId },
      data: {
        status: AnalysisJobStatus.FAILED,
        errorCode,
        errorMessage,
        failedAt: new Date(),
      },
    });
  }

  public static async createStageExecution(jobId: string, stageName: string, inputData?: any) {
    return prisma.analysisStageExecution.create({
      data: {
        jobId,
        stageName,
        status: "RUNNING",
        inputData: inputData || {},
        startedAt: new Date(),
      },
    });
  }

  public static async updateStageExecution(
    executionId: string,
    status: "SUCCESS" | "FAILED",
    durationMs: number,
    outputData?: any,
    error?: string
  ) {
    return prisma.analysisStageExecution.update({
      where: { id: executionId },
      data: {
        status,
        durationMs,
        outputData: outputData || {},
        error,
        completedAt: new Date(),
      },
    });
  }

  public static async saveStrategicAnalysis(
    jobId: string,
    workspaceId: string,
    competitorId: string,
    competitorName: string,
    analysisData: any,
    modelVersion: string,
    provider: string
  ) {
    return prisma.strategicAnalysis.create({
      data: {
        jobId,
        workspaceId,
        competitorId,
        competitorName,
        summary: analysisData.summary || "",
        swotAnalysis: analysisData.swot || {},
        gapAnalysis: analysisData.gap_analysis || {},
        recommendations: analysisData.recommendations || [],
        validation: analysisData.validation || {},
        modelVersion,
        provider,
      },
    });
  }

  public static async saveExecutiveReport(
    jobId: string,
    workspaceId: string,
    competitorId: string,
    title: string,
    content: any,
    reportType: string,
    validation: any,
    modelVersion: string,
    provider: string
  ) {
    return prisma.executiveReport.create({
      data: {
        jobId,
        workspaceId,
        competitorId,
        title,
        content: content || {},
        reportType,
        validation: validation || {},
        modelVersion,
        provider,
      },
    });
  }

  public static async saveFailure(
    jobId: string,
    stageName: string,
    errorCode: string,
    errorMessage: string,
    stackTrace?: string
  ) {
    return prisma.analysisFailure.create({
      data: {
        jobId,
        stageName,
        errorCode,
        errorMessage,
        stackTrace,
      },
    });
  }

  public static async getJobById(jobId: string) {
    return prisma.analysisJob.findUnique({
      where: { id: jobId },
      include: {
        stageExecutions: { orderBy: { startedAt: "asc" } },
        strategicAnalyses: true,
        executiveReports: true,
        failures: true,
      },
    });
  }

  public static async listJobs(workspaceId: string, competitorId?: string) {
    return prisma.analysisJob.findMany({
      where: {
        workspaceId,
        ...(competitorId ? { competitorId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getStrategicAnalysis(jobId: string) {
    return prisma.strategicAnalysis.findFirst({
      where: { jobId },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getExecutiveReport(jobId: string) {
    return prisma.executiveReport.findFirst({
      where: { jobId },
      orderBy: { createdAt: "desc" },
    });
  }
}
