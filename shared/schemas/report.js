import { z } from "zod";

export const reportSummarySchema = z.object({
  filename: z.string(),
  num: z.number().int().nullable(),
  slug: z.string().default(""),
  date: z.string().default(""),
  title: z.string().default(""),
  score: z.number().nullable().default(null),
  url: z.string().default(""),
  legitimacy: z.string().default(""),
  pdf: z.string().default(""),
  raw: z.string().optional(),
});

export const reportListSchema = z.array(reportSummarySchema);
