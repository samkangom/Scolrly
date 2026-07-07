// Seeds the SQLite DB from the mobile app's data module (single source of truth).
import { db } from './db.js';
import {
  CHAPTERS, QUESTIONS, CONCEPT_CARDS, MOCK_TESTS, STUDY_ROOMS, LEADERBOARD,
} from '../../src/data/index.js';

export function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM chapters').get().c;
  if (count > 0) return false;

  const tx = db.transaction(() => {
    const insCh = db.prepare(
      'INSERT INTO chapters (id, subject, name, pyq_count, base_accuracy, base_attempted) VALUES (?,?,?,?,?,?)'
    );
    for (const c of CHAPTERS) insCh.run(c.id, c.subject, c.name, c.pyqCount, c.accuracy, c.attempted);

    const insQ = db.prepare(
      'INSERT INTO questions (id, chapter_id, subject, year, difficulty, text, options, correct, explanation, pyq_frequency, tags) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    );
    for (const q of QUESTIONS) {
      insQ.run(q.id, q.chapter, q.subject, q.year, q.difficulty, q.text,
        JSON.stringify(q.options), q.correct, q.explanation, q.pyqFrequency, JSON.stringify(q.tags));
    }

    const insC = db.prepare(
      'INSERT INTO concept_cards (id, chapter_id, title, pyq_freq, tags, content, formulae, ncert_ref) VALUES (?,?,?,?,?,?,?,?)'
    );
    for (const c of CONCEPT_CARDS) {
      insC.run(c.id, c.chapter, c.title, c.pyqFreq, JSON.stringify(c.tags),
        JSON.stringify(c.content), JSON.stringify(c.formulae), c.ncertRef);
    }

    const insM = db.prepare(
      'INSERT INTO mocks (id, type, title, duration, total_marks, question_count) VALUES (?,?,?,?,?,?)'
    );
    for (const m of MOCK_TESTS) insM.run(m.id, m.type, m.title, m.duration, m.totalMarks, m.questions);

    const insR = db.prepare(
      'INSERT INTO rooms (id, title, subject, host, duration, status, scheduled_at, total_members) VALUES (?,?,?,?,?,?,?,?)'
    );
    const insRM = db.prepare(
      'INSERT INTO room_members (room_id, initials, color, name, member_status, chapter) VALUES (?,?,?,?,?,?)'
    );
    for (const r of STUDY_ROOMS) {
      insR.run(r.id, r.title, r.subject, r.host, r.duration, r.status, r.scheduledAt, r.totalMembers);
      for (const m of r.members) insRM.run(r.id, m.initials, m.color, m.name, m.status, m.chapter);
    }

    // Demo cohort so the leaderboard is populated before real users arrive.
    const insU = db.prepare(
      "INSERT INTO users (name, initials, demo_score, demo_hours, role) VALUES (?,?,?,?,'demo')"
    );
    for (const e of LEADERBOARD.filter((x) => !x.isYou)) {
      insU.run(e.name, e.initials, e.score, e.hoursThisWeek);
    }
  });
  tx();
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const did = seed();
  console.log(did ? 'Seeded database.' : 'Database already seeded — skipped.');
}
