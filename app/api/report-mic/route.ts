import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  REPORT_REASONS,
  REPORT_REASON_OTHER,
  REPORT_DETAILS_MAX,
  type ReportReason,
} from '@/lib/constants/reportReasons';

/**
 * Anonymous write endpoint for card reports ("incorrect pricing", "no longer
 * exists", "wrong host", "something else"). Mirrors /api/submit-mic: it
 * validates shape and suppresses obvious duplicate floods, but is NOT a rate
 * limiter — the real control is a Vercel WAF rate-limit rule on this path.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected a JSON object' }, { status: 400 });
    }

    const reason = body.reason;
    if (!REPORT_REASONS.includes(reason as ReportReason)) {
      return NextResponse.json({ error: 'Unrecognized reason' }, { status: 400 });
    }

    let details: string | null = null;
    if (body.details !== undefined && body.details !== null && body.details !== '') {
      if (typeof body.details !== 'string') {
        return NextResponse.json({ error: 'details must be a string' }, { status: 400 });
      }
      details = body.details.trim() || null;
      if (details && details.length > REPORT_DETAILS_MAX) {
        return NextResponse.json(
          { error: `details must be ${REPORT_DETAILS_MAX} characters or fewer` },
          { status: 400 }
        );
      }
    }

    // "Something else" is only actionable with a written-in explanation.
    if (reason === REPORT_REASON_OTHER && !details) {
      return NextResponse.json(
        { error: 'Please describe what is wrong' },
        { status: 400 }
      );
    }

    // mic_id is optional — a handful of snapshot cards have no detail id (0).
    let micId: bigint | null = null;
    if (body.mic_id !== undefined && body.mic_id !== null && body.mic_id !== '' && body.mic_id !== 0) {
      const n = Number(body.mic_id);
      if (!Number.isInteger(n) || n < 0) {
        return NextResponse.json({ error: 'mic_id must be a positive integer' }, { status: 400 });
      }
      micId = BigInt(n);
    }

    let micName: string | null = null;
    if (typeof body.mic_name === 'string' && body.mic_name.trim()) {
      micName = body.mic_name.trim().slice(0, 255);
    }

    // Cheap flood suppression: the same reason for the same mic within the last
    // hour is treated as already received, so a replay loop stops adding rows
    // while a double-clicking human sees no error.
    const duplicate = await prisma.mic_reports.findFirst({
      where: {
        mic_id: micId,
        reason,
        created_at: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    await prisma.mic_reports.create({
      data: { mic_id: micId, mic_name: micName, reason, details },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
