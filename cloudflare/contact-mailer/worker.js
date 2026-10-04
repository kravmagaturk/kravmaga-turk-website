const MAIL_TO = "info@kravmaga.com.tr";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8_KnOO6-8oQr1NhG3GWf3v-wAIsMtO_-0AFLSgYQfnx0NU-h3GGv6U7SX590VB20t/exec";
const ORIGINS = new Set(["https://kravmaga.com.tr", "https://www.kravmaga.com.tr"]);
const WINDOW = 600000, MAX = 3, recent = new Map();

function reply(data, status, origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "vary": "Origin"
  };
  if (ORIGINS.has(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-methods"] = "POST, OPTIONS, GET";
    headers["access-control-allow-headers"] = "content-type";
    headers["access-control-max-age"] = "600";
  }
  return new Response(status === 204 ? null : JSON.stringify(data), { status, headers });
}

function clean(value, maxLength) {
  return String(value || "").replace(/[\r\n\0]/g, " ").trim().slice(0, maxLength);
}

function limited(ip) {
  const now = Date.now();
  const entry = recent.get(ip);
  if (entry && now - entry.start < WINDOW) {
    entry.count++;
    return entry.count > MAX;
  }
  recent.set(ip, { start: now, count: 1 });
  for (const [key, value] of recent) {
    if (now - value.start > WINDOW) recent.delete(key);
  }
  return false;
}

async function send(env, values) {
  const secret = String(env.GOOGLE_APPS_SCRIPT_SECRET || "").trim();
  if (!secret) throw new Error("Google Apps Script secret missing");

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    redirect: "follow",
    body: JSON.stringify({
      secret,
      name: values.name,
      email: values.email,
      message: values.message
    })
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Google Apps Script returned non-JSON response (${response.status})`);
  }
  if (!response.ok || !result?.ok) {
    // Do not log response bodies: they may contain submitted visitor information.
    throw new Error(`Google Apps Script mail relay failed (${response.status})`);
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (!ORIGINS.has(origin)) return reply({ error: "İstek kaynağı reddedildi." }, 403, "");
      return reply({}, 204, origin);
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return reply({ status: "ok" }, 200, origin);
    }
    if (request.method !== "POST" || url.pathname !== "/send") {
      return reply({ error: "Adres bulunamadı." }, 404, origin);
    }
    if (!ORIGINS.has(origin)) return reply({ error: "İstek kaynağı reddedildi." }, 403, "");
    if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
      return reply({ error: "Geçersiz istek biçimi." }, 415, origin);
    }
    if (Number(request.headers.get("content-length") || 0) > 10000) {
      return reply({ error: "Mesaj çok uzun." }, 413, origin);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return reply({ error: "Form bilgileri okunamadı." }, 400, origin);
    }

    if (data.website) return reply({ ok: true }, 200, origin);

    const name = clean(data.name, 100);
    const email = clean(data.email, 160);
    const message = clean(data.message, 4000);
    const startedAt = Number(data.startedAt);

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.length < 5
    ) {
      return reply({ error: "Ad, geçerli e-posta ve açıklama alanlarını kontrol edin." }, 400, origin);
    }
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500 || Date.now() - startedAt > 28800000) {
      return reply({ error: "Lütfen formu yeniden açıp tekrar deneyin." }, 400, origin);
    }
    if (limited(request.headers.get("cf-connecting-ip") || "unknown")) {
      return reply({ error: "Çok sık gönderim yapıldı. Bir süre sonra tekrar deneyin." }, 429, origin);
    }

    try {
      await send(env, { name, email, message });
      return reply({ ok: true }, 200, origin);
    } catch (error) {
      console.error("Contact email delivery failed:", error?.message || "unknown");
      return reply({
        error: "Mesaj şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya WhatsApp'tan yazın."
      }, 502, origin);
    }
  }
};
