export type CaseStudySnapshot = {
  family: string;
  home: string;
  priority: string;
  constraint: string;
  bestFirstMove: string;
};

export type CaseStudyDecision = {
  title: string;
  choice: string;
  reasoning: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  deck: string;
  imageSrc: `/${string}`;
  imageAlt: string;
  snapshot: CaseStudySnapshot;
  startingPoint: string;
  whatMatters: string[];
  whatDoesntMatter: string[];
  decisions: CaseStudyDecision[];
  scenarios: string[];
  realLife: string;
  taylorsNote: string;
  links: string[];
};

type AcademyPathSlug = 'registry' | 'nursery' | 'gear' | 'postpartum';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'apartment-parent',
    title: 'The Apartment Parent',
    deck:
      'A first baby, a smaller home, and the quiet realization that every product needs a real parking spot.',
    imageSrc: '/assets/nurserypath/simplenursery.png',
    imageAlt: 'Compact nursery corner with a calm, practical setup.',
    snapshot: {
      family: 'First baby',
      home: 'One-bedroom apartment',
      priority: 'Small-footprint sleep, stroller, and daily-use gear',
      constraint: 'Very limited storage',
      bestFirstMove: 'Choose the daily zones before choosing products',
    },
    startingPoint:
      'They were trying to build a full registry inside a small apartment. The list looked responsible on paper, but the real question was where anything would live after the boxes arrived.',
    whatMatters: [
      'A safe sleep setup that fits the bedroom without blocking the room.',
      'A stroller that can fold, stand, or store without becoming hallway furniture.',
      'Daily-use items that earn their space more than once a day.',
      'A changing setup that works without needing a full nursery layout.',
      'Registry restraint so gifts do not turn into storage problems.',
    ],
    whatDoesntMatter: [
      'Owning the full-size version of every category.',
      'Creating a separate station for every possible baby task.',
      'Matching a nursery photo that assumes more square footage.',
      'Buying backups before the first version has proven useful.',
    ],
    decisions: [
      {
        title: 'Sleep setup',
        choice: 'A compact crib or bassinet plan before a full nursery furniture plan.',
        reasoning:
          'The first win was making sleep safe and reachable without pretending the apartment had an extra room hiding somewhere.',
      },
      {
        title: 'Stroller lane',
        choice: 'A compact everyday stroller with an easy fold.',
        reasoning:
          'The stroller had to fit real storage, not just look good in a product video with a three-car garage offscreen.',
      },
      {
        title: 'Registry edit',
        choice: 'Fewer single-use items and more multi-job pieces.',
        reasoning:
          'The registry got stronger when every item had to answer where it would live and how often it would help.',
      },
    ],
    scenarios: [
      'The stroller needs to move from car trunk to apartment entry without taking over both.',
      'Diaper changes happen on a dresser pad or portable mat, not a dedicated changing table.',
      'Extra gifts need to be easy to return, exchange, or postpone.',
    ],
    realLife:
      'The final setup was smaller, calmer, and easier to maintain. Nothing magical happened. They just stopped buying for an imaginary house.',
    taylorsNote:
      'Small spaces are honest. They make you prove the item deserves to come home. Annoying? Sometimes. Useful? Very.',
    links: [
      '/academy/registry/what-to-register-first',
      '/academy/nursery/sleep-space-decisions',
      '/academy/nursery/furniture-that-actually-works',
      '/academy/gear/stroller-foundations',
      '/academy/gear/daily-use-gear',
    ],
  },
  {
    slug: 'suburban-driver',
    title: 'The Suburban Driver',
    deck:
      'A car-heavy routine where the best gear decisions start with loading, errands, and the adults doing the buckling.',
    imageSrc: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear setup for a family with a car-based routine.',
    snapshot: {
      family: 'First baby with two commuting adults',
      home: 'Suburban home',
      priority: 'Car seat confidence, stroller trunk fit, easy errands',
      constraint: 'Two vehicles and a lot of in-and-out transitions',
      bestFirstMove: 'Solve the car routine before solving the feature list',
    },
    startingPoint:
      'They were comparing car seats like the safest answer lived in the longest product description. The clearer starting point was the loading routine, the vehicles, and who would use the seat most often.',
    whatMatters: [
      'A car seat category that fits the stage and the actual vehicles.',
      'Install confidence for both adults, not just one very determined person.',
      'A stroller that fits the trunk without a weekly wrestling match.',
      'Compatibility only when it truly simplifies the routine.',
      'Local support when installation or fit is still unclear.',
    ],
    whatDoesntMatter: [
      'The car seat with the most features on the box.',
      'A travel system if the stroller itself does not fit the week.',
      'Buying for every grandparent car before the main setup is settled.',
      'Assuming heavier automatically means better.',
    ],
    decisions: [
      {
        title: 'Car seat category',
        choice: 'Start with infant seat versus convertible based on the loading routine.',
        reasoning:
          'Portability mattered because errands and daycare pickup were part of the week from the beginning.',
      },
      {
        title: 'Stroller compatibility',
        choice: 'Check trunk fit before getting attached to the travel system idea.',
        reasoning:
          'Compatibility is only helpful if the stroller also fits the car, the adult, and the outing.',
      },
      {
        title: 'Support',
        choice: 'Use expert help for install questions instead of guessing.',
        reasoning:
          'This is one of those categories where confidence is not a personality trait. It is a setup outcome.',
      },
    ],
    scenarios: [
      'One adult handles daycare drop-off and the other handles pickup.',
      'The stroller lives in the trunk most of the week.',
      'Grandparents may help later, but the main vehicles need to work first.',
    ],
    realLife:
      'Their plan became less about the fanciest seat and more about repeated use. That made the whole travel system conversation easier.',
    taylorsNote:
      'The car gets a vote. The trunk gets a vote. The adult who installs the base while sweating quietly in the driveway definitely gets a vote.',
    links: [
      '/academy/gear/car-seat-foundations',
      '/academy/gear/travel-systems',
      '/academy/gear/stroller-foundations',
      '/academy/registry/shop-local-get-support',
    ],
  },
  {
    slug: 'travel-family',
    title: 'The Travel Family',
    deck:
      'A family planning flights, weekends away, and grandparent visits without turning portability into a second full registry.',
    imageSrc: '/assets/gearpath/travelcribcicco.png',
    imageAlt: 'Portable travel crib set up in a real living space.',
    snapshot: {
      family: 'First baby, frequent trips',
      home: 'Home base plus regular travel',
      priority: 'Portable sleep, compact stroller, fewer moving parts',
      constraint: 'Gear needs to leave the house often',
      bestFirstMove: 'Separate everyday gear from travel gear',
    },
    startingPoint:
      'They wanted one product to do every job: daily walks, airport travel, naps away from home, and grandparent weekends. The problem was not ambition. It was asking one item to love every job equally.',
    whatMatters: [
      'A travel crib that is believable to carry and set up repeatedly.',
      'A stroller lane that matches the most common trips.',
      'A feeding and diaper setup that can reset quickly away from home.',
      'A clear difference between daily-use and travel-use items.',
      'A packing plan that keeps the essentials obvious.',
    ],
    whatDoesntMatter: [
      'Calling something travel-friendly because the box says portable.',
      'Buying duplicate travel versions of items that rarely leave home.',
      'Choosing the tiniest item if it makes daily use worse.',
      'Solving for every possible trip before the first one happens.',
    ],
    decisions: [
      {
        title: 'Portable sleep',
        choice: 'A dedicated travel crib if sleep away from home will happen often.',
        reasoning:
          'Repeated setup changes the category. Lightweight and simple mattered more than extra attachments.',
      },
      {
        title: 'Stroller lane',
        choice: 'A travel stroller only if it still works for the family pace.',
        reasoning:
          'The best travel stroller is not automatically the smallest. It is the one people will actually use without resentment.',
      },
      {
        title: 'Daily versus travel',
        choice: 'Let home gear stay home when the travel version has a different job.',
        reasoning:
          'Two items can be reasonable when the jobs are genuinely different. That is not overbuying. That is clarity.',
      },
    ],
    scenarios: [
      "A weekend trip means the sleep setup needs to open quickly in someone else's house.",
      'Airport travel makes carry weight and fold speed matter more than storage baskets.',
      'The everyday stroller still has to handle normal errands when no one is boarding anything.',
    ],
    realLife:
      'Their travel plan got simpler when they stopped forcing one setup to cover every version of leaving the house.',
    taylorsNote:
      'Portable only counts if you would willingly move it while tired. Otherwise it is just regular gear with a handle.',
    links: [
      '/academy/gear/travel-with-baby',
      '/academy/gear/travel-systems',
      '/academy/gear/stroller-foundations',
      '/academy/gear/daily-use-gear/pack-and-play',
    ],
  },
  {
    slug: 'overwhelmed-first-time',
    title: 'The Overwhelmed First-Time Parent',
    deck:
      'A registry that started at 140 items and got calmer once the family stopped treating every category like a final exam.',
    imageSrc: '/assets/hero/hero-baby-editorial-v2.jpg',
    imageAlt: 'Soft editorial baby planning image for a first-time parent.',
    snapshot: {
      family: 'First baby',
      home: 'Still figuring out routines',
      priority: 'A practical registry without panic buying',
      constraint: 'Too many opinions and too many tabs',
      bestFirstMove: 'Build the first-pass registry before chasing specifics',
    },
    startingPoint:
      'They had saved every list, watched every comparison, and somehow felt less prepared. The list was not missing effort. It was missing order.',
    whatMatters: [
      'Starting with the categories that support sleep, feeding, diapering, movement, and safety.',
      'Choosing where decisions need expert help versus a simple default.',
      'Using the registry as a planning tool, not a proof of preparedness.',
      'Leaving room to learn what the baby and the home actually prefer.',
      'Knowing what can wait without creating a last-minute scramble.',
    ],
    whatDoesntMatter: [
      'Having a complete opinion about every product before the shower.',
      'Adding items because three strangers called them essential.',
      'Finishing the registry in one emotional sitting.',
      'Confusing a long list with a confident list.',
    ],
    decisions: [
      {
        title: 'Registry first pass',
        choice: 'Start with practical categories before brand-level decisions.',
        reasoning:
          'The list became easier once it was organized by jobs, not by panic tabs.',
      },
      {
        title: 'Decision support',
        choice: 'Get help on categories with safety, fit, or expensive tradeoffs.',
        reasoning:
          'Not every item deserves the same amount of research. That was the relief.',
      },
      {
        title: 'Wait list',
        choice: 'Move nice-to-have items into a later decision list.',
        reasoning:
          'Waiting became a strategy, not a failure to be ready.',
      },
    ],
    scenarios: [
      'A shower date is coming, but the family still has not chosen a stroller.',
      'Friends keep recommending totally different products with total confidence.',
      'The registry platform keeps suggesting more items than the family actually wants.',
    ],
    realLife:
      'They did not need a bigger list. They needed a better order. Once that clicked, the registry got shorter and more useful.',
    taylorsNote:
      'Overwhelm is not a character flaw. It is what happens when every product gets the microphone at the same time.',
    links: [
      '/academy/registry/what-to-register-first',
      '/academy/gear/how-to-think-about-baby-gear',
      '/academy/registry/mistakes-to-avoid',
      '/academy/nursery/vision-and-lifestyle',
    ],
  },
  {
    slug: 'second-time-parent',
    title: 'The Second-Time Parent',
    deck:
      'A growing family with some gear already, a clearer sense of reality, and a very low tolerance for buying things twice.',
    imageSrc: '/assets/editorial/babyroom.png',
    imageAlt: 'Calm nursery room for a growing family planning baby gear.',
    snapshot: {
      family: 'Second baby',
      home: 'Existing baby gear in storage',
      priority: 'Reuse what works, replace what does not',
      constraint: 'Different season, different home rhythm, older sibling in the mix',
      bestFirstMove: 'Audit the old gear before adding new gear',
    },
    startingPoint:
      'They already owned plenty. That was the issue. Some items still made sense, some had expired emotionally, and some were only being kept because returning to the research sounded worse.',
    whatMatters: [
      'Checking what is still safe, usable, and actually liked.',
      'Updating the registry around gaps instead of rebuilding from scratch.',
      'Planning the first weeks around an older sibling too.',
      'Knowing which purchases can wait until the new rhythm appears.',
      'Using completion discounts on real gaps, not nostalgia clutter.',
    ],
    whatDoesntMatter: [
      'Creating a full new registry because the platform makes it easy.',
      'Keeping gear that made daily life harder the first time.',
      'Buying a second version before testing whether the first still works.',
      'Pretending this baby will arrive into the same family routine.',
    ],
    decisions: [
      {
        title: 'Gear audit',
        choice: 'Keep, replace, donate, or wait.',
        reasoning:
          'The old gear needed a job review. Sentimental storage is not the same as a plan.',
      },
      {
        title: 'Registry strategy',
        choice: 'Use the registry for gaps, consumables, and updated support items.',
        reasoning:
          'The best second-time registry is usually specific, not shy.',
      },
      {
        title: 'Postpartum rhythm',
        choice: 'Plan around the whole household, not only the newborn.',
        reasoning:
          'The older sibling changes meals, sleep, errands, and how much setup can realistically happen each day.',
      },
    ],
    scenarios: [
      'The old stroller works, but the family now has a toddler walking beside it.',
      'The baby arrives in a different season than the first.',
      'The nursery is no longer a blank room. It has actual family life in it.',
    ],
    realLife:
      'The final list was not tiny, but it was honest. They kept the good, replaced the annoying, and stopped rebuying the fantasy version of their first registry.',
    taylorsNote:
      'Second-time parents are allowed to be picky. You have data now. Use it.',
    links: [
      '/academy/registry/smart-purchasing-timeline',
      '/academy/registry/rewards-completion-discounts',
      '/academy/postpartum/first-weeks-home-rhythm',
      '/academy/gear/daily-use-gear',
    ],
  },
  {
    slug: 'home-with-pets',
    title: 'The Home With Pets',
    deck:
      'A baby prep plan for a house that already has routines, fur, sound, curiosity, and at least one creature who thinks the nursery is about them.',
    imageSrc: '/assets/nurserypath/nurseryplayroom.png',
    imageAlt: 'Practical nursery and playroom layout for a real home.',
    snapshot: {
      family: 'First baby with pets at home',
      home: 'Shared spaces already in use',
      priority: 'Safe zones, washable routines, and realistic boundaries',
      constraint: 'Pets, traffic patterns, and daily mess already exist',
      bestFirstMove: 'Plan zones before buying containers',
    },
    startingPoint:
      'They were thinking about nursery style, but the real work was flow. Where would baby sleep, where would pets be, where would supplies live, and what needed to be washable because life was already happening?',
    whatMatters: [
      'Clear baby zones that do not rely on constant adult vigilance.',
      'Washable surfaces and storage that can handle real mess.',
      'A sleep setup that feels protected without overcomplicating the room.',
      'Daily-use gear that keeps baby off the floor when needed.',
      'A postpartum plan that respects the routines already in the house.',
    ],
    whatDoesntMatter: [
      'A nursery that photographs perfectly but ignores the hallway traffic.',
      'Buying every pet-specific baby product before seeing the actual issue.',
      'Assuming a closed door solves the entire house flow.',
      'Choosing delicate fabrics for zones that will see real use.',
    ],
    decisions: [
      {
        title: 'Room flow',
        choice: 'Set up zones for sleep, changing, feeding, and pet boundaries.',
        reasoning:
          'The family needed fewer decorative decisions and more obvious places for everyone to be.',
      },
      {
        title: 'Daily-use gear',
        choice: 'Prioritize washable, stable, repeat-use items.',
        reasoning:
          'The gear had to work in a house that already had movement, sound, and mess.',
      },
      {
        title: 'Postpartum support',
        choice: 'Plan pet routines into the first weeks home.',
        reasoning:
          'The adults would recover better if feeding, walks, gates, and rest were not all improvised later.',
      },
    ],
    scenarios: [
      'The main floor needs a safe baby spot while pets move through the house.',
      'Diaper supplies need to be easy for adults but not interesting for pets.',
      'Night feeds happen near the sleep setup, not in the prettiest corner of the room.',
    ],
    realLife:
      'Their plan became more practical and less precious. The nursery still looked sweet. It just also worked with the household that already existed.',
    taylorsNote:
      'Your home does not become a showroom because a baby is coming. It becomes a busier home. Plan for that and everything gets kinder.',
    links: [
      '/academy/nursery/layout-and-flow',
      '/academy/nursery/atmosphere-and-safety',
      '/academy/nursery/sleep-space-decisions',
      '/academy/gear/daily-use-gear',
      '/academy/postpartum/first-weeks-home-rhythm',
    ],
  },
];

