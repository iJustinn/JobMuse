import { z } from "zod";

export const pipelineEntrySchema = z.object({
  idx: z.number().int().min(0),
  checked: z.boolean().default(false),
  url: z.string().url(),
  company: z.string().default(""),
  role: z.string().default(""),
  raw: z.string().default(""),
});

export const pipelineListSchema = z.array(pipelineEntrySchema);
