import { Router } from "express";
import { generateCvRequestSchema, reviseCvRequestSchema } from "../../shared/schemas/cv.js";
import { validateBody } from "../middleware/validate.js";
import { generateCv, getAiStatus, reviseCv } from "../services/deepseek.js";

export function createCvRouter(config) {
  const router = Router();

  router.get("/ai-status", (_req, res) => {
    res.json(getAiStatus(config));
  });

  router.post(["/generate-cv", "/cv/generate"], validateBody(generateCvRequestSchema), async (req, res, next) => {
    try {
      res.json(await generateCv(req.body, config));
    } catch (error) {
      next(error);
    }
  });

  router.post(["/revise-cv", "/cv/revise"], validateBody(reviseCvRequestSchema), async (req, res, next) => {
    try {
      res.json(await reviseCv(req.body, config));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
