# SEO & LLM/AI Search Sync

Scan for any changes in `src/App.tsx` that should be reflected in the traditional SEO files (structured data, sitemap, robots) **and** the LLM/AI search discovery file (`llms.txt`), and apply any needed updates. This covers both how Google/Bing crawl and rank the site, and how AI assistants (ChatGPT, Claude, Perplexity, etc.) discover and summarize it when answering user questions.

## What to check

Read the following files:
- `src/App.tsx` — source of truth for services, prices, descriptions, coverage areas, and contact info
- `index.html` — JSON-LD structured data, meta description, FAQ schema
- `docs/sitemap.xml` — URL and lastmod date
- `public/llms.txt` — plain-text AI crawler summary
- `docs/robots.txt` — crawl rules

## What to update if out of sync

### index.html
- `hasOfferCatalog` — service names, descriptions, prices, and durations must match App.tsx
- `areaServed` — coverage towns must match App.tsx
- `meta name="description"` — must mention current services and price range
- `FAQPage` answers — prices and service details must match App.tsx
- `telephone` — must match WhatsApp number in App.tsx

### docs/sitemap.xml
- `<lastmod>` — update to today's date (YYYY-MM-DD format) if any SEO files changed

### public/llms.txt (LLM/AI search discovery file)
- Services list and prices must match App.tsx
- Coverage area must match App.tsx
- Contact/booking info must match App.tsx
- This is the file AI assistants read to summarize the business — keep it in plain, complete sentences, not just keyword lists

### docs/robots.txt
- Sitemap URL must point to `https://mobile-massage.uk/sitemap.xml`
- Should allow all crawlers

## Instructions

1. Read all five files listed above
2. Compare service names, descriptions, and prices in App.tsx against index.html JSON-LD and llms.txt
3. Compare coverage areas in App.tsx against index.html areaServed and llms.txt
4. If anything is out of sync, edit the relevant file(s) to bring them in line with App.tsx — this includes both the SEO files and llms.txt
5. If any file was changed, update `<lastmod>` in docs/sitemap.xml to today's date
6. Remember that `public/` and `docs/` copies of llms.txt, robots.txt, and sitemap.xml must both be updated — there's no build step that syncs them automatically
7. Report what was changed, or confirm everything (SEO and LLM/AI search) is already in sync
