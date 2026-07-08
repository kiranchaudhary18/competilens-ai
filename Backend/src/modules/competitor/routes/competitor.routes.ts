import { Router } from "express";
import { CompetitorController } from "../controller/competitor.controller";
import { authenticateUser } from "../../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Apply base authentication and workspace access middleware to all competitor routes
router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. Create a competitor (OWNER, ADMIN, ANALYST)
router.post(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CompetitorController.create as any
);

// 2. List competitors (All roles in workspace)
router.get(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  CompetitorController.list as any
);

// 3. Get competitor details (All roles in workspace)
router.get(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  CompetitorController.getDetails as any
);

// 4. Update competitor (OWNER, ADMIN, ANALYST)
router.patch(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CompetitorController.update as any
);

// 5. Soft Delete competitor (OWNER, ADMIN only)
router.delete(
  "/:id",
  authorize(Role.OWNER, Role.ADMIN) as any,
  CompetitorController.softDelete as any
);

// 6. Archive competitor (OWNER, ADMIN, ANALYST)
router.patch(
  "/:id/archive",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CompetitorController.archive as any
);

// 7. Restore competitor (OWNER, ADMIN, ANALYST)
router.patch(
  "/:id/restore",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CompetitorController.restore as any
);

export default router;
