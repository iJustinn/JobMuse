import { promises as fs } from "node:fs";
import fsSync from "node:fs";
import path from "node:path";

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function pathExistsSync(filePath) {
  return fsSync.existsSync(filePath);
}

export async function readText(filePath, fallback = "") {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function readJsonStat(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return {
      exists: true,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      etag: makeEtag(stat),
    };
  } catch (error) {
    if (error?.code === "ENOENT") return { exists: false, size: 0, mtimeMs: 0, etag: "" };
    throw error;
  }
}

export async function writeTextAtomic(filePath, text) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  await fs.writeFile(tempPath, text, "utf8");
  await fs.rename(tempPath, filePath);
}

export async function assertFresh(filePath, ifMatch) {
  if (!ifMatch) return;
  const stat = await readJsonStat(filePath);
  if (stat.exists && stat.etag !== ifMatch) {
    const error = new Error("File changed on disk. Reload before saving.");
    error.statusCode = 409;
    throw error;
  }
}

export function makeEtag(stat) {
  return `"${Math.round(stat.mtimeMs)}-${stat.size}"`;
}

export function splitMarkdownRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((part) => part.trim());
}

export function formatMarkdownRow(parts) {
  return `| ${parts.map((part) => String(part ?? "").trim()).join(" | ")} |`;
}

export function safeFilenamePart(value, fallback = "item") {
  const clean = String(value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return clean || fallback;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
