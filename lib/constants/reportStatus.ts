/** Lifecycle an admin can move a mic report through. `new` is the DB default. */
export const REPORT_STATUSES = ['new', 'reviewed', 'resolved', 'dismissed'] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];
