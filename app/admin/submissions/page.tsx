import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { isAdmin, adminTokenHash } from '@/lib/auth/admin';
import AdminShell from '@/components/admin/AdminShell';
import AdminLogin, { AdminNotConfigured } from '@/components/admin/AdminLogin';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { getBoroughDisplayShort } from '@/lib/utils/boroughColor';
import { approveSubmissionAction, rejectSubmissionAction } from './actions';

// Admin tooling — never render on the CDN, never index.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

const statusBadge: Record<string, string> = {
  pending: 'bg-blue-50 text-blue-700 ring-blue-200',
  approved: 'bg-green-50 text-green-700 ring-green-200',
  rejected: 'bg-slate-100 text-slate-500 ring-slate-200',
};

export default async function AdminSubmissionsPage() {
  if (!adminTokenHash()) return <AdminNotConfigured />;
  if (!isAdmin()) return <AdminLogin next="/admin/submissions" />;

  const submissions = await prisma.mic_submissions.findMany({
    // Pending float to the top (asc: approved < pending < rejected is not
    // alphabetical, so sort in JS below); primary DB sort is newest-first.
    orderBy: { created_at: 'desc' },
    take: 500,
  });

  const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };
  submissions.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <AdminShell active="submissions">
      <p className="text-sm text-slate-500 mb-4">
        {submissions.length} submission{submissions.length === 1 ? '' : 's'} · {pendingCount}{' '}
        pending
      </p>

      {submissions.length === 0 ? (
        <p className="text-slate-500">No submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => {
            const id = s.id.toString();
            const isPending = s.status === 'pending';
            return (
              <div key={id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{s.name}</p>
                      {s.submission_type === 'show' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-200">
                          show
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ring-1 ${
                          statusBadge[s.status] || statusBadge.pending
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {s.venue}
                      {s.neighborhood ? ` · ${s.neighborhood}` : ''} ·{' '}
                      {getBoroughDisplayShort(s.borough)}
                    </p>
                    <p className="text-sm text-slate-500">{s.street_address}</p>
                  </div>
                  <p className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                    {s.created_at.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-3 text-sm">
                  <Field label="When">
                    {capitalizeDay(s.day)} {s.start_time}
                    {s.end_time ? `–${s.end_time}` : ''}
                  </Field>
                  <Field label="Schedule">{s.schedule || '—'}</Field>
                  <Field label="Cost">{s.cost || '—'}</Field>
                  <Field label="Stage time">{s.stage_time || '—'}</Field>
                  <Field label="Host">
                    {s.host_name || '—'}
                    {s.host_instagram ? ` (${s.host_instagram})` : ''}
                  </Field>
                  <Field label="Instagram">{s.instagram || '—'}</Field>
                  <Field label="Signup">{s.signup_info || '—'}</Field>
                  <Field label="Submitter">{s.submitter_email || '—'}</Field>
                </dl>

                {s.notes && <p className="text-sm text-slate-500 mt-2 italic">“{s.notes}”</p>}

                {isPending && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                    <form action={approveSubmissionAction}>
                      <input type="hidden" name="id" value={id} />
                      <button
                        type="submit"
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        Approve &amp; publish
                      </button>
                    </form>
                    <form action={rejectSubmissionAction}>
                      <input type="hidden" name="id" value={id} />
                      <button
                        type="submit"
                        className="text-sm border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 px-4 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-slate-700 break-words">{children}</dd>
    </div>
  );
}
