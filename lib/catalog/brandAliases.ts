/**
 * Canonical display name for a catalog brand, collapsing the casing / spelling
 * variants the Babylist feed sometimes ships (e.g. both "CYBEX" and "Cybex")
 * so the finder shows a single brand entry with one logo. Unknown brands pass
 * through unchanged. Add a lowercase key here to merge another variant.
 */
const BRAND_ALIASES: Record<string, string> = {
  babyzen: 'Stokke',
  bob: 'BOB',
  'bob gear': 'BOB',
  cybex: 'Cybex',
  phil: 'Phil & Teds',
  'phil & teds': 'Phil & Teds',
  'phil and teds': 'Phil & Teds',
  'phil&teds': 'Phil & Teds',
  safety: 'Safety 1st',
  'safety 1st': 'Safety 1st',
  'safety first': 'Safety 1st',
  summer: 'Ingenuity',
  'summer infant': 'Ingenuity',
  'stokke yoyo': 'Stokke',
  wonderfold: 'WonderFold',
  'wonderfold wagon': 'WonderFold',
};

export function canonicalBrand(brand: string | null | undefined): string {
  const raw = (brand || 'Other').trim();
  return BRAND_ALIASES[raw.toLowerCase()] ?? raw;
}
