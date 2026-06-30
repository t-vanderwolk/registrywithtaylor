/**
 * Conservative model/title → stroller-finder category inference, shared by the
 * "by type" audit (which flags mismatches for review) and the recategorizer
 * (which rewrites enrichment.productType so the product moves buckets).
 *
 * The rules are intentionally HIGH-precision: a product only earns a category
 * when its brand/model wording is a strong, well-known signal. Anything
 * ambiguous returns { expectedCategory: null } and is left exactly where it is.
 */
import type { StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

export type CategoryInference = {
  expectedCategory: StrollerCategory | null;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
};

/**
 * Inverse of PRODUCT_TYPE_TO_CATEGORY (lib/catalog/strollerCategoryMap.ts):
 * the productType string to store so a product lands in the given finder bucket.
 * Only the categories the inference can return are mapped.
 */
export const CATEGORY_TO_PRODUCT_TYPE: Partial<Record<StrollerCategory, string>> = {
  'full-size': 'full-size stroller',
  compact: 'compact stroller',
  travel: 'travel stroller',
  jogging: 'jogging stroller',
  double: 'double stroller',
  'double-jogging': 'double jogging stroller',
  'convertible-modular': 'single-to-double stroller',
  wagon: 'wagon',
  umbrella: 'umbrella stroller',
};

export function categoryToProductType(category: StrollerCategory): string | null {
  return CATEGORY_TO_PRODUCT_TYPE[category] ?? null;
}

function normalize(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Infer the category a stroller belongs in from its brand, model and any catalog
 * titles. Order matters: the most specific / highest-signal buckets (jogging,
 * wagon, single-to-double, double, umbrella, travel) are tested before the
 * softer compact/full-size signals.
 */
export function inferStrollerCategory(
  brand: string,
  model: string,
  titles: string[],
): CategoryInference {
  const text = normalize([brand, model, ...titles].join(' '));
  const reasons: string[] = [];
  const has = (re: RegExp, reason: string) => {
    const matched = re.test(text);
    if (matched) reasons.push(reason);
    return matched;
  };

  // ── Double jogging (running double) ──
  if (has(/\bbob\b/, 'BOB stroller line is jogging/double-jogging')) {
    if (has(/\b(duallie|double|renegade|wagon)\b/, 'BOB double/wagon wording')) {
      return { expectedCategory: 'double-jogging', confidence: 'high', reasons };
    }
    return { expectedCategory: 'jogging', confidence: 'high', reasons };
  }
  if (
    has(
      /\b(duallie|double jogging|jogging stroller double|urban glide\s*\d*\s*double|summit x3 double|alterrain duallie|indie twin)\b/,
      'double jogging model language',
    )
  ) {
    // Indie Twin is an all-terrain double but not a running stroller → plain double.
    if (/\bindie twin\b/.test(text)) {
      return { expectedCategory: 'double', confidence: 'high', reasons };
    }
    return { expectedCategory: 'double-jogging', confidence: 'high', reasons };
  }

  // ── Jogging / all-terrain (single) ──
  if (
    has(
      /\b(urban glide|summit x3|guava roam|uppababy ridge|switch and jog|switch jog|alterrain|revolution flex|wayfinder|rambler|city prix|chicco tre|\btre\b jogging|expedition|outpace|fastaction jogger|bumbleride speed|bumbleride indie(?! twin))\b/,
      'jogging/all-terrain model language',
    )
  ) {
    return { expectedCategory: 'jogging', confidence: 'high', reasons };
  }

  // ── Wagon ──
  if (
    has(
      /\b(wonderfold|stroller wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer|caravan wagon|4 seater|four seater)\b/,
      'stroller wagon model language',
    )
  ) {
    return { expectedCategory: 'wagon', confidence: 'high', reasons };
  }

  // ── Single-to-double / modular convertible ──
  if (
    has(
      /\b(donkey|kangaroo stroller|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|city select|ready2grow|nest2grow)\b/,
      'single-to-double/modular model language',
    )
  ) {
    return { expectedCategory: 'convertible-modular', confidence: 'high', reasons };
  }

  // ── Standard double (side-by-side / inline, non-jogging) ──
  if (
    has(
      /\b(minu duo|trvl dubl|trvl double|jet double|city mini gt2 double|city mini double|city tour 2 double|snap duo|zoe twin|g link|g-link|side by side|twin stroller|bravofor2|cortina together|standing sitting double)\b/,
      'standard double stroller model language',
    )
  ) {
    return { expectedCategory: 'double', confidence: 'high', reasons };
  }

  // ── Umbrella ──
  if (
    has(
      /\b(g luxe|g-luxe|g lite|g-lite|maclaren|3d lite|liteway|umbrella stroller|gap classic umbrella)\b/,
      'umbrella stroller model language',
    )
  ) {
    return { expectedCategory: 'umbrella', confidence: 'high', reasons };
  }

  // ── Travel (cabin-fold / lightweight compact-travel) ──
  if (
    has(
      /\b(butterfly|trvl(?! dubl| double)|minu(?! duo)|yoyo|yoyo3|yoyo 3|aer\+?|aer2|jet(?! double)|coya|libelle|beezy|quid|quid3|metro\+?|city tour|pockit|gb qbit|qbit|clic|volo|dot|nia|breez)\b/,
      'travel stroller model language',
    )
  ) {
    return { expectedCategory: 'travel', confidence: 'high', reasons };
  }

  // ── Compact / mid-size ──
  if (
    has(
      /\b(dragonfly|triv|dune|mios|joolz hub|hub2|swiv|electa|city mini gt3|city mini air|gb pockit)\b/,
      'compact/mid-size model language',
    )
  ) {
    return { expectedCategory: 'compact', confidence: 'high', reasons };
  }

  return { expectedCategory: null, confidence: 'low', reasons: [] };
}
