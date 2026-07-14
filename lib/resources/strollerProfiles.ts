/**
 * TMBC-toned stroller profiles: a short editorial description + key specs shown
 * on the travel-system results page when you check a stroller's compatible car
 * seats.
 *
 * This is a curated, expandable roster: add a profile object and it appears
 * automatically. Matching is brand + a model regex (tested against the
 * normalized model), so colour/year variants ("Vista V2", "Vista V3") resolve to
 * one profile. Strollers without a profile fall back to their catalog summary.
 */

export type StrollerSpec = { label: string; value: string };

export type StrollerPriceTier = 'budget' | 'mid' | 'premium' | 'luxury';

export type StrollerProfile = {
  /** Canonical brand, matched case-insensitively against the checker brand. */
  brand: string;
  /** Tested against the normalized (lowercased) model string. */
  match: RegExp;
  /** One or two sentences in TMBC voice: warm, honest, no fluff. */
  description: string;
  specs: StrollerSpec[];
  /**
   * Compare-tool fields — added profile by profile. `bestFor` is the one-liner
   * that answers "who is this for?"; `pros`/`cons` are the honest 2-4-item
   * lists; `valueScore` (0-100, quality-per-dollar) + `priceTier` feed the
   * default "Taylor's Top Pick" verdict when there's no curated matchup.
   */
  bestFor?: string;
  pros?: string[];
  cons?: string[];
  priceTier?: StrollerPriceTier;
  valueScore?: number;
};

const norm = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Curated flagship roster. Specs favour the facts that actually change a buying
 * decision (from-birth method, seat limit, fold, tires, which car seats fit).
 */