export const CASE_STUDY_LINK_LABELS: Record<string, string> = {
  '/academy/registry/what-to-register-first': 'What To Register First',
  '/academy/registry/where-to-register': 'Where To Register',
  '/academy/registry/shop-local-get-support': 'Shop Local & Get Support',
  '/academy/registry/welcome-boxes-perks': 'Welcome Boxes & Registry Perks',
  '/academy/registry/rewards-completion-discounts': 'Rewards & Completion Discounts',
  '/academy/registry/smart-purchasing-timeline': 'Smart Purchasing Timeline',
  '/academy/registry/mistakes-to-avoid': 'Registry Mistakes To Avoid',
  '/academy/nursery/vision-and-lifestyle': 'Vision & Lifestyle',
  '/academy/nursery/sleep-space-decisions': 'Sleep Space Decisions',
  '/academy/nursery/furniture-that-actually-works': 'Furniture That Actually Works',
  '/academy/nursery/layout-and-flow': 'Layout & Flow',
  '/academy/nursery/atmosphere-and-safety': 'Atmosphere & Safety',
  '/academy/gear/how-to-think-about-baby-gear': 'How To Think About Baby Gear',
  '/academy/gear/stroller-foundations': 'Stroller Foundations',
  '/academy/gear/car-seat-foundations': 'Car Seat Foundations',
  '/academy/gear/travel-systems': 'Travel Systems',
  '/academy/gear/travel-with-baby': 'Travel With Baby',
  '/academy/gear/daily-use-gear': 'Daily Use Gear',
  '/academy/gear/daily-use-gear/pack-and-play': 'Pack & Play',
  '/academy/postpartum/first-weeks-home-rhythm': 'First Weeks Home Rhythm',
};

