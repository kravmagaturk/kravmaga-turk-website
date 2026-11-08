// KMT yetkili abone yönetimi. D1 kayıtları iki kategoride tutar.
// E-posta doğrulaması ve yöneticinin verdiği onay birbirinden bağımsızdır.
const ADMIN_EMAIL = "bulicet@gmail.com";
const LIST_PATH = "/online-akademi/abonelik/admin/list";
const ACTION_PATH = "/online-akademi/abonelik/admin/action";

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store, max-age=0",
      "x-content-type-options": "nosniff",
      "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
      "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'"
    }
  });
}

async function isAdmin(request, env) {
  const header = request.headers.get("Authorization") || "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(header);
  if (!match || !env.FIREBASE_API_KEY) return false;
  try {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
        encodeURIComponent(env.FIREBASE_API_KEY),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: match[1] })
      }
    );
    if (!response.ok) return false;
    const data = await response.json();
    const user = data && Array.isArray(data.users) ? data.users[0] : null;
    return Boolean(user && user.emailVerified === true &&
      String(user.email || "").toLowerCase() === ADMIN_EMAIL);
  } catch (_) { return false; }
}

function isoDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = typeof value === "number" || /^\d{10,13}$/.test(String(value));
  const num = Number(value);
  const date = new Date(numeric ? (num < 100000000000 ? num * 1000 : num) : value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

async function list(env) {
  const [books, news, bookCount, newsCount, reviews] = await Promise.all([
    env.DB.prepare("SELECT id, full_name, email, status, created_at, verified_at FROM book_subscribers ORDER BY created_at DESC LIMIT 500").all(),
    env.DB.prepare("SELECT email, status, source, created_at, confirmed_at, unsubscribed_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 500").all(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM book_subscribers").first(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM newsletter_subscribers").first(),
    env.DB.prepare("SELECT category, email, decision, updated_at FROM subscriber_admin_reviews").all()
  ]);
  const decisions = new Map((reviews.results || []).map(row => [
    String(row.category) + ":" + String(row.email).toLowerCase(), row
  ]));
  const attach = (category, row) => {
    const review = decisions.get(category + ":" + String(row.email).toLowerCase());
    return {
      ...row,
      category,
      source: category === "books" ? "kitap" : String(row.source || ""),
      full_name: String(row.full_name || ""),
      email: String(row.email || ""),
      status: String(row.status || ""),
      created_at: isoDate(row.created_at),
      verified_at: isoDate(category === "books" ? row.verified_at : row.confirmed_at),
      unsubscribed_at: isoDate(row.unsubscribed_at),
      admin_decision: review ? review.decision : "pending",
      admin_updated_at: review ? review.updated_at : null
    };
  };
  const bookRows = (books.results || []).map(row => attach("books", row));
  const newsRows = (news.results || []).map(row => attach("news", row));
  return respond({
    ok: true,
    books: bookRows,
    news: newsRows,
    counts: { books: Number(bookCount?.n || 0), news: Number(newsCount?.n || 0) },
    sources: [{ table: "book_subscribers" }, { table: "newsletter_subscribers" }],
    complete: Number(bookCount?.n || 0) <= 500 && Number(newsCount?.n || 0) <= 500,
    adminApprovalControlsDelivery: false,
    notice: "Yönetici inceleme kararı ayrı saklanır. Mevcut otomatik haber gönderimi yalnızca bu karara göre filtrelenmemektedir."
  });
}

async function action(request, env) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > 2048) return respond({ error: "İstek çok büyük." }, 413);
  let input;
  try { input = await request.json(); } catch (_) {
    return respond({ error: "Geçersiz JSON." }, 400);
  }
  const category = String(input?.category || "");
  const op = String(input?.action || "");
  const email = String(input?.email || "").trim().toLowerCase();
  if (!["books", "news"].includes(category) ||
      !["approve", "unapprove", "unsubscribe", "delete"].includes(op) ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond({ error: "Geçersiz kategori, işlem veya e-posta." }, 400);
  }

  const table = category === "books" ? "book_subscribers" : "newsletter_subscribers";
  const record = await env.DB.prepare(
    "SELECT email,status," + (category === "books" ? "verified_at" : "confirmed_at") +
    " AS verified_at FROM " + table + " WHERE lower(email)=? LIMIT 1"
  ).bind(email).first();
  if (!record) return respond({ error: "Abone kaydı bulunamadı. Listeyi yenileyin." }, 404);

  if (op === "approve") {
    if (!record.verified_at || !["active", "verified"].includes(record.status)) {
      return respond({
        error: "Yönetici onayı için önce e-posta doğrulaması tamamlanmış ve abonelik aktif olmalıdır."
      }, 409);
    }
  }

  const now = new Date().toISOString();
  const sqls = [];
  if (op === "approve" || op === "unapprove") {
    sqls.push(env.DB.prepare(
      "INSERT INTO subscriber_admin_reviews(category,email,decision,updated_at) VALUES(?,?,?,?) " +
      "ON CONFLICT(category,email) DO UPDATE SET decision=excluded.decision,updated_at=excluded.updated_at"
    ).bind(category, email, op === "approve" ? "approved" : "pending", now));
  } else if (op === "unsubscribe") {
    if (category === "news") {
      sqls.push(env.DB.prepare(
        "UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=?," +
        "confirmation_hash=NULL,confirmation_expires=NULL WHERE lower(email)=?"
      ).bind(Date.now(), email));
      sqls.push(env.DB.prepare(
        "DELETE FROM newsletter_deliveries WHERE lower(email)=? AND status!='sent'"
      ).bind(email));
    } else {
      sqls.push(env.DB.prepare(
        "UPDATE book_subscribers SET status='disabled' WHERE lower(email)=?"
      ).bind(email));
    }
    sqls.push(env.DB.prepare(
      "INSERT INTO subscriber_admin_reviews(category,email,decision,updated_at) VALUES(?,?,?,?) " +
      "ON CONFLICT(category,email) DO UPDATE SET decision=excluded.decision,updated_at=excluded.updated_at"
    ).bind(category, email, "revoked", now));
  } else if (op === "delete") {
    if (category === "news") {
      sqls.push(env.DB.prepare("DELETE FROM newsletter_deliveries WHERE lower(email)=?").bind(email));
      sqls.push(env.DB.prepare("DELETE FROM newsletter_unsubscribe_tokens WHERE lower(email)=?").bind(email));
    } else {
      sqls.push(env.DB.prepare("DELETE FROM book_email_events WHERE lower(email)=?").bind(email));
    }
    sqls.push(env.DB.prepare("DELETE FROM " + table + " WHERE lower(email)=?").bind(email));
    sqls.push(env.DB.prepare(
      "DELETE FROM subscriber_admin_reviews WHERE category=? AND lower(email)=?"
    ).bind(category, email));
  }
  sqls.push(env.DB.prepare(
    "INSERT INTO subscriber_admin_audit(category,action,created_at) VALUES(?,?,?)"
  ).bind(category, op, now));
  await env.DB.batch(sqls);
  return respond({ ok: true, action: op, category, email,
    admin_decision: op === "approve" ? "approved" : op === "unapprove" ? "pending" : "revoked"
  });
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (![LIST_PATH, ACTION_PATH].includes(path)) return respond({ error: "Not found" }, 404);
    if ((path === LIST_PATH && request.method !== "GET") ||
        (path === ACTION_PATH && request.method !== "POST")) {
      return respond({ error: "Method not allowed" }, 405);
    }
    if (!await isAdmin(request, env)) return respond({ error: "Yetkili yönetici oturumu gerekli." }, 401);
    if (!env.DB || typeof env.DB.prepare !== "function")
      return respond({ error: "Abone veritabanı bağlı değil." }, 503);
    try {
      return path === LIST_PATH ? await list(env) : await action(request, env);
    } catch (error) {
      console.error("subscriber-admin error", error && error.message ? error.message : error);
      return respond({ error: "Abone yönetimi işlemi tamamlanamadı; veritabanı ve bağlantıyı kontrol edin." }, 503);
    }
  }
};
