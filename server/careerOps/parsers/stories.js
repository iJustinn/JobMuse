import { careerPath } from "../paths.js";
import { readJsonStat, readText } from "../io.js";

export async function parseStoryBankFile(config) {
  const filePath = careerPath(config, "interview-prep/story-bank.md");
  const raw = await readText(filePath, "");
  const stat = await readJsonStat(filePath);
  return {
    raw,
    stories: parseStoryBlocks(raw),
    etag: stat.etag,
    path: filePath,
  };
}

export async function parseArticleDigestFile(config) {
  const filePath = careerPath(config, "article-digest.md");
  const raw = await readText(filePath, "");
  const stat = await readJsonStat(filePath);
  return { raw, etag: stat.etag, path: filePath };
}

function parseStoryBlocks(raw = "") {
  return raw
    .split(/\n(?=##\s+)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const title = block.match(/^##\s+(.+)$/m)?.[1]?.trim() || `Story ${index + 1}`;
      return { id: index + 1, title, raw: block };
    });
}
