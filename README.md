# Restore & Relax by Iulia

Mobile massage therapy website for **Restore & Relax by Iulia**, based in Woking, Surrey.

**Live site:** [mobile-massage.uk](https://mobile-massage.uk)
**Admin panel:** [mobile-massage.uk/admin.html](https://mobile-massage.uk/admin.html)

---

## How it works — overview

```
┌─────────────────┐     push to main     ┌──────────────────┐
│   Dev machine   │ ──────────────────── │  GitHub Pages    │
│  (Parcel build) │                      │  docs/ on main   │
└─────────────────┘                      └──────────────────┘
        │                                        │
        │ Supabase JS SDK                        │ Supabase JS SDK
        ▼                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase (eu-west-2)                   │
│   reviews table: id, name, rating, body, created_at,        │
│                  approved (bool), status (text)             │
└─────────────────────────────────────────────────────────────┘
        ▲
        │ Python script via GitHub Actions
┌───────────────────┐
│  Urban (booking   │
│  platform) API    │
└───────────────────┘
```

The site is a static React SPA. There is no server — all dynamic data comes from Supabase directly in the browser. GitHub Pages serves the built output in `docs/`.

---

## Tech stack

| Layer | Tool |
|---|---|
| UI framework | React 18 + TypeScript |
| Dev server | Vite |
| Production build | Parcel (single HTML + hashed JS/CSS in `docs/`) |
| Styling | Inline styles + Tailwind CSS utilities |
| Map | Leaflet + react-leaflet (OpenStreetMap tiles) |
| Database | Supabase (Postgres, London region) |
| Auth | Supabase passwordless magic-link (admin only) |
| Email delivery | Resend SMTP (via Supabase custom SMTP) |
| Hosting | GitHub Pages — serves `docs/` on `main` branch |
| Fonts | Self-hosted Cormorant Garamond + Playfair Display (no Google CDN) |
| Custom domain | `mobile-massage.uk` via CNAME in `docs/` |

---

## Project structure

```
restore-relax/
├── src/
│   ├── App.tsx              # Main public site (single page)
│   ├── main.tsx             # Entry point for public site
│   ├── AdminApp.tsx         # Admin review panel (separate React app)
│   ├── admin-main.tsx       # Entry point for admin
│   ├── Reviews.tsx          # Review carousel + submission form
│   ├── CoverageMap.tsx      # Leaflet coverage map
│   ├── PrivacyPolicy.tsx    # Privacy policy modal
│   ├── supabase.ts          # Supabase client + types
│   └── fonts/               # Self-hosted TTF files
├── public/
│   ├── favicon.png          # Green circle favicon with phoenix
│   ├── phoenix-logo.png     # Phoenix image used in hero badge + admin
│   └── service-*.jpg        # Service card photos
├── docs/                    # ← GitHub Pages serves this folder
│   ├── index.html           # Built public site
│   ├── admin.html           # Built admin panel
│   ├── auth-confirm.html    # Supabase magic-link landing page
│   ├── CNAME                # mobile-massage.uk
│   ├── version.json         # Auto-refresh trigger (updated on every deploy)
│   ├── robots.txt           # Disallows admin.html, auth-confirm.html
│   ├── sitemap.xml
│   └── llms.txt             # AI search discovery file
├── scripts/
│   └── sync_urban_reviews.py  # Pulls reviews from Urban API into Supabase
├── .github/workflows/
│   └── sync-urban-reviews.yml # GitHub Actions job to run the sync
├── .claude/
│   ├── commands/seo-sync.md   # /seo-sync skill for Claude Code
│   └── settings.json          # PostToolUse hook (runs after git push to main)
├── index.html               # Dev entry (public site)
├── admin.html               # Dev entry (admin panel)
└── auth-confirm.html        # Static Supabase redirect handler
```

---

## Local development

```bash
pnpm install
pnpm dev        # Vite dev server — http://localhost:5174
```

The admin panel is a separate Vite entry (`admin.html`) and loads at `http://localhost:5174/admin.html`.

---

## Building and deploying

There is no CI build step — you build locally and commit the output.

```bash
# 1. Build both pages
rm -rf .parcel-cache bundle-out
npx parcel build index.html admin.html --dist-dir bundle-out --public-url "/"

# 2. Copy JS bundles, hashed assets and HTML to docs/
for f in bundle-out/*.js bundle-out/*.png bundle-out/*.svg; do [ -f "$f" ] && cp "$f" docs/; done
cp bundle-out/index.html docs/index.html
cp bundle-out/admin.html docs/admin.html

# 3. Update version.json so live users auto-refresh
echo "{\"v\":\"$(date +%s)\"}" > docs/version.json

# 4. Commit and push
git add docs/
git commit -m "Deploy"
git checkout main && git merge dev && git push origin main && git checkout dev
```

GitHub Pages picks up `docs/` on `main` automatically — no Actions step needed for the public site.

> **Note:** `auth-confirm.html` is copied directly to `docs/` (not through Parcel) because it is a plain static HTML file with no asset references.

---

## Git workflow

| Branch | Purpose |
|---|---|
| `dev` | All day-to-day work happens here |
| `main` | Production — GitHub Pages serves `docs/` from this branch |

Always work on `dev`, then merge to `main` to deploy. Never commit directly to `main`.

---

## Auto-refresh on deploy

`docs/version.json` contains a hash that changes on every deploy:

```json
{"v":"abc123..."}
```

The public site polls this file every 5 minutes. If the hash changes, the page reloads automatically — so visitors always get the latest version without having to manually refresh.

---

## Reviews system

Reviews are stored in a Supabase `reviews` table with this structure:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Reviewer name |
| `rating` | int | 1–5 stars |
| `body` | text | Review text |
| `created_at` | timestamptz | Auto-set |
| `approved` | bool | Legacy — kept for compatibility |
| `status` | text | `pending` / `approved` / `declined` |

**Public site** only shows rows where `status = 'approved'`.

**Visitors** can submit new reviews via the form at the bottom of the Reviews section — these arrive as `status = 'pending'`.

**Admin** approves or declines reviews from the admin panel (see below).

### New review email notification

Every time a visitor submits a review (arrives as `status = 'pending'`), a Postgres trigger (`on_new_pending_review`) calls a Supabase Edge Function (`notify-new-review`), which emails `iuliabotoran9@gmail.com` via Resend with the reviewer's name, rating, and text, plus a link to the admin panel. Bulk Urban-sync imports insert directly as `status = 'approved'` and don't trigger this — only organic visitor submissions do.

The function reads its Resend API key from a `RESEND_API_KEY` secret set in the Supabase dashboard (Edge Functions → `notify-new-review` → Secrets) — not committed to this repo.

---

## Admin panel

URL: [mobile-massage.uk/admin.html](https://mobile-massage.uk/admin.html)

Login is **passwordless** — enter the admin email address and click the link in the email (delivered via Resend). No password is stored anywhere.

Once logged in:
- **Pending** tab — new reviews awaiting a decision
- **Approved** tab — reviews live on the public site
- **Declined** tab — rejected reviews (kept for reference, not shown publicly)
- **All** tab — everything

Actions per review: **Approve**, **Decline**, **Delete** (permanent).

### Auth flow

```
Admin enters email
       │
       ▼
Supabase sends magic-link email (via Resend SMTP)
       │
       ▼
Admin clicks link → lands on auth-confirm.html
       │
       ▼ (if access_token in URL hash)
Redirects to /admin.html#access_token=...
       │
       ▼
AdminApp.tsx picks up the session via supabase.auth.getSession()
       │
       ▼
Dashboard loads
```

### Email delivery — Resend

Supabase's built-in email is rate-limited to 2 emails/hour on the free plan. The project uses **Resend** as a custom SMTP provider instead:

- SMTP host: `smtp.resend.com`, port 465
- Username: `resend`
- Password: Resend API key (stored in Supabase dashboard, not in this repo)
- Sender domain: `send.mobile-massage.uk` (DNS subdomain configured in Resend)

---

## Urban reviews sync

Reviews from Iulia's [Urban](https://urban.co.uk) profile are synced into Supabase automatically.

**How it works:**

1. GitHub Actions runs `.github/workflows/sync-urban-reviews.yml` (manually triggered via the Actions tab, or on a schedule if configured)
2. `scripts/sync_urban_reviews.py` fetches all rated bookings from the Urban internal API for unit 53416 (Iulia)
3. Only reviews with text are imported; duplicates are filtered by timestamp
4. Imported reviews land as `approved = true` / `status = 'approved'` (pre-approved since they are verified Urban reviews)
5. Common misspellings of "Iulia" are auto-corrected (Lulia, lulia, Julia, Lucia)

**Required GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Description |
|---|---|
| `URBAN_AUTH_TOKEN` | Session bearer token from Urban (expires periodically — update when sync fails) |
| `URBAN_APP_TOKEN` | `x-application` header value from Urban |
| `SUPABASE_URL` | e.g. `https://qkkptkngexrytcgjyjmn.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase `service_role` key (bypasses RLS for insert) |

To run a dry-run without writing to the database, trigger the workflow manually and check the "Dry run" box.

---

## SEO files

| File | Purpose |
|---|---|
| `docs/robots.txt` | Allows all crawlers; blocks `/admin.html` and `/auth-confirm.html` |
| `docs/sitemap.xml` | Single URL sitemap for the homepage |
| `docs/llms.txt` | AI search discovery — describes the business for LLM crawlers |

The `/seo-sync` Claude Code skill (`/.claude/commands/seo-sync.md`) checks these files stay consistent with the content in `src/App.tsx` after every deploy.

---

## Supabase configuration

- **Project:** `qkkptkngexrytcgjyjmn` (eu-west-2)
- **Site URL:** `https://mobile-massage.uk`
- **Auth redirect URLs:** `https://mobile-massage.uk/auth-confirm.html`
- **RLS policies:**
  - Public can `SELECT` where `status = 'approved'`
  - Public can `INSERT` (review submissions)
  - Authenticated users (admin) can `SELECT` all rows
  - Authenticated users can `UPDATE` status/approved fields
  - Authenticated users can `DELETE` reviews

---

## Secrets and credentials

All secrets are stored in **GitHub Secrets** or the **Supabase dashboard** only. Nothing sensitive is committed to this repo.

Do not share or commit:
- `URBAN_AUTH_TOKEN` / `URBAN_APP_TOKEN`
- `SUPABASE_SERVICE_KEY`
- Resend API key
