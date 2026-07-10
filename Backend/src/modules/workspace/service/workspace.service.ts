import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { Role } from "@prisma/client";
import prisma from "../../../config/db";

const resendApiKey = process.env.RESEND_API_KEY || "re_placeholder_key";
const resend = new Resend(resendApiKey);

export class WorkspaceService {
  public static async create(name: string, ownerId: string) {
    const randomSuffix = uuidv4().substring(0, 6);
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${randomSuffix}`;
    
    return WorkspaceRepository.createWorkspace(name, slug, ownerId);
  }

  public static async invite(workspaceId: string, email: string, role: Role, invitedById: string) {
    // 1. Check if user is already a member
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (targetUser) {
      const existingMember = await WorkspaceRepository.findMember(workspaceId, targetUser.id);
      if (existingMember) {
        const err: any = new Error("User is already a member of this workspace");
        err.statusCode = 400;
        throw err;
      }
    }

    // 2. Generate token and expiry
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // 3. Save invitation
    const invitation = await WorkspaceRepository.createInvitation(
      workspaceId,
      email,
      role,
      token,
      expiresAt,
      invitedById
    );

    // 4. Send email invitation link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const inviteUrl = `${frontendUrl}/accept-invite?token=${token}`;

    console.log(`\n======================================================`);
    console.log(`✉️  [Workspace Invitation] Link for ${email}:`);
    console.log(`👉  ${inviteUrl}`);
    console.log(`======================================================\n`);

    try {
      if (resendApiKey && resendApiKey !== "re_placeholder_key") {
        await resend.emails.send({
          from: "CompetiLens AI <onboarding@resend.dev>",
          to: email,
          subject: "You are invited to join a Workspace on CompetiLens AI",
          html: `
            <div style="font-family: sans-serif; padding: 24px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 16px;">
              <h2 style="color: #2563EB;">Join CompetiLens AI Workspace</h2>
              <p>Hello,</p>
              <p>You have been invited to join a workspace on CompetiLens AI with the role of <strong>${role}</strong>.</p>
              <p style="margin: 24px 0;">
                <a href="${inviteUrl}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
              </p>
              <p style="font-size: 12px; color: #64748B;">This invitation link will expire in 48 hours.</p>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
              <p style="font-size: 11px; color: #94A3B8;">&copy; 2026 CompetiLens AI. All rights reserved.</p>
            </div>
          `,
        });
        console.log(`✉️ Invitation email dispatched successfully to ${email} using Resend`);
      } else {
        console.log("⚠️ Resend API Key is not configured. Email dispatch bypassed in local development.");
      }
    } catch (emailErr) {
      console.error("❌ Failed to send invitation email via Resend:", emailErr);
    }

    return invitation;
  }

  public static async acceptInvitation(token: string, userId: string, userEmail: string) {
    const invitation = await WorkspaceRepository.findInvitationByToken(token);
    if (!invitation) {
      const err: any = new Error("Invalid or expired invitation token");
      err.statusCode = 400;
      throw err;
    }

    if (invitation.expiresAt < new Date()) {
      await WorkspaceRepository.deleteInvitation(invitation.id);
      const err: any = new Error("Invitation token has expired");
      err.statusCode = 400;
      throw err;
    }

    // Verify user's email matches invitation target email
    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      const err: any = new Error("This invitation was sent to a different email address");
      err.statusCode = 403;
      throw err;
    }

    // Check if user is already a member
    const existingMember = await WorkspaceRepository.findMember(invitation.workspaceId, userId);
    if (existingMember) {
      await WorkspaceRepository.deleteInvitation(invitation.id);
      return existingMember;
    }

    return WorkspaceRepository.acceptInvitationTransaction(
      invitation.workspaceId,
      userId,
      invitation.role,
      invitation.id
    );
  }

  public static async getMembers(workspaceId: string) {
    return WorkspaceRepository.getWorkspaceMembers(workspaceId);
  }

  public static async updateMemberRole(
    memberId: string,
    targetRole: Role,
    currentUserId: string,
    currentWorkspaceId: string
  ) {
    const member = await WorkspaceRepository.findMemberById(memberId);
    if (!member) {
      const err: any = new Error("Workspace member not found");
      err.statusCode = 404;
      throw err;
    }

    if (member.workspaceId !== currentWorkspaceId) {
      const err: any = new Error("Member does not belong to your active workspace");
      err.statusCode = 403;
      throw err;
    }

    // Security Rules:
    // 1. Cannot modify OWNER role
    if (member.role === Role.OWNER) {
      const err: any = new Error("Cannot modify the role of the workspace Owner");
      err.statusCode = 403;
      throw err;
    }

    // 2. Cannot escalate someone to OWNER (Only one Owner is supported, or Owner transfer is a different operation)
    if (targetRole === Role.OWNER) {
      const err: any = new Error("Esclating role to OWNER is not supported");
      err.statusCode = 403;
      throw err;
    }

    return WorkspaceRepository.updateMemberRole(memberId, targetRole);
  }

  public static async removeMember(
    memberId: string,
    currentUserId: string,
    currentWorkspaceId: string
  ) {
    const member = await WorkspaceRepository.findMemberById(memberId);
    if (!member) {
      const err: any = new Error("Workspace member not found");
      err.statusCode = 404;
      throw err;
    }

    if (member.workspaceId !== currentWorkspaceId) {
      const err: any = new Error("Member does not belong to your active workspace");
      err.statusCode = 403;
      throw err;
    }

    // Security Rules:
    // 1. Owner cannot remove themselves
    if (member.userId === currentUserId && member.role === Role.OWNER) {
      const err: any = new Error("Workspace Owner cannot leave or remove themselves");
      err.statusCode = 400;
      throw err;
    }

    // 2. Admins cannot remove Owners
    if (member.role === Role.OWNER) {
      const err: any = new Error("Cannot remove the workspace Owner");
      err.statusCode = 403;
      throw err;
    }

    return WorkspaceRepository.removeMember(memberId);
  }

  public static async updateSettings(workspaceId: string, settingsData: any) {
    return WorkspaceRepository.updateWorkspaceSettings(workspaceId, settingsData);
  }

  public static async deleteWorkspace(workspaceId: string, currentUserId: string) {
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      const err: any = new Error("Workspace not found");
      err.statusCode = 404;
      throw err;
    }

    // Verify ownership
    if (workspace.ownerId !== currentUserId) {
      const err: any = new Error("Only the workspace Owner can delete this workspace");
      err.statusCode = 403;
      throw err;
    }

    return WorkspaceRepository.deleteWorkspace(workspaceId);
  }
}
