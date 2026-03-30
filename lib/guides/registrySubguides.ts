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
        'A minimalist registry is not a less loving registry, a less prepared registry, or a very earnest attempt to win an imaginary simplicity award. It is just a registry with stronger boundaries.',
        'The goal is not to prove you can parent with twelve items and a candle. The goal is to register for what will earn its keep in actual daily life, then leave room for real experience to tell you what deserves to come next.',
        'Minimalist, in TMBC language, usually means edited. Fewer duplicate jobs. Fewer panic adds. Less money spent trying to future-proof every possible version of parenthood before the baby has even arrived.',
        'It also means trusting that you do not need to solve six months of hypothetical problems in one afternoon. You need a solid first setup, a little flexibility, and the ability to notice what your household actually wants once the baby is here.',
      ],
      whatThisIs:
        'A filtered registry approach that keeps the first pass centered on everyday function, realistic space, and decisions you can actually make before baby arrives.\n\nIt is not about deprivation. It is about giving the public list stronger boundaries so the gifts that arrive are more likely to help.\n\nA minimalist registry still covers sleep, feeding, diapering, getting dressed, moving through the day, and keeping the house functional. It just refuses to treat every optional category like a day-one emergency.',
      whoThisIsFor: [
        'Parents who want a shorter list that still covers the real basics.',
        'Families with limited storage, tighter budgets, or a low tolerance for duplicates.',
        'Anyone who would rather add later based on real use than overbuy early out of stress.',
        'People who suspect the registry got louder the second everyone else started sending links.',
        'Parents who want the list to feel calm, shop-able, and a little less like a retail scavenger hunt.',
        'Families trying to prepare thoughtfully without turning the nursery, living room, and trunk into overflow storage.',
      ],
      whyItExists:
        'Registry lists get noisy when every category is treated like a day-one emergency. This exists to keep the first pass useful, giftable, and easier to live with.\n\nWhen the structure is cleaner, the list usually gets shorter on its own.\n\nMost parents do not need more ideas. They need a better filter for deciding what belongs on the public list, what belongs on a private note, and what can wait until the baby gives you better information.',
      whatPeopleGetWrong: [
        'Assuming minimalist means skipping basics instead of trimming duplication.',
        'Adding backup versions of the same function before testing the first version.',
        'Letting popularity decide what belongs in a smaller home or a calmer budget.',
        'Confusing aesthetic restraint with actual decision-making restraint.',
        'Putting maybe-later categories on the public list just because they are easier to add now than to evaluate later.',
        'Thinking a minimalist registry has to look bare to count, when really it just needs to look intentional.',
        'Keeping every uncertain item on the list because deleting it feels more permanent than it actually is.',
      ],
      decisionFramework: [
        'Start with sleep, feeding, diapering, clothing, and one practical movement plan.',
        'Keep only the version of each item that solves a real daily task right away.',
        'Move maybe-later items to a private note instead of a public registry.',
        'Revisit delayed items after baby arrives or during the completion-discount window.',
        'If an item needs a long explanation to justify itself, it probably does not belong on the first-pass list.',
        'If you cannot picture where it will live, how often it will get used, or what problem it solves, pause before adding it.',
        'Use friction as information. If the item creates storage, cleaning, or decision fatigue before the baby is even here, it is probably not helping yet.',
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
            'Laundry and storage support for the categories you will actually use right away.',
            'The practical household pieces that keep the first stretch from getting chaotic, like burp cloths, fitted sheets, and a clear place to put supplies.',
          ]),
        },
        {
          title: 'Delay until after baby arrives',
          lines: buildBulletLines([
            'Extra bottle systems before you know feeding preference.',
            'Large toy collections.',
            'Specialty soothing gear with one narrow use case.',
            'Backup versions of products you have not tested yet.',
            'Decor-driven add-ons that do not change daily function.',
            'Secondary gear that only makes sense once you know your baby has a strong preference.',
            'Large category expansions bought because the first version might not be perfect.',
          ]),
        },
        {
          title: 'Skip unless you have a clear reason',
          lines: buildBulletLines([
            'Multiple swings, loungers, or containers.',
            'Decor-first items that do not improve function.',
            'Large quantities of one diaper or wipe brand before fit testing.',
            'Category duplicates added only because they are popular online.',
            'Storage-heavy gear for routines you are not sure you even want.',
            'Anything that mostly solves a visual problem instead of a household problem.',
            'Bulk purchases that assume your baby will cooperate with your plan immediately. Respectfully, some babies enjoy proving otherwise.',
          ]),
        },
        {
          title: 'What minimalist actually looks like in real life',
          lines: buildBulletLines([
            'One sleep setup that is safe, simple, and ready to use.',
            'A feeding starter setup that leaves room to adjust without replacing an entire shelf of products.',
            'A diapering station that is easy to restock and easy to reach when you are tired.',
            'Clothing you can rotate through normal laundry, not enough outfits for a boutique display wall.',
            'One real plan for getting out of the house, not four overlapping versions of the same plan.',
            'A house where you can still find your countertops.',
          ]),
        },
        {
          title: 'Questions to ask before anything makes the list',
          lines: buildBulletLines([
            'Does this solve a real job in the first stretch of life with a newborn?',
            'Would I still want this if nobody on Instagram had mentioned it?',
            'Do I have somewhere realistic to put it?',
            'Can I test or borrow this later instead of registering for it now?',
            'Is this for my real life, or for my very optimistic imaginary life?',
            'Will this help often enough to justify the space, cleaning, and mental load it brings with it?',
            'If this never showed up as a gift, would I personally spend my own money on it now?',
          ]),
        },
        {
          title: 'Quick filter for every item',
          lines: buildBulletLines([
            'Does this solve a real daily task?',
            'Does it fit the space you actually have?',
            'Would you still buy it yourself if nobody gifted it?',
            'Can this wait until after birth without creating a problem?',
            'Will you be relieved to have it, or just relieved to have decided something?',
            'Does it reduce friction, or just make the registry look more complete?',
            'If someone asks why it is on the list, can you answer in one calm sentence?',
          ]),
        },
        {
          title: 'What to keep private instead of public',
          lines: buildBulletLines([
            'Products you are still researching.',
            'Categories tied to baby preference, like extra bottle systems or specialty soothing gear.',
            'Nice-to-have organization pieces that may depend on how your space fills out.',
            'Upgrade items you would love eventually but do not truly need on day one.',
            'Anything you are hoping to use the completion discount on later.',
          ]),
        },
        {
          title: 'A simple registry rule',
          lines: buildBulletLines([
            'Put must-have items on the main list.',
            'Move maybe-later items to a private shopping note.',
            'Revisit the note during the completion discount window.',
            'Let real use graduate items onto the list later if they earn it.',
            'If the public list starts feeling bloated, do an edit pass before you do more research.',
          ]),
        },
      ],
      finalThought:
        'A smaller registry is often the calmer registry. Less duplicate gear. Fewer guesses. More room for real life to tell you what belongs later.\n\nYour baby does not need a dramatic list. Your household needs a functional one.\n\nMinimalist is not about doing less for your baby. It is about doing less guesswork in advance, so the things that do show up have a much better chance of helping.',
      takeaways: [
        'Minimalist does not mean underprepared. It means better filtered.',
        'Register for the first stretch, not for every hypothetical month ahead.',
        'Keep public lists clean and hold maybe-later items privately until real use gives you an answer.',
        'Editing is usually a better registry skill than adding.',
        'The best minimalist registry is the one that still feels useful when the sleep is bad and the laundry is real.',
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
        'If the list cannot support sleep, feeding, diapering, clothing, and a basic way to move through the day, it is not ready for themed extras, backup systems, or things that mostly look helpful in a flat lay.',
        'This is the pass where the registry stops trying to be comprehensive and starts trying to be useful.',
        'Think of it as the foundational layer. Not every possible item. Not every future stage. Just the categories that keep early daily life from feeling unnecessarily chaotic.',
      ],
      whatThisIs:
        'A first-pass registry guide for deciding what belongs on the list before extras, upgrades, and well-meaning chaos start piling on.\n\nIt is the foundation layer, not the forever layer.\n\nThe goal is not to make the list exciting. The goal is to make sure the list covers the jobs that happen over and over again once the baby is home.',
      whoThisIsFor: [
        'Parents building the first real version of their registry.',
        'Families who want the basics covered before they compare optional gear.',
        'Anyone staring at a long checklist and wondering what actually needs to come first.',
        'People who want the list to work at 2:14 AM, not just at a baby shower brunch.',
        'Parents who feel behind because the registry keeps expanding faster than they can make decisions.',
        'Families trying to separate true essentials from very convincing marketing.',
      ],
      whyItExists:
        'The essentials conversation gets messy when everything is treated like a must-have. This exists to put the early setup back in a practical order.\n\nOnce the basics are clear, the extras stop pretending to be emergencies.\n\nMost first registries do not need a longer checklist. They need a better sequence: what supports the newborn stage immediately, what is flexible, and what can absolutely wait until you have better information.',
      whatPeopleGetWrong: [
        'Adding convenience extras before the foundational categories are covered.',
        'Registering for large quantities of one feeding or diapering system before testing fit.',
        'Treating variety like preparedness when the first stretch mostly needs dependable basics.',
        'Assuming the "best" version of a category is necessary before the first workable version is even chosen.',
        'Building a list around aspiration instead of repetition.',
        'Underestimating how much small support items matter once laundry, feeding, and diapering start repeating all day.',
        'Confusing a long list with a complete plan.',
      ],
      decisionFramework: [
        'Start with sleep, feeding, diapering, clothing, and daily movement.',
        'Register for one workable setup per function before adding backups.',
        'Keep the first eight weeks in view instead of solving the whole first year at once.',
        'Move optional categories to round two if the basics already cover daily life.',
        'If a category depends heavily on preference, add one modest starter version instead of a full system.',
        'Prioritize the items that are hard to improvise once the baby is home.',
        'Use quantity carefully. The right categories matter more than dramatic amounts.',
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
            'Household support that keeps those categories manageable',
            'Postpartum support if it affects how the primary caregiver will recover and function in the first stretch',
          ]),
        },
        {
          title: 'Sleep basics first',
          lines: buildBulletLines([
            'One primary sleep space.',
            'Fitted sheets sized for that sleep space.',
            'Swaddles or sleep sacks in a small first batch.',
            'Monitor only if it matches the room setup and your comfort level.',
            'Skip decorative sleep extras that do not improve safety or ease.',
            'A second simple sleep station only if your layout truly calls for it, not because every room suddenly feels registry-worthy.',
            'Keep the sleep setup calm enough that someone else can use it without a tutorial.',
          ]),
        },
        {
          title: 'Feeding basics first',
          lines: buildBulletLines([
            'A small starter bottle set if you plan to bottle feed or combo feed.',
            'Burp cloths and bibs.',
            'Breast pump and support items if relevant to your plan.',
            'Do not register for large quantities of one bottle style before testing.',
            'Keep the starter setup flexible enough to adjust once feeding reality arrives.',
            'Give yourself a simple washing and drying plan so the feeding setup does not collapse into countertop chaos.',
            'If you are nursing, remember the supporting cast still matters: pads, storage, comfort, and a place to sit that does not make you resent everyone.',
          ]),
        },
        {
          title: 'Diapering basics first',
          lines: buildBulletLines([
            'Newborn and size-one diapers in modest quantities.',
            'Wipes.',
            'Diaper cream.',
            'One realistic changing setup with storage nearby.',
            'A disposal or laundry plan that fits the home you actually have.',
            'A small caddy or room-to-room setup if you know you will not always change diapers in one place.',
            'Enough backup supplies to get through the first stretch without buying an entire drugstore aisle.',
          ]),
        },
        {
          title: 'Daily life basics',
          lines: buildBulletLines([
            'Zip sleepers and simple layers.',
            'Laundry support.',
            'One diaper bag setup.',
            'A safe place to put baby down in the rooms you use most.',
            'One practical way to move through the day, whether that is a carrier, stroller plan, or both.',
            'A few organization pieces that keep the daily categories easy to restock instead of easy to lose.',
            'A realistic plan for how supplies move through your house, not just where they photograph nicely.',
          ]),
        },
        {
          title: 'What counts as essential because you use it constantly',
          lines: buildBulletLines([
            'Burp cloths, bibs, and backup linens.',
            'A basic thermometer and first-aid starter setup.',
            'Hampers, laundry baskets, or washing support that can keep up with real volume.',
            'Simple storage so diapers, creams, swaddles, and feeding tools are not wandering from room to room.',
            'Products that make repeated jobs easier, even if they are not glamorous enough to headline a registry checklist.',
          ]),
        },
        {
          title: 'Quantity rule for the first pass',
          lines: buildBulletLines([
            'Start with enough for the first stretch, not a warehouse for the first year.',
            'Leave room for gifts, preference changes, and completion discounts.',
            'If the category is easy to reorder quickly, you usually do not need a dramatic starting quantity.',
            'A first-pass registry should support real life, not bunker-style retail behavior.',
            'Starter quantities are usually more useful than bulk commitments in categories that depend on fit or preference.',
          ]),
        },
        {
          title: 'Hold for round two',
          lines: buildBulletLines([
            'Specialty feeding accessories.',
            'Large toy sets.',
            'Category backups.',
            'Optional gear tied to a routine you have not lived yet.',
            'Upgrades that only make sense after you know what the first version gets wrong.',
            'Extra versions of the same container, carrier, or soothing tool.',
            'Any add-on you would struggle to explain as a need instead of a possibility.',
          ]),
        },
        {
          title: 'A good essentials test',
          lines: buildBulletLines([
            'Could a tired version of you explain why this item matters in ten seconds?',
            'Would you notice the absence of this item in the first two weeks?',
            'Does it support a repeated task, not a rare scenario?',
            'Is it helping daily function, safety, or sanity in a measurable way?',
            'If nobody gifted it, would you make a plan to buy it yourself soon?',
          ]),
        },
      ],
      finalThought:
        'An essentials list should look a little boring on purpose. Boring is often another word for useful when you are building the first stretch of life with a newborn.\n\nThe exciting registry is not always the helpful registry.\n\nIf the basics are well chosen, they do a quiet amount of heavy lifting. That is exactly what you want.',
      takeaways: [
        'Cover the basics before you buy category variety.',
        'One workable setup beats three untested systems.',
        'Build the first pass for daily function, then let round two handle the extras.',
        'Prepared does not mean overstocked.',
        'Essentials are the things you use constantly, not just the things retailers know how to label dramatically.',
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
        'A messy registry is rarely proof that you need more products. It is usually proof that the filters need work.',
        'This is good news, because a filtering problem is easier to fix than a mythical preparedness problem. You do not need to buy your way out of uncertainty. You need better rules for what stays, what goes, and what can wait.',
      ],
      whatThisIs:
        'A practical guide to the mistakes that make a registry longer, noisier, and less useful once real life begins.\n\nThink of it as the edit pass that saves the list from becoming a very polite clutter plan.\n\nIt is not about building a perfect registry. It is about spotting the patterns that make a good list drift into duplicate jobs, awkward gifting, and items that sounded right but never really fit.',
      whoThisIsFor: [
        'Parents starting a registry from scratch and wanting cleaner guardrails.',
        'Families whose current list already feels messy, duplicated, or oddly stressful.',
        'Anyone who wants a quicker way to separate useful gear from category clutter.',
        'People who suspect they are one shared spreadsheet away from losing their mind.',
        'Parents who keep adding items every time they feel unsure instead of clarifying the decision.',
        'Families who want a registry guests can actually shop without needing a decoder ring.',
      ],
      whyItExists:
        'Registry advice often tells parents what to add, not what to edit. This exists to help the list make more sense before it goes public.\n\nMost registry cleanup is subtraction plus better sequencing.\n\nOnce you can identify the mistakes early, the registry becomes easier to explain, easier to shop from, and much less likely to fill your home with things that never really earned a place there.',
      whatPeopleGetWrong: [
        'Treating every popular category like it belongs on the first-pass list.',
        'Registering by brand reputation instead of by daily task.',
        'Sharing the registry before deciding what stays public, private, or buy-later.',
        'Using other people\'s lists as templates without checking whether those homes, budgets, or routines look anything like theirs.',
        'Assuming duplication is harmless because "we can always return it later."',
        'Mistaking long research hours for clear decisions.',
        'Letting fear of forgetting something keep every maybe item on the public list.',
      ],
      decisionFramework: [
        'Audit the list by function, not by retailer section.',
        'Keep one item per job until you have a real reason to add another.',
        'Separate must-have, nice-to-have, and later categories before sharing.',
        'Review duplicates, sizing risk, and return friction before the registry goes live.',
        'If the list feels overwhelming to you, it will not feel clearer to your guests.',
        'When in doubt, shorten first and add later with more information.',
        'If an item only exists on the list because removing it feels scary, move it to a private note and keep going.',
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
            'Treating "someone might gift it" as a reason to keep everything on the list.',
            'Registering for every stage at once instead of building a strong first stretch.',
            'Assuming a category is essential because it shows up on every generic checklist.',
          ]),
        },
        {
          title: 'Duplication risks',
          lines: buildBulletLines([
            'Bottles from several systems.',
            'Multiple container seats.',
            'Too many blankets and swaddles in the same size.',
            'More clothing than your laundry rhythm can support.',
            'Storage items bought before you know what actually needs storing.',
            'Multiple carriers, seats, or soothing tools that all promise to solve the same moment differently.',
            'Several diapering stations built before you know whether one smart setup would have been enough.',
          ]),
        },
        {
          title: 'Retailer setup mistakes',
          lines: buildBulletLines([
            'Spreading the public registry across too many links.',
            'Ignoring return policy differences.',
            'Missing welcome-box or completion-discount steps.',
            'Adding items from other stores without checking shipping or return friction.',
            'Assuming guests will happily decode a complicated multi-registry strategy.',
            'Using a universal registry because it sounds flexible without thinking through where returns actually happen.',
          ]),
        },
        {
          title: 'Mistakes that start before the first item gets added',
          lines: buildBulletLines([
            'Starting with a giant checklist instead of starting with your home, budget, and routine.',
            'Researching categories in the wrong order, so stroller rabbit holes swallow the afternoon before the sleep setup is even decided.',
            'Letting everyone else\'s opinions act like requirements.',
            'Treating uncertainty like a shopping problem instead of a pacing problem.',
            'Skipping the edit pass because more adding feels more productive than more deciding.',
          ]),
        },
        {
          title: 'Signs the list is drifting',
          lines: buildBulletLines([
            'You keep adding categories without editing old ones.',
            'You cannot explain why half the products are there.',
            'The list feels more like internet homework than a household plan.',
            'Every scroll reveals another version of the same function.',
            'You are hoping the registry will solve uncertainty instead of naming it clearly.',
            'Guests keep asking what you actually need because the list feels too broad to read quickly.',
            'You feel relief after adding something, then immediately forget why it was necessary.',
          ]),
        },
        {
          title: 'Better rules to use instead',
          lines: buildBulletLines([
            'One item per function until you have a reason to add another.',
            'Separate must-have, nice-to-have, and buy-later items.',
            'Keep big-ticket items on a shortlist until you compare fit, space, and budget.',
            'Review the list once for duplicates before sharing it.',
            'If a category still feels unclear, reduce it instead of multiplying it.',
            'Let private notes hold uncertainty so the public list can stay cleaner.',
            'Use your actual house as a decision tool. If it will be annoying to store, clean, or move, count that.',
          ]),
        },
        {
          title: 'Quick reset if the registry already feels messy',
          lines: buildBulletLines([
            'Remove anything you cannot explain in one sentence.',
            'Cut duplicate categories first.',
            'Move uncertain items to a private note.',
            'Rebuild the public list around the first eight weeks, not the whole first year.',
            'Do one calm edit pass instead of ten emotional micro-edits.',
            'Ask of each item: what job does this do, and is that job already covered?',
            'Leave the reset with fewer decisions open, not with more tabs open.',
          ]),
        },
        {
          title: 'A cleaner way to think about registry mistakes',
          lines: buildBulletLines([
            'The problem is usually not that you forgot something life-changing.',
            'The problem is usually that too many things were allowed onto the list before they earned it.',
            'A registry gets stronger when it becomes easier to explain.',
            'Good editing is not backtracking. It is the part where the plan becomes real.',
          ]),
        },
      ],
      finalThought:
        'A cleaner registry usually comes from better editing, not more research. Once the structure makes sense, the list gets a lot less dramatic.\n\nThe goal is not perfection. It is a list you can explain and a household you can actually support.\n\nThe best registry rarely wins for volume. It wins for clarity.',
      takeaways: [
        'Most registry mess comes from duplication and bad timing, not from missing products.',
        'Audit by function before you audit by brand.',
        'A shorter public list is usually easier to shop and easier to trust.',
        'Editing the list is real progress, not a sign you are going backward.',
        'The mistake to avoid most is letting uncertainty stay public instead of organizing it privately.',
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
        'A registry platform becomes very real the second gifts start arriving, returns become necessary, or you try to use a completion discount with a tired brain and fifteen tabs open. That is why the setup matters more than the branding.',
        'This decision is less about finding the universally best registry and more about finding the one that fits your people, your shopping habits, and your tolerance for administrative nonsense.',
      ],
      whatThisIs:
        'A retailer comparison guide for choosing where your registry should live based on perks, returns, flexibility, and how people in your circle actually shop.\n\nIt is meant to help you choose a setup you can explain easily, manage cleanly, and still appreciate once the gifts and later purchases start moving through it.',
      whoThisIsFor: [
        'Parents deciding between Target, Amazon, Babylist, or a mix of registry options.',
        'Families who want completion discounts and welcome perks without creating duplicate chaos.',
        'Anyone trying to balance in-store convenience against online flexibility.',
        'Parents whose families span multiple shopping habits, from "I only shop in-store" to "I sent the gift from my phone in the pickup line."',
        'Anyone who wants a clear primary registry instead of an exhausting pile of links.',
      ],
      whyItExists:
        'Registry platforms look similar until return rules, shopping habits, and perk requirements start affecting the real experience. This exists to make those tradeoffs clearer up front.\n\nMost registry stress is not caused by picking the "wrong" retailer. It is caused by picking a setup without thinking through how gifts will be bought, tracked, returned, and finished later.',
      whatPeopleGetWrong: [
        'Choosing a registry for the welcome box alone.',
        'Opening multiple public registries before deciding whether the extra tracking is worth it.',
        'Ignoring return policy friction until gifts start arriving.',
        'Assuming more platforms automatically means better coverage for guests.',
        'Forgetting that completion discounts often matter more financially than samples do.',
        'Choosing a universal option without thinking through where problems get solved when something arrives damaged or wrong.',
      ],
      decisionFramework: [
        'Start with how your gift givers actually shop: in store, online, or both.',
        'Compare returns and completion discounts before perks start stealing the spotlight.',
        'Choose one primary public registry whenever possible.',
        'Add a second platform only if the perks or flexibility are worth the extra cleanup work.',
        'If you use a universal registry, make sure you understand which retailer owns shipping, returns, and customer service for each item.',
        'Use simplicity as a tie-breaker. Easier to manage usually ages better.',
      ],
      sections: [
        {
          title: 'Quick recommendation',
          lines: buildBulletLines([
            'Choose Target if store access, easy returns, and in-person shoppers matter most.',
            'Choose Amazon if selection, fast shipping, and Prime benefits matter most.',
            'Choose Babylist if you want one list that can pull from multiple retailers.',
            'If you are torn between two good options, pick the one you are most likely to manage consistently.',
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
            'What TMBC likes here: the practical ease. If your crowd shops Target anyway, this tends to create less friction for everyone.',
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
            'What TMBC likes here: easy online gifting, huge selection, and a lower chance that a hard-to-find practical item gets stranded off-list.',
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
            'What TMBC likes here: it is useful when your ideal registry is a curated mix, not a single-store commitment. The tradeoff is that you need to be more organized.',
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
            'The best choice is often the one that makes later purchases and returns feel least annoying, not the one with the flashiest opening perk.',
          ]),
        },
        {
          title: 'How TMBC thinks about the tradeoff',
          lines: buildBulletLines([
            'If your gift givers are local and store-based, convenience often beats flexibility.',
            'If your people are spread out and heavily online, Amazon usually creates the cleanest gifting path.',
            'If you want editorial control and mixed retailers, Babylist can work well as long as you are willing to manage it carefully.',
            'One strong system is usually better than two average ones and much better than three confusing ones.',
          ]),
        },
        {
          title: 'Best setup for most parents',
          lines: buildBulletLines([
            'Use one primary public registry.',
            'Pick the retailer that matches how your gift givers actually shop.',
            'Open additional registries only if you have a clear perk or discount reason.',
            'If you do use multiple registries, track them in one place so duplicates do not slip through.',
            'Keep the public experience simple enough that guests can tell what you need without becoming accidental logistics managers.',
          ]),
        },
        {
          title: 'Questions to answer before you choose',
          lines: buildBulletLines([
            'Will most of our people shop online, in-store, or some mix of both?',
            'How important are easy returns after the shower or after the due date?',
            'Do we want one-store simplicity or multi-store flexibility?',
            'Who is actually going to maintain this registry once it is live?',
            'Will a second registry save enough money or offer enough access to justify the extra cleanup work?',
          ]),
        },
      ],
      finalThought:
        'The best registry platform is usually the one that makes gifts, returns, and later purchases easier. The free samples are nice. The smoother experience matters more.\n\nChoose the system that supports real shopping behavior, real returns, and a real human maintaining it. That is usually where the smartest answer lives.',
      takeaways: [
        'Choose the registry for real-life shopping and return habits, not just the perk headline.',
        'One primary public registry is usually cleaner than three scattered links.',
        'Use extra platforms only when the flexibility or discounts clearly outweigh the tracking work.',
        'Registry setup is an operational decision as much as a branding decision.',
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
        'A registry feels much calmer when you stop treating every decision like it belongs in the same weekend. Some things need lead time. Some things need clarity. Some things genuinely do better when you wait.',
        'Good timing protects you from two common problems: rushed purchases and very expensive optimism.',
      ],
      whatThisIs:
        'A timing guide for deciding what to buy early, what to decide before birth, and what can wait until later without creating chaos.\n\nIt is designed to help you sequence decisions so the registry supports the season you are actually in, not every future phase all at once.',
      whoThisIsFor: [
        'Parents trying to pace their registry and shopping decisions more calmly.',
        'Families unsure whether nursery, stroller, or car seat choices need to happen first.',
        'Anyone who wants to use completion-discount windows more strategically.',
        'Parents who keep bouncing between categories because everything feels urgent.',
        'Families who want fewer rushed purchases in the final weeks before birth.',
      ],
      whyItExists:
        'Baby prep feels rushed when the timing is wrong. This exists to put the biggest decisions back in the order that usually makes them easier.\n\nThe right order does not just save time. It usually leads to better choices, fewer duplicates, and less money spent on categories you would have understood more clearly if you had waited two weeks.',
      whatPeopleGetWrong: [
        'Buying optional gear early while foundational room or sleep decisions are still fuzzy.',
        'Letting stroller research take over before nursery flow and basics are set.',
        'Missing discount windows because the later-stage plan was never mapped out.',
        'Treating large purchases as automatically urgent even when the use case is months away.',
        'Waiting too long on items with shipping, assembly, or fit implications and then having to decide under pressure.',
      ],
      decisionFramework: [
        'Decide the room, sleep, and basic-care setup first.',
        'Buy the items you truly need before birth with enough time for delivery and returns.',
        'Shortlist big-ticket gear early, but delay non-urgent upgrades until the setup is clearer.',
        'Use completion discounts for later-phase purchases whenever possible.',
        'Work backward from your due date with a little margin for delivery delays and mental energy.',
        'Let real urgency, not category hype, determine the calendar.',
      ],
      sections: [
        {
          title: 'Buy or decide first',
          lines: buildBulletLines([
            'Nursery and sleep setup.',
            'Core storage and changing setup.',
            'Basic feeding plan.',
            'The infant car seat you need before birth.',
            'Any item with long lead times, assembly time, or a real chance of return or exchange.',
          ]),
        },
        {
          title: 'Nursery first',
          lines: buildBulletLines([
            'Furniture and room layout often have the longest lead times.',
            'The room plan affects what actually fits on the registry.',
            'A clear nursery setup makes it easier to decide what you do not need elsewhere.',
            'Once the room flow is real, storage and changing decisions become less theoretical and much easier to size correctly.',
            'The nursery does not need to be perfect early. It does need to be planned early enough that other decisions stop floating.',
          ]),
        },
        {
          title: 'Large purchase timing',
          lines: buildBulletLines([
            'Shortlist big-ticket items early enough to compare them calmly.',
            'Buy the truly essential ones in time for delivery, assembly, and returns.',
            'Leave optional upgrades and duplicate-use gear for later if the first-pass setup already works.',
            'If an expensive item solves a problem you do not have yet, it is often a completion-discount candidate, not a must-buy-now category.',
          ]),
        },
        {
          title: 'Do not rush stroller and car seat decisions too early',
          lines: buildBulletLines([
            'Move stroller comparison later in the planning order, after nursery and daily-life basics.',
            'Finalize the infant car seat before birth, but do not let it take over the registry before the foundational categories are set.',
            'Hold secondary gear decisions until you know your car, storage, and routine constraints.',
            'A stroller shortlist is useful early. A rushed stroller purchase is not.',
            'The best time to finish gear decisions is after the foundation categories stop competing for your attention.',
          ]),
        },
        {
          title: 'A simple timing rhythm',
          lines: buildBulletLines([
            'Early phase: decide where baby will sleep, where care will happen, and what the room flow needs.',
            'Middle phase: build the public registry, compare big-ticket essentials, and clean up duplicates.',
            'Late phase: buy the true before-birth needs, confirm shipping, and leave some categories open on purpose.',
            'Post-shower or completion phase: fill gaps, buy what did not get gifted, and make smarter later-stage decisions with better information.',
          ]),
        },
        {
          title: 'Completion discount window',
          lines: buildBulletLines([
            'Save non-urgent big-ticket items for the completion phase when possible.',
            'Babylist says its registry discount opens 60 days before the due date and stays active for 90 days after.',
            'Other major registries also use late-stage discount windows, so review timing in each dashboard before you buy.',
            'This is a strong time to buy the items you intentionally left off the public list until you knew what still mattered.',
            'Completion windows reward patience when the category is not truly urgent.',
          ]),
        },
        {
          title: 'Good items to delay',
          lines: buildBulletLines([
            'Extra bottles before testing one system.',
            'Extra swaddles and extra-size clothing.',
            'Secondary stroller accessories.',
            'Nice-to-have soothing products and decor.',
            'Organization extras that depend on what gifts you actually receive.',
            'Upgrade versions of products that already have a working first version.',
          ]),
        },
        {
          title: 'What should not wait too long',
          lines: buildBulletLines([
            'The infant car seat if you need one for bringing baby home.',
            'The primary sleep setup and the linens that go with it.',
            'The nursery furniture pieces that need delivery, assembly, or off-gassing time.',
            'Any item whose fit affects safety or daily function in the first weeks.',
            'Your own recovery and postpartum basics if they affect how the household works after birth.',
          ]),
        },
      ],
      finalThought:
        'A calmer registry usually has a calmer timeline underneath it. When the order is right, fewer decisions feel urgent all at once.\n\nGood timing is one of the quietest ways to avoid overbuying. If you wait on the right things, the baby tends to answer some of the questions for you.',
      takeaways: [
        'Nursery and daily-care basics usually deserve attention before broader gear comparison.',
        'Shortlist big purchases early, but buy only what needs to be in place before birth.',
        'Use the completion-discount phase for later purchases whenever you can.',
        'A decision can be important without being immediate.',
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
        'Perks are at their best when they make a smart registry slightly more efficient. They are at their worst when they convince you to build the whole strategy around a sample bag and a coupon code.',
        'A perk is a bonus. It is not a personality. It is definitely not a reason to open four public registries and then spend your third trimester managing them like a small operations team.',
      ],
      whatThisIs:
        'A perks guide for understanding welcome boxes, completion discounts, coupons, and how to use them without turning the registry into a scavenger hunt.\n\nThe goal is to help you capture the value without losing the plot of the registry itself.',
      whoThisIsFor: [
        'Parents trying to compare welcome boxes and completion discounts across retailers.',
        'Families who want to stack savings without creating registry duplication.',
        'Anyone who likes a good perk but would prefer the registry still make sense afterward.',
        'Parents who keep hearing about free boxes and want to know what is actually worth the effort.',
        'Families who want to save money without letting the registry become admin-heavy.',
      ],
      whyItExists:
        'Perks are helpful, but they become distracting fast. This exists to keep them in their place: useful support for a plan, not the whole strategy.\n\nThe most valuable registry perk is usually the one that helps you buy planned items for less. Samples are fun. Completion discounts and solid retailer logistics are usually more meaningful.',
      whatPeopleGetWrong: [
        'Choosing a registry platform mainly for the free box.',
        'Opening multiple registries for every perk without a tracking system.',
        'Assuming discounts or credits stack without checking the actual terms.',
        'Forgetting to complete qualification steps until it is too late to claim the benefit.',
        'Treating samples as proof they need a whole product category in bulk.',
        'Spending more to qualify for a perk than the perk is reasonably worth.',
      ],
      decisionFramework: [
        'Choose the registry setup first, then let perks support it.',
        'Track qualification steps early so you do not miss easy discounts later.',
        'Keep one main public registry whenever possible.',
        'Use samples and coupons as testing tools, not as proof you need a whole category.',
        'Know which perk saves money on planned purchases and which perk is mostly a nice extra.',
        'If a perk requires complicated maintenance, ask whether the return is actually worth your time.',
      ],
      sections: [
        {
          title: 'The main perks to track',
          lines: buildBulletLines([
            'Welcome boxes or welcome kits.',
            'Completion discounts.',
            'Coupons and samples.',
            'Milestone offers or registry-only deals.',
            'Any loyalty credits or retailer rewards that can meaningfully reduce planned purchases later.',
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
              'TMBC take: nice perk, especially if you are already using Target for the actual registry experience.',
            ]),
            '',
            '### Amazon',
            ...buildBulletLines([
              'Amazon says the Welcome Box is free after Prime enrollment, 10 unique registry items, a $10 registry purchase, and a box request.',
              'Best use: samples plus a simple way to capture Prime-specific registry perks.',
              'Watchout: Prime membership is part of the qualification logic.',
              'TMBC take: works best when Amazon is already your practical fit, not when you are forcing the platform for the box.',
            ]),
            '',
            '### Babylist',
            ...buildBulletLines([
              'Babylist says the Hello Baby Box requires three items from other stores, 40% checklist completion, a $30 Babylist Shop purchase, and paid shipping.',
              'Best use: test samples and coupons while also unlocking the universal-registry setup.',
              'Watchout: the purchase must be in the Babylist Shop, not another linked retailer.',
              'TMBC take: better for parents who already want Babylist for flexibility. Less compelling if you do not want the extra system management.',
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
            'In most households, completion discounts end up being more valuable than the welcome box because they apply to items you truly still need.',
          ]),
        },
        {
          title: 'Stacking the perks without creating duplicate chaos',
          lines: buildBulletLines([
            'Keep one registry as the main public list.',
            'Use additional registries only if the perks are worth the tracking work.',
            'If you open multiple registries, track what is public, what is private, and where each item lives.',
            'Do not list the same item in multiple public places unless you want cleanup work later.',
            'Set a simple rule for yourself: if the savings are small and the admin is annoying, skip it.',
          ]),
        },
        {
          title: 'Samples and coupons',
          lines: buildBulletLines([
            'Samples are most useful for bottles, pacifiers, diapers, wipes, and postpartum basics.',
            'Coupons matter most if they line up with products you already plan to buy.',
            'Treat free samples as testing tools, not as proof that a category belongs on your registry.',
            'A sample is information, not a commitment.',
            'The best use of a welcome box is often narrowing choices later, not filling the house now.',
          ]),
        },
        {
          title: 'Combining discounts with sales and rewards',
          lines: buildBulletLines([
            'Check each retailer\'s terms before assuming discounts stack.',
            'Babylist says its registry discount can combine with Babylist gift cards or store credits, but not with other promotions.',
            'Use price drops, rewards, and gift cards strategically, but confirm exclusions before checkout.',
            'A screenshot or notes app reminder for discount timing can save you from paying full price by accident.',
          ]),
        },
        {
          title: 'When chasing extra perks is worth it',
          lines: buildBulletLines([
            'When the second platform offers a meaningful completion discount on items you already plan to buy.',
            'When the perk fits a retailer you were already genuinely considering.',
            'When you have a simple tracking system and low risk of duplicate gifts.',
            'When the administrative effort is small compared with the actual savings.',
          ]),
        },
        {
          title: 'When to skip the extra perk chase',
          lines: buildBulletLines([
            'When you are already overwhelmed by the main registry setup.',
            'When the perk mostly offers samples you do not especially need.',
            'When the extra registry would create guest confusion or duplicate monitoring.',
            'When the purchase requirements force you to spend money in ways that do not fit your plan.',
          ]),
        },
      ],
      finalThought:
        'Perks work best when they save money on decisions you already trust. The registry should still make sense after the samples and coupons have had their moment.\n\nTake the useful freebies. Capture the real discounts. Then return the spotlight to the actual goal: a registry that supports your life, not a collection of retailer achievements.',
      takeaways: [
        'Use perks to support a plan, not to create one.',
        'Completion discounts matter more than welcome boxes for most bigger purchases.',
        'A clear tracking system is what makes perk stacking useful instead of annoying.',
        'The best perk strategy is the one that still feels easy to maintain when you are tired.',
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
