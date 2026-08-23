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
  | 'bath'
  | 'getting-around'
  | 'everyday'
  | 'clothing'
  | 'support';

export const categories: { id: CategoryId; title: string }[] = [
  { id: 'sleep', title: 'Sleep' },
  { id: 'feeding', title: 'Feeding' },
  { id: 'bath', title: 'Bath Time' },
  { id: 'getting-around', title: 'Getting Around' },
  { id: 'everyday', title: 'Everyday Living' },
  { id: 'clothing', title: 'Clothing + Linens' },
  { id: 'support', title: 'Support + Smart Extras' },
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
 * post are silently skipped at render. Categories without a match (Bath Time,
 * Clothing + Linens) are omitted rather than padded.
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
  everyday: [
    { label: 'Best diaper pails (2026)', slug: 'blog-best-diaper-pails-2026' },
    { label: 'New baby gear in 2026', slug: 'baby-gear-released-2026-so-far' },
  ],
  support: [
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
    { label: 'NFL newborn fan clubs', slug: 'nfl-newborn-fan-clubs' },
    { label: 'MLB newborn fan clubs', slug: 'mlb-newborn-fan-clubs' },
  ],
};

export type StyleCollection = { girl: string[]; boy: string[]; neutral: string[] };

export type ChecklistItem = {
  id: string;
  category: CategoryId;
  title: string;
  note?: string;
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
  twins?: { title?: string; note?: string; badge?: string; label?: string; taylorsTake?: string };
};

export const TWINS_CALLOUT = {
  heading: 'Double the babies. Not necessarily double the gear.',
  body: 'Start by duplicating the items each baby needs for safety and daily function. Share what can reasonably be shared, and wait before purchasing two of every convenience item.',
};

export const DISCLOSURE =
  'A quick note: Some links are affiliate links, which means Taylor-Made Baby Co. may earn a commission at no additional cost to you. Recommendations are always selected independently.';

