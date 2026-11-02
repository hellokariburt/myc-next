'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';
import { approveSubmission } from '@/lib/services/approveSubmission';
import { MICS_CACHE_TAG } from '@/lib/services/mics.service';

export async function approveSubmissionAction(formData: FormData) {
  if (!isAdmin()) return;
  const id = String(formData.get('id') || '');
  if (!id) return;
  await approveSubmission(BigInt(id));
  // The approved mic is now live; drop the cached /mics + /api/mics data-cache
  // payloads so it shows up without waiting out the TTL. Note the /api/mics HTTP
  // response can still be served from the CDN for its s-maxage window (~5m).
  revalidateTag(MICS_CACHE_TAG);
  revalidatePath('/admin/submissions');
}

export async function rejectSubmissionAction(formData: FormData) {
  if (!isAdmin()) return;
  const id = String(formData.get('id') || '');
  if (!id) return;
  await prisma.mic_submissions.update({
    where: { id: BigInt(id) },
    data: { status: 'rejected' },
  });
  revalidatePath('/admin/submissions');
}
