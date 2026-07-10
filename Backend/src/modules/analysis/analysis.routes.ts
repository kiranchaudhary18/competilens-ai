import { Router } from "express";
import { AnalysisController } from "./analysis.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Require user authentication and workspace access for all analysis operations
router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. Trigger strategic report analysis (OWNER, ADMIN, ANALYST)
router.post(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  AnalysisController.start as any
);

// 2. List all analysis runs/jobs in the workspace (All roles)
router.get(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  AnalysisController.list as any
);

// 3. Get job details and metrics (All roles)
router.get(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  AnalysisController.getStatus as any
);

// 4. Get job stage execution status (All roles)
router.get(
  "/:id/status",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  AnalysisController.getStatus as any
);

// 5. Cancel running analysis (OWNER, ADMIN, ANALYST)
router.post(
  "/:id/cancel",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  AnalysisController.cancel as any
);

// 6. Retry failed/cancelled analysis job (OWNER, ADMIN, ANALYST)
router.post(
  "/:id/retry",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  AnalysisController.retry as any
);

// 7. Get completed strategic SWOT/gap/recommendation data (All roles)
router.get(
  "/:id/strategic",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  AnalysisController.getStrategic as any
);

// 8. Get completed executive report (All roles)
router.get(
  "/:id/report",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  AnalysisController.getReport as any
);

export default router;
