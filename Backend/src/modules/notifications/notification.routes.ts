import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";
import { workspaceAccess } from "../workspace/middleware/workspace.middleware";

const router = Router();

router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. List user notifications
router.get("/", NotificationController.list as any);

// 2. Mark single notification as read
router.post("/:id/read", NotificationController.read as any);

// 3. Mark all as read
router.post("/read-all", NotificationController.readAll as any);

// 4. Delete notification
router.delete("/:id", NotificationController.delete as any);

export default router;
