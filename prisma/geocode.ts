import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

async function geocodeAddress(address: string): Promise<{ lat: string; lng: string } | null> {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'OpenMYC-Geocoder/1.0' },
  });
  const data = await res.json();

  if (data.length > 0) {
    return { lat: data[0].lat, lng: data[0].lon };
  }

  console.warn(`  No result for: ${address}`);
  return null;
}

async function main() {
  const addresses = await prisma.mic_address.findMany({
    where: {
      OR: [{ latitude: null }, { longitude: null }, { latitude: '' }, { longitude: '' }],
    },
  });

  console.log(`Found ${addresses.length} addresses to geocode\n`);

  let updated = 0;
  let failed = 0;

  for (const addr of addresses) {
    const parts = [addr.street_name, addr.city || 'New York', addr.state || 'NY'].filter(Boolean);
    const fullAddress = parts.join(', ');

    console.log(`[${updated + failed + 1}/${addresses.length}] ${addr.venue} — ${fullAddress}`);

    const result = await geocodeAddress(fullAddress);

    if (result) {
      await prisma.mic_address.update({
        where: { address_id: addr.address_id },
        data: { latitude: result.lat, longitude: result.lng },
      });
      updated++;
    } else {
      failed++;
    }

    // Nominatim rate limit: 1 request per second
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nDone. Updated: ${updated}, Failed: ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
