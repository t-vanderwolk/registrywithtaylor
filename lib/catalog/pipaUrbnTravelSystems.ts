/**
 * The Nuna PIPA urbn is sold only as a travel system bundled with a Nuna
 * stroller. These are the Babylist "<stroller> + PIPA urbn" bundle listings, so
 * when the urbn shows up under one of these Nuna strollers in the checker we can
 * link straight to the matching travel system instead of a (nonexistent)
 * standalone seat listing.
 *
 * Keyed by a lowercased token that appears in the Nuna stroller's model name.
 * Client-safe (no server imports).
 */
const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

// Order matters: more specific tokens first (e.g. "trvl lx" before any "trvl").
const PIPA_URBN_BUNDLES: Array<{ token: string; url: string }> = [
  { token: 'mixx next', url: 'https://www.babylist.com/gp/nuna-mixx-next-pipa-urbn/36335/1925316' },
  { token: 'trvl lx', url: 'https://www.babylist.com/gp/nuna-trvl-lx-pipa-urbn/46285/1871702' },
  { token: 'triv next', url: 'https://www.babylist.com/gp/nuna-triv-next-pipa-urbn/36336/2902985' },
  { token: 'swiv', url: 'https://www.babylist.com/gp/nuna-swiv-pipa-urbn-travel-system/83844/3316520' },
];

/**
 * The affiliate-wrapped Babylist link to the "<stroller> + PIPA urbn" travel
 * system for a given Nuna stroller, or null if this stroller has no urbn bundle
 * (or isn't a Nuna stroller).
 */
export function getPipaUrbnTravelSystemUrl(
  strollerBrand: string | null | undefined,
  strollerModel: string | null | undefined,
): string | null {
  if ((strollerBrand ?? '').trim().toLowerCase() !== 'nuna') return null;
  const model = (strollerModel ?? '').trim().toLowerCase();
  if (!model) return null;
  const match = PIPA_URBN_BUNDLES.find((b) => model.includes(b.token));
  return match ? babylistAffiliate(match.url) : null;
}
