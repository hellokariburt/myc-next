'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';
import { REPORT_STATUSES, type ReportStatus } from '@/lib/constants/reportStatus';

export async function updateReportStatus(formData: FormData) {
  if (!isAdmin()) return;
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!id || !REPORT_STATUSES.includes(status as ReportStatus)) return;

  await prisma.mic_reports.update({
    where: { id: BigInt(id) },
    data: { status },
  });
  revalidatePath('/admin/reports');
}
