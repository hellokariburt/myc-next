import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const raw = readFileSync(join(__dirname, 'clubs-seed-data.json'), 'utf-8');
  const clubs = JSON.parse(raw);

  console.log(`Seeding ${clubs.length} clubs...`);

  // Only ever touches the clubs table
  await prisma.clubs.deleteMany();
  const result = await prisma.clubs.createMany({ data: clubs });

  console.log(`Created ${result.count} clubs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
