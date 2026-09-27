const VIDEO_MAP = {
  "basic-17": "basic-17-reaksiyon-4.mp4"
};

let cachedAuth = null;

async function getB2Auth(env) {
  if (cachedAuth && cachedAuth.expiresAt > Date.now()) return cachedAuth;

  const token = btoa(`${env.B2_KEY_ID}:${env.B2_APPLICATION_KEY}`);
  const res = await fetch("https://api.backblazeb2.com/b2api/v4/b2_authorize_account", {
    headers: { Authorization: `Basic ${token}` }
  });

  if (!res.ok) { const detail = await res.text(); throw new Error(`B2 authorization failed (${res.status}): ${detail}`); }
  const data = await res.json();

  cachedAuth = {
    authorizationToken: data.authorizationToken,
    downloadUrl: data.apiInfo?.storageApi?.downloadUrl,
    expiresAt: Date.now() + 20 * 60 * 60 * 1000
  };
  return cachedAuth;
}

function securityHeaders(headers) {
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-site");
  return headers;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (!url.pathname.startsWith("/api/video/")) {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const videoId = decodeURIComponent(url.pathname.split("/").pop());
    const objectKey = VIDEO_MAP[videoId];

    if (!objectKey) {
      return new Response("Video not found", { status: 404 });
    }

    /*
      TODO: üyelik aşamasında burada oturum/yetki doğrulaması yapılacak.
      Yetkisiz kullanıcıya B2 isteği gönderilmeyecek.
    */

    try {
      const auth = await getB2Auth(env);
      const encodedPath = objectKey.split("/").map(encodeURIComponent).join("/");
      const b2Url = `${auth.downloadUrl}/file/${encodeURIComponent(env.B2_BUCKET_NAME)}/${encodedPath}`;

      const upstreamHeaders = new Headers({
        Authorization: auth.authorizationToken
      });

      const range = request.headers.get("Range");
      if (range) upstreamHeaders.set("Range", range);

      const upstream = await fetch(b2Url, {
        method: request.method,
        headers: upstreamHeaders
      });

      if (!upstream.ok && upstream.status !== 206) {
        return new Response("Video unavailable", { status: upstream.status });
      }

      const headers = securityHeaders(new Headers(upstream.headers));
      headers.set("Content-Disposition", "inline");
      headers.delete("x-bz-file-id");
      headers.delete("x-bz-file-name");
      headers.delete("x-bz-content-sha1");

      return new Response(request.method === "HEAD" ? null : upstream.body, {
        status: upstream.status,
        headers
      });
    } catch (err) {
      return new Response(`Video service error: ${err && err.message ? err.message : "unknown"}`, { status: 502 });
    }
  }
};
