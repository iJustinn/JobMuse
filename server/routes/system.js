import { Router } from "express";
import { getSetupStatus } from "../careerOps/paths.js";
import { runScriptJob } from "../careerOps/runner.js";
import { startCareerOpsWatcher, subscribeSystemEvents } from "../careerOps/watcher.js";
import { getLlmStatus } from "../services/llm/index.js";

export function createSystemRouter(config) {
  const router = Router();

  router.get("/system/setup", async (_req, res, next) => {
    try {
      res.json(await getSetupStatus(config));
    } catch (error) {
      next(error);
    }
  });

  router.get("/system/events", (req, res) => {
    startCareerOpsWatcher(config);
    subscribeSystemEvents(res);
  });

  router.post("/system/update/check", async (_req, res, next) => {
    try {
      res.json(await runScriptJob(config, "updateSystem", ["check"]));
    } catch (error) {
      next(error);
    }
  });

  router.post("/system/update/apply", async (_req, res, next) => {
    try {
      res.json(await runScriptJob(config, "updateSystem", ["apply"]));
    } catch (error) {
      next(error);
    }
  });

  router.get("/system/llm", (_req, res) => {
    res.json(getLlmStatus(config));
  });

  router.put("/system/llm", (req, res) => {
    const provider = req.body?.provider || config.llm.provider;
    const model = req.body?.model || config.llm.model;
    config.llm = { ...config.llm, provider, model };
    res.json(getLlmStatus(config));
  });

  return router;
}
