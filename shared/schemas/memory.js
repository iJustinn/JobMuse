import { z } from "zod";

export const memoryFactSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().min(1),
  text: z.string().min(1),
  sourceKind: z.enum(["manual", "file", "linkedin", "interview-prep", "import"]).default("manual"),
  sourceFileId: z.string().uuid().nullable().optional(),
  confidence: z.number().min(0).max(1).default(1),
});

export const memoryFactCreateSchema = memoryFactSchema.omit({ id: true });
export const memoryFactPatchSchema = memoryFactCreateSchema.partial();
