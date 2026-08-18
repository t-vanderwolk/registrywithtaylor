/**
 * Centralized product / affiliate-link data for the Baby Checklist.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD OR UPDATE AN AFFILIATE LINK (for Taylor)
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Find the product below by its `id`.
 *  2. Paste the real affiliate URL into `affiliateUrl` (replace
 *     `AFFILIATE_LINK_NEEDED`). Optionally add a `secondaryUrl` (e.g. a second
 *     retailer) and set `retailer` / `secondaryRetailer`.
 *  3. Save. The link updates everywhere that product is recommended — you never
 *     edit the checklist UI or paste a URL twice.
 *
 *  While `affiliateUrl` is still `AFFILIATE_LINK_NEEDED`, the editorial
 *  recommendation still shows, but NO shopping button renders (so there are
 *  never dead or placeholder links in front of a parent).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Sentinel — a recommendation with this URL renders its editorial copy but no CTA. */
export const AFFILIATE_LINK_NEEDED = 'AFFILIATE_LINK_NEEDED' as const;

// Impact-tracked Babylist affiliate wrapper — mirrors babylistShopLink in
// lib/travelSystemAffiliateLinks.ts (same tracker base + partner id), inlined
// here so the checklist bundle stays tiny. To wire a pick from your Babylist
// catalogue, paste the product's plain babylist.com URL:
//   affiliateUrl: babylist('https://www.babylist.com/gp/<slug>/<id>/<variant>')
// Get the URL on babylist.com → hover "Add to registry" → it contains /gp/… .
const BABYLIST_TRACKER = 'https://babylist.pxf.io/c/6560395/1056628/13580';
const BABYLIST_PARTNER = '7490466';
export const babylist = (destUrl: string): string =>
  `${BABYLIST_TRACKER}?u=${encodeURIComponent(destUrl)}&partnerpropertyid=${BABYLIST_PARTNER}`;

export type ChecklistProduct = {
  id: string;
  brand: string;
  product: string;
  /** 1–2 sentence editorial recommendation, in Taylor's advisor voice. */
  review: string;
  bestFor: string;
  standout: string;
  affiliateUrl: string;
  /** Optional exact Amazon affiliate link. When absent, an Amazon-allowed brand
   *  still gets a "Shop Amazon" button via a tagged Amazon search fallback. */
  amazonUrl?: string;
  /** Optional price. Shown as $X / $X.XX when set (paste from your Babylist data). */
  price?: number;
  priceSource?: string;
  secondaryUrl?: string;
  retailer?: string;
  secondaryRetailer?: string;
  imageUrl?: string;
  badge?: string;
  /** false = no affiliate relationship on this pick (kept for future use). */
  disclosure?: boolean;
};

/**
 * Keyed by product id. Checklist items reference these by `recommendationId`
 * rather than duplicating the object — one source of truth per pick.
 */
