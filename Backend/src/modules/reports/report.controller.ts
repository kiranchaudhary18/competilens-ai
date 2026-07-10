import { Response } from "express";
import { WorkspaceRequest } from "../workspace/middleware/workspace.middleware";
import { ReportService } from "./report.service";
import { listReportsSchema } from "./report.validation";

export class ReportController {
  public static async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const parsed = listReportsSchema.parse(req.query);

      const reports = await ReportService.listExecutiveReports(workspaceId, parsed.competitorId);

      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ success: false, message: err.errors[0].message });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || "Failed to list executive reports",
      });
    }
  }

  public static async get(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const report = await ReportService.getReportDetails(id, workspaceId);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        message: err.message || "Failed to get executive report details",
      });
    }
  }

  public static async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const result = await ReportService.removeReport(id, workspaceId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        message: err.message || "Failed to delete report",
      });
    }
  }
}
