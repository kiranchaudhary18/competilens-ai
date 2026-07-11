import { Response, NextFunction } from "express";
import { WorkspaceService } from "../service/workspace.service";
import { WorkspaceRequest } from "../middleware/workspace.middleware";
import {
  createWorkspaceSchema,
  inviteMemberSchema,
  acceptInvitationSchema,
  updateMemberRoleSchema,
  updateSettingsSchema,
} from "../validation/workspace.validation";
import prisma from "../../../config/db";
import { Role } from "@prisma/client";

export class WorkspaceController {
  public static async create(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createWorkspaceSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const workspace = await WorkspaceService.create(validatedData.name, userId);

      res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        data: { workspace },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async invite(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = inviteMemberSchema.parse(req.body);
      const workspaceId = req.workspaceId;
      const inviterId = req.user?.id;

      if (!workspaceId || !inviterId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID and Inviter ID are required",
        });
        return;
      }

      const invitation = await WorkspaceService.invite(
        workspaceId,
        validatedData.email,
        validatedData.role,
        inviterId
      );

      res.status(200).json({
        success: true,
        message: "Invitation sent successfully",
        data: { invitation },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async accept(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = acceptInvitationSchema.parse(req.body);
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId || !userEmail) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const member = await WorkspaceService.acceptInvitation(
        validatedData.token,
        userId,
        userEmail
      );

      res.status(200).json({
        success: true,
        message: "Joined workspace successfully",
        data: { member },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getWorkspaceMe(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
        return;
      }

      // Fetch complete workspace with settings and members
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: {
          settings: true,
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!workspace) {
        res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Workspace retrieved successfully",
        data: { workspace },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getMembers(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
        return;
      }

      const members = await WorkspaceService.getMembers(workspaceId);

      res.status(200).json({
        success: true,
        message: "Workspace members retrieved successfully",
        data: { members },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateMemberRole(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = req.params.id;
      const validatedData = updateMemberRoleSchema.parse(req.body);
      const currentUserId = req.user?.id;
      const workspaceId = req.workspaceId;

      if (!currentUserId || !workspaceId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const member = await WorkspaceService.updateMemberRole(
        memberId,
        validatedData.role as Role,
        currentUserId,
        workspaceId
      );

      res.status(200).json({
        success: true,
        message: "Member role updated successfully",
        data: { member },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async removeMember(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = req.params.id;
      const currentUserId = req.user?.id;
      const workspaceId = req.workspaceId;

      if (!currentUserId || !workspaceId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      await WorkspaceService.removeMember(memberId, currentUserId, workspaceId);

      res.status(200).json({
        success: true,
        message: "Member removed from workspace successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateSettings(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateSettingsSchema.parse(req.body);
      const workspaceId = req.workspaceId;

      if (!workspaceId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
        return;
      }

      const settings = await WorkspaceService.updateSettings(workspaceId, validatedData);

      res.status(200).json({
        success: true,
        message: "Workspace settings updated successfully",
        data: { settings },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteWorkspace(req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspaceId = req.workspaceId;
      const currentUserId = req.user?.id;

      if (!workspaceId || !currentUserId) {
        res.status(400).json({
          success: false,
          message: "Workspace ID and User ID are required",
        });
        return;
      }

      await WorkspaceService.deleteWorkspace(workspaceId, currentUserId);

      res.status(200).json({
        success: true,
        message: "Workspace deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
