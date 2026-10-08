# Mubil Foundation Website: Project Spec

You are a senior product designer and full-stack engineer with Apple and Google design standards. You are building the website for Mubil Foundation, a Nigerian foundation, for Sulva Technology. It must feel like an Apple product page crossed with Google's clarity: premium, calm, precise and fast. This is a flagship portfolio piece. Nothing generic, nothing template-looking.

## How to work in this repo

- Work in the phase I give you. Do not build ahead.
- Before writing code for a phase, show a short plan and wait for my approval.
- After each phase: run npm run lint, npm run typecheck and npm run build, and fix every error before telling me it is done.
- Verify UI by starting the dev server and taking Playwright screenshots at 360px and 1280px. Look at them and fix what is off.
- Commit at the end of each phase with a clear message.
- Never invent facts about the Foundation. Use bracketed placeholders like [MISSION STATEMENT].
- Never put secrets in code. Never import the service role key into client code.

## Stack

- Next.js 15 (App Router) + TypeScript (strict), Tailwind CSS, Framer Motion, Lenis (smooth scroll), lucide-react icons, Zod.
- Supabase: Postgres (data), Supabase Auth (admin login), Supabase Storage (images). Use the Supabase CLI for migrations.
- @supabase/ssr with three clients in lib/supabase/: browser.ts, server.ts (cookies, for Server Components and Server Actions), admin.ts (service role, server-only, import "server-only").
- Email: Resend. Rich text: Tiptap. Admin tour: Driver.js. Deploy: Vercel.
- No React Router, no Vite.

## Design philosophy

- Apple: translucent liquid glass surfaces floating over rich, living colour. Depth through layering, light and blur.
- Google: generous whitespace, strict grid, clear hierarchy, friendly rounded geometry, zero clutter. Every element earns its place.
- Rule: glass is used ONLY on floating layers (navbar, cards over imagery, modals, side panels, tooltips, stat pills, admin sidebar). Body content sits on solid surfaces for readability.

## Colour tokens (CSS variables in globals.css, mapped to Tailwind v4 in its `@theme inline` block; Tailwind's default palette is removed. Every colour must come from these so the brand can be swapped later)

- --bg: #F5F7FB (page canvas)
- --surface: #FFFFFF (cards, solid panels)
- --ink: #0B1B33 (primary text, deep navy)
- --ink-2: #44536A (secondary text; darkened from #5B6B82 so it passes WCAG AA over the ambient blob tints)
- --line: rgba(11,27,51,0.08) (dividers, borders)
- --brand: #1F5EFF (primary buttons, links, active states, focus rings)
- --brand-deep: #0A2A6B (hover, pressed, dark gradients)
- --brand-text: 60% --brand + 40% --brand-deep (brand-coloured small text and links, passes AA; use `text-brand-text`)
- --sky: #6FB8FF (ambient glow and decoration only, never text)
- --aqua: #19C3D9 (accent highlights, max one or two per screen)
- --ice: #E6F0FF (chips, tags, soft background bands)
- --night: #050B18 (dark showcase sections and footer)
- --success: #12B76A  --warning: #F5A524  --error: #E5484D

Ambient background: 3 slow drifting gradient blobs behind glass areas: --brand at 28% opacity, --sky at 35%, --aqua at 22%, 400 to 700px wide, blur 120px. On --night sections use --brand and --aqua at 40% for a deep ocean glow. Static on mobile.

## Glass recipe (components/ui/Glass.tsx, variants: subtle, regular, strong, dark)

- Light: background rgba(255,255,255,0.55), backdrop-filter blur(24px) saturate(180%), border 1px rgba(255,255,255,0.65), inner highlight inset 0 1px 0 rgba(255,255,255,0.8), shadow 0 8px 32px rgba(10,42,107,0.10).
- Dark: background rgba(10,26,60,0.50), border 1px rgba(111,184,255,0.18), shadow 0 8px 32px rgba(0,0,0,0.35).
- Subtle noise texture overlay at 3% opacity to prevent banding.
- Fallback with @supports not (backdrop-filter): solid rgba(255,255,255,0.92), same border and shadow.
- Text on glass must pass WCAG AA. Never put small grey text on glass over a photo.

## Typography (next/font)

