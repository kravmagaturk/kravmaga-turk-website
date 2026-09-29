PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS access_grants (
  uid TEXT NOT NULL,
  scope TEXT NOT NULL,
  granted INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  source TEXT NOT NULL DEFAULT 'admin',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (uid, scope),
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  uid TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  watched_sec REAL NOT NULL DEFAULT 0,
  duration_sec REAL NOT NULL DEFAULT 0,
  percent REAL NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  first_opened_at TEXT,
  last_opened_at TEXT,
  session_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (uid, lesson_id),
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_results (
  uid TEXT NOT NULL,
  level_id TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score REAL,
  passed INTEGER NOT NULL DEFAULT 0,
  passed_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (uid, level_id),
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  uid TEXT NOT NULL,
  certificate_id TEXT NOT NULL,
  eligible INTEGER NOT NULL DEFAULT 0,
  issued INTEGER NOT NULL DEFAULT 0,
  issued_at TEXT,
  register_id TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (uid, certificate_id),
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_progress_uid_completed ON progress(uid, completed);
CREATE INDEX IF NOT EXISTS idx_access_uid_granted ON access_grants(uid, granted);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
