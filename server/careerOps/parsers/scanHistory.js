import { careerPath } from "../paths.js";
import { readText } from "../io.js";

export async function parseScanHistoryFile(config, limit = 50) {
  const raw = await readText(careerPath(config, "data/scan-history.tsv"), "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = lines[0]?.split("\t").map((item) => item.trim()) || [];
  return lines.slice(1).slice(-limit).reverse().map((line) => {
    const values = line.split("\t");
    return Object.fromEntries(header.map((key, index) => [key || `col${index}`, values[index] || ""]));
  });
}
