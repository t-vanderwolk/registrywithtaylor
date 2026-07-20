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

  // ─────────────────────────────────────────────────────────────────────────
  // BRITAX — us.britax.com + retailer spec sheets. The "BOB - Wayfinder" row is
  // a duplicate of BOB's own Wayfinder and is deliberately left unmatched.
  // ─────────────────────────────────────────────────────────────────────────
  Britax: [
    {
      match: /prism/,
      summary:
        'Britax’s full-size modular: six ways to ride, a one-step compact fold, telescoping handlebar, all-wheel suspension and an all-season insert so it works from birth. 24.4 lb, up to 50 lb.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 24.38, budgetMin: 450, budgetMax: 550,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /grove/,
      summary:
        'A lightweight modular with six ways to ride: CozyFit insert for the newborn stage, bumper bar, SafeWash fabrics and a 24 lb frame. Up to 50 lb.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 24, budgetMin: 380, budgetMax: 450,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /brook/,
      summary:
        'Britax’s ultra-lightweight modular — four ways to stroll with a SafeWash insert, usable from birth up to 50 lb. The easy-living option in the modular line.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, budgetMin: 300, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /juniper/,
      summary:
        'Britax’s on-the-go compact: under 15 lb with a FastPack system, one-hand RapidFold, built-in carry handle and a UPF 50+ water-resistant canopy. Up to 50 lb.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 14.9, budgetMin: 200, budgetMax: 280,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /b lively/,
      summary:
        'The everyday Britax workhorse: 20 lb, up to 55 lb, one-hand fold, all-wheel suspension and a big UV50+ canopy. Clicks straight onto a B-Safe infant seat, so it works from birth.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 55, ownWeightLbs: 20, budgetMin: 250, budgetMax: 320,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /b clever/,
      summary:
        'The narrower, more compact Britax: 21 lb, up to 50 lb, one-hand fold, ventilated seat and all-wheel suspension. Takes a B-Safe infant seat from birth.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 21, budgetMin: 250, budgetMax: 320,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BUGABOO — bugaboo.com + Bugaboo service articles. Note the Butterfly and Ant
  // seats start at 6 months, so neither is a from-birth stroller on its own.
  // ─────────────────────────────────────────────────────────────────────────
  Bugaboo: [
    {
      match: /donkey/,
      summary:
        'Bugaboo’s single-to-double: starts as a roomy single with a bassinet, then slides out to side-by-side twin duty without changing the frame. About 33 lb with the seat, 48 lb per seat, and a cavernous basket.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 48, ownWeightLbs: 33.3, budgetMin: 1300, budgetMax: 1600,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /butterfly/,
      summary:
        'Bugaboo’s 16 lb cabin-size travel stroller: folds one-handed into an IATA carry-on-compatible package that genuinely fits an overhead bin. Up to 48 lb — but the seat starts at 6 months, so it is not a from-birth stroller.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 48, ownWeightLbs: 16, budgetMin: 450, budgetMax: 550,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /dragonfly/,
      summary:
        'The city modular: bassinet and seat on a light 21 lb frame with a compact fold and a genuinely big 22 lb basket. Up to 48 lb, from birth with the included bassinet.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 48, ownWeightLbs: 21, budgetMin: 800, budgetMax: 1000,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 22,
    },
    {
      match: /fox 5/,
      summary:
        'Bugaboo’s flagship all-terrain 2-in-1: bassinet and seat in the box, one-hand fold, big wheels and premium suspension. Around 24 lb, up to 50 lb on the seat. The plush, buy-once option.',
      priceRange: 'luxury', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
      maxWeightLbs: 50, ownWeightLbs: 24, budgetMin: 1300, budgetMax: 1500,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /fox/,
      summary:
        'The previous-generation Fox all-terrain 2-in-1: bassinet and seat included, one-hand fold and suspension built for rougher pavement. Around 22 lb, up to 48 lb.',
      priceRange: 'luxury', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
      maxWeightLbs: 48, ownWeightLbs: 22, budgetMin: 900, budgetMax: 1200,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /bee/,
      summary:
        'The classic Bugaboo city stroller: 19.6 lb, reversible seat, one-hand fold and a bassinet option for the newborn stage. From birth up to 40 lb.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city'],
      maxWeightLbs: 40, ownWeightLbs: 19.6, budgetMin: 700, budgetMax: 900,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /\bant\b/,
      summary:
        'Bugaboo’s lightest, most compact: 15.8 lb, folds to 20.6 x 14.9 x 9.1" — small enough for an overhead bin — with a 6.6 lb under-seat basket plus an 11 lb rear luggage basket. Up to 50 lb; the seat starts at 6 months.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 15.8, budgetMin: 450, budgetMax: 550,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true, basketCapacityLbs: 6.6,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BUMBLERIDE — bumbleride.com. Eco-minded all-terrain line; the Era is unusual
  // in being usable from birth with no attachments (infant-safe lay-flat seat).
  // ─────────────────────────────────────────────────────────────────────────
  Bumbleride: [
    {
      match: /indie twin/,
      summary:
        'The all-terrain double: air-filled tires and all-wheel suspension on a frame narrow enough for most doorways, 55 lb per seat. Handles trails and light jogging with the front wheels locked.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 55, budgetMin: 850, budgetMax: 1000,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /indie/,
      summary:
        'Bumbleride’s all-terrain single: 24 lb, up to 55 lb, air-filled tires and all-wheel suspension, and rated for light jogging on level ground with the front wheel locked. Made with recycled, eco-certified fabrics.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 55, ownWeightLbs: 24, budgetMin: 600, budgetMax: 700,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /\bera\b/,
      summary:
        'The reversible-seat city stroller that is ready from birth with no attachments — the seat itself lays flat and infant-safe. 27 lb, up to 55 lb, all-wheel suspension and air-filled tires.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 55, ownWeightLbs: 27, budgetMin: 650, budgetMax: 750,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /speed/,
      summary:
        'Bumbleride’s proper running stroller: 26 lb, up to 65 lb, with Speed3 steering (run, jog or walk), 16" rear and 12" front air-filled tires and all-wheel suspension. Built for longer distances.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 65, ownWeightLbs: 26, budgetMin: 700, budgetMax: 800,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CHICCO — chiccousa.com. Doubles and the Presto have no published frame
  // weight, so those fields are intentionally left unset.
  // ─────────────────────────────────────────────────────────────────────────
  Chicco: [
    {
      match: /bravofor2/,
      summary:
        'Chicco’s stand-and-ride double: one seat plus a rear bench and standing platform for a big sibling, and it still clicks a KeyFit infant seat on top for the newborn stage.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      budgetMin: 300, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /cortina/,
      summary:
        'Chicco’s side-by-side double built around the KeyFit — it takes two infant seats, so it works from birth for twins, with independent reclines and a full-length canopy.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      budgetMin: 300, budgetMax: 400,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /corso/,
      summary:
        'Chicco’s modular: bassinet-style and parent-facing configurations plus a quick fold, on a 24.8 lb frame up to 50 lb. Clicks straight onto a KeyFit, so it covers newborn through toddler.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 24.8, budgetMin: 350, budgetMax: 450,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /\btre\b/,
      summary:
        'Chicco’s jogger: flat-free pneumatic tires, a locking swivel front wheel, adjustable handle and a one-hand fold. 28.5 lb, up to 50 lb, and KeyFit-compatible from birth.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 28.5, budgetMin: 350, budgetMax: 420,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /presto/,
      summary:
        'Chicco’s self-folding compact — it collapses itself at the push of a button, for parents who are done wrestling a stroller at the curb.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 250, budgetMax: 350,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /bravo/,
      summary:
        'The travel-system standard: 24.9 lb, up to 50 lb, a true one-hand quick fold and EVA flat-free tires. Clicks onto a KeyFit for the newborn stage — the reason it lands on so many registries.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 24.9, budgetMin: 200, budgetMax: 280,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CYBEX — cybex-online.com. The Libelle and Coya are genuinely cabin-size, but
  // like most compact seats they start at 6 months, not birth.
  // Note ordering: /beezy/ must precede /eezy/, /e gazelle/ must precede /gazelle/.
  // ─────────────────────────────────────────────────────────────────────────
  Cybex: [
    {
      match: /e gazelle/,
      summary:
        'The Gazelle S with electric assist — the same 20-plus modular configurations and single-to-double conversion, with motor help for hills and heavy loads.',
      priceRange: 'luxury', foldType: 'compact', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, budgetMin: 1400, budgetMax: 1700,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /gazelle/,
      summary:
        'Cybex’s all-in-one: over 20 modular configurations, a second seat option that turns it into a double, a near-flat recline and a genuinely huge shopper basket. 28.4 lb, up to 50 lb.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 28.4, budgetMin: 700, budgetMax: 900,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /priam/,
      summary:
        'Cybex’s flagship: 28.1 lb, up to 55 lb, with a bassinet option, one-hand fold and the design-forward build the brand is known for. The splurge of the Cybex line.',
      priceRange: 'luxury', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 55, ownWeightLbs: 28.1, budgetMin: 1000, budgetMax: 1300,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /mios/,
      summary:
        'The city-slim Cybex: 22.5 lb, up to 55 lb, with a compact one-hand fold, reversible seat and bassinet option. Built for tight sidewalks and small elevators.',
      priceRange: 'luxury', foldType: 'compact', lifestyle: ['city'],
      maxWeightLbs: 55, ownWeightLbs: 22.5, budgetMin: 800, budgetMax: 1000,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /balios/,
      summary:
        'Cybex’s full-size family stroller: up to 55 lb, bassinet-compatible from birth, with a 22 lb shopping basket that actually holds a grocery run.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 55, budgetMin: 600, budgetMax: 750,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 22,
    },
    {
      match: /melio/,
      summary:
        'A 13 lb featherweight on a carbon-look frame, up to 55 lb, with a compact fold and full recline. Light enough to carry up stairs one-handed.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 55, ownWeightLbs: 13.4, budgetMin: 500, budgetMax: 620,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /libelle/,
      summary:
        'The 13.7 lb cabin-size travel stroller: folds tiny enough to go in the overhead bin and works with Cybex infant seats. Like most compact seats, it starts at 6 months — check your airline before you count on the bin.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 48, ownWeightLbs: 13.7, budgetMin: 280, budgetMax: 380,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /coya/,
      summary:
        'Cybex’s luxe cabin-size compact: 14.6 lb, carry-on friendly fold and a design-piece frame. Starts at 6 months, so it is a second stroller rather than a first.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 48, ownWeightLbs: 14.6, budgetMin: 600, budgetMax: 750,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /beezy/,
      summary:
        'Cybex’s value lightweight: a simple compact fold and full recline in a sub-15 lb frame. A grab-and-go second stroller, from 6 months.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 48, budgetMin: 280, budgetMax: 350,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /eezy/,
      summary:
        'The one with the 360° rotating seat — spin baby to face you or the world without unclipping anything, on a compact-folding frame up to 55 lb.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 55, budgetMin: 450, budgetMax: 550,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /\beos\b/,
      summary:
        'Cybex’s full-size all-rounder: bassinet-ready from birth with a roomy seat and big basket, aimed at parents who want one stroller to do everything.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      budgetMin: 600, budgetMax: 800,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // DFY — dfyordinary.com
  // ─────────────────────────────────────────────────────────────────────────
  DFY: [
    {
      match: /r1/,
      summary:
        'Big-stroller features in a compact frame: a reversible seat, a magnetic pop-off back panel and the tallest telescopic handle on the market. 25 lb with the seat on, up to 48 lb, from birth. The basket is rated to 6.6 lb, so it is a diaper bag rather than a grocery run.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 48, ownWeightLbs: 25, budgetMin: 420, budgetMax: 520,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 6.6,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // ERGOBABY — ergobaby.com. Both Metro generations are built to fold into an
  // overhead bin; the Metro 3 Deluxe is explicitly IATA carry-on compatible.
  // ─────────────────────────────────────────────────────────────────────────
  Ergobaby: [
    {
      match: /metro 3/,
      summary:
        'The lightest of the Metros at 16.7 lb, up to 50 lb, with a one-hand fold, near-flat recline and an adjustable handlebar. Carry-on compatible for most airlines, and it works from birth with an infant insert or a car seat.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 16.7, budgetMin: 300, budgetMax: 400,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /metro/,
      summary:
        'The travel stroller that folds down for overhead airplane storage: 18.1 lb, up to 50 lb, car-seat compatible and usable from birth with the newborn insert. Airline rules vary, so confirm with yours before you count on the bin.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 18.1, budgetMin: 280, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // EVENFLO — evenflo.com. The Hummingbird's frame weight isn't published in a
  // form I trust yet, so its weight fields stay unset.
  // ─────────────────────────────────────────────────────────────────────────
  Evenflo: [
    {
      match: /xplore/,
      summary:
        'The all-terrain stroller wagon: 34.7 lb, seats two at 55 lb each, and pushes or pulls over grass and gravel. Riders need to sit unassisted — it starts around 6 months, not birth.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 55, ownWeightLbs: 34.7, budgetMin: 280, budgetMax: 400,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /xpand/,
      summary:
        'The value single-to-double: starts as a single, adds a second seat when baby number two arrives, and takes 55 lb per seat on a 30.2 lb frame. Bassinet and car-seat ready from birth, at roughly half the price of the premium convertibles.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['suburban', 'city'],
      maxWeightLbs: 55, ownWeightLbs: 30.2, budgetMin: 280, budgetMax: 400,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /shyft|intuiti/,
      summary:
        'Evenflo’s modular travel system: a true pram mode for the newborn stage that converts to a toddler seat, up to 55 lb, paired with the rotating LiteMax NXT infant seat.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 55, budgetMin: 350, budgetMax: 500,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /hummingbird/,
      summary:
        'A carbon-fiber lightweight built to be picked up one-handed — the featherweight end of the Evenflo line, for travel days and quick errands.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 250, budgetMax: 400,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // GRACO — gracobaby.com. Graco publishes per-seat limits on its doubles
  // (front seat higher than rear); maxWeightLbs stores the front-seat figure.
  // Ordering: /nest2grow/ must precede /modes nest/, which would otherwise
  // swallow it.
  // ─────────────────────────────────────────────────────────────────────────
  Graco: [
    {
      match: /nest2grow/,
      summary:
        'Graco’s single-that-becomes-a-double: infant, bassinet and toddler modes, then a second seat when you need it. 50 lb in the front seat and 45 lb in the rear — the affordable answer to the premium convertibles.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['suburban', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 34.6, budgetMin: 300, budgetMax: 420,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /modes nest/,
      summary:
        'A modular full-size Graco with infant, bassinet and toddler modes on one frame, up to 50 lb. Covers newborn through preschool without buying a second stroller.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['suburban', 'city'],
      maxWeightLbs: 50, budgetMin: 250, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /pramette/,
      summary:
        'The pram mode is the point: a true flat bassinet for the newborn months that converts to a toddler seat, up to 50 lb, at a fraction of what a European pram costs.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, budgetMin: 230, budgetMax: 350,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /ready2grow/,
      summary:
        'The tandem workhorse: a dozen riding configurations including a bench and standing platform, 50 lb in front and 40 lb in back, on a 32.4 lb frame. Takes two infant seats, so it works from birth for twins.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['suburban', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 32.4, budgetMin: 230, budgetMax: 350,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /ready2jet/,
      summary:
        'Graco’s travel compact: a small fold and light frame built for airports and car trunks rather than daily neighbourhood miles.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 150, budgetMax: 250,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
    {
      match: /fastaction/,
      summary:
        'The budget jogger: rubber tires, a locking front wheel and a genuine one-hand fold, up to 50 lb, and it clicks onto a Graco infant seat from birth. The cheapest honest way into stroller running.',
      priceRange: 'budget', foldType: 'one-hand', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 50, budgetMin: 180, budgetMax: 260,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /outpace/,
      summary:
        'Graco’s all-terrain jogger — bigger wheels and a sturdier frame for gravel paths and running days, at a budget price.',
      priceRange: 'budget', foldType: 'one-hand', lifestyle: ['trail', 'suburban'],
      budgetMin: 200, budgetMax: 300,
      isExpandable: false, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /merge/,
      summary:
        'A slim, lightweight everyday Graco built for narrow aisles and quick errands rather than all-day outings.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['city', 'travel'],
      budgetMin: 130, budgetMax: 220,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // GUAVA FAMILY — guavafamily.com. Both catalog entries are the same Roam
  // crossover; it folds unusually small but is NOT airline carry-on approved.
  // ─────────────────────────────────────────────────────────────────────────
  'Guava Family': [
    {
      match: /roam/,
      summary:
        'A jogger that folds like a travel stroller: the 3D nesting fold packs down about half the size of a normal running stroller without pulling the wheels off. 28.5 lb, up to 60 lb. It folds small, but it is too big to carry on — plan to gate-check it.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['trail', 'travel', 'suburban'],
      maxWeightLbs: 60, ownWeightLbs: 28.5, budgetMin: 500, budgetMax: 650,
      isExpandable: false, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // INGENUITY — kids2 / ingenuitybaby.com
  // ─────────────────────────────────────────────────────────────────────────
  Ingenuity: [
    {
      match: /3dsuite|3d suite/,
      summary:
        'A budget modular: bassinet, infant-seat and toddler configurations on one frame, aimed at parents who want the convertible format without the convertible price.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['city', 'suburban'],
      budgetMin: 180, budgetMax: 300,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // INGLESINA — inglesina.us
  // ─────────────────────────────────────────────────────────────────────────
  Inglesina: [
    {
      match: /quid/,
      summary:
        'Fourteen pounds, folds to roughly the size of a backpack and fits most overhead bins. Up to 50 lb, but it starts around 3 months rather than birth — a second stroller for travel, not a first stroller.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 14, budgetMin: 260, budgetMax: 350,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // JOIE — joiebaby.com. Only the Chive has specs I could confirm for the US
  // market; the rest of the range gets a conservative catch-all with no
  // invented numbers. The catch-all must stay LAST.
  // ─────────────────────────────────────────────────────────────────────────
  Joie: [
    {
      match: /chive/,
      summary:
        'A single that becomes a double with more than 20 seating modes, 50 lb per seat (100 lb total), and a 2-in-1 carry cot for the newborn stage. Note the rear seat drops to 35 lb when it faces you.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, budgetMin: 400, budgetMax: 550,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /rosemary double/,
      summary:
        'Joie’s side-by-side double: two independent seats on a frame narrow enough for most doorways, without the convertible-stroller price.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      budgetMin: 300, budgetMax: 450,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      // Catch-all for the rest of the Joie range — sets only what's safe to say
      // about the brand, leaving weights for per-model research later.
      match: /./,
      summary:
        'Joie builds practical, well-priced everyday strollers — the sensible middle ground between bargain-bin and boutique.',
      priceRange: 'mid', lifestyle: ['city', 'suburban'],
      budgetMin: 200, budgetMax: 400,
      isExpandable: false, suitableForJogging: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // JOOLZ — joolz.com. Joolz publishes in kg; converted here. Both the Day+ and
  // Geo3 cap at 22 kg (≈48 lb), and the Geo's 15 kg basket is the biggest in the
  // catalog so far.
  // Ordering: /aer/ before the rest so Aer+ / Aer² don't fall through.
  // ─────────────────────────────────────────────────────────────────────────
  Joolz: [
    {
      match: /\baer/,
      summary:
        '13.2 lb, folds to cabin size and lands in the overhead bin on most airlines. Up to 50 lb, with an 11 lb basket, and a from-birth cot sold separately. The travel stroller people actually keep using at home.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 13.2, budgetMin: 450, budgetMax: 600,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: true, basketCapacityLbs: 11,
    },
    {
      match: /geo/,
      summary:
        'The all-terrain Joolz and the one to pick if you actually load a stroller up: a 33 lb basket limit, bigger wheels, and a bassinet from birth. 28.7 lb, up to 48 lb, and it converts to a twin.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['trail', 'suburban', 'city'],
      maxWeightLbs: 48, ownWeightLbs: 28.7, budgetMin: 900, budgetMax: 1200,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 33,
    },
    {
      match: /day/,
      summary:
        'The Dutch pram silhouette with a bassinet included: 29.5 lb complete, up to 48 lb, big wheels and an upright seat height that brings baby closer to you. An 11 lb basket.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 48, ownWeightLbs: 29.5, budgetMin: 900, budgetMax: 1200,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 11,
    },
    {
      match: /hub/,
      summary:
        'Joolz sized for the city: 19.4 lb with a reversible seat, one-hand fold and an XL basket, slotting between a compact and a full-size pram.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city'],
      maxWeightLbs: 48, ownWeightLbs: 19.4, budgetMin: 600, budgetMax: 800,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /dot/,
      summary:
        'A compact Joolz built for travel days — small fold, light frame, easy to live with away from home.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 400, budgetMax: 600,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // LARKTALE — larktale.com. Stroller wagons: riders must sit unassisted, so
  // none of these are from-birth.
  // ─────────────────────────────────────────────────────────────────────────
  Larktale: [
    {
      match: /quad/,
      summary:
        'The four-seater wagon: room for a whole crew at 65 lb per seat, with a one-hand compact fold that still fits a trunk. From 6 months, once riders can sit on their own.',
      priceRange: 'luxury', foldType: 'compact', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 65, budgetMin: 700, budgetMax: 900,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /caravan|coupe/,
      summary:
        'A stroller-wagon hybrid that pushes like a stroller instead of dragging like a wagon: 65 lb per seat, 152 lb total, and a genuinely compact fold. From 6 months.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 65, budgetMin: 500, budgetMax: 700,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MAXI-COSI — maxicosi.com
  // ─────────────────────────────────────────────────────────────────────────
  'Maxi-Cosi': [
    {
      match: /tayla/,
      summary:
        'A 5-in-1 modular: bassinet, infant seat and toddler modes on one 26.2 lb frame, up to 50 lb, with a 25 lb basket that handles a real grocery run. Covers birth through toddler without a second purchase.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 26.2, budgetMin: 400, budgetMax: 550,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 25,
    },
    {
      match: /lila/,
      summary:
        'The all-in-one that grows sideways: 28 lb, up to 50 lb, and a Duo seat kit turns it into a double when baby number two arrives. Bassinet and car-seat ready from birth.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 28, budgetMin: 400, budgetMax: 550,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /oxford/,
      summary:
        '16 lb, one-hand fold, and sized to the IATA carry-on recommendation so it goes in the overhead bin on most airlines. Up to 50 lb and 45" tall, so it lasts well past the travel-stroller years.',
      priceRange: 'mid', foldType: 'one-hand', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 16, budgetMin: 250, budgetMax: 380,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /fame/,
      summary:
        'A modular Maxi-Cosi built to take a bassinet and an infant seat on the same chassis, aimed at parents who want one frame to cover the whole stretch.',
      priceRange: 'mid', foldType: 'standard', lifestyle: ['city', 'suburban'],
      budgetMin: 350, budgetMax: 500,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MERCEDES — licensed design-brand strollers with no reliable published
  // spec sheet; brand-level fields only, no invented numbers.
  // ─────────────────────────────────────────────────────────────────────────
  Mercedes: [
    {
      match: /./,
      summary:
        'A licensed Mercedes-branded stroller — design-led styling and premium finishes, aimed at parents who want the badge on the pram too.',
      priceRange: 'premium', lifestyle: ['city', 'suburban'],
      budgetMin: 400, budgetMax: 700,
      isExpandable: false, suitableForJogging: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MIMA — mimakidsusa.com. Note the Xari's unusually low 18 kg (≈39 lb) limit;
  // the separate Xari Max goes to 55 lb but isn't in the catalog.
  // ─────────────────────────────────────────────────────────────────────────
  Mima: [
    {
      match: /xari/,
      summary:
        'The sculpted one people buy on looks — and it earns it, with a bassinet that converts to a seat and a genuinely distinctive silhouette. 29.5 lb, but note the capacity tops out around 39 lb, lower than most rivals, so it ages out sooner.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['city'],
      maxWeightLbs: 39, ownWeightLbs: 29.5, budgetMin: 1000, budgetMax: 1400,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /zigi/,
      summary:
        '17.2 lb with a compact fold most airlines accept as cabin luggage, up to 48 lb. Mima styling in a travel frame — check with your airline before you count on the bin.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 48, ownWeightLbs: 17.2, budgetMin: 500, budgetMax: 700,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /creo/,
      summary:
        'Mima’s more practical modular: the design language of the Xari on a frame built around everyday use and a bassinet from birth.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
      budgetMin: 700, budgetMax: 1000,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /miro/,
      summary:
        'A lighter, city-sized Mima for parents who want the look without the full pram footprint.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      budgetMin: 500, budgetMax: 800,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MOCKINGBIRD — hellomockingbird.com. Ordering: single-to-double must come
  // first or /single/ swallows it.
  // ─────────────────────────────────────────────────────────────────────────
  Mockingbird: [
    {
      match: /single to double|double/,
      summary:
        'The direct-to-consumer convertible: 44 configurations for one, two or three kids, 35 lb in double mode, and a 25 lb basket. 50 lb in single mode but 45 lb per seat once you add the second — worth knowing before you commit.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 35, budgetMin: 550, budgetMax: 750,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 25,
    },
    {
      match: /single|./,
      summary:
        '27 lb, up to 50 lb, with a reversible seat, bassinet mode and an XL basket rated to 25 lb — most of a boutique stroller’s feature list at roughly half the boutique price.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 27, budgetMin: 400, budgetMax: 550,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 25,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MOMCOZY — newer budget brand with no published spec sheet; brand-level
  // fields only.
  // ─────────────────────────────────────────────────────────────────────────
  Momcozy: [
    {
      match: /./,
      summary:
        'Momcozy’s take on the everyday stroller: budget-friendly, light, and built around quick one-hand folds for parents doing school runs and errands.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['city', 'travel'],
      budgetMin: 150, budgetMax: 300,
      isExpandable: false, suitableForJogging: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MOMPUSH — mompush.com. The Wiz and Meteor share a 50 lb seat limit and a
  // 10 lb basket — small, so it's worth surfacing in Compare.
  // ─────────────────────────────────────────────────────────────────────────
  Mompush: [
    {
      match: /wiz|meteor/,
      summary:
        'A 2-in-1 that includes the bassinet instead of selling it separately: pramette mode for the newborn stage, a reversible seat after, 22.3 lb and up to 50 lb. The basket is only rated to 10 lb, so it is a diaper-bag shelf rather than a grocery hauler.',
      priceRange: 'budget', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 22.3, budgetMin: 230, budgetMax: 350,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false, basketCapacityLbs: 10,
    },
    {
      match: /lithe double|ultimate/,
      summary:
        'Mompush’s double: two seats on a frame that still folds down small, at a price well under the convertible-stroller bracket.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['city', 'suburban'],
      budgetMin: 300, budgetMax: 450,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /lithe|velo/,
      summary:
        'The lightweight of the range — a compact fold and low frame weight aimed at travel days, car trunks and airport terminals.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 180, budgetMax: 300,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // NUNA — nunababy.com. Nuna quotes frame weights "without insert, arm bar and
  // canopy", so the real-world number is a little higher than listed here.
  // The BMW co-branded variants fall through to the base model rules.
  //
  // NOTE: the TRVL is commonly assumed to be a carry-on stroller, but Nuna
  // states its folded size does NOT meet the IATA cabin standard — it is a
  // gate-check stroller. fitsOverheadBin is false on purpose.
  // ─────────────────────────────────────────────────────────────────────────
  Nuna: [
    {
      match: /demi/,
      summary:
        'Nuna’s convertible flagship: starts single, takes a second seat, bassinet or rider board, and reconfigures for one, two or three kids. 26 lb, up to 50 lb, from birth.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 26, budgetMin: 800, budgetMax: 1000,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /mixx/,
      summary:
        'The full-size Nuna: a flat-lay seat that works as a bassinet from birth, all-wheel suspension and a compact fold for a 28.3 lb frame. Up to 50 lb.',
      priceRange: 'luxury', foldType: 'compact', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 28.3, budgetMin: 700, budgetMax: 900,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /tavo/,
      summary:
        'The no-adapter travel system: a Nuna PIPA seat clicks straight onto the frame with nothing extra to buy or lose. 23.2 lb, up to 50 lb.',
      priceRange: 'premium', foldType: 'standard', lifestyle: ['suburban', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 23.2, budgetMin: 500, budgetMax: 650,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /triv/,
      summary:
        'The lightest of Nuna’s full-feature strollers at 18.4 lb, up to 50 lb, with a compact standing fold. City manoeuvrability without dropping to a bare travel stroller.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 50, ownWeightLbs: 18.4, budgetMin: 550, budgetMax: 700,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      fitsOverheadBin: false,
    },
    {
      match: /trvl (double|dubl)/,
      summary:
        'The double version of Nuna’s self-folding compact — two seats side by side that still collapse with one hand. A gate-check stroller, not a carry-on.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, budgetMin: 600, budgetMax: 800,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /trvl/,
      summary:
        '13.6 lb and it folds itself at the press of a button, up to 50 lb. Despite the name, Nuna is clear that the folded size does not meet the IATA cabin standard — use it through the airport, then gate-check it in the included bag.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 13.6, budgetMin: 400, budgetMax: 550,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /swiv/,
      summary:
        'The one with wheels that spin a full 360° — genuinely useful in tight shops and lifts. 21.8 lb, up to 50 lb, with a 22 lb basket.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      maxWeightLbs: 50, ownWeightLbs: 21.8, budgetMin: 500, budgetMax: 650,
      isExpandable: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false, basketCapacityLbs: 22,
    },
    {
      match: /viaa|cabn/,
      summary:
        'Nuna’s cabin-minded compact: a small fold and light frame built for families who fly often.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 400, budgetMax: 600,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // ORBIT BABY — orbitbaby.com. The G5's frame weight is quoted inconsistently
  // across retailers (some list boxed weight), so it stays unset.
  // ─────────────────────────────────────────────────────────────────────────
  'Orbit Baby': [
    {
      match: /x5/,
      summary:
        'A luxury all-terrain jogger at 25 lb, up to 50 lb, built on the same aerospace-aluminium frame language as the rest of the line. The rare running stroller that doesn’t look like sports equipment.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['trail', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 25, budgetMin: 900, budgetMax: 1200,
      isExpandable: false, suitableForJogging: true,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /g5/,
      summary:
        'The SmartHub rotates the seat a full 360° — face you, face out, or swing sideways for loading, without unclipping anything. From birth to 50 lb on an aerospace-grade aluminium frame. It is a heavy stroller; that build is the trade-off.',
      priceRange: 'luxury', foldType: 'standard', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, budgetMin: 1000, budgetMax: 1400,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /./,
      summary:
        'Orbit Baby’s design-led approach to the everyday stroller — engineered frames and the brand’s signature rotating-seat thinking.',
      priceRange: 'luxury', lifestyle: ['city', 'suburban'],
      budgetMin: 700, budgetMax: 1100,
      isExpandable: false, suitableForJogging: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // PEG PEREGO — pegperego.com
  // ─────────────────────────────────────────────────────────────────────────
  'Peg Perego': [
    {
      match: /ypsi/,
      summary:
        'Italian-made and deceptively capable: 22.5 lb, up to 50 lb, and it takes a second seat to become a double. Reversible seat and a true from-birth setup with the Primo Viaggio.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 22.5, budgetMin: 550, budgetMax: 750,
      isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /volo/,
      summary:
        '12 lb — among the lightest strollers you can buy — and it fits most airline overhead bins. Reclining seat, usable from birth up to 50 lb, so it is not just an umbrella stroller with a badge.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
      maxWeightLbs: 50, ownWeightLbs: 12, budgetMin: 250, budgetMax: 380,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: false, fitsOverheadBin: true,
    },
    {
      match: /vivace/,
      summary:
        'A full-featured reversible stroller at 20.72 lb, up to 50 lb — lighter than most full-size frames without giving up the seat recline or canopy.',
      priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
      maxWeightLbs: 50, ownWeightLbs: 20.7, budgetMin: 500, budgetMax: 650,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /city loop/,
      summary:
        'A modular built around air travel: 19.2 lb as chassis plus seat, and the frame alone is compact enough to make flying with a car seat genuinely workable.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
      ownWeightLbs: 19.2, budgetMin: 500, budgetMax: 700,
      isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
      modular: true, fitsOverheadBin: false,
    },
    {
      match: /selfie|z4/,
      summary:
        'Peg Perego’s compact end: a small fold and light frame with the brand’s Italian build quality, aimed at city streets and travel days.',
      priceRange: 'premium', foldType: 'compact', lifestyle: ['city', 'travel'],
      budgetMin: 350, budgetMax: 550,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // RADIO FLYER — radioflyer.com. Voya wagons publish a total capacity rather
  // than a per-seat limit, so maxWeightLbs stays unset and the total lives in
  // the summary.
  // ─────────────────────────────────────────────────────────────────────────
  'Radio Flyer': [
    {
      match: /voya|wagon/,
      summary:
        'A stroller wagon with extra-tall sides, dual canopies and a push-or-pull handle, rated to 200 lb across two seats. Riders start at 6 months once they can sit unassisted — this is not a newborn stroller.',
      priceRange: 'mid', foldType: 'compact', lifestyle: ['trail', 'suburban'],
      budgetMin: 300, budgetMax: 450,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // SAFETY 1ST — budget line; per-model specs aren't published consistently.
  // ─────────────────────────────────────────────────────────────────────────
  'Safety 1st': [
    {
      match: /wagon|summit|quad/,
      summary:
        'A budget four-seat stroller wagon for park days and school runs — the wagon format without the boutique price. From 6 months, once riders sit unassisted.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['trail', 'suburban'],
      budgetMin: 200, budgetMax: 320,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /umbrella|disney/,
      summary:
        'A classic umbrella stroller with character styling — feather-light, simple to fold, and cheap enough to keep in a second car.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['travel', 'city'],
      budgetMin: 40, budgetMax: 90,
      isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
      modular: false, fitsOverheadBin: false,
    },
    {
      match: /./,
      summary:
        'Safety 1st keeps it simple: a quick one-hand fold and a light frame at an entry-level price, for everyday errands rather than all-day outings.',
      priceRange: 'budget', foldType: 'compact', lifestyle: ['city', 'travel'],
      budgetMin: 100, budgetMax: 200,
      isExpandable: false, suitableForJogging: false, modular: false,
    },
  ],
};

// Delta Children products are split across two brand strings in the catalog
// ("Delta Children" and "Delta"), so the same seeds are registered under both.
const DELTA_CHILDREN_SEEDS: StrollerSpecSeed[] = [
  {
    match: /jeep sport all terrain|all terrain stroller wagon/,
    summary:
      'Jeep-branded all-terrain stroller wagon: 33 lb, 55 lb per seat (110 lb total), a five-position leatherette handlebar that flips between push and pull, plus a canopy and a small mountain of storage. Riders need to sit up on their own, so it is not a from-birth stroller.',
    priceRange: 'mid', foldType: 'compact', lifestyle: ['trail', 'suburban'],
    maxWeightLbs: 55, ownWeightLbs: 33, budgetMin: 200, budgetMax: 280,
    isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /wrangler/,
    summary:
      'The deluxe Jeep wagon: seating for two at 55 lb per seat (110 lb total) with dual leatherette handlebars for push or pull. A park-and-errands hauler, not a newborn stroller.',
    priceRange: 'mid', foldType: 'compact', lifestyle: ['trail', 'suburban'],
    maxWeightLbs: 55, budgetMin: 300, budgetMax: 400,
    isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /adventureglyde|glyde/,
    summary:
      'A Jeep-branded glider stroller — the front wheels glide rather than jog, so it handles grass and gravel on a budget frame. Not a running stroller.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['suburban', 'trail'],
    budgetMin: 130, budgetMax: 200,
    isExpandable: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /jeep sport|cross country|adventure/,
    summary:
      'Jeep-branded all-terrain jogger on a steel frame: big front wheel, up to 50 lb, at a price that undercuts the specialist joggers. A budget way into stroller running.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['trail', 'suburban'],
    maxWeightLbs: 50, budgetMin: 130, budgetMax: 200,
    isExpandable: false, suitableForJogging: true,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /aries/,
    summary:
      'A budget-friendly Jeep all-terrain stroller — rugged looks and larger wheels without the specialist-jogger price tag.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['suburban', 'trail'],
    budgetMin: 130, budgetMax: 200,
    isExpandable: false, modular: false, fitsOverheadBin: false,
  },
  {
    match: /side by side/,
    summary:
      'A budget side-by-side double: two independent seats on a simple, light frame. The affordable answer for two under two.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['city', 'suburban'],
    budgetMin: 130, budgetMax: 200,
    isExpandable: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /umbrella/,
    summary:
      'A classic umbrella stroller: barely-there weight, a simple fold and a price that makes it an easy second stroller for the car trunk or grandma’s house.',
    priceRange: 'budget', foldType: 'compact', lifestyle: ['travel', 'city'],
    budgetMin: 40, budgetMax: 90,
    isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /carriage|2 in 1/,
    summary:
      'A budget 2-in-1 carriage: a pram-style bassinet mode for the newborn months that converts to a toddler seat later.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['city', 'suburban'],
    budgetMin: 130, budgetMax: 220,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: true, fitsOverheadBin: false,
  },
  {
    match: /icon/,
    summary:
      'Delta’s everyday-and-travel compact: a light frame and simple fold aimed at errands and trips, at an entry-level price.',
    priceRange: 'budget', foldType: 'compact', lifestyle: ['travel', 'city'],
    budgetMin: 100, budgetMax: 180,
    isExpandable: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /classic|gap/,
    summary:
      'A simple, affordable everyday stroller — light, easy to fold and priced as a practical first or second stroller.',
    priceRange: 'budget', foldType: 'standard', lifestyle: ['city', 'suburban'],
    budgetMin: 100, budgetMax: 200,
    isExpandable: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
];

STROLLER_SPEC_SEEDS['Delta Children'] = DELTA_CHILDREN_SEEDS;
STROLLER_SPEC_SEEDS['Delta'] = DELTA_CHILDREN_SEEDS;

export function findStrollerSpecSeed(brand: string, model: string): StrollerSpecSeed | null {
  const brandKey = Object.keys(STROLLER_SPEC_SEEDS).find(
    (key) => normalizeModel(key) === normalizeModel(brand),
  );
  if (!brandKey) return null;
  const nm = normalizeModel(model);
  return STROLLER_SPEC_SEEDS[brandKey].find((seed) => seed.match.test(nm)) ?? null;
}
