import { Router } from "express";
import { WorkspaceController } from "../controller/workspace.controller";
import { authenticateUser } from "../../auth/middleware/auth.middleware";
import { workspaceAccess, authorize, ownershipGuard } from "../middleware/workspace.middleware";
import { Role } from "@prisma/client";

const router = Router();

// 1. Create a workspace (authenticated users)
router.post("/create", authenticateUser as any, WorkspaceController.create as any);

// 2. Accept an invitation to join a workspace
router.post("/accept", authenticateUser as any, WorkspaceController.accept as any);

// 3. Get active workspace details (requires membership check)
router.get(
  "/me",
  authenticateUser as any,
  workspaceAccess as any,
  WorkspaceController.getWorkspaceMe as any
);

// 4. Invite a member (requires OWNER or ADMIN role)
router.post(
  "/invite",
  authenticateUser as any,
  workspaceAccess as any,
  authorize(Role.OWNER, Role.ADMIN) as any,
  WorkspaceController.invite as any
);

// 5. Get workspace members (all members can view)
router.get(
  "/members",
  authenticateUser as any,
  workspaceAccess as any,
  WorkspaceController.getMembers as any
);

// 6. Update member's role (requires OWNER or ADMIN role)
router.patch(
  "/member/:id/role",
  authenticateUser as any,
  workspaceAccess as any,
  authorize(Role.OWNER, Role.ADMIN) as any,
  WorkspaceController.updateMemberRole as any
);

// 7. Remove member from workspace (requires OWNER or ADMIN role)
router.delete(
  "/member/:id",
  authenticateUser as any,
  workspaceAccess as any,
  authorize(Role.OWNER, Role.ADMIN) as any,
  WorkspaceController.removeMember as any
);

// 8. Update workspace settings (OWNER only)
router.patch(
  "/settings",
  authenticateUser as any,
  workspaceAccess as any,
  ownershipGuard as any,
  WorkspaceController.updateSettings as any
);

// 9. Delete workspace (OWNER only)
router.delete(
  "/",
  authenticateUser as any,
  workspaceAccess as any,
  ownershipGuard as any,
  WorkspaceController.deleteWorkspace as any
);

export default router;
