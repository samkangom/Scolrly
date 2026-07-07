import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { db } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'scolrly-dev-secret-change-in-prod';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = (stored || '').split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

export function signToken(user) {
  return jwt.sign({ uid: user.id, role: user.role }, JWT_SECRET, { expiresIn: '90d' });
}

export function publicUser(u) {
  return {
    id: u.id, name: u.name, initials: u.initials, email: u.email,
    targetYear: u.target_year, status: u.status, coaching: u.coaching, medium: u.medium,
    streakDays: u.streak_days, examDate: u.exam_date,
  };
}

// Requires a valid Bearer token; attaches req.user.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.uid);
    if (!user) return res.status(401).json({ error: 'Unknown user' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Simple admin gate for the dashboard (header key, or an admin-role JWT).
export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key && key === (process.env.ADMIN_KEY || 'scolrly-admin-dev')) return next();
  return requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
  });
}

// Marks today as studied and maintains the streak counter.
export function touchStreak(user) {
  const today = new Date().toISOString().slice(0, 10);
  if (user.last_study_date === today) return user.streak_days;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const next = user.last_study_date === yesterday ? user.streak_days + 1 : 1;
  db.prepare('UPDATE users SET streak_days = ?, last_study_date = ? WHERE id = ?')
    .run(next, today, user.id);
  return next;
}
