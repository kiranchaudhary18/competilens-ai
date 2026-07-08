import { Response, NextFunction } from "express";
import { CompetitorService } from "../service/competitor.service";
import { WorkspaceRequest } from "../../workspace/middleware/workspace.middleware";
import { createCompetitorSchema, updateCompetitorSchema } from "../validation/competitor.validation";

export class CompetitorController {
  public static async create(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createCompetitorSchema.parse(req.body);
      const workspaceId = req.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({
          success: false,
          message: "Workspace context and User ID are required",
        });
        return;
      }

      const competitor = await CompetitorService.create(workspaceId, userId, validatedData);

      res.status(201).json({
        success: true,
        message: "Competitor created successfully",
        data: { competitor },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async list(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
        return;
      }

      const result = await CompetitorService.list(workspaceId, req.query);

      res.status(200).json({
        success: true,
        message: "Competitors retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getDetails(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitorId = req.params.id;
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
        return;
      }

      const competitor = await CompetitorService.getDetails(competitorId, workspaceId);

      res.status(200).json({
        success: true,
        message: "Competitor details retrieved successfully",
        data: { competitor },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitorId = req.params.id;
      const validatedData = updateCompetitorSchema.parse(req.body);
      const workspaceId = req.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({
          success: false,
          message: "Workspace context and User ID are required",
        });
        return;
      }

      const competitor = await CompetitorService.update(competitorId, workspaceId, userId, validatedData);

      res.status(200).json({
        success: true,
        message: "Competitor updated successfully",
        data: { competitor },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async softDelete(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitorId = req.params.id;
      const workspaceId = req.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({
          success: false,
          message: "Workspace context and User ID are required",
        });
        return;
      }

      await CompetitorService.softDelete(competitorId, workspaceId, userId);

      res.status(200).json({
        success: true,
        message: "Competitor soft-deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async archive(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitorId = req.params.id;
      const workspaceId = req.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({
          success: false,
          message: "Workspace context and User ID are required",
        });
        return;
      }

      const competitor = await CompetitorService.archive(competitorId, workspaceId, userId);

      res.status(200).json({
        success: true,
        message: "Competitor archived successfully",
        data: { competitor },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async restore(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitorId = req.params.id;
      const workspaceId = req.workspaceId;
      const userId = req.user?.id;

      if (!workspaceId || !userId) {
        res.status(400).json({
          success: false,
          message: "Workspace context and User ID are required",
        });
        return;
      }

      const competitor = await CompetitorService.restore(competitorId, workspaceId, userId);

      res.status(200).json({
        success: true,
        message: "Competitor restored successfully",
        data: { competitor },
      });
    } catch (err) {
      next(err);
    }
  }
}
