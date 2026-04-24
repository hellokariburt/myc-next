import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function toTimeValue(timeStr: string | null): string | undefined {
  if (!timeStr) return undefined;
  return `1970-01-01T${timeStr}.000Z`;
}

async function main() {
  const raw = readFileSync(join(__dirname, 'seed-data.json'), 'utf-8');
  const mics: SeedMic[] = JSON.parse(raw);

  console.log(`Seeding ${mics.length} mics...`);

  // Clear existing data in order (respect foreign keys)
  console.log('Clearing existing data...');
  await prisma.host_mics.deleteMany();
  await prisma.mics.deleteMany();
  await prisma.mic_address.deleteMany();
  await prisma.mic_cost.deleteMany();
  await prisma.mic_host.deleteMany();
  await prisma.signup_instructions.deleteMany();

  let created = 0;
  for (const mic of mics) {
    // Create address
    const address = await prisma.mic_address.create({
      data: {
        venue: mic.venue_name,
        street_name: mic.address.street_name ?? null,
        city: mic.address.city ?? null,
        state: mic.address.state ?? null,
        zipcode: mic.address.zipcode ?? null,
        country: mic.address.country ?? null,
        neighborhood: mic.neighborhood,
        unit_number: 0,
      },
    });

    // Create or find cost
    let costRecord = null;
    if (mic.cost) {
      costRecord = await prisma.mic_cost.create({
        data: { cost_amount: mic.cost },
      });
    }

    // Create signup instructions
    let signupRecord = null;
    if (mic.signup_instructions) {
      signupRecord = await prisma.signup_instructions.create({
        data: { instructions: mic.signup_instructions },
      });
    }

    // Create the mic
    await prisma.mics.create({
      data: {
        name: mic.name,
        day: mic.day,
        borough: mic.borough,
        start_time: toTimeValue(mic.start_time),
        end_time: toTimeValue(mic.end_time),
        confirmed: mic.confirmed,
        instagram: mic.instagram,
        venue_type: mic.venue_type,
        stage_time: mic.stage_time,
        other_rules: mic.other_rules,
        notes: null,
        address_id: address.address_id,
        cost_id: costRecord?.cost_id ?? null,
        signup_id: signupRecord?.signup_id ?? null,
      },
    });

    created++;
    if (created % 50 === 0) {
      console.log(`  ${created}/${mics.length} mics created...`);
    }
  }

  // Create hosts separately and link via host_mics
  const hostsMap = new Map<string, bigint>();
  const allMics = await prisma.mics.findMany({ select: { id: true, name: true } });

  for (let i = 0; i < mics.length; i++) {
    const mic = mics[i];
    if (!mic.host) continue;

    const dbMic = allMics[i];
    if (!dbMic) continue;

    let hostId = hostsMap.get(mic.host);
    if (!hostId) {
      const host = await prisma.mic_host.create({
        data: {
          first_host: mic.host,
          instagram: mic.instagram,
        },
      });
      hostId = host.host_id;
      hostsMap.set(mic.host, hostId);
    }

    await prisma.host_mics.create({
      data: {
        mics_id: dbMic.id,
        host_id: hostId,
      },
    });
  }

  console.log(`Done! Created ${created} mics and ${hostsMap.size} unique hosts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
