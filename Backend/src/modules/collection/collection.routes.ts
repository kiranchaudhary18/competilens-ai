import { Router } from "express";
import { CollectionController } from "./collection.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Require user authentication and workspace access for all collection operations
router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. Add a competitor data source (OWNER, ADMIN, ANALYST)
router.post(
  "/",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CollectionController.add as any
);

// 2. List data sources for a competitor (All roles)
router.get(
  "/competitors/:competitorId",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  CollectionController.list as any
);

// 3. Trigger manual crawl for a data source (OWNER, ADMIN, ANALYST)
router.post(
  "/sources/:id/crawl",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  CollectionController.trigger as any
);

// 4. Check crawl job status and history logs (All roles)
router.get(
  "/jobs/:id",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  CollectionController.getJobStatus as any
);

export default router;
