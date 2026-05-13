import { promises as fs } from "node:fs";
import path from "node:path";
import { reportSummarySchema } from "../../../shared/schemas/report.js";
import { careerPath } from "../paths.js";
import { readText } from "../io.js";

export async function listReports(config) {
  const reportsDir = careerPath(config, "reports");
  let entries = [];
  try {
    entries = await fs.readdir(reportsDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const reports = await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map(async (entry) => parseReportFile(config, entry.name, { includeRaw: false })));

  return reports
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.num || 0) - (a.num || 0));
}

export async function parseReportFile(config, filename, options = {}) {
  if (filename.includes("/") || filename.includes("..")) {
    throw new Error("Invalid report filename");
  }
  const raw = await readText(careerPath(config, path.join("reports", filename)), "");
  const summary = parseReportMarkdown(filename, raw);
  return options.includeRaw ? { ...summary, raw } : summary;
}

export function parseReportMarkdown(filename, raw = "") {
  const name = path.basename(filename, ".md");
  const fileMatch = name.match(/^(\d+)-(.+?)(?:-(\d{4}-\d{2}-\d{2}))?$/);
  const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() || name;
  const score = raw.match(/(?:score|puntuaci[oó]n)[^\d\n]{0,20}(\d+(?:\.\d+)?)(?:\s*\/\s*5)?/i)?.[1];
  const url = raw.match(/https?:\/\/[^\s)]+/)?.[0] || "";
  const legitimacy = raw.match(/legitimacy[^\n:]*:\s*([^\n]+)/i)?.[1]?.trim()
    || raw.match(/legitimidad[^\n:]*:\s*([^\n]+)/i)?.[1]?.trim()
    || "";

  return reportSummarySchema.parse({
    filename,
    num: fileMatch ? Number(fileMatch[1]) : null,
    slug: fileMatch?.[2] || name,
    date: fileMatch?.[3] || "",
    title,
    score: score ? Math.max(0, Math.min(5, Number(score))) : null,
    url,
    legitimacy,
    pdf: "",
  });
}
