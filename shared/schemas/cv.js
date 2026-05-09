import { z } from "zod";

export const cvHeaderSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(1),
});

export const cvExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  dates: z.string().default(""),
  bullets: z.array(z.string()).default([]),
  highlight: z.array(z.string()).default([]),
});

export const cvProjectSchema = z.object({
  name: z.string().min(1),
  note: z.string().default(""),
  highlight: z.array(z.string()).default([]),
});

export const cvEducationSchema = z.object({
  school: z.string().default(""),
  degree: z.string().default(""),
  detail: z.string().default(""),
});

export const generatedCvSchema = z.object({
  header: cvHeaderSchema,
  summary: z.string().default(""),
  experience: z.array(cvExperienceSchema),
  projects: z.array(cvProjectSchema),
  education: cvEducationSchema,
  skills: z.string().default(""),
});

export const cvChangeSchema = z.object({
  section: z.string().min(1),
  note: z.string().min(1),
});

export const generatedCvResponseSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  match: z.number().min(0).max(100),
  cv: generatedCvSchema,
  changes: z.array(cvChangeSchema),
  model: z.string().min(1),
  source: z.string().min(1),
  warning: z.string().optional(),
});

export const revisionResponseSchema = z.object({
  reply: z.string().min(1),
  patch: z.string().min(1),
  cv: generatedCvSchema,
  changes: z.array(cvChangeSchema).default([]),
  model: z.string().min(1),
  source: z.string().min(1),
  warning: z.string().optional(),
});

export const generateCvRequestSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  jd: z.string().optional(),
  memory: z.unknown().optional(),
  user: z.unknown().optional(),
});

export const reviseCvRequestSchema = z.object({
  message: z.string().min(1),
  jd: z.string().optional(),
  currentCv: z.unknown().optional(),
  patches: z.array(z.unknown()).optional(),
});

export function isGeneratedCv(value) {
  return generatedCvSchema.safeParse(value).success;
}

export function isGeneratedCvResponse(value) {
  return generatedCvResponseSchema.safeParse(value).success;
}

export function isRevisionResponse(value) {
  return revisionResponseSchema.safeParse(value).success;
}
