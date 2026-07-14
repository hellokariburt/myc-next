import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SeedShow {
  name: string;
  venue: string | null;
  borough: string | null;
  neighborhood: string | null;
  day: string | null;
  time_text: string | null;
  instagram: string | null;
  schedule: string | null;
  location_note: string | null;
  confirmed: string | null;
}

async function main() {
  const raw = readFileSync(join(__dirname, 'shows-seed-data.json'), 'utf-8');
  const shows: SeedShow[] = JSON.parse(raw);

  console.log(`Seeding ${shows.length} shows...`);

  // Only ever touches the shows table — never mic data
  await prisma.shows.deleteMany();
  const result = await prisma.shows.createMany({ data: shows });

  console.log(`Created ${result.count} shows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
