export type GuidePillar = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  overview: string;
  focusAreas: string[];
  quickQuestions: string[];
  relatedSlugs: string[];
};

export type ServicePackage = {
  key: 'focused-session' | 'signature-planning' | 'concierge-support';
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  bestFor: string;
  bullets: string[];
  featured?: boolean;
};

export const guidePillars: GuidePillar[] = [
  {
    slug: 'best-strollers',
    title: 'Best Strollers',
    shortTitle: 'Strollers',
    description:
      'A calmer way to narrow down full-size, travel, compact, and everyday stroller decisions.',
    imageSrc: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear arrangement featuring stroller and planning details',
    eyebrow: 'Baby Gear Guide',
    seoTitle: 'Best Strollers Guide | Taylor-Made Baby Co.',
    seoDescription:
      'Expert stroller guidance for parents comparing everyday, compact, and travel-friendly options.',
    overview:
      'This guide hub helps families compare stroller categories through real-life fit, not feature overload.',
    focusAreas: [
      'Everyday vs travel-friendly stroller strategy',
      'City living, storage, and terrain considerations',
      'Single-to-double planning and long-term flexibility',
    ],
    quickQuestions: [
      'Do you need one stroller or a two-stage system?',
      'How much trunk space and home storage do you actually have?',
      'What daily terrain, travel, and folding realities matter most?',
    ],
    relatedSlugs: ['best-infant-car-seats', 'minimalist-baby-registry', 'travel-with-baby'],
  },
  {
    slug: 'best-infant-car-seats',
    title: 'Best Infant Car Seats',
    shortTitle: 'Infant Car Seats',
    description:
      'Understand which infant seats make sense for your vehicle, stroller compatibility, and daily routine.',
    imageSrc: '/assets/editorial/registry.jpg',
    imageAlt: 'Car seat and baby registry planning editorial scene',
    eyebrow: 'Baby Gear Guide',
    seoTitle: 'Best Infant Car Seats Guide | Taylor-Made Baby Co.',
    seoDescription:
      'Practical infant car seat guidance for compatibility, fit, installation, and day-to-day use.',
    overview:
      'This hub helps families sort infant seat choices with more emphasis on compatibility and lifestyle fit than brand noise.',
    focusAreas: [
      'Infant seat vs convertible strategy',
      'Vehicle fit and installation considerations',
      'Daily carry, click-in convenience, and stroller compatibility',
    ],
    quickQuestions: [
      'Will an infant seat make the newborn stage easier for your routine?',
      'Which stroller systems are actually compatible with your short list?',
      'What matters more: weight, installation ease, or long-term budget?',
    ],
    relatedSlugs: ['best-strollers', 'minimalist-baby-registry', 'nursery-setup-guide'],
  },
  {
    slug: 'minimalist-baby-registry',
    title: 'Minimalist Baby Registry',
    shortTitle: 'Registry Planning',
    description:
      'Build a registry around what fits your home, timeline, and actual daily life instead of generic checklists.',
    imageSrc: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry planning flat lay with baby essentials',
    eyebrow: 'Baby Preparation Guide',
    seoTitle: 'Minimalist Baby Registry Guide | Taylor-Made Baby Co.',
    seoDescription:
      'Learn what belongs on a minimalist baby registry, what to skip, and what can wait.',
    overview:
      'This hub helps parents build a smarter registry with fewer unnecessary purchases and more confidence in what makes the cut.',
    focusAreas: [
      'What belongs on the registry now vs later',
      'How to avoid clutter and duplicate categories',
      'How registry strategy connects to budget and purchase timing',
    ],
    quickQuestions: [
      'Which categories matter in the first three months?',
      'What can you wait to buy until baby is here?',
      'Where do space, gifting, and budget change the list?',
    ],
    relatedSlugs: ['best-strollers', 'best-infant-car-seats', 'nursery-setup-guide'],
  },
  {
    slug: 'nursery-setup-guide',
    title: 'Nursery Setup Guide',
    shortTitle: 'Nursery Planning',
    description:
      'Design a nursery that supports feeding, diapering, storage, and sleep with calm, functional room flow.',
    imageSrc: '/assets/editorial/nursery.jpg',
    imageAlt: 'Calm nursery planning scene with crib and essentials',
    eyebrow: 'Baby Preparation Guide',
    seoTitle: 'Nursery Setup Guide | Taylor-Made Baby Co.',
    seoDescription:
      'Practical nursery planning guidance for room flow, small spaces, storage, and everyday functionality.',
    overview:
      'This hub approaches the nursery as a working space, not just a styled room.',
    focusAreas: [
      'Room flow for feeding, changing, and sleep',
      'Storage decisions for small and shared spaces',
      'How nursery planning connects to gear and safety decisions',
    ],
    quickQuestions: [
      'Where will the most-used items actually live?',
      'What will make the room feel calmer instead of more crowded?',
      'How should your nursery evolve as baby grows?',
    ],
    relatedSlugs: ['minimalist-baby-registry', 'best-infant-car-seats', 'travel-with-baby'],
  },
  {
    slug: 'travel-with-baby',
    title: 'Travel With Baby',
    shortTitle: 'Travel With Baby',
    description:
      'Sort the travel gear, stroller, and packing decisions that make getting out of the house feel more manageable.',
    imageSrc: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Parent and baby editorial image suggesting movement and confidence',
    eyebrow: 'Baby Gear Guide',
    seoTitle: 'Travel With Baby Guide | Taylor-Made Baby Co.',
    seoDescription:
      'Expert guidance on travel strollers, compact gear, and baby travel systems that actually work.',
    overview:
      'This hub helps families plan for airports, road trips, and daily outings without overpacking or overbuying.',
    focusAreas: [
      'Travel stroller decisions and compact systems',
      'What makes sense for flights, road trips, and errands',
      'How travel gear overlaps with your everyday setup',
    ],
    quickQuestions: [
      'Do you need one stroller for everything or a second travel option?',
      'What needs to be lightweight, compact, or quick to install?',
      'Which gear can do double duty across daily life and travel?',
    ],
    relatedSlugs: ['best-strollers', 'best-infant-car-seats', 'minimalist-baby-registry'],
  },
];

