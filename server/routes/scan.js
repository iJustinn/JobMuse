import { Router } from "express";
import { parseScanHistoryFile } from "../careerOps/parsers/scanHistory.js";
import { runScriptJob } from "../careerOps/runner.js";

export function createScanRouter(config) {
  const router = Router();

  router.post("/scan", async (req, res, next) => {
    try {
      const args = [];
      if (req.body?.dryRun) args.push("--dry-run");
      if (req.body?.company) args.push("--company", req.body.company);
      res.status(202).json(await runScriptJob(config, "scan", args));
    } catch (error) {
      next(error);
    }
  });

  router.get("/scan/history", async (req, res, next) => {
    try {
      res.json({ rows: await parseScanHistoryFile(config, Number(req.query.limit || 50)) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
