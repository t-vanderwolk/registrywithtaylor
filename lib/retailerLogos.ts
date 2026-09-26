/**
 * Retailer name → logo asset. Product cards show the retailer's mark beside its
 * name; a retailer with no asset renders as its name alone, which is why every
 * lookup returns null rather than a placeholder.
 *
 * Keys are normalised the same way as the admin partner logos in
 * lib/checklist/getPartnerLogos.ts, so "Bloomingdale's" and "bloomingdales"
 * resolve to the same entry.
 */
import { BRAND_LOGOS } from '@/lib/catalog/brandLogos';

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * The brand marks, re-keyed the same way, so a brand-direct CTA resolves its
 * own logo. Built once at module load rather than per lookup.
 */
const BRAND_LOGOS_BY_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(BRAND_LOGOS).map(([brand, src]) => [normalize(brand), src]),
);

const RETAILER_LOGOS: Record<string, string> = {
  babylist: '/assets/logos/babylist2.png',
  amazon: '/assets/logos/amazon2.png',
  target: '/assets/logos/target2.png',
  bloomingdales: '/assets/logos/bloomingdales.png',
  nordstrom: '/assets/logos/nordstrom.png',
  // Both assets already shipped but were never mapped, so these two rendered as
  // bare text next to everyone else's mark.
  bombi: '/assets/logos/bombi.png',
  goodbuygear: '/assets/logos/goodbuygear2.png',
  macrobaby: '/assets/logos/macrobaby-logo.webp',
  strolleria: '/assets/logos/strolleria.png',
  myregistry: '/assets/logos/myregistry-logo.png',
  babyquip: '/assets/logos/babyquip.png',
};

/**
 * Resolve a retailer's logo. Static assets win over the admin-managed partner
 * logos so a house retailer can't be repointed by an unrelated partner record.
 */
export function retailerLogo(retailer: string, dynamic?: Record<string, string>): string | null {
  const key = normalize(retailer);
  if (!key) return null;
  // Retailers win over brands, so a name that is both (Bombi) resolves to its
  // retailer mark; the brand map is the last resort, which is what makes a
  // brand-direct CTA show the brand's own logo.
  return RETAILER_LOGOS[key] ?? dynamic?.[key] ?? BRAND_LOGOS_BY_KEY[key] ?? null;
}
