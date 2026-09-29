import { VIDEO_MAP } from "./video-map.js";
import { userFromRequest } from "./auth.js";

let cachedB2Auth = null;

function allowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = new Set([
    "https://kravmaga.com.tr",
    "https://www.kravmaga.com.tr",
    "http://127.0.0.1:8789",
    "http://localhost:8789"
  ]);
  return allowed.has(origin) ? origin : "";
}

function corsHeaders(request) {
  const h = new Headers();
  const origin = allowedOrigin(request);
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Headers", "Authorization, Range, Content-Type, X-Upload-Token");
  h.set("Access-Control-Allow-Methods", "GET, HEAD, PUT, POST, OPTIONS");
  h.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
  return h;
}

function json(request, data, status = 200) {
  const headers = corsHeaders(request);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "private, no-store");
  return new Response(JSON.stringify(data), { status, headers });
}

function text(request, body, status = 200) {
  const headers = corsHeaders(request);
  headers.set("Content-Type", "text/plain; charset=utf-8");
  headers.set("Cache-Control", "private, no-store");
  return new Response(body, { status, headers });
}

async function getB2Auth(env) {
  if (cachedB2Auth && cachedB2Auth.expiresAt > Date.now()) return cachedB2Auth;
  const token = btoa(`${env.B2_KEY_ID}:${env.B2_APPLICATION_KEY}`);
  const res = await fetch("https://api.backblazeb2.com/b2api/v4/b2_authorize_account", {
    headers: { Authorization: `Basic ${token}` }
  });
  if (!res.ok) throw new Error("B2 authorization failed");
  const data = await res.json();
  cachedB2Auth = {
    authorizationToken: data.authorizationToken,
    downloadUrl: data.apiInfo?.storageApi?.downloadUrl,
    apiUrl: data.apiInfo?.storageApi?.apiUrl,
    expiresAt: Date.now() + 20 * 60 * 60 * 1000
  };
  return cachedB2Auth;
}

async function grantsFor(env, uid) {
  const now = new Date().toISOString();
  const rows = await env.DB.prepare(
    "SELECT scope, granted, expires_at FROM access_grants WHERE uid=? AND granted=1"
  ).bind(uid).all();
  const grants = {};
  for (const row of rows.results || []) {
    if (!row.expires_at || row.expires_at > now) grants[row.scope] = true;
  }
  return grants;
}

async function requireUser(request, env) {
  const id = await userFromRequest(request, env);
  const now = new Date().toISOString();
  const admin = id.email && env.ADMIN_EMAIL && id.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO users(uid,email,display_name,role,status,created_at,last_login_at) VALUES(?,?,?,?,?,?,?)"
  ).bind(id.uid, id.email, id.name, admin ? "admin" : "pending", "active", now, now).run();
  await env.DB.prepare(
    "UPDATE users SET email=?, display_name=?, last_login_at=? WHERE uid=?"
  ).bind(id.email, id.name, now, id.uid).run();
  if (admin) {
    await env.DB.prepare("UPDATE users SET role='admin', status='active' WHERE uid=?").bind(id.uid).run();
  }
  const row = await env.DB.prepare(
    "SELECT uid,email,display_name,role,status,created_at,last_login_at FROM users WHERE uid=?"
  ).bind(id.uid).first();
  return { ...row, grants: await grantsFor(env, id.uid) };
}

function canAccessVideo(user, entry) {
  if (!user || user.status !== "active") return false;
  if (user.role === "admin" || user.role === "instructor") return true;
  if (entry.access === "special") return !!user.grants.special;
  if (entry.access === "student") {
    if (entry.bookQrKey && user.grants.book) return true;
    return !!user.grants.core;
  }
  return false;
}

async function requireAdmin(request, env) {
  const user = await requireUser(request, env);
  if (user.role !== "admin") throw new Error("admin-required");
  return user;
}

async function handleMe(request, env) {
  try {
    const user = await requireUser(request, env);
    return json(request, { user });
  } catch {
    return json(request, { error: "unauthorized" }, 401);
  }
}

