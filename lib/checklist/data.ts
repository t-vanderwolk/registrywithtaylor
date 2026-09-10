/**
 * Baby Checklist content — the single source of truth for every checklist
 * version. Presentation lives in components/checklist/BabyChecklist.tsx; this
 * file holds only structured content so Taylor can edit copy, badges, notes,
 * categories, and recommendation references without touching the UI.
 *
 * Core gear is IDENTICAL across girl / boy / neutral by design — a girl and a
 * boy do not need different safety or function gear. Girl/boy/neutral differ
 * only in optional `styleCollection` aesthetic suggestions. The twins version
 * layers quantity logic on top via per-item `twins` overrides.
 */

export type ChecklistType = 'girl' | 'boy' | 'neutral' | 'twins';

export const CHECKLIST_TYPES: { id: ChecklistType; label: string }[] = [
  { id: 'girl', label: 'Girl' },
  { id: 'boy', label: 'Boy' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'twins', label: 'Twins' },
];

/** Version rendered on first load / for the canonical URL. */
export const DEFAULT_TYPE: ChecklistType = 'neutral';

export type CategoryId =
  | 'sleep'
  | 'feeding'
  | 'solids'
  | 'diapering'
  | 'bath'
  | 'health'
  | 'getting-around'
  | 'diaper-bag'
  | 'clothing'
  | 'play'
  | 'awake-time'
  | 'travel'
  | 'home-safety'
  | 'postpartum'
  | 'support'
  | 'registry-strategy';

export const categories: { id: CategoryId; title: string }[] = [
  { id: 'sleep', title: 'Sleep + Nursery' },
  { id: 'feeding', title: 'Feeding + Pumping' },
  { id: 'solids', title: 'Starting Solids' },
  { id: 'diapering', title: 'Diapering' },
  { id: 'bath', title: 'Bath' },
  { id: 'health', title: 'Health + Grooming' },
  { id: 'getting-around', title: 'Getting Around' },
  { id: 'diaper-bag', title: 'Diaper Bag' },
  { id: 'clothing', title: 'Clothing' },
  { id: 'play', title: 'Play + Development' },
  { id: 'awake-time', title: 'Awake-Time Gear' },
  { id: 'travel', title: 'Travel' },
  { id: 'home-safety', title: 'Home + Safety' },
  { id: 'postpartum', title: 'Postpartum' },
  { id: 'support', title: 'Support + Services' },
  { id: 'registry-strategy', title: 'Registry Strategy' },
];

export type ChecklistTiming =
  | 'before-baby'
  | 'first-8-weeks'
  | '3-6-months'
  | '6-12-months'
  | 'later';

export type ChecklistTake =
  | 'essential'
  | 'try-first'
  | 'register-early'
  | 'nice-to-have'
  | 'lifestyle-dependent'
  | 'wait';

export type ChecklistTimingFilter = 'all' | ChecklistTiming;
export type ChecklistTakeFilter = 'all' | ChecklistTake;

export const CHECKLIST_TIMING_LABELS: Record<ChecklistTiming, string> = {
  'before-baby': 'Before Baby',
  'first-8-weeks': 'First 8 Weeks',
  '3-6-months': '3-6 Months',
  '6-12-months': '6-12 Months',
  later: 'Later',
};

export const CHECKLIST_TAKE_LABELS: Record<ChecklistTake, string> = {
  essential: 'Essential',
  'try-first': 'Try First',
  'register-early': 'Register Early',
  'nice-to-have': 'Nice to Have',
  'lifestyle-dependent': 'Lifestyle Dependent',
  wait: 'Wait',
};

export const CHECKLIST_TIMING_FILTERS: { id: ChecklistTimingFilter; label: string }[] = [
  { id: 'all', label: 'All timing' },
  { id: 'before-baby', label: CHECKLIST_TIMING_LABELS['before-baby'] },
  { id: 'first-8-weeks', label: CHECKLIST_TIMING_LABELS['first-8-weeks'] },
  { id: '3-6-months', label: CHECKLIST_TIMING_LABELS['3-6-months'] },
  { id: '6-12-months', label: CHECKLIST_TIMING_LABELS['6-12-months'] },
  { id: 'later', label: CHECKLIST_TIMING_LABELS.later },
];

export const CHECKLIST_TAKE_FILTERS: { id: ChecklistTakeFilter; label: string }[] = [
  { id: 'all', label: "All Taylor's Takes" },
  { id: 'essential', label: CHECKLIST_TAKE_LABELS.essential },
  { id: 'try-first', label: CHECKLIST_TAKE_LABELS['try-first'] },
  { id: 'register-early', label: CHECKLIST_TAKE_LABELS['register-early'] },
  { id: 'nice-to-have', label: CHECKLIST_TAKE_LABELS['nice-to-have'] },
  { id: 'lifestyle-dependent', label: CHECKLIST_TAKE_LABELS['lifestyle-dependent'] },
  { id: 'wait', label: CHECKLIST_TAKE_LABELS.wait },
];

export type RelatedPost = { label: string; slug: string };

/** A resolved blog post rendered as a JournalCard in the checklist's related
 *  reading strip. Built server-side (getChecklistRelatedReading) from live posts,
 *  then passed into the client checklist as a serializable prop. */
export type RelatedReadingCard = {
  title: string;
  slug: string;
  category: string;
  coverImage: string | null;
  excerpt: string;
  dateLabel: string;
  dateTime: string;
  readingTime: number | null;
};

/**
 * "Related reading" links shown per checklist category — every relevant live
 * post (verified against the sitemap), not a capped subset. Slugs with no live
 * post are silently skipped at render. Categories without a match are omitted
 * rather than padded.
 * To edit: add/remove { label, slug } — slug is the /blog/<slug> path.
 */
