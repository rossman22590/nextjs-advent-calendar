CREATE TABLE IF NOT EXISTS opened_windows (
  calendar_id TEXT NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (calendar_id, user_id, day)
);
