import { promises as fs } from "node:fs";
import path from "node:path";
import { displayApplicationStatus } from "../../shared/schemas/application.js";
import { careerPath, ensureUserLayerDirs } from "./paths.js";
import { readText, safeFilenamePart, todayIsoDate, writeTextAtomic } from "./io.js";
import { parseApplicationsFile } from "./parsers/applications.js";
import { runScriptJob } from "./runner.js";

export async function evaluateApplication(config, payload, events) {
  await ensureUserLayerDirs(config);
  const modeBody = await readText(careerPath(config, "modes/oferta.md"), "");
  const sharedBody = await readText(careerPath(config, "modes/_shared.md"), "");
  const cv = await readText(careerPath(config, "cv.md"), "");
  const profile = await readText(careerPath(config, "config/profile.yml"), "");
  const jdText = await resolveJobDescription(payload);

  events.log(`Loaded oferta mode (${modeBody.length + sharedBody.length} chars)`);
  events.log(`Loaded user inputs: cv=${cv.length} chars, profile=${profile.length} chars, jd=${jdText.length} chars`);

  const inferred = inferJob(payload, jdText);
  const apps = await parseApplicationsFile(config);
  const nextNum = Math.max(0, ...apps.rows.map((row) => row.num)) + 1;
  const date = todayIsoDate();
  const slug = safeFilenamePart(`${inferred.company}-${inferred.role}`, "application");
  const reportFilename = `${String(nextNum).padStart(3, "0")}-${slug}-${date}.md`;
  const reportPath = careerPath(config, path.join("reports", reportFilename));
  const score = estimateScore(jdText, cv, profile);
  const report = renderEvaluationReport({
    num: nextNum,
    date,
    company: inferred.company,
    role: inferred.role,
    url: payload?.url || "",
    score,
    jdText,
    mock: true,
  });

  await writeTextAtomic(reportPath, report);
  events.log(`Wrote report ${reportFilename}`);

  await ensureApplicationsFile(config);
  const trackerFile = careerPath(config, path.join("batch/tracker-additions", `${String(nextNum).padStart(3, "0")}-${slug}.tsv`));
  const reportLink = `[${String(nextNum).padStart(3, "0")}](${path.join("reports", reportFilename)})`;
  const trackerRow = [
    nextNum,
    date,
    inferred.company,
    inferred.role,
    displayApplicationStatus("evaluated"),
    `${score.toFixed(1)}/5`,
    "-",
    reportLink,
    payload?.url ? `Source: ${payload.url}` : "Source: pasted job description",
  ].join("\t");
  await writeTextAtomic(trackerFile, `${trackerRow}\n`);
  events.log("Staged tracker addition");

  const mergeJob = await runScriptJob(config, "mergeTracker", []);
  events.log(`Started merge-tracker job ${mergeJob.id}`);

  return {
    report: reportFilename,
    num: nextNum,
    score,
    mergeJobId: mergeJob.id,
    source: "mock-mode-bridge",
  };
}

async function resolveJobDescription(payload = {}) {
  if (payload.text?.trim()) return payload.text.trim();
  if (payload.url?.trim()) {
    try {
      const response = await fetch(payload.url, { signal: AbortSignal.timeout(8000) });
      if (response.ok) return await response.text();
    } catch {
      return `Job URL: ${payload.url}`;
    }
    return `Job URL: ${payload.url}`;
  }
  return "";
}

function inferJob(payload = {}, jdText = "") {
  const company = payload.company?.trim()
    || jdText.match(/company[:\s]+([A-Z][A-Za-z0-9 .&-]{2,40})/i)?.[1]?.trim()
    || "Target Company";
  const role = payload.role?.trim()
    || jdText.match(/(?:role|title|position)[:\s]+([A-Z][A-Za-z0-9 /,&()-]{2,70})/i)?.[1]?.trim()
    || jdText.match(/^#\s+(.+)$/m)?.[1]?.trim()
    || "Target Role";
  return { company, role };
}

function estimateScore(jdText, cv, profile) {
  const haystack = `${cv}\n${profile}`.toLowerCase();
  const jdWords = Array.from(new Set(jdText.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || []))
    .filter((word) => !STOPWORDS.has(word));
  if (!jdWords.length) return 3.0;
  const hits = jdWords.filter((word) => haystack.includes(word)).length;
  return Math.max(1, Math.min(5, 2.4 + (hits / jdWords.length) * 2.6));
}

function renderEvaluationReport({ num, date, company, role, url, score, jdText, mock }) {
  const excerpt = jdText.replace(/\s+/g, " ").slice(0, 900);
  return `# ${company} - ${role}

## Metadata
- Number: ${String(num).padStart(3, "0")}
- Date: ${date}
- URL: ${url || "Pasted job description"}
- Score: ${score.toFixed(1)}/5
- Legitimacy: Pending manual review
- Mode bridge: ${mock ? "mock-mode-bridge" : "llm"}

## Block A - Role fit
This preliminary GUI-generated report uses the career-ops file contract and staged tracker flow. It is intentionally conservative until an LLM provider is configured for full mode execution.

## Block B - Evidence
The bridge loaded \`cv.md\`, \`config/profile.yml\`, \`modes/oferta.md\`, and the job description before writing this report.

## Block C - Risks
- Verify the posting manually before applying.
- Run the native career-ops command if you need the full Claude Code tool loop.

## Block D - Recommendation
Status: ${displayApplicationStatus("evaluated")}

## Block E - Job description excerpt
${excerpt || "_No job description text was provided._"}

## Block F - Next actions
- Review this report in JobMuse.
- Generate a PDF after the PDF mode bridge is configured.
- Update tracker status from the Applications screen.
`;
}

async function ensureApplicationsFile(config) {
  const dataPath = careerPath(config, "data/applications.md");
  try {
    await fs.access(dataPath);
  } catch {
    await writeTextAtomic(dataPath, [
      "# Applications",
      "",
      "| # | Date | Company | Role | Score | Status | PDF | Report | Notes |",
      "|---|---|---|---|---|---|---|---|---|",
      "",
    ].join("\n"));
  }
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "are", "this", "that", "from", "will",
  "our", "job", "role", "work", "team", "have", "has", "into", "about", "their",
  "they", "them", "who", "what", "when", "where", "how", "all", "can", "not",
]);
