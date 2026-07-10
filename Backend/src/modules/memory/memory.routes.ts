import { Router } from "express";
import { MemoryController } from "./memory.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";
import { workspaceAccess, authorize } from "../workspace/middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticateUser as any);
router.use(workspaceAccess as any);

// 1. Get competitor timeline
router.get(
  "/competitors/:competitorId/timeline",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  MemoryController.getTimeline as any
);

// 2. Get competitor trends & observations
router.get(
  "/competitors/:competitorId/trends",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  MemoryController.getTrends as any
);

// 3. Search memories
router.get(
  "/search",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST, Role.VIEWER) as any,
  MemoryController.search as any
);

// 4. Trigger manual memory consolidation
router.post(
  "/competitors/:competitorId/consolidate",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  MemoryController.consolidate as any
);

// 5. User-validated insight
router.post(
  "/:id/validate",
  authorize(Role.OWNER, Role.ADMIN, Role.ANALYST) as any,
  MemoryController.validateMemory as any
);

export default router;
