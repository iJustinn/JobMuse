import { z } from "zod";

export const portalSchema = z.object({
  name: z.string().min(1),
  careers_url: z.string().default(""),
  scan_method: z.string().default("playwright"),
  api: z.string().default(""),
  scan_query: z.string().default(""),
  notes: z.string().default(""),
  enabled: z.boolean().default(true),
});

export const portalListSchema = z.array(portalSchema);
