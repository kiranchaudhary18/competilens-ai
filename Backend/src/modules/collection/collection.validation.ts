import { z } from "zod";
import { DataSourceType } from "@prisma/client";

export const addDataSourceSchema = z.object({
  type: z.nativeEnum(DataSourceType, {
    required_error: "Data Source Type is required",
  }),
  url: z
    .string({
      required_error: "Target URL is required",
    })
    .url("Invalid URL format"),
});
