/**
 * SVG map pin as a data URI. Markers render the SVG at its intrinsic 30x40
 * size with the default bottom-center anchor — pin tip on the coordinate —
 * so no google.maps namespace objects are needed.
 *
 * Pin color carries information the map can't already show (position encodes
 * borough on its own): mics use free/paid, shows and clubs use the brand pin.
 */
export const PIN_BRAND = '#2563eb'; // blue-600
export const PIN_FREE = '#16a34a'; // green-600, matches the free cost pill
export const PIN_PAID = '#d97706'; // amber-600, matches the paid cost pill

export function pinIcon(hex: string): { url: string } {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">` +
    `<path d="M15 1C7.8 1 2 6.8 2 14c0 9.6 13 25 13 25s13-15.4 13-25C28 6.8 22.2 1 15 1z" ` +
    `fill="${hex}" stroke="white" stroke-width="2"/>` +
    `<circle cx="15" cy="14" r="5" fill="white"/></svg>`;
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` };
}