async function handleProgress(request, env, url) {
  let user;
  try { user = await requireUser(request, env); }
  catch { return json(request, { error: "unauthorized" }, 401); }

  if (request.method === "GET" && url.pathname === "/api/progress") {
    const rows = await env.DB.prepare(
      "SELECT lesson_id,watched_sec,duration_sec,percent,completed,completed_at,first_opened_at,last_opened_at,session_count,updated_at FROM progress WHERE uid=?"
    ).bind(user.uid).all();
    return json(request, { progress: rows.results || [] });
  }

  const prefix = "/api/progress/";
  if (request.method !== "PUT" || !url.pathname.startsWith(prefix)) {
    return json(request, { error: "method-not-allowed" }, 405);
  }

  const lessonId = decodeURIComponent(url.pathname.slice(prefix.length));
  if (!lessonId || lessonId.length > 120) return json(request, { error: "invalid-lesson" }, 400);
  const entry = VIDEO_MAP[lessonId];
  if (!entry) return json(request, { error: "lesson-not-found" }, 404);
  if (!canAccessVideo(user, entry)) return json(request, { error: "forbidden" }, 403);

  let body;
  try { body = await request.json(); }
  catch { return json(request, { error: "invalid-json" }, 400); }

  const now = new Date().toISOString();
  const watched = Math.max(0, Number(body.watchedSec) || 0);
  const duration = Math.max(0, Number(body.durationSec) || 0);
  const percent = duration > 0 ? Math.min(100, Math.round((watched / duration) * 10000) / 100) : 0;
  const completed = body.ended === true || percent >= 90 ? 1 : 0;

  const existing = await env.DB.prepare(
    "SELECT first_opened_at,session_count,watched_sec,completed FROM progress WHERE uid=? AND lesson_id=?"
  ).bind(user.uid, lessonId).first();

  const firstOpened = existing?.first_opened_at || now;
  const sessions = Math.max(Number(existing?.session_count) || 0, Number(body.sessionCount) || 1);
  const bestWatched = Math.max(Number(existing?.watched_sec) || 0, watched);
  const isComplete = existing?.completed ? 1 : completed;
  const completedAt = isComplete ? (body.completedAt || now) : null;

  await env.DB.prepare(
    `INSERT INTO progress(uid,lesson_id,watched_sec,duration_sec,percent,completed,completed_at,first_opened_at,last_opened_at,session_count,updated_at)
     VALUES(?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(uid,lesson_id) DO UPDATE SET
       watched_sec=excluded.watched_sec,
       duration_sec=excluded.duration_sec,
       percent=excluded.percent,
       completed=excluded.completed,
       completed_at=excluded.completed_at,
       last_opened_at=excluded.last_opened_at,
       session_count=excluded.session_count,
       updated_at=excluded.updated_at`
  ).bind(
    user.uid, lessonId, bestWatched, duration,
    duration > 0 ? Math.min(100, Math.round((bestWatched / duration) * 10000) / 100) : percent,
    isComplete, completedAt, firstOpened, now, sessions, now
  ).run();

  return json(request, { ok: true, lessonId, completed: !!isComplete });
}

async function handleVideoTicket(request, env, url) {
  if (request.method !== "POST") return json(request, { error: "method-not-allowed" }, 405);
  let user;
  try { user = await requireUser(request, env); }
  catch { return json(request, { error: "unauthorized" }, 401); }

  const videoId = decodeURIComponent(url.pathname.slice("/api/video-ticket/".length));
  const entry = VIDEO_MAP[videoId];
  if (!entry) return json(request, { error: "video-not-found" }, 404);
  if (!canAccessVideo(user, entry)) return json(request, { error: "forbidden" }, 403);

  const ticket = crypto.randomUUID();
  const expiresAt = Date.now() + 60 * 60 * 1000;
  const now = new Date().toISOString();
  await env.DB.prepare("DELETE FROM video_tickets WHERE expires_at < ?").bind(Date.now()).run();
  await env.DB.prepare(
    "INSERT INTO video_tickets(ticket,uid,video_id,expires_at,created_at) VALUES(?,?,?,?,?)"
  ).bind(ticket, user.uid, videoId, expiresAt, now).run();

  return json(request, {
    videoId,
    expiresAt,
    url: `${url.origin}/api/video/${encodeURIComponent(videoId)}?ticket=${encodeURIComponent(ticket)}`
  });
}

async function handleVideo(request, env, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return text(request, "Method not allowed", 405);
  const videoId = decodeURIComponent(url.pathname.slice("/api/video/".length));
  const entry = VIDEO_MAP[videoId];
  if (!entry) return text(request, "Video not found", 404);

  const ticket = url.searchParams.get("ticket") || "";
  const t = ticket ? await env.DB.prepare(
    "SELECT uid,video_id,expires_at FROM video_tickets WHERE ticket=?"
  ).bind(ticket).first() : null;
  if (!t || t.video_id !== videoId || Number(t.expires_at) < Date.now()) {
    return text(request, "Video ticket required", 401);
  }

  try {
    const auth = await getB2Auth(env);
    const key = entry.key || entry;
    const encodedPath = key.split("/").map(encodeURIComponent).join("/");
    const b2Url = `${auth.downloadUrl}/file/${encodeURIComponent(env.B2_BUCKET_NAME)}/${encodedPath}`;
    const upstreamHeaders = new Headers({ Authorization: auth.authorizationToken });
    const range = request.headers.get("Range");
    if (range) upstreamHeaders.set("Range", range);
    const upstream = await fetch(b2Url, { method: request.method, headers: upstreamHeaders });
    if (!upstream.ok && upstream.status !== 206) return text(request, "Video unavailable", upstream.status);
    const headers = new Headers(upstream.headers);
    const origin = allowedOrigin(request);
    if (origin) headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Cache-Control", "private, no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "same-origin");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
    headers.set("Content-Disposition", "inline");
    headers.delete("x-bz-file-id");
    headers.delete("x-bz-file-name");
    headers.delete("x-bz-content-sha1");
    return new Response(request.method === "HEAD" ? null : upstream.body, { status: upstream.status, headers });
  } catch (err) {
    return text(request, "Video service error", 502);
  }
}

