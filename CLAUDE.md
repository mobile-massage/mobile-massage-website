# Restore & Relax by Iulia — project notes for Claude Code

See [README.md](README.md) for full architecture, tech stack, and setup details. This file covers conventions and automation specific to working in this repo with Claude Code.

## Skills

### `/seo-sync`

Defined in `.claude/commands/seo-sync.md`. Decides whether the SEO and AI-search files (`index.html` JSON-LD, `public/llms.txt`, `docs/sitemap.xml`, `docs/robots.txt`) are out of sync with `src/App.tsx` (the source of truth for services, prices, and coverage areas), and fixes them if so. If nothing has drifted, it says so rather than making needless edits.

**Run this before every push to `main`.** A `PreToolUse` hook (`.claude/settings.json`) fires automatically when a `git push origin main` command is about to run and reminds to run `/seo-sync` first, so SEO fixes land in the same deploy rather than a follow-up one.

## Git workflow

- Work on `dev`. Merge to `main` only to deploy — GitHub Pages serves `docs/` from `main`.
- Never commit directly to `main`.

## Build/deploy gotchas

- Parcel hashes every asset (JS, CSS, images) on each build — `docs/` accumulates stale hashed files if you only copy `*.js`. Copy `*.js`, `*.css`, and `*.png`/`*.svg` from `bundle-out/`, and remove anything no longer referenced by `docs/index.html` / `docs/admin.html`.
- After copying, update `docs/version.json` with the new main-bundle hash so the auto-refresh polling picks up the deploy for users already on the page.
- `public/` and `docs/` versions of `robots.txt`, `sitemap.xml`, and `llms.txt` must be kept in sync manually — there's no build step that copies them. If you edit one, edit both.

## Review notification email

A Supabase Edge Function (`notify-new-review`) + Postgres trigger (`on_new_pending_review` on `reviews`) emails `iuliabotoran9@gmail.com` via Resend whenever a new review is submitted with `status = 'pending'`. Bulk Urban-sync imports (which insert as `status = 'approved'` directly) don't trigger it. The function needs a `RESEND_API_KEY` secret set in the Supabase dashboard under Edge Functions → `notify-new-review` → Secrets.
