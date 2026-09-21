'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/i18n';
import {
  REPORT_REASONS,
  REPORT_REASON_OTHER,
  REPORT_DETAILS_MAX,
  type ReportReason,
} from '@/lib/constants/reportReasons';

interface Props {
  micId: number;
  micName: string | null;
  /** Extra classes for the trigger (used to place it on the card). */
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ReportButton({ micId, micName, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const rootRef = useRef<HTMLDivElement>(null);

  const needsDetails = reason === REPORT_REASON_OTHER;
  const canSubmit =
    reason !== '' && (!needsDetails || details.trim().length > 0) && status !== 'submitting';

  // Reset the form each time the popover is dismissed so a reopened card starts clean.
  const close = () => {
    setOpen(false);
    setReason('');
    setDetails('');
    setStatus('idle');
  };

  // Close on outside click / Escape while the popover is open.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const submit = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/report-mic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mic_id: micId,
          mic_name: micName,
          reason,
          details: details.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Report failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={t('report.trigger')}
        title={t('report.trigger')}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {/* flag icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('report.title')}
          className="absolute right-0 top-9 z-30 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg text-left"
        >
          {status === 'success' ? (
            <p className="text-sm text-slate-700 py-2">{t('report.success')}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900">{t('report.title')}</p>
              <p className="text-xs text-slate-500 pt-0.5">{t('report.subtitle')}</p>

              <fieldset className="mt-3 flex flex-col gap-1.5">
                {REPORT_REASONS.map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={value}
                      checked={reason === value}
                      onChange={() => setReason(value)}
                      className="accent-blue-600"
                    />
                    {t(`report.reasons.${value}`)}
                  </label>
                ))}
              </fieldset>

              <div className="mt-3">
                <label htmlFor="report-details" className="sr-only">
                  {t('report.detailsLabel')}
                </label>
                <textarea
                  id="report-details"
                  value={details}
                  maxLength={REPORT_DETAILS_MAX}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={needsDetails ? 3 : 2}
                  placeholder={
                    needsDetails
                      ? t('report.detailsPlaceholderRequired')
                      : t('report.detailsPlaceholder')
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-xs mt-2">{t('report.error')}</p>
              )}

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={close}
                  className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg transition-colors"
                >
                  {t('report.cancel')}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  {status === 'submitting' ? t('report.submitting') : t('report.submit')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
