import { Router } from "express";
import { normalizeApplicationStatus } from "../../shared/schemas/application.js";
import { createAsyncJob } from "../careerOps/runner.js";
import { evaluateApplication } from "../careerOps/modeBridge.js";
import { parseApplicationsFile } from "../careerOps/parsers/applications.js";
import { listReports, parseReportFile } from "../careerOps/parsers/reports.js";
import { patchApplicationNotes, patchApplicationStatus } from "../careerOps/writers/status.js";

export function createApplicationsRouter(config) {
  const router = Router();

  router.get("/applications", async (req, res, next) => {
    try {
      const { rows, ...meta } = await parseApplicationsFile(config);
      const status = req.query.status ? normalizeApplicationStatus(req.query.status) : "";
      const search = String(req.query.search || "").toLowerCase().trim();
      let filtered = rows;
      if (status) filtered = filtered.filter((row) => row.status === status);
      if (search) {
        filtered = filtered.filter((row) => `${row.company} ${row.role} ${row.notes}`.toLowerCase().includes(search));
      }
      res.json({ ...meta, rows: sortRows(filtered, req.query.sort) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/applications/:num", async (req, res, next) => {
    try {
      const apps = await parseApplicationsFile(config);
      const row = apps.rows.find((item) => item.num === Number(req.params.num));
      if (!row) return res.status(404).json({ error: "Application not found" });
      const reports = await listReports(config);
      const report = reports.find((item) => item.num === row.num);
      const reportBody = report ? await parseReportFile(config, report.filename, { includeRaw: true }) : null;
      res.json({ row, report: reportBody });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/applications/:num/status", async (req, res, next) => {
    try {
      await patchApplicationStatus(config, req.params.num, req.body?.status, req.headers["if-match"]);
      res.json(await parseApplicationsFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/applications/:num/notes", async (req, res, next) => {
    try {
      await patchApplicationNotes(config, req.params.num, req.body?.notes, req.headers["if-match"]);
      res.json(await parseApplicationsFile(config));
    } catch (error) {
      next(error);
    }
  });

  router.post("/applications/evaluate", async (req, res) => {
    const job = createAsyncJob("oferta mode bridge", (events) => evaluateApplication(config, req.body, events));
    res.status(202).json({ jobId: job.id, job });
  });

  router.post("/applications/:num/pdf", (_req, res) => {
    res.status(501).json({ error: "PDF mode bridge is not implemented yet" });
  });

  return router;
}

function sortRows(rows, sort) {
  const copy = [...rows];
  if (sort === "score") return copy.sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sort === "date") return copy.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return copy.sort((a, b) => b.num - a.num);
}