export const categoryRelatedPosts: Partial<Record<CategoryId, RelatedPost[]>> = {
  sleep: [
    { label: 'Bassinet vs. crib vs. pack ’n play', slug: 'bassinet-vs-crib-vs-pack-and-play' },
    { label: 'Pack ’n play vs. travel crib', slug: 'blog-pack-and-play-vs-travel-crib' },
    { label: 'Nuna travel crib showdown', slug: 'nuna-travel-crib-showdown-sena-paal-cove' },
    { label: 'SlumberPod review', slug: 'slumberpod-review-travel-baby-sleep' },
  ],
  feeding: [
    { label: 'Best high chairs (2026)', slug: 'best-highchairs-2026-real-life-guide' },
    {
      label: 'Bottle washer showdown',
      slug: 'bottle-washer-showdown-momcozy-grownsy-bc-babycare-eufy-papablic',
    },
    { label: 'Momcozy baby products', slug: 'momcozy-baby-products' },
  ],
  solids: [
    { label: 'Best high chairs (2026)', slug: 'best-highchairs-2026-real-life-guide' },
  ],
  diapering: [
    { label: 'Best diaper pails (2026)', slug: 'blog-best-diaper-pails-2026' },
  ],
  'getting-around': [
    { label: 'Best full-size strollers (2026)', slug: 'best-full-size-strollers-2026' },
    { label: 'Best compact strollers (2026)', slug: 'best-compact-strollers-2026' },
    { label: 'Best travel strollers (2026)', slug: 'best-travel-strollers-2026' },
    {
      label: 'Single-to-double strollers',
      slug: 'best-convertible-single-to-double-strollers-2026',
    },
    {
      label: 'Silver Cross Nia vs. Clic vs. Jet',
      slug: 'silver-cross-nia-vs-clic-vs-jet-travel-stroller-comparison-2026',
    },
    { label: 'Joolz Aer vs. Dot', slug: 'joolz-aer-vs-joolz-dot-showdown' },
    { label: 'Nuna TRIV vs. SWIV vs. FLEX', slug: 'nuna-triv-next-vs-swiv-vs-flex-system-vs-triv-lx' },
    { label: 'Bugaboo Dragonfly Plus review', slug: 'bugaboo-dragonfly-plus-review-2026' },
    { label: 'Bugaboo Butterfly 2 Plus', slug: 'bugaboo-butterfly-2-plus' },
    { label: 'Bugaboo Donkey 6', slug: 'bugaboo-donkey-6-stroller-release' },
    { label: 'Nuna DEMI Icon', slug: 'nuna-demi-icon-has-arrived' },
    { label: 'Silver Cross Cove 2 review', slug: 'silver-cross-cove-2-review' },
    { label: 'Nuna VIAA CABN', slug: 'nuna-viaa-cabn-has-arrived' },
  ],
  play: [
    { label: 'New baby gear in 2026', slug: 'baby-gear-released-2026-so-far' },
  ],
  travel: [
    { label: 'Pack ’n play vs. travel crib', slug: 'blog-pack-and-play-vs-travel-crib' },
    { label: 'Nuna travel crib showdown', slug: 'nuna-travel-crib-showdown-sena-paal-cove' },
    { label: 'SlumberPod review', slug: 'slumberpod-review-travel-baby-sleep' },
    { label: 'Best travel strollers (2026)', slug: 'best-travel-strollers-2026' },
  ],
  'registry-strategy': [
    { label: 'Taylor’s registry essentials', slug: 'taylors-registry-essentials' },
    { label: 'Registry completion discounts', slug: 'baby-registry-completion-discounts-2026' },
    { label: 'Free baby welcome boxes', slug: 'best-free-baby-welcome-boxes-2026' },
    {
      label: 'Independent baby store rewards',
      slug: 'best-independent-baby-stores-rewards-programs-2026',
    },
    {
      label: 'Target Baby concierge',
      slug: 'target-baby-concierge-virtual-specialist-guide-2026',
    },
  ],
  support: [
    { label: 'NFL newborn fan clubs', slug: 'nfl-newborn-fan-clubs' },
    { label: 'MLB newborn fan clubs', slug: 'mlb-newborn-fan-clubs' },
  ],
};

export type StyleCollection = { girl: string[]; boy: string[]; neutral: string[] };

export type ChecklistItem = {
  id: string;
  /** A static CategoryId or an admin-created category's id. */
  category: string;
  title: string;
  note?: string;
  /** Timeline filter shown in the public checklist. */
  timing?: ChecklistTiming;
  /** Taylor's scannable recommendation status. */
  take?: ChecklistTake;
  /** Understated editorial pill. Freeform so twins quantity labels fit too. */
  badge?: string;
  /** A single Taylor's Pick. */
  recommendationId?: string;
  /** Multiple Taylor's Picks (takes precedence over recommendationId when set). */
  recommendationIds?: string[];
  taylorsTake?: string;
  /** Optional aesthetic-only suggestions (never core gear) for girl/boy/neutral. */
  styleCollection?: StyleCollection;
  /** Which versions include this item. Omitted = all four. */
  include?: ChecklistType[];
  /** Twins-only overrides. `label` becomes a quantity pill (BUY 2, SHARE, …). */
  twins?: {
    title?: string;
    note?: string;
    timing?: ChecklistTiming;
    take?: ChecklistTake;
    badge?: string;
    label?: string;
    taylorsTake?: string;
  };
};

export const TWINS_CALLOUT = {
  heading: 'Double the babies. Not necessarily double the gear.',
  body: 'Start by duplicating the items each baby needs for safety and daily function. Share what can reasonably be shared, and wait before purchasing two of every convenience item.',
};

export const DISCLOSURE =
  'A quick note: Some links are affiliate links, which means Taylor-Made Baby Co. may earn a commission at no additional cost to you. Recommendations are always selected independently.';

type ChecklistItemExtras = Omit<ChecklistItem, 'id' | 'category' | 'title' | 'take' | 'timing'>;

const ck = (
  category: CategoryId,
  id: string,
  title: string,
  take: ChecklistTake,
  timing: ChecklistTiming,
  extras: ChecklistItemExtras = {},
): ChecklistItem => ({ ...extras, id, category, title, take, timing });

const NURSERY_STYLE: StyleCollection = {
  girl: ['Soft blush, warm cream, and gentle terracotta', 'Small florals, fine stripes, or solids'],
  boy: ['Sage, oat, and soft slate', 'Simple stripes, solids, or a quiet motif'],
  neutral: ['Ivory, oatmeal, clay, and fog', 'Solids or the quietest pattern in the room'],
};

const CLOTHING_STYLE: StyleCollection = {
  girl: ['Blush, cream, terracotta, and soft rose', 'Tiny florals, fine stripes, or soft knits'],
  boy: ['Sage, oat, slate, and warm gray', 'Solids, simple stripes, or a subtle motif'],
  neutral: ['Ivory, oatmeal, clay, and fog', 'Calm solids and understated earth tones'],
};

const CONDENSED_OUT_ITEM_IDS = new Set<string>([
  // Sleep + Nursery
  'safe-sleep-boundaries',
  'bassinet-if-using',
  'portable-sound-machine',
  // Feeding + Pumping
  'additional-bottles',
  'slow-flow-nipples',
  'bottle-labels-daycare',
  'extra-pump-parts',
  'milk-collectors',
  'milk-freezer-organizer',
  'nursing-cover',
  // Starting Solids
  'high-chair-fit-extras',
  'snack-food-storage',
  'placemat-splash-mat',
  // Diapering
  'size-one-diapers',
  'changing-liners',
  'disposal-bags',
  'wet-dry-bag',
  // Bath
  'washcloths',
  'bath-toys-storage',
  // Health + Grooming
  'brush-comb',
  'humidifier-care',
  'sunscreen-guidance',
  'health-tracker',
  // Getting Around
  'infant-seat-base',
  'car-seat-registration',
  'parent-organizer-cup-holder',
  'child-snack-tray',
  // Diaper Bag
  'small-diaper-pouch',
  'travel-wipes-disposal',
  'baby-change-clothes',
  'parent-spare-shirt',
  'adult-sanitizer-firstaid',
  // Clothing
  'socks-booties',
  'special-outfit',
  // Play + Development
  'tummy-time-mirror',
  'rattles-crinkle-toy',
  'activity-center',
  // Awake-Time Gear
  'portable-bouncer',
  // Travel
  'travel-crib-sheet',
  'compact-travel-stroller',
  'travel-feeding-kit',
  'portable-changing-kit',
  // Home + Safety
  'outlet-covers',
  'window-guards-stops',
  'door-toilet-stove-safety',
  // Postpartum
  'peri-bottle-cold-packs',
  'nursing-pumping-bras',
  'feeding-comfort',
  // Support + Services
  'newborn-photo-keepsake',
  // Registry Strategy
  'secondary-registries-value',
  'rewards-cashback-sales',
  'returns-packaging',
]);

