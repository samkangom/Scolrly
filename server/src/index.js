import express from 'express';
import cors from 'cors';
import { db, estimateRank, statusFor } from './db.js';
import { seed } from './seed.js';
import {
  hashPassword, verifyPassword, signToken, publicUser,
  requireAuth, requireAdmin, touchStreak,
} from './auth.js';

seed();

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

const parseQ = (row) => ({
  id: row.id, chapter: row.chapter_id, subject: row.subject, year: row.year,
  difficulty: row.difficulty, text: row.text, options: JSON.parse(row.options),
  correct: row.correct, explanation: row.explanation,
  pyqFrequency: row.pyq_frequency, tags: JSON.parse(row.tags || '[]'),
});
const parseCard = (row) => ({
  id: row.id, chapter: row.chapter_id, title: row.title, pyqFreq: row.pyq_freq,
  tags: JSON.parse(row.tags || '[]'), content: JSON.parse(row.content || '[]'),
  formulae: JSON.parse(row.formulae || '[]'), ncertRef: row.ncert_ref,
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'scolrly-api' }));

// ── Auth ─────────────────────────────────────────────────────────────────────
// Frictionless mobile session: identify by device, create user on first call.
app.post('/api/auth/device', (req, res) => {
  const { deviceId, name, initials, targetYear, status, coaching, medium } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
  let user = db.prepare('SELECT * FROM users WHERE device_id = ?').get(deviceId);
  if (!user) {
    const info = db.prepare(
      'INSERT INTO users (device_id, name, initials, target_year, status, coaching, medium) VALUES (?,?,?,?,?,?,?)'
    ).run(deviceId, name || 'Student', initials || 'ST', targetYear || 2026,
      status || 'Class 12', coaching || 'None', medium || 'English');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  } else if (name) {
    db.prepare('UPDATE users SET name=?, initials=?, target_year=?, status=?, coaching=?, medium=? WHERE id=?')
      .run(name, initials || user.initials, targetYear || user.target_year,
        status || user.status, coaching || user.coaching, medium || user.medium, user.id);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'email and password (min 6 chars) required' });
  }
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const initials = (name || email).split(/[\s@]/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const info = db.prepare('INSERT INTO users (email, password_hash, name, initials) VALUES (?,?,?,?)')
    .run(email, hashPassword(password), name || email.split('@')[0], initials);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email || '');
  if (!user || !verifyPassword(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.get('/api/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

app.put('/api/me', requireAuth, (req, res) => {
  const { name, initials, targetYear, status, coaching, medium } = req.body || {};
  const u = req.user;
  db.prepare('UPDATE users SET name=?, initials=?, target_year=?, status=?, coaching=?, medium=? WHERE id=?')
    .run(name ?? u.name, initials ?? u.initials, targetYear ?? u.target_year,
      status ?? u.status, coaching ?? u.coaching, medium ?? u.medium, u.id);
  res.json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(u.id)) });
});

// ── Content ──────────────────────────────────────────────────────────────────
// Chapters with per-user accuracy: a student's own attempts override the
// seeded baseline once they have answered enough questions in a chapter.
function chaptersFor(userId, subject) {
  const rows = subject
    ? db.prepare('SELECT * FROM chapters WHERE subject = ?').all(subject)
    : db.prepare('SELECT * FROM chapters').all();
  const stats = userId
    ? db.prepare(
        'SELECT chapter_id, COUNT(*) n, SUM(is_correct) c FROM attempts WHERE user_id=? GROUP BY chapter_id'
      ).all(userId).reduce((m, r) => ((m[r.chapter_id] = r), m), {})
    : {};
  return rows.map((ch) => {
    const s = stats[ch.id];
    const live = s && s.n >= 5;
    const accuracy = live ? Math.round((s.c / s.n) * 100) : ch.base_accuracy;
    return {
      id: ch.id, subject: ch.subject, name: ch.name, pyqCount: ch.pyq_count,
      accuracy, status: statusFor(accuracy),
      attempted: ch.base_attempted + (s ? s.n : 0), live: !!live,
    };
  });
}

app.get('/api/chapters', requireAuth, (req, res) => {
  res.json({ chapters: chaptersFor(req.user.id, req.query.subject) });
});

