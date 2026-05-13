import { careerPath, ensureUserLayerDirs } from "../paths.js";
import { assertFresh, writeTextAtomic } from "../io.js";
import { stringifyYaml } from "../parsers/yaml.js";

export async function writePortalsFile(config, payload, ifMatch) {
  const filePath = careerPath(config, "portals.yml");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  const raw = typeof payload?.raw === "string"
    ? payload.raw
    : `${stringifyYaml(payload?.data || { tracked_companies: payload?.portals || [] }).trim()}\n`;
  await writeTextAtomic(filePath, raw.replace(/\s+$/, "") + "\n");
}