export function isPublicChecklistItem(item: { id: string; hidden?: boolean }): boolean {
  if (typeof item.hidden === 'boolean') return !item.hidden;
  return !CONDENSED_OUT_ITEM_IDS.has(item.id);
}

export const checklistItems: ChecklistItem[] = [
  // Sleep + Nursery
  ck('sleep', 'crib', 'Crib, mini crib, bassinet, or approved primary sleep space', 'essential', 'before-baby', {
    note: 'A firm, flat, safety-approved place for baby to sleep from night one. Skip pillows, bumpers, loose blankets, positioners, toppers, and stuffed animals in the infant sleep space.',
    recommendationIds: ['davinci-dylan-mini-crib', 'stokke-sleepi-crib'],
    taylorsTake:
      'Pick based on your room and routine. The non-negotiable is a firm, flat, approved sleep surface with only a fitted sheet.',
    twins: {
      title: '2 approved safe sleep spaces',
      note: 'Each baby needs their own firm, flat sleep surface.',
      label: 'BUY 2',
    },
  }),
  ck('sleep', 'crib-mattress', 'Appropriately sized firm mattress', 'essential', 'before-baby', {
    note: 'Firm, flat, and snugly fitted to the sleep space.',
    twins: { title: '2 appropriately sized firm mattresses', label: 'BUY 2' },
  }),
  ck('sleep', 'crib-sheets', '2-3 fitted sheets per sleep space', 'essential', 'before-baby', {
    note: 'Enough to rotate through middle-of-the-night changes; add bassinet or playard sheets only for the sleep spaces you actually use.',
    styleCollection: NURSERY_STYLE,
    twins: { title: '4-6 fitted sheets total', label: 'BUY 2' },
  }),
  ck('sleep', 'mattress-protector', '2 waterproof mattress protectors', 'essential', 'before-baby', {
    note: 'Protects the mattress and makes overnight cleanup faster.',
    twins: { title: '2-4 waterproof mattress protectors', label: 'BUY 2' },
  }),
  ck('sleep', 'safe-sleep-boundaries', 'Bare-crib safe sleep boundaries', 'essential', 'before-baby', {
    note: 'Skip pillows, bumpers, loose blankets, positioners, extra toppers, and stuffed animals in the infant sleep space.',
  }),
  ck('sleep', 'travel-crib', 'Portable playard / travel crib', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Useful as a second approved sleep space for travel, visits, or downstairs.',
    recommendationId: 'playard-pick',
    twins: { title: 'Twin-friendly portable sleep plan', note: 'Plan for two safe surfaces away from the cribs.' },
  }),
  ck('sleep', 'bassinet-if-using', 'Bassinet + fitted sheets, if using', 'lifestyle-dependent', 'before-baby', {
    note: 'Helpful near your bed, but not required if your crib or playard setup works.',
  }),
  ck('sleep', 'swaddles', 'Swaddle trial set', 'try-first', 'before-baby', {
    note: 'Try a few styles before buying a full stack.',
    styleCollection: NURSERY_STYLE,
    twins: { title: 'Swaddle trial set for each baby', label: 'TRY FIRST' },
  }),
  ck('sleep', 'sleep-sacks', '2-3 sleep sacks', 'register-early', 'first-8-weeks', {
    note: 'Useful once baby transitions out of swaddles.',
    styleCollection: NURSERY_STYLE,
    twins: { title: 'Sleep sacks for each baby', label: 'BUY 2' },
  }),
  ck('sleep', 'monitor', 'Baby monitor', 'nice-to-have', 'before-baby', {
    note: 'A clear view can be helpful, but it is not a medical device.',
    recommendationId: 'monitor-pick',
    twins: { title: 'Monitor with two-camera capability', note: 'One system, two views.' },
  }),
  ck('sleep', 'audio-monitor', 'Simple audio monitor', 'nice-to-have', 'before-baby', {
    note: 'A low-stress backup or the only monitor you need in a small home.',
    recommendationId: 'audio-monitor-pick',
  }),
  ck('sleep', 'sound-machine', 'Sound machine or portable sound solution', 'nice-to-have', 'before-baby', {
    note: 'Consistent background sound for sleep routines; choose a portable version only if naps away from the nursery are likely.',
  }),
  ck('sleep', 'portable-sound-machine', 'Portable sound machine', 'nice-to-have', 'first-8-weeks', {
    note: 'Helpful for naps away from the nursery.',
  }),
  ck('sleep', 'night-light', 'Warm dim night-light', 'nice-to-have', 'before-baby', {
    note: 'Dim, warm light for feeds and changes without fully waking everyone.',
  }),
  ck('sleep', 'blackout', 'Blackout curtains or portable blackout solution', 'nice-to-have', 'first-8-weeks', {
    note: 'Helpful for naps, summer bedtimes, and travel.',
  }),
  ck('sleep', 'humidifier', 'Cool-mist humidifier', 'nice-to-have', 'before-baby', {
    note: 'Useful in dry rooms or during congestion season.',
  }),
  ck('sleep', 'nursery-landing-zone', 'Nursery chair, side table, and small caddy', 'nice-to-have', 'before-baby', {
    note: 'A comfortable feeding/change landing zone if your space allows.',
  }),

  // Feeding + Pumping
  ck('feeding', 'bottle-trial', 'Bottle trial box or 2-4 individual bottles', 'try-first', 'before-baby', {
    note: 'Let baby choose the bottle and nipple flow before you buy a full set.',
    recommendationId: 'bottle-trial-pick',
    taylorsTake:
      'Babies are opinionated about bottles. A small variety pack is cheap insurance against a set of eight your baby refuses.',
    twins: { title: 'Bottle trial packs before buying multiples', label: 'TRY FIRST' },
  }),
  ck('feeding', 'additional-bottles', 'Additional bottles after baby chooses a favorite', 'wait', 'first-8-weeks', {
    note: 'Buy the quantity once the bottle style is proven.',
  }),
  ck('feeding', 'slow-flow-nipples', 'Slow-flow or appropriate nipples', 'try-first', 'before-baby', {
    note: 'Flow preference and feeding needs vary by baby.',
  }),
  ck('feeding', 'bottle-brush', 'Bottle cleaning basics', 'essential', 'before-baby', {
    note: 'Think bottle brush, drying space, and a small-parts plan based on how you will clean bottles and pump parts.',
    twins: { title: 'Bottle cleaning station', note: 'Brush, drying space, and a half-asleep routine.' },
  }),
  ck('feeding', 'bottle-drying-rack', 'Bottle drying rack or drying mat', 'nice-to-have', 'before-baby', {
    note: 'Gives bottles and small parts a dedicated drying spot.',
  }),
  ck('feeding', 'dishwasher-basket', 'Dishwasher basket for small parts', 'nice-to-have', 'before-baby', {
    note: 'Keeps nipples, valves, and pump pieces from disappearing.',
  }),
  ck('feeding', 'bottle-labels-daycare', 'Bottle labels for daycare', 'wait', '3-6-months', {
    note: 'Wait until you know your childcare setup.',
  }),
  ck('feeding', 'insulated-bottle-cooler', 'Insulated bottle or milk cooler', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Useful for pumping, formula, childcare, or longer outings.',
  }),
  ck('feeding', 'primary-pump', 'Insurance-covered primary breast pump, if needed', 'lifestyle-dependent', 'before-baby', {
    note: 'Check insurance coverage before buying one outright; wait on extra parts until you know your pump and flange fit.',
    recommendationId: 'breast-pump-pick',
  }),
  ck('feeding', 'manual-pump', 'Manual breast pump', 'nice-to-have', 'first-8-weeks', {
    note: 'Small, inexpensive help for letdown or fullness.',
  }),
  ck('feeding', 'wearable-pump', 'Wearable pump', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Convenient for some pumping routines, but not automatically necessary.',
  }),
  ck('feeding', 'flange-sizing', 'Correct pump flange sizes or inserts', 'try-first', 'first-8-weeks', {
    note: 'Fit affects comfort and output; size after you know what you need.',
  }),
  ck('feeding', 'extra-pump-parts', 'Extra pump parts after you know your system', 'wait', 'first-8-weeks', {
    note: 'Do not buy spares for a system you may not use.',
  }),
  ck('feeding', 'milk-collectors', 'Milk collection cups or collectors', 'nice-to-have', 'first-8-weeks', {
    note: 'Helpful for some nursing and pumping routines.',
  }),
  ck('feeding', 'milk-storage', 'Breastmilk storage bags or containers', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Only useful if you are pumping or building a stash; add a freezer organizer only if it helps you rotate dated milk.',
    twins: { title: 'Extra milk storage if pumping for two' },
  }),
  ck('feeding', 'milk-freezer-organizer', 'Milk freezer organizer', 'nice-to-have', 'first-8-weeks', {
    note: 'Keeps stored milk dated and easy to rotate.',
  }),
  ck('feeding', 'pumping-bra', 'Pumping bra', 'nice-to-have', 'first-8-weeks', {
    note: 'Worth it if you pump regularly; portable pump bags and cleaning wipes can wait until work, travel, or pumping away from home is real.',
  }),
  ck('feeding', 'pump-bag-cleaning', 'Portable pump bag and cleaning supplies', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'For work, travel, or pumping away from home.',
  }),
  ck('feeding', 'nursing-pillow', 'Nursing pillow', 'try-first', 'before-baby', {
    note: 'Parent body shape, chair setup, and baby preference matter.',
  }),
  ck('feeding', 'nursing-bras-tanks', 'Nursing bras or tanks', 'nice-to-have', 'before-baby', {
    note: 'Start small until you know your postpartum size and feeding routine.',
  }),
  ck('feeding', 'nursing-pads-balm', 'Nursing pads and nipple balm', 'nice-to-have', 'before-baby', {
    note: 'Comfort supplies if breastfeeding or pumping.',
  }),
  ck('feeding', 'nursing-cover', 'Nursing cover', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Only if it fits your privacy preferences and routine.',
  }),
  ck('feeding', 'sterilizer', 'Microwave sterilization bags or container', 'nice-to-have', 'before-baby', {
    note: 'A simple steam option without committing to a large appliance.',
  }),
  ck('feeding', 'bottle-washer', 'Bottle washer or countertop sterilizer', 'nice-to-have', 'before-baby', {
    note: 'A splurge that can pay off if bottles or pump parts dominate your day.',
    twins: { title: 'Bottle washer or sterilizer for two-baby volume' },
  }),
  ck('feeding', 'warm-water-dispenser', 'Bottle warmer or warm-water dispenser', 'nice-to-have', 'first-8-weeks', {
    note: 'Convenient for formula or pumped milk, but skippable.',
  }),
  ck('feeding', 'formula-prep', 'Formula pitcher or diaper-bag dispenser', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Useful if formula is part of the plan.',
  }),
  ck('feeding', 'burp-cloths', '8-12 burp cloths', 'essential', 'before-baby', {
    note: 'Plain, absorbent cloths earn their keep every day.',
    twins: { title: 'Plenty of burp cloths for two feeders' },
  }),
  ck('feeding', 'pacifier-trial', 'Pacifier trial pack', 'try-first', 'before-baby', {
    note: 'Same logic as bottles: try shapes before buying a dozen.',
    twins: { title: 'Pacifier trial packs before buying multiples', label: 'TRY FIRST' },
  }),

  // Starting Solids
  ck('solids', 'high-chair', 'High chair', 'register-early', '3-6-months', {
    note: 'Add it for gifting and completion discounts; confirm whether your chosen chair needs a tray, cushion, or footrest.',
    recommendationId: 'high-chair-pick',
    twins: { title: '2 high chairs', label: 'BUY 2' },
  }),
  ck('solids', 'high-chair-fit-extras', 'High-chair tray or footrest, if required', 'lifestyle-dependent', '3-6-months', {
    note: 'Only if your chosen high chair needs the add-ons.',
  }),
  ck('solids', 'solids-bibs', '2-3 silicone or wipeable bibs', 'wait', '3-6-months', {
    note: 'Great later; not needed for newborn feeding.',
  }),
  ck('solids', 'first-spoons', 'First spoons', 'wait', '3-6-months', {
    note: 'Small, soft spoons for the first food stage.',
  }),
  ck('solids', 'bowls-plates', 'First spoons, bowls, plates, and cups', 'wait', '3-6-months', {
    note: 'Register now, open when solids are on the horizon; a small set of spoons plus an open cup or straw cup is plenty.',
  }),
  ck('solids', 'open-straw-cups', 'Open cup and straw cup', 'wait', '3-6-months', {
    note: 'Useful skill-building cups for the solids stage.',
  }),
  ck('solids', 'snack-food-storage', 'Snack and food storage containers', 'nice-to-have', '6-12-months', {
    note: 'Handy once meals and snacks leave the house.',
  }),
  ck('solids', 'placemat-splash-mat', 'Portable placemat or splash mat', 'nice-to-have', '6-12-months', {
    note: 'Makes cleanup easier at home or restaurants.',
  }),
  ck('solids', 'portable-high-chair', 'Portable high chair or hook-on chair', 'lifestyle-dependent', '6-12-months', {
    note: 'Good for travel, restaurants, or homes without a dining setup.',
  }),

  // Diapering
  ck('diapering', 'newborn-diapers', 'Diapers in newborn and size 1', 'essential', 'before-baby', {
    note: 'Start modest and spread sizes; fit, skin, leaks, and growth can change quickly.',
  }),
  ck('diapering', 'size-one-diapers', 'Size 1 diapers', 'essential', 'before-baby', {
    note: 'A practical next size to have ready.',
    twins: { title: 'Diapers across sizes, not a newborn stockpile' },
  }),
  ck('diapering', 'diaper-trial', 'Diaper brand trial or small packs', 'try-first', 'before-baby', {
    note: 'Fit, skin, and leaks vary by baby.',
  }),
  ck('diapering', 'baby-wipes', 'Baby wipes', 'essential', 'before-baby', {
    note: 'Start with a gentle option and restock once you know what works.',
  }),
  ck('diapering', 'diaper-cream', 'Diaper cream or barrier ointment', 'essential', 'before-baby', {
    note: 'A basic tube belongs in the changing station from day one.',
  }),
  ck('diapering', 'changing-pad', 'Changing pad', 'essential', 'before-baby', {
    note: 'A wipeable pad on a secured dresser can replace a dedicated changing table; add covers or liners only if your surface needs them.',
  }),
  ck('diapering', 'changing-liners', 'Changing-pad covers or waterproof liners', 'nice-to-have', 'before-baby', {
    note: 'Helpful if your changing surface is not fully wipeable.',
  }),
  ck('diapering', 'portable-changing-mat', 'Portable changing mat', 'essential', 'before-baby', {
    note: 'Turns any outing surface into a workable changing spot; keep disposal bags with it if changes away from home are frequent.',
  }),
  ck('diapering', 'diaper-pail', 'Diaper pail and liners, if required', 'nice-to-have', 'before-baby', {
    note: 'Worth it where diapers happen most often.',
    recommendationId: 'diaper-pail-pick',
    twins: { title: '1 large-capacity diaper pail', label: 'SHARE' },
  }),
  ck('diapering', 'disposal-bags', 'Portable diaper disposal bags', 'nice-to-have', 'before-baby', {
    note: 'Small and useful for changes away from home.',
  }),
  ck('diapering', 'diaper-caddy', 'Diaper caddy or second caddy for multi-level homes', 'lifestyle-dependent', 'before-baby', {
    note: 'A supply bin per floor saves steps if your home needs it.',
  }),
  ck('diapering', 'wet-dry-bag', 'Wet/dry bag', 'nice-to-have', 'before-baby', {
    note: 'Separates the clean from the messy on laundry and outings.',
  }),

  // Bath
  ck('bath', 'bathtub', 'Baby bathtub', 'essential', 'before-baby', {
    note: 'Supports a slippery newborn until they can sit.',
    recommendationId: 'bathtub-pick',
    twins: { title: '1 baby bathtub', label: 'SHARE' },
  }),
  ck('bath', 'bath-stand', 'Bath stand', 'nice-to-have', 'before-baby', {
    note: 'Optional back-saver depending on where you bathe baby.',
  }),
  ck('bath', 'hooded-towels', 'Hooded towels + washcloths', 'essential', 'before-baby', {
    note: 'A few soft towels and washcloths cover baths and quick cleanups.',
    styleCollection: NURSERY_STYLE,
    twins: { title: '4-6 hooded towels', label: 'BUY 2' },
  }),
  ck('bath', 'washcloths', '6-8 washcloths', 'essential', 'before-baby', {
    note: 'Useful for baths and quick cleanups.',
  }),
  ck('bath', 'baby-wash', 'Gentle baby wash + shampoo', 'essential', 'before-baby', {
    note: 'One fragrance-free, tear-free bottle is enough.',
  }),
  ck('bath', 'baby-lotion', 'Fragrance-free moisturizer', 'nice-to-have', 'before-baby', {
    note: 'Simple skin care if baby needs it.',
  }),
  ck('bath', 'bath-thermometer', 'Rinsing cup or bath thermometer', 'nice-to-have', 'first-8-weeks', {
    note: 'Useful if it makes bath time calmer.',
  }),
  ck('bath', 'kneeler', 'Kneeler + elbow rest', 'wait', '6-12-months', {
    note: 'More useful once baths move to the big tub.',
  }),
  ck('bath', 'spout-cover', 'Spout cover and non-slip bath mat', 'wait', '6-12-months', {
    note: 'Later-stage big-tub safety, not a newborn need.',
  }),
  ck('bath', 'bath-toys-storage', 'Bath toys and draining storage', 'wait', '6-12-months', {
    note: 'Choose easy-to-clean toys once baby can actually play in the bath.',
  }),

  // Health + Grooming
  ck('health', 'thermometer', 'Digital infant thermometer', 'essential', 'before-baby', {
    note: 'One reliable thermometer belongs in the house before baby arrives.',
  }),
  ck('health', 'nasal-saline', 'Nasal aspirator + saline', 'essential', 'before-baby', {
    note: 'Basic congestion help for the first cold or stuffy night.',
  }),
  ck('health', 'nail-care', 'Nail file or baby nail clippers', 'essential', 'before-baby', {
    note: 'Tiny nails get sharp quickly.',
  }),
  ck('health', 'brush-comb', 'Soft baby brush or comb', 'nice-to-have', 'before-baby', {
    note: 'Simple grooming, especially for cradle-cap flakes or hair.',
  }),
  ck('health', 'oral-syringe', 'Medicine dispenser or oral syringe', 'nice-to-have', 'before-baby', {
    note: 'Good to have before you are trying to find one at night.',
  }),
  ck('health', 'first-aid-basics', 'Basic first-aid supplies', 'essential', 'before-baby', {
    note: 'Keep this practical and follow pediatric guidance for medications, sunscreen, and anything treatment-related.',
  }),
  ck('health', 'humidifier-care', 'Humidifier cleaning supplies, if using', 'lifestyle-dependent', 'before-baby', {
    note: 'A humidifier only helps if you can keep it clean.',
  }),
  ck('health', 'toothbrush-teethers', 'Baby toothbrush and teethers', 'wait', '3-6-months', {
    note: 'Later oral-care and teething items.',
  }),
  ck('health', 'sunscreen-guidance', 'Baby sunscreen plan', 'wait', '6-12-months', {
    note: 'Ask your pediatrician and follow age guidance before using sunscreen.',
  }),
  ck('health', 'health-tracker', 'Health-record or medication tracker', 'nice-to-have', 'first-8-weeks', {
    note: 'Useful when sleep deprivation makes details harder to remember.',
  }),

  // Getting Around
  ck('getting-around', 'rear-facing-car-seat', "A rear-facing car seat appropriate for baby's size and your vehicle", 'essential', 'before-baby', {
    note: 'This is the real day-one car-seat requirement; infant seats are one possible solution.',
    taylorsTake:
      'A rear-facing-only infant seat, a convertible seat, or an all-in-one may work for a newborn when used according to the manufacturer and installed correctly.',
    twins: { title: "2 rear-facing car seats appropriate for each baby's size and your vehicle", label: 'BUY 2' },
  }),
  ck('getting-around', 'infant-car-seat', 'Infant car seat', 'lifestyle-dependent', 'before-baby', {
    note: 'A click-in infant seat is a travel-system choice, not the only safe newborn option; confirm the included base fits your vehicle.',
    recommendationId: 'infant-car-seat-pick',
    twins: { title: '2 infant car seats, if using infant seats', label: 'BUY 2' },
  }),
  ck('getting-around', 'infant-seat-base', 'Included infant-seat base, if using an infant seat', 'lifestyle-dependent', 'before-baby', {
    note: 'Confirm the base fits your actual vehicle install.',
  }),
  ck('getting-around', 'extra-infant-base', 'Extra infant-seat base', 'nice-to-have', 'before-baby', {
    note: 'Useful for a second car, but not automatic.',
  }),
  ck('getting-around', 'convertible-car-seat', 'Convertible or all-in-one car seat', 'register-early', 'before-baby', {
    note: 'Smart to register early even if baby starts in an infant seat; register safety gear for recall notices after purchase.',
    recommendationId: 'britax-galaxy360',
    twins: { title: '2 convertible or all-in-one car seats', label: 'BUY 2' },
  }),
  ck('getting-around', 'car-seat-registration', 'Car-seat registration completed', 'essential', 'before-baby', {
    note: 'Register seats for recall notices.',
  }),
  ck('getting-around', 'cpst-install-check', 'CPST installation check', 'register-early', 'before-baby', {
    note: 'A certified passenger safety tech can check both the seat and your install.',
    twins: { title: 'CPST installation check for both seats' },
  }),
  ck('getting-around', 'primary-stroller', 'Primary stroller', 'lifestyle-dependent', 'before-baby', {
    note: 'Buy for your real home: trunk, stairs, sidewalks, doorways, and storage.',
    recommendationIds: ['primary-stroller-pick', 'nuna-demi-icon'],
    twins: {
      title: 'Double stroller selected for your actual routine',
      note: 'One frame that carries two beats two separate strollers for most twin families.',
    },
  }),
  ck('getting-around', 'car-seat-adapters', 'Stroller car-seat adapters, if required', 'essential', 'before-baby', {
    note: 'The often-forgotten piece that makes a stroller + infant seat work together.',
  }),
  ck('getting-around', 'stroller-bassinet', 'Stroller bassinet', 'lifestyle-dependent', 'before-baby', {
    note: 'Useful if you plan long newborn walks and your stroller supports it.',
  }),
  ck('getting-around', 'stroller-weather-accessories', 'Stroller rain cover, insect net, or fan', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Buy for your climate and stroller setup, not for a generic list. Parent organizers, cup holders, and snack trays can wait.',
  }),
  ck('getting-around', 'parent-organizer-cup-holder', 'Parent organizer or cup holder', 'nice-to-have', 'first-8-weeks', {
    note: 'A convenience add-on if your stroller handle setup needs it.',
  }),
  ck('getting-around', 'child-snack-tray', 'Child snack tray', 'wait', '6-12-months', {
    note: 'Not relevant until snacks and seated stroller time become real.',
  }),
  ck('getting-around', 'sibling-stroller-kit', 'Ride-on board, second seat, or sibling kit', 'lifestyle-dependent', '6-12-months', {
    note: 'Only for older siblings, twins, or planned stroller expansion.',
  }),
  ck('getting-around', 'travel-system-stroller', 'Compact travel stroller', 'lifestyle-dependent', '6-12-months', {
    note: 'A second stroller can be useful, but usually later.',
    recommendationId: 'travel-stroller-pick',
  }),
  ck('getting-around', 'carrier', 'Structured baby carrier', 'try-first', 'before-baby', {
    note: 'Comfort for the wearer is what keeps a carrier in use.',
    recommendationId: 'baby-carrier-pick',
    twins: { title: '1-2 structured carriers depending on caregivers', label: '1-2' },
  }),
  ck('getting-around', 'soft-wrap-carrier', 'Soft wrap or newborn carrier', 'try-first', 'before-baby', {
    note: 'Some parents love wraps; some prefer buckles. Try before buying multiples.',
  }),

  // Diaper Bag
  ck('diaper-bag', 'diaper-bag-backpack', 'Diaper bag or backpack', 'essential', 'before-baby', {
    note: 'Choose one that fits your stroller, car, and daily carrying style; internal pouches are optional, not a separate project.',
  }),
  ck('diaper-bag', 'diaper-bag-changing-kit', 'Compact outing changing kit', 'essential', 'before-baby', {
    note: 'Changing mat, a few diapers, wipes, cream, disposal bag, and one baby outfit change.',
  }),
  ck('diaper-bag', 'small-diaper-pouch', 'Small diaper pouch', 'nice-to-have', 'before-baby', {
    note: 'Keeps the change setup easy to move between bags.',
  }),
  ck('diaper-bag', 'travel-wipes-disposal', 'Travel wipe case and disposal bags', 'nice-to-have', 'before-baby', {
    note: 'Small refills for changes away from home.',
  }),
  ck('diaper-bag', 'baby-change-clothes', 'Change of clothes for baby', 'essential', 'before-baby', {
    note: 'The outing item you will be happiest to have packed.',
  }),
  ck('diaper-bag', 'parent-spare-shirt', 'Spare shirt for parent', 'nice-to-have', 'first-8-weeks', {
    note: 'For spit-up days when baby is not the only one who needs changing.',
  }),
  ck('diaper-bag', 'feeding-pacifier-kit', 'Feeding supplies and pacifier case as needed', 'lifestyle-dependent', 'before-baby', {
    note: 'Pack based on how baby actually eats and soothes; add sanitizer or a tiny first-aid pouch only if it earns space.',
  }),
  ck('diaper-bag', 'adult-sanitizer-firstaid', 'Hand sanitizer and small first-aid pouch', 'nice-to-have', 'before-baby', {
    note: 'Adult sanitizer and basic outing supplies, kept simple.',
  }),

  // Clothing
  ck('clothing', 'bodysuits', '6-8 everyday bodysuits', 'essential', 'before-baby', {
    note: 'Spread sizes instead of buying one huge newborn stack.',
    styleCollection: CLOTHING_STYLE,
    twins: { title: '10-14 everyday bodysuits total', label: 'BUY 2' },
  }),
  ck('clothing', 'sleepers', '6-8 zip sleepers', 'essential', 'before-baby', {
    note: 'Zippers beat snaps at 3am.',
    styleCollection: CLOTHING_STYLE,
    twins: { title: '10-14 zip sleepers total', label: 'BUY 2' },
  }),
  ck('clothing', 'easy-outfits', '2-3 easy outfits', 'nice-to-have', 'before-baby', {
    note: 'A few simple going-out or photo-ready pieces; newborns mostly live in bodysuits and sleepers.',
    styleCollection: CLOTHING_STYLE,
  }),
  ck('clothing', 'socks-booties', 'Socks or booties', 'essential', 'before-baby', {
    note: 'Buy one simple style so the survivors match.',
  }),
  ck('clothing', 'seasonal-layers', 'Seasonal layers', 'lifestyle-dependent', 'before-baby', {
    note: 'Buy for the season baby will actually be that size; socks, booties, hats, and outerwear should match the weather, not the registry algorithm.',
  }),
  ck('clothing', 'muslin-blankets', '2-3 lightweight muslin blankets', 'essential', 'before-baby', {
    note: 'Useful for swaddling, stroller shade, and floor time; not for crib sleep.',
    styleCollection: NURSERY_STYLE,
    twins: { title: '4-6 lightweight muslin blankets', label: 'BUY 2' },
  }),
  ck('clothing', 'laundry-care', 'Fragrance-free detergent and gentle stain remover', 'essential', 'before-baby', {
    note: 'Simple laundry basics for sensitive newborn skin and inevitable stains.',
  }),
  ck('clothing', 'special-outfit', 'Special occasion or coming-home outfit', 'nice-to-have', 'before-baby', {
    note: 'Keep it comfortable and weather-appropriate.',
  }),

  // Play + Development
  ck('play', 'play-mat', 'Large floor or play mat', 'essential', 'first-8-weeks', {
    note: 'A safe, flat place for tummy time and floor play.',
    styleCollection: NURSERY_STYLE,
    twins: { title: 'Large play mat with room for two' },
  }),
  ck('play', 'activity-gym', 'Activity gym', 'nice-to-have', 'first-8-weeks', {
    note: 'Useful, but a simple mat and a few toys can also work.',
  }),
  ck('play', 'high-contrast-cards', 'Newborn sensory toys', 'nice-to-have', 'first-8-weeks', {
    note: 'A few high-contrast cards, a mirror, or a soft crinkle toy are plenty for early floor time.',
  }),
  ck('play', 'tummy-time-mirror', 'Tummy-time mirror', 'nice-to-have', 'first-8-weeks', {
    note: 'A simple motivator for early floor time.',
  }),
  ck('play', 'rattles-crinkle-toy', 'Soft rattles or crinkle toy', 'nice-to-have', 'first-8-weeks', {
    note: 'A few simple objects are plenty.',
  }),
  ck('play', 'board-books', 'Board books', 'register-early', 'first-8-weeks', {
    note: 'Books last long past the newborn stage.',
  }),
  ck('play', 'teethers', 'Teethers', 'wait', '3-6-months', {
    note: 'Add them before teething hits; do not fill a newborn drawer with them.',
  }),
  ck('play', 'grasping-stacking-sensory', 'Grasping toys, stacking cups, or sensory balls', 'wait', '3-6-months', {
    note: 'Better once baby is reaching and mouthing.',
  }),
  ck('play', 'activity-center', 'Stationary activity center', 'wait', '6-12-months', {
    note: 'A later awake-time item, not a newborn essential.',
  }),
  ck('play', 'push-walker', 'Push walker, shape sorter, or toy basket', 'wait', 'later', {
    note: 'Later mobility and toddler-stage items can wait.',
  }),

  // Awake-Time Gear
  ck('awake-time', 'awake-seat', 'One bouncer or safe awake-time seat', 'nice-to-have', 'before-baby', {
    note: 'For supervised awake time only; move baby to a firm, flat sleep surface if they fall asleep.',
    twins: { title: '1-2 awake-time seats based on actual need', label: '1-2' },
  }),
  ck('awake-time', 'swing', 'Swing', 'try-first', 'first-8-weeks', {
    note: 'Some babies love them; some do not. Supervised awake time only.',
  }),
  ck('awake-time', 'portable-bouncer', 'Portable bouncer', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Only if moving an awake-time seat around the house matters.',
  }),
  ck('awake-time', 'contained-play-space', 'Playard or activity center as contained play space', 'wait', '6-12-months', {
    note: 'A later-stage contained spot once baby is more mobile.',
  }),

  // Travel
  ck('travel', 'travel-crib-plan', 'Travel crib or playard', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Use only approved sleep products for sleep away from home; bring the fitted sheet made for that model.',
    recommendationId: 'playard-pick',
  }),
  ck('travel', 'travel-crib-sheet', 'Travel crib sheet', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Only the sheet sized for your travel crib or playard.',
  }),
  ck('travel', 'compact-travel-stroller', 'Compact or travel stroller', 'lifestyle-dependent', '6-12-months', {
    note: 'A second stroller should solve a real travel or trunk problem.',
    recommendationId: 'travel-stroller-pick',
  }),
  ck('travel', 'stroller-car-seat-travel-bags', 'Stroller or car-seat travel bag', 'nice-to-have', '6-12-months', {
    note: 'Useful for flights or checking gear.',
  }),
  ck('travel', 'travel-sleep-kit', 'Travel sound, blackout, and monitor kit', 'nice-to-have', 'first-8-weeks', {
    note: 'Build this only if travel or overnight visits are likely.',
  }),
  ck('travel', 'travel-feeding-kit', 'Travel bottle drying or portable warmer setup', 'lifestyle-dependent', 'first-8-weeks', {
    note: 'Only if feeding away from home is part of the routine.',
  }),
  ck('travel', 'portable-changing-kit', 'Portable changing kit', 'essential', 'before-baby', {
    note: 'The outing essential: mat, diapers, wipes, cream, and bags.',
  }),
  ck('travel', 'gear-rental-plan', 'Rental plan for bulky destination gear', 'nice-to-have', '6-12-months', {
    note: 'You do not need to own everything you can rent at your destination.',
  }),

  // Home + Safety
  ck('home-safety', 'smoke-co-detectors', 'Working smoke and carbon-monoxide detectors', 'essential', 'before-baby', {
    note: 'Confirm alarms are present, working, and placed appropriately.',
  }),
  ck('home-safety', 'furniture-tv-anchoring', 'Furniture and TV anchoring', 'register-early', '3-6-months', {
    note: 'Plan before baby pulls to stand.',
  }),
  ck('home-safety', 'outlet-covers', 'Outlet covers', 'wait', '6-12-months', {
    note: 'Babyproofing for the mobile stage.',
  }),
  ck('home-safety', 'cabinet-latches', 'Cabinet, drawer, outlet, and room-specific babyproofing', 'wait', '6-12-months', {
    note: 'Install where baby can reach hazards; doors, toilets, stove knobs, and appliance locks depend on your actual home.',
  }),
  ck('home-safety', 'baby-gates', 'Baby gates and stair gates', 'wait', '6-12-months', {
    note: 'Match gates to the actual openings and stairs in your home.',
  }),
  ck('home-safety', 'window-cord-safety', 'Cordless window coverings or blind-cord safety', 'register-early', '3-6-months', {
    note: 'Address cords before baby is mobile; add window guards or stops only where accessible windows create a real risk.',
  }),
  ck('home-safety', 'window-guards-stops', 'Window guards or stops where appropriate', 'wait', '6-12-months', {
    note: 'Home-specific safety for accessible windows.',
  }),
  ck('home-safety', 'door-toilet-stove-safety', 'Door, toilet, stove, and appliance safety solutions', 'wait', '6-12-months', {
    note: 'Buy for the hazards your home actually has.',
  }),
  ck('home-safety', 'pool-safety-review', 'Pool safety review, where applicable', 'lifestyle-dependent', 'before-baby', {
    note: 'A true essential if a pool is part of the home or regular care environment.',
  }),

  // Postpartum
  ck('postpartum', 'postpartum-underwear-pads', 'Postpartum recovery basics', 'essential', 'before-baby', {
    note: 'Parent recovery belongs on the registry too: comfortable underwear, pads, peri bottle, and cold packs if they fit your care plan.',
  }),
  ck('postpartum', 'peri-bottle-cold-packs', 'Peri bottle and cold packs', 'nice-to-have', 'before-baby', {
    note: 'General comfort supplies; follow your clinician for specific recovery needs.',
  }),
  ck('postpartum', 'lounge-clothes', 'Comfortable lounge clothes or pajamas', 'nice-to-have', 'before-baby', {
    note: 'Soft, washable, and easy for feeding if needed.',
  }),
  ck('postpartum', 'nursing-pumping-bras', 'Nursing or pumping bras, if needed', 'nice-to-have', 'before-baby', {
    note: 'Start with a few until sizing and feeding plans settle.',
  }),
  ck('postpartum', 'feeding-comfort', 'Breast pads and nipple care, if needed', 'nice-to-have', 'before-baby', {
    note: 'Comfort basics for breastfeeding or pumping.',
  }),
  ck('postpartum', 'parent-station', 'Large water bottle, snacks, and long charging cable', 'nice-to-have', 'before-baby', {
    note: 'A practical bedside or feeding-station setup for the parent.',
  }),
  ck('postpartum', 'c-section-recovery-support', 'C-section recovery support, if relevant', 'lifestyle-dependent', 'before-baby', {
    note: 'Keep this personal and clinician-guided.',
  }),

  // Support + Services
  ck('support', 'pediatrician-selected', 'Pediatrician selected', 'essential', 'before-baby', {
    note: 'Choose before baby arrives so the first visit is not a scramble.',
  }),
  ck('support', 'lactation-support-contact', 'Lactation support contact, if desired', 'lifestyle-dependent', 'before-baby', {
    note: 'Line up help before you need it during a hard feeding night.',
  }),
  ck('support', 'postpartum-doula-support', 'Postpartum doula or newborn-care support', 'lifestyle-dependent', 'before-baby', {
    note: 'Support hours can be more useful than another object.',
    twins: { title: 'Postpartum or newborn-care support for two babies' },
  }),
  ck('support', 'meal-household-support', 'Meal train, meal delivery, or cleaning support', 'nice-to-have', 'before-baby', {
    note: 'Fed and rested parents are the point.',
  }),
  ck('support', 'family-pet-night-help', 'Pet, babysitting, family-help, or night-support plan', 'lifestyle-dependent', 'before-baby', {
    note: 'Plan the help your actual household needs.',
  }),
  ck('support', 'newborn-photo-keepsake', 'Newborn photography, announcement, or keepsake plan', 'nice-to-have', 'before-baby', {
    note: 'Book early if the short newborn-photo window matters to you.',
  }),

  // Registry Strategy
  ck('registry-strategy', 'choose-primary-registry', 'Registry platform strategy', 'essential', 'before-baby', {
    note: 'Choose one main home for gifts and returns; add secondary registries only when the perks, unique items, or welcome boxes are worth the extra maintenance.',
  }),
  ck('registry-strategy', 'secondary-registries-value', 'Create secondary registries only for real value', 'nice-to-have', 'before-baby', {
    note: 'Use extras for welcome boxes, retailer perks, or unique items, not clutter.',
  }),
  ck('registry-strategy', 'welcome-boxes', 'Claim eligible welcome boxes', 'nice-to-have', 'before-baby', {
    note: 'Free samples and occasional useful basics for a few minutes of setup.',
  }),
  ck('registry-strategy', 'completion-discount-plan', 'Check completion-discount rules and dates', 'essential', 'before-baby', {
    note: 'Plan the discount window before buying remaining big items; compare rewards, cashback, and sale timing for the expensive gear.',
    twins: { title: 'Registry completion-discount strategy' },
  }),
  ck('registry-strategy', 'later-stage-discount-items', 'Add later-stage items before the discount closes', 'register-early', 'before-baby', {
    note: 'High chairs, convertible seats, and later gear can be smart registry math.',
  }),
  ck('registry-strategy', 'rewards-cashback-sales', 'Compare retailer rewards, cashback, and sale periods', 'nice-to-have', 'before-baby', {
    note: 'A little timing can save real money on major gear.',
  }),
  ck('registry-strategy', 'insurance-hsa-fsa', 'Check insurance and HSA/FSA eligibility', 'essential', 'before-baby', {
    note: 'Especially for pumps and eligible health or recovery supplies.',
  }),
  ck('registry-strategy', 'group-gifting-service-cash', 'Create group-gifting, service, or cash-fund options', 'nice-to-have', 'before-baby', {
    note: 'Let people help with the expensive or practical things.',
  }),
  ck('registry-strategy', 'openbox-secondhand-rental', 'Check open-box, secondhand, and rental opportunities', 'nice-to-have', 'before-baby', {
    note: 'Buy new when safety or recalls matter; save where secondhand or rental makes sense.',
  }),
  ck('registry-strategy', 'register-gear-recalls', 'Product registration, warranties, and receipts', 'essential', 'before-baby', {
    note: 'Register safety gear for recalls, keep warranty details, and save packaging on uncertain later-stage items.',
  }),
  ck('registry-strategy', 'returns-packaging', 'Save receipts and keep packaging on uncertain items', 'nice-to-have', 'before-baby', {
    note: 'Do not open later-stage gear simply because it arrived.',
  }),
  ck('registry-strategy', 'first-eight-weeks-plan', 'Build around the first 8 weeks first', 'essential', 'before-baby', {
    note: 'Everything else can be registered early, waited on, or skipped.',
  }),
];

