# Krav Maga Türk - versioned static asset cache policy (2026-11-15)

Cloudflare Workers Static Assets use versioned asset manifests, and zone-level Cache Rules do not override the browser Cache-Control header for these Worker responses. The effective policy is in `_headers`.

- `/assets/kmt-v20261115/static/*`: 7 days, immutable. This release copies site.css and footer.js as content-hashed files.
- `/assets/kmt-v20261115/images/*`: 30 days, immutable. This release copies the two homepage hero WebP sizes as content-hashed files.
- HTML, /admin, /kmt-admin, subscriber/admin routes, API/Workers, and unversioned /assets paths: no long cache TTL added.
- Homepage references content-fingerprinted copies, not source files. All other pages retain current refs.

**Maintenance:** Future modifications to assets/site.css or assets/footer.js MUST create a NEW hash-suffixed file and update index.html (and any other pages that reference the versioned path). Never overwrite an immutable versioned file; keep prior ones for older HTML in browser caches. When homepage hero images are updated, add new fingerprinted paths. Verify both 200 response and intended Cache-Control headers on production after every deployment.

**Rollback:** backup/pre-worker-static-ttl-2026-11-15 branch; restore previous main if needed. Zone-level rules KMT Versioned JS-CSS and Images exist but do not currently affect Workers static asset responses. Browser Cache TTL global remains Respect Existing Headers.
