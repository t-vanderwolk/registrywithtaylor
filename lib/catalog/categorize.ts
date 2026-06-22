/**
 * Deterministic auto-categorizer for affiliate catalog products.
 *
 * The strongest signal is the feed's `product_type` path (Babylist's own
 * taxonomy, e.g. "Home > Newborn Must-Haves > Strollers > Full Size Strollers").
 * `google_product_category` is intentionally ignored — it's unreliable in this
 * feed (it labels baby products as "animals & pet supplies"). Title + brand are
 * fallbacks. Output is deterministic so re-runs are stable.
 */
import { CATEGORY_TO_JOURNEY, UNCATEGORIZED, type ParentJourney } from './taxonomy';

export type CategorizationResult = {
  tmbcCategory: string;
  productType: string | null;
  parentJourney: string | null;
  tags: string[];
  confidenceScore: number;
  needsReview: boolean;
};

type Rule = {
  re: RegExp;
  category: string;
  productType: string;
  journey?: ParentJourney;
  /** Base confidence when matched in title/brand only (path matches score higher). */
  conf?: number;
};

// Ordered most-specific → most-general. First match wins.
const RULES: Rule[] = [
  // ── Adapters & travel systems (before strollers / car seats) ──
  { re: /\btravel system\b/, category: 'Travel Systems & Adapters', productType: 'travel system' },
  { re: /\b(car ?seat adapter|infant (car )?seat adapter|adapter ring)\b/, category: 'Travel Systems & Adapters', productType: 'infant car seat adapter' },
  { re: /\b(stroller adapter|car ?seat adaptor)\b/, category: 'Travel Systems & Adapters', productType: 'stroller adapter' },
  { re: /\badapter|adaptor\b/, category: 'Travel Systems & Adapters', productType: 'stroller adapter', conf: 0.6 },

  // ── Car seats ──
  { re: /\bcar ?seat base|isofix base|stay.?in.?car base\b/, category: 'Car Seats', productType: 'car seat base' },
  { re: /\binfant car ?seats?\b/, category: 'Car Seats', productType: 'infant car seat' },
  { re: /\bconvertible car ?seats?\b/, category: 'Car Seats', productType: 'convertible car seat' },
  { re: /\ball.?in.?one car ?seats?\b/, category: 'Car Seats', productType: 'all-in-one car seat' },
  { re: /\b(rotating|360) car ?seats?\b/, category: 'Car Seats', productType: 'rotating car seat' },
  { re: /\bbooster (car ?)?seats?\b/, category: 'Car Seats', productType: 'booster seat' },
  { re: /\bcar ?seat (accessor|cover|canopy|protector|strap|insert)/, category: 'Car Seats', productType: 'car seat base', conf: 0.55 },
  { re: /\b(pipa|liing|cloud ?[a-z]\b|mico|aria|mesa|keyfit)\b/, category: 'Car Seats', productType: 'infant car seat', conf: 0.7 },
  { re: /\bcar ?seats?\b/, category: 'Car Seats', productType: 'infant car seat', conf: 0.6 },

  // ── Strollers ──
  { re: /\bfull.?size strollers?\b/, category: 'Strollers', productType: 'full-size stroller' },
  { re: /\b(jogging|jogger) strollers?\b/, category: 'Strollers', productType: 'jogging stroller' },
  { re: /\b(travel|lightweight|compact) strollers?\b/, category: 'Strollers', productType: 'travel stroller' },
  { re: /\b(double|tandem) strollers?|sit.?and.?stand\b/, category: 'Strollers', productType: 'double stroller' },
  { re: /\bsingle.?to.?double|convertible strollers?\b/, category: 'Strollers', productType: 'single-to-double stroller' },
  { re: /\bwagons?\b/, category: 'Strollers', productType: 'wagon' },
  { re: /\bstroller (accessor|board|organizer|cup ?holder|tray|footmuff|liner|parasol|snack|hook)/, category: 'Travel Systems & Adapters', productType: 'stroller accessory' },
  { re: /\b(additional|second) seats?|stroller bassinet\b/, category: 'Strollers', productType: 'second seat' },
  { re: /\bstrollers?\b/, category: 'Strollers', productType: 'full-size stroller', conf: 0.6 },

  // ── Babywearing ──
  { re: /\b(baby )?carriers?|structured carrier|soft carrier\b/, category: 'Babywearing', productType: 'baby carrier' },
  { re: /\bbaby wraps?|ring slings?\b/, category: 'Babywearing', productType: 'wrap' },
  { re: /\bslings?\b/, category: 'Babywearing', productType: 'sling', conf: 0.6 },

  // ── Sleep ──
  { re: /\bbassinets?\b/, category: 'Sleep', productType: 'bassinet' },
  { re: /\btravel cribs?|pack.?and.?plays?|play ?ards?|play ?yards?\b/, category: 'Sleep', productType: 'travel crib' },
  { re: /\bmini cribs?\b/, category: 'Sleep', productType: 'mini crib' },
  { re: /\bcrib mattress(es)?\b/, category: 'Sleep', productType: 'crib mattress' },
  { re: /\bcribs?\b/, category: 'Sleep', productType: 'crib' },
  { re: /\bswaddles?\b/, category: 'Sleep', productType: 'swaddle' },
  { re: /\bsleep ?sacks?|sleep ?bags?|wearable blankets?\b/, category: 'Sleep', productType: 'sleep sack' },
  { re: /\bsound machines?|white noise|sleep soother\b/, category: 'Sleep', productType: 'sound machine' },

  // ── Feeding ──
  { re: /\bbottle warmers?\b/, category: 'Feeding', productType: 'bottle warmer' },
  { re: /\bsteriliz/, category: 'Feeding', productType: 'sterilizer' },
  { re: /\bbreast ?pumps?|wearable pump\b/, category: 'Feeding', productType: 'breast pump' },
  { re: /\bhigh ?chairs?|feeding chair\b/, category: 'Feeding', productType: 'high chair' },
  { re: /\bpacifiers?|\bpaci\b|soothie\b/, category: 'Feeding', productType: 'pacifier' },
  { re: /\bbottles?\b|bottle feeding/, category: 'Feeding', productType: 'bottle' },
  { re: /\bnursing|breastfeeding|formula|food prep|dishes & utensils|utensils|self.?feeder\b/, category: 'Feeding', productType: 'bottle', conf: 0.55 },

  // ── Bath & Diapering ──
  { re: /\bdiaper pails?\b/, category: 'Bath & Diapering', productType: 'diaper pail' },
  { re: /\bdiaper bags?\b/, category: 'Bath & Diapering', productType: 'diaper bag' },
  { re: /\bchanging pads?|changing mat|changing station\b/, category: 'Bath & Diapering', productType: 'changing pad' },
  { re: /\bbath ?tubs?|baby ?bath|bath kneeler|\bbath\b/, category: 'Bath & Diapering', productType: 'bath tub' },
  { re: /\bdiaper(s|ing)?|wipes?|grooming|hygiene|potty\b/, category: 'Bath & Diapering', productType: 'health/safety item', conf: 0.55 },

  // ── Nursery furniture ──
  { re: /\bgliders?|rockers?|recliners?\b/, category: 'Nursery', productType: 'glider' },
  { re: /\bdressers?|changing table|chest of drawers\b/, category: 'Nursery', productType: 'dresser' },

  // ── Safety ──
  { re: /\bbaby ?gates?|safety gates?\b/, category: 'Safety', productType: 'baby gate' },
  { re: /\b(baby )?monitors?|video monitor|audio monitor\b/, category: 'Safety', productType: 'baby monitor' },
  { re: /\bthermometers?|first aid|nasal aspirator|baby ?proof|outlet cover|cabinet lock\b/, category: 'Safety', productType: 'health/safety item' },

  // ── Toys & Development ──
  { re: /\bteethers?|rattles?|play ?mat|play ?gym|activity (gym|center)|toys?\b/, category: 'Toys & Development', productType: 'toy' },
  { re: /\bbooks?\b/, category: 'Toys & Development', productType: 'book', conf: 0.6 },

  // ── Postpartum ──
  { re: /\bnursing pads?|postpartum|perineal|sitz|belly band|maternity\b/, category: 'Postpartum', productType: 'postpartum recovery item' },

  // ── Clothing & soft goods ──
  { re: /\bblankets?\b/, category: 'Clothing & Soft Goods', productType: 'blanket' },
  { re: /\b(footie|gown|outfit|onesie|bodysuit|romper|sock|beanie|mittens?|clothing|apparel)\b/, category: 'Clothing & Soft Goods', productType: 'clothing' },

  // ── Gifts & keepsakes ──
  { re: /\bkeepsakes?|milestone (cards?|blanket)|announcements?|picture frame|memory book\b/, category: 'Gifts & Keepsakes', productType: 'book', conf: 0.6 },
];

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildTags(category: string, productType: string): string[] {
  return [...new Set([slug(category), slug(productType)])].filter(Boolean);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export function categorizeProduct(input: {
  title?: string | null;
  brand?: string | null;
  productTypePath?: string | null;
  rawCategory?: string | null;
}): CategorizationResult {
  const path = (input.productTypePath ?? '').toLowerCase();
  const titleBrand = `${input.title ?? ''} ${input.brand ?? ''}`.toLowerCase();
  const haystack = `${path} || ${titleBrand}`;

  for (const rule of RULES) {
    if (!rule.re.test(haystack)) continue;

    // A match in Babylist's own product_type path is the strongest signal.
    const inPath = path.length > 0 && rule.re.test(path);
    const base = rule.conf ?? 0.9;
    const confidence = inPath ? Math.max(base, 0.85) : Math.min(base, 0.65);

    return {
      tmbcCategory: rule.category,
      productType: rule.productType,
      parentJourney: rule.journey ?? CATEGORY_TO_JOURNEY[rule.category] ?? null,
      tags: buildTags(rule.category, rule.productType),
      confidenceScore: round(confidence),
      needsReview: confidence < 0.75 || rule.category === UNCATEGORIZED,
    };
  }

  return {
    tmbcCategory: UNCATEGORIZED,
    productType: null,
    parentJourney: null,
    tags: [],
    confidenceScore: 0.1,
    needsReview: true,
  };
}
