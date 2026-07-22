/**
 * Content model for the "Know Before You Buy" educational hub (/resources).
 *
 * Voice: witty, wise, real, relatable. No em or en dashes anywhere. Keep it
 * sounding like Taylor, not a robot. Everything here is plain data so the page
 * stays modular and expandable.
 */

export const STROLLER_FINDER_BASE = '/tools/stroller-finder';

/** Deep-link to the Stroller Finder pre-filtered to a category (its finder slug). */
export function strollerFinderCategoryHref(categorySlug: string) {
  return `${STROLLER_FINDER_BASE}?category=${encodeURIComponent(categorySlug)}`;
}

/** Deep-link to the Stroller Finder opened on a specific brand's page. */
export function strollerFinderBrandHref(brand: string) {
  return `${STROLLER_FINDER_BASE}?brand=${encodeURIComponent(brand)}`;
}

export type StartCard = {
  prompt: string;
  action: string;
  cta: string;
  href: string;
};

export const startCards: StartCard[] = [
  {
    prompt: 'Not sure what kind of stroller fits your life?',
    action: 'Take the Stroller Quiz',
    cta: 'Start Quiz',
    href: '/tools/stroller-quiz',
  },
  {
    prompt: 'Already know the type you want?',
    action: 'Browse the Stroller Finder',
    cta: 'Browse Strollers',
    href: '/tools/stroller-finder',
  },
  {
    prompt: 'Torn between a few strollers?',
    action: 'Compare Strollers Side by Side',
    cta: 'Compare Strollers',
    href: '/tools/compare',
  },
  {
    prompt: 'Already picked your stroller?',
    action: 'Find the car seats that click right in.',
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
    blurb: 'The everyday workhorse. Roomy, cushy, loaded with features, and happy to haul your baby from newborn all the way through the toddler years.',
  },
  {
    name: 'Compact / Mid-Size',
    slug: 'compact',
    blurb: 'Lighter and smaller when it folds, but it still reclines deep and takes a car seat. The sweet spot for city life and small trunks.',
  },
  {
    name: 'Travel',
    slug: 'travel',
    blurb: 'Feather light and folds tiny enough for the overhead bin. Your airport, rideshare, and quick errand hero.',
  },
  {
    name: 'Umbrella',
    slug: 'umbrella',
    blurb: 'Barely there and barely costs anything. The throw it in the car and go pick for the toddler years.',
  },
  {
    name: 'Jogging',
    slug: 'jogging',
    blurb: 'Air tires and a locking front wheel so you can actually run. Great on trails and terrible sidewalks alike.',
  },
  {
    name: 'Double',
    slug: 'double',
    blurb: 'Two seats, side by side or front to back. For twins, or for a toddler plus a brand new baby.',
  },
  {
    name: 'Stroller Wagon',
    slug: 'wagon',
    blurb: 'Part stroller, part cargo ship. Seats a couple of kids and swallows everything else you are carrying.',
  },
  {
    name: 'Single-to-Double',
    slug: 'convertible-modular',
    blurb: 'Starts as one seat and grows a second when you need it. The stroller that plans ahead so you do not have to.',
  },
];

export type SingleToDoubleCard = {
  title: string;
  body: string;
};

export const singleToDoubleCards: SingleToDoubleCard[] = [
  {
    title: 'Fully Modular',
    body: 'Any seat goes anywhere. Bassinet, toddler seat, or car seat, top or bottom, facing you or facing out. Add a second seat whenever you are ready. The most flexible, and usually the priciest.',
  },
  {
    title: 'Convertible',
    body: 'It does turn into a double, just not freely. The second kid usually needs one specific seat, and a few positions are set in stone. So what clicks where is the whole ballgame.',
  },
];

export const singleToDoubleTaylorsNote =
  'I see this one all the time. Someone gets handed a spare Vista toddler seat and assumes it turns their stroller into a double. But the lower spot on the Vista only takes the dedicated RumbleSeat, so a regular toddler seat will not click in down there. Now there is a gorgeous, useless second seat living in a box. Always check which seat goes where before anyone buys the second one.';

export type GlossaryTerm = {
  term: string;
  definition: string;
  whyItMatters: string;
};