app.get('/api/questions', requireAuth, (req, res) => {
  const { chapter, limit } = req.query;
  const rows = chapter
    ? db.prepare('SELECT * FROM questions WHERE chapter_id = ?').all(chapter)
    : db.prepare('SELECT * FROM questions').all();
  res.json({ questions: rows.slice(0, Number(limit) || 100).map(parseQ) });
});

app.get('/api/concepts', requireAuth, (req, res) => {
  const rows = req.query.chapter
    ? db.prepare('SELECT * FROM concept_cards WHERE chapter_id = ?').all(req.query.chapter)
    : db.prepare('SELECT * FROM concept_cards').all();
  const marks = new Set(
    db.prepare('SELECT card_id FROM bookmarks WHERE user_id = ?').all(req.user.id).map((r) => r.card_id)
  );
  res.json({ concepts: rows.map((r) => ({ ...parseCard(r), bookmarked: marks.has(r.id) })) });
});

app.post('/api/concepts/:id/bookmark', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT 1 FROM bookmarks WHERE user_id=? AND card_id=?')
    .get(req.user.id, req.params.id);
  if (existing) {
    db.prepare('DELETE FROM bookmarks WHERE user_id=? AND card_id=?').run(req.user.id, req.params.id);
  } else {
    db.prepare('INSERT INTO bookmarks (user_id, card_id) VALUES (?,?)').run(req.user.id, req.params.id);
  }
  res.json({ bookmarked: !existing });
});

// ── Activity: attempts, missions, progress ───────────────────────────────────
app.post('/api/attempts', requireAuth, (req, res) => {
  const { questionId, picked, timeMs } = req.body || {};
  const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId || '');
  if (!q || !picked) return res.status(400).json({ error: 'questionId and picked required' });
  const isCorrect = picked === q.correct ? 1 : 0;
  db.prepare(
    'INSERT INTO attempts (user_id, question_id, chapter_id, picked, is_correct, time_ms) VALUES (?,?,?,?,?,?)'
  ).run(req.user.id, q.id, q.chapter_id, picked, isCorrect, timeMs || null);
  const streak = touchStreak(req.user);
  res.status(201).json({
    correct: !!isCorrect, correctOption: q.correct, explanation: q.explanation, streakDays: streak,
  });
});

app.get('/api/missions', requireAuth, (req, res) => {
  const chapters = chaptersFor(req.user.id).sort((a, b) => a.accuracy - b.accuracy);
  const fix = chapters.find((c) => c.status === 'fix') || chapters[0];
  const revise = chapters.find((c) => c.status === 'revise') || chapters[1];
  const strong = [...chapters].reverse().find((c) => c.status === 'strong') || chapters[chapters.length - 1];
  res.json({
    missions: [
      { type: 'fix', color: 'orange', chapter: fix.id, title: `Fix: ${fix.name}`,
        subtitle: `10 questions · Critical gap · ${fix.accuracy}% accuracy` },
      { type: 'revise', color: 'purple', chapter: revise.id, title: `Revise: ${revise.name}`,
        subtitle: `8 questions · Forgetting-curve alert · ${revise.accuracy}%` },
      { type: 'maintain', color: 'green', chapter: strong.id, title: `Maintain: ${strong.name}`,
        subtitle: `6 questions · Keep your streak · ${strong.accuracy}% strong` },
    ],
  });
});

