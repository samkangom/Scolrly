# Scolrly

**Study smarter. Rank higher.** — a premium, Spotify-inspired NEET (and later JEE) exam-prep platform, built by Bright Mind Institute (BMI), Imphal.

Scolrly is a full stack:

| Part | Stack | Location | Port |
|---|---|---|---|
| **Mobile app** | Expo / React Native | `/` (root, `App.js` + `src/`) | Expo |
| **API server** | Express + SQLite (better-sqlite3) | `/server` | 4000 |
| **Admin dashboard** | Next.js 16 + Tailwind | `/admin-dashboard` | 3000 |

The mobile app is **offline-first**: it works fully on bundled placeholder data and progressively upgrades to live data when the API is reachable, so poor connectivity (a real constraint in our launch market) never blocks a student.

---

## Quick start (local dev)

Three terminals:

```bash
# 1. API server
cd server
npm install
npm start                      # → http://localhost:4000

# 2. Admin dashboard
cd admin-dashboard
npm install
npm run dev                    # → http://localhost:3000  (login: bmi-admin)

# 3. Mobile app
npm install
npx expo start                 # scan the QR with Expo Go
```

The app auto-detects the API at the Metro host on port 4000 in dev. To point it elsewhere, set `EXPO_PUBLIC_API_URL`.

### Enabling AI Doubt Drop

Doubt Drop answers with **Claude** when the server has an API key; otherwise it falls back to a built-in retrieval matcher over the concept-card library — so it always answers.

```bash
cd server
export ANTHROPIC_API_KEY=sk-ant-...
npm start
# GET /api/health now reports "aiDoubts": true
```

The server uses the official `@anthropic-ai/sdk` with `claude-opus-4-8` and structured (JSON-schema) output, prompted as a NEET tutor that anchors every answer in NCERT.

---

## Run the backend with Docker

Brings up the API + dashboard together:

```bash
cp server/.env.example server/.env        # edit secrets
ANTHROPIC_API_KEY=sk-ant-... DASHBOARD_PASSWORD=your-pass docker compose up --build
```

- API → http://localhost:4000
- Dashboard → http://localhost:3000
- SQLite data persists in the `scolrly-data` volume.

Set `JWT_SECRET`, `ADMIN_KEY`, and `DASHBOARD_PASSWORD` for any non-local deployment (see `docker-compose.yml`).

---

## What's built

**Mobile app** — 20 screens: 5-screen onboarding with an **adaptive Brain Scan** (difficulty ramps with performance, real countdown, computed per-subject accuracy → estimated AIR), Home, Practice → Chapter → **Question Session** (practice mode reveals explanations; **mock mode** is a true timed test with NEET +4/−1 scoring, per-subject breakdown, auto-submit on time-up), Mocks, Mock Result (live from the paper you just took), Progress with a real score-trend chart, Profile with a study heatmap, Study Rooms, Concept Library with search, Doubt Drop, Settings (working dark/light toggle), Paywall, Share Result, and **email sign-in**. Inter fonts, haptics, pull-to-refresh, skeletons, empty states, AsyncStorage persistence.

**API server** — device + email/JWT auth, content (chapters, questions, concept cards, mocks), attempt recording with per-chapter accuracy, streaks, daily missions, **timed mock papers** (`/api/mocks/:id/paper`, NEET marking) and submission with AIR estimation, **Claude-backed Doubt Drop**, rooms, leaderboard, and a full admin API.

**Admin dashboard** — password-gated (login page + httpOnly cookie via Next "proxy"). Seven pages, all live: overview analytics, students, question bank (add/delete), chapter health, concept cards (add/publish/delete), room scheduler (create/delete), notification composer (records sends), settings (persisted). The admin key stays server-side via a proxy route.

---

## Project layout

```
/                     Expo mobile app (App.js, src/)
  src/api/client.js   Offline-first API client (device auth, login/register)
  src/data/index.js   Bundled content (single source of truth; server seeds from it)
/server               Express + SQLite API
  src/index.js        Routes    src/ai.js  Claude Doubt Drop    src/db.js  schema
/admin-dashboard      Next.js 16 admin dashboard
  src/proxy.ts        Login gate    src/app/api/scolrly  server-side API proxy
```

---

## Roadmap

NEET first; JEE after traction (see the business plan). Known next steps: real push delivery (FCM), payments (Razorpay), full-syllabus content depth, hosted Postgres, and an EAS build for the Play Store internal-testing track.