export const carSeatGlossary: GlossaryTerm[] = [
  {
    term: 'Infant Car Seat',
    definition: 'A rear-facing seat with a carry handle and a base that stays buckled in the car. Sized for newborns up to roughly 30 to 35 pounds.',
    whyItMatters: 'It pops in and out in seconds and usually clicks onto a stroller. The easiest thing going for year one, right up until your chunky monkey outgrows it.',
  },
  {
    term: 'Convertible Car Seat',
    definition: 'A bigger seat that rides rear-facing for babies, then turns around for toddlers. It lives in the car and stays put.',
    whyItMatters: 'It lasts for years and can skip the infant seat stage entirely. The catch is that it will not carry your baby or click onto a stroller.',
  },
  {
    term: 'Booster',
    definition: 'A seat that boosts an older kid up so the car’s own seat belt sits right across their shoulder and hips.',
    whyItMatters: 'The last stop before they ride on the belt alone. No harness, just good belt manners.',
  },
  {
    term: 'All-in-One',
    definition: 'One seat that does every stage. Rear-facing baby, forward-facing toddler, then booster.',
    whyItMatters: 'Buy it once, in theory. Just know it is chunky in the newborn phase and never leaves the car.',
  },
  {
    term: 'Travel System',
    definition: 'A stroller and infant car seat built to work together. The seat clicks onto the stroller and off you go.',
    whyItMatters: 'It is how you move a sleeping baby from car to stroller without waking the whole operation. This is the pairing worth getting right.',
  },
  {
    term: 'Car Seat Adapter',
    definition: 'A little bracket that lets a certain car seat click onto a certain stroller.',
    whyItMatters: 'Same brand usually just clicks. Mix two brands and you almost always need the exact adapter, which is the number one thing people order wrong.',
  },
  {
    term: 'Load Leg',
    definition: 'A support bar that reaches from the car seat base down to the floor of your car.',
    whyItMatters: 'It soaks up crash forces and cuts down on rebound. A genuine safety perk, not just a fancy pole.',
  },
  {
    term: 'European Belt Path',
    definition: 'A way of routing the car’s seat belt around the back of the seat when you install without the base.',
    whyItMatters: 'It steadies a baseless install. Your best friend in taxis, rideshares, and hotel rentals.',
  },
  {
    term: 'Anti-Rebound Bar',
    definition: 'A bar across the front of a rear-facing seat or base that leans against the vehicle seat.',
    whyItMatters: 'It keeps the seat from swinging toward the seatback in a crash. Another quiet little safety win.',
  },
  {
    term: 'Baseless Installation',
    definition: 'Buckling an infant car seat in with just the seat belt, no base at all.',
    whyItMatters: 'It is what makes a seat travel and rideshare friendly. Check that yours allows it and learn the belt path before you need it at 6am.',
  },
  {
    term: 'LATCH',
    definition: 'Lower Anchors and Tethers for Children. Built-in metal anchors in your car for installing a seat without the seat belt.',
    whyItMatters: 'Often the easier way to get a rock solid install. Just mind the weight limit, where you switch back to the belt.',
  },
];

