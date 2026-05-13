import { Router } from "express";
import { listReports, parseReportFile } from "../careerOps/parsers/reports.js";

export function createReportsRouter(config) {
  const router = Router();

  router.get("/reports", async (req, res, next) => {
    try {
      let rows = await listReports(config);
      if (req.query.sort === "score") rows = rows.sort((a, b) => (b.score || 0) - (a.score || 0));
      const limit = Number(req.query.limit || 0);
      res.json({ rows: limit > 0 ? rows.slice(0, limit) : rows });
    } catch (error) {
      next(error);
    }
  });

  router.get("/reports/:filename", async (req, res, next) => {
    try {
      res.json(await parseReportFile(config, req.params.filename, { includeRaw: true }));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
