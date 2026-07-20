/**
 * Research-backed stroller specs, brand by brand (alphabetical).
 *
 * Each entry is matched against a catalog stroller by brand + a model regex, and
 * feeds BOTH the Stroller Quiz (price/fold/lifestyle/weights/from-birth/jogging)
 * and the Compare tool (modular / fits-overhead-bin / basket weight limit).
 *
 * Every field is optional: we only write what a manufacturer actually publishes,
 * so nothing here is invented. Unset fields keep whatever is already in the DB
 * (and Compare falls back to its category bucket).
 *
 * `basketCapacityLbs` is the basket WEIGHT limit in lbs — what brands publish —
 * not a volume.
 *
 * Sources are noted per brand; figures verified July 2026.
 */

export type StrollerSpecSeed = {
  /** Tested against the accent-stripped, lowercased model string. */
  match: RegExp;
  summary?: string;
  priceRange?: 'budget' | 'mid' | 'premium' | 'luxury';
  foldType?: 'one-hand' | 'compact' | 'standard';
  lifestyle?: string[];
  maxWeightLbs?: number; // per child
  ownWeightLbs?: number;
  budgetMin?: number;
  budgetMax?: number;
  isExpandable?: boolean;
  suitableFromBirth?: boolean;
  suitableForJogging?: boolean;
  modular?: boolean;
  fitsOverheadBin?: boolean;
  basketCapacityLbs?: number;
};