const CASE_STUDIES_BY_MODULE: Record<string, string[]> = {
  'what-to-register-first': ['overwhelmed-first-time', 'apartment-parent'],
  'where-to-register': ['overwhelmed-first-time', 'second-time-parent'],
  'shop-local-get-support': ['suburban-driver', 'overwhelmed-first-time'],
  'welcome-boxes-perks': ['overwhelmed-first-time', 'second-time-parent'],
  'rewards-completion-discounts': ['second-time-parent', 'overwhelmed-first-time'],
  'smart-purchasing-timeline': ['second-time-parent', 'apartment-parent'],
  'mistakes-to-avoid': ['overwhelmed-first-time', 'second-time-parent'],
  'baby-showers-gifting': ['overwhelmed-first-time', 'apartment-parent'],
  'vision-and-lifestyle': ['overwhelmed-first-time', 'home-with-pets'],
  'sleep-space-decisions': ['apartment-parent', 'home-with-pets'],
  'furniture-that-actually-works': ['apartment-parent', 'home-with-pets'],
  'layout-and-flow': ['home-with-pets', 'apartment-parent'],
  'storage-and-organization': ['apartment-parent', 'second-time-parent'],
  'atmosphere-and-safety': ['home-with-pets', 'apartment-parent'],
  'how-to-think-about-baby-gear': ['overwhelmed-first-time', 'apartment-parent'],
  'stroller-foundations': ['suburban-driver', 'travel-family'],
  'full-size-modular-strollers': ['suburban-driver', 'second-time-parent'],
  'compact-lightweight-strollers': ['apartment-parent', 'travel-family'],
  'travel-strollers': ['travel-family', 'apartment-parent'],
  'car-seat-foundations': ['suburban-driver', 'travel-family'],
  'infant-car-seats': ['suburban-driver', 'overwhelmed-first-time'],
  'convertible-car-seats': ['suburban-driver', 'second-time-parent'],
  'all-in-one-car-seats': ['suburban-driver', 'second-time-parent'],
  'travel-systems': ['suburban-driver', 'travel-family'],
  'travel-with-baby': ['travel-family', 'suburban-driver'],
  'daily-use-gear': ['home-with-pets', 'travel-family'],
  highchair: ['home-with-pets', 'overwhelmed-first-time'],
  carrier: ['home-with-pets', 'travel-family'],
  'swing-bouncer': ['home-with-pets', 'overwhelmed-first-time'],
  'baby-bath': ['home-with-pets', 'apartment-parent'],
  'daily-support-gear': ['home-with-pets', 'second-time-parent'],
  'pack-and-play': ['travel-family', 'apartment-parent'],
  'feeding-setup-flow': ['overwhelmed-first-time', 'second-time-parent'],
  'breast-pump': ['overwhelmed-first-time', 'second-time-parent'],
  'bottles-and-baby-utensils': ['overwhelmed-first-time', 'home-with-pets'],
  'healing-and-recovery': ['second-time-parent', 'home-with-pets'],
  'first-weeks-home-rhythm': ['second-time-parent', 'home-with-pets'],
  'feeding-and-lactation': ['overwhelmed-first-time', 'second-time-parent'],
  'rest-and-sleep': ['second-time-parent', 'home-with-pets'],
  'emotional-wellness-and-identity': ['overwhelmed-first-time', 'second-time-parent'],
  'support-systems': ['second-time-parent', 'home-with-pets'],
};

