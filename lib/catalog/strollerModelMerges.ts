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

/**
 * Hand-curated finder category overrides, keyed by canonical brand (lowercase)
 * then by the POST-merge model (lowercase). Use when a product's auto-derived
 * category is wrong for how the brand actually positions the stroller. Values
 * are StrollerCategory keys (see STROLLER_CATEGORY_LABELS).
 */
const CATEGORY_OVERRIDES: Record<string, Record<string, StrollerCategory>> = {
  'baby jogger': {
    // All-terrain / jogging line.
    'city mini gt2': 'jogging',
    'city mini gt3': 'jogging',
    'summit x3': 'jogging',
    'summit x3 single': 'jogging',
    // Compact / mid-size line.
    'city mini air': 'compact',
    'city tour 2': 'compact',
    'city tour 2 single': 'compact',
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
