/**
 * Backfill the venues table from mic_address.venue:
 *   - group address rows by a normalized slug
 *   - pick one canonical name per venue
 *   - create venues rows (find-or-create by slug)
 *   - set mic_address.venue_id, and rewrite mic_address.venue to the canonical
 *     name so the display/URL/SEO path shows one consistent spelling
 *
 * Idempotent: re-running find-or-creates by slug and only rewrites drift.
 *
 *   node --env-file=.env.local scripts/backfill-venues.mjs            # dry run
 *   node --env-file=.env.local scripts/backfill-venues.mjs --commit   # write
 */
import { PrismaClient } from '@prisma/client';

const COMMIT = process.argv.includes('--commit');
const prisma = new PrismaClient();

const slugify = (v) => (v || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Pick the cleanest spelling of a venue from its occurrences. */
function canonical(spellings /* Map<string,count> */) {
  const entries = [...spellings.entries()];
  const score = (name) =>
    spellings.get(name) * 1000 + // frequency dominates
    (/[A-Z]/.test(name) ? 100 : 0) + // proper casing
    (/[-'.]/.test(name) ? 50 : 0) + // real punctuation (e.g. "- East Village")
    name.length; // tiebreak: more descriptive
  return entries.sort((a, b) => score(b[0]) - score(a[0]) || a[0].localeCompare(b[0]))[0][0];
}

const addrs = await prisma.mic_address.findMany({
  select: { address_id: true, venue: true },
});

// slug -> { spellings: Map<name,count>, addressIds: bigint[] }
const groups = new Map();
for (const a of addrs) {
  if (!a.venue) continue;
  const slug = slugify(a.venue);
  if (!slug) continue;
  if (!groups.has(slug)) groups.set(slug, { spellings: new Map(), addressIds: [] });
  const g = groups.get(slug);
  g.spellings.set(a.venue, (g.spellings.get(a.venue) ?? 0) + 1);
  g.addressIds.push(a.address_id);
}

const multi = [...groups.entries()].filter(([, g]) => g.spellings.size > 1);
console.log(`address rows with a venue: ${addrs.filter((a) => a.venue).length}`);
console.log(`distinct venues (by slug): ${groups.size}`);
console.log(`venues with >1 spelling: ${multi.length}  commit=${COMMIT}\n`);
console.log('--- canonical name chosen for multi-spelling venues ---');
for (const [slug, g] of multi) {
  const chosen = canonical(g.spellings);
  const others = [...g.spellings.keys()].filter((n) => n !== chosen);
  console.log(`  "${chosen}"  <=  ${others.map((o) => `"${o}"`).join(', ')}`);
}

if (COMMIT) {
  let created = 0;
  let addrsLinked = 0;
  for (const [slug, g] of groups) {
    const name = canonical(g.spellings);
    let venue = await prisma.venues.findUnique({ where: { slug } });
    if (!venue) {
      venue = await prisma.venues.create({ data: { name, slug } });
      created++;
    }
    // link + canonicalize the name on every address in the group
    const res = await prisma.mic_address.updateMany({
      where: { address_id: { in: g.addressIds } },
      data: { venue_id: venue.id, venue: name },
    });
    addrsLinked += res.count;
  }
  const venueCount = await prisma.venues.count();
  console.log(`\nDONE. created ${created} venues (table now holds ${venueCount}); addresses linked=${addrsLinked}.`);
} else {
  console.log(`\n(dry run) would create ~${groups.size} venues and link ${addrs.filter((a) => a.venue).length} addresses.`);
}
await prisma.$disconnect();
