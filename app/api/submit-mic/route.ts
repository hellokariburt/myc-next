import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.website_url) {
      return NextResponse.json({ success: true });
    }

    const { name, borough, day, start_time, venue, street_address, cost } = body;
    if (!name || !borough || !day || !start_time || !venue || !street_address || !cost) {
      return NextResponse.json(
        { error: 'Missing required fields: name, borough, day, start_time, venue, street_address, cost' },
        { status: 400 }
      );
    }

    await prisma.mic_submissions.create({
      data: {
        name: body.name,
        borough: body.borough,
        day: body.day,
        start_time: body.start_time,
        end_time: body.end_time || null,
        venue: body.venue,
        street_address: body.street_address,
        neighborhood: body.neighborhood || null,
        cost: body.cost,
        venue_type: body.venue_type || null,
        stage_time: body.stage_time || null,
        signup_info: body.signup_info || null,
        host_name: body.host_name || null,
        host_instagram: body.host_instagram || null,
        instagram: body.instagram || null,
        website: body.website || null,
        notes: body.notes || null,
        schedule: body.schedule || null,
        submitter_email: body.submitter_email || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit mic:', error);
    return NextResponse.json({ error: 'Failed to submit mic' }, { status: 500 });
  }
}
