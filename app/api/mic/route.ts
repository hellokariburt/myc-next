import { NextRequest, NextResponse } from 'next/server';
import { getMic } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';

export async function GET(request: NextRequest) {
  try {
    const rawId = request.nextUrl.searchParams.get('id');
    if (!rawId) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }
    let id: bigint;
    try {
      id = BigInt(rawId);
    } catch {
      return NextResponse.json({ error: 'id must be a valid integer' }, { status: 400 });
    }
    if (id <= BigInt(0)) {
      return NextResponse.json({ error: 'id must be a positive integer' }, { status: 400 });
    }
    const mic = await getMic(id);
    return NextResponse.json(serialize({ mic }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
