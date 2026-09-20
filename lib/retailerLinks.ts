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
  displayOrder?: number;
  preferred?: boolean;
  price?: number;
  salePrice?: number;
  priceCheckedAt?: string;
  priceVerified?: boolean;
};

export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

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
    const record = entry as Record<string, unknown>;
    const link: RetailerLink = { retailer: label || 'Shop', url: url.trim() };
    for (const key of ['displayOrder', 'price', 'salePrice'] as const) {
      const number = record[key];
      if (typeof number === 'number' && Number.isFinite(number) && number >= 0) link[key] = number;
    }
    if (typeof record.preferred === 'boolean') link.preferred = record.preferred;
    if (typeof record.priceVerified === 'boolean') link.priceVerified = record.priceVerified;
    if (typeof record.priceCheckedAt === 'string' && Number.isFinite(Date.parse(record.priceCheckedAt))) link.priceCheckedAt = record.priceCheckedAt;
    links.push(link);
  }
  return links.length ? links : undefined;
}

/** Hosts are case-insensitive, but product paths and affiliate tokens are not. */
export const retailerUrlKey = (value: string) => {
  const url = new URL(value.trim());
  return `${url.hostname.toLowerCase().replace(/^www\./, '')}${url.port ? `:${url.port}` : ''}${url.pathname.replace(/\/+$/, '')}${url.search}${url.hash}`;
};
