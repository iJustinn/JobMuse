import { profileWriteSchema } from "../../../shared/schemas/profile.js";
import { careerPath, ensureUserLayerDirs } from "../paths.js";
import { assertFresh, writeTextAtomic } from "../io.js";
import { stringifyYaml } from "../parsers/yaml.js";

export async function writeProfileFile(config, payload, ifMatch) {
  const parsed = profileWriteSchema.parse(payload || {});
  const { advancedOverrides = "", ...profile } = parsed;
  const filePath = careerPath(config, "config/profile.yml");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  await writeTextAtomic(filePath, `${stringifyYaml(profile).trim()}\n`);
  await writeTextAtomic(careerPath(config, "modes/_profile.md"), String(advancedOverrides || ""));
}
