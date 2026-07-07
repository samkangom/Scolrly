# Scolrly API Server

Express + SQLite backend for the Scolrly mobile app and admin dashboard.

## Run

```bash
cd server
npm install
npm start          # listens on :4000, seeds the DB from ../src/data on first run
```

The mobile app auto-discovers the API in Expo dev (same host as Metro, port 4000).
Override with `EXPO_PUBLIC_API_URL` in the app, `PORT` / `JWT_SECRET` / `ADMIN_KEY` /
`SCOLRLY_DATA_DIR` on the server.

## Design

- **Offline-first client contract** — every app call times out fast and falls back
  to bundled data, so the app is fully usable with no server (a launch-market
  requirement). The server is the source of truth when reachable.
- **Device sessions** — `POST /api/auth/device` creates/resumes a user keyed by a
  device ID, so students get a synced account with zero sign-up friction.
  Email/password (`/api/auth/register`, `/api/auth/login`) exists for later.
- **Server-graded attempts** — `POST /api/attempts` grades against the DB, updates
  the streak, and feeds per-chapter accuracy that overrides the seeded baseline
  once a student has ≥5 attempts in a chapter.
- **Rank estimation** — mock submissions get a heuristic AIR from score
  (see `estimateRank` in `src/db.js`); replace with percentile tables when real
  cohort data exists.
- **Doubt answering** — retrieval over the concept-card library (keyword + subject
  match). An LLM call slots into `answerDoubt` in `src/index.js` later.

## Endpoints

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/device`, `/register`, `/login` · `GET/PUT /api/me` |
| Content | `GET /api/chapters`, `/api/questions`, `/api/concepts` · `POST /api/concepts/:id/bookmark` |
| Activity | `POST /api/attempts` · `GET /api/missions`, `/api/progress` |
| Mocks | `GET /api/mocks` · `POST /api/mocks/:id/submit` |
| Doubts | `POST /api/doubts` · `GET /api/doubts` |
| Social | `GET /api/rooms` · `POST /api/rooms/:id/join` · `GET /api/leaderboard` |
| Admin | `GET /api/admin/stats` · `GET/POST/DELETE /api/admin/questions` (header `x-admin-key`) |

All non-auth endpoints require `Authorization: Bearer <token>`.
