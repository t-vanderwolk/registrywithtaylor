import type { ModuleLayoutData } from '@/components/academy/ModuleLayout';

export const DAILY_USE_GEAR_ACADEMY_HUB_PATH = '/academy/gear/daily-use-gear' as const;

export type DailyUseGearAcademySubmoduleSlug =
  | 'carrier'
  | 'highchair'
  | 'baby-bath'
  | 'pack-and-play'
  | 'swing-bouncer'
  | 'daily-support-gear';

export type DailyUseGearAcademyCard = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
};

export type DailyUseGearAcademySectionGroup = {
  title?: string;
  items: string[];
};

export type DailyUseGearAcademySection = {
  description: string;
  paragraphs?: string[];
  groups?: DailyUseGearAcademySectionGroup[];
};

export type DailyUseGearAcademyNote = {
  eyebrow: string;
  title: string;
  body: string;
  tone?: 'white' | 'blush' | 'linen';
};

export type DailyUseGearAcademySubmoduleDefinition = {
  slug: DailyUseGearAcademySubmoduleSlug;
  order: number;
  title: string;
  cardSummary: string;
  metadataDescription: string;
  deck: string;
  intro: string[];
  heroImageSrc: string;
  heroImageAlt: string;
  learn: DailyUseGearAcademySection;
  plan: DailyUseGearAcademySection;
  trySection: DailyUseGearAcademySection;
  buy: DailyUseGearAcademySection;
  decisionBullets: string[];
  note: DailyUseGearAcademyNote;
};

export const DAILY_USE_GEAR_ACADEMY_TITLE = 'Daily Use Gear';
export const DAILY_USE_GEAR_ACADEMY_DECK =
  "The products you'll use every single day - and feel immediately if they're wrong.";

export const DAILY_USE_GEAR_ACADEMY_INTRO = [
  'These are not the products that sit quietly on a registry and never get touched.',
  'These are the things you reach for constantly.',
  'The chair you feed in. The carrier that either saves your back or destroys it. The highchair you clean three times a day. The swing your baby may love... or completely ignore with dramatic conviction.',
  'Daily use gear shapes your routine fast.',
  'And the goal here is not to buy everything.',
  "It's to understand what actually supports your life.",
] as const;

export const DAILY_USE_GEAR_ACADEMY_PULL_QUOTE =
  "Daily use gear doesn't just support your baby. It shapes your entire day.";

export const DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS = [
  'Which everyday gear categories deserve real thought because they shape the repeated parts of the day fastest.',
  'How to judge daily-use products by fit, cleanup, storage, and body comfort instead of by registry hype.',
  'What most parents do not realize until later: small routine products can create as much friction as the big-ticket gear.',
  'How to test whether something is easy enough to use when you are tired, distracted, and holding a baby.',
  'Why one strong everyday option usually beats a pile of hopeful duplicates.',
] as const;

export const DAILY_USE_GEAR_ACADEMY_PHILOSOPHY = [
  'This is where TMBC gets especially practical. Daily use gear is rarely the flashiest part of the list, but it is often the part you feel most. When a product shows up in the routine morning after morning, the wrong choice gets loud fast.',
  'That is also why this category gets overbought so easily. Parents try to solve one repeated problem by buying three versions of the same answer. Most of the time, the calmer move is to understand the job, pick one strong fit, and let real use decide whether anything else is actually needed.',
] as const;

export const DAILY_USE_GEAR_ACADEMY_REAL_LIFE_GUIDANCE = [
  'Start with your real life.',
  'Not the most expensive setup.',
  'Not the trendiest setup.',
  'The one that actually works in your home, your routine, and your body.',
] as const;