export const trustStripItems = [
  {
    title: 'Former Strolleria Baby Gear Specialist',
    description: 'Real product knowledge from helping families compare gear in the real world, not just on a screen.',
    logos: [
      {
        src: '/assets/logos/strolleria.png',
        alt: 'Strolleria logo',
        label: 'Strolleria',
        width: 1844,
        height: 457,
      },
    ],
  },
  {
    title: 'Nursery Planning Experience (Pottery Barn Kids)',
    description: 'Because the right nursery is not just pretty. It needs to work when you are tired and holding a baby.',
    logos: [
      {
        src: '/assets/brand/potterybarnkids.png',
        alt: 'Pottery Barn Kids logo',
        label: 'Pottery Barn Kids',
        width: 1101,
        height: 152,
      },
    ],
  },
  {
    title: 'Target Baby Concierge Consultant',
    description: 'Experience helping parents sort big decisions before they end up comparing everything at once.',
    logos: [
      {
        src: '/assets/brand/totsquad.png',
        alt: 'Tot Squad logo',
        label: 'Tot Squad',
        width: 1065,
        height: 228,
      },
    ],
  },
  {
    title: 'Private Baby Planning Advisor',
    description: 'Advice shaped by actual homes, routines, budgets, cars, and all the variables roundups tend to ignore.',
    logos: [
      {
        src: '/assets/brand/tot-squad.png',
        alt: 'Tot Squad logo',
        label: 'Tot Squad',
        width: 1334,
        height: 345,
      },
    ],
  },
] as const;

export const advisorExperiencePoints = [
  'Former Strolleria baby gear specialist',
  'Pottery Barn Kids nursery planning experience',
  'Target Baby Concierge consultant',
  'Private baby planning advisor',
] as const;

export const advisorExpertisePoints = [
  'How to choose a stroller that fits your actual routine',
  'Infant car seat fit, compatibility, and what most parents do not realize',
  'Practical registry planning without the clutter',
  'Nursery setup that works when life gets messy and sleep gets thin',
] as const;

