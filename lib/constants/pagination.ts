/**
 * Listing page size for the interactive `/mics` finder. Chosen over the old 10
 * so the common unfiltered view is a handful of pages, not ~47, and so the map
 * (which plots the filtered set, capped at MAP_PIN_CAP) isn't starved. Baymard's
 * tested range for search-result listings is ~25–75 on desktop; 24 keeps the
 * grid tidy while cutting page count. The faceted SEO pages use their own
 * LISTING_LIMIT (100) and are unaffected.
 */
export const DEFAULT_PAGE_SIZE = 24;

/**
 * Upper bound on pins the map plots for a given filter combo. The map is fed the
 * full *filtered* result set (not the current page slice) so a geographic finder
 * actually shows where mics are; this cap keeps a worst-case unfiltered load
 * (~463 active mics) bounded. The pins service applies this cap itself (offset 0,
 * no paging), so it is independent of the per-request `limit` the API validates.
 */
export const MAP_PIN_CAP = 200;