const PROFILES: StrollerProfile[] = [
  // ── UPPAbaby ──
  {
    brand: 'UPPAbaby',
    match: /\bvista\b/,
    description:
      'The stroller everyone pictures when they say modular. Start with the included bassinet, then add a RumbleSeat or a second full seat and roll up to three kids on one frame. A splurge people rarely regret.',
    bestFor: 'Planners who want one stroller to carry them from baby #1 through a second (or third) kid.',
    priceTier: 'premium',
    valueScore: 88,
    specs: [
      { label: 'From birth', value: 'Included bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Configurations', value: 'Single → double → triple' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-step, stands folded' },
      { label: 'Weight', value: '~27 lb with seat' },
    ],
    pros: [
      'Grows from single to double to triple on one frame',
      'Included bassinet — newborn-ready out of the box',
      'Holds its resale value better than almost anything out there',
    ],
    cons: [
      'Heavy and wide — a lot of stroller for a small trunk or a city walk-up',
      'You feel the price',
    ],
  },
  {
    brand: 'UPPAbaby',
    match: /\bcruz\b/,
    description:
      'The Vista’s smaller sibling: the same plush ride and reversible seat in a narrower, lighter, single-only frame. If you’re one-and-done or living somewhere tight, it’s the smarter buy.',
    bestFor: 'One-and-done families, or anyone who loves the Vista feel but not its footprint.',
    priceTier: 'premium',
    valueScore: 85,
    specs: [
      { label: 'From birth', value: 'Bassinet or infant car seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-hand, stands folded' },
      { label: 'Weight', value: '~21.5 lb' },
    ],
    pros: [
      'Vista comfort and reversible seat in a lighter, narrower frame',
      'Easier to lift, fold, and park in tight spaces',
      'One-hand fold that stands on its own',
    ],
    cons: [
      'Single only — no double in its future',
      'Bassinet is sold separately',
    ],
  },
  {
    brand: 'UPPAbaby',
    match: /\bminu\b/,
    description:
      'UPPAbaby’s travel stroller: a true one-hand, backpack-strap fold that still feels sturdy and reclines for real naps. The one to grab for airports and rideshares.',
    bestFor: 'Travel days, rideshares, and anywhere a full-size stroller is overkill.',
    priceTier: 'mid',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'With Mesa seat or bassinet kit' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Fold', value: 'Compact, stands folded, carry strap' },
      { label: 'Weight', value: '~15 lb' },
    ],
    pros: [
      'True one-hand fold with a backpack carry strap',
      'Sturdier and comfier than most strollers this small',
      'Reclines far enough for actual naps',
    ],
    cons: [
      'Small basket',
      'From-birth use needs the Mesa seat or the bassinet kit (both extra)',
    ],
  },
  // ── Nuna ──
  {
    brand: 'Nuna',
    match: /\bmixx\b/,
    description:
      'Nuna’s do-it-all full-size: all-wheel suspension, a seat that lies flat enough to skip a separate bassinet, and a magnetic buckle you’ll appreciate at month three. It pairs only with Nuna’s own PIPA seats.',
    specs: [
      { label: 'From birth', value: 'Flat-fold seat or PIPA' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible, near-flat recline' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
  },
  {
    brand: 'Nuna',
    match: /\btavo\b/,
    description:
      'The streamlined, budget-friendlier Nuna: a fixed forward-facing seat with the same clean look and a true one-hand fold. Lighter and simpler than the MIXX, and it clicks right onto a PIPA.',
    specs: [
      { label: 'From birth', value: 'With PIPA infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Forward-facing' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
  },
  {
    // Listed before the generic DEMI match so "DEMI Icon" resolves here first.
    brand: 'Nuna',
    match: /\bdemi\s*icon\b/,
    description:
      'Nuna’s premium single that stops trying to be a double and just nails everyday life with one kid. The headline is the basket — a huge, enclosed 30 lb hauler that swallows a whole day’s worth of stuff.',
    bestFor: 'One-child families who carry more than they’ll admit and want the stroller to do the lifting.',
    priceTier: 'premium',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'Bassinet or PIPA' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible, parent- or world-facing' },
      { label: 'Basket', value: 'Enclosed, up to 30 lb' },
      { label: 'Car seats', value: 'Nuna PIPA (ring adapter included)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Enormous 30 lb enclosed basket — the real reason to buy it',
      'PIPA ring adapter included in the box',
      'GREENGUARD Gold–certified materials',
    ],
    cons: [
      'Single only — it does not convert to a double (that’s the DEMI Next)',
      'Premium price for one seat',
    ],
  },
  {
    brand: 'Nuna',
    match: /\bdemi\b/,
    description:
      'Nuna’s modular flagship, and the DEMI that genuinely converts to a double. Bassinet, toddler seat, or PIPA in either spot, with more ways to configure it than almost anything else out there.',
    bestFor: 'Growing families who want one frame to go from one kid to two.',
    priceTier: 'premium',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'Bassinet or PIPA' },
      { label: 'Configurations', value: 'Single → double (with second seat)' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Truly converts from single to double',
      'Bassinet, toddler seat, or PIPA in either position',
      'More configurations than almost anything in its class',
    ],
    cons: [
      'Gets long and heavy in the double setup',
      'Premium price, and the second seat is extra',
    ],
  },
  {
    brand: 'Nuna',
    match: /\btriv\b/,
    description:
      'Lightweight and compact-folding, but it still takes a bassinet. Nuna comfort in a frame that fits smaller trunks and tight elevators.',
    specs: [
      { label: 'From birth', value: 'PIPA or TRIV bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'Compact one-hand, stands folded' },
    ],
  },
  {
    brand: 'Nuna',
    match: /\bswiv\b/,
    description:
      'The TRIV’s sibling with a party trick: button-activated 360° swivel wheels that let all four turn for effortless pivots in tight spaces, plus a bigger basket.',
    specs: [
      { label: 'From birth', value: 'PIPA or SWIV bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Wheels', value: '360° swivel drift mode' },
      { label: 'Basket', value: 'Up to 22 lb' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
    ],
  },
  {
    brand: 'Nuna',
    match: /\bviaa\b/,
    description:
      'Nuna’s first cabin-approved travel stroller: 16 lbs, folds small enough for most overhead bins, and clicks straight onto a PIPA with no adapter. Built for parents who fly.',
    specs: [
      { label: 'Weight', value: '16.3 lb' },
      { label: 'Folded', value: '20.5" × 16.5" × 9.5" (IATA cabin)' },
      { label: 'From birth', value: 'With PIPA infant seat' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Extras', value: 'Carry bag included' },
    ],
  },
  // ── Cybex ──
  {
    brand: 'Cybex',
    match: /\bpriam\b/,
    description:
      'Cybex’s flagship. A smooth, one-hand-fold luxury ride with in-seat suspension and a fashion collab for every season. Gorgeous and capable, just heavier and pricier than the mid-size crowd.',
    specs: [
      { label: 'From birth', value: 'Lie-flat cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Suspension', value: 'All-wheel' },
      { label: 'Fold', value: 'One-hand' },
    ],
  },
  {
    brand: 'Cybex',
    match: /\bbalios\b/,
    description:
      'The everyday Cybex: a genuinely roomy seat, big canopy, and forgiving price. A practical full-size that punches above its cost.',
    specs: [
      { label: 'From birth', value: 'With cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
  },
  {
    brand: 'Cybex',
    match: /\bmios\b/,
    description:
      'Cybex’s compact-luxe pick: a lightweight, nimble frame with a surprisingly plush seat and the same designer fabrics as the Priam. City living without the full-size heft.',
    specs: [
      { label: 'From birth', value: 'With cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 37.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Compact one-hand' },
    ],
  },
  {
    brand: 'Cybex',
    match: /\beezy s\b/,
    description:
      'An urban compact with a one-hand 360° rotating seat. Spin from parent-facing to world-facing in a second, then fold it small and self-standing to stow and go.',
    specs: [
      { label: 'From birth', value: 'With Cot S or infant seat' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Wheels', value: 'All-wheel suspension' },
      { label: 'Fold', value: 'Compact, self-standing' },
    ],
  },
  {
    brand: 'Cybex',
    match: /\blibelle\b/,
    description:
      'Cybex’s ultra-compact traveler: about 13 lbs and folds down to carry-on size, yet still reclines and holds a real toddler. Tiny fold, big-stroller lineage.',
    specs: [
      { label: 'Weight', value: '~13 lb' },
      { label: 'Folded', value: 'Cabin-bag size' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'From birth', value: 'With car seat + adapter' },
    ],
  },
  // ── Bugaboo ──
  {
    brand: 'Bugaboo',
    match: /\bfox\b/,
    description:
      'Bugaboo’s full-size flagship: a floaty, all-wheel-suspension ride with a huge reversible seat and included bassinet. The plushest push in the lineup.',
    specs: [
      { label: 'From birth', value: 'Included bassinet' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Suspension', value: 'All-wheel' },
      { label: 'Fold', value: 'One-piece, stands folded' },
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bbutterfly\b/,
    description:
      'Bugaboo’s cabin-size travel stroller: a genuinely compact one-hand fold that still reclines and holds a real toddler. The go-to for flying when full-size is overkill.',
    specs: [
      { label: 'Weight', value: '~16 lb' },
      { label: 'Folded', value: 'Fits most overhead bins' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'From birth', value: 'With car seat + adapter' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bdragonfly\b/,
    description:
      'Bugaboo’s modular city stroller: a lie-flat, reversible seat and a compact self-standing fold, positioned right between the compact Butterfly and the full-size Fox. Takes a car seat with the Bugaboo adapter.',
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 49 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bdonkey\b/,
    description:
      'The side-by-side that widens on the fly: roll single, then slide out a second seat to go double without a whole new frame. Wide, but wildly flexible for two-under-two.',
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Configurations', value: 'Single → side-by-side double' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Two-piece' },
    ],
  },
  // ── Silver Cross ──
  {
    brand: 'Silver Cross',
    match: /\breef\b/,
    description:
      'Silver Cross’s modular all-terrain flagship: big wheels, a folding bassinet that packs down, and a luxe seat. Rugged and refined at once.',
    specs: [
      { label: 'From birth', value: 'Folding bassinet included' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Tires', value: 'Large all-terrain' },
    ],
  },
  {
    brand: 'Silver Cross',
    match: /\bcove\b/,
    description:
      'A full-size, all-terrain ride that folds surprisingly small. RideTech wheels and real suspension eat up rough sidewalks, and the one-hand fold stands up on its own. Pairs with Nuna, Clek, Maxi-Cosi, and Cybex seats.',
    specs: [
      { label: 'Weight', value: '~25.5 lb' },
      { label: 'From birth', value: 'Lie-flat seat or optional bassinet' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
  },
  {
    brand: 'Silver Cross',
    match: /\bbreez\b/,
    description:
      'The mid-size of Silver Cross’s unfolding collection: a lighter, smaller-folding modular that still reclines flat and folds with the seat or bassinet attached. City-smart, adventure-ready.',
    specs: [
      { label: 'Weight', value: '~22.6 lb' },
      { label: 'From birth', value: 'Seat or optional bassinet' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
  },
  // ── Baby Jogger ──
  {
    brand: 'Baby Jogger',
    match: /\bcity mini\b/,
    description:
      'The everyday gold standard. That famous one-hand lift-strap fold, a comfy seat, and a price that makes sense. Not fancy, just the one that works trip after trip.',
    specs: [
      { label: 'From birth', value: 'With car seat or bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Fold', value: 'Signature one-hand quick-fold' },
      { label: 'Tires', value: 'All-terrain (GT/Air)' },
    ],
  },
  {
    brand: 'Baby Jogger',
    match: /\bcity select\b/,
    description:
      'The build-your-own-double: dozens of seat configurations, front-and-back or stadium seating, so it flexes from one child to two (or three) on one frame.',
    specs: [
      { label: 'From birth', value: 'With bassinet or car seat' },
      { label: 'Configurations', value: 'Single → double → triple' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Compact, stands folded' },
    ],
  },
  // ── Peg Perego ──
  {
    brand: 'Peg Perego',
    match: /\bcity loop\b/,
    description:
      'A compact city stroller with a tiny chassis that rides in your front or back seat instead of eating the whole trunk. Takes Peg’s own seats, and other brands too with the universal adapter.',
    specs: [
      { label: 'From birth', value: 'Reversible seat or infant car seat' },
      { label: 'Seat', value: 'Reversible, multi-recline' },
      { label: 'Fold', value: 'Compact chassis' },
      { label: 'Car seats', value: 'Peg Perego + universal adapter' },
    ],
  },
  // ── Joolz ──
  {
    brand: 'Joolz',
    match: /\bday\b/,
    description:
      'The design-forward full-size: an upright, roomy carrycot, a plush reversible seat, and sustainable fabrics. As much a piece of the nursery as a stroller.',
    specs: [
      { label: 'From birth', value: 'Included carrycot' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
  },
  {
    brand: 'Joolz',
    match: /\bhub/,
    description:
      'Joolz’s compact: one of the most portable frames out there that still takes a full carrycot, so it’s newborn-ready without feeling like a travel toy. Roomy basket, city-sized fold.',
    specs: [
      { label: 'Weight', value: '~19.4 lb with seat' },
      { label: 'From birth', value: 'Carrycot or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
  },
  // ── Mima ──
  {
    brand: 'Mima',
    match: /\bxari\b/,
    description:
      'The statement piece. A sculpted, leatherette pod seat unlike anything else on the sidewalk. Divisive, distinctive, and undeniably luxe. Takes Maxi-Cosi, Nuna, and Cybex seats with an adapter.',
    specs: [
      { label: 'From birth', value: 'Carrycot mode or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, 3 recline positions' },
      { label: 'Car seats', value: 'Maxi-Cosi / Nuna / Cybex (adapter)' },
    ],
  },
  // ── Thule ──
  {
    brand: 'Thule',
    match: /\burban glide|\bglide\b/,
    description:
      'The runner’s favorite: a locking swivel front wheel, air-filled tires, and a hand brake for downhill control. If your stroller time is also your workout, this is the one.',
    specs: [
      { label: 'Tires', value: 'Air-filled, all-terrain' },
      { label: 'Front wheel', value: 'Swivel with lock' },
      { label: 'Brake', value: 'Twist hand brake' },
      { label: 'From birth', value: 'With car seat + adapter' },
    ],
  },
  {
    brand: 'Thule',
    match: /\bshine\b/,
    description:
      'Thule’s compact everyday stroller: fully featured but city-sized, and travel-system ready when paired with a car seat. A tidy do-it-all for pavement life.',
    specs: [
      { label: 'From birth', value: 'With car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Multi-recline' },
      { label: 'Fold', value: 'Compact' },
    ],
  },
  // ── Graco ──
  {
    brand: 'Graco',
    match: /\bmodes\b/,
    description:
      'The value workhorse. Multiple ride modes, a reversible seat, and a real travel system with Graco’s own SnugRide seats. A whole lot of stroller for the money.',
    specs: [
      { label: 'From birth', value: 'With SnugRide infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Graco SnugRide (click-in)' },
    ],
  },
  // ── Chicco ──
  {
    brand: 'Chicco',
    match: /\bbravo\b/,
    description:
      'The easy-button travel system. Chicco’s KeyFit, the seat famous for its foolproof install, clicks right in, and the stroller folds with the seat still on. Simple, safe, done.',
    specs: [
      { label: 'From birth', value: 'With KeyFit infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Fold', value: 'One-hand, self-standing' },
      { label: 'Car seats', value: 'Chicco KeyFit / Fit2 (click-in)' },
    ],
  },
  // ── Mockingbird ──
  {
    brand: 'Mockingbird',
    match: /.*/,
    description:
      'The direct-to-consumer single-to-double: a modular frame that adds a second seat later for a fraction of the legacy brands, with a cult following for a reason. Value modularity, done well.',
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Configurations', value: 'Single → double (with second seat)' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Standing fold' },
    ],
  },
];

/** Resolve the curated profile for a stroller, or null if none is written yet. */
export function getStrollerProfile(brand: string, model: string): StrollerProfile | null {
  const b = norm(brand);
  const m = norm(model);
  return (
    PROFILES.find((profile) => norm(profile.brand) === b && profile.match.test(m)) ?? null
  );
}
