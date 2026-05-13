import {
  normalizeApplicationStatus,
  parseApplicationScore,
} from "../../../shared/schemas/application.js";
import { applicationsPath } from "../paths.js";
import { readJsonStat, readText, splitMarkdownRow } from "../io.js";

const FIELD_ALIASES = new Map([
  ["#", "num"],
  ["no", "num"],
  ["date", "date"],
  ["fecha", "date"],
  ["company", "company"],
  ["empresa", "company"],
  ["role", "role"],
  ["puesto", "role"],
  ["score", "score"],
  ["score/5", "score"],
  ["status", "status"],
  ["estado", "status"],
  ["pdf", "pdf"],
  ["report", "report"],
  ["report-link", "report"],
  ["notes", "notes"],
  ["note", "notes"],
]);

export async function parseApplicationsFile(config) {
  const filePath = applicationsPath(config);
  const raw = await readText(filePath, "");
  const stat = await readJsonStat(filePath);
  const rows = parseApplicationsMarkdown(raw);
  return { raw, rows, etag: stat.etag, path: filePath };
}

export function parseApplicationsMarkdown(raw = "") {
  const lines = raw.split(/\r?\n/);
  const headerLine = lines.find((line) => line.trim().startsWith("|") && !line.includes("---"));
  const header = headerLine ? splitMarkdownRow(headerLine).map(normalizeHeader) : [];
  const fallbackHeader = ["num", "date", "company", "role", "score", "status", "pdf", "report", "notes"];
  const fields = header.length >= 8 ? header : fallbackHeader;

  return lines
    .filter((line) => line.trim().startsWith("|") && !line.includes("---"))
    .map((line) => ({ line, parts: splitMarkdownRow(line) }))
    .filter(({ parts }) => parts.length >= 8 && Number.isFinite(Number(parts[0])))
    .map(({ line, parts }) => {
      const row = {};
      fields.forEach((field, index) => {
        row[field] = parts[index] || "";
      });
      const scoreText = row.score || "";
      return {
        num: Number(row.num),
        date: row.date || "",
        company: row.company || "",
        role: row.role || "",
        score: parseApplicationScore(scoreText),
        scoreText,
        status: normalizeApplicationStatus(row.status),
        pdf: row.pdf || "",
        report: row.report || "",
        notes: row.notes || "",
        raw: line,
      };
    });
}

function normalizeHeader(value) {
  const key = String(value || "").trim().toLowerCase().replace(/\*\*/g, "");
  return FIELD_ALIASES.get(key) || key;
}
