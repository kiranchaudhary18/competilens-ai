import prisma from "../../../config/db";
import { Role, WorkspaceStatus } from "@prisma/client";

export class WorkspaceRepository {
  public static async findById(id: string) {
    return prisma.workspace.findUnique({
      where: { id },
      include: {
        settings: true,
      },
    });
  }

  public static async findBySlug(slug: string) {
    return prisma.workspace.findUnique({
      where: { slug },
    });
  }

  public static async createWorkspace(name: string, slug: string, ownerId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Workspace
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
          ownerId,
          status: WorkspaceStatus.ACTIVE,
        },
      });

      // 2. Create Workspace Member (OWNER)
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: ownerId,
          role: Role.OWNER,
        },
      });

      // 3. Create Default Workspace Settings
      await tx.workspaceSetting.create({
        data: {
          workspaceId: workspace.id,
          theme: "light",
          language: "en",
          timezone: "UTC",
        },
      });

      // 4. Update User's active workspace ID
      await tx.user.update({
        where: { id: ownerId },
        data: { workspaceId: workspace.id },
      });

      return workspace;
    }, { timeout: 30000 });
  }

  public static async getWorkspaceMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
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
      orderBy: {
        joinedAt: "asc",
      },
    });
  }

  public static async findMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  public static async findMemberById(id: string) {
    return prisma.workspaceMember.findUnique({
      where: { id },
      include: {
        workspace: true,
      },
    });
  }

  public static async updateMemberRole(id: string, role: Role) {
    return prisma.workspaceMember.update({
      where: { id },
      data: { role },
    });
  }

  public static async removeMember(id: string) {
    return prisma.workspaceMember.delete({
      where: { id },
    });
  }

  public static async updateWorkspaceSettings(workspaceId: string, settingsData: any) {
    return prisma.workspaceSetting.upsert({
      where: { workspaceId },
      update: settingsData,
      create: {
        workspaceId,
        ...settingsData,
      },
    });
  }

  public static async deleteWorkspace(id: string) {
    return prisma.workspace.update({
      where: { id },
      data: { status: WorkspaceStatus.DELETED },
    });
  }

  // Invitation methods
  public static async createInvitation(
    workspaceId: string,
    email: string,
    role: Role,
    token: string,
    expiresAt: Date,
    invitedBy: string
  ) {
    return prisma.workspaceInvitation.create({
      data: {
        workspaceId,
        email,
        role,
        token,
        expiresAt,
        invitedBy,
      },
    });
  }

  public static async findInvitationByToken(token: string) {
    return prisma.workspaceInvitation.findUnique({
      where: { token },
      include: {
        workspace: true,
      },
    });
  }

  public static async deleteInvitation(id: string) {
    return prisma.workspaceInvitation.delete({
      where: { id },
    });
  }

  public static async acceptInvitationTransaction(
    workspaceId: string,
    userId: string,
    role: Role,
    invitationId: string
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Add workspace member
      const member = await tx.workspaceMember.create({
        data: {
          workspaceId,
          userId,
          role,
        },
      });

      // 2. Set as active workspace for the user
      await tx.user.update({
        where: { id: userId },
        data: { workspaceId },
      });

      // 3. Delete invitation
      await tx.workspaceInvitation.delete({
        where: { id: invitationId },
      });

      return member;
    }, { timeout: 30000 });
  }
}
