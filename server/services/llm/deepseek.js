export async function callDeepSeek(config, { system, user }) {
  if (!config.deepseek?.apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }
  const response = await fetch(`${config.deepseek.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(config.deepseek.timeoutMs || 20000),
    headers: {
      Authorization: `Bearer ${config.deepseek.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.deepseek.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: typeof user === "string" ? user : JSON.stringify(user) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) throw new Error(`DeepSeek returned HTTP ${response.status}`);
  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned an empty response");
  return JSON.parse(String(content).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""));
}
