import { isGeneratedCvResponse, isRevisionResponse } from "./schemas.js";

export const AI_MODEL_ID = "deepseek-v4-flash";
export const AI_MODEL_LABEL = AI_MODEL_ID;

export async function requestGeneratedCv(payload) {
  const data = await requestJson("/api/generate-cv", payload);
  if (!isGeneratedCvResponse(data)) {
    throw new Error("Generated CV response did not match the expected shape");
  }
  return data;
}

export async function requestCvRevision(payload) {
  const data = await requestJson("/api/revise-cv", payload);
  if (!isRevisionResponse(data)) {
    throw new Error("CV revision response did not match the expected shape");
  }
  return data;
}

export async function requestAiStatus() {
  const response = await fetch("/api/ai-status");
  if (!response.ok) {
    throw new Error(`AI status request failed with status ${response.status}`);
  }
  return response.json();
}

async function requestJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  return response.json();
}
