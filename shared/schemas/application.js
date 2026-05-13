import { z } from "zod";

export const APPLICATION_STATUS_IDS = [
  "evaluated",
  "applied",
  "responded",
  "interview",
  "offer",
  "rejected",
  "discarded",
  "skip",
];

export const APPLICATION_STATUS_LABELS = {
  evaluated: "Evaluated",
  applied: "Applied",
  responded: "Responded",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  discarded: "Discarded",
  skip: "SKIP",
};

const STATUS_ALIASES = new Map([
  ["evaluated", "evaluated"],
  ["evaluada", "evaluated"],
  ["applied", "applied"],
  ["aplicado", "applied"],
  ["aplicada", "applied"],
  ["enviada", "applied"],
  ["sent", "applied"],
  ["responded", "responded"],
  ["respondido", "responded"],
  ["interview", "interview"],
  ["entrevista", "interview"],
  ["offer", "offer"],
  ["oferta", "offer"],
  ["rejected", "rejected"],
  ["rechazado", "rejected"],
  ["rechazada", "rejected"],
  ["discarded", "discarded"],
  ["descartado", "discarded"],
  ["descartada", "discarded"],
  ["cerrada", "discarded"],
  ["cancelada", "discarded"],
  ["skip", "skip"],
  ["no_aplicar", "skip"],
  ["no aplicar", "skip"],
  ["monitor", "skip"],
]);

export const applicationStatusSchema = z.enum(APPLICATION_STATUS_IDS);

export const applicationSchema = z.object({
  num: z.number().int().positive(),
  date: z.string().default(""),
  company: z.string().default(""),
  role: z.string().default(""),
  score: z.number().min(0).max(5).nullable().default(null),
  scoreText: z.string().default(""),
  status: applicationStatusSchema.default("evaluated"),
  pdf: z.string().default(""),
  report: z.string().default(""),
  notes: z.string().default(""),
  raw: z.string().optional(),
});

export const applicationListSchema = z.array(applicationSchema);

export function normalizeApplicationStatus(value) {
  const clean = String(value || "")
    .replace(/\*\*/g, "")
    .replace(/\s+\d{4}-\d{2}-\d{2}.*$/, "")
    .trim()
    .toLowerCase();

  return STATUS_ALIASES.get(clean) || "evaluated";
}

export function displayApplicationStatus(status) {
  const normalized = normalizeApplicationStatus(status);
  return APPLICATION_STATUS_LABELS[normalized] || APPLICATION_STATUS_LABELS.evaluated;
}

export function parseApplicationScore(value) {
  const match = String(value || "").replace(/\*\*/g, "").match(/([\d.]+)/);
  if (!match) return null;
  const score = Number(match[1]);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(5, score));
}
