import { Response } from "express";
import { WorkspaceRequest } from "../workspace/middleware/workspace.middleware";
import { NotificationRepository } from "./notification.repository";

export class NotificationController {
  public static async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized user session" });
        return;
      }

      const list = await NotificationRepository.getUserNotifications(userId);

      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to list alerts",
      });
    }
  }

  public static async read(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      await NotificationRepository.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        message: "Notification marked as read.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to update notification status",
      });
    }
  }

  public static async readAll(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      await NotificationRepository.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to clear notifications",
      });
    }
  }

  public static async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      await NotificationRepository.deleteNotification(id, userId);

      res.status(200).json({
        success: true,
        message: "Notification deleted.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to delete notification",
      });
    }
  }
}
