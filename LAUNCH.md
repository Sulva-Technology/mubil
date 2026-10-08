# Launch guide

Everything needed to take the site live on the Foundation's own domain. Replace `mubilfoundation.org` with the real domain throughout.

## 1. GitHub

1. Create a **private** repository (ideally in an organisation the Foundation can own later).
2. Push this project:

   ```bash
   git remote add origin https://github.com/<org>/mubil-website.git
   ```

   ```bash
   git push -u origin master
   ```

## 2. Vercel

1. In Vercel, click **Add New > Project** and import the GitHub repository. Framework is detected as Next.js; keep the default build settings.
2. Before the first deploy, open **Environment Variables** and add each variable below for **Production** and **Preview**:

   | Variable | Production value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | From Supabase > Project Settings > API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From the same page |
   | `SUPABASE_SERVICE_ROLE_KEY` | From the same page. Mark as **Sensitive**. |
   | `RESEND_API_KEY` | From Resend > API Keys. Mark as **Sensitive**. |
   | `CONTACT_EMAIL` | The Foundation inbox that should receive messages |
   | `RESEND_FROM` | `Mubil Foundation <website@mubilfoundation.org>` |
   | `NEXT_PUBLIC_SITE_URL` | `https://mubilfoundation.org` (no trailing slash) |
   | `CRON_SECRET` | A long random string. Mark as **Sensitive**. |

   For Preview, set `NEXT_PUBLIC_SITE_URL` to the preview URL or leave it as the production URL.
3. Click **Deploy**. The daily keepalive cron in `vercel.json` registers automatically on production deploys.

## 3. Domain and DNS

1. In Vercel, open the project, then **Settings > Domains**, and add both `mubilfoundation.org` and `www.mubilfoundation.org`. Choose to redirect `www` to the apex (or the other way round).
2. Vercel shows the exact records on each domain card. Add them at the registrar's DNS settings:

   | Type | Name / Host | Value |
   | --- | --- | --- |
   | A | `@` | The value on the apex domain card (often `76.76.21.21`; newer projects may show a different IP such as `216.198.79.1`) |
   | CNAME | `www` | The value on the www domain card (for example `xxxxxxxx.vercel-dns-017.com`) |

   Always use the values Vercel shows for this project. Remove any old A, AAAA or CNAME records for `@` and `www` that point elsewhere.
3. If the registrar has a CAA record, make sure it allows `letsencrypt.org`, or Vercel can't issue the SSL certificate.
4. Wait for the domain cards to show **Valid Configuration**. SSL is issued automatically.

## 4. Email sending (Resend)

1. In Resend, open **Domains > Add Domain** and add `mubilfoundation.org`.
2. Add the DNS records Resend shows (an MX and TXT record for the sending subdomain, and a DKIM TXT record). Copy them exactly from the Resend dashboard.
3. Wait for **Verified**, then make sure `RESEND_FROM` uses an address on that domain.

## 5. Supabase

1. **Authentication > URL Configuration**
   - **Site URL:** `https://mubilfoundation.org`
   - **Redirect URLs:** add `https://mubilfoundation.org/admin/auth/callback` and `http://localhost:3000/admin/auth/callback`
2. **Authentication > Providers > Email:** keep email/password on. Turn **off** public sign-ups (Authentication > Sign In / Providers > "Allow new users to sign up") so only invited admins exist.
3. **Authentication > Emails:** optional but recommended, set up custom SMTP with Resend so password reset emails come from the Foundation's domain.
4. Confirm the migration has run (tables `events`, `posts`, `messages`, `admins` and bucket `media` exist).

## 6. Launch checklist

- [ ] Supabase Auth Site URL and Redirect URLs set for the production domain
- [ ] Public sign-ups disabled in Supabase Auth
- [ ] Resend domain verified and `RESEND_FROM` uses it
- [ ] Every environment variable set in Vercel for Production
- [ ] First admin created and added to the `admins` table (see README)
- [ ] Admin can sign in at `/admin/login`, and the tour runs once
- [ ] Demo events and news posts deleted, real ones added
- [ ] Demo copy and photos in `src/content.ts` replaced with real content
- [ ] Contact form tested in production: message appears in the Inbox **and** arrives by email
- [ ] Password reset tested from `/admin/login`
- [ ] Domain cards in Vercel show Valid Configuration, `https://` works on apex and `www`
- [ ] `https://mubilfoundation.org/sitemap.xml` lists the real pages
- [ ] Sitemap submitted in Google Search Console (Domain property, verified by DNS TXT)
- [ ] Open Graph preview checked by pasting an event link into WhatsApp (and the Facebook Sharing Debugger)
- [ ] PageSpeed Insights (mobile) run on Home, Events and a News article
- [ ] Vercel cron shows a successful `/api/keepalive` run the next day

## 7. Handover

- Transfer the GitHub repository, Vercel project and Supabase organisation to the Foundation (or add them as owners), so the Foundation owns its site.
- Share [HANDOVER.md](HANDOVER.md) with the Foundation's admins.
