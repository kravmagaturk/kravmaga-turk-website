// KMT Abone Yönetimi | salt okunur, Firebase yetkili yöneticiyle sınırlandırılmış API.
// Varsayılan olarak hiçbir aboneye mesaj göndermez ve hiçbir kaydı değiştirmez.
const ADMIN_EMAIL = "bulicet@gmail.com";
const API_PATH = "/online-akademi/abonelik/admin/list";

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'"
    }
  });
}

async function isVerifiedAdmin(request, env) {
  const authorization = request.headers.get("Authorization") || "";
  const matched = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!matched || !env.FIREBASE_API_KEY) return false;
  try {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + encodeURIComponent(env.FIREBASE_API_KEY),
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: matched[1] }) }
    );
    if (!response.ok) return false;
    const body = await response.json();
    const user = body && Array.isArray(body.users) ? body.users[0] : null;
    return Boolean(user && user.emailVerified === true && String(user.email || "").toLowerCase() === ADMIN_EMAIL);
  } catch (_) { return false; }
}

function safeName(name) {
  return /^[A-Za-z_][A-Za-z_0-9]*$/.test(String(name || ""));
}
function sqlName(name) { return '"' + name + '"'; }
function findColumn(columns, possibilities) {
  for (const wanted of possibilities) {
    const name = columns.find(c => c.toLowerCase() === wanted.toLowerCase());
    if (name) return sqlName(name);
  }
  return "NULL";
}
function displayDate(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" || /^\\d{10,13}$/.test(String(value))) {
    const n = Number(value);
    const date = new Date(n < 100000000000 ? n * 1000 : n);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}
async function selectSubscribers(env, tableName) {
  if (!safeName(tableName)) return null;
  const columns = (await env.DB.prepare("PRAGMA table_info(" + sqlName(tableName) + ")").all()).results || [];
  const names = columns.map(c => String(c.name || "")).filter(safeName);
  if (!names.some(name => /^e(-?mail)?$/i.test(name) || /^email(_address)?$/i.test(name))) return null;
  const fields = {
    id: ["id", "subscriber_id"],
    email: ["email", "email_address", "mail"],
    full_name: ["full_name", "name", "display_name"],
    source: ["source", "signup_source", "origin", "channel"],
    status: ["status", "state"],
    consent: ["consent", "marketing_consent", "opt_in", "consented"],
    created_at: ["created_at", "subscribed_at", "created_on", "registered_at"],
    verified_at: ["verified_at", "confirmed_at", "activated_at"],
    unsubscribed_at: ["unsubscribed_at", "opted_out_at"]
  };
  const select = Object.entries(fields).map(([alias, options]) => findColumn(names, options) + " AS " + sqlName(alias)).join(", ");
  const countRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM " + sqlName(tableName)).first();
  const list = await env.DB.prepare("SELECT " + select + " FROM " + sqlName(tableName) + " LIMIT 500").all();
  const rows = (list.results || []).map(row => ({
    id: row.id,
    email: String(row.email || "").slice(0, 254),
    full_name: String(row.full_name || "").slice(0, 200),
    source: String(row.source || "").slice(0, 100),
    status: String(row.status || "").slice(0, 50),
    consent: row.consent,
    created_at: displayDate(row.created_at),
    verified_at: displayDate(row.verified_at),
    unsubscribed_at: displayDate(row.unsubscribed_at)
  }));
  return { table: tableName, total: Number(countRow && countRow.count || 0), rows };
}
function isBook(row, table) {
  return /book|kitap/i.test(table) || /^(book|kitap|kitap-okuyucu)$/i.test(String(row.source || ""));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== API_PATH) return json({ error: "Not found" }, 404);
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
    if (!await isVerifiedAdmin(request, env)) return json({ error: "Yetkili yönetici oturumu gerekli." }, 401);
    if (!env.DB || typeof env.DB.prepare !== "function") return json({ error: "Abone veritabanı bağlı değil." }, 503);
    try {
      const schema = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
      const names = (schema.results || []).map(x => String(x.name || ""))
        .filter(name => safeName(name) && /subscr|newsletter|mailing/i.test(name));
      const groups = { books: [], news: [] };
      const sources = [];
      let booksTotal = 0, newsTotal = 0;
      for (const name of names) {
        const result = await selectSubscribers(env, name);
        if (!result) continue;
        const tableIsBook = /book|kitap/i.test(name);
        const onlyOneKind = !result.rows.some(row => isBook(row, name) !== tableIsBook);
        // Non-book tables can contain book + site subscriptions together; respect source at row level.
        let bookCount = 0, newsCount = 0;
        for (const row of result.rows) {
          const summary = { ...row, table: name };
          if (isBook(row, name)) { groups.books.push(summary); bookCount++; }
          else { groups.news.push(summary); newsCount++; }
        }
        if (tableIsBook) booksTotal += result.total;
        else if (onlyOneKind) newsTotal += result.total;
        // When sources mix in one table, total is a displayed-row count, not a database total.
        else { booksTotal += bookCount; newsTotal += newsCount; }
        sources.push({ table: name, count: result.total, shown: result.rows.length });
      }
      return json({
        ok: true,
        books: groups.books,
        news: groups.news,
        counts: { books: booksTotal, news: newsTotal },
        sources,
        complete: sources.every(source => source.count <= 500),
        message: sources.length ? null : "Bu D1 veritabanında abone tablosu bulunamadı. Farklı bir kayıt kaynağı bağlı olabilir."
      });
    } catch (_) {
      return json({ error: "Abone veritabanı okunamadı. D1 bağlarını ve tablo şemasını kontrol edin." }, 503);
    }
  }
};