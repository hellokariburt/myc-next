import { NextRequest, NextResponse } from 'next/server';
import { getMics } from '@/lib/services/mics.service';
import { parseParams } from '@/lib/api/parseParams';
import { serialize } from '@/lib/utils/serialize';

export async function GET(request: NextRequest) {
  try {
    const params = parseParams(request.nextUrl.searchParams);
    if (typeof params === 'string') {
      return NextResponse.json({ error: params }, { status: 400 });
    }
    const { mics, count } = await getMics(params);
    return NextResponse.json(
      serialize({
        totalMics: count,
        offset: params.offset,
        limit: params.limit,
        mics,
      })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
