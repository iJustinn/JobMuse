import { z } from "zod";

export const jdSignalSchema = z.object({
  phrase: z.string().min(1),
  kind: z.string().min(1),
  weight: z.number().min(0).max(1).default(0.5),
});

export const jdSignalsResponseSchema = z.array(jdSignalSchema);
