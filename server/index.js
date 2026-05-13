import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerConfig } from "./config.js";
import { createCareerOpsRouter } from "./routes/careerOps.js";

export function createServer(config = readServerConfig()) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors({
    origin: [config.appBaseUrl, "http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", createCareerOpsRouter(config));

  app.use((req, res) => {
    res.status(404).json({ error: "Not found", path: req.path });
  });

  app.use((error, _req, res, _next) => {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(error.statusCode || 500).json({ error: message });
  });

  return app;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const config = readServerConfig();
  const app = createServer(config);

  app.listen(config.port, () => {
    console.log(`JobMuse API listening on http://localhost:${config.port}`);
  });
}
