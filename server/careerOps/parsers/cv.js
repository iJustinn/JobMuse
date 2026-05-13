import { careerPath } from "../paths.js";
import { readJsonStat, readText } from "../io.js";

export async function parseCvFile(config) {
  const filePath = careerPath(config, "cv.md");
  const raw = await readText(filePath, "");
  const stat = await readJsonStat(filePath);
  return {
    raw,
    parsed: parseCvMarkdown(raw),
    etag: stat.etag,
    path: filePath,
  };
}

export function parseCvMarkdown(raw = "") {
  const sections = [];
  let current = { title: "Body", body: [] };
  for (const line of raw.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (current.body.length || current.title !== "Body") sections.push({
        title: current.title,
        body: current.body.join("\n").trim(),
      });
      current = { title: heading[2].trim(), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.body.length || current.title !== "Body") {
    sections.push({ title: current.title, body: current.body.join("\n").trim() });
  }
  return { sections };
}
