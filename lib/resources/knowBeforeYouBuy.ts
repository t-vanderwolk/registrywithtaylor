/**
 * Content model for the "Know Before You Buy" educational hub (/resources).
 *
 * Everything here is plain data so the page stays modular and expandable — add a
 * glossary term, a category, or a note without touching layout. Category CTAs
 * deep-link into the filtered Stroller Finder via `strollerFinderCategoryHref`.
 */

export const STROLLER_FINDER_BASE = '/tools/stroller-finder';

/** Deep-link to the Stroller Finder pre-filtered to a category (its finder slug). */
export function strollerFinderCategoryHref(categorySlug: string) {
  return `${STROLLER_FINDER_BASE}?category=${encodeURIComponent(categorySlug)}`;
}

export type StartCard = {
  prompt: string;
  action: string;
  cta: string;
  href: string;
};

export const startCards: StartCard[] = [
  {
    prompt: 'Not sure what stroller fits your lifestyle?',
    action: 'Take the Stroller Quiz',
    cta: 'Start Quiz',
    href: '/tools/stroller-quiz',
  },
  {
    prompt: 'Already know what type of stroller you want?',
    action: 'Browse the Stroller Finder',
    cta: 'Browse Strollers',
    href: '/tools/stroller-finder',
  },
  {
    prompt: 'Already picked a stroller?',
    action: 'Find compatible infant car seats.',
    cta: 'Travel System Checker',
    href: '/tools/travel-system',
  },
];

export type StrollerCategoryEntry = {
  name: string;
  /** Matches the Stroller Finder category slug so the CTA deep-links correctly. */
  slug: string;
  blurb: string;
};

export const strollerCategories: StrollerCategoryEntry[] = [
  {
    name: 'Full Size',
    slug: 'full-size',
    blurb: 'Roomy, feature-rich strollers built to be your everyday workhorse from newborn through toddler.',
  },
  {
    name: 'Compact / Mid-Size',
    slug: 'compact',
    blurb: 'Lighter, smaller-folding strollers that still recline deep and take a car seat — the city sweet spot.',
  },
  {
    name: 'Travel',
    slug: 'travel',
    blurb: 'Ultra-light, cabin-friendly folds made for airports, rideshares, and grab-and-go days.',
  },
  {
    name: 'Umbrella',
    slug: 'umbrella',
    blurb: 'Bare-bones, feather-light strollers for the toddler years and quick errands.',
  },
  {
    name: 'Jogging',
    slug: 'jogging',
    blurb: 'Air-filled tires and a lockable front wheel for running, trails, and bumpy sidewalks.',
  },
  {
    name: 'Double',
    slug: 'double',
    blurb: 'Side-by-side or inline seating for two — twins, or a toddler and a new baby.',
  },
  {
    name: 'Double Jogging',
    slug: 'double-jogging',
    blurb: 'Two seats built to run: all-terrain tires and a hand brake for the long haul.',
  },
  {
    name: 'Stroller Wagon',
    slug: 'wagon',
    blurb: 'Push-or-pull wagons that seat multiple kids and haul everything else.',
  },
  {
    name: 'Single-to-Double',
    slug: 'convertible-modular',
    blurb: 'Starts as one seat and adds a second later, so it grows with your family.',
  },
];

export type SingleToDoubleCard = {
  title: string;
  body: string;
};

export const singleToDoubleCards: SingleToDoubleCard[] = [
  {
    title: 'Fully Modular',
    body: 'Any seat goes in any position — bassinet, toddler seat, or car seat, upper or lower — and you add a matching second seat whenever you’re ready. Maximum flexibility, and usually the higher price.',
  },
  {
    title: 'Convertible',
    body: 'It becomes a double, but the two positions aren’t interchangeable. The second child usually needs a specific seat (often a dedicated lower or rumble seat), and some configurations are fixed — so what clicks where matters.',
  },
];

export const singleToDoubleTaylorsNote =
  'I see this one constantly: a family is gifted an extra Vista toddler seat, assuming it will turn their stroller into a double. But the lower position on the Vista needs the dedicated RumbleSeat — a standard toddler seat won’t click into the bottom. So they end up with a beautiful, unusable second seat still in the box. Confirm exactly which seat goes in which position before anyone buys the “second seat.”';

export type GlossaryTerm = {
  term: string;
  definition: string;
  whyItMatters: string;
};