app.get('/api/progress', requireAuth, (req, res) => {
  const uid = req.user.id;
  const results = db.prepare(
    'SELECT * FROM mock_results WHERE user_id = ? ORDER BY created_at ASC'
  ).all(uid);
  const trend = results.map((r, i) => ({ label: `M${i + 1}`, score: r.score }));
  const latest = results[results.length - 1] || null;

  const agg = db.prepare(
    'SELECT COUNT(*) n, SUM(is_correct) c, AVG(time_ms) t FROM attempts WHERE user_id = ?'
  ).get(uid);
  const wrong = db.prepare(
    'SELECT COUNT(*) n, AVG(COALESCE(time_ms, 30000)) t FROM attempts WHERE user_id = ? AND is_correct = 0'
  ).get(uid);
  // Mistake DNA heuristic: quick wrong answers read as slips, slow ones as
  // concept gaps; time-pressure share grows with average answer time.
  const wrongN = wrong.n || 0;
  const silly = Math.round(wrongN * 0.3);
  const timePressure = Math.round(wrongN * ((wrong.t || 0) > 45000 ? 0.3 : 0.15));
  const conceptGaps = Math.max(0, wrongN - silly - timePressure);

  const bySubject = db.prepare(
    `SELECT q.subject s, COUNT(*) n, SUM(a.is_correct) c
     FROM attempts a JOIN questions q ON q.id = a.question_id
     WHERE a.user_id = ? GROUP BY q.subject`
  ).all(uid).reduce((m, r) => ((m[r.s] = Math.round((r.c / r.n) * 100)), m), {});

  const chapters = chaptersFor(uid).sort((a, b) => a.accuracy - b.accuracy);
  res.json({
    scoreTrend: trend,
    latestMock: latest && {
      score: latest.score, rank: latest.rank_estimate, accuracy: latest.accuracy,
      subjectScores: JSON.parse(latest.subject_scores || '{}'),
    },
    estimatedRank: latest ? latest.rank_estimate : null,
    mistakeDNA: {
      conceptGaps, sillyMistakes: silly, timePressure,
      unattempted: 0, total: Math.max(1, wrongN),
    },
    subjectAccuracy: bySubject,
    weakestChapters: chapters.slice(0, 4),
    totals: { answered: agg.n || 0, accuracy: agg.n ? Math.round((agg.c / agg.n) * 100) : 0 },
    streakDays: req.user.streak_days,
  });
});

// ── Mocks ────────────────────────────────────────────────────────────────────
app.get('/api/mocks', requireAuth, (req, res) => {
  const mocks = db.prepare('SELECT * FROM mocks').all();
  const mine = db.prepare(
    'SELECT * FROM mock_results WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);
  const byMock = mine.reduce((m, r) => (m[r.mock_id] ??= r, m), {});
  res.json({
    mocks: mocks.map((m) => {
      const r = byMock[m.id];
      return {
        id: m.id, type: m.type, title: m.title, duration: m.duration,
        totalMarks: m.total_marks, questions: m.question_count,
        completed: !!r,
        ...(r && {
          score: r.score, rank: r.rank_estimate, accuracy: r.accuracy,
          timeTaken: r.time_taken, subjectScores: JSON.parse(r.subject_scores || '{}'),
          date: r.created_at,
        }),
      };
    }),
  });
});

app.post('/api/mocks/:id/submit', requireAuth, (req, res) => {
  const mock = db.prepare('SELECT * FROM mocks WHERE id = ?').get(req.params.id);
  if (!mock) return res.status(404).json({ error: 'Unknown mock' });
  const { score, accuracy, timeTaken, subjectScores } = req.body || {};
  if (typeof score !== 'number' || score < 0 || score > mock.total_marks) {
    return res.status(400).json({ error: `score must be 0–${mock.total_marks}` });
  }
  const rank = estimateRank(score);
  db.prepare(
    'INSERT INTO mock_results (user_id, mock_id, score, rank_estimate, accuracy, time_taken, subject_scores) VALUES (?,?,?,?,?,?,?)'
  ).run(req.user.id, mock.id, score, rank, accuracy || Math.round((score / mock.total_marks) * 100),
    timeTaken || null, JSON.stringify(subjectScores || {}));
  touchStreak(req.user);
  res.status(201).json({ score, rank, totalMarks: mock.total_marks });
});

// ── Doubts ───────────────────────────────────────────────────────────────────
// Retrieval-based answering: match the doubt against the concept-card library
// and answer from the best-matching card. A real LLM slots in here later.
function answerDoubt(question, subject) {
  const cards = db.prepare('SELECT * FROM concept_cards').all().map(parseCard);
  const words = question.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  let best = null; let bestScore = 0;
  for (const c of cards) {
    const hay = `${c.title} ${c.tags.join(' ')} ${c.content.join(' ')}`.toLowerCase();
    let score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0);
    const chSubject = db.prepare('SELECT subject FROM chapters WHERE id = ?').get(c.chapter)?.subject;
    if (subject && subject !== 'all' && chSubject === subject) score += 1;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  if (best && bestScore >= 2) {
    return {
      answer: `This maps to “${best.title}”. Key points: ${best.content.join(' ')}${
        best.formulae.length ? ` Remember: ${best.formulae.join('; ')}.` : ''
      }`,
      ncertRef: best.ncertRef,
    };
  }
  return {
    answer: 'Break the problem into what is asked vs. what is given, identify the governing NCERT principle, then apply the relevant formula step by step. Your BMI faculty will review this doubt if it needs a deeper walkthrough.',
    ncertRef: 'NCERT — general reference',
  };
}

app.post('/api/doubts', requireAuth, (req, res) => {
  const { question, subject } = req.body || {};
  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: 'question required (min 5 chars)' });
  }
  const { answer, ncertRef } = answerDoubt(question, (subject || 'all').toLowerCase());
  const info = db.prepare(
    'INSERT INTO doubts (user_id, question, subject, answer, ncert_ref) VALUES (?,?,?,?,?)'
  ).run(req.user.id, question.trim(), (subject || 'all').toLowerCase(), answer, ncertRef);
  touchStreak(req.user);
  res.status(201).json({ id: info.lastInsertRowid, answer, ncertRef });
});

