CREATE TABLE IF NOT EXISTS video_tickets (
  ticket TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  video_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_video_tickets_exp ON video_tickets(expires_at);
