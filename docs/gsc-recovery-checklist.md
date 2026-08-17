# GSC Recovery Checklist — post-Neon-lockout

Context: impressions cratered ~6/23–7/29 during the Neon compute lockout (site
served the snapshot fallback / errored). Neon is back and the live site is
healthy again (homepage 200, `/mics` 200, sitemap serving live DB URLs). This
checklist tells Google to recrawl and clears the outage-residue index buckets.

Do these in [Google Search Console](https://search.google.com/search-console)
for the `findopenmyc.com` property. None of it touches code.

## 1. Resubmit the sitemap
- Left nav → **Sitemaps**.
- Under "Add a new sitemap", enter: `sitemap.xml`  (GSC prepends the domain →
  `https://findopenmyc.com/sitemap.xml`).
- Submit. Confirm status reads **Success** and the discovered-URL count looks
  right (~448 mic URLs + the static/borough/day pages).

## 2. Validate the outage-residue buckets
For each of these, open the report → click **Validate Fix**. This queues a
recrawl and, once Google re-fetches a 200, moves the pages back to indexed.
Validation runs over ~1–2 weeks; you'll get an email on pass/fail.

- **Server error (5xx)** — 10 pages. Pure outage residue; should all pass.
- **Soft 404** — 10 pages. Snapshot pages that rendered thin during the lockout.
- **Not found (404)** — 328 pages. Click Validate Fix here too, BUT first see §4:
  most of these are dead old mic IDs. The code fix (B) 301s the recoverable ones
  to their live URL, so after that deploys, Validate Fix will pass for those and
  legitimately-dead mics will stay 404 (correct — leave them).

## 3. Spot-check a few URLs with the URL Inspection tool
- Top search bar in GSC → paste a live mic URL (e.g. from the sitemap) → **Test
  Live URL** → should say "URL is available to Google" → **Request Indexing**.
- Do this for the 3–4 highest-value pages: `/`, `/mics`, `/mics/tonight`, and one
  or two top borough pages. Manual indexing requests jump the queue for these.

## 4. Export the 404 list (feeds the code fix)
- Open **Pages** report → **Not found (404)** → **Export** (top-right) → CSV/Sheets.
- Drop the file in the repo. It confirms how many 404s are recoverable ID-drift
  (→ the B redirect handles them) vs. genuinely dead mics (→ stay 404), and
  whether the fuzzy-match fallback is worth building.

## What NOT to chase
- **Page with redirect (74)** — mostly your own canonical 301s (non-canonical
  slug → canonical URL). Working as intended; ignore unless the export shows
  redirect *chains* or redirects landing on 404s.
- **Alternate page with proper canonical tag (11)** / **Duplicate, Google chose
  different canonical (3)** — canonical tags doing their job. Low priority.
- **Discovered – currently not indexed (162, Passed)** / **Crawled – not indexed
  (37)** — crawl-budget deprioritization of thin programmatic pages. Recovery +
  internal linking pulls these in over time; that's scope **C**, not now.

## Timeline
Recrawl + validation is a 1–4 week process on Google's clock. Watch the
impressions graph and the "Not indexed" total trend down. Re-export the 404 list
in ~2 weeks to confirm the B redirect drained it.
