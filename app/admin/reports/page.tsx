import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { t } from '@/lib/i18n';
import { isAdmin, adminTokenHash } from '@/lib/auth/admin';
import { REPORT_REASONS } from '@/lib/constants/reportReasons';
import { REPORT_STATUSES } from '@/lib/constants/reportStatus';
import AdminShell from '@/components/admin/AdminShell';
import AdminLogin, { AdminNotConfigured } from '@/components/admin/AdminLogin';
import { updateReportStatus } from './actions';

// Admin tooling — never render on the CDN and never index it.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

const isKnownReason = (r: string): r is (typeof REPORT_REASONS)[number] =>
  (REPORT_REASONS as readonly string[]).includes(r);

const statusBadge: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-200',
  reviewed: 'bg-amber-50 text-amber-700 ring-amber-200',
  resolved: 'bg-green-50 text-green-700 ring-green-200',
  dismissed: 'bg-slate-100 text-slate-500 ring-slate-200',
};

export default async function AdminReportsPage() {
  if (!adminTokenHash()) return <AdminNotConfigured />;
  if (!isAdmin()) return <AdminLogin next="/admin/reports" />;

  const reports = await prisma.mic_reports.findMany({
    orderBy: [{ status: 'asc' }, { created_at: 'desc' }],
    take: 500,
  });

  const openCount = reports.filter((r) => r.status === 'new').length;

  return (
    <AdminShell active="reports">
      <p className="text-sm text-slate-500 mb-4">
        {reports.length} report{reports.length === 1 ? '' : 's'} · {openCount} new
      </p>

      {reports.length === 0 ? (
        <p className="text-slate-500">No reports yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4 font-semibold">When</th>
                <th className="py-2 pr-4 font-semibold">Mic</th>
                <th className="py-2 pr-4 font-semibold">Reason</th>
                <th className="py-2 pr-4 font-semibold">Details</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const id = r.id.toString();
                const reasonLabel = isKnownReason(r.reason)
                  ? t(`report.reasons.${r.reason}`)
                  : r.reason;
                return (
                  <tr key={id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-500">
                      {r.created_at.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 pr-4 min-w-[10rem]">
                      {r.mic_id ? (
                        <Link
                          href={`/mics/${r.mic_id.toString()}`}
                          className="text-blue-700 hover:underline"
                        >
                          {r.mic_name || `Mic #${r.mic_id.toString()}`}
                        </Link>
                      ) : (
                        <span className="text-slate-700">{r.mic_name || '—'}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-700">{reasonLabel}</td>
                    <td className="py-3 pr-4 text-slate-600 max-w-sm">
                      {r.details ? (
                        <span className="whitespace-pre-wrap break-words">{r.details}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${
                          statusBadge[r.status] || statusBadge.new
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {REPORT_STATUSES.filter((s) => s !== r.status).map((s) => (
                          <form key={s} action={updateReportStatus}>
                            <input type="hidden" name="id" value={id} />
                            <input type="hidden" name="status" value={s} />
                            <button
                              type="submit"
                              className="text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
                            >
                              {s}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
