import { careerPath, ensureUserLayerDirs } from "../paths.js";
import { assertFresh, writeTextAtomic } from "../io.js";

export async function writeCvFile(config, raw, ifMatch) {
  const filePath = careerPath(config, "cv.md");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  await writeTextAtomic(filePath, String(raw || "").replace(/\s+$/, "") + "\n");
}
