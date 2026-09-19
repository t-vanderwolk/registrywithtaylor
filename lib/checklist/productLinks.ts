import { AFFILIATE_LINK_NEEDED, type ChecklistProduct } from './products';
import { isHttpUrl, parseRetailerLinks, retailerUrlKey, type RetailerLink } from '@/lib/retailerLinks';

export { parseRetailerLinks };

/** Hard ceiling on how many shop links a single product card renders. */
export const MAX_PRODUCT_LINKS = 5;

/** Number of links rendered as full-width buttons; the rest become chips. */
export const PRIMARY_LINK_COUNT = 2;

export type ResolvedProductLink = RetailerLink & {
  /** Drives the CTA styling variant. */
  kind: 'babylist' | 'amazon' | 'other';
};

/**
 * Build the ordered list of shop links for a card: Babylist first (when it has
 * a real link), then Amazon, then the legacy secondary retailer, then any extra
 * retailers. Duplicate destinations are dropped and the list is capped at
 * MAX_PRODUCT_LINKS so a card can never sprout an unbounded wall of buttons.
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
    candidates.push({ kind: 'other', retailer: link.retailer.trim() || 'Shop', url: link.url.trim() });
  }

  const seen = new Set<string>();
  const links: ResolvedProductLink[] = [];
  for (const link of candidates) {
    const key = retailerUrlKey(link.url);
    if (seen.has(key)) continue;
    seen.add(key);
    links.push(link);
    if (links.length >= MAX_PRODUCT_LINKS) break;
  }
  return links;
}
