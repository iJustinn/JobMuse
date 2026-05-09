import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  displayName: z.string().min(1),
  pronouns: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  openToRemote: z.boolean().default(true),
  personalSite: z.string().url().optional().or(z.literal("")),
  github: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  defaultSummary: z.string().optional().default(""),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  initials: z.string().optional().default(""),
});

export const profilePatchSchema = profileSchema.partial().omit({ id: true, email: true });
