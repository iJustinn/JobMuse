import { Router } from "express";
import { parseProfileFile } from "../careerOps/parsers/profile.js";
import { writeProfileFile } from "../careerOps/writers/profile.js";

export function createProfileRouter(config) {
  const router = Router();

  router.get("/profile", async (_req, res, next) => {
    try {
      res.json(await parseProfileFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.put("/profile", async (req, res, next) => {
    try {
      await writeProfileFile(config, req.body?.data || req.body, req.headers["if-match"]);
      res.json(await parseProfileFile(config));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
