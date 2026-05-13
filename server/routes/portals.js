import { Router } from "express";
import { parsePortalsFile } from "../careerOps/parsers/portals.js";
import { writePortalsFile } from "../careerOps/writers/portals.js";

export function createPortalsRouter(config) {
  const router = Router();

  router.get("/portals", async (_req, res, next) => {
    try {
      res.json(await parsePortalsFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.put("/portals", async (req, res, next) => {
    try {
      await writePortalsFile(config, req.body, req.headers["if-match"]);
      res.json(await parsePortalsFile(config));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