export const strollerGlossary: GlossaryTerm[] = [
  {
    term: 'Modular',
    definition: 'A stroller whose seat swaps and rearranges. Bassinet, toddler seat, or car seat, often facing either way.',
    whyItMatters: 'This is what lets one frame grow from newborn to toddler, and sometimes from one kid to two.',
  },
  {
    term: 'Reversible Seat',
    definition: 'A seat that faces you or faces out, no second seat required.',
    whyItMatters: 'Newborns want your face. Toddlers want the whole world. This does both.',
  },
  {
    term: 'Parent Facing',
    definition: 'The seat points back at whoever is pushing.',
    whyItMatters: 'Perfect for newborns and for staring contests. You watch them, they watch you.',
  },
  {
    term: 'World Facing',
    definition: 'The seat points forward, away from you.',
    whyItMatters: 'Once they can hold their head up, most babies want a front row seat to everything.',
  },
  {
    term: 'Bassinet',
    definition: 'A flat, enclosed carrycot that snaps on so a newborn can lie all the way down.',
    whyItMatters: 'Fully flat is best for tiny lungs and spines. Some even double as a safe place to sleep overnight.',
  },
  {
    term: 'Near Flat Recline',
    definition: 'A seat that lays back to almost flat, though not quite a true bassinet.',
    whyItMatters: 'It is the line between newborn ready with just the seat, or needing a separate bassinet or car seat.',
  },
  {
    term: 'One-Hand Fold',
    definition: 'The stroller folds down with a single hand.',
    whyItMatters: 'You will always be holding a baby, a coffee, or both. This is a survival feature, not a luxury.',
  },
  {
    term: 'Self Standing Fold',
    definition: 'The folded stroller stands up on its own.',
    whyItMatters: 'No flopping onto the filthy garage floor. It tucks into a closet or trunk like a grown up.',
  },
  {
    term: 'Travel System Ready',
    definition: 'The stroller takes an infant car seat, straight on or with an adapter.',
    whyItMatters: 'This is the whole compatibility question. Sort out which seat and which adapter before you buy either half.',
  },
  {
    term: 'Suspension',
    definition: 'The springy bits at the wheels that soak up bumps.',
    whyItMatters: 'Good suspension turns cracked sidewalks and cobblestones into a lullaby. Baby stays asleep, you stay sane.',
  },
  {
    term: 'All Terrain',
    definition: 'Built for grass, gravel, trails, and snow, usually on bigger tires.',
    whyItMatters: 'If your walks leave the pavement, this is the difference between gliding and wrestling.',
  },
  {
    term: 'Air Filled Tires',
    definition: 'Inflatable rubber tires, just like a bike.',
    whyItMatters: 'The smoothest ride over rough ground. They can also go flat and beg for a pump now and then.',
  },
  {
    term: 'Foam Filled Tires',
    definition: 'Solid or foam core tires that never need air.',
    whyItMatters: 'Almost as smooth as air, with zero flats and zero fuss.',
  },
  {
    term: 'Swivel Lock Wheel',
    definition: 'Front wheels that spin for tight turns and lock straight when you want stability.',
    whyItMatters: 'Unlocked for the cereal aisle, locked for the jogging path.',
  },
  {
    term: 'Adjustable Handlebar',
    definition: 'A handle that raises and lowers to fit whoever is pushing.',
    whyItMatters: 'Saves your back and wrists when the grown ups come in different heights. Wildly underrated.',
  },
  {
    term: 'Basket Capacity',
    definition: 'How much the under-seat basket holds, and how easy it is to actually reach.',
    whyItMatters: 'Diaper bags, snacks, and rogue toddler shoes add up fast. A big, reachable basket earns its keep every single day.',
  },
  {
    term: 'Weight Limit',
    definition: 'The most a seat can hold, by weight and sometimes height.',
    whyItMatters: 'It tells you how many good years you get before you are shopping all over again.',
  },
  {
    term: 'Flip-Flop Friendly',
    definition: 'A brake you can tap with a bare or sandaled foot without shredding your toes.',
    whyItMatters: 'Sounds silly until July. You will set that brake a hundred times a day.',
  },
];

export type TaylorsNoteEntry = {
  body: string;
};

export const taylorsNotes: TaylorsNoteEntry[] = [
  { body: 'If you have to watch a YouTube video every time you fold your stroller, that is probably not your stroller.' },
  { body: 'A beautiful stroller you hate folding quickly becomes an expensive garage decoration.' },
  { body: 'Shopping for baby gear should not feel like studying for a final exam.' },
];

export type WhatsNextEntry = {
  prompt: string;
  action: string;
  href: string;
};

export const whatsNext: WhatsNextEntry[] = [
  { prompt: 'Still deciding?', action: 'Take the Stroller Quiz', href: '/tools/stroller-quiz' },
  { prompt: 'Already know your stroller?', action: 'Check the car seats that fit', href: '/tools/travel-system' },
  { prompt: 'Want a real person in your corner?', action: 'Book a Registry Consult', href: '/book' },
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
    description: 'Answer a few questions and land on the stroller category that actually fits your life.',
    href: '/tools/stroller-quiz',
    cta: 'Take the Quiz',
    image: '/assets/editorial/gear.jpg',
    imageAlt: 'Stroller quiz',
  },
  {
    title: 'Stroller Finder',
    description: 'Browse strollers by brand, type, price, and the features you actually care about.',
    href: '/tools/stroller-finder',
    cta: 'Browse Strollers',
    image: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller finder',
  },
  {
    title: 'Compare Strollers',
    description: 'Line up two or three strollers side by side — weight, fold, basket, modular, travel-system, and more.',
    href: '/tools/compare',
    cta: 'Compare Side by Side',
    image: '/assets/hero/hero-03.jpg',
    imageAlt: 'Compare strollers side by side',
  },
  {
    title: 'Travel System Checker',
    description: 'See which infant car seats fit your stroller before you buy the wrong adapter.',
    href: '/tools/travel-system',
    cta: 'Check Compatibility',
    image: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Travel system compatibility checker',
  },
];
