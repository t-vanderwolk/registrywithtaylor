import type { StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

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
    // Collapse the "All-Terrain" descriptor into the GT3 card.
    'city mini gt3 all-terrain': 'City Mini GT3',
    'city mini gt3 all terrain': 'City Mini GT3',
    // Summit X3 Single (+ "Single Jogging") → one single card.
    'summit x3 single jogging': 'Summit X3 Single',
    // NOTE: the "* Double" variants keep their own names on purpose so they land
    // in the Double section (see CATEGORY_OVERRIDES below).
  },
};

export function mergeStrollerModel(brand: string, model: string): string {
  const b = (brand || '').trim().toLowerCase();
  const m = (model || '').trim().toLowerCase();
  return MODEL_MERGES[b]?.[m] ?? model;
}

/**
 * Hand-curated finder category overrides, keyed by canonical brand (lowercase)
 * then by the POST-merge model (lowercase). Use when a product's auto-derived
 * category is wrong for how the brand actually positions the stroller. Values
 * are StrollerCategory keys (see STROLLER_CATEGORY_LABELS).
 */
const CATEGORY_OVERRIDES: Record<string, Record<string, StrollerCategory>> = {
  nuna: {
    // DEMI Icon is a single full-size; DEMI Next is the single-to-double.
    'demi icon': 'full-size',
    'demi next': 'convertible-modular',
  },
  'baby jogger': {
    // Jogging / all-terrain line (three-wheel, off-pavement wheels).
    'city mini gt2': 'jogging',
    'city mini gt3': 'jogging',
    'city mini gt': 'jogging',
    'summit x3': 'jogging',
    'summit x3 single': 'jogging',
    // Compact / mid-size line (lightweight everyday).
    'city mini': 'compact',
    'city mini 2': 'compact',
    'city mini air': 'compact',
    // Travel line (compact travel fold).
    'city tour 2': 'travel',
    'city tour 2 single': 'travel',
    'city tour lux': 'travel',
    // Single-to-double modular line.
    'city select': 'convertible-modular',
    'city select 2': 'convertible-modular',
    'city select lux': 'convertible-modular',
    // Double section (the side-by-side / double variants).
    'city mini gt2 double': 'double',
    'city mini double': 'double',
    'city tour 2 double': 'double',
    'summit x3 double': 'double',
  },
};

export function overrideStrollerCategory(
  brand: string,
  model: string,
  current: StrollerCategory,
): StrollerCategory {
  const b = (brand || '').trim().toLowerCase();
  const m = (model || '').trim().toLowerCase();
  return CATEGORY_OVERRIDES[b]?.[m] ?? current;
}