export const DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS: DailyUseGearAcademyCard[] = [
  {
    href: '/academy/gear/travel-systems',
    title: 'Travel Systems',
    description:
      'Go back one step if stroller and car seat compatibility still need a cleaner answer before the smaller daily-use choices start stacking up.',
    ctaLabel: 'Review previous gear module ->',
    eyebrow: 'Previous Gear Module',
  },
  {
    href: '/academy/postpartum',
    title: 'Postpartum Path',
    description:
      'Continue the Academy into recovery, feeding, rest, and support once the gear conversation feels calmer and more edited.',
    ctaLabel: 'Continue the Academy ->',
    eyebrow: 'Next Path',
  },
];

const DAILY_USE_GEAR_SUBMODULE_ORDER: DailyUseGearAcademySubmoduleSlug[] = [
  'carrier',
  'highchair',
  'baby-bath',
  'pack-and-play',
  'swing-bouncer',
  'daily-support-gear',
];

function flattenSectionParagraphs(section: DailyUseGearAcademySection) {
  return [
    ...(section.paragraphs ?? []),
    ...(
      section.groups?.flatMap((group) =>
        group.items.map((item, index) =>
          group.title && index === 0 ? `${group.title}: ${item}` : item,
        ),
      ) ?? []
    ),
  ];
}

function buildCoreSections(
  submodule: DailyUseGearAcademySubmoduleDefinition,
): ModuleLayoutData['coreSections'] {
  return [
    {
      title: 'Start with the category basics',
      paragraphs: flattenSectionParagraphs(submodule.learn),
      imageSrc: submodule.heroImageSrc,
      imageAlt: submodule.heroImageAlt,
      imageCaption: 'Understanding the category first usually makes the shortlist much quieter.',
    },
    {
      title: 'What to think through before you choose',
      paragraphs: flattenSectionParagraphs(submodule.plan),
      imageSrc: '/assets/editorial/clipboard.png',
      imageAlt: 'Planning notes for daily-use baby gear decisions.',
      imageCaption: 'This is the part where the category gets smaller because your routine gets clearer.',
    },
    {
      title: 'What to pressure-test in real life',
      paragraphs: flattenSectionParagraphs(submodule.trySection),
      imageSrc: '/assets/editorial/ipadblueprint.png',
      imageAlt: 'Testing notes for daily-use gear decisions.',
      imageCaption: 'Testing the boring parts now usually prevents the louder regret later.',
    },
    {
      title: 'How to keep the purchase edited',
      paragraphs: flattenSectionParagraphs(submodule.buy),
      imageSrc: '/assets/editorial/organize.png',
      imageAlt: 'Organized everyday baby gear setup.',
      imageCaption: 'The best buy is usually the one that supports the routine without multiplying the category.',
    },
  ];
}

export function getDailyUseGearAcademySubmodulePath(slug: DailyUseGearAcademySubmoduleSlug) {
  return `${DAILY_USE_GEAR_ACADEMY_HUB_PATH}/${slug}` as const;
}

export function isDailyUseGearAcademySubmoduleSlug(value: string): value is DailyUseGearAcademySubmoduleSlug {
  return DAILY_USE_GEAR_SUBMODULE_ORDER.includes(value as DailyUseGearAcademySubmoduleSlug);
}

const DAILY_USE_GEAR_ACADEMY_SUBMODULES: Record<
  DailyUseGearAcademySubmoduleSlug,
  DailyUseGearAcademySubmoduleDefinition
