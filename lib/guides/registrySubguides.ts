import type { GuideCardItem } from '@/lib/guides/presentation';

export const REGISTRY_SUBGUIDE_PATHS = {
  minimalist: '/guides/registry/minimalist',
  essentials: '/guides/registry/essentials',
  mistakes: '/guides/registry/mistakes',
  'where-to-register': '/guides/registry/where-to-register',
  timeline: '/guides/registry/timeline',
  perks: '/guides/registry/perks',
} as const;

export const REGISTRY_GUIDE_PARENT_SLUG = 'minimalist-baby-registry';
export const REGISTRY_GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library: Registry';

export type RegistrySubGuideSlug = keyof typeof REGISTRY_SUBGUIDE_PATHS;

type RegistrySubGuideGridItem = {
  slug: RegistrySubGuideSlug;
  title: string;
  description: string;
  laneLabel: string;
  icon: 'strategy' | 'checklist' | 'shield' | 'bag' | 'calendar' | 'book';
};

export type RegistrySubGuidePageData = {
  slug: RegistrySubGuideSlug;
  path: (typeof REGISTRY_SUBGUIDE_PATHS)[RegistrySubGuideSlug];
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  relatedSlugs: string[];
  content: string;
  nextStepCtaHref: string;
  nextStepCtaLabel: string;
};

export const REGISTRY_SUBGUIDE_GRID_ITEMS: RegistrySubGuideGridItem[] = [
  {
    slug: 'minimalist',
    title: 'Minimalist Registry',
    description:
      'For parents who want fewer items, clearer priorities, and a registry built around what actually gets used.',
    laneLabel: 'APPROACH',
    icon: 'strategy',
  },
  {
    slug: 'essentials',
    title: 'What to Register For First',
    description:
      'The foundation items that support sleep, feeding, diapering, and daily life before adding anything extra.',
    laneLabel: 'START',
    icon: 'checklist',
  },
  {
    slug: 'mistakes',
    title: 'Registry Mistakes to Avoid',
    description:
      'Common decisions that lead to overbuying, duplication, and items that do not fit your real routine.',
    laneLabel: 'AVOID',
    icon: 'shield',
  },
  {
    slug: 'where-to-register',
    title: 'Where to Register & Why',
    description:
      'How to choose between Target, Amazon, Babylist, and others based on perks, flexibility, and returns.',
    laneLabel: 'SETUP',
    icon: 'bag',
  },
  {
    slug: 'timeline',
    title: 'When to Buy What',
    description:
      'What to purchase early, what to delay, and how to time your registry decisions.',
    laneLabel: 'TIMING',
    icon: 'calendar',
  },
  {
    slug: 'perks',
    title: 'Free Registry Perks & Welcome Boxes',
    description:
      'What each retailer offers, how to qualify, and how to maximize free items and incentives.',
    laneLabel: 'BONUS',
    icon: 'book',
  },
];

const DEFAULT_GUIDE_IMAGE = '/assets/hero/hero-baby-editorial.jpg';

const REGISTRY_NEXT_STEP_GUIDES: GuideCardItem[] = [
  {
    slug: 'minimalist-baby-registry',
    href: '/guides/registry',
    title: 'Registry Hub',
    description: 'Return to the full registry decision hub.',
    imageSrc: DEFAULT_GUIDE_IMAGE,
    imageAlt: 'Taylor-Made Baby Co. registry planning hub.',
    eyebrow: 'Registry Planning',
  },
  {
    slug: 'best-strollers',
    href: '/guides/strollers',
    title: 'Stroller Guide',
    description: 'Use this once you are ready to narrow stroller tradeoffs.',
    imageSrc: DEFAULT_GUIDE_IMAGE,
    imageAlt: 'Taylor-Made Baby Co. stroller guide.',
    eyebrow: 'Strollers',
  },
  {
    slug: 'best-infant-car-seats',
    href: '/guides/car-seats',
    title: 'Car Seat Guide',
    description: 'Use this when you are ready to sort infant and convertible seat fit.',
    imageSrc: DEFAULT_GUIDE_IMAGE,
    imageAlt: 'Taylor-Made Baby Co. car seat guide.',
    eyebrow: 'Car Seats',
  },
  {
    slug: 'nursery-setup-guide',
    href: '/guides/nursery',
    title: 'Nursery Guide',
    description: 'Use this when the room plan starts affecting the registry list.',
    imageSrc: DEFAULT_GUIDE_IMAGE,
    imageAlt: 'Taylor-Made Baby Co. nursery guide.',
    eyebrow: 'Nursery Planning',
  },
];

