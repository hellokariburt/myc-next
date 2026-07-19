import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ALL_BOROUGHS, ALL_DAYS } from '@/lib/types/api';

/**
 * The only write endpoint in the app, open to anonymous users.
 *
 * NOTE: this validates shape and suppresses obvious duplicate floods, but it is
 * NOT a rate limiter — serverless instances don't share memory, so a per-process
 * counter would be trivially bypassed by concurrency. The real control is a
 * Vercel WAF rate-limit rule on this path, configured in the dashboard.
 */

// Matches the VarChar widths in prisma/schema.prisma. Over-long input used to
// reach Prisma and surface as a 500; it should be a 400 the client can act on.
const LIMITS: Record<string, number> = {
  name: 255,
  borough: 255,
  day: 255,
  start_time: 50,
  end_time: 50,
  venue: 255,
  street_address: 255,
  neighborhood: 255,
  cost: 255,
  venue_type: 255,
  stage_time: 255,
  signup_info: 500,
  host_name: 255,
  host_instagram: 255,
  instagram: 255,
  website: 255,
  notes: 500,
  schedule: 255,
  submitter_email: 255,
};

/** Returns a trimmed string, or null for absent/blank. Throws on wrong type or overlength. */
function field(body: Record<string, unknown>, key: string): string | null {
  const raw = body[key];
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw !== 'string') {
    throw new Error(`${key} must be a string`);
  }
  const value = raw.trim();
  if (!value) return null;
  if (value.length > LIMITS[key]) {
    throw new Error(`${key} must be ${LIMITS[key]} characters or fewer`);
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected a JSON object' }, { status: 400 });
    }

    // Honeypot. Kept, but it is a filter for naive bots, not a real control.
    if (body.website_url) {
      return NextResponse.json({ success: true });
    }

    const submissionType = body.submission_type === 'show' ? 'show' : 'mic';

    let values: Record<string, string | null>;
    try {
      values = Object.fromEntries(
        Object.keys(LIMITS).map((key) => [key, field(body as Record<string, unknown>, key)])
      );
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Invalid field' },
        { status: 400 }
      );
    }

    if (!values.name || !values.borough || !values.day || !values.start_time || !values.venue) {
      return NextResponse.json(
        { error: 'Missing required fields: name, borough, day, start_time, venue' },
        { status: 400 }
      );
    }
    // street address + cost required for mics; shows may be DM-for-location / ticketed
    if (submissionType === 'mic' && (!values.street_address || !values.cost)) {
      return NextResponse.json(
        { error: 'Missing required fields: street_address, cost' },
        { status: 400 }
      );
    }

    // The submit form sends these as slugs; anything else is a hand-rolled
    // request and would land in the moderation queue as unusable junk.
    if (!ALL_BOROUGHS.includes(values.borough as (typeof ALL_BOROUGHS)[number])) {
      return NextResponse.json({ error: 'Unrecognized borough' }, { status: 400 });
    }
    if (!ALL_DAYS.includes(values.day as (typeof ALL_DAYS)[number])) {
      return NextResponse.json({ error: 'Unrecognized day' }, { status: 400 });
    }

    // Cheap flood suppression: an identical listing submitted in the last day is
    // treated as already received. Reports success so a double-clicking human
    // sees no error, while a replay loop stops adding rows.
    const duplicate = await prisma.mic_submissions.findFirst({
      where: {
        name: values.name,
        venue: values.venue,
        day: values.day,
        created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    await prisma.mic_submissions.create({
      data: {
        submission_type: submissionType,
        name: values.name,
        borough: values.borough,
        day: values.day,
        start_time: values.start_time,
        end_time: values.end_time,
        venue: values.venue,
        street_address: values.street_address || '',
        neighborhood: values.neighborhood,
        cost: values.cost || '',
        venue_type: values.venue_type,
        stage_time: values.stage_time,
        signup_info: values.signup_info,
        host_name: values.host_name,
        host_instagram: values.host_instagram,
        instagram: values.instagram,
        website: values.website,
        notes: values.notes,
        schedule: values.schedule,
        submitter_email: values.submitter_email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit mic:', error);
    return NextResponse.json({ error: 'Failed to submit mic' }, { status: 500 });
  }
}
