/**
 * Affiliate-attributed fallback shop links so every product card can guarantee a
 * primary (Babylist) button AND an Amazon button, even when the product has no
 * exact retailer URL. These are last-resort links: they scope to the product's
 * brand/category, carry our affiliate tracking, and always resolve to a real page.
 *
 *  - Babylist: the pxf.io tracker wrapping a real Babylist store URL filtered to
 *    the brand + category (e.g. /store/strollers?brand=bumbleride).
 *  - Amazon: a keyword search for the exact "brand model", with the affiliate tag.
 *
 * Prefer an EXACT product link whenever one exists; only fall back to these.
 */

const AMAZON_TAG = 'taylormadebab-20';
const BABYLIST_TRACKER_BASE = 'https://babylist.pxf.io/c/6560395/1056628/13580';
const BABYLIST_PARTNER_ID = '7490466';

export type ShopFallbackKind = 'stroller' | 'carseat';

function babylistAffiliate(destUrl: string) {
  return `${BABYLIST_TRACKER_BASE}?u=${encodeURIComponent(destUrl)}&partnerpropertyid=${BABYLIST_PARTNER_ID}`;
}

/** brand → Babylist store brand-filter slug ("Baby Jogger" → "baby-jogger"). */
export function babylistBrandSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * A Babylist store page filtered to this brand + category, wrapped in our
 * affiliate tracker. Valid, tracked, and relevant even without an exact product
 * URL. Defaults to the strollers category.
 */
export function babylistBrandShopUrl(brand: string, kind: ShopFallbackKind = 'stroller'): string {
  const category = kind === 'carseat' ? 'car-seats' : 'strollers';
  const slug = babylistBrandSlug(brand);
  const dest = slug
    ? `https://www.babylist.com/store/${category}?brand=${slug}`
    : `https://www.babylist.com/store/${category}`;
  return babylistAffiliate(dest);
}

/** An Amazon keyword search for the exact product, with the affiliate tag. */
export function amazonSearchShopUrl(query: string): string {
  const q = query.replace(/\s+/g, ' ').trim();
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`;
}

/**
 * Brands that don't authorize third-party Amazon sales, so we never show an
 * Amazon CTA for them (real link or tagged search). Nuna enforces this.
 */
const AMAZON_SUPPRESSED_BRANDS = new Set(['nuna']);

/** True when an Amazon CTA is allowed for this brand. */
export function isAmazonAllowedForBrand(brand: string | null | undefined): boolean {
  return !AMAZON_SUPPRESSED_BRANDS.has((brand ?? '').trim().toLowerCase());
}

/**
 * Brands we don't surface a MacroBaby CTA for, so their product cards never link
 * to MacroBaby (Silver Cross is sold via its own direct/Babylist links instead).
 */
const MACROBABY_SUPPRESSED_BRANDS = new Set(['silver cross']);

/** True when a MacroBaby CTA is allowed for this brand. */
export function isMacroBabyAllowedForBrand(brand: string | null | undefined): boolean {
  return !MACROBABY_SUPPRESSED_BRANDS.has((brand ?? '').trim().toLowerCase());
}
