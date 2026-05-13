import { z } from "zod";

export const profileSchema = z.object({
  candidate: z.object({
    full_name: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    linkedin: z.string().default(""),
    portfolio_url: z.string().default(""),
    github: z.string().default(""),
  }).default({}),
  target_roles: z.object({
    primary: z.array(z.string()).default([]),
    archetypes: z.array(z.record(z.string(), z.unknown())).default([]),
  }).default({}),
  narrative: z.object({
    headline: z.string().default(""),
    exit_story: z.string().default(""),
    superpowers: z.array(z.string()).default([]),
    proof_points: z.array(z.record(z.string(), z.unknown())).default([]),
  }).default({}),
  compensation: z.record(z.string(), z.unknown()).default({}),
  location: z.record(z.string(), z.unknown()).default({}),
  cv: z.record(z.string(), z.unknown()).default({}),
  advancedOverrides: z.string().default(""),
});

export const profileWriteSchema = profileSchema.partial();
