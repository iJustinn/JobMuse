import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "Draft",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
]);

export const applicationSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().min(1),
  role: z.string().min(1),
  originalUrl: z.string().url().optional().or(z.literal("")),
  jdText: z.string().default(""),
  jdSignals: z.array(z.unknown()).default([]),
  matchScore: z.number().int().min(0).max(100).nullable().optional(),
  status: applicationStatusSchema.default("Draft"),
  notes: z.string().optional().default(""),
});

export const applicationCreateSchema = applicationSchema.omit({ id: true }).partial({
  jdSignals: true,
  matchScore: true,
  status: true,
  notes: true,
});

export const applicationPatchSchema = applicationSchema.partial().omit({ id: true });
