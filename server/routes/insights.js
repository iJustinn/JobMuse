import { Router } from "express";
import { parseApplicationsFile } from "../careerOps/parsers/applications.js";
import { parsePipelineFile } from "../careerOps/parsers/pipeline.js";
import { runScriptAndCollect } from "../careerOps/runner.js";

export function createInsightsRouter(config) {
  const router = Router();

  router.get("/insights/patterns", async (_req, res, next) => {
    try {
      try {
        const result = await runScriptAndCollect(config, "analyzePatterns", []);
        return res.json({ source: "script", stdout: result.stdout });
      } catch {
        const apps = await parseApplicationsFile(config);
        const byStatus = Object.fromEntries(apps.rows.reduce((map, row) => {
          map.set(row.status, (map.get(row.status) || 0) + 1);
          return map;
        }, new Map()));
        res.json({ source: "fallback", byStatus, total: apps.rows.length });
      }
    } catch (error) {
      next(error);
    }
  });

  router.get("/insights/followups", async (_req, res, next) => {
    try {
      try {
        const result = await runScriptAndCollect(config, "followupCadence", []);
        return res.json({ source: "script", stdout: result.stdout });
      } catch {
        const apps = await parseApplicationsFile(config);
        res.json({ source: "fallback", rows: apps.rows.filter((row) => ["applied", "responded", "interview"].includes(row.status)).slice(0, 10) });
      }
    } catch (error) {
      next(error);
    }
  });

  router.get("/insights/health", async (_req, res, next) => {
    try {
      const pipeline = await parsePipelineFile(config);
      const apps = await parseApplicationsFile(config);
      res.json({
        source: "fallback",
        pendingPipeline: pipeline.rows.filter((row) => !row.checked).length,
        applications: apps.rows.length,
        missingReports: apps.rows.filter((row) => !row.report || row.report === "-").length,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
