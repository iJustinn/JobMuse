import { Router } from "express";
import { cancelJob, getJob, listJobs, subscribeJob } from "../careerOps/runner.js";

export function createJobsRouter() {
  const router = Router();

  router.get("/jobs", (_req, res) => {
    res.json({ rows: listJobs() });
  });

  router.get("/jobs/:id", (req, res) => {
    const job = getJob(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  });

  router.get("/jobs/:id/events", (req, res) => {
    if (!subscribeJob(req.params.id, res)) {
      res.status(404).json({ error: "Job not found" });
    }
  });

  router.post("/jobs/:id/cancel", (req, res) => {
    res.json({ cancelled: cancelJob(req.params.id) });
  });

  return router;
}
