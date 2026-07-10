import { z } from "zod";
import { Role } from "@prisma/client";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be less than 50 characters"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Invalid role: must be OWNER, ADMIN, ANALYST, or VIEWER" }),
  }),
});

export const acceptInvitationSchema = z.object({
  token: z.string().uuid("Invalid invitation token"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum([Role.ADMIN, Role.ANALYST, Role.VIEWER], {
    errorMap: () => ({ message: "Invalid role: must be ADMIN, ANALYST, or VIEWER" }),
  }),
});

export const updateSettingsSchema = z.object({
  theme: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
});
