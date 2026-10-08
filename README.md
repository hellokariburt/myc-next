# OpenMYC — NYC Open Mic Finder

The web app behind [findopenmyc.com](https://findopenmyc.com): a searchable, map-based
directory of stand-up comedy open mics across New York City. Built for comics looking
for stage time — filter by borough, day, and cost, see what's on **tonight** first, and
get the details that matter (sign-up, cost, host, exact time and location).

## Features

- **Search & filter** mics by borough, day of week, cost (free), and free-text venue/neighborhood.
- **Today-first sorting** — the listing surfaces tonight's mics first, in start-time order, computed in NYC time so it agrees across time zones.
- **Map view** with geocoded venue pins, plus per-mic detail pages (host, cost, sign-up instructions, schedule).
- **User submissions** — anyone can submit a mic (`/submit`); submissions land in a pending queue for admin review.
- **Reports** — visitors can flag an incorrect or closed mic; reports are triaged in the admin dashboard.
- **Admin dashboard** (`/admin`) — review submissions, resolve reports, token-gated and never indexed.
- **Soft deletes** — mics can be taken down (e.g. a venue closes) via an `active` flag without deleting the row, so reports stay linked and old URLs still resolve.
- **Resilient reads** — if the database is unavailable, listings and detail pages fall back to a committed snapshot so the site stays up.
- **SEO** — dynamic sitemap, Open Graph images, and legacy-URL recovery (old `/mics/<id>` links redirect to their current canonical path).
- **Bilingual** — English and Spanish via a lightweight in-repo i18n layer.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) · React 18 · TypeScript
- [Prisma 5](https://www.prisma.io/) ORM against **PostgreSQL** (Neon)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TanStack Query](https://tanstack.com/query) for client data fetching
- Deployed on [Vercel](https://vercel.com/); analytics via `@vercel/analytics` + GoatCounter

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npx prisma generate          # generate the Prisma client
npm run dev                  # http://localhost:3000
```

Against a fresh database, apply migrations and seed:

```bash
npm run db:migrate           # prisma migrate dev
npm run db:seed              # seed mics  (also: db:seed:shows, db:seed:clubs)
```

### Environment variables

See `.env.example`. The essentials:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_URL` | Prisma datasource (pooled connection) |
| `POSTGRES_URL_NON_POOLING` | Direct connection, used for `prisma migrate` |
| `ADMIN_TOKEN` | Secret that gates `/admin` (its hash authorizes the admin cookie) |
| `NEXT_PUBLIC_GOAT_COUNTER` | _(optional)_ GoatCounter analytics endpoint |

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the dev server |
| `build` | `prisma generate` + production build |
| `start` | Start the production server |
| `test` | Run the full gate: `prettier:check` → `lint` → `typecheck` → `jest` |
| `jest` / `jest:watch` | Run tests (watch mode) |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint + Stylelint |
| `prettier:write` | Format all `.ts`/`.tsx` |
| `db:migrate` | `prisma migrate dev` |
| `db:seed` / `:shows` / `:clubs` | Seed the respective tables |
| `db:generate` | Regenerate the Prisma client |

Rebuild the DB-down fallback snapshot after data changes:

```bash
npx tsx scripts/build-mics-snapshot.mts   # writes lib/data/mics-snapshot.json
```

## Project structure

```
app/              Next.js App Router (routes + API)
  mics/           listing, [id] detail, borough pages
  clubs/          comedy club directory
  submit/         public mic-submission form
  admin/          submissions + reports dashboard (token-gated)
  api/            /api/mics, /api/submit-mic, /api/report-mic
components/       UI components (mic cards, map, admin, …)
lib/
  services/       data access (mics, shows, clubs, approveSubmission)
  data/           mics-snapshot.json + reader (DB-down fallback)
  i18n/           en.json / es.json + t() helper
  constants/      report reasons, report statuses, …
prisma/           schema.prisma, migrations, seed scripts
scripts/          one-off + maintenance scripts (snapshot builder, …)
```

## Data model

Mics are stored normalized: `mics` references `mic_address`, `mic_cost`,
`signup_instructions`, and `mic_occurrence`, with hosts joined through
`host_mics` → `mic_host`. Alongside live mics, the schema holds `shows` and
`clubs` (directory content), `mic_submissions` (the pending-review queue), and
`mic_reports` (user-flagged issues). See `prisma/schema.prisma` for the full shape.
