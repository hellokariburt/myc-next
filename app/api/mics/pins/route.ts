import { NextRequest, NextResponse } from 'next/server';
import { getMicPinsCached } from '@/lib/services/mics.service';
import { parseParams } from '@/lib/api/parseParams';

export const dynamic = 'force-dynamic';

/**
 * Map pins for the `/mics` finder: the full *filtered* result set (capped at
 * MAP_PIN_CAP), independent of the list's pagination so the map plots every
 * matching mic, not just the current page. Any offset/limit in the query is
 * ignored — getMicPinsCached normalizes them — so all pages of a filter combo
 * share one cached pins payload.
 */
export async function GET(request: NextRequest) {
  try {
    const params = parseParams(request.nextUrl.searchParams);
    if (typeof params === 'string') {
      return NextResponse.json({ error: params }, { status: 400 });
    }
    const payload = await getMicPinsCached(params);
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
