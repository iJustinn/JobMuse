import { Router } from "express";
import { runScriptJob } from "../careerOps/runner.js";
import { parsePipelineFile } from "../careerOps/parsers/pipeline.js";
import { appendPipelineUrl, removePipelineEntry } from "../careerOps/writers/pipeline.js";

export function createPipelineRouter(config) {
  const router = Router();

  router.get("/pipeline", async (_req, res, next) => {
    try {
      res.json(await parsePipelineFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.post("/pipeline", async (req, res, next) => {
    try {
      await appendPipelineUrl(config, req.body, req.headers["if-match"]);
      res.status(201).json(await parsePipelineFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.delete("/pipeline/:idx", async (req, res, next) => {
    try {
      await removePipelineEntry(config, req.params.idx, req.headers["if-match"]);
      res.json(await parsePipelineFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.post("/pipeline/process", async (_req, res, next) => {
    try {
      res.status(202).json(await runScriptJob(config, "verifyPipeline", []));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
