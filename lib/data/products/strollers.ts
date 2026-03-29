import type { GuideProductExampleData } from '@/lib/guides/productExamples';
import { STROLLER_AFFILIATE_LINKS } from '@/lib/data/products/strollerAffiliateLinks';

export type StrollerProductGroupSlug =
  | 'full-size-modular-strollers'
  | 'compact-lightweight-strollers'
  | 'travel-strollers'
  | 'convertible-strollers'
  | 'double-strollers'
  | 'jogging-all-terrain-strollers';

export const STROLLER_PRODUCT_GROUPS: Record<StrollerProductGroupSlug, GuideProductExampleData[]> = {
  'full-size-modular-strollers': [
    {
      name: 'Bugaboo Fox 5',
      brand: 'Bugaboo',
      productName: 'Fox 5',
      imageSrc: '/assets/strollers/fox5.png',
      imageAlt: 'Bugaboo Fox 5 stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bugaboo-fox-5'],
      typeLabel: 'Full-Size Stroller',
      bestFor: 'families who want an everyday stroller with stronger suspension and a polished push feel',
      shortReview:
        'A useful full-size anchor because it shows what this lane does well: smoother handling, a more substantial seat, and less daily friction once the stroller is part of real life.',
      specGroups: [
        { label: 'Best known for', items: ['Smooth suspension', 'Everyday comfort', 'Premium build'] },
        { label: 'Good to know', items: ['Larger footprint than compact options', 'Better fit as a primary stroller'] },
      ],
      notes: ['Helpful example when walks and daily use matter more than the smallest fold.', 'A good reminder that comfort can be worth the size.'],
      standout: 'Premium everyday ride quality',
      pros: ['Comfort-first push', 'Stronger daily-use feel', 'Good primary stroller example'],
    },
    {
      name: 'Nuna MIXX next',
      brand: 'Nuna',
      productName: 'MIXX next',
      imageSrc: '/assets/strollers/mixxnext.png',
      imageAlt: 'Nuna MIXX next stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['nuna-mixx-next'],
      typeLabel: 'Full-Size Stroller',
      bestFor: 'parents who want a capable everyday stroller that still feels manageable in the trunk',
      shortReview:
        'This one helps explain the practical center of the category. It still feels like a true everyday stroller, but not every full-size option has to feel enormous to earn its place.',
      specGroups: [
        { label: 'Best known for', items: ['Balanced size', 'Everyday versatility', 'Smooth fold routine'] },
        { label: 'Good to know', items: ['Still bulkier than compact lanes', 'Better for frequent use than trip-only use'] },
      ],
      notes: ['A strong example for families who want one stroller to do most of the week.', 'Good middle ground between premium features and everyday manageability.'],
      standout: 'Balanced full-size lane',
      pros: ['Capable daily stroller', 'More manageable than some large systems', 'Useful one-stroller example'],
    },
    {
      name: 'Silver Cross Reef 2',
      brand: 'Silver Cross',
      productName: 'Reef 2',
      imageSrc: '/assets/strollers/reef.png',
      imageAlt: 'Silver Cross Reef 2 stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['silver-cross-reef-2'],
      typeLabel: 'Full-Size Stroller',
      bestFor: 'parents who want premium finishing, good storage, and a more substantial everyday feel',
      shortReview:
        'Helpful here because it shows how the full-size lane often earns its keep through comfort, basket space, and a calmer everyday ride rather than through portability.',
      specGroups: [
        { label: 'Best known for', items: ['Premium materials', 'Larger basket', 'Confident daily handling'] },
        { label: 'Good to know', items: ['Heavier than travel-first options', 'Best when the stroller is part of normal life'] },
      ],
      notes: ['A clear example of the category doing more of the work for you.', 'Less persuasive if the stroller mostly lives folded in the car.'],
      standout: 'Storage plus premium finish',
      pros: ['Premium construction', 'Stronger basket story', 'Useful daily-use anchor'],
    },
  ],
  'compact-lightweight-strollers': [
    {
      name: 'Bugaboo Dragonfly',
      brand: 'Bugaboo',
      productName: 'Dragonfly',
      imageSrc: '/assets/strollers/compact.png',
      imageAlt: 'Bugaboo Dragonfly stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bugaboo-dragonfly'],
      typeLabel: 'Compact Stroller',
      bestFor: 'parents who want lighter everyday handling without dropping into a true travel-only feel',
      shortReview:
        'A strong compact example because it shows the category at its best: easier to lift and store, but still comfortable enough for normal everyday life.',
      specGroups: [
        { label: 'Best known for', items: ['Compact everyday use', 'Lighter handling', 'Premium comfort'] },
        { label: 'Good to know', items: ['Not as small as true travel strollers', 'Less substantial than the biggest full-size frames'] },
      ],
      notes: ['A helpful bridge between full-size comfort and travel-level portability.', 'Useful when the trunk matters almost every day.'],
      standout: 'Everyday compact sweet spot',
      pros: ['Lighter daily use', 'Better comfort than many travel strollers', 'Strong city-and-car routine fit'],
    },
    {
      name: 'Nuna TRIV',
      brand: 'Nuna',
      productName: 'TRIV',
      imageSrc: '/assets/strollers/triv.png',
      imageAlt: 'Nuna TRIV stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['nuna-triv'],
      typeLabel: 'Compact Stroller',
      bestFor: 'families who want easier storage and simpler lifting in a premium compact frame',
      shortReview:
        'Useful because it keeps the compact conversation grounded in convenience. The point is not to own the tiniest stroller. It is to make the daily fold-and-lift routine easier.',
      specGroups: [
        { label: 'Best known for', items: ['Easier fold routine', 'Compact footprint', 'Daily convenience'] },
        { label: 'Good to know', items: ['Still not a carry-on style stroller', 'Less basket and suspension than larger everyday systems'] },
      ],
      notes: ['A good fit when you want less stroller overall, but not the most minimal travel lane.', 'Often makes sense in car-heavy routines.'],
      standout: 'Convenience-first compact',
      pros: ['Smaller everyday footprint', 'Premium compact frame', 'Easier loading and storage'],
    },
    {
      name: 'CYBEX Mios',
      brand: 'CYBEX',
      productName: 'Mios',
      imageSrc: '/assets/strollers/mios.png',
      imageAlt: 'CYBEX Mios stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['cybex-mios'],
      typeLabel: 'Compact Stroller',
      bestFor: 'urban families who care about maneuverability, tighter spaces, and a cleaner compact silhouette',
      shortReview:
        'This one helps explain why compact can be the calmer answer in tighter spaces. It is less about chasing less stroller for sport and more about making the routine easier to live with.',
      specGroups: [
        { label: 'Best known for', items: ['Urban maneuvering', 'Smaller footprint', 'Premium compact styling'] },
        { label: 'Good to know', items: ['Not built around airline-bin travel', 'Best when tight spaces are the real issue'] },
      ],
      notes: ['Useful for city routines and smaller storage realities.', 'A good reminder that compact and travel are not the same lane.'],
      standout: 'City-friendly compact lane',
      pros: ['Tighter-space handling', 'Smaller frame', 'Strong urban fit'],
    },
  ],
  'travel-strollers': [
    {
      name: 'Bugaboo Butterfly',
      brand: 'Bugaboo',
      productName: 'Butterfly',
      imageSrc: '/assets/strollers/butterfly.png',
      imageAlt: 'Bugaboo Butterfly stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bugaboo-butterfly'],
      typeLabel: 'Travel Stroller',
      bestFor: 'families who want a true travel-first fold without giving up every last bit of comfort',
      shortReview:
        'A good travel anchor because it shows the category at its most useful: faster transitions, smaller storage pressure, and a stroller that behaves well when the whole day involves moving between places.',
      specGroups: [
        { label: 'Best known for', items: ['Small fold', 'Travel-ready carrying', 'Better comfort than ultra-minimal options'] },
        { label: 'Good to know', items: ['Less basket and suspension than bigger strollers', 'Best when portability is the main job'] },
      ],
      notes: ['Helpful when airports, ride shares, or smaller trunks are normal life.', 'A strong example of travel-first without feeling throwaway.'],
      standout: 'Travel-first without feeling flimsy',
      pros: ['Compact fold', 'Travel-focused design', 'Useful destination comfort balance'],
    },
    {
      name: 'Nuna TRVL lx',
      brand: 'Nuna',
      productName: 'TRVL lx',
      imageSrc: '/assets/strollers/trvllx.png',
      imageAlt: 'Nuna TRVL lx stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['nuna-trvl-lx'],
      typeLabel: 'Travel Stroller',
      bestFor: 'parents who want lighter carry and a cleaner quick-trip stroller for flights and errands',
      shortReview:
        'Useful because it keeps the travel category honest. The real win here is lower friction in motion, not pretending a travel stroller should replace every stronger everyday system.',
      specGroups: [
        { label: 'Best known for', items: ['Light carry feel', 'Quick fold routine', 'Trip-ready simplicity'] },
        { label: 'Good to know', items: ['More minimal than compact everyday options', 'Better as a travel or secondary lane for many families'] },
      ],
      notes: ['A strong second-stroller example for families who already have a bigger daily workhorse.', 'Helpful when less bulk is the whole point.'],
      standout: 'Lighter carry convenience',
      pros: ['Easy carry feel', 'Quick transitions', 'Strong second-stroller logic'],
    },
    {
      name: 'Joolz Aer+',
      brand: 'Joolz',
      productName: 'Aer+',
      imageSrc: '/assets/strollers/joolz.png',
      imageAlt: 'Joolz Aer+ stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['joolz-aer-plus'],
      typeLabel: 'Travel Stroller',
      bestFor: 'parents prioritizing portability, faster folds, and genuinely smaller stroller footprint',
      shortReview:
        'A helpful category example because it shows how travel strollers solve the movement-between-places problem first. If the hardest part is transit, this is the kind of lane that starts making sense fast.',
      specGroups: [
        { label: 'Best known for', items: ['Portable fold', 'Lightweight feel', 'Transit-friendly design'] },
        { label: 'Good to know', items: ['Less everyday substance than full-size lanes', 'Best when folding and carrying matter most'] },
      ],
      notes: ['Useful when travel is real, not hypothetical.', 'A good reminder that the destination still matters too.'],
      standout: 'Small-footprint travel lane',
      pros: ['Highly portable', 'Simple transit routine', 'Clear travel-first fit'],
    },
  ],
  'convertible-strollers': [
    {
      name: 'Bugaboo Donkey 5',
      brand: 'Bugaboo',
      productName: 'Donkey 5',
      imageSrc: '/assets/strollers/donkey.png',
      imageAlt: 'Bugaboo Donkey 5 stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bugaboo-donkey'],
      typeLabel: 'Convertible Stroller',
      bestFor: 'families planning for a second child soon who want a true single-to-double system',
      shortReview:
        'A strong convertible example because it makes the planning-ahead question very concrete. This lane works best when future flexibility is a real current need, not just a comforting idea.',
      specGroups: [
        { label: 'Best known for', items: ['Single-to-double flexibility', 'Growing-family planning', 'Expandable seating'] },
        { label: 'Good to know', items: ['Bigger frame', 'More stroller to live with even before the second seat matters'] },
      ],
      notes: ['Helpful when the second-child timeline is real enough to shape the purchase now.', 'Less convincing when future planning is still vague.'],
      standout: 'True single-to-double planning',
      pros: ['Expandable system', 'Clear growing-family use case', 'Strong planning-ahead example'],
    },
    {
      name: 'Silver Cross Wave 3',
      brand: 'Silver Cross',
      productName: 'Wave 3',
      imageSrc: '/assets/strollers/wave.png',
      imageAlt: 'Silver Cross Wave 3 stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['silver-cross-wave-3'],
      typeLabel: 'Convertible Stroller',
      bestFor: 'parents who want modular flexibility with a more premium, substantial stroller feel',
      shortReview:
        'Useful because it shows how convertible strollers often ask you to accept more size and complexity now in exchange for future flexibility later.',
      specGroups: [
        { label: 'Best known for', items: ['Modular seating', 'Premium frame', 'Future sibling planning'] },
        { label: 'Good to know', items: ['Heavier system', 'Best when the expansion plan really matters'] },
      ],
      notes: ['A good reminder that planning ahead still comes with everyday tradeoffs.', 'Works best when future flexibility has a real job to do.'],
      standout: 'Premium modular planning',
      pros: ['Flexible seat configurations', 'Premium build', 'Strong future-planning fit'],
    },
    {
      name: 'CYBEX Gazelle S',
      brand: 'CYBEX',
      productName: 'Gazelle S',
      imageSrc: '/assets/strollers/gazelle.png',
      imageAlt: 'CYBEX Gazelle S stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['cybex-gazelle-s'],
      typeLabel: 'Convertible Stroller',
      bestFor: 'families comparing modular single-to-double flexibility with a still-usable everyday setup',
      shortReview:
        'Helpful here because it sits squarely inside the tradeoff. You get future options, but you are still living with a larger system now, so the planning really does need to matter.',
      specGroups: [
        { label: 'Best known for', items: ['Expandable system', 'Useful basket story', 'Family-growth flexibility'] },
        { label: 'Good to know', items: ['Bulkier than compact lanes', 'Best when planning ahead is practical, not theoretical'] },
      ],
      notes: ['A good choice to study when the real decision is whether future flexibility outweighs more frame now.', 'Useful example of planning with eyes open.'],
      standout: 'Balanced convertible planning',
      pros: ['Expandable design', 'Strong storage story', 'Clear tradeoff example'],
    },
  ],
  'double-strollers': [
    {
      name: 'Bumbleride Indie Twin',
      brand: 'Bumbleride',
      productName: 'Indie Twin',
      imageSrc: '/assets/strollers/inditwin.png',
      imageAlt: 'Bumbleride Indie Twin stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bumbleride-indie-twin'],
      typeLabel: 'Double Stroller',
      bestFor: 'families who need two actual seats now and want honest everyday double-stroller capability',
      shortReview:
        'A strong double example because it keeps the category grounded in present-tense need. If two riders need seats now, a purpose-built double often makes more sense than planning gymnastics.',
      specGroups: [
        { label: 'Best known for', items: ['Two-seat-now utility', 'Side-by-side layout', 'Daily sibling logistics'] },
        { label: 'Good to know', items: ['Wider footprint', 'Best when both seats will get real use'] },
      ],
      notes: ['Helpful when the double question is immediate, not speculative.', 'A clear example of current-life utility over future flexibility.'],
      standout: 'Immediate two-seat solution',
      pros: ['Two functional seats', 'Honest sibling-use case', 'Clear present-day fit'],
    },
    {
      name: 'BOB Revolution Flex Duallie',
      brand: 'BOB',
      productName: 'Revolution Flex Duallie',
      imageSrc: '/assets/strollers/revolution.png',
      imageAlt: 'BOB Revolution Flex Duallie stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bob-revolution-flex-duallie'],
      typeLabel: 'Double Jogging Stroller',
      bestFor: 'active families who need a double setup that can handle longer outdoor routes and rougher terrain',
      shortReview:
        'Useful because it shows that not every double stroller is trying to solve the same job. Some are built for active routes first, not tight-space convenience.',
      specGroups: [
        { label: 'Best known for', items: ['Outdoor handling', 'Larger wheels', 'Two-seat active use'] },
        { label: 'Good to know', items: ['Large footprint', 'Less suited to tighter indoor errands'] },
      ],
      notes: ['Helpful when the two-seat question overlaps with terrain or active use.', 'A strong reminder that width and route both matter.'],
      standout: 'Active double lane',
      pros: ['Two-seat terrain help', 'Stronger suspension story', 'Useful outdoor-heavy example'],
    },
    {
      name: 'UPPAbaby Minu Duo',
      brand: 'UPPAbaby',
      productName: 'Minu Duo',
      imageSrc: '/assets/strollers/minuduo.png',
      imageAlt: 'UPPAbaby Minu Duo stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['uppababy-minu-duo'],
      typeLabel: 'Double Stroller',
      bestFor: 'parents who need two seats now but still care deeply about day-to-day maneuvering and a more compact feel',
      shortReview:
        'A good category example because it shows how some doubles are trying to make the daily footprint feel less punishing without pretending two seats are ever tiny.',
      specGroups: [
        { label: 'Best known for', items: ['More manageable double footprint', 'Two-seat convenience', 'Everyday sibling use'] },
        { label: 'Good to know', items: ['Still a dedicated double', 'Best when both seats matter right now'] },
      ],
      notes: ['Useful when the question is not whether you need a double, but which kind of double feels livable.', 'A good double-for-real-life example.'],
      standout: 'More manageable double feel',
      pros: ['Everyday-friendly double', 'Two-seat-now logic', 'Useful balance of size and utility'],
    },
  ],
  'jogging-all-terrain-strollers': [
    {
      name: 'UPPAbaby Ridge',
      brand: 'UPPAbaby',
      productName: 'Ridge',
      imageSrc: '/assets/strollers/ridge.png',
      imageAlt: 'UPPAbaby Ridge stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['uppababy-ridge'],
      typeLabel: 'Jogging / All-Terrain Stroller',
      bestFor: 'parents who want bigger wheels and stronger suspension for rougher routes and outdoor-heavy weeks',
      shortReview:
        'A useful anchor because it shows how this category solves the route itself. If sidewalks, gravel, or longer outdoor walks keep creating friction, bigger wheels can be the calmer answer.',
      specGroups: [
        { label: 'Best known for', items: ['Bigger wheels', 'All-terrain handling', 'Outdoor-heavy use'] },
        { label: 'Good to know', items: ['Bulkier fold', 'Less elegant for tight indoor errands'] },
      ],
      notes: ['Helpful when the ground keeps winning the argument.', 'A strong example of terrain-first usefulness.'],
      standout: 'Terrain-first everyday help',
      pros: ['Bigger-wheel stability', 'Outdoor route comfort', 'Clear all-terrain fit'],
    },
    {
      name: 'Thule Urban Glide 3',
      brand: 'Thule',
      productName: 'Urban Glide 3',
      imageSrc: '/assets/strollers/urbnglide.png',
      imageAlt: 'Thule Urban Glide 3 stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['thule-urban-glide-3'],
      typeLabel: 'Jogging Stroller',
      bestFor: 'families comparing a true jogging setup with a more general all-terrain lane',
      shortReview:
        'Helpful because it makes the actual jogging question clearer. Some families need rough-surface help. Others truly need a stroller built for running later on.',
      specGroups: [
        { label: 'Best known for', items: ['Running-specific design', 'Large wheels', 'Outdoor performance'] },
        { label: 'Good to know', items: ['More stroller than most indoor routines need', 'Best when active use is real, not aspirational'] },
      ],
      notes: ['A good reminder to separate running from simply wanting smoother wheels.', 'Useful when the route is part of the decision.'],
      standout: 'True jogging lane',
      pros: ['Running-ready design', 'Stronger outdoor handling', 'Clear active-family fit'],
    },
    {
      name: 'BOB Alterrain Pro',
      brand: 'BOB',
      productName: 'Alterrain Pro',
      imageSrc: '/assets/strollers/alterrian.png',
      imageAlt: 'BOB Alterrain Pro stroller.',
      affiliateUrl: STROLLER_AFFILIATE_LINKS['bob-alterrain-pro'],
      typeLabel: 'All-Terrain Stroller',
      bestFor: 'parents whose routes include trails, gravel, or broken sidewalks often enough to matter every week',
      shortReview:
        'A good all-terrain example because it shows why this category is not just about athletic identity. It is often about making rougher ground far less annoying.',
      specGroups: [
        { label: 'Best known for', items: ['Rough-route comfort', 'Large wheels', 'Stronger suspension'] },
        { label: 'Good to know', items: ['Larger fold', 'More specialized than everyday smooth-surface strollers'] },
      ],
      notes: ['Useful when longer outdoor routes are normal life.', 'A strong example of the route dictating the category.'],
      standout: 'Rough-route confidence',
      pros: ['Trail-friendly design', 'Bigger-wheel stability', 'Useful outdoor-heavy fit'],
    },
  ],
};

export function getStrollerProductExamples(slug: string) {
  if (!(slug in STROLLER_PRODUCT_GROUPS)) {
    return [];
  }

  return [...STROLLER_PRODUCT_GROUPS[slug as StrollerProductGroupSlug]];
}
