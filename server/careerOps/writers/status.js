import { z } from "zod";
import { applicationStatusSchema, normalizeApplicationStatus } from "../../../shared/schemas/application.js";
import { applicationsPath } from "../paths.js";
import { assertFresh, formatMarkdownRow, readText, splitMarkdownRow, writeTextAtomic } from "../io.js";

export async function patchApplicationStatus(config, num, status, ifMatch) {
  const normalized = applicationStatusSchema.parse(normalizeApplicationStatus(status));
  return patchApplicationColumn(config, num, "status", normalized, ifMatch);
}

export async function patchApplicationNotes(config, num, notes, ifMatch) {
  return patchApplicationColumn(config, num, "notes", z.string().parse(notes || ""), ifMatch);
}

async function patchApplicationColumn(config, num, column, value, ifMatch) {
  const filePath = applicationsPath(config);
  await assertFresh(filePath, ifMatch);
  const raw = await readText(filePath, "");
  const lines = raw.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().startsWith("|") && !line.includes("---"));
  const headers = headerIndex >= 0 ? splitMarkdownRow(lines[headerIndex]).map(normalizeHeader) : [];
  const columnIndex = headers.indexOf(column);
  if (columnIndex === -1) {
    const error = new Error(`Cannot find ${column} column in applications.md`);
    error.statusCode = 400;
    throw error;
  }

  const rowIndex = lines.findIndex((line, index) => {
    if (index <= headerIndex || !line.trim().startsWith("|") || line.includes("---")) return false;
    const parts = splitMarkdownRow(line);
    return Number(parts[0]) === Number(num);
  });
  if (rowIndex === -1) {
    const error = new Error("Application row not found");
    error.statusCode = 404;
    throw error;
  }

  const parts = splitMarkdownRow(lines[rowIndex]);
  parts[columnIndex] = value;
  lines[rowIndex] = formatMarkdownRow(parts);
  await writeTextAtomic(filePath, lines.join("\n"));
  return { num: Number(num), [column]: value };
}

function normalizeHeader(value) {
  const key = String(value || "").trim().toLowerCase().replace(/\*\*/g, "");
  if (key === "#") return "num";
  if (key === "score/5") return "score";
  if (key === "report-link") return "report";
  if (key === "note") return "notes";
  return key;
}