app.get('/api/doubts', requireAuth, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM doubts WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(req.user.id);
  res.json({
    doubts: rows.map((d) => ({
      id: `d${d.id}`, question: d.question, subject: d.subject,
      answer: d.answer, ncertRef: d.ncert_ref, date: d.created_at,
    })),
  });
});

// ── Rooms & leaderboard ──────────────────────────────────────────────────────
app.get('/api/rooms', requireAuth, (_req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms').all();
  const members = db.prepare('SELECT * FROM room_members').all();
  res.json({
    rooms: rooms.map((r) => ({
      id: r.id, title: r.title, subject: r.subject, host: r.host, duration: r.duration,
      status: r.status, scheduledAt: r.scheduled_at, totalMembers: r.total_members,
      members: members.filter((m) => m.room_id === r.id).map((m) => ({
        initials: m.initials, color: m.color, name: m.name,
        status: m.member_status, chapter: m.chapter,
      })),
    })),
  });
});

app.post('/api/rooms/:id/join', requireAuth, (req, res) => {
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Unknown room' });
  const already = db.prepare('SELECT 1 FROM room_members WHERE room_id=? AND user_id=?')
    .get(room.id, req.user.id);
  if (!already) {
    db.prepare(
      'INSERT INTO room_members (room_id, user_id, initials, color, name, member_status, chapter) VALUES (?,?,?,?,?,?,?)'
    ).run(room.id, req.user.id, req.user.initials, 'green', req.user.name, 'studying', null);
    db.prepare('UPDATE rooms SET total_members = total_members + 1 WHERE id = ?').run(room.id);
  }
  res.json({ joined: true, totalMembers: room.total_members + (already ? 0 : 1) });
});

app.get('/api/leaderboard', requireAuth, (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const real = db.prepare(
    `SELECT u.id, u.name, u.initials, COUNT(a.id) n
     FROM users u LEFT JOIN attempts a ON a.user_id = u.id AND a.created_at >= ?
     WHERE u.role = 'student' GROUP BY u.id`
  ).all(weekAgo);
  const demo = db.prepare("SELECT * FROM users WHERE role = 'demo'").all();
  const latestScore = (uid) => db.prepare(
    'SELECT score FROM mock_results WHERE user_id=? ORDER BY created_at DESC LIMIT 1'
  ).get(uid)?.score || 0;

  const entries = [
    ...demo.map((d) => ({ name: d.name, initials: d.initials, color: 'blue',
      hoursThisWeek: d.demo_hours, score: d.demo_score, isYou: false })),
    ...real.map((r) => ({ name: r.id === req.user.id ? `${r.name} (You)` : r.name,
      initials: r.initials, color: 'green',
      hoursThisWeek: Math.round((r.n * 2) / 60 * 10) / 10 || 0,
      score: latestScore(r.id) || 300 + r.n * 3, isYou: r.id === req.user.id })),
  ].sort((a, b) => b.score - a.score).slice(0, 10)
    .map((e, i) => ({ ...e, rank: i + 1 }));
  res.json({ leaderboard: entries });
});

