import { z } from "zod";

export const userSettingsSchema = z.object({
  defaultTone: z.string().default("direct"),
  cvLengthCap: z.string().default("1page"),
  autoIncludeProjectsWhenJdMentions: z.string().optional().default(""),
  showChangelog: z.boolean().default(true),
  autoCaptureFromCoverLetters: z.boolean().default(true),
  confidenceThreshold: z.number().min(0).max(1).default(0.65),
  forgetFactsOlderThan: z.string().nullable().optional(),
  defaultExportFormat: z.string().default("pdf-letter"),
  filenamePattern: z.string().default("{name}__{company}__{role}.pdf"),
  includeSourceLinks: z.boolean().default(false),
  density: z.enum(["compact", "cozy", "roomy"]).default("cozy"),
  darkMode: z.boolean().default(false),
  cvLayout: z.enum(["split", "cv-first", "stacked"]).default("split"),
});

export const userSettingsPatchSchema = userSettingsSchema.partial();