export const checklistItems: ChecklistItem[] = [
  // ── SLEEP ──────────────────────────────────────────────────────────────────
  {
    id: 'crib',
    category: 'sleep',
    title: 'Mini crib or full-size crib',
    note: 'One safe, flat sleep space is all a newborn needs.',
    badge: 'ESSENTIAL',
    recommendationIds: ['davinci-dylan-mini-crib', 'stokke-sleepi-crib'],
    taylorsTake:
      'Pick based on your room, not the catalog. A mini crib buys you time in a small space; a full-size crib lasts longer. Either is right — a bare, firm, flat surface is the only rule that matters.',
    twins: {
      title: '2 safe sleep spaces',
      note: 'Each baby needs their own flat, firm sleep surface.',
      label: 'BUY 2',
      taylorsTake:
        'This is the clearest "buy two" on the list. Two babies means two safe sleep spaces from night one — no sharing here, even at the start.',
    },
  },
  {
    id: 'crib-mattress',
    category: 'sleep',
    title: 'Crib mattress',
    note: 'Firm and flat, sized to your crib.',
    badge: 'ESSENTIAL',
    taylorsTake: 'Firm is non-negotiable for safe sleep. You do not need the most expensive one — you need the right firmness and a snug fit.',
    twins: { title: '2 crib mattresses', label: 'BUY 2' },
  },
  {
    id: 'crib-sheets',
    category: 'sleep',
    title: '2–3 fitted crib sheets',
    note: 'Enough to rotate through the inevitable middle-of-the-night change.',
    taylorsTake: 'Two or three per sleep space is plenty. More than that just fills a drawer.',
    styleCollection: {
      girl: ['Soft blush, warm cream, and gentle terracotta', 'Small ditsy florals or fine stripes'],
      boy: ['Sage, oat, and soft slate', 'Simple stripes or a subtle geo'],
      neutral: ['Ivory, oatmeal, and muted clay', 'Solids, or the quietest pattern in the room'],
    },
    twins: { title: '4–6 fitted crib sheets total', note: 'Roughly two to three per sleep space.', label: 'BUY 2' },
  },
  {
    id: 'mattress-protector',
    category: 'sleep',
    title: 'Waterproof mattress protector',
    note: 'The layer that saves the mattress and your sanity.',
    badge: 'ESSENTIAL',
    taylorsTake: 'A quiet hero. One leak at 3am and you will be glad it is there — and glad you can strip it in seconds.',
    twins: { title: '2 waterproof mattress protectors', label: 'BUY 2' },
  },
  {
    id: 'travel-crib',
    category: 'sleep',
    title: 'Portable playard / travel crib',
    note: 'A second safe sleep space for travel and downstairs.',
    badge: 'SPACE SAVER',
    recommendationId: 'playard-pick',
    taylorsTake: 'Doubles as a safe sleep space away from home and a contained spot on the main floor. If your home is small, this can even stand in for a bassinet early on.',
    twins: {
      title: 'Twin-friendly portable sleep / travel plan',
      note: 'Two safe surfaces when you are away from the cribs.',
      taylorsTake: 'For twins, think through where each baby sleeps away from home before you travel — one travel crib rarely covers two.',
    },
  },
  {
    id: 'swaddles',
    category: 'sleep',
    title: 'Swaddles or sleep sacks',
    note: 'Newborns sleep better contained; sacks take over once they roll.',
    taylorsTake: 'Start with a few swaddles, then move to sleep sacks around the time baby shows signs of rolling. Try one style before you buy a stack.',
    styleCollection: {
      girl: ['Blush, cream, and soft rose', 'Tiny florals or a fine dot'],
      boy: ['Sage, fog, and warm gray', 'Solids or a subtle stripe'],
      neutral: ['Oat, ivory, and clay', 'Solids and gentle earth tones'],
    },
    twins: { title: 'Sleep sacks or swaddles for each baby', label: 'BUY 2', note: 'One in use, one in the wash — per baby.' },
  },
  {
    id: 'monitor',
    category: 'sleep',
    title: 'Baby monitoring system',
    note: 'A video view for peace of mind.',
    recommendationId: 'monitor-pick',
    taylorsTake: 'A video monitor is a comfort tool, not a medical device. Pick a reliable one and resist the urge to buy every sensor add-on.',
    twins: {
      title: 'Monitor with two-camera capability',
      note: 'One system, two views — not two separate apps.',
      label: 'BUY 1 system',
      taylorsTake: 'For twins, choose a system that supports two cameras on one account. Two separate monitors means two apps and twice the fumbling.',
    },
  },
  {
    id: 'audio-monitor',
    category: 'sleep',
    title: 'Simple audio monitor',
    note: 'Sometimes you just want sound and long battery.',
    badge: 'NICE TO HAVE',
    recommendationId: 'audio-monitor-pick',
    taylorsTake: 'An honest backup or, in a small home, the only monitor you need. Less screen, less to charge.',
    twins: { title: 'Audio monitor', note: 'A low-stress backup to your video system.' },
  },
  {
    id: 'blackout',
    category: 'sleep',
    title: 'Blackout solution',
    note: 'Portable blackout panels or curtains help day sleep.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Not day-one urgent, but genuinely useful for naps and summer bedtimes. Portable panels travel well.',
  },
  {
    id: 'night-light',
    category: 'sleep',
    title: 'Night-light',
    note: 'Warm, dim light for feeds and changes.',
    taylorsTake: 'Choose warm and dim over bright and white — you want to see, not to wake everyone fully.',
  },

  // ── FEEDING ─────────────────────────────────────────────────────────────────
  {
    id: 'bottle-trial',
    category: 'feeding',
    title: 'Bottle trial pack',
    note: 'Let baby pick the winner before you buy a full set.',
    badge: 'TRY FIRST',
    recommendationId: 'bottle-trial-pick',
    taylorsTake: 'Babies are opinionated about bottles. A small variety pack is cheap insurance against a set of eight your baby refuses.',
    twins: {
      title: 'Bottle trial packs before buying multiples',
      note: 'Confirm the winner, then buy the quantity you actually need.',
      label: 'TRY FIRST',
    },
  },
  {
    id: 'pacifier-trial',
    category: 'feeding',
    title: 'Pacifier trial pack',
    note: 'Same logic as bottles — preferences vary.',
    badge: 'TRY FIRST',
    taylorsTake: 'Try a couple of shapes before committing. Many a parent has a drawer of one style baby will not touch.',
    twins: { title: 'Pacifier trial packs before buying multiples', label: 'TRY FIRST' },
  },
  {
    id: 'manual-pump',
    category: 'feeding',
    title: 'Manual breast pump',
    note: 'Catches letdown and relieves fullness — small and cheap.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Even if you plan to nurse, a simple manual pump is a low-cost comfort in the early weeks.',
  },
  {
    id: 'primary-pump',
    category: 'feeding',
    title: 'Primary breast pump, if needed',
    note: 'Check insurance coverage first — many are covered.',
    recommendationId: 'breast-pump-pick',
    taylorsTake: 'Before you register for a pump, check what your insurance covers — it is often free. Comfort and reliable suction matter more than gadgets.',
  },
  {
    id: 'milk-storage',
    category: 'feeding',
    title: 'Milk storage bags or containers',
    note: 'For anyone pumping or building a stash.',
    taylorsTake: 'Only relevant if you are pumping. Start modest; you can restock in a day.',
    twins: { title: 'Extra milk storage', note: 'Two feeders can mean more to store — but still buy as you go.' },
  },
  {
    id: 'bottle-brush',
    category: 'feeding',
    title: 'Bottle brush',
    note: 'A dedicated brush makes cleaning far easier.',
    taylorsTake: 'A small thing that you will use every single day. Worth having from the start.',
    twins: { title: 'Bottle cleaning station', note: 'A brush, a drying rack, and a routine you can do half-asleep.' },
  },
  {
    id: 'dishwasher-basket',
    category: 'feeding',
    title: 'Dishwasher basket',
    note: 'Corrals nipples, valves, and small parts.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Saves you from losing tiny parts to the bottom of the machine.',
  },
  {
    id: 'sterilizer',
    category: 'feeding',
    title: 'Microwave sterilization solution',
    note: 'A simple bag or bin sterilizes in minutes.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'A microwave steam bag does the job without a countertop appliance you will store away by month four.',
    twins: { title: 'Sterilization solution', note: 'A microwave bag or bin — no bulky appliance required.' },
  },
  {
    id: 'burp-cloths',
    category: 'feeding',
    title: 'Burp cloths',
    note: 'You will use more than you think.',
    taylorsTake: 'Buy the plain, absorbent kind and plenty of them. These live on your shoulder for months.',
    twins: { title: 'Plenty of burp cloths', note: 'Two feeders, roughly double the laundry — this is a fair "more" item.' },
  },
  {
    id: 'high-chair',
    category: 'feeding',
    title: 'High chair',
    note: 'You will not need this until around six months.',
    badge: 'WAIT UNTIL LATER',
    recommendationId: 'high-chair-pick',
    taylorsTake: 'Register early to catch a completion discount, but there is no rush to have it assembled. Solids start around six months.',
    twins: { title: '2 high chairs', label: 'BUY 2', note: 'Two eaters, two seats — but still not until solids begin.' },
  },
  {
    id: 'bibs',
    category: 'feeding',
    title: 'Bibs',
    note: 'Drool bibs early, mess bibs at solids.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'A few drool bibs are handy early; save the big silicone catch-all bibs for solids.',
    styleCollection: {
      girl: ['Blush and cream tones', 'Simple scalloped edges'],
      boy: ['Sage and slate tones', 'Clean, solid colors'],
      neutral: ['Oat and ivory tones', 'Undyed or muted solids'],
    },
  },
  {
    id: 'feeding-set',
    category: 'feeding',
    title: 'First feeding set for later',
    note: 'Plates, spoons, and cups for the solids stage.',
    badge: 'WAIT UNTIL LATER',
    taylorsTake: 'A "future you" item. Register it, but do not open it until solids are on the horizon.',
    twins: { title: '2 feeding sets for later', label: 'BUY 2' },
  },

  // ── BATH TIME ───────────────────────────────────────────────────────────────
  {
    id: 'bathtub',
    category: 'bath',
    title: 'Baby bathtub',
    note: 'Supports a newborn until they can sit.',
    recommendationId: 'bathtub-pick',
    taylorsTake: 'Simple and easy to drain beats elaborate. You are bathing a small, slippery human — support and cleanup are the whole job.',
    twins: {
      title: '1 baby bathtub',
      note: 'You bathe one baby at a time regardless.',
      label: 'BUY 1 / SHARE',
      taylorsTake: 'A clear "share" for twins — one tub is genuinely enough, since bath time happens one baby at a time.',
    },
  },
  {
    id: 'bath-stand',
    category: 'bath',
    title: 'Bath stand, if helpful',
    note: 'Saves your back by raising the tub.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Optional, but kind to your back if you will bathe in a tub or shower rather than the sink.',
    twins: { title: 'Bath stand, if useful' },
  },
  {
    id: 'hooded-towels',
    category: 'bath',
    title: '2–3 hooded towels',
    note: 'Soft, absorbent, and hooded to hold in warmth.',
    taylorsTake: 'Two or three is plenty. The hood matters more than the design.',
    styleCollection: {
      girl: ['Blush, cream, or soft rose', 'A gently scalloped or embroidered edge'],
      boy: ['Sage, fog, or warm gray', 'A simple contrast trim'],
      neutral: ['Oat, ivory, or clay', 'Undyed or tonal'],
    },
    twins: { title: '4–6 hooded towels', note: 'Roughly two to three per baby.' },
  },
  {
    id: 'washcloths',
    category: 'bath',
    title: 'Washcloths',
    note: 'Soft cloths for baths and quick cleanups.',
    taylorsTake: 'Buy a multipack of the softest you can find — they earn their keep beyond the bath.',
  },
  {
    id: 'baby-wash',
    category: 'bath',
    title: 'Gentle baby wash + shampoo',
    note: 'One fragrance-free, tear-free bottle does it all.',
    taylorsTake: 'One gentle, fragrance-free bottle covers hair and body. You do not need a shelf of products for a newborn.',
  },
  {
    id: 'baby-lotion',
    category: 'bath',
    title: 'Baby lotion',
    note: 'A simple, fragrance-free moisturizer.',
    twins: { title: 'Lotion' },
  },
  {
    id: 'kneeler',
    category: 'bath',
    title: 'Kneeler + elbow rest',
    note: 'Cushions tub-side bath time.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'A small comfort for your knees and elbows once baths move to the big tub.',
  },
  {
    id: 'bath-thermometer',
    category: 'bath',
    title: 'Bath thermometer, optional',
    note: 'Your wrist works too, but some parents like the number.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Genuinely optional. Your wrist is a perfectly good thermometer — skip it if you want to skip something.',
    twins: { title: 'Optional bath thermometer' },
  },

  // ── GETTING AROUND ──────────────────────────────────────────────────────────
  {
    id: 'primary-stroller',
    category: 'getting-around',
    title: 'Primary stroller',
    note: 'The frame you will use most days.',
    badge: 'ESSENTIAL',
    recommendationIds: ['primary-stroller-pick', 'nuna-demi-icon'],
    taylorsTake: 'Buy for your real home and routine — trunk size, doorways, and whether stairs are in your life. The best stroller is the one that fits the way you actually move.',
    twins: {
      title: 'Double stroller selected for the family’s actual lifestyle',
      note: 'One frame that carries two beats two separate strollers.',
      taylorsTake: 'For twins, choose the double configuration around your doorways, sidewalks, and trunk before you fall for a photo. Side-by-side vs. inline is a lifestyle decision.',
    },
  },
  {
    id: 'infant-car-seat',
    category: 'getting-around',
    title: 'Infant car seat',
    note: 'A safe ride home is the one true day-one item.',
    badge: 'ESSENTIAL',
    recommendationId: 'infant-car-seat-pick',
    taylorsTake: 'You cannot leave the hospital without a safe car seat install. An infant seat that clicks into your stroller keeps a sleeping baby sleeping.',
    twins: {
      title: '2 infant car seats',
      label: 'BUY 2',
      note: 'Two babies, two seats — no exceptions on safety.',
    },
  },
  {
    id: 'travel-system-stroller',
    category: 'getting-around',
    title: 'Travel stroller',
    note: 'A newborn-ready stroller your infant seat clicks into.',
    badge: 'ESSENTIAL',
    taylorsTake: 'The other half of a smooth day-one setup: a stroller that takes your infant car seat — directly or with the right adapter — so you can move a sleeping baby from car to stroller without waking them.',
    twins: {
      title: 'Double stroller or two travel setups for two',
      note: 'Plan how two newborns ride from day one — side-by-side or inline.',
    },
  },
  {
    id: 'convertible-car-seat',
    category: 'getting-around',
    title: 'Convertible car seat',
    note: 'Register early even if baby starts in an infant seat.',
    badge: 'REGISTER EARLY',
    recommendationId: 'britax-galaxy360',
    taylorsTake: 'You may not need this on day one, but adding it early lets you use completion discounts and gives family a practical larger gift. It is the seat baby grows into after the infant seat.',
    twins: { title: '2 convertible car seats', label: 'BUY 2' },
  },
  {
    id: 'car-seat-adapters',
    category: 'getting-around',
    title: 'Stroller car-seat adapters, if required',
    note: 'Turns your stroller + infant seat into a travel system.',
    taylorsTake: 'Check whether your stroller and infant seat need an adapter to click together — many do, and it is easy to forget until you are standing in the driveway.',
    twins: { title: 'Required stroller adapters', note: 'Confirm the adapters for two seats on your double frame.' },
  },
  {
    id: 'carrier',
    category: 'getting-around',
    title: 'Baby carrier',
    note: 'Hands-free comfort for you, closeness for baby.',
    recommendationId: 'baby-carrier-pick',
    taylorsTake: 'A good carrier buys you two free hands and often a calmer baby. Comfort for the wearer is what keeps it in use — try before you commit to a stack of them.',
    twins: {
      title: '1–2 carriers depending on caregivers',
      label: '1–2',
      note: 'One shared carrier often covers it; add a second if two adults wear at once.',
    },
  },
  {
    id: 'rain-cover',
    category: 'getting-around',
    title: 'Stroller rain cover, if useful',
    note: 'Weather protection for your climate.',
    badge: 'NICE TO HAVE',
    twins: { title: 'Rain cover if useful' },
  },
  {
    id: 'changing-mat',
    category: 'getting-around',
    title: 'Portable changing mat',
    note: 'A fold-up mat for changes on the go.',
    taylorsTake: 'Lives in the diaper bag and makes any surface a safe changing spot.',
  },
  {
    id: 'wet-dry-bag',
    category: 'getting-around',
    title: 'Wet/dry bag',
    note: 'Separates the clean from the very much not clean.',
    badge: 'NICE TO HAVE',
    twins: { title: '2 wet/dry bags', label: 'BUY 2' },
  },

  // ── EVERYDAY LIVING ─────────────────────────────────────────────────────────
  {
    id: 'diaper-pail',
    category: 'everyday',
    title: 'Diaper pail',
    note: 'Odor control where the diapers happen.',
    recommendationId: 'diaper-pail-pick',
    taylorsTake: 'Look for one that seals well and takes regular trash bags, so you are not locked into a refill subscription for years.',
    twins: {
      title: '1 large-capacity diaper pail',
      label: 'BUY 1 / SHARE',
      note: 'One good, large pail handles two babies.',
    },
  },
  {
    id: 'portable-pail',
    category: 'everyday',
    title: 'Portable diaper pail or bags',
    note: 'For the diaper bag and on-the-go changes.',
    badge: 'NICE TO HAVE',
    twins: { title: 'Portable diaper bags / pail' },
  },
  {
    id: 'changing-pad',
    category: 'everyday',
    title: 'Changing pad',
    note: 'A wipeable, contoured pad for your dresser-top station.',
    taylorsTake: 'Skip a dedicated changing table if you like — a contoured pad on a secured dresser does the same job and lasts longer.',
  },
  {
    id: 'diaper-caddy',
    category: 'everyday',
    title: 'Diaper caddy',
    note: 'A grab-and-go bin so supplies follow you around the house.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'The best organizing buy under $30. Stock it once and changes happen wherever you are.',
    twins: {
      title: '2 diaper caddies if living across multiple floors',
      label: '1–2',
      note: 'A caddy per level saves a lot of stairs.',
    },
  },
  {
    id: 'diapers-wipes',
    category: 'everyday',
    title: 'Diapers + wipes',
    note: 'Start modest — sizes change fast.',
    badge: 'ESSENTIAL',
    taylorsTake: 'Do not stockpile newborn size. Babies grow through it quickly, and you can restock in a day. A range of sizes beats a mountain of one.',
    twins: {
      title: 'Diapers + wipes without excessive newborn stockpiling',
      note: 'Two babies still outgrow newborn size fast — buy across sizes.',
    },
  },
  {
    id: 'newborn-care-kit',
    category: 'everyday',
    title: 'Newborn care kit',
    note: 'Thermometer, nasal aspirator, and the basics.',
    taylorsTake: 'A small kit covers the "it is 2am and I need this now" moments — thermometer, aspirator, saline.',
  },
  {
    id: 'grooming-kit',
    category: 'everyday',
    title: 'Baby grooming kit',
    note: 'Tiny nail file, comb, and brush.',
    badge: 'NICE TO HAVE',
    twins: { title: 'Grooming kit' },
  },
  {
    id: 'play-mat',
    category: 'everyday',
    title: 'Play mat',
    note: 'A soft, safe spot for tummy time.',
    taylorsTake: 'Tummy time headquarters. Choose one that wipes clean and lies flat over a giant activity center.',
    styleCollection: {
      girl: ['Blush, cream, and muted rose palette', 'Soft, uncluttered patterns'],
      boy: ['Sage, oat, and slate palette', 'Simple shapes, low contrast'],
      neutral: ['Warm neutrals and earth tones', 'Calm, minimal design'],
    },
    twins: { title: 'Large play mat', note: 'One generous mat gives two babies room to share.' },
  },
  {
    id: 'awake-seat',
    category: 'everyday',
    title: 'Bouncer or safe awake-time seat',
    note: 'A safe place to set baby down for a minute.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'One safe spot to put baby down while you eat or shower. You do not need three versions of this.',
    twins: {
      title: '1–2 awake-time seats based on actual need',
      label: '1–2',
      note: 'Two hands, two babies — a second seat can genuinely help here.',
    },
  },
  {
    id: 'organizers',
    category: 'everyday',
    title: 'Storage / drawer organizers',
    note: 'Small dividers keep tiny clothes findable.',
    badge: 'NICE TO HAVE',
    twins: { title: 'Storage organizers' },
  },
  {
    id: 'childproofing',
    category: 'everyday',
    title: 'Childproofing basics for later',
    note: 'Gates and latches for the crawling stage.',
    badge: 'WAIT UNTIL LATER',
    taylorsTake: 'Months away, but worth a line on the list so it is on your radar before baby is mobile.',
  },

  // ── CLOTHING + LINENS ───────────────────────────────────────────────────────
  {
    id: 'bodysuits',
    category: 'clothing',
    title: '6–8 everyday bodysuits',
    note: 'The workhorse of a newborn wardrobe.',
    taylorsTake: 'Bodysuits over outfits in the early weeks. Buy a range of sizes, not a stack of newborn — some babies skip newborn entirely.',
    styleCollection: {
      girl: ['Blush, cream, terracotta, and soft rose', 'Tiny florals, fine stripes, or solids'],
      boy: ['Sage, oat, slate, and warm gray', 'Solids, simple stripes, or a subtle motif'],
      neutral: ['Ivory, oatmeal, clay, and fog', 'Solids and quiet earth tones'],
    },
    twins: { title: '10–14 bodysuits total', note: 'Roughly six to eight per baby, across sizes.' },
  },
  {
    id: 'sleepers',
    category: 'clothing',
    title: '6–8 sleepers / pajamas',
    note: 'Zip sleepers make night changes painless.',
    taylorsTake: 'Zippers over snaps at 3am — your future self will thank you. Again, spread across sizes.',
    styleCollection: {
      girl: ['Blush and cream tones', 'Soft florals or solids'],
      boy: ['Sage and slate tones', 'Solids or fine stripes'],
      neutral: ['Oat and ivory tones', 'Calm solids'],
    },
    twins: { title: '10–14 sleepers total', note: 'Roughly six to eight per baby.' },
  },
  {
    id: 'outfits',
    category: 'clothing',
    title: '2–3 easy outfits',
    note: 'For photos and going out — kept simple.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'A couple of "leaving the house" outfits is plenty. Newborns live in bodysuits and sleepers.',
    styleCollection: {
      girl: ['Blush, cream, and warm neutral pieces', 'Soft knits and gentle prints'],
      boy: ['Sage, oat, and slate pieces', 'Simple knits and solids'],
      neutral: ['Warm neutral, ivory, and clay pieces', 'Understated, tonal'],
    },
    twins: { title: '4–6 easy outfits total' },
  },
  {
    id: 'socks',
    category: 'clothing',
    title: 'Socks / booties',
    note: 'They vanish in the wash — buy a pack.',
    taylorsTake: 'They disappear. Buy one style so the survivors always have a match.',
  },
  {
    id: 'seasonal-layers',
    category: 'clothing',
    title: 'Seasonal layers',
    note: 'A weather-appropriate jacket, hat, or bunting.',
    taylorsTake: 'Buy for the season baby will actually be that size — a newborn snowsuit in July rarely fits by winter.',
  },
  {
    id: 'blankets',
    category: 'clothing',
    title: '2–3 lightweight blankets',
    note: 'For swaddling, tummy time, and stroller shade — not crib sleep.',
    taylorsTake: 'Muslin is the multitasker: swaddle, burp cloth, sunshade, play surface. Keep loose blankets out of the crib.',
    styleCollection: {
      girl: ['Blush, cream, and soft rose', 'Tiny florals or solids'],
      boy: ['Sage, fog, and warm gray', 'Solids or a subtle stripe'],
      neutral: ['Oat, ivory, and clay', 'Solids and earth tones'],
    },
    twins: { title: '4–6 lightweight blankets', note: 'Two to three per baby.' },
  },
  {
    id: 'hamper',
    category: 'clothing',
    title: 'Laundry hamper',
    note: 'You are about to do a lot of laundry.',
    twins: { title: 'Large laundry hamper', note: 'Twins generate laundry — size up.' },
  },
  {
    id: 'detergent',
    category: 'clothing',
    title: 'Baby-safe detergent',
    note: 'Fragrance-free and gentle on new skin.',
    taylorsTake: 'Fragrance-free is the safe default. You can always switch if skin tolerates more.',
  },

  // ── SUPPORT + SMART EXTRAS ──────────────────────────────────────────────────
  {
    id: 'completion-discount',
    category: 'support',
    title: 'Registry completion-discount plan',
    note: 'Most registries give you a one-time discount to finish the list.',
    badge: 'ESSENTIAL',
    taylorsTake: 'One of the highest-value moves on this whole list. Plan to buy your remaining big items in a single completion-discount window instead of piecemeal.',
    twins: { title: 'Registry completion-discount strategy' },
  },
  {
    id: 'welcome-box',
    category: 'support',
    title: 'Welcome-box eligibility checklist',
    note: 'Many registries offer a free welcome box of samples.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'Free samples and a few genuinely useful items for the cost of a few minutes. Worth doing across the registries you use.',
    twins: { title: 'Welcome-box strategy' },
  },
  {
    id: 'postpartum-support',
    category: 'support',
    title: 'Postpartum / feeding support',
    note: 'Lactation help, a postpartum doula, or a support line.',
    taylorsTake: 'Support in the first weeks is as valuable as any product. Line it up before you need it, not during a hard night.',
  },
  {
    id: 'cpst-check',
    category: 'support',
    title: 'CPST car-seat installation check',
    note: 'A certified tech confirms your install is right.',
    taylorsTake: 'Most seats are installed wrong. A certified passenger safety tech (CPST) checking your install is free peace of mind — Taylor is not a CPST, so this is the right hands for it.',
    twins: { title: 'CPST check for both car seats', note: 'Have both installs checked, not just one.' },
  },
  {
    id: 'babywearing-education',
    category: 'support',
    title: 'Babywearing education, if desired',
    note: 'A quick lesson makes a carrier click.',
    badge: 'NICE TO HAVE',
    twins: { title: 'Babywearing education' },
  },
  {
    id: 'meal-support',
    category: 'support',
    title: 'Meal / household support',
    note: 'A meal train or cleaning help beats another onesie.',
    taylorsTake: 'If people ask what you need, this is a real answer. Fed and rested parents are the point.',
    twins: { title: 'Meal and household support', note: 'With twins, accept more help than feels polite.' },
  },
  {
    id: 'caregiver-plan',
    category: 'support',
    title: 'Extra caregiver plan',
    note: 'Two babies often means an extra set of hands.',
    include: ['twins'],
    taylorsTake: 'Twins-specific and worth planning early: who helps, when, and how. A second adult during witching hour is not a luxury.',
  },
  {
    id: 'keepsake-plan',
    category: 'support',
    title: 'Newborn photos or keepsake plan',
    note: 'Book early if you want newborn photos.',
    badge: 'NICE TO HAVE',
    taylorsTake: 'If newborn photos matter to you, book before baby arrives — the window is short.',
  },
  {
    id: 'service-gift-cards',
    category: 'support',
    title: 'Gift cards for services, not just stuff',
    note: 'Meals, cleaning, or support hours make excellent gifts.',
    taylorsTake: 'When family wants to give something meaningful, a service gift card often helps more than another object.',
    twins: { title: 'Service gift cards' },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export type ResolvedItem = {
  id: string;
  category: CategoryId;
  title: string;
  note?: string;
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
  return {
    id: item.id,
    category: item.category,
    title: isTwins && t?.title ? t.title : item.title,
    note: isTwins && t?.note !== undefined ? t.note : item.note,
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

/** All items that belong to a given version, in file order. */
export function itemsForType(type: ChecklistType): ChecklistItem[] {
  return checklistItems.filter((i) => !i.include || i.include.includes(type));
}

/** Resolved items grouped by category, in category order, for a version. */
export function groupedItemsForType(
  type: ChecklistType,
): { category: { id: CategoryId; title: string }; items: ResolvedItem[] }[] {
  const items = itemsForType(type).map((i) => resolveItem(i, type));
  return categories
    .map((category) => ({
      category,
      items: items.filter((i) => i.category === category.id),
    }))
    .filter((group) => group.items.length > 0);
}
