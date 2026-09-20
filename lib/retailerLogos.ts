/**
 * Retailer name → logo asset. Product cards show the retailer's mark beside its
 * name; a retailer with no asset renders as its name alone, which is why every
 * lookup returns null rather than a placeholder.
 *
 * Keys are normalised the same way as the admin partner logos in
 * lib/checklist/getPartnerLogos.ts, so "Bloomingdale's" and "bloomingdales"
 * resolve to the same entry.
 */
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const RETAILER_LOGOS: Record<string, string> = {
  babylist: '/assets/logos/babylist.png',
  amazon: '/assets/logos/amazon.png',
  target: '/assets/logos/target.png',
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
  return RETAILER_LOGOS[key] ?? dynamic?.[key] ?? null;
}