const CASE_STUDIES_BY_PATH: Record<AcademyPathSlug, string[]> = {
  registry: ['overwhelmed-first-time', 'second-time-parent', 'apartment-parent'],
  nursery: ['apartment-parent', 'home-with-pets', 'overwhelmed-first-time'],
  gear: ['suburban-driver', 'travel-family', 'home-with-pets'],
  postpartum: ['second-time-parent', 'home-with-pets', 'overwhelmed-first-time'],
};

function uniqueSlugs(slugs: string[]) {
  return Array.from(new Set(slugs));
}

function studyBySlug(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug) ?? null;
}

export function getCaseStudies() {
  return CASE_STUDIES;
}

export function getCaseStudyHref(slug: string): `/academy/case-studies/${string}` {
  return `/academy/case-studies/${slug}`;
}

export function getCaseStudyBySlug(slug: string) {
  return studyBySlug(slug);
}

export function isCaseStudySlug(slug: string) {
  return CASE_STUDIES.some((study) => study.slug === slug);
}

export function getCaseStudyLinkItems(study: CaseStudy) {
  return study.links.map((href) => ({
    href,
    label: CASE_STUDY_LINK_LABELS[href] ?? href.replace('/academy/', '').replaceAll('-', ' '),
  }));
}

export function getCaseStudiesForAcademyPath(pathSlug: AcademyPathSlug, limit = 3) {
  return (CASE_STUDIES_BY_PATH[pathSlug] ?? [])
    .map(studyBySlug)
    .filter((study): study is CaseStudy => Boolean(study))
    .slice(0, limit);
}

