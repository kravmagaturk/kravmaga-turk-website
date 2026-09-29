let jwkCache = { expiresAt: 0, keys: {} };

function b64urlToBytes(value) {
  let s = value.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const raw = atob(s);
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

function decodeJson(value) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(value)));
}

async function getJwk(kid) {
  if (jwkCache.expiresAt > Date.now() && jwkCache.keys[kid]) return jwkCache.keys[kid];
  const res = await fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com");
  if (!res.ok) throw new Error("Firebase JWK unavailable");
  const data = await res.json();
  const map = {};
  for (const key of data.keys || []) map[key.kid] = key;
  jwkCache = { expiresAt: Date.now() + 6 * 60 * 60 * 1000, keys: map };
  return map[kid];
}

export async function verifyFirebaseIdToken(token, projectId) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const header = decodeJson(parts[0]);
  const payload = decodeJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Invalid algorithm");
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId) throw new Error("Invalid audience");
  if (payload.iss !== "https://securetoken.google.com/" + projectId) throw new Error("Invalid issuer");
  if (!payload.sub || payload.exp <= now || payload.iat > now + 60) throw new Error("Expired token");
  const jwk = await getJwk(header.kid);
  if (!jwk) throw new Error("Unknown signing key");
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signed = new TextEncoder().encode(parts[0] + "." + parts[1]);
  const signature = b64urlToBytes(parts[2]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, signed);
  if (!ok) throw new Error("Bad signature");
  return {
    uid: payload.sub,
    email: payload.email || "",
    name: payload.name || payload.email || "",
    emailVerified: !!payload.email_verified,
    claims: payload
  };
}

export async function userFromRequest(request, env) {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) throw new Error("Missing bearer token");
  return verifyFirebaseIdToken(auth.slice(7), env.FIREBASE_PROJECT_ID);
}