/** Accent-safe normalisation, so "Bēbee" matches /bebee/. */
export const normalizeModel = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Brand key → ordered seeds (most-specific model regex first; first match wins). */
export const STROLLER_SPEC_SEEDS: Record<string, StrollerSpecSeed[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // BABY JOGGER — babyjogger.com spec sheets + help centre.
  // Basket weight limits: 10 lb across the City line, 15 lb on City Select 2.
  // ─────────────────────────────────────────────────────────────────────────
  'Baby Jogger': [
    {
      match: /city mini gt2 double/,
      summary:
        'The all-terrain City Mini GT2 in a side-by-side double — forever-air tires, all-wheel suspension, one-hand fold, 65 lb per seat. A go-anywhere everyday double (not for jogging).',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
      maxWeightLbs: 65, ownWeightLbs: 30.6, budgetMin: 550, budgetMax: 650,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city mini gt2/,
      summary:
        'Baby Jogger’s all-terrain everyday hero: never-flat forever-air tires, all-wheel suspension, signature one-hand fold, 65 lb limit. Handles curbs, gravel and grass — but it is not a running stroller.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
      maxWeightLbs: 65, ownWeightLbs: 21.4, budgetMin: 380, budgetMax: 450,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city mini gt3/,
      summary:
        'The newest all-terrain City Mini: forever-air rubber tires and all-wheel suspension for streets and trails, one-hand fold, from birth (with an infant seat) to 65 lb. An everyday all-terrain, not a jogger.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
      maxWeightLbs: 65, ownWeightLbs: 21.8, budgetMin: 400, budgetMax: 480,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city mini double/,
      summary:
        'The everyday City Mini as a fits-through-doorways double — signature one-hand fold, near-flat recline from birth, 50 lb per seat. Light and nimble for two.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 28, budgetMin: 430, budgetMax: 520,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city mini air/,
      summary:
        'The City Mini with air-filled tires for a smoother roll — signature one-hand fold, near-flat recline from birth, 50 lb limit. Everyday city comfort.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 20.5, budgetMin: 280, budgetMax: 360,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city mini 2/,
      summary:
        'The everyday classic: 19.3 lb, signature one-hand fold with auto-lock, near-flat recline from birth, 50 lb limit and a 10 lb under-seat basket. City-friendly and easy to live with.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 19.3, budgetMin: 300, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /city tour 2 double/,
      summary:
        'The ultra-compact travel double — lightweight, easy compact fold, near-flat recline from birth, 45 lb per seat. Great for trips, though a double is too big for the overhead bin.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 45, ownWeightLbs: 23, budgetMin: 450, budgetMax: 550,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /city tour 2/,
      summary:
        'Baby Jogger’s carry-on travel stroller: just 14 lb, folds 85% smaller into a compact cube, near-flat recline from birth, 45 lb limit. Marketed as carry-on approved — confirm your airline’s bin.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 45, ownWeightLbs: 14, budgetMin: 250, budgetMax: 320,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /city select 2/,
      summary:
        'The single-to-double modular workhorse: 24 configurations, second seat included, bassinet-ready from birth, 45 lb per seat and a big 15 lb basket. Grows from one kid to three (with a glider board).',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 45, ownWeightLbs: 26.4, budgetMin: 550, budgetMax: 650,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 15,
    },
    {
      match: /city sights/,
      summary:
        'Compact-modular everyday stroller with a reversible, reclining seat and bassinet compatibility for use from birth. 24.4 lb, one-hand fold, 50 lb limit.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 24.4, budgetMin: 400, budgetMax: 480,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /summit x3 double/,
      summary:
        'A true all-terrain jogging double — air-filled tires, all-wheel suspension, hand-operated deceleration brake and a lockable front wheel for runs. One-hand fold, 50 lb per seat.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 40, budgetMin: 650, budgetMax: 750,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /summit x3/,
      summary:
        'Baby Jogger’s real running stroller: 12"/16" air tires, all-wheel suspension, hand-operated deceleration brake and lockable front wheel. 28.5 lb, one-hand fold, up to 75 lb. From birth with an infant seat.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 75, ownWeightLbs: 28.5, budgetMin: 420, budgetMax: 500,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BABY TREND — babytrend.com product pages.
  // ─────────────────────────────────────────────────────────────────────────
  'Baby Trend': [
    {
      match: /expedition zero flat jogger/,
      summary:
        'Baby Trend’s budget flat-fold jogger: Zero Flat never-go-flat all-terrain bicycle tires, a locking swivel front wheel, multi-position recline, LED side lights and a trigger fold. Holds up to 50 lb (or 42" tall), and takes a Baby Trend infant seat from birth. A capable jogger that won’t break the bank.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 30, budgetMin: 160, budgetMax: 200,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /expedition 2 in 1/,
      summary:
        'Baby Trend’s convertible stroller wagon: a hideaway pull handle flips it between push and pull, with built-in seating for two, a UPF 50+ ratcheting canopy and a compact flat fold. 55 lb per seat (110 lb total). Note: it starts at 6 months — riders must sit up unassisted, so this is not a from-birth stroller.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['suburban', 'trail'],
      maxWeightLbs: 55, ownWeightLbs: 33, budgetMin: 300, budgetMax: 350,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BELLINI — bellini.com Juno product page. Note the 3 lb basket rating and
  // the 9-month minimum age (NOT a from-birth stroller).
  // ─────────────────────────────────────────────────────────────────────────
  Bellini: [
    {
      match: /juno/,
      summary:
        'Bellini’s auto-folding compact: folds and unfolds with one hand and auto-locks when closed, at just 17 lb, on airless puncture-proof wheels with 4-wheel suspension. Two caveats worth knowing — it starts at 9 months (not from birth), and the basket is rated for only 3 lb.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 17, budgetMin: 200, budgetMax: 280,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 3,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BOB GEAR — bobgear.com + retailer spec sheets. Every BOB jogger is 75 lb
  // and takes an infant car seat with an adapter, so from-birth is true.
  // ─────────────────────────────────────────────────────────────────────────
  BOB: [
    {
      match: /duallie/,
      summary:
        'BOB’s side-by-side jogging double: air-filled tires, adjustable suspension, a hand brake for hills and the same trail-ready build as the single. 50 lb per seat, and it still fits through a standard doorway.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 34, budgetMin: 750, budgetMax: 850,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /revolution flex/,
      summary:
        'The benchmark running stroller: 28 lb, up to 75 lb, air-filled tires, adjustable handlebar and a locking swivel front wheel you flip open for runs. Takes an infant car seat with an adapter, so it works from birth.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 75, ownWeightLbs: 28, budgetMin: 550, budgetMax: 650,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /alterrain/,
      summary:
        'BOB’s premium all-weather jogger: SmoothShox suspension, air-filled tires and a water-repellent canopy, 32.3 lb and up to 75 lb. The plushest ride BOB makes, for parents who actually run.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 75, ownWeightLbs: 32.3, budgetMin: 650, budgetMax: 750,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /rambler/,
      summary:
        'The lightest, most affordable way into BOB: 25 lb, up to 75 lb, air-filled tires and a locking front wheel. Fewer bells than the Revolution, same jogging bones.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 75, ownWeightLbs: 25, budgetMin: 350, budgetMax: 420,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /wayfinder/,
      summary:
        'BOB’s newer jogger with independent dual suspension and air-filled tires, 31.1 lb and up to 75 lb. A smoother, more modern take on the Revolution formula.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 75, ownWeightLbs: 31.1, budgetMin: 480, budgetMax: 560,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /renegade/,
      summary:
        'BOB’s all-terrain stroller wagon: push or pull, 55 lb per seat and 165 lb total including cargo, on a rugged 40 lb frame. Built for trailheads and long park days — riders need to sit up on their own, so it is not from birth.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 55, ownWeightLbs: 40, budgetMin: 600, budgetMax: 700,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BOMBI — bombigear.com spec pages. The Bēbee folds small and ships with a
  // travel bag, but owners report it does NOT fit an overhead bin.
  // Twin weight isn't reliably published, so it's left unset.
  // ─────────────────────────────────────────────────────────────────────────
  Bombi: [
    {
      match: /bebee twin|twin/,
      summary:
        'Bombi’s lightweight side-by-side double: one-hand fold, deep recline and 55 lb per seat (110 lb total), on a narrow frame built to clear standard doorways. A rare folding double that travels well.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 55, budgetMin: 350, budgetMax: 450,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /bebee/,
      summary:
        'A 16 lb compact that punches above its price: built-in newborn cocoon and a flat recline so it works from birth, one-hand fold, XXL canopy and up to 55 lb. Ships with a travel bag and is Disney-friendly — but it is too big for an airplane overhead bin.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 55, ownWeightLbs: 16, budgetMin: 200, budgetMax: 280,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],
};

export function findStrollerSpecSeed(brand: string, model: string): StrollerSpecSeed | null {
  const brandKey = Object.keys(STROLLER_SPEC_SEEDS).find(
    (key) => normalizeModel(key) === normalizeModel(brand),
  );
  if (!brandKey) return null;
  const nm = normalizeModel(model);
  return STROLLER_SPEC_SEEDS[brandKey].find((seed) => seed.match.test(nm)) ?? null;
}
