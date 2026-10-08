# Mubil Foundation website

The public website and admin dashboard for Mubil Foundation, built by Sulva Technology.

- **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Supabase (Postgres, Auth, Storage), Resend, Vercel.
- **Design system:** documented in [CLAUDE.md](CLAUDE.md) and shown live at `/styleguide`.
- **Launch steps:** [LAUNCH.md](LAUNCH.md). **Guide for the Foundation's team:** [HANDOVER.md](HANDOVER.md).

## What's where

| Path | What it is |
| --- | --- |
| `src/content.ts` | All static copy, impact numbers, programmes, team and gallery. Replace the demo content here. |
| `src/app/(site)` | Public pages: home, about, programmes, events, news, gallery, contact |
| `src/app/admin` | Admin dashboard: login, overview, events, news, inbox, help |
| `src/components` | UI building blocks (`ui/`), page sections and admin components |
| `src/lib/supabase` | Supabase clients: `browser`, `server` (cookies), `public` (cookie-free, for static pages), `admin` (service role, server only) |
| `supabase/migrations` | Database schema, Row Level Security and storage policies |
| `supabase/seed.sql`, `scripts/seed.mjs` | Demo events and news posts |
| `tests/` | RLS tests, Playwright end-to-end and accessibility tests |

## Setup

Requirements: Node.js 20 or newer, a Supabase project, and (for email) a Resend account.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables.** Copy `.env.example` to `.env.local` and fill in:

   | Variable | Where to find it | Used for |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API | All Supabase calls |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page (anon or publishable key) | Public reads, admin login |
   | `SUPABASE_SERVICE_ROLE_KEY` | Same page. **Secret.** Server only. | Contact form inserts, keepalive cron |
   | `RESEND_API_KEY` | Resend > API Keys | Emailing contact messages |
   | `CONTACT_EMAIL` | The Foundation's inbox | Where contact messages are emailed |
   | `RESEND_FROM` | Optional, e.g. `Mubil Foundation <website@yourdomain.org>` | Sender address (domain must be verified in Resend) |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.org` in production | Canonical URLs, sitemap, share links |
   | `CRON_SECRET` | Any long random string | Protects `/api/keepalive` |

   Without `RESEND_API_KEY` and `CONTACT_EMAIL` the contact form still saves messages to the Inbox; it just skips the email.

3. **Database.** Apply the migration with the Supabase CLI:

   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```

   ```bash
   npx supabase db push
   ```

   Or paste `supabase/migrations/20261007000000_init.sql` into the Supabase SQL editor and run it. It creates the tables, indexes, the `is_admin()` helper, Row Level Security on every table, and the public `media` storage bucket.

4. **Demo content (optional).** Loads 7 events and 7 news posts, including one draft of each:

   ```bash
   node --env-file=.env.local scripts/seed.mjs
   ```

5. **Run it**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. The design system is at http://localhost:3000/styleguide.

## Adding the first admin

1. In Supabase, open **Authentication > Users > Add user**, enter the admin's email and a password, and tick **Auto Confirm User**.
2. Copy the new user's **User UID**.
3. In the **SQL editor**, run (with the real values):

   ```sql
   insert into public.admins (user_id, email)
   values ('PASTE-USER-UID-HERE', 'admin@example.org');
   ```

4. Sign in at `/admin/login`. The guided tour starts on the first sign-in.

A signed-in user who is not in `admins` sees an "Access not granted" screen, and the database refuses their writes.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm test` | Vitest: contact form action tests and RLS tests against Supabase |
| `npm run test:e2e` | Playwright: accessibility (axe), admin guard, admin publishing flow. Start the app first. |
| `node scripts/screenshots.mjs <url> /route ...` | Full-page screenshots at 360px and 1280px (`WIDTHS=360,768,1280,1920` for more) |

Some tests need accounts and skip without them. Add these to `.env.local` to run them:

- `TEST_NONADMIN_EMAIL` / `TEST_NONADMIN_PASSWORD`: a normal user **not** in `admins`. Proves non-admins can't insert, update or delete.
- `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`: an admin. Runs the full create, publish, unpublish, delete flow.

## How publishing works

- Public pages are static and refresh every 60 seconds (ISR). Saving, publishing or deleting in the admin also refreshes the affected pages immediately.
- Public pages read Supabase with the anon key through a cookie-free client, so Row Level Security only ever returns published rows.
- Admin Server Actions check `is_admin()` on the server and run as the signed-in user, so RLS applies a second time.
- Cover images are resized to 1600px WebP in the browser before upload to the `media` bucket.

## Replacing the demo content

- **Text, numbers, team, programmes, gallery:** edit `src/content.ts`. Every demo value is there.
- **Photos:** demo photos come from Unsplash. Replace the `demoPhoto(...)` calls in `src/content.ts` with paths to files in `public/` or Supabase Storage URLs. When no Unsplash photos remain, remove `images.unsplash.com` from `next.config.ts`, the `img-src` CSP entry, and the preconnect in `src/app/layout.tsx`.
- **Demo events and posts:** delete them from the admin dashboard.
- **Brand colour:** change `--brand` and `--brand-deep` in `src/app/globals.css` (and in `src/lib/og/card.tsx`, which can't read CSS variables), then check contrast with `npm run test:e2e`.
