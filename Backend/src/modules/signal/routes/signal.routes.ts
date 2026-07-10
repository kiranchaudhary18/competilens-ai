import { Router } from "express";
import { SignalController } from "../controller/signal.controller";
import { authenticateUser } from "../../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Apply base authentication and workspace access middleware to all signal routes
router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. Create a signal (OWNER, ADMIN, ANALYST)
router.post(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  SignalController.create as any
);

// 2. Get signal statistics (All roles in workspace)
router.get(
  "/statistics",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  SignalController.getStatistics as any
);

// 3. List signals (All roles in workspace)
router.get(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  SignalController.list as any
);

// 4. Get signal details (All roles in workspace)
router.get(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  SignalController.getDetails as any
);

// 5. Mark signal as read (All roles in workspace)
router.patch(
  "/:id/read",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  SignalController.markAsRead as any
);

// 6. Archive signal (OWNER, ADMIN only)
router.patch(
  "/:id/archive",
  authorize(Role.OWNER, Role.ADMIN) as any,
  SignalController.archive as any
);

export default router;