async function handleAdmin(request, env, url) {
  let admin;
  try { admin = await requireAdmin(request, env); }
  catch { return json(request, { error: "admin-required" }, 403); }

  if (request.method === "GET" && url.pathname === "/api/admin/users") {
    const rows = await env.DB.prepare(
      `SELECT u.uid,u.email,u.display_name,u.role,u.status,u.created_at,u.last_login_at,
        COALESCE((SELECT granted FROM access_grants g WHERE g.uid=u.uid AND g.scope='core'),0) AS core,
        COALESCE((SELECT granted FROM access_grants g WHERE g.uid=u.uid AND g.scope='special'),0) AS special,
        COALESCE((SELECT granted FROM access_grants g WHERE g.uid=u.uid AND g.scope='diploma'),0) AS diploma,
        COALESCE((SELECT granted FROM access_grants g WHERE g.uid=u.uid AND g.scope='book'),0) AS book
       FROM users u ORDER BY u.last_login_at DESC LIMIT 500`
    ).all();
    return json(request, { users: rows.results || [] });
  }

  const prefix = "/api/admin/user/";
  if (request.method === "PUT" && url.pathname.startsWith(prefix)) {
    const uid = decodeURIComponent(url.pathname.slice(prefix.length));
    let body;
    try { body = await request.json(); }
    catch { return json(request, { error: "invalid-json" }, 400); }

    const allowedRoles = new Set(["pending","academy_student","paid_external","instructor","admin"]);
    const role = allowedRoles.has(body.role) ? body.role : null;
    const status = body.status === "inactive" ? "inactive" : body.status === "active" ? "active" : null;
    if (role) await env.DB.prepare("UPDATE users SET role=? WHERE uid=?").bind(role, uid).run();
    if (status) await env.DB.prepare("UPDATE users SET status=? WHERE uid=?").bind(status, uid).run();

    const now = new Date().toISOString();
    for (const scope of ["core","special","diploma","book"]) {
      if (typeof body[scope] === "boolean") {
        await env.DB.prepare(
          `INSERT INTO access_grants(uid,scope,granted,expires_at,source,updated_at)
           VALUES(?,?,?,?,?,?)
           ON CONFLICT(uid,scope) DO UPDATE SET granted=excluded.granted,expires_at=excluded.expires_at,source=excluded.source,updated_at=excluded.updated_at`
        ).bind(uid, scope, body[scope] ? 1 : 0, body.expiresAt || null, "admin", now).run();
      }
    }
    return json(request, { ok: true, uid });
  }

  return json(request, { error: "not-found" }, 404);
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

async function handleUploadUrl(request, env) {
  if (request.method !== "POST") return json(request, { error: "method-not-allowed" }, 405);
  const staticToken = request.headers.get("X-Upload-Token") || "";
  let allowed = false;
  if (staticToken) {
    const tokenHash = await sha256Hex(staticToken);
    const tokenRow = await env.DB.prepare(
      "SELECT purpose,expires_at FROM admin_tokens WHERE token_hash=?"
    ).bind(tokenHash).first();
    allowed = !!tokenRow && tokenRow.purpose === "media-upload" && Number(tokenRow.expires_at) > Date.now();
  }
  if (!allowed) {
    try { await requireAdmin(request, env); allowed = true; }
    catch {}
  }
  if (!allowed) return json(request, { error: "unauthorized" }, 401);

  try {
    const auth = await getB2Auth(env);
    const up = await fetch(`${auth.apiUrl}/b2api/v4/b2_get_upload_url`, {
      method: "POST",
      headers: { Authorization: auth.authorizationToken, "Content-Type": "application/json" },
      body: JSON.stringify({ bucketId: env.B2_BUCKET_ID })
    });
    if (!up.ok) return json(request, { error: "upload-url-unavailable" }, 502);
    const data = await up.json();
    return json(request, { uploadUrl: data.uploadUrl, authorizationToken: data.authorizationToken });
  } catch {
    return json(request, { error: "upload-service-error" }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (url.pathname === "/online-akademi" || url.pathname === "/online-akademi/" || url.pathname === "/online-akademi.html") {
      const assetUrl = new URL("/online-akademi.html", url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }
    if (url.pathname === "/online-akademi-katalog.json") {
      const assetUrl = new URL("/online-akademi-katalog.json", url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (url.pathname === "/api/me") return handleMe(request, env);
    if (url.pathname === "/api/progress" || url.pathname.startsWith("/api/progress/")) return handleProgress(request, env, url);
    if (url.pathname.startsWith("/api/video-ticket/")) return handleVideoTicket(request, env, url);
    if (url.pathname.startsWith("/api/video/")) return handleVideo(request, env, url);
    if (url.pathname === "/api/admin/upload-url") return handleUploadUrl(request, env);
    if (url.pathname.startsWith("/api/admin/")) return handleAdmin(request, env, url);

    return text(request, "Not found", 404);
  }
};
