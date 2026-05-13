import { careerPath } from "../paths.js";
import { readJsonStat, readText } from "../io.js";

export async function parsePipelineFile(config) {
  const filePath = careerPath(config, "data/pipeline.md");
  const raw = await readText(filePath, "");
  const stat = await readJsonStat(filePath);
  return {
    raw,
    rows: parsePipelineMarkdown(raw),
    etag: stat.etag,
    path: filePath,
  };
}

export function parsePipelineMarkdown(raw = "") {
  return raw
    .split(/\r?\n/)
    .map((line, lineIndex) => {
      const match = line.match(/^\s*-\s+\[([ xX])\]\s+(https?:\/\/\S+)(?:\s+\|\s*([^|]+))?(?:\s+\|\s*(.+))?/);
      if (!match) return null;
      return {
        idx: lineIndex,
        checked: match[1].toLowerCase() === "x",
        url: match[2],
        company: (match[3] || "").trim(),
        role: (match[4] || "").trim(),
        raw: line,
      };
    })
    .filter(Boolean);
}