export const products: Record<string, ChecklistProduct> = {
  'britax-galaxy360': {
    id: 'britax-galaxy360',
    brand: 'Britax',
    product: 'Galaxy360',
    review:
      'A convertible seat that spins to load, so you are not folding yourself into the back seat every day. It carries a child from birth through the years you actually keep a convertible.',
    bestFor: 'Parents who want one seat that lasts and a genuinely easier daily buckle.',
    standout: '360° rotation and a wide, forgiving install.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'infant-car-seat-pick': {
    id: 'infant-car-seat-pick',
    brand: 'Nuna',
    product: 'PIPA RX',
    review:
      'A light infant seat that clicks in and out of the base and most stroller frames with an adapter. The weight matters more than any spec once you are the one carrying it.',
    bestFor: 'Parents who want a true click-and-go travel system in the first months.',
    standout: 'Low carry weight and a simple, confident install.',
    // Wired from your Babylist catalogue (confirmed deep link).
    affiliateUrl: babylist('https://www.babylist.com/gp/nuna-pipa-rx/16140/310275'),
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'primary-stroller-pick': {
    id: 'primary-stroller-pick',
    brand: 'UPPAbaby',
    product: 'Vista V2',
    review:
      'The stroller most families keep for years. It takes a bassinet, a toddler seat, and — with the right piece — a second child, so it grows instead of getting replaced.',
    bestFor: 'One-car, city, or suburban families who want a single frame to grow into.',
    standout: 'Expandable to two seats without buying a new stroller.',
    // Wired from your Babylist catalogue (UPPAbaby strollers — refine to the exact Vista deep link when handy).
    affiliateUrl: babylist('https://www.babylist.com/store/strollers?brand=uppababy'),
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'travel-stroller-pick': {
    id: 'travel-stroller-pick',
    brand: 'Babyzen',
    product: 'YOYO2',
    review:
      'Folds small enough for an overhead bin and opens one-handed. A second, lighter stroller earns its keep the first time you travel or tackle a tight trunk.',
    bestFor: 'Travel, transit, and quick errands once baby has head control.',
    standout: 'Carry-on fold in a genuinely usable everyday stroller.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: 'Travel Favorite',
    disclosure: true,
  },
  'double-stroller-pick': {
    id: 'double-stroller-pick',
    brand: 'UPPAbaby',
    product: 'Vista V2 (with RumbleSeat)',
    review:
      'For twins, one frame that takes two bassinets or two seats keeps your footprint sane. Choose the double configuration around how you actually move through doorways and sidewalks.',
    bestFor: 'Twin families who want one frame instead of two separate strollers.',
    standout: 'True two-seat flexibility from a single chassis.',
    // Wired from your Babylist catalogue (UPPAbaby strollers).
    affiliateUrl: babylist('https://www.babylist.com/store/strollers?brand=uppababy'),
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'baby-carrier-pick': {
    id: 'baby-carrier-pick',
    brand: 'Ergobaby',
    product: 'Omni 360',
    review:
      'An adjustable carrier that works from newborn without an insert and adapts across caregivers of different sizes. Comfort for the wearer is what keeps a carrier in use.',
    bestFor: 'Hands-free days, contact naps, and sharing between two adults.',
    standout: 'Newborn-ready with a supportive, shareable fit.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'monitor-pick': {
    id: 'monitor-pick',
    brand: 'Nanit',
    product: 'Pro Camera',
    review:
      'A clear overhead view and reliable app. For one baby it is plenty; for twins, choose a system that supports two cameras on one account rather than two separate apps.',
    bestFor: 'Parents who want a dependable video view without a wall of gadgets.',
    standout: 'Two-camera capability on a single system.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'audio-monitor-pick': {
    id: 'audio-monitor-pick',
    brand: 'VTech',
    product: 'Audio Monitor',
    review:
      'Sometimes you just want sound, long battery, and nothing to charge or log into. A simple audio monitor is an honest, low-stress backup or primary.',
    bestFor: 'Small homes, light sleepers, and anyone who wants less screen.',
    standout: 'Reliable, distraction-free, inexpensive.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
  },
  'bathtub-pick': {
    id: 'bathtub-pick',
    brand: 'Puj / Angelcare',
    product: 'Infant Tub',
    review:
      'A tub that supports a newborn and drains easily beats anything elaborate. For twins, one tub is fine — you are bathing one baby at a time regardless.',
    bestFor: 'First baths through the sitting-up stage.',
    standout: 'Simple support, easy to clean and store.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'high-chair-pick': {
    id: 'high-chair-pick',
    brand: 'Stokke',
    product: 'Tripp Trapp',
    review:
      'A chair that adjusts to the table and grows with the child, so it does not get outgrown in a year. You will not need it until around six months — register early, buy later.',
    bestFor: 'Families who want one chair for the long haul.',
    standout: 'Adjusts from baby to big-kid seating.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'bottle-trial-pick': {
    id: 'bottle-trial-pick',
    brand: 'Mixed',
    product: 'Bottle Trial Pack',
    review:
      'Babies are opinionated about bottles. Start with a small variety pack and let your baby tell you the winner before you commit to eight of anything.',
    bestFor: 'Every feeding plan — breast, bottle, or both.',
    standout: 'Cheap insurance against a full set your baby rejects.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: 'Try First',
  },
  'breast-pump-pick': {
    id: 'breast-pump-pick',
    brand: 'Spectra',
    product: 'S1 Plus',
    review:
      'A workhorse pump that many parents can get through insurance — check that first. Comfort and reliable suction beat novelty every time.',
    bestFor: 'Anyone planning to pump regularly.',
    standout: 'Hospital-strength performance; often insurance-covered.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
  },
  'diaper-pail-pick': {
    id: 'diaper-pail-pick',
    brand: 'Ubbi',
    product: 'Steel Diaper Pail',
    review:
      'Steel seals odor better than plastic and takes regular trash bags, so you are not locked into a refill subscription. One good pail serves twins fine.',
    bestFor: 'Nurseries where smell control actually matters.',
    standout: 'No proprietary refills; genuinely contains odor.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'playard-pick': {
    id: 'playard-pick',
    brand: 'Guava / BabyBjörn',
    product: 'Travel Crib',
    review:
      'A light travel crib doubles as a safe sleep space at grandma’s and a contained spot at home. Look for a one-piece setup you will actually use.',
    bestFor: 'Travel, visits, and a second safe sleep space.',
    standout: 'Fast setup, packs down small.',
    affiliateUrl: AFFILIATE_LINK_NEEDED,
    retailer: 'Babylist',
    badge: 'Space Saver',
  },
  'davinci-dylan-mini-crib': {
    id: 'davinci-dylan-mini-crib',
    brand: 'DaVinci',
    product: 'Dylan Folding Portable 3-in-1 Mini Crib',
    review:
      'A folding mini crib that tucks away when you need the floor space back and converts to a twin bed down the road. A smart pick for small rooms, guest rooms, or grandparents.',
    bestFor: 'Small spaces and anyone who wants a crib that folds flat and grows up.',
    standout: 'Folds flat, rolls away, and converts to a toddler/twin bed.',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fdavinci-dylan-folding-portable-3-in-1-mini-crib%2F32116%2F1322545&partnerpropertyid=7490466',
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'stokke-sleepi-crib': {
    id: 'stokke-sleepi-crib',
    brand: 'Stokke',
    product: 'Sleepi 3-in-1 Convertible Crib (with mattresses + extension kit)',
    review:
      'An oval convertible crib that starts small and expands as your baby grows — the mattresses and extension kit are included here, so it lasts from newborn through the toddler years.',
    bestFor: 'Families who want one beautiful crib that grows from newborn to toddler.',
    standout: 'Oval-to-bed system with the extension kit included.',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fstokke-sleepi3-in-1-convertible-crib-with-mattresses-and-extension-kit%2F77231%2F2666164&partnerpropertyid=7490466',
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
  'nuna-demi-icon': {
    id: 'nuna-demi-icon',
    brand: 'Nuna',
    product: 'DEMI Icon',
    review:
      'A premium full-size stroller that takes a bassinet, toddler seat, and infant seat — a true grow-with-you frame with a smooth ride and a compact one-piece fold.',
    bestFor: 'Parents who want one high-end frame that adapts from newborn onward.',
    standout: 'Modular from day one, with a refined, sturdy ride.',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-demi-icon%2F81555%2F3142525&partnerpropertyid=7490466',
    imageUrl:
      'https://www.macrobaby.com/cdn/shop/files/nuna-demi-icon-stroller-caviar_image_1_1000x.jpg?v=1774841535',
    retailer: 'Babylist',
    badge: "Taylor's Pick",
    disclosure: true,
  },
};

export function getProduct(id: string | undefined): ChecklistProduct | undefined {
  if (!id) return undefined;
  return products[id];
}

/** True when a real affiliate URL has been pasted in (so a CTA should render). */
export function hasLiveLink(product: ChecklistProduct | undefined): boolean {
  return Boolean(product && product.affiliateUrl && product.affiliateUrl !== AFFILIATE_LINK_NEEDED);
}
