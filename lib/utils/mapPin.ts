import { getBoroughHex } from './boroughColor';

/**
 * Borough-colored SVG map pin as a data URI. Markers render the SVG at its
 * intrinsic 30x40 size with the default bottom-center anchor — pin tip on the
 * coordinate — so no google.maps namespace objects are needed.
 */
export function boroughPinIcon(borough: string | null | undefined): { url: string } {
  const hex = getBoroughHex(borough || '');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">` +
    `<path d="M15 1C7.8 1 2 6.8 2 14c0 9.6 13 25 13 25s13-15.4 13-25C28 6.8 22.2 1 15 1z" ` +
    `fill="${hex}" stroke="white" stroke-width="2"/>` +
    `<circle cx="15" cy="14" r="5" fill="white"/></svg>`;
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` };
}
