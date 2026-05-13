import { Router } from "express";
import { createApplicationsRouter } from "./applications.js";
import { createCvRouter } from "./cv.js";
import { createInsightsRouter } from "./insights.js";
import { createJobsRouter } from "./jobs.js";
import { createPipelineRouter } from "./pipeline.js";
import { createPortalsRouter } from "./portals.js";
import { createProfileRouter } from "./profile.js";
import { createReportsRouter } from "./reports.js";
import { createScanRouter } from "./scan.js";
import { createStoriesRouter } from "./stories.js";
import { createSystemRouter } from "./system.js";

export function createCareerOpsRouter(config) {
  const router = Router();
  router.use(createSystemRouter(config));
  router.use(createJobsRouter(config));
  router.use(createProfileRouter(config));
  router.use(createCvRouter(config));
  router.use(createApplicationsRouter(config));
  router.use(createPipelineRouter(config));
  router.use(createPortalsRouter(config));
  router.use(createScanRouter(config));
  router.use(createReportsRouter(config));
  router.use(createStoriesRouter(config));
  router.use(createInsightsRouter(config));
  return router;
}
