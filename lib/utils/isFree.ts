export function isFreeCost(cost?: string | null): boolean {
  const value = (cost ?? '').trim().toLowerCase();
  return !value || value.startsWith('free');
}
