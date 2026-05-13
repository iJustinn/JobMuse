import { spawn } from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";
import { careerPath, getCareerOpsRoot } from "./paths.js";
import { pathExists } from "./io.js";

const jobs = new Map();
const subscribers = new Map();

const SCRIPT_MAP = {
  scan: "scan.mjs",
  mergeTracker: "merge-tracker.mjs",
  verifyPipeline: "verify-pipeline.mjs",
  analyzePatterns: "analyze-patterns.mjs",
  followupCadence: "followup-cadence.mjs",
  checkLiveness: "check-liveness.mjs",
  updateSystem: "update-system.mjs",
  generatePdf: "generate-pdf.mjs",
};

export function listJobs() {
  return Array.from(jobs.values())
    .map(publicJob)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 25);
}

export function getJob(id) {
  const job = jobs.get(id);
  return job ? publicJob(job) : null;
}

export function createAsyncJob(label, task) {
  const job = createJob(label);
  queueMicrotask(async () => {
    try {
      emitJob(job.id, "log", `${label} started`);
      const result = await task({
        log: (message) => emitJob(job.id, "log", message),
        progress: (message) => emitJob(job.id, "progress", message),
      });
      completeJob(job.id, result || {});
    } catch (error) {
      failJob(job.id, error);
    }
  });
  return publicJob(job);
}

export async function runScriptJob(config, scriptKey, args = []) {
  const scriptName = SCRIPT_MAP[scriptKey];
  if (!scriptName) throw new Error(`Unknown career-ops script: ${scriptKey}`);
  const scriptPath = careerPath(config, scriptName);
  if (!await pathExists(scriptPath)) {
    const error = new Error(`${scriptName} not found in career-ops checkout`);
    error.statusCode = 404;
    throw error;
  }

  const job = createJob(`${scriptName} ${args.join(" ")}`.trim());
  const started = Date.now();
  const child = spawn("node", [scriptPath, ...args], {
    cwd: getCareerOpsRoot(config),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  job.child = child;

  child.stdout.on("data", (chunk) => emitLines(job.id, "stdout", chunk));
  child.stderr.on("data", (chunk) => emitLines(job.id, "stderr", chunk));
  child.on("error", (error) => failJob(job.id, error));
  child.on("close", (exitCode) => {
    const result = {
      exitCode,
      durationMs: Date.now() - started,
      summary: exitCode === 0 ? "completed" : `exited with code ${exitCode}`,
    };
    if (exitCode === 0) completeJob(job.id, result);
    else failJob(job.id, new Error(result.summary), result);
  });

  return publicJob(job);
}

export function cancelJob(id) {
  const job = jobs.get(id);
  if (!job) return false;
  if (job.child && !job.done) {
    job.child.kill("SIGTERM");
    emitJob(id, "log", "Cancellation requested");
  }
  return true;
}

export function subscribeJob(id, res) {
  const job = jobs.get(id);
  if (!job) return false;
  setupSse(res);
  for (const event of job.events) sendSse(res, event.type, event.data);
  if (job.done) {
    sendSse(res, "done", publicJob(job));
    res.end();
    return true;
  }
  const set = subscribers.get(id) || new Set();
  set.add(res);
  subscribers.set(id, set);
  res.on("close", () => set.delete(res));
  return true;
}

export async function runScriptAndCollect(config, scriptKey, args = []) {
  const scriptName = SCRIPT_MAP[scriptKey];
  if (!scriptName) throw new Error(`Unknown career-ops script: ${scriptKey}`);
  const scriptPath = careerPath(config, scriptName);
  const root = getCareerOpsRoot(config);
  return await new Promise((resolve, reject) => {
    const child = spawn("node", [scriptPath, ...args], {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", reject);
    child.on("close", (exitCode) => {
      if (exitCode === 0) resolve({ stdout, stderr, exitCode });
      else reject(new Error(stderr || stdout || `${path.basename(scriptPath)} exited with ${exitCode}`));
    });
  });
}

function createJob(label) {
  const id = crypto.randomUUID();
  const job = {
    id,
    label,
    status: "running",
    startedAt: new Date().toISOString(),
    finishedAt: "",
    events: [],
    result: null,
    error: "",
    done: false,
  };
  jobs.set(id, job);
  return job;
}

function completeJob(id, result) {
  const job = jobs.get(id);
  if (!job || job.done) return;
  job.status = "completed";
  job.finishedAt = new Date().toISOString();
  job.result = result;
  job.done = true;
  emitJob(id, "done", publicJob(job), { close: true });
}

function failJob(id, error, result = null) {
  const job = jobs.get(id);
  if (!job || job.done) return;
  job.status = "failed";
  job.finishedAt = new Date().toISOString();
  job.error = error instanceof Error ? error.message : String(error);
  job.result = result;
  job.done = true;
  emitJob(id, "error", { error: job.error }, { close: true });
}

function emitLines(id, type, chunk) {
  for (const line of chunk.toString("utf8").split(/\r?\n/).filter(Boolean)) {
    emitJob(id, type, line);
  }
}

function emitJob(id, type, data, options = {}) {
  const job = jobs.get(id);
  const event = { type, data, at: new Date().toISOString() };
  if (job) job.events.push(event);
  const set = subscribers.get(id);
  if (set) {
    for (const res of set) sendSse(res, type, data);
    if (options.close) {
      for (const res of set) res.end();
      subscribers.delete(id);
    }
  }
}

function setupSse(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.write(": connected\n\n");
}

function sendSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function publicJob(job) {
  return {
    id: job.id,
    label: job.label,
    status: job.status,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
    result: job.result,
    error: job.error,
    events: job.events.slice(-200),
  };
}
