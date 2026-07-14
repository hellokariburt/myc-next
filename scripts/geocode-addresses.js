/* Backfill mic_address.latitude/longitude via US Census geocoder (Nominatim fallback).
 * Run after any mic import: node scripts/geocode-addresses.js
 * Only touches rows where latitude is NULL/empty; logs misses for manual review. */
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function censusGeocode(oneLine) {
  const url =
    'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address=' +
    encodeURIComponent(oneLine);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const m = data?.result?.addressMatches?.[0];
  if (!m) return null;
  return { lat: m.coordinates.y, lng: m.coordinates.x, source: 'census' };
}

async function nominatimGeocode(oneLine) {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
    encodeURIComponent(oneLine);
  const res = await fetch(url, { headers: { 'User-Agent': 'OpenMYC-geocode-backfill/1.0 (kandreahburt@gmail.com)' } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), source: 'nominatim' };
}

// NYC bounding box sanity check
const inNYC = ({ lat, lng }) => lat > 40.4 && lat < 41.0 && lng > -74.3 && lng < -73.6;

(async () => {
  const addrs = await p.$queryRawUnsafe(`
    SELECT DISTINCT street_name, city, state, zipcode
    FROM mic_address
    WHERE latitude IS NULL OR latitude = ''
  `);
  console.log(`Geocoding ${addrs.length} distinct addresses...`);

  const failed = [];
  let updatedRows = 0;

  for (const a of addrs) {
    // strip unit-ish suffixes that confuse geocoders (e.g. "167 Bleecker St REAR")
    const cleanStreet = a.street_name.replace(/\s+(REAR|BASEMENT|BSMT|FL\s*\d+|#.*|UNIT.*|STE.*|SUITE.*)$/i, '');
    const oneLine = `${cleanStreet}, ${a.city}, ${a.state} ${a.zipcode}`;

    let hit = null;
    try { hit = await censusGeocode(oneLine); } catch {}
    if (!hit || !inNYC(hit)) {
      await sleep(1100); // nominatim rate limit
      try { hit = await nominatimGeocode(oneLine); } catch {}
    }

    if (!hit || !inNYC(hit)) {
      failed.push(oneLine);
      console.log(`  MISS  ${oneLine}`);
      continue;
    }

    const n = await p.$executeRawUnsafe(
      `UPDATE mic_address SET latitude = $1, longitude = $2
       WHERE street_name = $3 AND zipcode = $4 AND (latitude IS NULL OR latitude = '')`,
      String(hit.lat.toFixed(7)),
      String(hit.lng.toFixed(7)),
      a.street_name,
      a.zipcode
    );
    updatedRows += n;
    console.log(`  OK(${hit.source})  ${oneLine} -> ${hit.lat.toFixed(5)},${hit.lng.toFixed(5)}  (${n} rows)`);
    await sleep(150);
  }

  const remaining = await p.$queryRawUnsafe(
    `SELECT count(*)::int AS n FROM mic_address WHERE latitude IS NULL OR latitude = ''`
  );
  console.log(`\nDone. Rows updated: ${updatedRows}. Rows still missing coords: ${remaining[0].n}`);
  if (failed.length) console.log('Failed addresses:\n' + failed.map((f) => '  - ' + f).join('\n'));
  await p.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
