import { NextRequest, NextResponse } from 'next/server';
import { getMicsResponseCached } from '@/lib/services/mics.service';
import { parseParams } from '@/lib/api/parseParams';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const params = parseParams(request.nextUrl.searchParams);
    if (typeof params === 'string') {
      return NextResponse.json({ error: params }, { status: 400 });
    }
    // Reads through the mic data cache (see getMicsResponseCached): a given
    // filter combo hits Neon at most once per revalidate window, on top of the
    // CDN header below. Payload is already serialized (BigInt ids -> numbers).
    const payload = await getMicsResponseCached(params);
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