// ── Admin (for the Next.js dashboard) ────────────────────────────────────────
// Dashboard home: headline stats, cohort-wide weakest chapters, 7-day activity.
app.get('/api/admin/overview', requireAdmin, (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    users: db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'student'").get().c,
    activeToday: db.prepare(
      'SELECT COUNT(DISTINCT user_id) c FROM attempts WHERE created_at >= ?'
    ).get(today).c,
    questions: db.prepare('SELECT COUNT(*) c FROM questions').get().c,
    attemptsToday: db.prepare('SELECT COUNT(*) c FROM attempts WHERE created_at >= ?').get(today).c,
    doubts: db.prepare('SELECT COUNT(*) c FROM doubts').get().c,
    mockResults: db.prepare('SELECT COUNT(*) c FROM mock_results').get().c,
    liveRooms: db.prepare("SELECT COUNT(*) c FROM rooms WHERE status = 'live'").get().c,
  };

  // Cohort failure rate per chapter: real attempts blended over the seeded
  // baseline, mirroring the per-student logic in chaptersFor().
  const cohort = db.prepare(
    'SELECT chapter_id, COUNT(*) n, SUM(is_correct) c FROM attempts GROUP BY chapter_id'
  ).all().reduce((m, r) => ((m[r.chapter_id] = r), m), {});
  const failedChapters = db.prepare('SELECT * FROM chapters').all()
    .map((ch) => {
      const s = cohort[ch.id];
      const accuracy = s && s.n >= 5 ? Math.round((s.c / s.n) * 100) : ch.base_accuracy;
      return { id: ch.id, name: ch.name, subject: ch.subject, failPct: 100 - accuracy, live: !!(s && s.n >= 5) };
    })
    .sort((a, b) => b.failPct - a.failPct)
    .slice(0, 6);

  const activity = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    const key = day.toISOString().slice(0, 10);
    const next = new Date(day.getTime() + 86400000).toISOString().slice(0, 10);
    activity.push({
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      attempts: db.prepare('SELECT COUNT(*) c FROM attempts WHERE created_at >= ? AND created_at < ?').get(key, next).c,
      activeUsers: db.prepare('SELECT COUNT(DISTINCT user_id) c FROM attempts WHERE created_at >= ? AND created_at < ?').get(key, next).c,
    });
  }
  res.json({ stats, failedChapters, activity });
});

app.get('/api/admin/users', requireAdmin, (_req, res) => {
  const users = db.prepare(
    `SELECT u.*, COUNT(a.id) attempts, COALESCE(SUM(a.is_correct),0) correct,
            MAX(a.created_at) last_attempt
     FROM users u LEFT JOIN attempts a ON a.user_id = u.id
     WHERE u.role = 'student' GROUP BY u.id ORDER BY u.created_at DESC`
  ).all();
  const mocksBy = db.prepare(
    'SELECT user_id, COUNT(*) c FROM mock_results GROUP BY user_id'
  ).all().reduce((m, r) => ((m[r.user_id] = r.c), m), {});
  res.json({
    users: users.map((u) => ({
      id: u.id, name: u.name, email: u.email || `device: ${(u.device_id || '').slice(0, 14)}…`,
      status: u.status, coaching: u.coaching, streak: u.streak_days,
      questionsAttempted: u.attempts,
      accuracy: u.attempts ? Math.round((u.correct / u.attempts) * 100) : 0,
      testsCompleted: mocksBy[u.id] || 0,
      lastActive: u.last_attempt || u.created_at,
      joined: u.created_at,
    })),
  });
});

// Chapter health: content coverage per chapter for the content team.
app.get('/api/admin/chapters', requireAdmin, (_req, res) => {
  const qCounts = db.prepare('SELECT chapter_id, COUNT(*) c FROM questions GROUP BY chapter_id')
    .all().reduce((m, r) => ((m[r.chapter_id] = r.c), m), {});
  const cardCounts = db.prepare('SELECT chapter_id, COUNT(*) c FROM concept_cards GROUP BY chapter_id')
    .all().reduce((m, r) => ((m[r.chapter_id] = r.c), m), {});
  res.json({
    chapters: db.prepare('SELECT * FROM chapters').all().map((ch) => {
      const q = qCounts[ch.id] || 0;
      const cards = cardCounts[ch.id] || 0;
      // Coverage target for the pilot: 45 questions + 1 concept card per chapter.
      const completeness = Math.min(100, Math.round((q / 45) * 80 + (cards > 0 ? 20 : 0)));
      return {
        id: ch.id, name: ch.name, subject: ch.subject,
        questionCount: q, conceptCards: cards, hasConceptCards: cards > 0,
        pyqCount: ch.pyq_count, completeness,
      };
    }),
  });
});

