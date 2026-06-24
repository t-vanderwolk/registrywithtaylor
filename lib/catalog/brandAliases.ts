/**
 * Canonical display name for a catalog brand, collapsing the casing / spelling
 * variants the Babylist feed sometimes ships (e.g. both "CYBEX" and "Cybex")
 * so the finder shows a single brand entry with one logo. Unknown brands pass
 * through unchanged. Add a lowercase key here to merge another variant.
 */
const BRAND_ALIASES: Record<string, string> = {
  cybex: 'Cybex',
};

export function canonicalBrand(brand: string | null | undefined): string {
  const raw = (brand || 'Other').trim();
  return BRAND_ALIASES[raw.toLowerCase()] ?? raw;
}