- Display: Inter Tight 600 to 700, letter-spacing -0.03em. Body: Inter 400 and 500. Do not use SF Pro.
- Fluid scale with clamp(): hero 56 to 112px, h1 40 to 72px, h2 32 to 48px, h3 22 to 28px, body 17px, small 14px, eyebrow 13px uppercase tracking 0.08em.
- Body line length max 65 characters, line height 1.6.

## Layout and shape

- 12-column grid, max width 1280px, 8pt spacing, section padding 96 to 160px desktop, 64 to 96px mobile.
- Radii: 12px inputs and chips, 20px cards, 28px large panels, 999px pills and buttons.
- Buttons: Primary = solid --brand pill, white text, hover --brand-deep with soft --brand glow. Secondary = light glass pill with --ink text. Tertiary = text link with animated arrow.
- Focus ring: 2px --brand, offset 3px, on every interactive element.

## Motion (physical, never flashy)

- Easing cubic-bezier(0.22, 1, 0.36, 1), durations 400 to 700ms.
- Scroll reveals: fade + 24px rise + blur-to-sharp, stagger 60ms.
- Card hover: lift 4px, deeper shadow, brighter glass highlight.
- Animate only transform, opacity and filter. Respect prefers-reduced-motion. Lenis on desktop only.

## Signature components

- Floating glass navbar: detached pill 16px from top, centred, max 1100px, shrinks and grows more opaque on scroll, sliding glass indicator on the active link. Links: Home, About, Programmes, Events, News, Gallery, Contact. Mobile: glass bottom sheet menu.
- Glass, Section, Eyebrow, Button, Card, StatPill, PageHeader, SegmentedControl (iOS style sliding indicator), SmartImage (next/image, blur placeholder, locked aspect ratio), EmptyState, Skeleton, Toast, Modal.
- Footer on --night: large wordmark, link columns, contact details, social icons.

## Database (supabase/migrations)

- events: id uuid pk, title, slug unique, excerpt, description, event_date date, start_time, end_time, venue, address, map_link, cover_image_url, status ('draft' | 'published'), featured boolean, created_at, updated_at.
- posts: id uuid pk, title, slug unique, excerpt, body, cover_image_url, category, author, publish_date, status ('draft' | 'published'), created_at, updated_at.
- messages: id uuid pk, name, email, phone, subject, message, read boolean default false, created_at.
- admins: user_id uuid pk references auth.users, email, created_at.
- Trigger to update updated_at on every edit. Indexes on slug, status and dates.
- Generate TypeScript types with supabase gen types into types/database.ts.

## Row Level Security (enabled on every table)

- SQL helper function is_admin() (security definer) that checks the admins table. Use it in every policy.
- events, posts: public SELECT where status = 'published'. Admins SELECT all, INSERT, UPDATE, DELETE.
- messages: no public access. Inserts only from the server via service role. Admins SELECT and UPDATE.
- admins: readable only by admins.

## Storage

- Public bucket "media" with folders events/ and posts/. Public read, admin-only write (storage policies using is_admin()).
- Compress in the browser before upload: max 1600px wide, WebP, max 2 MB.

## Rendering

- Public pages are Server Components that query Supabase on the server.
- ISR: revalidate events and news every 60 seconds. Admin Server Actions call revalidatePath() after any publish, edit or delete.
- Only interactive pieces (navbar, motion, lightbox, forms, admin) are Client Components. Keep client JS small.
- next/image everywhere (allow the Supabase storage domain in next.config). Dynamic import heavy components.

## SEO (non-negotiable)

- generateMetadata on every page: unique title, description, canonical URL, Open Graph and Twitter tags. Event and news pages use their own title, excerpt and cover so WhatsApp, Facebook and X show rich previews.
- app/sitemap.ts with all published events and posts. app/robots.ts blocks /admin.
- JSON-LD: NGO on home, Event on events, NewsArticle on news, BreadcrumbList on detail pages.
- Dynamic Open Graph images with next/og: title on a blue glass card in the brand palette.
- Semantic HTML, one h1 per page, descriptive alt text.

## Performance budget (visitors are on Nigerian mobile data)

- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100.
- Max 3 elements with backdrop-filter visible at once on mobile. No autoplay video on mobile.

## Content rules

- All static copy, impact numbers, programmes, team and gallery data live in src/content.ts with bracketed placeholders. Never invent facts.
- Events, news and messages come from Supabase. Admin lives at /admin.

## Environment variables (document all of them in README.md and .env.example)

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CONTACT_EMAIL, NEXT_PUBLIC_SITE_URL, CRON_SECRET
