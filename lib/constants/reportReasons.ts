/**
 * Report reasons offered on a mic card. The `value` is the stable slug stored
 * in mic_reports.reason; labels are shown via i18n (report.reasons.<value>).
 * Shared by the ReportButton UI and the /api/report-mic validator so the two
 * can never drift.
 */
export const REPORT_REASONS = [
  'incorrect_pricing',
  'no_longer_exists',
  'wrong_host',
  'something_else',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

/** The reason that requires a written-in explanation. */
export const REPORT_REASON_OTHER: ReportReason = 'something_else';

/** Max length of the free-text details field (matches the VarChar in schema). */
export const REPORT_DETAILS_MAX = 1000;
