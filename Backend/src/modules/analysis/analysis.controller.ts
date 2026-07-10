import { Response } from "express";
import { WorkspaceRequest } from "../workspace/middleware/workspace.middleware";
import { AnalysisService } from "./analysis.service";

export class AnalysisController {
  public static async start(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const userId = req.user!.id;
      const idempotencyKey = req.headers["idempotency-key"] as string | undefined;

      const result = await AnalysisService.startAnalysis(
        workspaceId,
        userId,
        req.body,
        idempotencyKey
      );

      res.status(202).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to start analysis job",
      });
    }
  }

  public static async getStatus(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const job = await AnalysisService.getJobStatus(workspaceId, id);

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to get analysis status",
      });
    }
  }

  public static async cancel(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const result = await AnalysisService.cancelJob(workspaceId, id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to cancel analysis job",
      });
    }
  }

  public static async retry(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await AnalysisService.retryJob(workspaceId, userId, id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to retry analysis job",
      });
    }
  }

  public static async getStrategic(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const strategic = await AnalysisService.getStrategicAnalysis(workspaceId, id);

      res.status(200).json({
        success: true,
        data: strategic,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to retrieve strategic analysis",
      });
    }
  }

  public static async getReport(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const report = await AnalysisService.getExecutiveReport(workspaceId, id);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to retrieve executive report",
      });
    }
  }

  public static async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const competitorId = req.query.competitorId as string | undefined;

      const jobs = await AnalysisService.listJobs(workspaceId, competitorId);

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to list analysis jobs",
      });
    }
  }
}
