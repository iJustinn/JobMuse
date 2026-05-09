import { createClient } from "@supabase/supabase-js";

export function createAuthMiddleware(config) {
  const canVerify = Boolean(config.supabase.url && config.supabase.serviceRoleKey);
  const supabase = canVerify
    ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { persistSession: false },
    })
    : null;

  return async function requireAuth(req, res, next) {
    if (!supabase) {
      return res.status(503).json({
        error: "Supabase auth is not configured",
        code: "AUTH_NOT_CONFIGURED",
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "Missing bearer token", code: "AUTH_REQUIRED" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid session", code: "AUTH_INVALID" });
    }

    req.user = data.user;
    return next();
  };
}

function getBearerToken(req) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}
