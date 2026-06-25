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
  // Double jogging + double travel fold into the single "Double" bucket — their
  // standalone finder categories were removed.
  'double jogging stroller': 'double',
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
