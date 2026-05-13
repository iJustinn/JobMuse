import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathExists, pathExistsSync, readText } from "./io.js";
import { parseYaml } from "./parsers/yaml.js";

export const USER_LAYER_PATHS = [
  "cv.md",
  "config/profile.yml",
  "modes/_profile.md",
  "article-digest.md",
  "interview-prep/story-bank.md",
  "portals.yml",
  "data/applications.md",
  "data/pipeline.md",
  "data/scan-history.tsv",
  "data/follow-ups.md",
  "writing-samples",
  "reports",
  "output",
  "jds",
];

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SERVER_DIR, "..", "..");

export function getRepoRoot() {
  return REPO_ROOT;
}

export function getCareerOpsRoot(config = {}) {
  return path.resolve(config.careerOps?.path || path.join(REPO_ROOT, "career-ops"));
}

export function careerPath(config, relativePath = "") {
  const root = getCareerOpsRoot(config);
  const resolved = path.resolve(root, relativePath);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error("Resolved path escapes career-ops root");
  }
  return resolved;
}

export function applicationsPath(config) {
  const dataPath = careerPath(config, "data/applications.md");
  if (pathExistsSync(dataPath)) return dataPath;
  return careerPath(config, "applications.md");
}

export async function ensureUserLayerDirs(config) {
  await Promise.all([
    fs.mkdir(careerPath(config, "data"), { recursive: true }),
    fs.mkdir(careerPath(config, "reports"), { recursive: true }),
    fs.mkdir(careerPath(config, "output"), { recursive: true }),
    fs.mkdir(careerPath(config, "batch/tracker-additions"), { recursive: true }),
    fs.mkdir(careerPath(config, "interview-prep"), { recursive: true }),
    fs.mkdir(careerPath(config, "writing-samples"), { recursive: true }),
    fs.mkdir(careerPath(config, "jds"), { recursive: true }),
  ]);
}

export async function getSetupStatus(config) {
  const root = getCareerOpsRoot(config);
  const required = [
    "cv.md",
    "config/profile.yml",
    "modes",
    "data",
    "portals.yml",
  ];

  const checks = [];
  const rootExists = await pathExists(root);
  checks.push({
    id: "career-ops-root",
    label: "career-ops checkout",
    ok: rootExists,
    path: root,
    required: true,
  });

  for (const relativePath of required) {
    checks.push({
      id: relativePath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
      label: relativePath,
      ok: rootExists ? await pathExists(path.join(root, relativePath)) : false,
      path: path.join(root, relativePath),
      required: true,
    });
  }

  const nodeModules = rootExists && await pathExists(path.join(root, "node_modules"));
  checks.push({
    id: "career-ops-node-modules",
    label: "career-ops node_modules",
    ok: nodeModules,
    path: path.join(root, "node_modules"),
    required: false,
  });

  const playwrightPackage = rootExists && await pathExists(path.join(root, "node_modules/playwright"));
  checks.push({
    id: "playwright-package",
    label: "Playwright package",
    ok: playwrightPackage,
    path: path.join(root, "node_modules/playwright"),
    required: false,
  });

  let profile = { ok: false, message: "config/profile.yml not found" };
  const profilePath = path.join(root, "config/profile.yml");
  if (rootExists && await pathExists(profilePath)) {
    try {
      parseYaml(await readText(profilePath));
      profile = { ok: true, message: "profile.yml parseable" };
    } catch (error) {
      profile = { ok: false, message: error instanceof Error ? error.message : "profile.yml failed to parse" };
    }
  }
  checks.push({
    id: "profile-parseable",
    label: "profile.yml parseable",
    ok: profile.ok,
    message: profile.message,
    required: true,
  });

  const missingRequired = checks.filter((check) => check.required && !check.ok);
  return {
    ok: missingRequired.length === 0,
    careerOpsPath: root,
    source: config.careerOps?.source || "submodule",
    required,
    checks,
    commands: [
      "git submodule update --init",
      "cd career-ops && npm install && npx playwright install chromium",
      "cp career-ops/config/profile.example.yml career-ops/config/profile.yml",
      "cp career-ops/templates/portals.example.yml career-ops/portals.yml",
    ],
  };
}
