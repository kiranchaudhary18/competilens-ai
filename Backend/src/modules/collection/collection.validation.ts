import { z } from "zod";

export const addDataSourceSchema = z.object({
  type: z.enum(["WEBSITE", "RSS", "ATOM"], {
    message: "Data Source Type is required",
  }),
  url: z
    .string({
      message: "Target URL is required",
    })
    .url("Invalid URL format"),
});
