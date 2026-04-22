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

export type DailyUseGearAcademySectionImage = {
  src: string;
  alt: string;
  caption: string;
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
  overviewImageSrc?: string;
  overviewImageAlt?: string;
  overviewImageCaption?: string;
  learn: DailyUseGearAcademySection;
  purpose: DailyUseGearAcademySection;
  plan: DailyUseGearAcademySection;
  trySection: DailyUseGearAcademySection;
  buy: DailyUseGearAcademySection;
  needReasons: string[];
  skipReasons: string[];
  coreSectionTitles?: {
    learn?: string;
    purpose?: string;
    needs?: string;
    skip?: string;
  };
  includeSkipSection?: boolean;
  sectionImages: {
    purpose: DailyUseGearAcademySectionImage;
    needs: DailyUseGearAcademySectionImage;
    skip: DailyUseGearAcademySectionImage;
  };
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
  const overviewImageSrc = submodule.overviewImageSrc ?? submodule.heroImageSrc;
  const overviewImageAlt = submodule.overviewImageAlt ?? submodule.heroImageAlt;
  const overviewImageCaption =
    submodule.overviewImageCaption ?? 'Understanding the product first usually makes the shortlist much quieter.';

  const sections: ModuleLayoutData['coreSections'] = [
    {
      title: submodule.coreSectionTitles?.learn ?? 'What the product is',
      paragraphs: flattenSectionParagraphs(submodule.learn),
      imageSrc: overviewImageSrc,
      imageAlt: overviewImageAlt,
      imageCaption: overviewImageCaption,
    },
    {
      title: submodule.coreSectionTitles?.purpose ?? 'What the purpose of the product is',
      paragraphs: flattenSectionParagraphs(submodule.purpose),
      imageSrc: submodule.sectionImages.purpose.src,
      imageAlt: submodule.sectionImages.purpose.alt,
      imageCaption: submodule.sectionImages.purpose.caption,
    },
    {
      title: submodule.coreSectionTitles?.needs ?? 'Reasons a person needs it',
      paragraphs: submodule.needReasons,
      imageSrc: submodule.sectionImages.needs.src,
      imageAlt: submodule.sectionImages.needs.alt,
      imageCaption: submodule.sectionImages.needs.caption,
    },
  ];

  if ((submodule.includeSkipSection ?? true) && submodule.skipReasons.length > 0) {
    sections.push({
      title: submodule.coreSectionTitles?.skip ?? 'Reasons a person would skip it',
      paragraphs: submodule.skipReasons,
      imageSrc: submodule.sectionImages.skip.src,
      imageAlt: submodule.sectionImages.skip.alt,
      imageCaption: submodule.sectionImages.skip.caption,
    });
  }

  return sections;
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
    heroImageSrc: '/assets/gearpath/carrierergobaby.png',
    heroImageAlt: 'Caregiver using an Ergobaby carrier in a calm everyday moment.',
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
    purpose: {
      description:
        'A carrier is there to keep baby close while giving the caregiver more freedom to move through the day without holding the entire shift in their arms.',
      paragraphs: [
        'The purpose is not to win a style category. It is to make naps, errands, house movement, and transition moments feel more workable.',
        'A good carrier should support both bodies at the same time. If it only works for the baby or only works in theory, it is not doing the whole job.',
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
    needReasons: [
      'You want hands-free support for naps, chores, errands, or getting through the house with one working arm again.',
      'Your baby settles better with motion and closeness than with being set down repeatedly.',
      'Multiple caregivers want one shared carry option that can become part of the everyday routine.',
    ],
    skipReasons: [
      'You do not expect to babywear often enough to justify adding another category right now.',
      'The fit or setup already feels fussy, and you know that friction means it will stay in the closet.',
      'A stroller, bassinet, or arms-only routine already covers the real job you were trying to solve.',
    ],
    sectionImages: {
      purpose: {
        src: '/assets/gearpath/omni.png',
        alt: 'Structured baby carrier shown as an everyday movement tool.',
        caption: 'This category earns its place when it supports real movement, not just a very hopeful version of it.',
      },
      needs: {
        src: '/assets/gearpath/carrierergobaby.png',
        alt: 'Parent using a baby carrier during an everyday routine.',
        caption: 'The strongest reason to own one is simple: it helps often enough to become part of the day.',
      },
      skip: {
        src: '/assets/gearpath/momcozypurehug.png',
        alt: 'Soft baby carrier shown as one optional way to carry, not an automatic need.',
        caption: 'If the routine does not really call for it, this is a category you can skip without apology.',
      },
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
      'Choose a highchair around posture, cleanup, longevity, and daily rhythm instead of just the silhouette.',
    metadataDescription:
      'Use the TMBC Daily Use Gear highchair module to think through posture, foot support, cleanup, longevity, and which type of highchair best fits your routine.',
    deck: 'One of the most-used pieces of furniture in your home, which is exactly why the wrong one gets old fast.',
    intro: [
      'No one really tells you this, but the highchair quietly becomes one of the most-used pieces of furniture in your home.',
      'Meals happen there. Snacks happen there. Tiny negotiations happen there. And if the chair is annoying, you will know quickly.',
      'This module is here to help you choose the category of best for your space, your routine, and your tolerance for mess, without urgency or hype.',
    ],
    heroImageSrc: '/assets/gearpath/momcozyhighchair.png',
    heroImageAlt: 'Momcozy highchair in an everyday mealtime setting.',
    overviewImageSrc: '/assets/gearpath/momcozyhighchair.png',
    overviewImageAlt: 'Highchair shown in a calm everyday feeding setup.',
    overviewImageCaption:
      'The best highchair usually disappears into your routine instead of becoming one more thing you resent three meals a day.',
    learn: {
      description:
        'This category gets easier once you stop asking which chair is universally best and start asking which lane fits your real life best.',
      groups: [
        {
          title: 'The lanes that usually make sense',
          items: [
            'Posture-first, long-term chairs: Best when adjustability, foot support, and longevity matter more than instant simplicity.',
            'Design-forward everyday chairs: Best when the highchair lives in a shared space and you want it to feel intentional without turning into a giant plastic event.',
            'Quietly practical budget chairs: Best when stable feeding support and easy cleanup matter more than owning the internet’s current favorite.',
            'Compact or folding chairs: Best when square footage matters and the highchair cannot claim part of the room forever.',
          ],
        },
        {
          title: 'What actually matters during feeding',
          items: [
            'Foot support matters because babies usually eat better when they are sitting well.',
            'Seat and footrest adjustability matter because longevity is not just about what age range the box promises.',
            'Cleanup matters more than aesthetics by about week two. Smooth surfaces and fewer crumb traps win.',
            'A usable tray and straightforward straps matter because repeated friction is what turns a nice-looking chair into a daily complaint.',
          ],
        },
      ],
    },
    purpose: {
      description:
        'A highchair affects posture, safety, cleanup, longevity, and how smoothly daily meals actually go.',
      paragraphs: [
        'This is one of the few gear categories that becomes real furniture. It shows up constantly, which is why the right one supports both baby’s body and your sanity.',
        'The goal is not to find the perfect highchair. It is to choose one that fits your home well enough that it disappears into the routine instead of adding friction to it.',
      ],
    },
    plan: {
      description:
        'Think in terms of your category of best, not the internet’s best.',
      groups: [
        {
          items: [
            'How long do you want to use it?',
            'How adjustable does it need to be?',
            'Will it live in a shared, visible space?',
            'How much daily cleanup are you actually willing to tolerate?',
          ],
        },
      ],
    },
    trySection: {
      description:
        'The best test is not whether it looks nice in the kitchen. It is whether you would still like it after a week of solids.',
      groups: [
        {
          items: [
            'Remove and reattach the tray one-handed if you can.',
            'Check whether baby’s feet can actually be supported well.',
            'Look closely at seams, straps, and fabric because that is where cleanup optimism goes to die.',
            'See how easy it is to get baby in and out without turning every meal into a production.',
          ],
        },
      ],
    },
    buy: {
      description:
        'Prioritize posture, stability, cleanup, and how the chair behaves in the repeated parts of the day.',
      paragraphs: [
        'Expensive is not automatically better, and budget is not automatically regrettable. The right chair is the one you stop thinking about once meals get going.',
      ],
    },
    needReasons: [
      'Solids are close, and you want one dependable feeding seat that can become part of the routine quickly.',
      'You care about posture, foot support, and a setup that does not get outgrown emotionally in two months.',
      'The chair will live in a shared space, so it needs to work for both the room and the daily mess.',
    ],
    skipReasons: [
      'Solids are still far enough away that this category does not need urgency yet.',
      'Your space is so tight that waiting for the actual feeding rhythm will likely give you a cleaner answer than buying a pretty compromise now.',
      'You already know a smaller, later-stage, or travel-friendly seat will make more sense than a full everyday highchair right away.',
    ],
    coreSectionTitles: {
      learn: 'What it is',
      purpose: 'What it does',
      needs: 'Why you need it',
    },
    includeSkipSection: false,
    sectionImages: {
      purpose: {
        src: '/assets/gearpath/momcozyhighchair.png',
        alt: 'Highchair shown as one of the most-used pieces of everyday family furniture.',
        caption: 'A highchair should make repeated meals smoother, not just make the room look more prepared.',
      },
      needs: {
        src: '/assets/gearpath/momcozyhighchair.png',
        alt: 'Highchair positioned for repeated daily feeding in a shared home space.',
        caption: 'This category earns real attention quickly once you remember how often meals, snacks, and cleanup actually happen.',
      },
      skip: {
        src: '/assets/gearpath/momcozyhighchair.png',
        alt: 'Highchair shown as a category that can wait until feeding timing and space needs are more concrete.',
        caption: 'This is an easy category to buy too early. Real timing and real space constraints usually give the cleaner answer.',
      },
    },
    decisionBullets: [
      'Start with posture and foot support.',
      'Choose around your space, cleanup tolerance, and how visible the chair will be.',
      'Think in terms of your category of best, not a universal best.',
      'Buy the chair that disappears into routine instead of adding friction to it.',
    ],
    note: {
      eyebrow: 'TMBC note',
      title: 'The best highchair is the one you stop thinking about.',
      body: 'When the tray works, the cleanup is sane, and your baby sits well, you get to pay attention to the meal instead of the chair. That is the win.',
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
    heroImageSrc: '/assets/gearpath/babybathbabu.png',
    heroImageAlt: 'Baby bath setup shown in a real bathroom environment.',
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
    purpose: {
      description:
        'A baby bath exists to make a slippery routine feel more stable, easier to handle, and less physically awkward for the adult doing it.',
      paragraphs: [
        'The goal is not a spa moment. It is safer support, better ergonomics, and one clear place where the washing routine happens.',
        'The right setup should help you feel calmer around water, handling, and cleanup instead of adding another wobbly step to the process.',
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
    needReasons: [
      'You want one supported, repeatable bathing setup instead of improvising around a slippery baby each time.',
      'Your sink or tub setup needs more structure for safety or adult ergonomics to feel manageable.',
      'Storage, drainage, and setup speed matter because bath time needs to reset cleanly once it is over.',
    ],
    skipReasons: [
      'Your sink setup already works well enough that you do not need a separate bath system yet.',
      'Space is tight, and waiting to see which bathing setup actually feels easiest will likely prevent a redundant purchase.',
      'You already have a hand-me-down insert or tub that handles the job without needing a second version.',
    ],
    sectionImages: {
      purpose: {
        src: '/assets/gearpath/babybathbabu.png',
        alt: 'Baby bath setup shown as a stable washing station.',
        caption: 'The real job is calm handling and safe support, not creating a very tiny spa package.',
      },
      needs: {
        src: '/assets/gearpath/babybathbabu.png',
        alt: 'Baby bath setup shown in the kind of room where it has to work repeatedly.',
        caption: 'This category makes sense when it removes enough awkwardness to make the routine feel safer and easier.',
      },
      skip: {
        src: '/assets/gearpath/babybathbabu.png',
        alt: 'Simple baby bath setup shown as an optional category rather than an automatic one.',
        caption: 'If another bath setup already works, this is one of the easier categories to keep simple.',
      },
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
    heroImageSrc: '/assets/gearpath/packandplaygraco.png',
    heroImageAlt: 'Pack and play shown as a classic flexible playard setup.',
    overviewImageSrc: '/assets/gearpath/sleeppackandplay.png',
    overviewImageAlt: 'Pack and play used as a practical sleep setup.',
    overviewImageCaption:
      'This category gets easier once you separate true sleep use, travel use, and backup use instead of expecting one vague product label to explain all of it.',
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
    purpose: {
      description:
        'A pack and play exists to give you a flexible sleep or set-down zone when one fixed crib does not cover the whole plan.',
      paragraphs: [
        'Sometimes that means room sharing. Sometimes it means travel. Sometimes it means one backup sleep setup that can move when the day does.',
        'The purpose is not maximum accessories. It is portability, flexibility, and a second sleep answer that stays practical.',
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
    needReasons: [
      'You need a room-sharing, backup-sleep, or travel setup that can move more easily than a full nursery crib.',
      'A second sleep zone would make naps, travel, or another caregiver’s house feel much more workable.',
      'You want one piece that can flex between jobs without adding another permanent furniture footprint.',
    ],
    skipReasons: [
      'Your crib or bassinet plan already covers the real use case, and travel is too occasional to justify another large item.',
      'The fold, weight, or footprint already sounds more annoying than helpful for the way you live.',
      'You are paying for attachments or versatility you do not actually expect to use.',
    ],
    sectionImages: {
      purpose: {
        src: '/assets/gearpath/packplaytravelcrib.png',
        alt: 'Travel-crib style setup shown as a flexible sleep solution.',
        caption: 'The point is one flexible sleep answer, not a larger pile of attachments.',
      },
      needs: {
        src: '/assets/gearpath/travelcrib.png',
        alt: 'Travel crib shown in a portability-first setup.',
        caption: 'This category earns its place when flexibility shows up often enough to matter.',
      },
      skip: {
        src: '/assets/gearpath/toddlerpackandplay.png',
        alt: 'Pack and play shown in a later-stage containment role.',
        caption: 'If the room, fold, or use case already feels vague, this is often a category to delay.',
      },
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
    heroImageAlt: 'Everyday baby gear image representing soothing and set-down stations.',
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
    purpose: {
      description:
        'A swing or bouncer exists to offer brief soothing help or one reliable place to set baby down while you do something else with your arms and brain.',
      paragraphs: [
        'The purpose is not guaranteed magic. It is a support tool for motion, settling, or short hands-free stretches when that would genuinely help.',
        'This category works best when the expectations stay modest and the footprint earns its keep.',
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
    needReasons: [
      'You want one safe, supervised set-down station in the main part of the house.',
      'A little motion support would make soothing or short resets easier during the day.',
      'You have space for one helper and want to test whether this kind of support fits your baby.',
    ],
    skipReasons: [
      'You do not have the floor space for a category that may only help in one narrow part of the routine.',
      'You already know you want to wait and see how your baby responds before buying motion gear.',
      'You are hoping this will solve every hard moment, which is usually a sign to dial the expectation back before you buy.',
    ],
    sectionImages: {
      purpose: {
        src: '/assets/editorial/babystuff.png',
        alt: 'Baby gear setup representing motion and set-down support tools.',
        caption: 'Helpful is a realistic goal here. Miraculous is where the marketing starts freelancing.',
      },
      needs: {
        src: '/assets/editorial/babystuff.png',
        alt: 'Baby gear setup shown as one optional helper in the room.',
        caption: 'This category makes the most sense when one supervised set-down option would noticeably help the day.',
      },
      skip: {
        src: '/assets/editorial/babystuff.png',
        alt: 'Baby gear image used to show that swings and bouncers are optional, not universal.',
        caption: 'If the room or the expectation is already too crowded, this is an easy category to keep optional.',
      },
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
    heroImageSrc: '/assets/breastfeeding/storagebottttles.png',
    heroImageAlt: 'Organized daily support gear and feeding cleanup setup.',
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
    purpose: {
      description:
        'Daily support gear exists to remove friction from the repeated parts of the day that would otherwise keep falling apart in small, annoying ways.',
      paragraphs: [
        'This is the systems layer: cleanup helpers, changing support, storage, and the little tools that keep the basics from scattering all over the house.',
        'The purpose is not to own every organizer. It is to make the most-used jobs faster to reset.',
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
    needReasons: [
      'The same supplies keep disappearing, piling up, or landing in the wrong room.',
      'Bottle cleanup, changing, laundry, or reset points are already showing you exactly where the friction lives.',
      'You need the routine to feel easier to repeat, not just more fully accessorized.',
    ],
    skipReasons: [
      'The routine is not established yet, so you still need to see where the real friction points actually are.',
      'Your existing storage or cleanup setup already works well enough without adding another organizing layer.',
      'You are shopping for a fantasy of perfect organization instead of a specific repeated annoyance.',
    ],
    sectionImages: {
      purpose: {
        src: '/assets/breastfeeding/storagebottttles.png',
        alt: 'Bottle and cleanup support items organized into a practical workflow.',
        caption: 'Support gear earns its place when it helps the reset, not when it simply makes the drawer look ambitious.',
      },
      needs: {
        src: '/assets/breastfeeding/storagebagsmedela.png',
        alt: 'Support items arranged as part of a repeated cleanup and storage workflow.',
        caption: 'This category matters once the same little friction points start repeating loudly.',
      },
      skip: {
        src: '/assets/breastfeeding/storagebottttles.png',
        alt: 'Organized daily support setup shown as a layer to add only when the routine asks for it.',
        caption: 'If the routine has not shown you the problem yet, this category can wait without consequence.',
      },
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
