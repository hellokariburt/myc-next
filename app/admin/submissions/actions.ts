'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';
import { approveSubmission } from '@/lib/services/approveSubmission';

export async function approveSubmissionAction(formData: FormData) {
  if (!isAdmin()) return;
  const id = String(formData.get('id') || '');
  if (!id) return;
  await approveSubmission(BigInt(id));
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
