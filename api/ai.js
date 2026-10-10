// Серверная функция Vercel: прячет ключ OpenRouter и пускает к ИИ только вошедших пользователей Alive.
// Нужна переменная окружения OPENROUTER_API_KEY (Vercel → Project → Settings → Environment Variables).
const SB = "https://wqxeebqejexaatrtaxro.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGVlYnFlamV4YWF0cnRheHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NTQ1MjEsImV4cCI6MjEwNzEzMDUyMX0.PMp3Bf6_efL7acEpHaguMa8c_ZfBljBCEF9hvSPDv04";

module.exports = async function (req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: "Не задан OPENROUTER_API_KEY" });
  const tok = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!tok) return res.status(401).json({ error: "Нужен вход" });
  try {
    const u = await fetch(SB + "/auth/v1/user", { headers: { apikey: ANON, Authorization: "Bearer " + tok } });
    if (!u.ok) return res.status(401).json({ error: "Сессия недействительна" });
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);
    const msgs = (Array.isArray(body && body.messages) ? body.messages : []).slice(-20).map(function (m) {
      return { role: m.role === "assistant" || m.role === "system" ? m.role : "user", content: String(m.content || "").slice(0, 4000) };
    });
    if (!msgs.length) return res.status(400).json({ error: "Пустой запрос" });
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: process.env.AI_MODEL || "openrouter/free", messages: msgs, temperature: 0.7, max_tokens: 1500 })
    });
    const t = await r.text();
    res.setHeader("Content-Type", "application/json");
    return res.status(r.status).send(t);
  } catch (e) {
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};
