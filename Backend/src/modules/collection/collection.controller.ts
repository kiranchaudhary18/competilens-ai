import { Response } from "express";
import { WorkspaceRequest } from "../workspace/middleware/workspace.middleware";
import { CollectionService } from "./collection.service";
import { addDataSourceSchema } from "./collection.validation";
import prisma from "../../config/db";

export class CollectionController {
  public static async add(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { competitorId } = req.body;

      if (!competitorId) {
        res.status(400).json({ success: false, message: "competitorId is required" });
        return;
      }

      // Check competitor exists in workspace
      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });

      if (!competitor) {
        res.status(404).json({ success: false, message: "Competitor not found in this workspace" });
        return;
      }

      // Validate other parameters
      const parsed = addDataSourceSchema.parse(req.body);

      const source = await CollectionService.addDataSource(
        workspaceId,
        competitorId,
        parsed.type,
        parsed.url
      );

      res.status(201).json({
        success: true,
        data: source,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ success: false, message: err.errors[0].message });
        return;
      }
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to add competitor data source",
      });
    }
  }

  public static async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { competitorId } = req.params;

      // Check competitor exists
      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });

      if (!competitor) {
        res.status(404).json({ success: false, message: "Competitor not found in this workspace" });
        return;
      }

      const sources = await CollectionService.listDataSources(workspaceId, competitorId);

      res.status(200).json({
        success: true,
        data: sources,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to list competitor data sources",
      });
    }
  }

  public static async trigger(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const job = await CollectionService.triggerCrawl(workspaceId, id);

      res.status(202).json({
        success: true,
        data: job,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Failed to trigger crawl job",
      });
    }
  }

  public static async getJobStatus(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const job = await prisma.crawlJob.findUnique({
        where: { id },
        include: {
          attempts: { orderBy: { createdAt: "desc" } },
        },
      });

      if (!job) {
        res.status(404).json({ success: false, message: "Crawl job not found" });
        return;
      }

      if (job.workspaceId !== workspaceId) {
        res.status(403).json({ success: false, message: "Access Denied: Workspace mismatch" });
        return;
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to get crawl job status",
      });
    }
  }
}
