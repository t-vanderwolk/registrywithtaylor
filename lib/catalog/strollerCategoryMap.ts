import type { StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

/**
 * Maps a TMBC catalog productType (set by the auto-categorizer on
 * ProductEnrichment) → the stroller-finder's StrollerCategory taxonomy.
 * productTypes that aren't a browsable stroller bucket (e.g. "stroller
 * accessory") return null and are excluded from the finder.
 */
const PRODUCT_TYPE_TO_CATEGORY: Record<string, StrollerCategory> = {
  'full-size stroller': 'full-size',
  'compact stroller': 'compact',
  'travel stroller': 'travel',
  'jogging stroller': 'jogging',
  'double stroller': 'double',
  'double jogging stroller': 'double-jogging',
  // Double travel folds into the single "Double" bucket; Double Jogging remains
  // separate because it behaves like a running stroller first.
  'double travel stroller': 'double',
  'single-to-double stroller': 'convertible-modular',
  wagon: 'wagon',
  'umbrella stroller': 'umbrella',
};

export function strollerCategoryFromProductType(
  productType: string | null | undefined,
): StrollerCategory | null {
  if (!productType) return null;
  return PRODUCT_TYPE_TO_CATEGORY[productType.toLowerCase().trim()] ?? null;
}
