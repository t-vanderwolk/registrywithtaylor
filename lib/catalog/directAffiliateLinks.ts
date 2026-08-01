/**
 * Direct brand affiliate links for brands where a direct program pays better
 * than Babylist and should therefore be the PRIMARY shop button (Babylist stays
 * as a secondary option). Currently: Mima (via Awin) and Silver Cross (direct).
 *
 *  - Mima:        Awin deep link — awinmid 115993 (Mima USA), awinaffid 2588613,
 *                 wrapping the exact mimakidsusa.com product URL.
 *  - Silver Cross: silvercrossus.com product page with ?affiliate_pid=4762.
 *
 * Exact per-model links are used where known; otherwise a brand-level (still
 * affiliate-tracked) link to that brand's stroller listing.
 */

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

// ── Mima (Awin) ──────────────────────────────────────────────────────────────
const MIMA_AWIN_MID = '115993';
const MIMA_AWIN_AFFID = '2588613';
const mimaAwin = (destUrl: string) =>
  `https://www.awin1.com/cread.php?awinmid=${MIMA_AWIN_MID}&awinaffid=${MIMA_AWIN_AFFID}&platform=dl&ued=${encodeURIComponent(destUrl)}`;

const MIMA_LINKS: Record<string, string> = {
  miro: mimaAwin('https://mimakidsusa.com/products/mima-miro-stroller'),
  creo: mimaAwin('https://mimakidsusa.com/products/mima-creo-stroller'),
  xari: mimaAwin('https://mimakidsusa.com/products/mima-xari-max-stroller'),
  'xari max': mimaAwin('https://mimakidsusa.com/products/mima-xari-max-stroller'),
};
const MIMA_FALLBACK = mimaAwin('https://mimakidsusa.com/collections/strollers');

// ── Silver Cross (direct, ref=4762) ──────────────────────────────────────────
const sc = (slug: string) => `https://silvercrossus.com/product/${slug}/?ref=4762`;

// Current Silver Cross US lineup. Jet 5 and Dune are discontinued — omitted so
// their cards fall back to the (live) strollers listing rather than a dead page.
const SILVER_CROSS_LINKS: Record<string, string> = {
  reef: sc('silver-cross-reef-2-foldable-stroller'),
  'reef 2': sc('silver-cross-reef-2-foldable-stroller'),
  wave: sc('wave-3-single-to-double-stroller'),
  'wave 3': sc('wave-3-single-to-double-stroller'),
  nia: sc('nia-compact-folding-traveling-stroller'),
  cove: sc('cove-2-full-size-stroller'),
  'cove 2': sc('cove-2-full-size-stroller'),
  breez: sc('breez-compact-stroller'),
};
// Valid, affiliate-tracked Silver Cross strollers listing for models without an
// exact product URL (Clic, Comet, discontinued Jet/Dune, …).
const SILVER_CROSS_FALLBACK = 'https://silvercrossus.com/category/strollers/?ref=4762';

/**
 * The direct brand affiliate link for a Mima / Silver Cross product, or null for
 * every other brand. Exact product page when the model is known, else the
 * brand's tracked stroller listing.
 */
export function getDirectAffiliateLink(
  brand: string | null | undefined,
  model: string | null | undefined,
): string | null {
  const b = norm(brand ?? '');
  const m = norm(model ?? '');
  if (b === 'mima') return MIMA_LINKS[m] ?? MIMA_FALLBACK;
  if (b === 'silver cross' || b === 'silvercross') return SILVER_CROSS_LINKS[m] ?? SILVER_CROSS_FALLBACK;
  return null;
}

/** The shop-button label for a direct brand link. */
export function directShopLabel(brand: string): string {
  return `Shop ${brand.trim()}`;
}
