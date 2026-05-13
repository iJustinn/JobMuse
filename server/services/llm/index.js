import { callDeepSeek } from "./deepseek.js";
import { callAnthropic } from "./anthropic.js";
import { callGemini } from "./gemini.js";

const PROVIDERS = {
  deepseek: callDeepSeek,
  anthropic: callAnthropic,
  gemini: callGemini,
};

export async function callLlm(config, request) {
  const provider = config.llm?.provider || "deepseek";
  const fn = PROVIDERS[provider] || PROVIDERS.deepseek;
  return await fn(config, request);
}

export function getLlmStatus(config) {
  return {
    provider: config.llm?.provider || "deepseek",
    model: config.llm?.model || config.deepseek?.model || "",
    configured: Boolean(
      config.deepseek?.apiKey ||
      config.anthropic?.apiKey ||
      config.gemini?.apiKey
    ),
  };
}
