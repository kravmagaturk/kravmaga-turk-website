CREATE TABLE IF NOT EXISTS admin_tokens (
  token_hash TEXT PRIMARY KEY,
  purpose TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_tokens_exp ON admin_tokens(expires_at);