// ── Helpers ────────────────────────────────────────────────────────────────

export type ResolvedItem = {
  id: string;
  /** Category id — a static CategoryId or an admin-created category's id. */
  category: string;
  title: string;
  note?: string;
  timing?: ChecklistTiming;
  timingLabel?: string;
  take?: ChecklistTake;
  takeLabel?: string;
  badge?: string;
  /** Twins quantity pill, e.g. "BUY 2" — only present on the twins version. */
  label?: string;
  recommendationId?: string;
  recommendationIds?: string[];
  taylorsTake?: string;
  styleSuggestions?: string[];
};

/** Apply the correct version's overrides to a raw item. */
export function resolveItem(item: ChecklistItem, type: ChecklistType): ResolvedItem {
  const isTwins = type === 'twins';
  const t = item.twins;
  const timing = isTwins && t?.timing !== undefined ? t.timing : item.timing;
  const take = isTwins && t?.take !== undefined ? t.take : item.take;
  return {
    id: item.id,
    category: item.category,
    title: isTwins && t?.title ? t.title : item.title,
    note: isTwins && t?.note !== undefined ? t.note : item.note,
    timing,
    timingLabel: timing ? CHECKLIST_TIMING_LABELS[timing] : undefined,
    take,
    takeLabel: take ? CHECKLIST_TAKE_LABELS[take] : undefined,
    badge: isTwins && t?.badge !== undefined ? t.badge : item.badge,
    label: isTwins ? t?.label : undefined,
    recommendationId: item.recommendationId,
    recommendationIds: item.recommendationIds,
    taylorsTake: isTwins && t?.taylorsTake ? t.taylorsTake : item.taylorsTake,
    styleSuggestions:
      !isTwins && item.styleCollection && type in item.styleCollection
        ? item.styleCollection[type as 'girl' | 'boy' | 'neutral']
        : undefined,
  };
}