> = {
  carrier: {
    slug: 'carrier',
    order: 1,
    title: 'Carrier',
    cardSummary:
      'Learn how to choose the carrier that fits your body, your baby, and the way you actually move through the day.',
    metadataDescription:
      'Use the TMBC Daily Use Gear carrier module to understand carrier types, ergonomic fit, and how to choose one everyday option that actually works.',
    deck: 'How you move together matters more than most people realize.',
    intro: [
      'A good carrier gives you your hands back.',
      'A bad one gives you shoulder pain, confusion, and a fabric situation you regret in real time.',
      'This module helps users understand the main types of carriers, when each one shines, and how to choose something that works for both baby and caregiver.',
    ],
    heroImageSrc: '/assets/editorial/growing-with-confidence.jpg',
    heroImageAlt: 'Caregiver holding baby close in a calm everyday moment.',
    learn: {
      description:
        'Carrier categories sound interchangeable until you actually try them on. They are not. Each one solves a slightly different version of closeness, support, and convenience.',
      groups: [
        {
          title: 'Carrier types',
          items: [
            'Stretchy wrap: Soft, cozy, and especially useful in the early newborn stretch when closeness is the whole point and the carry sessions are shorter.',
            'Woven wrap: The most customizable and supportive option, but also the one with the biggest learning curve.',
            'Ring sling: Quick for short carries and quick ups and downs, especially when you want less fabric drama.',
            'Soft structured carrier: Buckled, supportive, and often the easiest shared everyday option for multiple caregivers.',
            'Meh dai / hybrid carrier: A softer middle lane that combines some wrap flexibility with a cleaner on-and-off routine.',
          ],
        },
        {
          title: 'Fit and ergonomics',
          items: [
            'Hip positioning matters. Baby should feel supported in a seated position rather than hanging straight down from the crotch.',
            'Airway awareness matters every time: face visible, chin off chest, nose and mouth clear.',
            'Caregiver fit counts too. Strap placement, waistband comfort, torso length, and shoulder padding all affect whether the carrier feels usable or punishing.',
            'Newborn support and older-baby support are not the same job, which is why some carriers shine early and others get better later.',
          ],
        },
      ],
    },
    plan: {
      description:
        'Before you compare prints, clips, or tutorial views, get clear on the kind of carrying life you are actually planning for.',
      groups: [
        {
          items: [
            'Do you want hands-free movement mostly at home, mostly out of the house, or both?',
            'Will multiple caregivers use it regularly?',
            'Do you want something quick, or something highly customizable?',
            'Are you trying to solve for newborn snuggles, long-term daily wear, or a little of both?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'If you can test a carrier in person, five honest minutes usually tell you more than five review tabs.',
      groups: [
        {
          items: [
            'How easy is it to put on alone without needing a pep talk?',
            'How adjustable is it once baby is in?',
            'Does it still feel supportive after more than five minutes?',
            'Do you run hot, and does the fabric make that better or worse?',
          ],
        },
      ],
    },
    buy: {
      description:
        'Start smaller here. Most families do not need a whole carrier wardrobe. They need one strong everyday option that fits the adult who will use it most.',
      paragraphs: [
        'If another style becomes useful later, add it because real life asked for it, not because the category started looking collectible.',
      ],
    },
    decisionBullets: [
      'Start with caregiver fit before aesthetics.',
      'Choose based on where and how often you will actually wear baby.',
      'Prioritize ease if multiple caregivers will use it.',
      'Start with one strong everyday carrier, not a collection.',
    ],
    note: {
      eyebrow: 'TMBC note',
      title: "The best carrier is not the one with the most tutorials. It's the one you'll actually use.",
      body: 'Convenience is not a shallow priority here. Daily-use gear should be easy enough to reach for when you are tired and still need to get through the day.',
      tone: 'linen',
    },
  },
  highchair: {
    slug: 'highchair',
    order: 2,
    title: 'Highchair',
    cardSummary:
      'Choose a highchair around posture, cleanup, and real mealtime use instead of just the silhouette.',
    metadataDescription:
      'Use the TMBC Daily Use Gear highchair module to compare styles, understand posture and foot support, and choose a seat you do not dread cleaning.',
    deck: 'This is where feeding happens - and where bad design gets very obvious, very fast.',
    intro: [
      'A highchair seems simple until you start using it three times a day.',
      'Then suddenly: the tray is annoying, the straps are impossible, and the tiny avocado pieces are somehow in architectural places.',
      'This module helps users understand what actually matters in a highchair beyond aesthetics.',
    ],
    heroImageSrc: '/assets/editorial/feeding.png',
    heroImageAlt: 'Editorial feeding setup with everyday mealtime gear.',
    learn: {
      description:
        'Most highchair regret is not about color. It is about posture, cleanup, and whether the chair still feels reasonable after the third meal of the day.',
      groups: [
        {
          title: 'Highchair styles',
          items: [
            'Full-size highchairs: Usually the most obvious everyday feeding setup, with a larger footprint and a clearer tray system.',
            'Compact or folding highchairs: Helpful when space is tight or the chair cannot live in the middle of the kitchen forever.',
            'Grow-with-me styles: Designed to stay useful longer if you want one seat to work through more stages.',
            'Minimalist styles: Visually clean, but not automatically easier to live with once straps, seams, and food start doing what food does.',
          ],
        },
        {
          title: 'What actually matters during feeding',
          items: [
            'Foot support matters because posture matters during feeding.',
            'A usable tray matters because some trays remove easily and some act personally offended that you asked.',
            'Wipeability matters more than "looks easy to clean." Smooth surfaces and simple seams beat wishful thinking.',
            'Getting baby in and out should feel straightforward even when you are doing it one-handed with lunch on the counter.',
          ],
        },
      ],
    },
    plan: {
      description:
        'A good highchair answer starts with your table, your floor space, and your cleanup tolerance, not with the prettiest photo.',
      groups: [
        {
          items: [
            'How much space do you actually have?',
            'Do you want baby right at the table or slightly separate?',
            'Do you care about long-term use, or do you just want the cleanest feeding setup right now?',
            'Is easy-clean your top priority above everything else?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'The best test is not "does it look nice in the kitchen." It is "would I still like this after a week of solids."',
      groups: [
        {
          items: [
            'Remove and reattach the tray.',
            'Adjust the straps and see whether they feel intuitive or annoying.',
            'Check how hard it is to wipe seams, fabric, and crevices.',
            'See how easy it is to get baby in and out without turning the process into a small event.',
          ],
        },
      ],
    },
    buy: {
      description:
        'Prioritize stability, a usable footrest, realistic cleanup, and how the chair behaves in the repeated parts of the day.',
      paragraphs: [
        'If a highchair feels visually clean but operationally fussy, the visual part stops mattering quickly.',
      ],
    },
    decisionBullets: [
      'Let posture and foot support matter.',
      'Choose around your table, floor space, and cleanup tolerance.',
      'Test tray removal, straps, and wipe-down reality.',
      'Buy the chair you will not dread using three times a day.',
    ],
    note: {
      eyebrow: 'TMBC note',
      title: "The best highchair isn't the prettiest one. It's the one you don't dread cleaning.",
      body: 'A feeding seat is a work surface. It is allowed to win because it handles breakfast well, not because it photographs beautifully.',
      tone: 'blush',
    },
  },
  'baby-bath': {
    slug: 'baby-bath',
    order: 3,
    title: 'Baby Bath',
    cardSummary:
      'Make bath time safer and easier with a setup that matches where you will actually wash baby.',
    metadataDescription:
      'Use the TMBC Daily Use Gear baby bath module to compare bath setups, think through safety and storage, and choose one simple system that works.',
    deck: 'Small setup, big safety, bigger impact than people expect.',
    intro: [
      'Bath products tend to get treated like tiny accessories.',
      "They're not.",
      'This is a safety category and a routine category, which means the right setup can make bath time feel calm, and the wrong one can make it feel awkward fast.',
    ],
    heroImageSrc: '/assets/editorial/welcome.png',
    heroImageAlt: 'Editorial baby essentials image representing first-weeks routine support.',
    learn: {
      description:
        'This category is less about luxury and more about keeping a wet, slippery routine feeling stable, safe, and manageable.',
      groups: [
        {
          title: 'Bath setup types',
          items: [
            'Sink baths: Often simplest in the earliest stretch if the sink shape and your setup actually make sense together.',
            'Newborn bath inserts: Helpful for extra support early on, especially when baby still feels very tiny and very slippery.',
            'Infant tubs: A more dedicated bath setup when you want a defined space that is easy to fill and empty.',
            'Convertible tubs: Useful when you want one setup to stretch a little longer instead of replacing it quickly.',
          ],
        },
        {
          title: 'Safety and ease basics',
          items: [
            'Support and incline should keep baby stable without making the setup awkward for the adult.',
            'Drainage matters because lifting and dumping a water-filled tub gets old immediately.',
            'Storage matters because even a simple bath setup needs to live somewhere when not in use.',
            'Supervision and safe handling matter more than every accessory in the aisle combined.',
          ],
        },
      ],
    },
    plan: {
      description:
        'The smartest bath setup is the one that matches the room, surface, and storage situation you already have.',
      groups: [
        {
          items: [
            'Where will you actually bathe baby most often?',
            'Do you need something compact or easy to store?',
            'Do you want one setup that grows a little, or one that simply handles the earliest phase well?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'Bath time goes better when the logistics are boring in the best way.',
      groups: [
        {
          items: [
            'Test how easy it is to fill and drain.',
            'Decide where it would realistically live when not in use.',
            'Check how stable it feels on the actual surface you plan to use.',
          ],
        },
      ],
    },
    buy: {
      description:
        'Keep this category simple. One safe, easy-to-use bath setup is enough.',
      paragraphs: [
        'You are not building a spa package. You are building a routine that feels calm when everyone is damp and ready to be done.',
      ],
    },
    decisionBullets: [
      'Match the setup to where baby will actually be bathed.',
      'Keep stability and safety above accessories.',
      'Test fill, drain, and storage before you buy.',
      'One simple bath setup is enough.',
    ],
    note: {
      eyebrow: 'Callout',
      title: 'You do not need a spa. You need a setup that feels stable, simple, and safe.',
      body: 'Bath time gets better when the adult ergonomics work too. That is not extra. That is part of the setup.',
      tone: 'linen',
    },
  },
  'pack-and-play': {
    slug: 'pack-and-play',
    order: 4,
    title: 'Pack & Play',
    cardSummary:
      'Decide whether you need a playard, a travel crib, or a simpler backup sleep space before buying the wrong version of flexible.',
    metadataDescription:
      'Use the TMBC Daily Use Gear pack and play module to compare playards, travel cribs, and sleep setups by portability, fold, and daily use.',
    deck: 'One of the most flexible pieces of gear you can own - if you choose the right kind.',
    intro: [
      'A Pack & Play can do a lot.',
      'Sleep space. Travel crib. Containment zone. Backup plan.',
      'That flexibility is exactly why people buy the wrong one. This module helps users decide whether they need a true playard, a travel crib, or something simpler.',
    ],
    heroImageSrc: '/assets/editorial/babyincrib.png',
    heroImageAlt: 'Calm baby sleep setup that represents backup and travel sleep decisions.',
    learn: {
      description:
        'This category only feels interchangeable from far away. Once you factor in weight, fold, sleep use, and travel, the differences matter quickly.',
      groups: [
        {
          title: 'Main setup types',
          items: [
            'Traditional Pack & Play / playard: Usually the most flexible option when you want one piece to handle multiple jobs at home.',
            'Travel crib: Better when lighter weight, portability, and frequent carrying matter more than extra features.',
            'Bassinet insert options: Useful in the early months when you want baby higher up and easier to reach.',
            'Changing station add-ons: Helpful for some families, unnecessary for others, and only worth it if the setup will truly be used.',
          ],
        },
        {
          title: 'What actually matters',
          items: [
            'Sleep safety comes first, especially if the setup will be used for regular sleep.',
            'Portability matters if this thing is going in and out of cars, closets, or travel plans.',
            'Weight matters because "technically portable" and "pleasant to carry" are not the same sentence.',
            'Fold style and intended use should match. The more often you move it, the more the fold becomes the story.',
          ],
        },
      ],
    },
    plan: {
      description:
        'Do not buy a flexible product until you are clear about which kind of flexibility you actually need.',
      groups: [
        {
          items: [
            'Is this for travel, daily sleep, or both?',
            'Will you move it often?',
            'Are you carrying it in and out of cars or closets, or will it mostly stay put?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'This is one of the categories where annoyance compounds fast, so test the practical parts first.',
      groups: [
        {
          items: [
            'How difficult is it to fold and unfold?',
            'How heavy does it feel when you actually carry it?',
            'How much room does it take up once open?',
            'How much setup frustration are you realistically willing to tolerate?',
          ],
        },
      ],
    },
    buy: {
      description:
        'Match the product to the job: travel-first, home backup, or full daily sleep use.',
      paragraphs: [
        'When the intended use is clear, the category gets much easier. When the intended use stays vague, the wrong version of "versatile" usually wins.',
      ],
    },
    decisionBullets: [
      'Decide whether this is for travel, home backup, or daily sleep.',
      'Let fold, weight, and footprint matter if you will move it often.',
      'Match sleep safety to the way it will actually be used.',
      'Buy the version of flexible that fits the real job.',
    ],
    note: {
      eyebrow: 'TMBC note',
      title: 'If folding it already annoys you, that feeling does not get better.',
      body: 'Repetition is the whole point here. The easier the fold feels now, the easier it will feel on the fifth hotel night or the third room reset of the day.',
      tone: 'white',
    },
  },
  'swing-bouncer': {
    slug: 'swing-bouncer',
    order: 5,
    title: 'Swing / Bouncer',
    cardSummary:
      'Understand what this category can do, what it cannot, and why baby preference matters more than promises.',
    metadataDescription:
      'Use the TMBC Daily Use Gear swing and bouncer module to compare swings, bouncers, and rockers with realistic expectations and safer use logic.',
    deck: 'Helpful soothing tools - but not all babies want the same kind of help.',
    intro: [
      'This category gets oversold constantly.',
      'A swing or bouncer can absolutely help. But it is not a guaranteed solution, and not every baby will care about the very expensive motion technology you were promised would change your life.',
      'This module helps users think realistically.',
    ],
    heroImageSrc: '/assets/editorial/babystuff.png',
    heroImageAlt: 'Editorial baby gear image representing soothing and set-down stations.',
    learn: {
      description:
        'These products can be useful, but they solve slightly different versions of soothing and hands-free support.',
      groups: [
        {
          title: 'What each one is',
          items: [
            'Swing: A powered seat that provides repetitive motion without the baby doing the work.',
            "Bouncer: A lighter seat that usually moves with baby's own motion or with a gentle nudge from you.",
            'Rocker: A middle lane that offers a calmer motion profile and often a simpler footprint than a full swing.',
          ],
        },
        {
          title: 'What matters in real life',
          items: [
            'Powered motion versus baby-powered motion changes both the price and the promise.',
            'Footprint matters because some of these seats take up an alarming amount of square footage for one temporary job.',
            'Realistic soothing expectations matter. Helpful is plausible. Magical is marketing.',
            'Safe use and supervision basics still apply even when the product is marketed as a sanity saver.',
          ],
        },
      ],
    },
    plan: {
      description:
        'The smarter question here is not "which one is best." It is "what job am I actually trying to solve."',
      groups: [
        {
          items: [
            'Do you want a place to safely set baby down?',
            'Are you looking for soothing support or simply one hands-free station?',
            'How much room do you actually have?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'This category is worth testing lightly because baby preference is not theoretical.',
      groups: [
        {
          items: [
            'Notice how baby responds to different motion types.',
            'Pay attention to sound and vibration tolerance, because not every baby finds those charming.',
            'See how easy the seat is to move, store, or live around once it is part of the room.',
          ],
        },
      ],
    },
    buy: {
      description:
        'Start with one, not multiple. The goal is to buy one useful option, not to build a soothing portfolio.',
      paragraphs: [
        "Baby preference is real. A product can be well-designed and still not be your baby's thing. That is not failure. That is just baby math.",
      ],
    },
    decisionBullets: [
      'Decide whether you need soothing help or simply a set-down station.',
      'Keep footprint and storage in view.',
      'Remember that baby preference is real.',
      'Start with one option, not a lineup.',
    ],
    note: {
      eyebrow: 'Callout',
      title: 'You are not buying a magic fix. You are buying an option.',
      body: 'That framing keeps the category helpful. It also keeps the expectation from getting unnecessarily expensive.',
      tone: 'linen',
    },
  },
  'daily-support-gear': {
    slug: 'daily-support-gear',
    order: 6,
    title: 'Daily Support Gear',
    cardSummary:
      'Edit the smaller helpers that keep feeding, changing, cleanup, and reset routines from falling apart.',
    metadataDescription:
      'Use the TMBC Daily Use Gear daily support gear module to decide what small routine helpers deserve space and what can wait.',
    deck: 'The little things that quietly make the whole system work.',
    intro: [
      'This is the category people either overbuy wildly or ignore until they are overwhelmed.',
      'Daily support gear includes the pieces that make the routine flow: not glamorous, not headline-making, but deeply relevant once real life begins.',
      'This module is here to help users edit this category instead of letting it multiply on its own.',
    ],
    heroImageSrc: '/assets/editorial/organize.png',
    heroImageAlt: 'Organized everyday baby gear and household support setup.',
    learn: {
      description:
        'This category is really about reducing friction in the repeated parts of the day. When it works, the room resets faster and the routine feels less chaotic.',
      groups: [
        {
          title: 'What falls into this bucket',
          items: [
            'Drying racks and bottle cleanup setups.',
            'Sterilizer setups when they meaningfully support your feeding routine.',
            'Diaper caddies and grab-and-go changing supplies.',
            'Laundry helpers for bibs, burp cloths, and the tiny textile avalanche.',
            'Burp cloth and bib systems that keep the useful items close instead of mysteriously disappearing.',
            'Changing station organization that reduces the little supply hunts.',
          ],
        },
        {
          title: 'What this category is really solving',
          items: [
            'Giving the repeated essentials a home.',
            'Keeping the most-used supplies close by without turning every room into a stockroom.',
            'Reducing the clutter points that build up fast when the routine has no clear reset plan.',
          ],
        },
      ],
    },
    plan: {
      description:
        'The right support gear shows up because a real routine asked for it, not because the category looked organized online.',
      groups: [
        {
          items: [
            'What actually needs a home?',
            'What do you need close by versus stocked elsewhere?',
            'Where does clutter tend to build up fast?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'Daily support gear works best when it solves the friction you can already see.',
      groups: [
        {
          items: [
            'Observe the setup you already have before buying more bins for it.',
            'Notice the friction points that repeat: where laundry piles, where bottles collect, where supplies disappear.',
            'Solve the small routine problem first, then buy the helper that actually addresses it.',
          ],
        },
      ],
    },
    buy: {
      description:
        'Add this category slowly and based on actual daily use.',
      paragraphs: [
        'Support gear becomes clutter fastest when it gets bought in theory. It becomes helpful when it answers a specific, repeated annoyance.',
      ],
    },
    decisionBullets: [
      'Solve repeated friction instead of buying for hypothetical perfection.',
      'Give the most-used supplies a real home.',
      'Add support gear slowly after the routine shows you the need.',
      'Buy helpers that answer one specific annoyance clearly.',
    ],
    note: {
      eyebrow: 'TMBC note',
      title: 'The little things are rarely little when you use them fifteen times a day.',
      body: 'This is the quiet systems layer. It does not need to look glamorous. It just needs to make the day flow better.',
      tone: 'blush',
    },
  },
};

export function getDailyUseGearAcademySubmoduleCards(): DailyUseGearAcademyCard[] {
  return DAILY_USE_GEAR_SUBMODULE_ORDER.map((slug) => {
    const submodule = DAILY_USE_GEAR_ACADEMY_SUBMODULES[slug];

    return {
      href: getDailyUseGearAcademySubmodulePath(slug),
      title: submodule.title,
      description: submodule.cardSummary,
      ctaLabel: 'Explore module ->',
      eyebrow: `Module ${submodule.order}`,
    };
  });
}

export function getDailyUseGearAcademySubmodule(slug: DailyUseGearAcademySubmoduleSlug) {
  return DAILY_USE_GEAR_ACADEMY_SUBMODULES[slug];
}

export function buildDailyUseGearAcademySubmoduleModule(
  slug: DailyUseGearAcademySubmoduleSlug,
): ModuleLayoutData {
  const submodule = getDailyUseGearAcademySubmodule(slug);
  const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);
  const currentPath = getDailyUseGearAcademySubmodulePath(slug);

  return {
    slug,
    pathSlug: 'gear',
    href: currentPath,
    title: submodule.title,
    description: submodule.cardSummary,
    subhead: submodule.deck,
    intro: submodule.intro,
    imagePath: submodule.heroImageSrc,
    imageAlt: submodule.heroImageAlt,
    progress: {
      current: submodule.order,
      total: DAILY_USE_GEAR_SUBMODULE_ORDER.length,
    },
    coreSections: buildCoreSections(submodule),
    decisionTitle: 'What This Means For You',
    decisionBullets: submodule.decisionBullets,
    products: [],
    softCtaLabel: submodule.note.eyebrow,
    softCtaTitle: submodule.note.title,
    softCtaBody: [submodule.note.body],
    previous: navigation.previous,
    next: navigation.next,
    related: navigation.hub,
    editorialLinks: [],
    submoduleSection: null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: 'Gear', href: '/academy/gear' },
      { label: DAILY_USE_GEAR_ACADEMY_TITLE, href: DAILY_USE_GEAR_ACADEMY_HUB_PATH },
      { label: submodule.title },
    ],
  };
}

export function getDailyUseGearAcademySubmoduleNavigation(slug: DailyUseGearAcademySubmoduleSlug) {
  const currentIndex = DAILY_USE_GEAR_SUBMODULE_ORDER.indexOf(slug);
  const previousSlug = currentIndex > 0 ? DAILY_USE_GEAR_SUBMODULE_ORDER[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < DAILY_USE_GEAR_SUBMODULE_ORDER.length - 1
      ? DAILY_USE_GEAR_SUBMODULE_ORDER[currentIndex + 1]
      : null;

  return {
    previous: previousSlug
      ? {
          href: getDailyUseGearAcademySubmodulePath(previousSlug),
          title: getDailyUseGearAcademySubmodule(previousSlug).title,
          description: 'Go back one step inside Daily Use Gear if that part of the routine still needs the cleaner answer.',
          ctaLabel: 'Previous module ->',
          eyebrow: 'Previous',
        }
      : {
          href: '/academy/gear/travel-systems',
          title: 'Travel Systems',
          description: 'Go back to the previous Gear module if stroller and infant seat compatibility still need work.',
          ctaLabel: 'Previous gear module ->',
          eyebrow: 'Previous',
        },
    hub: {
      href: DAILY_USE_GEAR_ACADEMY_HUB_PATH,
      title: DAILY_USE_GEAR_ACADEMY_TITLE,
      description: 'Return to the full Daily Use Gear module map before opening another submodule.',
      ctaLabel: 'Back to hub ->',
      eyebrow: 'Hub',
    },
    next: nextSlug
      ? {
          href: getDailyUseGearAcademySubmodulePath(nextSlug),
          title: getDailyUseGearAcademySubmodule(nextSlug).title,
          description: 'Keep the Daily Use Gear sequence moving while the logic is still fresh.',
          ctaLabel: 'Next module ->',
          eyebrow: 'Next',
        }
      : {
          href: '/academy/postpartum',
          title: 'Postpartum Path',
          description: 'Continue the Academy into recovery, feeding, rest, and support once the gear layer feels calmer.',
          ctaLabel: 'Continue the Academy ->',
          eyebrow: 'Next',
        },
  };
}