app.get('/api/admin/doubts', requireAdmin, (_req, res) => {
  const rows = db.prepare(
    `SELECT d.*, u.name user_name FROM doubts d JOIN users u ON u.id = d.user_id
     ORDER BY d.created_at DESC LIMIT 50`
  ).all();
  res.json({
    doubts: rows.map((d) => ({
      id: d.id, user: d.user_name, question: d.question, subject: d.subject,
      answer: d.answer, date: d.created_at,
    })),
  });
});

app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    users: db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'student'").get().c,
    attemptsToday: db.prepare('SELECT COUNT(*) c FROM attempts WHERE created_at >= ?').get(today).c,
    doubts: db.prepare('SELECT COUNT(*) c FROM doubts').get().c,
    mockResults: db.prepare('SELECT COUNT(*) c FROM mock_results').get().c,
    questions: db.prepare('SELECT COUNT(*) c FROM questions').get().c,
  });
});

app.get('/api/admin/questions', requireAdmin, (_req, res) => {
  res.json({ questions: db.prepare('SELECT * FROM questions').all().map(parseQ) });
});

app.post('/api/admin/questions', requireAdmin, (req, res) => {
  const q = req.body || {};
  if (!q.id || !q.chapter || !q.text || !Array.isArray(q.options) || !q.correct) {
    return res.status(400).json({ error: 'id, chapter, text, options[], correct required' });
  }
  const ch = db.prepare('SELECT subject FROM chapters WHERE id = ?').get(q.chapter);
  if (!ch) return res.status(400).json({ error: 'Unknown chapter' });
  db.prepare(
    'INSERT INTO questions (id, chapter_id, subject, year, difficulty, text, options, correct, explanation, pyq_frequency, tags) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  ).run(q.id, q.chapter, ch.subject, q.year || null, q.difficulty || 'Medium', q.text,
    JSON.stringify(q.options), q.correct, q.explanation || '', q.pyqFrequency || 'Medium',
    JSON.stringify(q.tags || []));
  res.status(201).json({ ok: true });
});

app.delete('/api/admin/questions/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM attempts WHERE question_id = ?').run(req.params.id);
  const info = db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

// ── Admin: concept cards ─────────────────────────────────────────────────────
app.get('/api/admin/concepts', requireAdmin, (_req, res) => {
  const cards = db.prepare(
    `SELECT c.*, ch.name chapter_name, ch.subject subject
     FROM concept_cards c LEFT JOIN chapters ch ON ch.id = c.chapter_id
     ORDER BY c.title`
  ).all();
  res.json({
    cards: cards.map((c) => ({
      id: c.id, title: c.title, chapter: c.chapter_id, chapterName: c.chapter_name,
      subject: c.subject, pyqFreq: c.pyq_freq, ncertRef: c.ncert_ref,
      status: c.status || 'Published',
      content: JSON.parse(c.content || '[]'), formulae: JSON.parse(c.formulae || '[]'),
      tags: JSON.parse(c.tags || '[]'),
    })),
  });
});

