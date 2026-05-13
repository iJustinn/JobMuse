import { careerPath, ensureUserLayerDirs } from "../paths.js";
import { assertFresh, writeTextAtomic } from "../io.js";

export async function writeStoryBankFile(config, raw, ifMatch) {
  const filePath = careerPath(config, "interview-prep/story-bank.md");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  await writeTextAtomic(filePath, String(raw || "").replace(/\s+$/, "") + "\n");
}

export async function writeArticleDigestFile(config, raw, ifMatch) {
  const filePath = careerPath(config, "article-digest.md");
  await ensureUserLayerDirs(config);
  await assertFresh(filePath, ifMatch);
  await writeTextAtomic(filePath, String(raw || "").replace(/\s+$/, "") + "\n");
}
