import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

export function readServerConfig(env = process.env) {
  return {
    appBaseUrl: env.APP_BASE_URL || "http://localhost:5173",
    port: Number(env.PORT || env.API_PORT || 8787),
    deepseek: {
      apiKey: env.DEEPSEEK_API_KEY || "",
      baseUrl: env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      model: env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      timeoutMs: Number(env.DEEPSEEK_TIMEOUT_MS || 8000),
    },
    supabase: {
      url: env.SUPABASE_URL || "",
      anonKey: env.SUPABASE_ANON_KEY || "",
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || "",
    },
    databaseUrl: env.DATABASE_URL || "",
  };
}
