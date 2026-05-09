import { JR_DATA } from "../../src/data.js";
import { buildLocalCvRevision } from "../../shared/cvRevisions.js";

export function getAiStatus(config) {
  return {
    configured: Boolean(config.deepseek.apiKey),
    baseUrl: config.deepseek.baseUrl,
    model: config.deepseek.model,
  };
}

export async function generateCv(payload, config) {
  const fallback = createMockGeneratedCv(payload, config.deepseek.model);
  if (!config.deepseek.apiKey) return fallback;

  try {
    const parsed = await callDeepSeekJson(config.deepseek, [
      {
        role: "system",
        content:
          "You are JobMuse, a CV tailoring assistant. Return strict JSON only. Do not include markdown.",
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Create a tailored CV for this job application.",
          expected_shape: {
            company: "string",
            role: "string",
            match: "number from 0 to 100",
            cv: {
              header: { name: "string", contact: "string" },
              summary: "string",
              experience: [
                {
                  company: "string",
                  role: "string",
                  dates: "string",
                  bullets: ["string"],
                  highlight: ["string"],
                },
              ],
              projects: [{ name: "string", note: "string", highlight: ["string"] }],
              education: { school: "string", degree: "string", detail: "string" },
              skills: "string",
            },
            changes: [{ section: "string", note: "string" }],
          },
          user: JR_DATA.user,
          memory: JR_DATA.memory,
          job: {
            company: payload?.company || "Target company",
            role: payload?.role || "Target role",
            description: payload?.jd || JR_DATA.sampleJD,
          },
          baseCv: JR_DATA.generatedCV,
        }),
      },
    ]);

    return normalizeGeneratedCv(parsed, {
      fallback,
      model: config.deepseek.model,
      source: "deepseek",
    });
  } catch (error) {
    return {
      ...fallback,
      source: "mock-fallback",
      warning: error instanceof Error ? error.message : "DeepSeek request failed",
    };
  }
}

export async function reviseCv(payload, config) {
  const fallback = createMockRevision(payload, config.deepseek.model);
  if (!config.deepseek.apiKey) return fallback;

  try {
    const parsed = await callDeepSeekJson(config.deepseek, [
      {
        role: "system",
        content:
          "You are JobMuse, revising a tailored CV. Return strict JSON only with reply, patch, cv, and changes fields.",
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Revise the current CV according to the user's message.",
          expected_shape: {
            reply: "short user-facing summary of the revision",
            patch: "short label for the changed section",
            cv: "the full revised CV object using the same shape as currentCv",
            changes: [{ section: "string", note: "string" }],
          },
          message: payload?.message || "",
          currentCv: payload?.currentCv || JR_DATA.generatedCV,
          currentPatches: payload?.patches || [],
          jobDescription: payload?.jd || JR_DATA.sampleJD,
          memory: JR_DATA.memory,
        }),
      },
    ]);

    return normalizeRevision(parsed, {
      fallback,
      model: config.deepseek.model,
      source: "deepseek",
    });
  } catch (error) {
    return {
      ...fallback,
      source: "mock-fallback",
      warning: error instanceof Error ? error.message : "DeepSeek request failed",
    };
  }
}

async function callDeepSeekJson(config, messages) {
  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(config.timeoutMs || 20000),
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek returned HTTP ${response.status}`);
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("DeepSeek returned an empty response");
  }

  return JSON.parse(stripJsonFence(content));
}

function normalizeGeneratedCv(value, { fallback, model, source }) {
  const cv = value?.cv && isCv(value.cv) ? value.cv : fallback.cv;
  const changes = Array.isArray(value?.changes) && value.changes.length
    ? value.changes.filter(isChange).slice(0, 8)
    : fallback.changes;

  return {
    company: typeof value?.company === "string" ? value.company : fallback.company,
    role: typeof value?.role === "string" ? value.role : fallback.role,
    match: clampMatch(value?.match ?? fallback.match),
    cv,
    changes,
    model,
    source,
  };
}

function normalizeRevision(value, { fallback, model, source }) {
  const cv = value?.cv && isCv(value.cv) ? value.cv : fallback.cv;
  const changes = Array.isArray(value?.changes) && value.changes.length
    ? value.changes.filter(isChange).slice(0, 8)
    : fallback.changes;

  return {
    reply: typeof value?.reply === "string" && value.reply.trim() ? value.reply.trim() : fallback.reply,
    patch: typeof value?.patch === "string" && value.patch.trim() ? value.patch.trim() : fallback.patch,
    cv,
    changes,
    model,
    source,
  };
}

function createMockGeneratedCv(payload, model) {
  return {
    company: payload?.company || "Cresta",
    role: payload?.role || "Data Science Intern",
    match: 91,
    cv: JR_DATA.generatedCV,
    changes: JR_DATA.cvChanges,
    model,
    source: "mock",
  };
}

function createMockRevision(payload, model) {
  return buildLocalCvRevision({
    message: payload?.message || "",
    currentCv: payload?.currentCv || JR_DATA.generatedCV,
    model,
    source: "mock",
  });
}

function isCv(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.header &&
      typeof value.header.name === "string" &&
      typeof value.header.contact === "string" &&
      typeof value.summary === "string" &&
      Array.isArray(value.experience) &&
      Array.isArray(value.projects) &&
      value.education &&
      typeof value.skills === "string"
  );
}

function isChange(value) {
  return Boolean(
    value &&
      typeof value.section === "string" &&
      typeof value.note === "string"
  );
}

function clampMatch(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 87;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function stripJsonFence(content) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}