function buildNextStepsSection() {
  return [
    '## Next Steps',
    '',
    '- [Return to the Registry Hub](/guides/registry)',
    '- [Compare stroller options](/guides/strollers)',
    '- [Compare car seat options](/guides/car-seats)',
    '- [Plan the nursery setup](/guides/nursery)',
  ].join('\n');
}

type RegistryMarkdownSection = {
  title: string;
  lines: string[];
};

function buildBulletLines(items: string[]) {
  return items.map((item) => `- ${item}`);
}

function buildRegistrySection({ title, lines }: RegistryMarkdownSection) {
  return [`## ${title}`, '', ...lines].join('\n');
}

function buildRegistrySubGuideContent({
  orientation,
  whatThisIs,
  whoThisIsFor,
  whyItExists,
  whatPeopleGetWrong,
  decisionFramework,
  sections,
  finalThought,
  takeaways,
}: {
  orientation: string[];
  whatThisIs: string;
  whoThisIsFor: string[];
  whyItExists: string;
  whatPeopleGetWrong: string[];
  decisionFramework: string[];
  sections: RegistryMarkdownSection[];
  finalThought: string;
  takeaways: string[];
}) {
  return [
    orientation.join('\n\n'),
    buildRegistrySection({
      title: 'What this is',
      lines: [whatThisIs],
    }),
    buildRegistrySection({
      title: 'Who this is for',
      lines: buildBulletLines(whoThisIsFor),
    }),
    buildRegistrySection({
      title: 'Why it exists',
      lines: [whyItExists],
    }),
    buildRegistrySection({
      title: 'What people get wrong',
      lines: buildBulletLines(whatPeopleGetWrong),
    }),
    buildRegistrySection({
      title: 'Decision Framework',
      lines: buildBulletLines(decisionFramework),
    }),
    ...sections.map((section) => buildRegistrySection(section)),
    buildRegistrySection({
      title: 'Final Thought',
      lines: [finalThought],
    }),
    buildRegistrySection({
      title: 'Takeaways',
      lines: buildBulletLines(takeaways),
    }),
    buildNextStepsSection(),
  ].join('\n\n');
}