app.post('/api/admin/concepts', requireAdmin, (req, res) => {
  const c = req.body || {};
  if (!c.title || !c.chapter) return res.status(400).json({ error: 'title and chapter required' });
  const ch = db.prepare('SELECT 1 FROM chapters WHERE id = ?').get(c.chapter);
  if (!ch) return res.status(400).json({ error: 'Unknown chapter' });
  const id = c.id || `card-${Date.now().toString(36)}`;
  const content = Array.isArray(c.content)
    ? c.content
    : String(c.content || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const formulae = Array.isArray(c.formulae)
    ? c.formulae
    : String(c.formulae || '').split(',').map((s) => s.trim()).filter(Boolean);
  db.prepare(
    'INSERT INTO concept_cards (id, chapter_id, title, pyq_freq, tags, content, formulae, ncert_ref, status) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(id, c.chapter, c.title, c.pyqFreq || 'Medium', JSON.stringify(c.tags || []),
    JSON.stringify(content), JSON.stringify(formulae), c.ncertRef || '', c.status || 'Published');
  res.status(201).json({ ok: true, id });
});

app.put('/api/admin/concepts/:id/status', requireAdmin, (req, res) => {
  const status = req.body?.status === 'Draft' ? 'Draft' : 'Published';
  const info = db.prepare('UPDATE concept_cards SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: info.changes > 0, status });
});

app.delete('/api/admin/concepts/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM bookmarks WHERE card_id = ?').run(req.params.id);
  const info = db.prepare('DELETE FROM concept_cards WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

// ── Admin: rooms ─────────────────────────────────────────────────────────────
app.get('/api/admin/rooms', requireAdmin, (_req, res) => {
  const counts = db.prepare('SELECT room_id, COUNT(*) c FROM room_members GROUP BY room_id')
    .all().reduce((m, r) => ((m[r.room_id] = r.c), m), {});
  res.json({
    rooms: db.prepare('SELECT * FROM rooms').all().map((r) => ({
      id: r.id, title: r.title, subject: r.subject, host: r.host, duration: r.duration,
      status: r.status, scheduledAt: r.scheduled_at,
      totalMembers: r.total_members, liveMembers: counts[r.id] || 0,
    })),
  });
});

app.post('/api/admin/rooms', requireAdmin, (req, res) => {
  const r = req.body || {};
  if (!r.title) return res.status(400).json({ error: 'title required' });
  const id = r.id || `room-${Date.now().toString(36)}`;
  const status = r.status === 'live' ? 'live' : 'scheduled';
  db.prepare(
    'INSERT INTO rooms (id, title, subject, host, duration, status, scheduled_at, total_members) VALUES (?,?,?,?,?,?,?,?)'
  ).run(id, r.title, r.subject || 'biology', r.host || 'BMI Faculty', r.duration || 45,
    status, r.scheduledAt || null, r.totalMembers || 0);
  res.status(201).json({ ok: true, id });
});

app.delete('/api/admin/rooms/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM room_members WHERE room_id = ?').run(req.params.id);
  const info = db.prepare('DELETE FROM rooms WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

// ── Admin: notifications ─────────────────────────────────────────────────────
// Audience size estimate so "delivered" counts are believable in the pilot.
function audienceSize(target) {
  if (target === 'All Users') return db.prepare("SELECT COUNT(*) c FROM users WHERE role='student'").get().c;
  if (target === 'Class 12') return db.prepare("SELECT COUNT(*) c FROM users WHERE role='student' AND status='Class 12'").get().c;
  if (target === 'Class 11') return db.prepare("SELECT COUNT(*) c FROM users WHERE role='student' AND status='Class 11'").get().c;
  if (target === 'Droppers') return db.prepare("SELECT COUNT(*) c FROM users WHERE role='student' AND status='Dropper'").get().c;
  return db.prepare("SELECT COUNT(*) c FROM users WHERE role='student'").get().c;
}

app.get('/api/admin/notifications', requireAdmin, (_req, res) => {
  res.json({
    notifications: db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all()
      .map((n) => ({
        id: n.id, title: n.title, body: n.body, target: n.target,
        status: n.status, scheduledAt: n.scheduled_at, delivered: n.delivered, date: n.created_at,
      })),
  });
});

app.post('/api/admin/notifications', requireAdmin, (req, res) => {
  const n = req.body || {};
  if (!n.title || !n.body) return res.status(400).json({ error: 'title and body required' });
  const scheduled = n.status === 'scheduled';
  const delivered = scheduled ? 0 : audienceSize(n.target || 'All Users');
  const info = db.prepare(
    'INSERT INTO notifications (title, body, target, status, scheduled_at, delivered) VALUES (?,?,?,?,?,?)'
  ).run(n.title, n.body, n.target || 'All Users', scheduled ? 'scheduled' : 'sent',
    n.scheduledAt || null, delivered);
  res.status(201).json({ ok: true, id: info.lastInsertRowid, delivered });
});

// ── Admin: settings ──────────────────────────────────────────────────────────
app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  res.json({ settings: rows.reduce((m, r) => ((m[r.key] = r.value), m), {}) });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const patch = req.body || {};
  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );
  const tx = db.transaction((entries) => {
    for (const [k, v] of entries) upsert.run(k, String(v));
  });
  tx(Object.entries(patch));
  const rows = db.prepare('SELECT key, value FROM settings').all();
  res.json({ ok: true, settings: rows.reduce((m, r) => ((m[r.key] = r.value), m), {}) });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Scolrly API listening on :${PORT}`));
