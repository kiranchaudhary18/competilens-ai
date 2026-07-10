import { z } from "zod";

export const getTimelineSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  types: z.array(z.string()).optional(),
  minImportance: z.preprocess((val) => Number(val), z.number().min(0).max(1)).optional(),
});

export const searchMemorySchema = z.object({
  query: z.string().min(1, "Search query must contain at least 1 character"),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(100)).optional(),
});