const REGISTRY_SUBGUIDE_PAGES: Record<RegistrySubGuideSlug, RegistrySubGuidePageData> = {
  minimalist: {
    slug: 'minimalist',
    path: REGISTRY_SUBGUIDE_PATHS.minimalist,
    title: 'Minimalist Baby Registry',
    description: 'Build a tighter registry around daily use, space, and what you can decide with confidence now.',
    seoTitle: 'Minimalist Baby Registry | Taylor-Made Baby Co.',
    seoDescription:
      'A structured guide to building a smaller, smarter baby registry around daily use, space, and clear priorities.',
    targetKeyword: 'minimalist baby registry',
    secondaryKeywords: ['baby registry guide', 'what to put on a baby registry', 'registry planning', 'registry essentials'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'essentials', 'mistakes'],
    nextStepCtaHref: '/guides/registry',
    nextStepCtaLabel: 'Return to the Registry Hub',
    content: buildRegistrySubGuideContent({
      orientation: [
        'A minimalist registry is not a less thoughtful registry. It is just a registry with boundaries.',
        'The goal is not to prove you can parent with twelve items and a candle. The goal is to register for what will earn its keep in daily life, then leave room for real experience to finish the list.',
      ],
      whatThisIs:
        'A filtered registry approach that keeps the first pass centered on everyday function, realistic space, and decisions you can actually make before baby arrives.',
      whoThisIsFor: [
        'Parents who want a shorter list that still covers the real basics.',
        'Families with limited storage, tighter budgets, or a low tolerance for duplicates.',
        'Anyone who would rather add later based on real use than overbuy early out of stress.',
      ],
      whyItExists:
        'Registry lists get noisy when every category is treated like a day-one emergency. This exists to keep the first pass useful, giftable, and easier to live with.',
      whatPeopleGetWrong: [
        'Assuming minimalist means skipping basics instead of trimming duplication.',
        'Adding backup versions of the same function before testing the first version.',
        'Letting popularity decide what belongs in a smaller home or a calmer budget.',
      ],
      decisionFramework: [
        'Start with sleep, feeding, diapering, clothing, and one practical movement plan.',
        'Keep only the version of each item that solves a real daily task right away.',
        'Move maybe-later items to a private note instead of a public registry.',
        'Revisit delayed items after baby arrives or during the completion-discount window.',
      ],
      sections: [
        {
          title: 'Keep on the first-pass registry',
          lines: buildBulletLines([
            'A safe sleep space.',
            'A basic feeding setup.',
            'Diapering supplies for the first weeks.',
            'Everyday clothing in a small range of sizes.',
            'One simple travel setup, not multiple versions of the same function.',
          ]),
        },
        {
          title: 'Delay until after baby arrives',
          lines: buildBulletLines([
            'Extra bottle systems before you know feeding preference.',
            'Large toy collections.',
            'Specialty soothing gear with one narrow use case.',
            'Backup versions of products you have not tested yet.',
          ]),
        },
        {
          title: 'Skip unless you have a clear reason',
          lines: buildBulletLines([
            'Multiple swings, loungers, or containers.',
            'Decor-first items that do not improve function.',
            'Large quantities of one diaper or wipe brand before fit testing.',
            'Category duplicates added only because they are popular online.',
          ]),
        },
        {
          title: 'Quick filter for every item',
          lines: buildBulletLines([
            'Does this solve a real daily task?',
            'Does it fit the space you actually have?',
            'Would you still buy it yourself if nobody gifted it?',
            'Can this wait until after birth without creating a problem?',
          ]),
        },
        {
          title: 'A simple registry rule',
          lines: buildBulletLines([
            'Put must-have items on the main list.',
            'Move maybe-later items to a private shopping note.',
            'Revisit the note during the completion discount window.',
          ]),
        },
      ],
      finalThought:
        'A smaller registry is often the calmer registry. Less duplicate gear. Fewer guesses. More room for real life to tell you what belongs later.',
      takeaways: [
        'Minimalist does not mean underprepared. It means better filtered.',
        'Register for the first stretch, not for every hypothetical month ahead.',
        'Keep public lists clean and hold maybe-later items privately until real use gives you an answer.',
      ],
    }),
  },
  essentials: {
    slug: 'essentials',
    path: REGISTRY_SUBGUIDE_PATHS.essentials,
    title: 'What to Register For First',
    description: 'Start with the categories that support sleep, feeding, diapering, and basic daily setup.',
    seoTitle: 'What to Register For First | Taylor-Made Baby Co.',
    seoDescription:
      'A structured first-pass baby registry guide covering sleep, feeding, diapering, and everyday setup before extras.',
    targetKeyword: 'registry essentials',
    secondaryKeywords: ['what to register for first', 'baby registry checklist', 'newborn essentials', 'registry basics'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'mistakes', 'timeline'],
    nextStepCtaHref: '/guides/registry',
    nextStepCtaLabel: 'Return to the Registry Hub',
    content: buildRegistrySubGuideContent({
      orientation: [
        'The first registry pass should cover function before variety.',
        'If the list cannot support sleep, feeding, diapering, clothing, and a basic way to move through the day, it is not ready for themed extras or backup systems.',
      ],
      whatThisIs:
        'A first-pass registry guide for deciding what belongs on the list before extras, upgrades, and well-meaning chaos start piling on.',
      whoThisIsFor: [
        'Parents building the first real version of their registry.',
        'Families who want the basics covered before they compare optional gear.',
        'Anyone staring at a long checklist and wondering what actually needs to come first.',
      ],
      whyItExists:
        'The essentials conversation gets messy when everything is treated like a must-have. This exists to put the early setup back in a practical order.',
      whatPeopleGetWrong: [
        'Adding convenience extras before the foundational categories are covered.',
        'Registering for large quantities of one feeding or diapering system before testing fit.',
        'Treating variety like preparedness when the first stretch mostly needs dependable basics.',
      ],
      decisionFramework: [
        'Start with sleep, feeding, diapering, clothing, and daily movement.',
        'Register for one workable setup per function before adding backups.',
        'Keep the first eight weeks in view instead of solving the whole first year at once.',
        'Move optional categories to round two if the basics already cover daily life.',
      ],
      sections: [
        {
          title: 'Start with these categories',
          lines: buildBulletLines([
            'Sleep',
            'Feeding',
            'Diapering',
            'Clothing and linens',
            'Daily movement and carrying',
          ]),
        },
        {
          title: 'Sleep basics first',
          lines: buildBulletLines([
            'One primary sleep space.',
            'Fitted sheets sized for that sleep space.',
            'Swaddles or sleep sacks in a small first batch.',
            'Monitor only if it matches the room setup and your comfort level.',
          ]),
        },
        {
          title: 'Feeding basics first',
          lines: buildBulletLines([
            'A small starter bottle set if you plan to bottle feed or combo feed.',
            'Burp cloths and bibs.',
            'Breast pump and support items if relevant to your plan.',
            'Do not register for large quantities of one bottle style before testing.',
          ]),
        },
        {
          title: 'Diapering basics first',
          lines: buildBulletLines([
            'Newborn and size-one diapers in modest quantities.',
            'Wipes.',
            'Diaper cream.',
            'One realistic changing setup with storage nearby.',
          ]),
        },
        {
          title: 'Daily life basics',
          lines: buildBulletLines([
            'Zip sleepers and simple layers.',
            'Laundry support.',
            'One diaper bag setup.',
            'A safe place to put baby down in the rooms you use most.',
          ]),
        },
        {
          title: 'Hold for round two',
          lines: buildBulletLines([
            'Specialty feeding accessories.',
            'Large toy sets.',
            'Category backups.',
            'Optional gear tied to a routine you have not lived yet.',
          ]),
        },
      ],
      finalThought:
        'An essentials list should look a little boring on purpose. Boring is often another word for useful when you are building the first stretch of life with a newborn.',
      takeaways: [
        'Cover the basics before you buy category variety.',
        'One workable setup beats three untested systems.',
        'Build the first pass for daily function, then let round two handle the extras.',
      ],
    }),
  },
  mistakes: {
    slug: 'mistakes',
    path: REGISTRY_SUBGUIDE_PATHS.mistakes,
    title: 'Registry Mistakes to Avoid',
    description: 'Avoid the decisions that make a registry longer, less useful, and harder to shop from.',
    seoTitle: 'Registry Mistakes to Avoid | Taylor-Made Baby Co.',
    seoDescription:
      'A clear list of baby registry mistakes that lead to overbuying, duplication, and a list that does not match real life.',
    targetKeyword: 'baby registry mistakes',
    secondaryKeywords: ['registry mistakes to avoid', 'common registry mistakes', 'how to build a baby registry', 'registry planning tips'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'essentials', 'where-to-register'],
    nextStepCtaHref: '/guides/registry',
    nextStepCtaLabel: 'Return to the Registry Hub',
    content: buildRegistrySubGuideContent({
      orientation: [
        'Most registry problems are structure problems.',
        'The list gets too long when every category is treated as urgent. Fix the order first and the registry usually gets much easier to clean up.',
      ],
      whatThisIs:
        'A practical guide to the mistakes that make a registry longer, noisier, and less useful once real life begins.',
      whoThisIsFor: [
        'Parents starting a registry from scratch and wanting cleaner guardrails.',
        'Families whose current list already feels messy, duplicated, or oddly stressful.',
        'Anyone who wants a quicker way to separate useful gear from category clutter.',
      ],
      whyItExists:
        'Registry advice often tells parents what to add, not what to edit. This exists to help the list make more sense before it goes public.',
      whatPeopleGetWrong: [
        'Treating every popular category like it belongs on the first-pass list.',
        'Registering by brand reputation instead of by daily task.',
        'Sharing the registry before deciding what stays public, private, or buy-later.',
      ],
      decisionFramework: [
        'Audit the list by function, not by retailer section.',
        'Keep one item per job until you have a real reason to add another.',
        'Separate must-have, nice-to-have, and later categories before sharing.',
        'Review duplicates, sizing risk, and return friction before the registry goes live.',
      ],
      sections: [
        {
          title: 'Common mistakes',
          lines: buildBulletLines([
            'Registering by brand hype instead of by daily task.',
            'Adding multiple products that solve the same problem.',
            'Registering for too many newborn-size consumables.',
            'Choosing major gear before the room plan and routine are clear.',
            'Building a public list before deciding what you will buy yourself.',
          ]),
        },
        {
          title: 'Duplication risks',
          lines: buildBulletLines([
            'Bottles from several systems.',
            'Multiple container seats.',
            'Too many blankets and swaddles in the same size.',
            'More clothing than your laundry rhythm can support.',
          ]),
        },
        {
          title: 'Retailer setup mistakes',
          lines: buildBulletLines([
            'Spreading the public registry across too many links.',
            'Ignoring return policy differences.',
            'Missing welcome-box or completion-discount steps.',
            'Adding items from other stores without checking shipping or return friction.',
          ]),
        },
        {
          title: 'Better rules to use instead',
          lines: buildBulletLines([
            'One item per function until you have a reason to add another.',
            'Separate must-have, nice-to-have, and buy-later items.',
            'Keep big-ticket items on a shortlist until you compare fit, space, and budget.',
            'Review the list once for duplicates before sharing it.',
          ]),
        },
        {
          title: 'Quick reset if the registry already feels messy',
          lines: buildBulletLines([
            'Remove anything you cannot explain in one sentence.',
            'Cut duplicate categories first.',
            'Move uncertain items to a private note.',
            'Rebuild the public list around the first eight weeks, not the whole first year.',
          ]),
        },
      ],
      finalThought:
        'A cleaner registry usually comes from better editing, not more research. Once the structure makes sense, the list gets a lot less dramatic.',
      takeaways: [
        'Most registry mess comes from duplication and bad timing, not from missing products.',
        'Audit by function before you audit by brand.',
        'A shorter public list is usually easier to shop and easier to trust.',
      ],
    }),
  },
  'where-to-register': {
    slug: 'where-to-register',
    path: REGISTRY_SUBGUIDE_PATHS['where-to-register'],
    title: 'Where to Register & Why',
    description: 'Choose a registry based on returns, convenience, perks, and how your gift givers actually shop.',
    seoTitle: 'Where to Register for a Baby Registry | Taylor-Made Baby Co.',
    seoDescription:
      'Compare Target, Amazon, and Babylist by completion discounts, welcome boxes, returns, and setup logic.',
    targetKeyword: 'where to register for a baby registry',
    secondaryKeywords: ['best baby registry', 'Target vs Amazon vs Babylist registry', 'baby registry comparison', 'registry completion discount'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'timeline', 'perks'],
    nextStepCtaHref: '/guides/strollers',
    nextStepCtaLabel: 'Continue to the Stroller Guide',
    content: buildRegistrySubGuideContent({
      orientation: [
        'Choose a registry for the shopping experience it creates, not just the logo on the page.',
        'For most families, the right answer depends on return convenience, online flexibility, and whether your gift givers prefer in-store shopping. The welcome box does not need to be the CEO here.',
      ],
      whatThisIs:
        'A retailer comparison guide for choosing where your registry should live based on perks, returns, flexibility, and how people in your circle actually shop.',
      whoThisIsFor: [
        'Parents deciding between Target, Amazon, Babylist, or a mix of registry options.',
        'Families who want completion discounts and welcome perks without creating duplicate chaos.',
        'Anyone trying to balance in-store convenience against online flexibility.',
      ],
      whyItExists:
        'Registry platforms look similar until return rules, shopping habits, and perk requirements start affecting the real experience. This exists to make those tradeoffs clearer up front.',
      whatPeopleGetWrong: [
        'Choosing a registry for the welcome box alone.',
        'Opening multiple public registries before deciding whether the extra tracking is worth it.',
        'Ignoring return policy friction until gifts start arriving.',
      ],
      decisionFramework: [
        'Start with how your gift givers actually shop: in store, online, or both.',
        'Compare returns and completion discounts before perks start stealing the spotlight.',
        'Choose one primary public registry whenever possible.',
        'Add a second platform only if the perks or flexibility are worth the extra cleanup work.',
      ],
      sections: [
        {
          title: 'Quick recommendation',
          lines: buildBulletLines([
            'Choose Target if store access, easy returns, and in-person shoppers matter most.',
            'Choose Amazon if selection, fast shipping, and Prime benefits matter most.',
            'Choose Babylist if you want one list that can pull from multiple retailers.',
          ]),
        },
        {
          title: 'Target',
          lines: buildBulletLines([
            'Completion discount: 15% completion coupon.',
            'Welcome perks: free welcome kit with over $100 in samples and Target Circle bonuses.',
            'Return strength: registry items can generally be returned for up to one year after the event date if they are new and unopened.',
            'In-store advantage: strongest in-store support, easy store returns, and gift givers can shop locally.',
            'Best fit: families who want one straightforward registry with strong store access.',
          ]),
        },
        {
          title: 'Amazon',
          lines: buildBulletLines([
            'Completion discount: up to 15% for Prime members, multi-use during the eligibility window, max savings of $300.',
            'Welcome perks: free Welcome Box after Prime enrollment, 10 unique registry items, a $10 registry purchase, and a box request.',
            'Return strength: eligible registry gifts have free 365-day returns.',
            'Online advantage: widest selection and the easiest option for online-first gift givers.',
            'Best fit: families already deep in the Amazon and Prime ecosystem.',
          ]),
        },
        {
          title: 'Babylist',
          lines: buildBulletLines([
            'Completion discount: 15% on eligible Babylist Shop purchases once the registry is 30 days old.',
            'Timing: Babylist says the discount opens 60 days before the due date and stays active for 90 days after.',
            'Welcome perks: Hello Baby Box requires three items from other stores, 40% checklist completion, a $30 Babylist Shop purchase, and paid shipping.',
            'Return strength: Babylist Shop items can be returned within 9 months; items bought from other retailers follow that retailer\'s return policy.',
            'Flexibility advantage: strongest option if you want one list that can mix retailers and specialty brands.',
          ]),
        },
        {
          title: 'How the major registries compare',
          lines: buildBulletLines([
            'Completion discounts are usually around 15% across major registry programs, but exclusions and timing differ.',
            'Welcome kits are useful for samples and coupons, not for covering major needs.',
            'Target is the strongest in-store option.',
            'Amazon is the strongest online-only option.',
            'Babylist is the strongest universal-registry option.',
          ]),
        },
        {
          title: 'Best setup for most parents',
          lines: buildBulletLines([
            'Use one primary public registry.',
            'Pick the retailer that matches how your gift givers actually shop.',
            'Open additional registries only if you have a clear perk or discount reason.',
            'If you do use multiple registries, track them in one place so duplicates do not slip through.',
          ]),
        },
      ],
      finalThought:
        'The best registry platform is usually the one that makes gifts, returns, and later purchases easier. The free samples are nice. The smoother experience matters more.',
      takeaways: [
        'Choose the registry for real-life shopping and return habits, not just the perk headline.',
        'One primary public registry is usually cleaner than three scattered links.',
        'Use extra platforms only when the flexibility or discounts clearly outweigh the tracking work.',
      ],
    }),
  },
  timeline: {
    slug: 'timeline',
    path: REGISTRY_SUBGUIDE_PATHS.timeline,
    title: 'When to Buy What',
    description: 'Use timing to reduce rushed purchases and keep the biggest decisions in the right order.',
    seoTitle: 'When to Buy What for a Baby Registry | Taylor-Made Baby Co.',
    seoDescription:
      'A structured registry timeline covering nursery-first planning, large-purchase timing, completion discounts, and what to delay.',
    targetKeyword: 'when to buy baby registry items',
    secondaryKeywords: ['baby registry timeline', 'when to build a baby registry', 'when to buy nursery furniture', 'completion discount timing'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'essentials', 'where-to-register'],
    nextStepCtaHref: '/guides/registry/where-to-register',
    nextStepCtaLabel: 'Compare Registry Retailers',
    content: buildRegistrySubGuideContent({
      orientation: [
        'Timing matters because some categories create pressure earlier than others.',
        'Start with the room plan and the daily basics. Move gear and optional categories later, once your routine is clearer and the registry is not trying to solve twelve months of life in one afternoon.',
      ],
      whatThisIs:
        'A timing guide for deciding what to buy early, what to decide before birth, and what can wait until later without creating chaos.',
      whoThisIsFor: [
        'Parents trying to pace their registry and shopping decisions more calmly.',
        'Families unsure whether nursery, stroller, or car seat choices need to happen first.',
        'Anyone who wants to use completion-discount windows more strategically.',
      ],
      whyItExists:
        'Baby prep feels rushed when the timing is wrong. This exists to put the biggest decisions back in the order that usually makes them easier.',
      whatPeopleGetWrong: [
        'Buying optional gear early while foundational room or sleep decisions are still fuzzy.',
        'Letting stroller research take over before nursery flow and basics are set.',
        'Missing discount windows because the later-stage plan was never mapped out.',
      ],
      decisionFramework: [
        'Decide the room, sleep, and basic-care setup first.',
        'Buy the items you truly need before birth with enough time for delivery and returns.',
        'Shortlist big-ticket gear early, but delay non-urgent upgrades until the setup is clearer.',
        'Use completion discounts for later-phase purchases whenever possible.',
      ],
      sections: [
        {
          title: 'Buy or decide first',
          lines: buildBulletLines([
            'Nursery and sleep setup.',
            'Core storage and changing setup.',
            'Basic feeding plan.',
            'The infant car seat you need before birth.',
          ]),
        },
        {
          title: 'Nursery first',
          lines: buildBulletLines([
            'Furniture and room layout often have the longest lead times.',
            'The room plan affects what actually fits on the registry.',
            'A clear nursery setup makes it easier to decide what you do not need elsewhere.',
          ]),
        },
        {
          title: 'Large purchase timing',
          lines: buildBulletLines([
            'Shortlist big-ticket items early enough to compare them calmly.',
            'Buy the truly essential ones in time for delivery, assembly, and returns.',
            'Leave optional upgrades and duplicate-use gear for later if the first-pass setup already works.',
          ]),
        },
        {
          title: 'Do not rush stroller and car seat decisions too early',
          lines: buildBulletLines([
            'Move stroller comparison later in the planning order, after nursery and daily-life basics.',
            'Finalize the infant car seat before birth, but do not let it take over the registry before the foundational categories are set.',
            'Hold secondary gear decisions until you know your car, storage, and routine constraints.',
          ]),
        },
        {
          title: 'Completion discount window',
          lines: buildBulletLines([
            'Save non-urgent big-ticket items for the completion phase when possible.',
            'Babylist says its registry discount opens 60 days before the due date and stays active for 90 days after.',
            'Other major registries also use late-stage discount windows, so review timing in each dashboard before you buy.',
          ]),
        },
        {
          title: 'Good items to delay',
          lines: buildBulletLines([
            'Extra bottles before testing one system.',
            'Extra swaddles and extra-size clothing.',
            'Secondary stroller accessories.',
            'Nice-to-have soothing products and decor.',
          ]),
        },
      ],
      finalThought:
        'A calmer registry usually has a calmer timeline underneath it. When the order is right, fewer decisions feel urgent all at once.',
      takeaways: [
        'Nursery and daily-care basics usually deserve attention before broader gear comparison.',
        'Shortlist big purchases early, but buy only what needs to be in place before birth.',
        'Use the completion-discount phase for later purchases whenever you can.',
      ],
    }),
  },
  perks: {
    slug: 'perks',
    path: REGISTRY_SUBGUIDE_PATHS.perks,
    title: 'Free Registry Perks & Welcome Boxes',
    description: 'Use the perks without letting them dictate the whole registry strategy.',
    seoTitle: 'Free Registry Perks & Welcome Boxes | Taylor-Made Baby Co.',
    seoDescription:
      'A structured guide to registry welcome boxes, completion discounts, qualification rules, and perk-stacking strategy.',
    targetKeyword: 'baby registry perks',
    secondaryKeywords: ['registry welcome boxes', 'baby registry completion discount', 'Target registry welcome kit', 'Babylist Hello Baby Box'],
    relatedSlugs: [REGISTRY_GUIDE_PARENT_SLUG, 'where-to-register', 'timeline'],
    nextStepCtaHref: '/guides/registry/where-to-register',
    nextStepCtaLabel: 'Compare Registry Retailers',
    content: buildRegistrySubGuideContent({
      orientation: [
        'Registry perks are useful when they support a plan you already trust.',
        'Use the boxes, discounts, and samples to save money on planned purchases. Do not let free items run the meeting.',
      ],
      whatThisIs:
        'A perks guide for understanding welcome boxes, completion discounts, coupons, and how to use them without turning the registry into a scavenger hunt.',
      whoThisIsFor: [
        'Parents trying to compare welcome boxes and completion discounts across retailers.',
        'Families who want to stack savings without creating registry duplication.',
        'Anyone who likes a good perk but would prefer the registry still make sense afterward.',
      ],
      whyItExists:
        'Perks are helpful, but they become distracting fast. This exists to keep them in their place: useful support for a plan, not the whole strategy.',
      whatPeopleGetWrong: [
        'Choosing a registry platform mainly for the free box.',
        'Opening multiple registries for every perk without a tracking system.',
        'Assuming discounts or credits stack without checking the actual terms.',
      ],
      decisionFramework: [
        'Choose the registry setup first, then let perks support it.',
        'Track qualification steps early so you do not miss easy discounts later.',
        'Keep one main public registry whenever possible.',
        'Use samples and coupons as testing tools, not as proof you need a whole category.',
      ],
      sections: [
        {
          title: 'The main perks to track',
          lines: buildBulletLines([
            'Welcome boxes or welcome kits.',
            'Completion discounts.',
            'Coupons and samples.',
            'Milestone offers or registry-only deals.',
          ]),
        },
        {
          title: 'Welcome boxes and kits',
          lines: [
            '### Target',
            ...buildBulletLines([
              'Target advertises a free welcome kit with over $100 in samples and bonuses for registry users.',
              'Best use: samples, coupons, and small trial items.',
              'Watchout: terms can change, so confirm current dashboard requirements before counting on it.',
            ]),
            '',
            '### Amazon',
            ...buildBulletLines([
              'Amazon says the Welcome Box is free after Prime enrollment, 10 unique registry items, a $10 registry purchase, and a box request.',
              'Best use: samples plus a simple way to capture Prime-specific registry perks.',
              'Watchout: Prime membership is part of the qualification logic.',
            ]),
            '',
            '### Babylist',
            ...buildBulletLines([
              'Babylist says the Hello Baby Box requires three items from other stores, 40% checklist completion, a $30 Babylist Shop purchase, and paid shipping.',
              'Best use: test samples and coupons while also unlocking the universal-registry setup.',
              'Watchout: the purchase must be in the Babylist Shop, not another linked retailer.',
            ]),
          ],
        },
        {
          title: 'Completion discounts',
          lines: buildBulletLines([
            'Major registry discounts usually land around 10% to 15%.',
            'Target shows a 15% completion coupon.',
            'Amazon shows up to 15% for Prime members, with a maximum savings cap.',
            'Babylist shows 15% on eligible Babylist Shop purchases once the registry is 30 days old.',
            'Save big-ticket items and non-urgent add-ons for this phase when possible.',
          ]),
        },
        {
          title: 'Stacking the perks without creating duplicate chaos',
          lines: buildBulletLines([
            'Keep one registry as the main public list.',
            'Use additional registries only if the perks are worth the tracking work.',
            'If you open multiple registries, track what is public, what is private, and where each item lives.',
            'Do not list the same item in multiple public places unless you want cleanup work later.',
          ]),
        },
        {
          title: 'Samples and coupons',
          lines: buildBulletLines([
            'Samples are most useful for bottles, pacifiers, diapers, wipes, and postpartum basics.',
            'Coupons matter most if they line up with products you already plan to buy.',
            'Treat free samples as testing tools, not as proof that a category belongs on your registry.',
          ]),
        },
        {
          title: 'Combining discounts with sales and rewards',
          lines: buildBulletLines([
            'Check each retailer\'s terms before assuming discounts stack.',
            'Babylist says its registry discount can combine with Babylist gift cards or store credits, but not with other promotions.',
            'Use price drops, rewards, and gift cards strategically, but confirm exclusions before checkout.',
          ]),
        },
      ],
      finalThought:
        'Perks work best when they save money on decisions you already trust. The registry should still make sense after the samples and coupons have had their moment.',
      takeaways: [
        'Use perks to support a plan, not to create one.',
        'Completion discounts matter more than welcome boxes for most bigger purchases.',
        'A clear tracking system is what makes perk stacking useful instead of annoying.',
      ],
    }),
  },
};

export function getRegistrySubGuideGridItems() {
  return REGISTRY_SUBGUIDE_GRID_ITEMS.map((item) => ({
    ...item,
    path: REGISTRY_SUBGUIDE_PATHS[item.slug],
  }));
}

export function getRegistrySubGuideSlugs() {
  return Object.keys(REGISTRY_SUBGUIDE_PAGES) as RegistrySubGuideSlug[];
}

export function getRegistrySubGuideBySlug(slug: string) {
  return REGISTRY_SUBGUIDE_PAGES[slug as RegistrySubGuideSlug] ?? null;
}

export function getRegistrySubGuideRelatedGuides() {
  return REGISTRY_NEXT_STEP_GUIDES;
}
