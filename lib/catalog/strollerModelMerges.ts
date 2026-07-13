/**
 * Hand-curated model merges for the finder: collapse listing variants that
 * should show as a single stroller card (e.g. a "Double" and its base, or a
 * descriptive suffix like "All-Terrain"). Keyed by canonical brand (lowercase),
 * then by the lowercase source model → the canonical model to display.
 *
 * Applied in publicStrollerCatalog where each product's model is finalized, so
 * every merged variant shares one `productModelKey` group. Unknown models pass
 * through unchanged.
 */
const MODEL_MERGES: Record<string, Record<string, string>> = {
  'baby jogger': {
    // City Mini GT2 (+ Double, + the plain City Mini Double) → one card.
    'city mini gt2 double': 'City Mini GT2',
    'city mini gt2': 'City Mini GT2',
    'city mini double': 'City Mini GT2',
    // City Mini GT3 (+ the "All-Terrain" descriptor) → one card.
    'city mini gt3 all-terrain': 'City Mini GT3',
    'city mini gt3 all terrain': 'City Mini GT3',
    'city mini gt3': 'City Mini GT3',
    // City Tour 2 (+ Double) → one card. (City Tour 2 Single stays separate.)
    'city tour 2 double': 'City Tour 2',
    'city tour 2': 'City Tour 2',
    // Summit X3 (+ Double) → one card.
    'summit x3 double': 'Summit X3',
    'summit x3': 'Summit X3',
    // Summit X3 Single (+ Single Jogging) → one card.
    'summit x3 single jogging': 'Summit X3 Single',
    'summit x3 single': 'Summit X3 Single',
  },
};

export function mergeStrollerModel(brand: string, model: string): string {
  const b = (brand || '').trim().toLowerCase();
  const m = (model || '').trim().toLowerCase();
  return MODEL_MERGES[b]?.[m] ?? model;
}
