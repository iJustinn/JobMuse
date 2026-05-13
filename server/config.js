import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function readServerConfig(env = process.env) {
  const careerOpsPath = env.CAREER_OPS_PATH
    ? path.resolve(env.CAREER_OPS_PATH)
    : path.join(repoRoot, "career-ops");
  const provider = env.LLM_PROVIDER || "deepseek";
  return {
    appBaseUrl: env.APP_BASE_URL || "http://localhost:5173",
    port: Number(env.PORT || env.API_PORT || 8787),
    repoRoot,
    careerOps: {
      path: careerOpsPath,
      source: env.CAREER_OPS_PATH ? "external-path" : "submodule",
      required: ["cv.md", "config/profile.yml", "modes", "data"],
    },
    llm: {
      provider,
      model: env.LLM_MODEL || env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      language: env.CAREER_OPS_LANGUAGE || "en",
    },
    deepseek: {
      apiKey: env.DEEPSEEK_API_KEY || "",
      baseUrl: env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      model: env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      timeoutMs: Number(env.DEEPSEEK_TIMEOUT_MS || 8000),
    },
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY || "",
      model: env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    },
    gemini: {
      apiKey: env.GEMINI_API_KEY || "",
      model: env.GEMINI_MODEL || "gemini-2.5-pro",
    },
    supabase: {
      url: env.SUPABASE_URL || "",
      anonKey: env.SUPABASE_ANON_KEY || "",
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || "",
    },
    databaseUrl: env.DATABASE_URL || "",
  };
}
