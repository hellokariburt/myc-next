import { PrismaClient } from '@prisma/client';

/**
 * One-off: add the two Comedy in Harlem open mics
 * (https://www.comedyinharlem.com/pages/open-mic) to the live mic tables:
 *
 *   1. "Funny Lines Open Mic"   — every Monday, sign-up 5pm / starts 5:30pm,
 *      $5 for a 5-minute set, hosted by Sashalyn Medina. Fully confirmed off
 *      the flyer.
 *   2. "Paid by the Bell Open Mic" — every Tuesday, comedy-competition format,
 *      hosted by Rashad Bashir. The flyer bottom was cut off, so its START TIME
 *      and COST are unconfirmed — fill the two constants below before running.
 *
 * Both mics share one venue/address row (same address, geocoded once). Manhattan
 * (Harlem). Idempotent per mic — skips a mic whose name already exists.
 *
 * Run:  npx tsx scripts/approve-comedy-in-harlem.ts
 * Safe to delete this file afterward.
 */

// ─── CONFIRM BEFORE RUNNING ──────────────────────────────────────────────────
// Paid by the Bell — not visible on the flyer. Leave null to insert without them
// (start time blank on the card, cost renders as "Free").
const PBTB_START_TIME: string | null = '18:00'; // 6:00 PM
const PBTB_COST: string | null = 'Free';
// ─────────────────────────────────────────────────────────────────────────────

const p = new PrismaClient();

const VENUE = 'Comedy in Harlem';
const STREET = '750A St. Nicholas Avenue';
const ZIP = '10031';
const IG = '@comedyinharlem';
const EMAIL = 'info@comedyinharlem.com';
const PHONE = '347-766-3001';
const WEBSITE = 'https://www.comedyinharlem.com/pages/open-mic';
const CONFIRMED = 'Added from comedyinharlem.com flyer, 9/21';

async function geocode(address: string): Promise<{ lat: string; lng: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'OpenMYC-Geocoder/1.0' } });
  const data = await res.json();
  return data.length > 0 ? { lat: data[0].lat, lng: data[0].lon } : null;
}

/** "17:30" -> a Time-only Date (1970 epoch, matches the schema); null for blank. */
function toTime(value: string | null): Date | null {
  if (!value) return null;
  const m = value.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return new Date(`1970-01-01T${m[1].padStart(2, '0')}:${m[2]}:00.000Z`);
}

async function main() {
  const coords = await geocode(`${STREET}, New York, NY ${ZIP}`);
  if (coords) {
    console.log(`Geocoded to ${coords.lat}, ${coords.lng}`);
  } else {
    console.warn('Geocoding returned no result — inserting without a map pin.');
  }

  await p.$transaction(async (tx) => {
    // One shared address row for the venue.
    const address = await tx.mic_address.create({
      data: {
        venue: VENUE,
        street_name: STREET,
        city: 'New York',
        state: 'NY',
        zipcode: ZIP,
        country: 'United States',
        neighborhood: 'Harlem',
        unit_number: 0,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      },
    });

    // Shared contact fields written onto each mics row.
    const contact = {
      borough: 'manhattan',
      instagram: IG,
      email_address: EMAIL,
      phone_number: PHONE,
      website: WEBSITE,
      confirmed: CONFIRMED,
      address_id: address.address_id,
    };

    // ── 1. Funny Lines Open Mic ──────────────────────────────────────────────
    const funnyExists = await tx.mics.findFirst({
      where: { name: { equals: 'Funny Lines Open Mic', mode: 'insensitive' } },
      select: { id: true },
    });
    if (funnyExists) {
      console.log(`"Funny Lines Open Mic" already exists as mic #${funnyExists.id}. Skipping.`);
    } else {
      const cost = await tx.mic_cost.create({ data: { cost_amount: '$5 (5 min set)' } });
      const signup = await tx.signup_instructions.create({
        data: {
          instructions:
            'Sign up at 5pm, show starts at 5:30pm. $5 for a 5-minute set ($5 audience admission). A/B/C/D train to 145th St.',
        },
      });
      const mic = await tx.mics.create({
        data: {
          ...contact,
          name: 'Funny Lines Open Mic',
          day: 'monday',
          start_time: toTime('17:30'),
          venue_type: 'Comedy Club',
          stage_time: '5 minutes',
          cost_id: cost.cost_id,
          signup_id: signup.signup_id,
        },
      });
      const host = await tx.mic_host.create({ data: { first_host: 'Sashalyn Medina' } });
      await tx.host_mics.create({ data: { mics_id: mic.id, host_id: host.host_id } });
      console.log(`Created mic #${mic.id} "Funny Lines Open Mic" (Monday 5:30 PM, Harlem).`);
    }

    // ── 2. Paid by the Bell Open Mic ─────────────────────────────────────────
    const bellExists = await tx.mics.findFirst({
      where: { name: { equals: 'Paid by the Bell Open Mic', mode: 'insensitive' } },
      select: { id: true },
    });
    if (bellExists) {
      console.log(`"Paid by the Bell Open Mic" already exists as mic #${bellExists.id}. Skipping.`);
    } else {
      const cost = PBTB_COST
        ? await tx.mic_cost.create({ data: { cost_amount: PBTB_COST } })
        : null;
      const mic = await tx.mics.create({
        data: {
          ...contact,
          name: 'Paid by the Bell Open Mic',
          day: 'tuesday',
          start_time: toTime(PBTB_START_TIME),
          venue_type: 'Comedy Club',
          other_rules:
            'Harlem Evenings Comedy presents a comedy show competition — amateur and experienced comics test their best original jokes to win cash.',
          cost_id: cost?.cost_id ?? null,
        },
      });
      const host = await tx.mic_host.create({ data: { first_host: 'Rashad Bashir' } });
      await tx.host_mics.create({ data: { mics_id: mic.id, host_id: host.host_id } });
      console.log(
        `Created mic #${mic.id} "Paid by the Bell Open Mic" (Tuesday${
          PBTB_START_TIME ? ` ${PBTB_START_TIME}` : ' — time TBD'
        }, Harlem).`
      );
    }
  });
}

main()
  .catch((e) => {
    console.error('FAILED:', e.message);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
