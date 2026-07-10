import { z } from "zod";

export const listReportsSchema = z.object({
  competitorId: z.string().uuid().optional(),
});
