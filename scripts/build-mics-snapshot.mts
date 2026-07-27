/**
 * Build the id-enriched mic snapshot that backs the listing/search read path
 * while Neon is unavailable.
 *
 * prisma/seed-data.json is a seed *input* — it has no `id` and no lat/long,
 * because the DB assigns ids at seed time (autoincrement) and geocoding runs
 * afterwards. The live ids therefore can't be read from that file. But the
 * production sitemap lists every /mics/<id>-<slug> URL, and the slug is a pure
 * function of (name, venue, neighborhood, borough, day) via buildMicSlug. So we
 * recompute each record's slug, match it against the sitemap, and recover the
 * authoritative id offline — no database connection required.
 *
 * Run: npx tsx scripts/build-mics-snapshot.mts
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITEMAP_URL = 'https://findopenmyc.com/sitemap.xml';

// Inlined copy of lib/utils/micUrl.ts buildMicSlug — kept identical so recomputed
// slugs match the sitemap's /mics/<id>-<slug> exactly. (Inlined rather than
// imported because the type-only import chain trips tsx's ESM loader.)
const MAX_SLUG_LENGTH = 80;
const FALLBACK_SLUG = 'open-mic';
function slugifyPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function buildMicSlug(parts: (string | null | undefined)[]): string {
  const candidates = parts.filter((v): v is string => Boolean(v && v.trim()));
  const tokens = candidates.flatMap((v) => slugifyPart(v).split('-')).filter(Boolean);
  const deduped = tokens.filter((t, i) => tokens.indexOf(t) === i);
  const joined = deduped.join('-').slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
  return joined || FALLBACK_SLUG;
}

interface SeedMic {
  name: string;
  day: string | null;
  start_time: string | null;
  end_time: string | null;
  venue_name: string | null;
  borough: string | null;
  neighborhood: string | null;
  address: {
    street_name?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  venue_type: string | null;
  cost: string | null;
  stage_time: string | null;
  signup_instructions: string | null;
  host: string | null;
  instagram: string | null;
  confirmed: string | null;
  other_rules: string | null;
}

function slugForRecord(mic: SeedMic): string {
  // Same candidate order as buildMicSlug: name, venue, neighborhood, borough, day
  return buildMicSlug([mic.name, mic.venue_name, mic.neighborhood, mic.borough, mic.day]);
}

async function fetchSitemapSlugToId(): Promise<Map<string, string[]>> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const map = new Map<string, string[]>();
  // /mics/<id>-<slug> — capture id and the slug that follows it
  const re = /\/mics\/(\d+)-([a-z0-9-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const [, id, slug] = m;
    const ids = map.get(slug) ?? [];
    if (!ids.includes(id)) ids.push(id);
    map.set(slug, ids);
  }
  return map;
}

async function main() {
  const raw = readFileSync(join(ROOT, 'prisma', 'seed-data.json'), 'utf-8');
  const mics: SeedMic[] = JSON.parse(raw);
  const slugToIds = await fetchSitemapSlugToId();
  console.log(`Loaded ${mics.length} seed records; ${slugToIds.size} slugs in sitemap.`);

  const usedIds = new Set<string>();
  const unmatched: string[] = [];
  const ambiguous: string[] = [];

  const enriched = mics.map((mic) => {
    const slug = slugForRecord(mic);
    const candidates = (slugToIds.get(slug) ?? []).filter((id) => !usedIds.has(id));
    let id: string | null = null;
    if (candidates.length === 1) {
      id = candidates[0];
    } else if (candidates.length > 1) {
      id = candidates[0]; // deterministic: take the lowest unused; disambiguated by prefix in URL
      ambiguous.push(`${slug} -> [${candidates.join(', ')}] took ${id}`);
    }
    if (id) usedIds.add(id);
    else unmatched.push(`${mic.name} (${slug})`);
    return { id, ...mic };
  });

  const matched = enriched.filter((r) => r.id).length;
  console.log(`Matched ${matched}/${mics.length} records to live ids.`);
  if (ambiguous.length) {
    console.log(`\n${ambiguous.length} ambiguous slug(s):`);
    ambiguous.forEach((a) => console.log(`  ${a}`));
  }
  if (unmatched.length) {
    console.log(`\n${unmatched.length} UNMATCHED record(s) (no live id — detail link will be absent):`);
    unmatched.forEach((u) => console.log(`  ${u}`));
  }

  const out = join(ROOT, 'lib', 'data', 'mics-snapshot.json');
  writeFileSync(out, JSON.stringify(enriched, null, 2) + '\n', 'utf-8');
  console.log(`\nWrote ${enriched.length} records -> ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
