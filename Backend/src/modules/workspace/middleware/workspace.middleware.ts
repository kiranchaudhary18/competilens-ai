import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../auth/middleware/auth.middleware";
import prisma from "../../../config/db";
import { Workspace, WorkspaceMember, Role } from "@prisma/client";

export interface WorkspaceRequest extends AuthenticatedRequest {
  workspaceId?: string;
  workspace?: Workspace;
  workspaceMember?: WorkspaceMember;
}

// Middleware to verify and attach the workspace context
export const workspaceAccess = async (
  req: WorkspaceRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Resolve workspace ID from Header, Query, Body, or user's active workspace
    const workspaceId =
      (req.headers["x-workspace-id"] as string) ||
      (req.query.workspaceId as string) ||
      req.body.workspaceId ||
      req.user?.workspaceId;

    if (!workspaceId) {
      res.status(400).json({
        success: false,
        message: "Workspace context or ID is required",
      });
      return;
    }

    // Fetch member details
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      include: {
        workspace: true,
      },
    });

    if (!member) {
      res.status(403).json({
        success: false,
        message: "Access Denied: You are not a member of this workspace",
      });
      return;
    }

    if (member.workspace.status === "DELETED") {
      res.status(410).json({
        success: false,
        message: "This workspace has been deleted",
      });
      return;
    }

    // Attach to request
    req.workspaceId = workspaceId;
    req.workspace = member.workspace;
    req.workspaceMember = member;

    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to resolve workspace access",
    });
  }
};

// Middleware to authorize specific roles within the active workspace
export const authorize = (...allowedRoles: Role[]) => {
  return (req: WorkspaceRequest, res: Response, next: NextFunction): void => {
    if (!req.workspaceMember) {
      res.status(403).json({
        success: false,
        message: "Access Denied: No workspace member context found",
      });
      return;
    }

    const hasRole = allowedRoles.includes(req.workspaceMember.role);
    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
};

// Alias / specific guard for owner access
export const ownershipGuard = authorize(Role.OWNER);
