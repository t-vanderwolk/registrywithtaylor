/**
 * TMBC-toned stroller profiles: a short editorial description + key specs shown
 * on the travel-system results page when you check a stroller's compatible car
 * seats, and the source for the stroller Compare tool.
 *
 * This is a curated, expandable roster: add a profile object and it appears
 * automatically. Matching is brand + a model regex (tested against the
 * normalized model), so colour/year variants ("Vista V2", "Vista V3") resolve to
 * one profile. Strollers without a profile fall back to their catalog summary.
 *
 * Voice: witty, wise, real. Say the honest thing, skip the spec-sheet drone.
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
   * Compare-tool fields. `bestFor` answers "who is this actually for?";
   * `pros`/`cons` are the honest 2-4-item lists; `valueScore` (0-100,
   * quality-per-dollar) + `priceTier` feed the default "Taylor's Top Pick"
   * verdict when there's no curated matchup.
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
 * More specific matches are listed before their generic siblings (find-first).
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
    bestFor: 'Parents who want one polished full-size and would rather skip buying a separate bassinet.',
    priceTier: 'premium',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'Flat-fold seat or PIPA' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible, near-flat recline' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Seat lies flat enough to skip a separate bassinet',
      'All-wheel suspension for a smooth ride',
      'Magnetic buckle you’ll love by month three',
    ],
    cons: [
      'Only pairs with Nuna’s own PIPA seats',
      'Heavier than the compact crowd',
    ],
  },
  {
    brand: 'Nuna',
    match: /\btavo\b/,
    description:
      'The streamlined, budget-friendlier Nuna: a fixed forward-facing seat with the same clean look and a true one-hand fold. Lighter and simpler than the MIXX, and it clicks right onto a PIPA.',
    bestFor: 'PIPA owners who want the Nuna look without the full-size price or heft.',
    priceTier: 'mid',
    valueScore: 82,
    specs: [
      { label: 'From birth', value: 'With PIPA infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Forward-facing' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Lighter and simpler than the MIXX',
      'Clicks straight onto a PIPA — no adapter',
      'True one-hand fold',
    ],
    cons: [
      'Seat is forward-facing only — no parent-facing',
      'Doesn’t lie fully flat like the MIXX',
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
    bestFor: 'City parents who want Nuna comfort in a frame that fits a small trunk or a tight elevator.',
    priceTier: 'premium',
    valueScore: 80,
    specs: [
      { label: 'From birth', value: 'PIPA or TRIV bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Fold', value: 'Compact one-hand, stands folded' },
    ],
    pros: [
      'Compact fold that still takes a full bassinet',
      'Nuna ride quality in a lighter frame',
      'Clicks onto a PIPA — no adapter',
    ],
    cons: [
      'Pricey for its size',
      'Smaller basket than the full-size Nunas',
    ],
  },
  {
    brand: 'Nuna',
    match: /\bswiv\b/,
    description:
      'The TRIV’s sibling with a party trick: button-activated 360° swivel wheels that let all four turn for effortless pivots in tight spaces, plus a bigger basket.',
    bestFor: 'Tight-space parents who want effortless pivots and a bigger basket than the TRIV.',
    priceTier: 'premium',
    valueScore: 79,
    specs: [
      { label: 'From birth', value: 'PIPA or SWIV bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Wheels', value: '360° swivel drift mode' },
      { label: 'Basket', value: 'Up to 22 lb' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
    ],
    pros: [
      '360° swivel wheels pivot on a dime',
      'Bigger basket than the TRIV (up to 22 lb)',
      'Takes a bassinet and clicks onto a PIPA',
    ],
    cons: [
      'The swivel trick adds cost',
      'Premium price for a compact',
    ],
  },
  {
    brand: 'Nuna',
    match: /\bviaa\b/,
    description:
      'Nuna’s first cabin-approved travel stroller: 16 lbs, folds small enough for most overhead bins, and clicks straight onto a PIPA with no adapter. Built for parents who fly.',
    bestFor: 'Parents who fly and want a cabin-approved stroller that still clicks onto their PIPA.',
    priceTier: 'premium',
    valueScore: 81,
    specs: [
      { label: 'Weight', value: '16.3 lb' },
      { label: 'Folded', value: '20.5" × 16.5" × 9.5" (IATA cabin)' },
      { label: 'From birth', value: 'With PIPA infant seat' },
      { label: 'Car seats', value: 'Nuna PIPA (no adapter)' },
      { label: 'Extras', value: 'Carry bag included' },
    ],
    pros: [
      '16 lbs and fits most overhead bins',
      'Clicks onto a PIPA — no adapter',
      'Carry bag included',
    ],
    cons: [
      'Small seat and basket, as travel strollers go',
      'Premium price for a travel frame',
    ],
  },
  // ── Cybex ──
  {
    brand: 'Cybex',
    match: /\bpriam\b/,
    description:
      'Cybex’s flagship. A smooth, one-hand-fold luxury ride with in-seat suspension and a fashion collab for every season. Gorgeous and capable, just heavier and pricier than the mid-size crowd.',
    bestFor: 'Parents who want a head-turning luxury ride and don’t mind paying (and carrying) for it.',
    priceTier: 'luxury',
    valueScore: 80,
    specs: [
      { label: 'From birth', value: 'Lie-flat cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Suspension', value: 'All-wheel' },
      { label: 'Fold', value: 'One-hand' },
    ],
    pros: [
      'Gorgeous, with a fashion collab for every season',
      'In-seat suspension for a smooth glide',
      'Reversible seat, one-hand fold',
    ],
    cons: [
      'Heavier and pricier than the mid-size crowd',
      'Accessories add up fast',
    ],
  },
  {
    brand: 'Cybex',
    match: /\bbalios\b/,
    description:
      'The everyday Cybex: a genuinely roomy seat, big canopy, and forgiving price. A practical full-size that punches above its cost.',
    bestFor: 'Value hunters who want a roomy full-size that doesn’t cost a flagship price.',
    priceTier: 'mid',
    valueScore: 85,
    specs: [
      { label: 'From birth', value: 'With cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Genuinely roomy seat and big canopy',
      'Forgiving price for a full-size',
      'Reversible seat, one-hand fold',
    ],
    cons: [
      'Not as plush or refined as the Priam',
      'Heavier than a compact',
    ],
  },
  {
    brand: 'Cybex',
    match: /\bmios\b/,
    description:
      'Cybex’s compact-luxe pick: a lightweight, nimble frame with a surprisingly plush seat and the same designer fabrics as the Priam. City living without the full-size heft.',
    bestFor: 'City parents who want luxury-brand fabrics in a light, nimble frame.',
    priceTier: 'premium',
    valueScore: 81,
    specs: [
      { label: 'From birth', value: 'With cot or infant seat' },
      { label: 'Seat limit', value: 'Up to 37.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Compact one-hand' },
    ],
    pros: [
      'Lightweight and nimble for tight streets',
      'Surprisingly plush seat',
      'Same designer fabrics as the Priam',
    ],
    cons: [
      'Lower seat weight limit (~37.5 lb)',
      'Small basket',
    ],
  },
  {
    brand: 'Cybex',
    match: /\beezy s\b/,
    description:
      'An urban compact with a one-hand 360° rotating seat. Spin from parent-facing to world-facing in a second, then fold it small and self-standing to stow and go.',
    bestFor: 'Parents who want a one-hand spin from parent- to world-facing without a full-size frame.',
    priceTier: 'mid',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'With Cot S or infant seat' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Wheels', value: 'All-wheel suspension' },
      { label: 'Fold', value: 'Compact, self-standing' },
    ],
    pros: [
      'One-hand 360° rotating seat',
      'Folds small and stands on its own',
      'All-wheel suspension',
    ],
    cons: [
      'Single-only compact',
      'Rotating mechanism adds a little weight',
    ],
  },
  {
    brand: 'Cybex',
    match: /\blibelle\b/,
    description:
      'Cybex’s ultra-compact traveler: about 13 lbs and folds down to carry-on size, yet still reclines and holds a real toddler. Tiny fold, big-stroller lineage.',
    bestFor: 'Travel days where you want the smallest possible fold that still holds a real toddler.',
    priceTier: 'mid',
    valueScore: 88,
    specs: [
      { label: 'Weight', value: '~13 lb' },
      { label: 'Folded', value: 'Cabin-bag size' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'From birth', value: 'With car seat + adapter' },
    ],
    pros: [
      '~13 lbs and folds to carry-on size',
      'Still reclines and holds a real toddler',
      'Big-stroller lineage at a friendly price',
    ],
    cons: [
      'Basic seat padding for long days',
      'From-birth needs a car seat + adapter',
    ],
  },
  // ── Bugaboo ──
  {
    brand: 'Bugaboo',
    match: /\bfox\b/,
    description:
      'Bugaboo’s full-size flagship: a floaty, all-wheel-suspension ride with a huge reversible seat and included bassinet. The plushest push in the lineup.',
    bestFor: 'Parents who prize the push above all and want the plushest ride in the lineup.',
    priceTier: 'luxury',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'Included bassinet' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Suspension', value: 'All-wheel' },
      { label: 'Fold', value: 'One-piece, stands folded' },
    ],
    pros: [
      'The plushest, floatiest push here',
      'Huge reversible seat + included bassinet',
      'One-piece fold that stands on its own',
    ],
    cons: [
      'Premium price',
      'Large and heavy for small spaces',
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bbutterfly\b/,
    description:
      'Bugaboo’s cabin-size travel stroller: a genuinely compact one-hand fold that still reclines and holds a real toddler. The go-to for flying when full-size is overkill.',
    bestFor: 'Flying and city days when a full-size Bugaboo is overkill.',
    priceTier: 'premium',
    valueScore: 85,
    specs: [
      { label: 'Weight', value: '~16 lb' },
      { label: 'Folded', value: 'Fits most overhead bins' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'From birth', value: 'With car seat + adapter' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Genuinely compact one-hand fold',
      'Fits most overhead bins',
      'Still reclines for a real toddler',
    ],
    cons: [
      'From-birth needs a car seat + adapter',
      'Small basket',
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bdragonfly\b/,
    description:
      'Bugaboo’s modular city stroller: a lie-flat, reversible seat and a compact self-standing fold, positioned right between the compact Butterfly and the full-size Fox. Takes a car seat with the Bugaboo adapter.',
    bestFor: 'City parents who want lie-flat modularity between the compact Butterfly and full-size Fox.',
    priceTier: 'premium',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 49 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
    pros: [
      'Lie-flat, reversible seat',
      'Compact, self-standing fold',
      'Sits neatly between travel and full-size',
    ],
    cons: [
      'Car seat use needs the Bugaboo adapter',
      'Premium price for its size',
    ],
  },
  {
    brand: 'Bugaboo',
    match: /\bdonkey\b/,
    description:
      'The side-by-side that widens on the fly: roll single, then slide out a second seat to go double without a whole new frame. Wide, but wildly flexible for two-under-two.',
    bestFor: 'Two-under-two families who want to roll single today and slide out a second seat later.',
    priceTier: 'luxury',
    valueScore: 80,
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Configurations', value: 'Single → side-by-side double' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Two-piece' },
    ],
    pros: [
      'Widens from single to side-by-side double on the fly',
      'Wildly flexible for two kids',
      'Reversible seats',
    ],
    cons: [
      'Wide — mind your doorways',
      'Two-piece fold and a premium price',
    ],
  },
  // ── Silver Cross ──
  {
    brand: 'Silver Cross',
    match: /\breef\b/,
    description:
      'Silver Cross’s modular all-terrain flagship: big wheels, a folding bassinet that packs down, and a luxe seat. Rugged and refined at once.',
    bestFor: 'Parents who want rugged all-terrain wheels with a luxe, refined finish.',
    priceTier: 'luxury',
    valueScore: 81,
    specs: [
      { label: 'From birth', value: 'Folding bassinet included' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Tires', value: 'Large all-terrain' },
    ],
    pros: [
      'Big all-terrain wheels',
      'Folding bassinet that packs down',
      'Luxe seat and finish',
    ],
    cons: [
      'Heavy and premium-priced',
      'Large footprint',
    ],
  },
  {
    brand: 'Silver Cross',
    match: /\bcove\b/,
    description:
      'A full-size, all-terrain ride that folds surprisingly small. RideTech wheels and real suspension eat up rough sidewalks, and the one-hand fold stands up on its own. Pairs with Nuna, Clek, Maxi-Cosi, and Cybex seats.',
    bestFor: 'Parents who want a full-size, all-terrain ride that still folds small — with the seat or bassinet attached.',
    priceTier: 'premium',
    valueScore: 87,
    specs: [
      { label: 'Weight', value: '~25.5 lb' },
      { label: 'From birth', value: 'Lie-flat seat or optional bassinet' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
    pros: [
      'Real suspension eats up rough sidewalks',
      'Folds small and self-standing — with the seat still attached',
      'Folding bassinet skips the closet-furniture problem',
    ],
    cons: [
      'Fewer accessories than the legacy giants',
      'Premium (but fair) price',
    ],
  },
  {
    brand: 'Silver Cross',
    match: /\bbreez\b/,
    description:
      'The mid-size of Silver Cross’s unfolding collection: a lighter, smaller-folding modular that still reclines flat and folds with the seat or bassinet attached. City-smart, adventure-ready.',
    bestFor: 'Parents who want the Cove’s tricks in a lighter, smaller-folding frame.',
    priceTier: 'premium',
    valueScore: 85,
    specs: [
      { label: 'Weight', value: '~22.6 lb' },
      { label: 'From birth', value: 'Seat or optional bassinet' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, lie-flat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
    pros: [
      'Lighter and smaller-folding than the Cove',
      'Reclines flat, folds with the seat or bassinet on',
      'City-smart, adventure-ready',
    ],
    cons: [
      'Smaller wheels than the Cove',
      'Premium price for a mid-size',
    ],
  },
  // ── Baby Jogger ──
  {
    // GT / all-terrain variants first, then the lighter base City Mini.
    brand: 'Baby Jogger',
    match: /\bcity mini gt/,
    description:
      'The all-terrain City Mini: that famous one-hand quick-fold plus forever-air tires that shrug off gravel, grass, and beat-up sidewalks. The everyday workhorse that can also go off the pavement.',
    bestFor: 'Everyday parents who want the legendary quick-fold plus wheels that handle rough ground.',
    priceTier: 'mid',
    valueScore: 87,
    specs: [
      { label: 'From birth', value: 'With car seat or bassinet' },
      { label: 'Seat limit', value: 'Up to 65 lb' },
      { label: 'Tires', value: 'Forever-Air all-terrain' },
      { label: 'Fold', value: 'Signature one-hand quick-fold' },
    ],
    pros: [
      'That famous one-hand lift-strap fold',
      'All-terrain tires handle gravel, grass, and bad sidewalks',
      'High 65 lb seat limit — lasts well into the toddler years',
    ],
    cons: [
      'Doesn’t lie flat on its own — needs the car seat or bassinet for newborns',
      'Basket is on the smaller side',
    ],
  },
  {
    brand: 'Baby Jogger',
    match: /\bcity mini\b/,
    description:
      'The everyday gold standard. That famous one-hand lift-strap fold, a comfy seat, and a price that makes sense. Not fancy — just the one that works trip after trip.',
    bestFor: 'Parents who want the legendary quick-fold in the lightest, simplest, best-value package.',
    priceTier: 'budget',
    valueScore: 86,
    specs: [
      { label: 'From birth', value: 'With car seat or bassinet' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Fold', value: 'Signature one-hand quick-fold' },
      { label: 'Weight', value: 'Light, forever-air wheels' },
    ],
    pros: [
      'Legendary one-hand lift-strap fold',
      'Comfortable seat at a sane price',
      'Light and simple — the one that just works',
    ],
    cons: [
      'Doesn’t recline flat for newborns on its own',
      'Not the go-anywhere GT — best on pavement and packed paths',
    ],
  },
  {
    brand: 'Baby Jogger',
    match: /\bcity select\b/,
    description:
      'The build-your-own-double: dozens of seat configurations, front-and-back or stadium seating, so it flexes from one child to two (or three) on one frame.',
    bestFor: 'Build-your-own-double families who want to configure one frame for one, two, or three kids.',
    priceTier: 'mid',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'With bassinet or car seat' },
      { label: 'Configurations', value: 'Single → double → triple' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Compact, stands folded' },
    ],
    pros: [
      'Dozens of seat configurations',
      'Front-and-back or stadium seating',
      'Grows from single to double to triple',
    ],
    cons: [
      'Heavy, especially doubled up',
      'Newborn use needs a bassinet or car seat',
    ],
  },
  // ── Peg Perego ──
  {
    brand: 'Peg Perego',
    match: /\bcity loop\b/,
    description:
      'A compact city stroller with a tiny chassis that rides in your front or back seat instead of eating the whole trunk. Takes Peg’s own seats, and other brands too with the universal adapter.',
    bestFor: 'City drivers who want a chassis that rides in the car seat instead of eating the whole trunk.',
    priceTier: 'mid',
    valueScore: 82,
    specs: [
      { label: 'From birth', value: 'Reversible seat or infant car seat' },
      { label: 'Seat', value: 'Reversible, multi-recline' },
      { label: 'Fold', value: 'Compact chassis' },
      { label: 'Car seats', value: 'Peg Perego + universal adapter' },
    ],
    pros: [
      'Tiny chassis fits in your front or back seat',
      'Reversible, multi-recline seat',
      'Takes other brands with the universal adapter',
    ],
    cons: [
      'Smaller wheels — best on pavement',
      'Less common here, so fewer accessories',
    ],
  },
  // ── Joolz ──
  {
    brand: 'Joolz',
    match: /\bday\b/,
    description:
      'The design-forward full-size: an upright, roomy carrycot, a plush reversible seat, and sustainable fabrics. As much a piece of the nursery as a stroller.',
    bestFor: 'Design lovers who want a roomy, upright carrycot and sustainable fabrics.',
    priceTier: 'premium',
    valueScore: 82,
    specs: [
      { label: 'From birth', value: 'Included carrycot' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'One-hand, stands folded' },
    ],
    pros: [
      'Upright, roomy carrycot',
      'Plush reversible seat',
      'Sustainable fabrics, nursery-pretty',
    ],
    cons: [
      'Premium price',
      'Larger fold than the compacts',
    ],
  },
  {
    brand: 'Joolz',
    match: /\bhub/,
    description:
      'Joolz’s compact: one of the most portable frames out there that still takes a full carrycot, so it’s newborn-ready without feeling like a travel toy. Roomy basket, city-sized fold.',
    bestFor: 'City parents who want one of the most portable frames that still takes a full carrycot.',
    priceTier: 'premium',
    valueScore: 83,
    specs: [
      { label: 'Weight', value: '~19.4 lb with seat' },
      { label: 'From birth', value: 'Carrycot or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
    pros: [
      'One of the most portable full-carrycot frames',
      'Roomy basket for its size',
      'One-hand, self-standing fold',
    ],
    cons: [
      'Car seat use needs an adapter',
      'Premium price for a compact',
    ],
  },
  // ── Mima ──
  {
    brand: 'Mima',
    match: /\bxari\b/,
    description:
      'The statement piece. A sculpted, leatherette pod seat unlike anything else on the sidewalk. Divisive, distinctive, and undeniably luxe. Takes Maxi-Cosi, Nuna, and Cybex seats with an adapter.',
    bestFor: 'Parents who want a true statement piece and don’t mind paying for the look.',
    priceTier: 'luxury',
    valueScore: 72,
    specs: [
      { label: 'From birth', value: 'Carrycot mode or car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 55 lb' },
      { label: 'Seat', value: 'Reversible, 3 recline positions' },
      { label: 'Car seats', value: 'Maxi-Cosi / Nuna / Cybex (adapter)' },
    ],
    pros: [
      'A sculpted, leatherette pod unlike anything on the sidewalk',
      'Undeniably luxe',
      'Takes Maxi-Cosi, Nuna, and Cybex seats with an adapter',
    ],
    cons: [
      'Divisive design — you’ll either love it or you won’t',
      'Form over function, at a luxury price',
    ],
  },
  // ── Thule ──
  {
    brand: 'Thule',
    match: /\burban glide|\bglide\b/,
    description:
      'The runner’s favorite: a locking swivel front wheel, air-filled tires, and a hand brake for downhill control. If your stroller time is also your workout, this is the one.',
    bestFor: 'Parents whose stroller time doubles as their workout.',
    priceTier: 'mid',
    valueScore: 86,
    specs: [
      { label: 'Tires', value: 'Air-filled, all-terrain' },
      { label: 'Front wheel', value: 'Swivel with lock' },
      { label: 'Brake', value: 'Twist hand brake' },
      { label: 'From birth', value: 'With car seat + adapter' },
    ],
    pros: [
      'Air-filled tires and a locking swivel front wheel',
      'Hand brake for downhill control',
      'Smooth and stable at a jog',
    ],
    cons: [
      'Big footprint — not a city compact',
      'From-birth needs a car seat + adapter',
    ],
  },
  {
    brand: 'Thule',
    match: /\bshine\b/,
    description:
      'Thule’s compact everyday stroller: fully featured but city-sized, and travel-system ready when paired with a car seat. A tidy do-it-all for pavement life.',
    bestFor: 'Pavement parents who want a fully featured everyday stroller in a city size.',
    priceTier: 'mid',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'With car seat + adapter' },
      { label: 'Seat limit', value: 'Up to 48.5 lb' },
      { label: 'Seat', value: 'Multi-recline' },
      { label: 'Fold', value: 'Compact' },
    ],
    pros: [
      'Fully featured but city-sized',
      'Travel-system ready with a car seat',
      'Multi-recline seat',
    ],
    cons: [
      'Not built for rough terrain',
      'From-birth needs a car seat + adapter',
    ],
  },
  // ── Graco ──
  {
    brand: 'Graco',
    match: /\bmodes\b/,
    description:
      'The value workhorse. Multiple ride modes, a reversible seat, and a real travel system with Graco’s own SnugRide seats. A whole lot of stroller for the money.',
    bestFor: 'Budget-minded parents who want a real travel system without overspending.',
    priceTier: 'budget',
    valueScore: 85,
    specs: [
      { label: 'From birth', value: 'With SnugRide infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Graco SnugRide (click-in)' },
    ],
    pros: [
      'Multiple ride modes and a reversible seat',
      'Real travel system with Graco’s SnugRide',
      'A whole lot of stroller for the money',
    ],
    cons: [
      'Heavier and bulkier than premium frames',
      'Basic ride feel next to the luxury crowd',
    ],
  },
  // ── Chicco ──
  {
    brand: 'Chicco',
    match: /\bbravo\b/,
    description:
      'The easy-button travel system. Chicco’s KeyFit, the seat famous for its foolproof install, clicks right in, and the stroller folds with the seat still on. Simple, safe, done.',
    bestFor: 'Parents who want the easiest, most foolproof travel system to start with.',
    priceTier: 'budget',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'With KeyFit infant seat' },
      { label: 'Seat limit', value: 'Up to 50 lb' },
      { label: 'Fold', value: 'One-hand, self-standing' },
      { label: 'Car seats', value: 'Chicco KeyFit / Fit2 (click-in)' },
    ],
    pros: [
      'KeyFit — the famously foolproof infant seat — clicks right in',
      'Folds with the seat still on',
      'Simple, safe, done',
    ],
    cons: [
      'Forward-facing seat only',
      'Heavier for its class',
    ],
  },
  // ── Cybex (more) ──
  {
    brand: 'Cybex',
    match: /\bgazelle\b/,
    description:
      'Cybex’s modular workhorse that turns into a double: an oversized shopping basket, an expandable frame, and a reversible seat. The rare stroller built for errands and a second kid.',
    bestFor: 'Errand-heavy parents who want a giant basket now and the option to add a second seat later.',
    priceTier: 'premium',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'Cot S or infant seat' },
      { label: 'Configurations', value: 'Single → double' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Basket', value: 'Oversized shopping basket' },
    ],
    pros: ['Expands from single to double', 'Enormous shopping basket', 'Reversible seat'],
    cons: ['Heavy and long once doubled', 'Ride is firmer than the plush crowd'],
  },
  {
    brand: 'Cybex',
    match: /\bcoya\b/,
    description:
      'Cybex’s ultra-compact luxury: a one-hand fold small enough for a cabin bag, with Platinum-level fabrics and a surprisingly plush seat. Little footprint, big-brand feel.',
    bestFor: 'City and travel parents who want luxury materials in the smallest possible fold.',
    priceTier: 'premium',
    valueScore: 82,
    specs: [
      { label: 'Weight', value: '~13.7 lb' },
      { label: 'Folded', value: 'Cabin-bag size' },
      { label: 'From birth', value: 'With cot or infant seat' },
      { label: 'Fold', value: 'One-hand, self-standing' },
    ],
    pros: ['Tiny one-hand, self-standing fold', 'Platinum-level fabrics', 'Plush for its size'],
    cons: ['Small basket', 'Luxury price for a compact'],
  },
  // ── Bumbleride ──
  {
    brand: 'Bumbleride',
    match: /\bindie\b/,
    description:
      'The eco-minded all-terrain: air-filled tires, real suspension, and 100% recycled fabrics. A jogger-adjacent everyday stroller for parents who hit trails and care about materials.',
    bestFor: 'Active, sustainability-minded parents who want all-terrain wheels without a full jogger.',
    priceTier: 'premium',
    valueScore: 85,
    specs: [
      { label: 'Tires', value: 'Air-filled, all-terrain' },
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Seat', value: 'Multi-recline' },
      { label: 'Fabrics', value: '100% recycled' },
    ],
    pros: ['Air tires + suspension handle trails', 'Made from recycled fabrics', 'Reclines flat with the bassinet'],
    cons: ['Air tires need occasional topping up', 'Premium price'],
  },
  {
    brand: 'Bumbleride',
    match: /\bera\b/,
    description:
      'Bumbleride’s city full-size: the same recycled fabrics and smooth ride as the Indie, tuned for pavement with a reversible seat and a slimmer frame.',
    bestFor: 'City parents who love the Bumbleride ethos but want a slimmer, pavement-first frame.',
    priceTier: 'premium',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Seat', value: 'Reversible, multi-recline' },
      { label: 'Fabrics', value: '100% recycled' },
      { label: 'Fold', value: 'Compact' },
    ],
    pros: ['Reversible seat, smooth city ride', 'Recycled fabrics', 'Slimmer than the Indie'],
    cons: ['Not built for rough terrain like the Indie', 'Premium price'],
  },
  // ── Britax ──
  {
    brand: 'Britax',
    match: /\bgrove\b/,
    description:
      'Britax’s modular everyday stroller: a reversible seat, a newborn-ready setup, and a compact one-hand fold, at a friendlier price than the European modulars.',
    bestFor: 'Parents who want modular, reversible-seat features without the premium-brand price.',
    priceTier: 'mid',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'With bassinet or infant seat' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Compact, one-hand' },
      { label: 'Car seats', value: 'Britax (click-in)' },
    ],
    pros: ['Reversible seat at a mid-size price', 'Compact one-hand fold', 'Britax car seats click right in'],
    cons: ['Ride isn’t as plush as premium modulars', 'Newer to the modular game'],
  },
  {
    brand: 'Britax',
    match: /\bbrook\b/,
    description:
      'Britax’s coordinated travel system: the Willow infant seat and Brook stroller built to work together out of the box, with an easy click-in and a self-standing fold.',
    bestFor: 'Parents who want a matched Britax travel system in one purchase.',
    priceTier: 'mid',
    valueScore: 82,
    specs: [
      { label: 'From birth', value: 'With Willow infant seat' },
      { label: 'Fold', value: 'Self-standing' },
      { label: 'Car seats', value: 'Britax Willow (click-in)' },
      { label: 'Seat', value: 'Multi-recline' },
    ],
    pros: ['Infant seat + stroller built to match', 'Easy click-in travel system', 'Self-standing fold'],
    cons: ['Best bought as a Britax bundle', 'Heavier for its class'],
  },
  // ── Ergobaby ──
  {
    brand: 'Ergobaby',
    match: /\bmetro\b/,
    description:
      'Ergobaby’s compact everyday: a one-hand fold, a near-flat recline, and a comfy seat in a lightweight frame. Travel-friendly, but it still works for daily life.',
    bestFor: 'Parents who want one lightweight, compact stroller for both errands and travel.',
    priceTier: 'mid',
    valueScore: 84,
    specs: [
      { label: 'Weight', value: '~20 lb' },
      { label: 'From birth', value: 'Near-flat recline or car seat + adapter' },
      { label: 'Fold', value: 'One-hand, compact' },
      { label: 'Seat', value: 'Multi-recline' },
    ],
    pros: ['One-hand compact fold', 'Reclines nearly flat for newborns', 'Comfortable for a lightweight'],
    cons: ['Smaller wheels — pavement-first', 'Basket on the smaller side'],
  },
  // ── Evenflo ──
  {
    brand: 'Evenflo',
    match: /\bpivot xpand/,
    description:
      'The budget single-to-double: a modular frame that adds a second seat for far less than the premium convertibles. A lot of flexibility for the money.',
    bestFor: 'Budget-minded growing families who want single-to-double flexibility.',
    priceTier: 'budget',
    valueScore: 84,
    specs: [
      { label: 'From birth', value: 'With SafeMax infant seat or bassinet' },
      { label: 'Configurations', value: 'Single → double' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Car seats', value: 'Evenflo (click-in)' },
    ],
    pros: ['Converts to a double at a budget price', 'Reversible seat', 'Real travel system with Evenflo seats'],
    cons: ['Heavier and bulkier than premium frames', 'Ride feel is basic'],
  },
  {
    brand: 'Evenflo',
    match: /\bshyft\b/,
    description:
      'Evenflo’s easy travel system: the infant seat clicks in, the stroller folds compact, and it all comes together at a wallet-friendly price.',
    bestFor: 'First-time parents who want a simple, affordable travel system.',
    priceTier: 'budget',
    valueScore: 82,
    specs: [
      { label: 'From birth', value: 'With SafeMax infant seat' },
      { label: 'Fold', value: 'Compact, self-standing' },
      { label: 'Car seats', value: 'Evenflo SafeMax (click-in)' },
      { label: 'Seat', value: 'Multi-recline' },
    ],
    pros: ['Simple, affordable travel system', 'Compact self-standing fold', 'Infant seat clicks right in'],
    cons: ['Forward-facing seat only', 'Basic materials'],
  },
  // ── BOB ──
  {
    brand: 'BOB',
    match: /\brevolution\b/,
    description:
      'The gold-standard jogger: air-filled tires, a locking swivel front wheel, and adjustable suspension that soaks up any terrain. Built for runners and rough ground.',
    bestFor: 'Runners and off-pavement parents who want a true, capable jogging stroller.',
    priceTier: 'premium',
    valueScore: 86,
    specs: [
      { label: 'Tires', value: 'Air-filled, all-terrain' },
      { label: 'Front wheel', value: 'Swivel with lock' },
      { label: 'Suspension', value: 'Adjustable' },
      { label: 'From birth', value: 'With car seat + adapter' },
    ],
    pros: ['Handles any terrain at a jog', 'Adjustable suspension', 'Locking swivel front wheel'],
    cons: ['Big and heavy — not a city compact', 'From-birth needs a car seat + adapter'],
  },
  // ── Chicco (more) ──
  {
    brand: 'Chicco',
    match: /\bcorso\b/,
    description:
      'Chicco’s modular step-up: a reversible seat, a smooth ride, and the same foolproof KeyFit click-in Chicco is known for. Modular features without the European price.',
    bestFor: 'KeyFit owners who want a reversible-seat modular that stays easy to use.',
    priceTier: 'mid',
    valueScore: 83,
    specs: [
      { label: 'From birth', value: 'With KeyFit infant seat or bassinet' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Self-standing' },
      { label: 'Car seats', value: 'Chicco KeyFit (click-in)' },
    ],
    pros: ['Reversible seat and smooth ride', 'Foolproof KeyFit click-in', 'Self-standing fold'],
    cons: ['Heavier than the Bravo', 'Fewer configurations than premium modulars'],
  },
  // ── Mockingbird ──
  {
    brand: 'Mockingbird',
    match: /.*/,
    description:
      'The direct-to-consumer single-to-double: a modular frame that adds a second seat later for a fraction of the legacy brands, with a cult following for a reason. Value modularity, done well.',
    bestFor: 'Value-minded families who want single-to-double modularity without legacy-brand prices.',
    priceTier: 'mid',
    valueScore: 88,
    specs: [
      { label: 'From birth', value: 'Bassinet or car seat + adapter' },
      { label: 'Configurations', value: 'Single → double (with second seat)' },
      { label: 'Seat', value: 'Reversible' },
      { label: 'Fold', value: 'Standing fold' },
    ],
    pros: [
      'Adds a second seat for a fraction of the legacy brands',
      'Cult following for a reason',
      'Reversible seat, standing fold',
    ],
    cons: [
      'Direct-to-consumer, so you can’t test it in a store first',
      'Ride isn’t quite as plush as the premium frames',
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
