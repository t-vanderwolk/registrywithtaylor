/**
 * Shared shape for "extra retailer" links stored as JSON on product rows
 * (ChecklistProduct, Stroller, CarSeat). Kept dependency-free so both the
 * checklist and the catalogue can use it without pulling each other's data in.
 */
export type RetailerLink = {
  /** Button label, e.g. "Target", "Nordstrom", "Bloomingdale's". */
  retailer: string;
  /** Plain retailer product URL — ShopMy's auto-linker wraps it at runtime. */
  url: string;
};

export const isHttpUrl = (value: unknown): value is string =>
  typeof value === 'string' && /^https?:\/\//i.test(value.trim());

/**
 * Normalise a `retailerLinks` JSON column into a typed array. The column is
 * free-form JSON, so anything malformed is dropped rather than thrown — a bad
 * row should cost one button, never the page.
 */
export function parseRetailerLinks(value: unknown): RetailerLink[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const links: RetailerLink[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const { retailer, url } = entry as Record<string, unknown>;
    if (!isHttpUrl(url)) continue;
    const label = typeof retailer === 'string' ? retailer.trim() : '';
    links.push({ retailer: label || 'Shop', url: url.trim() });
  }
  return links.length ? links : undefined;
}

/** Compare URLs ignoring case, trailing slash and the leading www. */
export const retailerUrlKey = (url: string) =>
  url.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
