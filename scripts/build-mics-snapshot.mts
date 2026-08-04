/**
 * Rebuild the mic snapshot (lib/data/mics-snapshot.json) that backs the
 * listing/detail read path as an automatic fallback when Neon is unavailable.
 *
 * This dumps the live DB by id — real ids, coordinates, host records and every
 * detail field — so the fallback keeps its map pins and detail pages stay
 * faithful. Re-run whenever the live data drifts:
 *
 *   npx tsx scripts/build-mics-snapshot.mts
 *
 * The record shape here MUST stay in sync with SnapshotRecord in
 * lib/data/micsSnapshot.ts (the reader that projects these back into MicListItem
 * /MicDetail).
 */
import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const prisma = new PrismaClient();

// Prisma Time(6) comes back as a Date on 1970-01-01; the reader re-wraps the
// "HH:MM:SS" back into that same ISO string, so store just the clock part.
function toClock(d: Date | null): string | null {
  return d ? d.toISOString().slice(11, 19) : null;
}

async function main() {
  const mics = await prisma.mics.findMany({
    orderBy: { id: 'asc' },
    include: {
      mic_address: true,
      mic_cost: true,
      mic_occurrence: true,
      signup_instructions: true,
      host_mics: { include: { mic_host: true } },
    },
  });

  const records = mics.map((m) => {
    const host = m.host_mics[0]?.mic_host ?? null;
    return {
      id: String(m.id),
      name: m.name,
      day: m.day,
      start_time: toClock(m.start_time),
      end_time: toClock(m.end_time),
      venue_name: m.mic_address?.venue ?? null,
      borough: m.borough,
      neighborhood: m.mic_address?.neighborhood ?? null,
      address: {
        street_name: m.mic_address?.street_name ?? null,
        unit_number: m.mic_address?.unit_number ?? null,
        city: m.mic_address?.city ?? null,
        state: m.mic_address?.state ?? null,
        zipcode: m.mic_address?.zipcode ?? null,
        country: m.mic_address?.country ?? null,
        latitude: m.mic_address?.latitude ?? null,
        longitude: m.mic_address?.longitude ?? null,
      },
      venue_type: m.venue_type,
      cost: m.mic_cost?.cost_amount ?? null,
      stage_time: m.stage_time,
      schedule: m.mic_occurrence?.schedule ?? null,
      signup_instructions: m.signup_instructions?.instructions ?? null,
      host: host?.first_host ?? null,
      host_email: host?.email ?? null,
      host_instagram: host?.instagram ?? null,
      instagram: m.instagram,
      website: m.website,
      email: m.email_address,
      phone: m.phone_number,
      notes: m.notes,
      confirmed: m.confirmed,
      other_rules: m.other_rules,
    };
  });

  const withCoords = records.filter((r) => r.address.latitude && r.address.longitude).length;
  console.log(`Dumped ${records.length} mics (${withCoords} with coordinates).`);

  const out = join(ROOT, 'lib', 'data', 'mics-snapshot.json');
  writeFileSync(out, JSON.stringify(records, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${records.length} records -> ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
