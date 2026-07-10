import { z } from "zod";

export const startAnalysisSchema = z.object({
  competitorId: z.string({
    required_error: "Competitor ID is required",
  }).uuid("Invalid Competitor ID format"),
  analysisType: z.enum(["FULL", "QUICK"]).default("FULL"),
  timeRange: z
    .object({
      from: z.string().datetime({ message: "Invalid 'from' timestamp (ISO 8601 expected)" }),
      to: z.string().datetime({ message: "Invalid 'to' timestamp (ISO 8601 expected)" }),
    })
    .default(() => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30); // Default to last 30 days
      return {
        from: from.toISOString(),
        to: to.toISOString(),
      };
    }),
});
