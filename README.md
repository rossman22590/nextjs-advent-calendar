# Pixio / Machine & AI Tutor Advent Calendar

A Next.js advent calendar with daily unlockable windows, a prize wheel, and a simple email/password auth flow. Backed by Postgres—no Firebase required.

## Highlights
- 24-day schedule starting on **2025-11-27** (configurable) with future days locked automatically.
- Window content types: text, image, video-file, YouTube, Spotify, gallery, link, placeholder, plus optional quiz gate. See `type.md` for copy/paste JSON.
- Prize wheel at `/c/[calendarId]/chance` with tracked spins per user.
- Admin view (`/admin`) gated by `ADMIN` email env var to inspect users, claimed days, and wheel prizes.
- Postgres migrations included; push notifications left as stubs for your own provider.
- Dark, pink/purple UI with OG preview at `/og-image.svg`.

## Stack
- Next.js 15 (App Router) + TypeScript
- NextUI v2 + TailwindCSS
- Postgres via `pg`
- Font Awesome, Framer Motion

## Quickstart
1) Install deps (project uses Yarn):
```bash
yarn install
```
2) Set env vars (see `.env.example` if present):
- `DATABASE_URL` (Postgres connection string)
- `ADMIN` (email that is treated as admin in `/admin`)
- Optional: `NEXT_PUBLIC_DEBUG_DATE=2025-11-27` to simulate a date for local testing.
3) Run migrations:
```bash
yarn migrate
```
4) Start dev server:
```bash
yarn dev
```

## Calendar rules
- Start date and length are set in `config/settings.ts` (`START_DATE_ISO`, `TOTAL_DAYS`).
- `isOpen(day)` only returns true for days on/after the start date and not beyond the current day (or debug date).
- Opened/visited state is also stored client-side in `localStorage` per calendar.

## Content JSON cheatsheet
Each window stores a `content` array. Common snippets (more in `type.md`):
```json
[{"type":"text","text":"Hello"}]
[{"type":"image","url":"https://example.com/img.jpg"}]
[{"type":"youtube","url":"https://youtu.be/xyz"}]
[{"type":"gallery","images":["https://.../1.jpg","https://.../2.jpg"]}]
[{"type":"placeholder","text":"Coming soon"}]
```
Quiz gate uses two items: first a quiz object, second the unlocked content.

## Auth
- Simple email/password registration and login stored in Postgres (`users`, `sessions` tables).
- Admin checks compare session email to `process.env.ADMIN`.

## Scripts
- `yarn dev` – run locally
- `yarn build` / `yarn start` – production build/serve
- `yarn migrate` – apply SQL migrations in `/migrations`

## OG / Social
- OpenGraph & Twitter cards configured in `app/layout.tsx` and point to `/og-image.svg`.

## Notes
- Push notifications are stubbed in `/components/NotificationManager.tsx` and `/app/api/cron/route.ts`; wire in your own provider if needed.
- Prize wheel visuals and emoji are in `components/PrizeWheel.tsx`; customize colors/segments in the DB `prizes` table.