export function getCaseStudiesForAcademyModule(
  moduleSlug: string,
  pathSlug?: AcademyPathSlug,
  limit = 2,
) {
  const directMatches = CASE_STUDIES_BY_MODULE[moduleSlug] ?? [];
  const linkMatches = CASE_STUDIES.filter((study) =>
    study.links.some((link) => link.endsWith(`/${moduleSlug}`)),
  ).map((study) => study.slug);
  const pathMatches = pathSlug ? CASE_STUDIES_BY_PATH[pathSlug] ?? [] : [];

  return uniqueSlugs([...directMatches, ...linkMatches, ...pathMatches])
    .map(studyBySlug)
    .filter((study): study is CaseStudy => Boolean(study))
    .slice(0, limit);
}

export function getRelatedCaseStudies(study: CaseStudy, limit = 2) {
  const relatedSlugs = CASE_STUDIES.filter((candidate) => {
    if (candidate.slug === study.slug) {
      return false;
    }

    return candidate.links.some((link) => study.links.includes(link));
  }).map((candidate) => candidate.slug);

  const fallbackSlugs = CASE_STUDIES.filter((candidate) => candidate.slug !== study.slug).map(
    (candidate) => candidate.slug,
  );

  return uniqueSlugs([...relatedSlugs, ...fallbackSlugs])
    .map(studyBySlug)
    .filter((candidate): candidate is CaseStudy => Boolean(candidate))
    .slice(0, limit);
}