export const carSeatGlossary: GlossaryTerm[] = [
  {
    term: 'Infant Car Seat',
    definition: 'A rear-facing-only seat with a carry handle and a detachable base, sized for newborns up to roughly 30–35 lbs.',
    whyItMatters: 'It clicks in and out of the car in seconds and usually snaps onto a stroller — the easiest option for the first year, but you will outgrow it.',
  },
  {
    term: 'Convertible Car Seat',
    definition: 'A larger seat that starts rear-facing for babies and later converts to forward-facing for toddlers, staying in the car.',
    whyItMatters: 'It lasts for years and can skip the infant-seat stage — but it does not carry the baby or click onto a stroller.',
  },
  {
    term: 'Booster',
    definition: 'A seat that lifts an older child so the vehicle’s own seat belt crosses the shoulder and hips correctly.',
    whyItMatters: 'It is the last stage before a child uses the belt alone — no harness, just proper belt positioning.',
  },
  {
    term: 'All-in-One',
    definition: 'One seat that spans every stage: rear-facing infant, forward-facing toddler, and booster.',
    whyItMatters: 'Buy-once in theory — just know it is bulky in the newborn stage and will not carry or click onto a stroller.',
  },
  {
    term: 'Travel System',
    definition: 'A stroller and infant car seat designed to work together — the seat clicks onto the stroller frame.',
    whyItMatters: 'It is how you move a sleeping baby from car to stroller without waking them. This is the pairing worth checking first.',
  },
  {
    term: 'Car Seat Adapter',
    definition: 'A small bracket that lets a specific infant car seat click onto a specific stroller.',
    whyItMatters: 'Same-brand pairs often click directly, but most cross-brand combos need the exact adapter — the single most common thing people buy wrong.',
  },
  {
    term: 'Load Leg',
    definition: 'A support bar that extends from the car seat base down to the vehicle floor.',
    whyItMatters: 'It absorbs crash forces and reduces rebound motion — a meaningful safety feature worth looking for.',
  },
  {
    term: 'European Belt Path',
    definition: 'A routing that wraps the vehicle seat belt around the back of the car seat for a baseless install.',
    whyItMatters: 'It adds stability when you install without the base — handy for taxis, rideshares, and travel.',
  },
  {
    term: 'Anti-Rebound Bar',
    definition: 'A bar at the front of a rear-facing seat or base that braces against the vehicle seat.',
    whyItMatters: 'It limits how far the seat rotates toward the seatback in a crash — another passive safety plus.',
  },
  {
    term: 'Baseless Installation',
    definition: 'Securing an infant car seat with just the vehicle seat belt, no base.',
    whyItMatters: 'It is what makes a seat rideshare- and travel-friendly — check that yours is rated for it and learn the belt path.',
  },
  {
    term: 'LATCH',
    definition: 'Lower Anchors and Tethers for Children — built-in anchors in your car for installing a seat without the seat belt.',
    whyItMatters: 'It is often easier to get a tight, correct install with LATCH, but there are weight limits where you switch back to the belt.',
  },
];