export const servicePackages: ServicePackage[] = [
  {
    key: 'focused-session',
    eyebrow: 'One Decision',
    title: 'Focused Session',
    summary: 'A strategic session for one registry or gear decision that needs expert clarity now.',
    description:
      'Ideal for parents narrowing down a stroller, comparing infant car seats, cleaning up a registry category, or deciding what actually belongs on the list.',
    bestFor: 'Families who want Taylor\'s judgment on one high-stakes decision.',
    bullets: [
      'One focused baby gear or planning topic',
      'Expert shortlist and recommendation logic',
      'Clear buy-now, skip, or wait guidance',
    ],
  },
  {
    key: 'signature-planning',
    eyebrow: 'Full Baby Prep',
    title: 'Signature Package',
    summary: 'A guided baby-preparation plan across registry, gear, nursery, and purchase timing.',
    description:
      'This package is for families who want a calm framework for the full prep picture, not just one answer in isolation.',
    bestFor: 'First-time parents or anyone who wants a more structured plan from the start.',
    bullets: [
      'Registry strategy and category priorities',
      'Stroller and car seat recommendations',
      'Nursery planning and home-readiness guidance',
      'A smarter purchasing timeline',
    ],
    featured: true,
  },
  {
    key: 'concierge-support',
    eyebrow: 'Ongoing Advisor Access',
    title: 'Private Concierge',
    summary: 'Premium ongoing guidance for families who want Taylor in the mix as decisions keep moving.',
    description:
      'Designed for families who want expert eyes on evolving short lists, store prep, product comparisons, and next-step decisions over time.',
    bestFor: 'Families who want an advisor relationship, not just a one-time consult.',
    bullets: [
      'Ongoing baby gear and registry guidance',
      'Support as priorities and questions evolve',
      'Store-visit prep and follow-up decision help',
    ],
  },
];

export const homepageTestimonials = [
  {
    quote:
      'Taylor helped us stop researching in circles and pick the products that actually fit our space and routine.',
    attribution: 'First-time parents, Denver',
  },
  {
    quote:
      'We finally knew what to buy before baby, what could wait, and what was not worth the money.',
    attribution: 'Expecting family, Phoenix',
  },
  {
    quote:
      'The stroller and car seat decisions felt huge until Taylor explained what actually mattered.',
    attribution: 'New parents, Portland',
  },
] as const;

export function getGuidePillar(slug: string) {
  return guidePillars.find((guide) => guide.slug === slug) ?? null;
}

export function getRelatedGuidePillars(slug: string, count = 3) {
  const guide = getGuidePillar(slug);

  if (!guide) {
    return guidePillars.slice(0, count);
  }

  const related = guide.relatedSlugs
    .map((relatedSlug) => getGuidePillar(relatedSlug))
    .filter((entry): entry is GuidePillar => Boolean(entry));

  return related.slice(0, count);
}

export function getGuideLinksForBlogCategory(category: string) {
  switch (category) {
    case 'Gear & Safety':
      return [
        getGuidePillar('best-strollers'),
        getGuidePillar('best-infant-car-seats'),
        getGuidePillar('travel-with-baby'),
      ].filter((entry): entry is GuidePillar => Boolean(entry));
    case 'Nursery & Home':
      return [
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('best-infant-car-seats'),
      ].filter((entry): entry is GuidePillar => Boolean(entry));
    case 'Transitions & Family':
      return [
        getGuidePillar('travel-with-baby'),
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('minimalist-baby-registry'),
      ].filter((entry): entry is GuidePillar => Boolean(entry));
    case 'Planning & Events':
      return [
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('nursery-setup-guide'),
        getGuidePillar('travel-with-baby'),
      ].filter((entry): entry is GuidePillar => Boolean(entry));
    case 'Registry Strategy':
    default:
      return [
        getGuidePillar('minimalist-baby-registry'),
        getGuidePillar('best-strollers'),
        getGuidePillar('best-infant-car-seats'),
      ].filter((entry): entry is GuidePillar => Boolean(entry));
  }
}
