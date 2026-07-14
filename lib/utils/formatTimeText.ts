/**
 * Normalizes messy multi-showtime strings from imported data for display:
 *   "5:30,8, 10pm"        -> "5:30, 8:00 & 10:00 PM"
 *   "8 and 10pm"          -> "8:00 & 10:00 PM"
 *   "7, 830, and 10:30pm" -> "7:00, 8:30 & 10:30 PM"
 * Already-clean strings ("8:00 PM") pass through untouched.
 */
export function formatTimeText(raw: string | null): string {
  if (!raw) return '';
  const text = raw.trim();
  // fast path: single clean time
  if (/^\d{1,2}(:\d{2})?\s*(AM|PM)$/i.test(text)) return text.toUpperCase().replace(/\s+/, ' ');

  const suffixMatch = text.match(/(am|pm)\b\s*$/i);
  if (!suffixMatch) return text; // not time-shaped — leave alone

  const suffix = suffixMatch[1].toUpperCase();
  const parts = text
    .replace(/(am|pm)\b/gi, '')
    .split(/\s*(?:,|and|&|\+)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return text;

  const times = parts.map((p) => {
    const m = p.match(/^(\d{1,2})(?::?(\d{2}))?$/);
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const min = m[2] ?? '00';
    if (h < 1 || h > 12 || parseInt(min, 10) > 59) return null;
    return `${h}:${min}`;
  });
  if (times.some((t) => t === null)) return text; // couldn't parse safely — leave alone

  if (times.length === 1) return `${times[0]} ${suffix}`;
  const last = times[times.length - 1];
  return `${times.slice(0, -1).join(', ')} & ${last} ${suffix}`;
}
