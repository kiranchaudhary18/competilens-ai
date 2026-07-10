import { Response, NextFunction } from "express";
import { SignalService } from "../service/signal.service";
import { WorkspaceRequest } from "../../workspace/middleware/workspace.middleware";
import { createSignalSchema } from "../validation/signal.validation";

export class SignalController {
  public static async create(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createSignalSchema.parse(req.body);
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace context is required",
        });
        return;
      }

      const signal = await SignalService.create(workspaceId, validatedData);

      res.status(201).json({
        success: true,
        message: "Signal created successfully",
        data: { signal },
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
          message: "Workspace context is required",
        });
        return;
      }

      const result = await SignalService.list(workspaceId, req.query);

      res.status(200).json({
        success: true,
        message: "Signals retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getDetails(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signalId = req.params.id;
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace context is required",
        });
        return;
      }

      const signal = await SignalService.getDetails(signalId, workspaceId);

      res.status(200).json({
        success: true,
        message: "Signal details retrieved successfully",
        data: { signal },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async markAsRead(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signalId = req.params.id;
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace context is required",
        });
        return;
      }

      const signal = await SignalService.markAsRead(signalId, workspaceId);

      res.status(200).json({
        success: true,
        message: "Signal marked as read successfully",
        data: { signal },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async archive(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const signalId = req.params.id;
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace context is required",
        });
        return;
      }

      const signal = await SignalService.archive(signalId, workspaceId);

      res.status(200).json({
        success: true,
        message: "Signal archived successfully",
        data: { signal },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getStatistics(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace context is required",
        });
        return;
      }

      const statistics = await SignalService.getStatistics(workspaceId);

      res.status(200).json({
        success: true,
        message: "Signal statistics retrieved successfully",
        data: { statistics },
      });
    } catch (err) {
      next(err);
    }
  }
}
