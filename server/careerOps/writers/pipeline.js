import { z } from "zod";
import { careerPath, ensureUserLayerDirs } from "../paths.js";
import { assertFresh, readText, writeTextAtomic } from "../io.js";
import { parsePipelineMarkdown } from "../parsers/pipeline.js";

const urlSchema = z.string().url();

export async function appendPipelineUrl(config, payload, ifMatch) {
  const url = urlSchema.parse(payload?.url);
  const company = String(payload?.company || "").trim();
  const role = String(payload?.role || "").trim();
  const filePath = careerPath(config, "data/pipeline.md");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  const raw = await readText(filePath, "# Pipeline\n\n## Pendientes\n\n## Procesadas\n");
  const line = `- [ ] ${url}${company ? ` | ${company}` : ""}${role ? ` | ${role}` : ""}`;
  const next = insertPendingLine(raw, line);
  await writeTextAtomic(filePath, next);
}

export async function removePipelineEntry(config, idx, ifMatch) {
  const filePath = careerPath(config, "data/pipeline.md");
  await assertFresh(filePath, ifMatch);
  const raw = await readText(filePath, "");
  const rows = parsePipelineMarkdown(raw);
  const target = rows.find((row) => row.idx === Number(idx));
  if (!target) {
    const error = new Error("Pipeline entry not found");
    error.statusCode = 404;
    throw error;
  }
  const lines = raw.split(/\r?\n/);
  lines.splice(target.idx, 1);
  await writeTextAtomic(filePath, lines.join("\n"));
}

function insertPendingLine(raw, line) {
  if (!raw.trim()) return `# Pipeline\n\n## Pendientes\n\n${line}\n\n## Procesadas\n`;
  const marker = "## Pendientes";
  const markerIndex = raw.indexOf(marker);
  if (markerIndex === -1) return `${raw.replace(/\s+$/, "")}\n\n${marker}\n\n${line}\n`;
  const afterMarker = markerIndex + marker.length;
  const nextSection = raw.indexOf("\n## ", afterMarker);
  const insertAt = nextSection === -1 ? raw.length : nextSection;
  return `${raw.slice(0, insertAt).replace(/\s+$/, "")}\n${line}\n${raw.slice(insertAt).replace(/^\n?/, "\n")}`;
}
