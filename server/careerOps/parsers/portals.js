import { careerPath } from "../paths.js";
import { readJsonStat, readText } from "../io.js";
import { parseYaml } from "./yaml.js";

export async function parsePortalsFile(config) {
  const filePath = careerPath(config, "portals.yml");
  const raw = await readText(filePath, "");
  const parsed = raw.trim() ? parseYaml(raw) : {};
  const stat = await readJsonStat(filePath);
  return {
    raw,
    data: parsed,
    portals: Array.isArray(parsed.tracked_companies) ? parsed.tracked_companies : [],
    etag: stat.etag,
    path: filePath,
  };
}
