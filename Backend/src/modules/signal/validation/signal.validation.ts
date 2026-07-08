import { z } from "zod";
import { SignalType, SignalStatus, SignalSeverity } from "@prisma/client";

const attachmentSchema = z.object({
  fileUrl: z.string().url("Invalid attachment URL"),
  fileType: z.string().optional(),
});

export const createSignalSchema = z.object({
  competitorId: z.string().uuid("Invalid competitor ID format"),
  type: z.nativeEnum(SignalType),
  title: z.string().min(1, "Signal title is required"),
  summary: z.string().optional(),
  url: z.string().url("Invalid signal URL").optional().or(z.literal("")),
  source: z.string().optional(),
  status: z.nativeEnum(SignalStatus).optional(),
  publishedAt: z.string().datetime({ message: "Invalid ISO datetime format for publishedAt" }).optional().or(z.literal("")),
  severity: z.nativeEnum(SignalSeverity).optional(),
  metadata: z.record(z.any()).optional(), // Flexible JSON payload for any signal type
  attachments: z.array(attachmentSchema).optional(),
});

export const updateSignalStatusSchema = z.object({
  status: z.nativeEnum(SignalStatus),
});
