import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.SCOLRLY_DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(path.join(DATA_DIR, 'scolrly.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  name TEXT NOT NULL DEFAULT 'Student',
  initials TEXT NOT NULL DEFAULT 'ST',
  target_year INTEGER DEFAULT 2026,
  status TEXT DEFAULT 'Class 12',
  coaching TEXT DEFAULT 'None',
  medium TEXT DEFAULT 'English',
  streak_days INTEGER DEFAULT 0,
  last_study_date TEXT,
  exam_date TEXT DEFAULT '2026-05-04',
  role TEXT DEFAULT 'student',
  demo_score INTEGER,
  demo_hours INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  name TEXT NOT NULL,
  pyq_count INTEGER DEFAULT 0,
  base_accuracy INTEGER DEFAULT 50,
  base_attempted INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES chapters(id),
  subject TEXT NOT NULL,
  year INTEGER,
  difficulty TEXT,
  text TEXT NOT NULL,
  options TEXT NOT NULL,        -- JSON [{id,text}]
  correct TEXT NOT NULL,
  explanation TEXT,
  pyq_frequency TEXT,
  tags TEXT                     -- JSON [string]
);

CREATE TABLE IF NOT EXISTS concept_cards (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES chapters(id),
  title TEXT NOT NULL,
  pyq_freq TEXT,
  tags TEXT,                    -- JSON
  content TEXT,                 -- JSON [string]
  formulae TEXT,                -- JSON [string]
  ncert_ref TEXT
);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_id TEXT NOT NULL REFERENCES questions(id),
  chapter_id TEXT REFERENCES chapters(id),
  picked TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  time_ms INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_attempts_chapter ON attempts(user_id, chapter_id);

CREATE TABLE IF NOT EXISTS mocks (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'full',
  title TEXT NOT NULL,
  duration INTEGER,
  total_marks INTEGER,
  question_count INTEGER
);

CREATE TABLE IF NOT EXISTS mock_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  mock_id TEXT NOT NULL REFERENCES mocks(id),
  score INTEGER NOT NULL,
  rank_estimate INTEGER,
  accuracy INTEGER,
  time_taken TEXT,
  subject_scores TEXT,          -- JSON {biology,physics,chemistry}
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS doubts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question TEXT NOT NULL,
  subject TEXT DEFAULT 'all',
  answer TEXT,
  ncert_ref TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT,
  host TEXT,
  duration INTEGER,
  status TEXT DEFAULT 'scheduled',
  scheduled_at TEXT,
  total_members INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS room_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL REFERENCES rooms(id),
  user_id INTEGER REFERENCES users(id),
  initials TEXT, color TEXT, name TEXT,
  member_status TEXT DEFAULT 'studying',
  chapter TEXT
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INTEGER NOT NULL REFERENCES users(id),
  card_id TEXT NOT NULL REFERENCES concept_cards(id),
  PRIMARY KEY (user_id, card_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target TEXT DEFAULT 'All Users',
  status TEXT DEFAULT 'sent',      -- sent | scheduled
  scheduled_at TEXT,
  delivered INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

// Published concept cards carry a status so the app can hide drafts.
try { db.prepare("ALTER TABLE concept_cards ADD COLUMN status TEXT DEFAULT 'Published'").run(); }
catch { /* column already exists */ }

// Default admin-configurable settings, inserted once.
const SETTING_DEFAULTS = {
  appName: 'Scolrly',
  supportEmail: 'support@scolrly.com',
  maintenanceMode: 'false',
  freeQuestionsPerDay: '5',
  freeMaxMocks: '1',
  aiDoubtResolution: 'true',
  dailyReminderTime: '18:00',
  weeklyReport: 'true',
};
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [k, v] of Object.entries(SETTING_DEFAULTS)) insertSetting.run(k, v);

// Heuristic AIR estimate from a 720-mark score. Anchored so mid-500s land
// in the tens of thousands, matching the product narrative.
export function estimateRank(score) {
  const s = Math.max(0, Math.min(720, score));
  return Math.max(1, Math.round(1150000 * Math.pow(1 - s / 720, 2.45)));
}

export function statusFor(accuracy) {
  if (accuracy >= 75) return 'strong';
  if (accuracy >= 55) return 'revise';
  return 'fix';
}
