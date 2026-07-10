// Client-side helper for dashboard pages. All calls go through the Next.js
// proxy route so the admin key never reaches the browser.

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/scolrly/${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => call<T>("GET", path),
  post: <T>(path: string, body: unknown) => call<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => call<T>("PUT", path, body),
  del: <T>(path: string) => call<T>("DELETE", path),
};

// ── Shared response types ────────────────────────────────────────────────────
export interface Overview {
  stats: {
    users: number;
    activeToday: number;
    questions: number;
    attemptsToday: number;
    doubts: number;
    mockResults: number;
    liveRooms: number;
  };
  failedChapters: { id: string; name: string; subject: string; failPct: number; live: boolean }[];
  activity: { day: string; attempts: number; activeUsers: number }[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: string;
  coaching: string;
  streak: number;
  questionsAttempted: number;
  accuracy: number;
  testsCompleted: number;
  lastActive: string;
  joined: string;
}

export interface AdminQuestion {
  id: string;
  chapter: string;
  subject: string;
  year: number | null;
  difficulty: string;
  text: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  pyqFrequency: string;
  tags: string[];
}

export interface AdminChapter {
  id: string;
  name: string;
  subject: string;
  questionCount: number;
  conceptCards: number;
  hasConceptCards: boolean;
  pyqCount: number;
  completeness: number;
}

export interface AdminConceptCard {
  id: string;
  title: string;
  chapter: string;
  chapterName: string;
  subject: string;
  pyqFreq: string;
  ncertRef: string;
  status: "Published" | "Draft";
  content: string[];
  formulae: string[];
  tags: string[];
}

export interface AdminRoom {
  id: string;
  title: string;
  subject: string;
  host: string;
  duration: number;
  status: "live" | "scheduled";
  scheduledAt: string | null;
  totalMembers: number;
  liveMembers: number;
}

export interface AdminNotification {
  id: number;
  title: string;
  body: string;
  target: string;
  status: "sent" | "scheduled";
  scheduledAt: string | null;
  delivered: number;
  date: string;
}

export type AdminSettings = Record<string, string>;

export function timeAgo(iso: string): string {
  // SQLite datetimes are UTC without a zone suffix.
  const t = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z").getTime();
  if (Number.isNaN(t)) return iso;
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} hr ago`;
  return `${Math.round(mins / 1440)} days ago`;
}