export const strollerGlossary: GlossaryTerm[] = [
  {
    term: 'Modular',
    definition: 'A stroller whose seat can be swapped or reconfigured — bassinet, toddler seat, or car seat, often facing either way.',
    whyItMatters: 'Modularity is what lets one frame grow from newborn to toddler, and sometimes from single to double.',
  },
  {
    term: 'Reversible Seat',
    definition: 'A seat that can face either the parent or the world without buying a second seat.',
    whyItMatters: 'Newborns love facing you; curious toddlers want to see out — reversible does both.',
  },
  {
    term: 'Parent Facing',
    definition: 'The seat faces back toward whoever is pushing.',
    whyItMatters: 'Best for newborns and for bonding — you can see the baby and they can see you.',
  },
  {
    term: 'World Facing',
    definition: 'The seat faces forward, away from the person pushing.',
    whyItMatters: 'Older babies and toddlers usually prefer watching the world go by.',
  },
  {
    term: 'Bassinet',
    definition: 'A flat, enclosed carrycot that attaches to the frame so a newborn can lie fully flat.',
    whyItMatters: 'Fully flat is healthiest for a newborn’s breathing and spine; some bassinets double as an overnight sleeper.',
  },
  {
    term: 'Near Flat Recline',
    definition: 'A seat that reclines to almost horizontal, though not a true flat bassinet.',
    whyItMatters: 'It is the line between newborn-ready with just the seat versus needing a separate bassinet or car seat.',
  },
  {
    term: 'One-Hand Fold',
    definition: 'The stroller collapses with a single hand.',
    whyItMatters: 'You will be holding a baby, a coffee, or both — one-hand fold is a daily-life feature, not a luxury.',
  },
  {
    term: 'Self Standing Fold',
    definition: 'The folded stroller stands upright on its own.',
    whyItMatters: 'It does not flop onto the dirty garage floor and it tucks into a closet or trunk neatly.',
  },
  {
    term: 'Travel System Ready',
    definition: 'The stroller accepts an infant car seat, directly or with an adapter.',
    whyItMatters: 'This is the compatibility question — confirm which seats and which adapter before you buy either half.',
  },
  {
    term: 'Suspension',
    definition: 'Shock-absorbing components at the wheels.',
    whyItMatters: 'Good suspension smooths out cracked sidewalks, cobblestones, and curbs so the baby keeps sleeping.',
  },
  {
    term: 'All Terrain',
    definition: 'Built for grass, gravel, trails, and snow, usually with larger tires.',
    whyItMatters: 'If your walks leave the pavement, all-terrain is the difference between gliding and fighting the stroller.',
  },
  {
    term: 'Air Filled Tires',
    definition: 'Pneumatic (inflatable) rubber tires, like a bike’s.',
    whyItMatters: 'The smoothest ride over rough ground — but they can go flat and need occasional air.',
  },
  {
    term: 'Foam Filled Tires',
    definition: 'Solid or foam-core tires that never need inflating.',
    whyItMatters: 'Nearly as smooth as air, with zero flats — low-maintenance for everyday use.',
  },
  {
    term: 'Swivel Lock Wheel',
    definition: 'Front wheels that swivel for tight turns and lock straight for stability.',
    whyItMatters: 'Unlocked for the grocery store, locked for jogging or bumpy terrain.',
  },
  {
    term: 'Adjustable Handlebar',
    definition: 'A handle that raises and lowers to fit the person pushing.',
    whyItMatters: 'Saves your back and wrists when caregivers are different heights — an underrated comfort feature.',
  },
  {
    term: 'Basket Capacity',
    definition: 'How much weight the under-seat storage basket holds, and how easy it is to reach.',
    whyItMatters: 'Diaper bags, groceries, and toddler shoes add up fast — a bigger, reachable basket earns its keep.',
  },
  {
    term: 'Weight Limit',
    definition: 'The maximum child weight (and sometimes height) a seat supports.',
    whyItMatters: 'It tells you how many years you will actually get before you are shopping again.',
  },
  {
    term: 'Flip-Flop Friendly',
    definition: 'A brake you can set with an open-toed shoe without stubbing or scraping your foot.',
    whyItMatters: 'Sounds trivial until summer — you will set the brake dozens of times a day.',
  },
];

export type TaylorsNoteEntry = {
  body: string;
};

export const taylorsNotes: TaylorsNoteEntry[] = [
  { body: 'If you have to watch a YouTube video every time you fold your stroller, that’s probably not your stroller.' },
  { body: 'A beautiful stroller you hate folding quickly becomes an expensive garage decoration.' },
  { body: 'Shopping for baby gear shouldn’t feel like studying for a final exam.' },
];

export type WhatsNextEntry = {
  prompt: string;
  action: string;
  href: string;
};

export const whatsNext: WhatsNextEntry[] = [
  { prompt: 'Still deciding?', action: 'Take the Stroller Quiz', href: '/tools/stroller-quiz' },
  { prompt: 'Already know your stroller?', action: 'Check compatible car seats', href: '/tools/travel-system' },
  { prompt: 'Want personalized recommendations?', action: 'Book a Registry Consult', href: '/book' },
];

export type ToolCardEntry = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

export const freeTools: ToolCardEntry[] = [
  {
    title: 'Stroller Quiz',
    description: 'Find the stroller category that actually fits your life.',
    href: '/tools/stroller-quiz',
    cta: 'Take the Quiz',
    image: '/assets/editorial/gear.jpg',
    imageAlt: 'Stroller quiz',
  },
  {
    title: 'Stroller Finder',
    description: 'Browse strollers by brand, type, price, and features.',
    href: '/tools/stroller-finder',
    cta: 'Browse Strollers',
    image: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller finder',
  },
  {
    title: 'Travel System Checker',
    description: 'Check stroller and infant car seat compatibility before you buy the wrong adapter.',
    href: '/tools/travel-system',
    cta: 'Check Compatibility',
    image: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Travel system compatibility checker',
  },
];
