import { AFFILIATE_LINK_NEEDED, type ChecklistProduct } from './products';
import { isHttpUrl, parseRetailerLinks, retailerUrlKey, type RetailerLink } from '@/lib/retailerLinks';
import { orderedProductRetailers } from '@/lib/productRetailers';

export { parseRetailerLinks };

/** Maximum unique shopping destinations accepted by the admin form. */
export const MAX_PRODUCT_LINKS = 5;

/** Number of links rendered as full-width buttons; the rest expand on request. */
export const PRIMARY_LINK_COUNT = 2;

export type ResolvedProductLink = RetailerLink & {
  /** Drives the CTA styling variant. */
  kind: 'babylist' | 'amazon' | 'other';
};

/**
 * Preserve legacy field order unless the product has explicit retailer preferences.
 * Duplicate destinations are dropped. Enforce limits when saving,
 * not here: existing stored affiliate links must never silently disappear.
 */
export function resolveProductLinks(rec: ChecklistProduct): ResolvedProductLink[] {
  const candidates: ResolvedProductLink[] = [];

  if (rec.affiliateUrl && rec.affiliateUrl !== AFFILIATE_LINK_NEEDED && isHttpUrl(rec.affiliateUrl)) {
    candidates.push({ kind: 'babylist', retailer: 'Babylist', url: rec.affiliateUrl.trim() });
  }
  if (isHttpUrl(rec.amazonUrl)) {
    candidates.push({ kind: 'amazon', retailer: 'Amazon', url: rec.amazonUrl.trim() });
  }
  if (isHttpUrl(rec.secondaryUrl)) {
    candidates.push({
      kind: 'other',
      retailer: rec.secondaryRetailer?.trim() || 'Shop',
      url: rec.secondaryUrl.trim(),
    });
  }
  for (const link of rec.retailerLinks ?? []) {
    if (!isHttpUrl(link.url)) continue;
    candidates.push({ ...link, kind: 'other', retailer: link.retailer.trim() || 'Shop', url: link.url.trim() });
  }

  const seen = new Set<string>();
  const links: ResolvedProductLink[] = [];
  for (const link of candidates) {
    const key = retailerUrlKey(link.url);
    if (seen.has(key)) {
      const existing = links.find((entry) => retailerUrlKey(entry.url) === key)!;
      Object.assign(existing, link, { kind: existing.kind });
      continue;
    }
    seen.add(key);
    links.push(link);
  }
  return orderedProductRetailers(links);
}
