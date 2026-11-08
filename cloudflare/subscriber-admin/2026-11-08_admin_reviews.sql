-- KMT abonelik yonetimi, surum 2026-11-08
-- Mevcut newsletter_subscribers ve book_subscribers tablolarini degistirmez.
CREATE TABLE IF NOT EXISTS subscriber_admin_reviews (
  category TEXT NOT NULL CHECK (category IN ('news','books')),
  email TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('pending','approved','revoked')),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (category, email)
);
CREATE TABLE IF NOT EXISTS subscriber_admin_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK (category IN ('news','books')),
  action TEXT NOT NULL CHECK (action IN ('approve','unapprove','unsubscribe','delete')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subscriber_admin_audit_created
  ON subscriber_admin_audit(created_at);
