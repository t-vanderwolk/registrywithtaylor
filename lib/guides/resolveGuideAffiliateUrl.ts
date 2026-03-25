import { STROLLER_AFFILIATE_LINKS } from '@/lib/data/products/strollerAffiliateLinks';
import { STROLLER_PRODUCT_GROUPS } from '@/lib/data/products/strollers';

const PLACEHOLDER_AFFILIATE_URL_PATTERN = /^https?:\/\/example\.com\b/i;

function normalizeText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function normalizeKey(brand: string | null | undefined, productName: string | null | undefined) {
  return `${normalizeText(brand).toLowerCase()}::${normalizeText(productName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()}`;
}

function buildGuideAffiliateLookup() {
  const lookup = new Map<string, string>();

  Object.values(STROLLER_PRODUCT_GROUPS)
    .flat()
    .forEach((product) => {
      const affiliateUrl = normalizeText(product.affiliateUrl);
      if (!affiliateUrl || PLACEHOLDER_AFFILIATE_URL_PATTERN.test(affiliateUrl)) {
        return;
      }

      const keys = [
        normalizeKey(product.brand, product.productName ?? product.name),
        normalizeKey(product.brand, product.name),
        normalizeKey('', product.productName ?? product.name),
        normalizeKey('', product.name),
      ];

      keys.forEach((key) => {
        if (key !== '::') {
          lookup.set(key, affiliateUrl);
        }
      });
    });

  lookup.set(normalizeKey('Bugaboo', 'Donkey 6'), STROLLER_AFFILIATE_LINKS['bugaboo-donkey']);

  return lookup;
}

const GUIDE_AFFILIATE_LOOKUP = buildGuideAffiliateLookup();

export function resolveGuideAffiliateUrl({
  affiliateUrl,
  brand,
  productName,
  name,
}: {
  affiliateUrl?: string | null;
  brand?: string | null;
  productName?: string | null;
  name?: string | null;
}) {
  const directUrl = normalizeText(affiliateUrl);
  if (directUrl && !PLACEHOLDER_AFFILIATE_URL_PATTERN.test(directUrl)) {
    return directUrl;
  }

  const candidateKeys = [
    normalizeKey(brand, productName ?? name),
    normalizeKey(brand, name),
    normalizeKey('', productName ?? name),
    normalizeKey('', name),
  ];

  for (const key of candidateKeys) {
    const resolved = GUIDE_AFFILIATE_LOOKUP.get(key);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}