/**
 * All items that belong to a given version, in order. `source` defaults to the
 * static items; the public tool passes the merged (static + admin-created) list.
 */
export function itemsForType(
  type: ChecklistType,
  source: ChecklistItem[] = checklistItems,
): ChecklistItem[] {
  return source.filter((i) => isPublicChecklistItem(i) && (!i.include || i.include.includes(type)));
}

export function itemMatchesChecklistFilters(
  item: { timing?: ChecklistTiming; take?: ChecklistTake },
  timingFilter: ChecklistTimingFilter,
  takeFilter: ChecklistTakeFilter,
): boolean {
  const timingMatches = timingFilter === 'all' || item.timing === timingFilter;
  const takeMatches = takeFilter === 'all' || item.take === takeFilter;
  return timingMatches && takeMatches;
}

/**
 * Resolved items grouped by category, in category order, for a version. `source`
 * and `cats` default to the static content; the public tool passes the merged
 * (static + admin-created) items and categories.
 */
export function groupedItemsForType(
  type: ChecklistType,
  source: ChecklistItem[] = checklistItems,
  cats: { id: string; title: string }[] = categories,
): { category: { id: string; title: string }; items: ResolvedItem[] }[] {
  const items = itemsForType(type, source).map((i) => resolveItem(i, type));
  return cats
    .map((category) => ({
      category,
      items: items.filter((i) => i.category === category.id),
    }))
    .filter((group) => group.items.length > 0);
}
