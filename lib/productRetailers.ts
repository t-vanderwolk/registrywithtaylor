import { isHttpUrl, retailerUrlKey, type RetailerLink } from '@/lib/retailerLinks';

export const MAX_CARD_RETAILERS = 5;

/** Explicit product preferences lead; otherwise preserve the supplied editorial order. */
export function orderedProductRetailers<T extends RetailerLink>(links: T[]): T[] {
  const unique = new Map<string, T>();
  for (const link of links) {
    if (!isHttpUrl(link.url)) continue;
    const key = retailerUrlKey(link.url);
    unique.set(key, { ...unique.get(key), ...link });
  }
  const ordered = [...unique.values()].sort((a, b) =>
    Number(Boolean(b.preferred)) - Number(Boolean(a.preferred)) ||
    (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER),
  );
  const retailers = new Set<string>();
  return ordered.filter((link) => {
    const retailer = link.retailer.trim().toLowerCase();
    const key = retailer && retailer !== 'shop' ? retailer : new URL(link.url).hostname;
    if (retailers.has(key)) return false;
    retailers.add(key);
    return true;
  });
}

/** Only verified observations from the last 24 hours qualify as current prices. */
export function currentRetailerPrice(link: RetailerLink, now = Date.now()) {
  const checked = Date.parse(link.priceCheckedAt ?? '');
  const age = now - checked;
  if (!link.priceVerified || !Number.isFinite(checked) || age < 0 || age > 86_400_000) return null;
  if (typeof link.price !== 'number' || !Number.isFinite(link.price) || link.price < 0) return null;
  const sale = typeof link.salePrice === 'number' && Number.isFinite(link.salePrice) && link.salePrice >= 0 && link.salePrice < link.price;
  return { value: sale ? link.salePrice! : link.price, sale, checked };
}

export const formatRetailerPrice = (price: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
}).format(price);

/**
 * Cards show a single price — the editorial reference price — never a
 * per-retailer comparison. Retailer rows carry a name and logo only, so the
 * card never implies a live price it hasn't verified.
 */
export function productPricePresentation(reference: number | null | undefined) {
  return typeof reference === 'number' && Number.isFinite(reference) && reference >= 0
    ? { label: formatRetailerPrice(reference), reference: true }
    : null;
}
