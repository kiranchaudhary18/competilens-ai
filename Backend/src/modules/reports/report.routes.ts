import { Router } from "express";
import { ReportController } from "./report.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. List executive reports (all roles)
router.get(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  ReportController.list as any
);

// 2. Get specific report details (all roles)
router.get(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  ReportController.get as any
);

// 3. Delete report (OWNER, ADMIN)
router.delete(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN) as any,
  ReportController.delete as any
);

export default router;
