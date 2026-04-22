export const FEEDING_SETUP_FLOW_ACADEMY_PATH = '/academy/gear/feeding-setup-flow' as const;
export const FEEDING_SETUP_FLOW_ACADEMY_TITLE = 'Feeding Setup & Flow';
export const FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION =
  'Understand the main feeding pathways, what tools each one may require, what to buy now versus later, and how to build a feeding setup that supports real life without overbuying.';
export const FEEDING_SETUP_FLOW_ACADEMY_SUBHEAD =
  'You are not choosing isolated products. You are building the system that has to work on a regular Tuesday.';
export const FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH = '/assets/breastfeeding/formulanara.png';
export const FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT =
  'Flexible feeding setup image showing a real-life combination of bottles and feeding support.';

export const FEEDING_SETUP_FLOW_ACADEMY_KEYWORDS = [
  'feeding setup planning',
  'baby feeding gear guide',
  'what to buy now vs later for feeding',
  'pumping and bottle planning',
] as const;

export const FEEDING_SETUP_FLOW_DECK = [
  'You are not just choosing bottles or pumps.',
  'You are building a system that has to work in real life.',
] as const;

export const FEEDING_SETUP_FLOW_HERO_INTRO = [
  'Feeding is one of the fastest ways parents get overwhelmed.',
  'Not because it is impossible.',
  'Because it gets presented like there is one perfect path and one perfect setup.',
  'There is not.',
  'Some families breastfeed. Some pump. Some formula feed. Some combine all of the above. Most adjust as they go.',
  'This module is here to make that feel clearer.',
] as const;

export const FEEDING_SETUP_FLOW_PULL_QUOTE =
  'You are not choosing a feeding identity. You are choosing a setup that can support your real life.';

export const FEEDING_SETUP_FLOW_MODULE_INTRO = [
  'This is not a module about being perfect.',
  'It is a module about being prepared in a realistic way.',
  'The goal is not to buy every feeding product. The goal is to understand what kinds of tools exist, when they are actually useful, and what you probably do not need yet.',
  'National guidance supports breastfeeding when possible and also recognizes that many families pump, bottle feed expressed milk, formula feed, or use a combination of methods. The practical setup still has to fit the family, not the fantasy.',
] as const;

export const FEEDING_SETUP_FLOW_GENTLE_NOTE =
  'If feeding becomes more physically or emotionally difficult than expected, this is a good place to bring in your pediatrician, IBCLC, or another trusted provider.';

export type FeedingSetupFlowPathwayCard = {
  title: string;
  description: string;
  setup: string;
  appeal: string;
};

export const FEEDING_SETUP_FLOW_PATHWAYS: FeedingSetupFlowPathwayCard[] = [
  {
    title: 'Breastfeeding',
    description: 'Can feel simple on paper and complex in practice.',
    setup: 'Often requires less gear upfront, but may still involve support tools, recovery items, and a pump later.',
    appeal: 'It may appeal to families who want the simplest day-one setup and are comfortable building tools in layers.',
  },
  {
    title: 'Pumping',
    description: 'Adds structure and equipment quickly.',
    setup: 'Often means building around a pump, storage, bottles, drying space, and a repeatable cleaning workflow.',
    appeal: 'It can create flexibility, shared feeding options, and a plan for time away from baby.',
  },
  {
    title: 'Formula Feeding',
    description: 'Can offer predictability and shared feeding support.',
    setup: 'Still requires a clean, organized bottle system, prep rhythm, and enough structure to keep the counter from turning into a chemistry set.',
    appeal: 'It may appeal to families who want a more predictable feeding handoff or know formula will be part of the plan.',
  },
  {
    title: 'Combination Feeding',
    description: 'Often gives the most flexibility, but can make overbuying feel tempting.',
    setup: 'Usually involves some overlap across breastfeeding, pumping, bottles, and possibly formula support.',
    appeal: 'It may appeal to families who want room to adapt as feeding reality becomes clearer.',
  },
] as const;

export type FeedingSetupFlowNeedCard = {
  title: string;
  items: string[];
};

export const FEEDING_SETUP_FLOW_NEEDS: FeedingSetupFlowNeedCard[] = [
  {
    title: 'Breastfeeding may involve',
    items: [
      'nursing bras or tops',
      'a nursing pillow',
      'breast pads',
      'nipple care or recovery support',
      'an optional milk catcher or pump later if this becomes part of your routine',
    ],
  },
  {
    title: 'Pumping may involve',
    items: [
      'a breast pump',
      'milk storage bags or containers',
      'a pump bra',
      'a bottle system',
      'a cleaning setup',
      'a cooler or transport plan for pumping away from home',
    ],
  },
  {
    title: 'Formula feeding may involve',
    items: [
      'bottles',
      'a formula prep system',
      'a drying rack',
      'a cleaning or sterilizing setup',
      'a simple storage plan for supplies',
    ],
  },
  {
    title: 'Combination feeding may involve',
    items: [
      'both pump and bottle tools',
      'some formula support',
      'more intentional organization',
      'more restraint around duplicates',
      'a starting point that can expand without replacing everything',
    ],
  },
] as const;

export const FEEDING_SETUP_FLOW_BUY_NOW = [
  'a few bottles',
  'a basic feeding support setup',
  'one practical cleaning system',
  'a breast pump if you are already planning to use one or if insurance and timing make that decision easier now',
  'simple storage tools',
] as const;

export const FEEDING_SETUP_FLOW_WAIT_AND_SEE = [
  'multiple bottle systems',
  'extra bottle sizes or nipple flows before baby has tried one',
  'extra pump accessories',
  'specialty formula gear',
  'large freezer stash systems or duplicate sterilizers',
] as const;

export const FEEDING_SETUP_FLOW_BUY_NOW_QUOTE =
  'The fastest way to overbuy in feeding is to buy for every possible path at once.';

export const FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS = [
  'Pumping gets marketed in two extremes: either as effortless freedom or as a full-time identity.',
  'In real life, it is a tool.',
  'It can create flexibility. It can help support feeding goals. It can also add equipment, time, cleaning, and logistics.',
  'If you are trying to maintain milk supply while away from baby, pumping frequency usually needs to stay reasonably aligned with how often baby is feeding.',
  'If pumping is likely to become a longer-term part of the routine, especially around work separation, a double electric pump usually makes more practical sense than pretending a manual pump will carry the whole plan.',
] as const;

export const FEEDING_SETUP_FLOW_PUMPING_CHECKLIST = [
  'Where will I pump?',
  'Where will parts dry?',
  'How will milk be stored?',
  'Do I need this daily or occasionally?',
  'Is this for home, work, or both?',
] as const;

export const FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS = [
  'Bottles sound simple until you realize they quietly become a whole system.',
  'The bottle itself matters. So do nipple flow, cleaning, compatibility, how many you actually need, and whether your baby accepts that setup.',
  'If expressed milk will be offered, it often goes more smoothly when someone other than the nursing parent handles the first bottle attempts.',
  'Do not commit to a giant bottle system before you know what works.',
] as const;

export const FEEDING_SETUP_FLOW_BOTTLE_POINTS = [
  'Start with one system, not a shelf of contenders.',
  'Expect nipple flow decisions to matter as much as the bottle shape.',
  'Choose cleanup and compatibility with the rest of your routine in mind.',
  'Let baby acceptance and actual use decide whether you need to expand later.',
] as const;

export const FEEDING_SETUP_FLOW_BOTTLE_QUOTE =
  'You do not need twelve bottles on day one. You need a starting point.';

export const FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS = [
  'This is the least glamorous part of feeding. It is also the part that makes everything else work.',
  'Bottles, pump parts, and feeding items need a cleaning routine that is easy enough to repeat when you are tired.',
  'Some pump parts benefit from daily sanitizing for extra protection, especially with very young babies, babies born early, or babies with weakened immune systems.',
] as const;

export const FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS = [
  'up to 4 hours at room temperature',
  'up to 4 days in the refrigerator',
  'up to 24 hours in an insulated cooler with frozen ice packs',
  'longer freezer storage depending on freezer type',
] as const;

export const FEEDING_SETUP_FLOW_SIMPLE_SETUP = [
  'a wash basin or dishwasher-safe parts workflow',
  'a drying rack',
  'one bottle brush',
  'one practical storage method',
  'clearly defined counter space',
] as const;

export const FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS = [
  'The biggest feeding mistake is trying to prepare for every possible version of the future.',
  'You do not need the biggest setup. You need the cleanest starting point that can grow if real life asks for more.',
] as const;

export const FEEDING_SETUP_FLOW_DO_NOT_NEED = [
  'every bottle',
  'every pump accessory',
  'every feeding system',
  'a freezer strategy before you know if you will use it',
] as const;

export const FEEDING_SETUP_FLOW_DO_NEED = [
  'a realistic starting point',
  'a way to adjust',
  'permission to build in layers',
] as const;

export const FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE =
  'The strongest feeding setup is not the biggest one. It is the one you can actually maintain.';

export const FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS = [
  'Feeding gets easier when you stop trying to predict everything.',
  'The goal is not to build the perfect system before your baby arrives.',
  'The goal is to build a useful one.',
] as const;

export const FEEDING_SETUP_FLOW_TAKEAWAYS = [
  'Feeding paths are flexible.',
  'Tools should follow the routine, not lead it.',
  'Start with the basics and add based on real use.',
  'Bottles and pumps are systems, not just products.',
] as const;

export const FEEDING_SETUP_FLOW_CLOSE = 'Start there.';

export const FEEDING_SETUP_FLOW_NEXT_MODULES = [
  {
    title: 'Breast Pump',
    description:
      'Continue here for the pump-specific decision layer: when a pump makes sense, which type fits your routine, and what accessories can wait.',
    href: '/academy/gear/breast-pump',
    ctaLabel: 'Open breast pump module ->',
  },
  {
    title: 'Bottles & Baby Utensils',
    description:
      'Use this next for the bottle-system layer: starter counts, nipple flow, cleanup, and what baby utensils usually belong in a later chapter.',
    href: '/academy/gear/bottles-and-baby-utensils',
    ctaLabel: 'Open bottle module ->',
  },
] as const;

export const FEEDING_SETUP_FLOW_CORE_SECTIONS = [
  {
    title: 'See the feeding paths before the products',
    imageSrc: '/assets/breastfeeding/formulanara.png',
    imageAlt: 'Flexible feeding setup image showing a calm, adaptable routine.',
    paragraphs: [
      'Breastfeeding, pumping, formula feeding, and combination feeding can each work. The point is not to predict the exact path perfectly before birth.',
      'The point is to understand what kinds of systems each path tends to need, so you can start with a cleaner setup and add more only if real life asks for it.',
      'This is where feeding gets calmer: less identity, more logistics.',
    ],
  },
  {
    title: 'Buy the starter setup, not every backup plan',
    imageSrc: '/assets/breastfeeding/storagebottttles.png',
    imageAlt: 'Bottle starter setup image with practical feeding bottles and accessories.',
    paragraphs: [
      'A few bottles, one practical cleaning plan, and simple storage tools usually do more for you than buying three bottle systems and hoping one becomes destiny.',
      'If pumping is already likely, it makes sense to get the pump and its basic support pieces lined up. The extras can wait until the routine has a shape.',
      'This is especially true in combination feeding, where flexibility is helpful and duplicate purchases are extremely easy to justify in the moment.',
    ],
  },
  {
    title: 'Respect the boring parts',
    imageSrc: '/assets/breastfeeding/storagebagsmedela.png',
    imageAlt: 'Feeding supplies organized around storage, cleanup, and repeat use.',
    paragraphs: [
      'Pumping, bottles, storage, and cleaning are not side chores. They are the infrastructure.',
      'Where parts dry, how milk gets stored, whether the counter has a system, and how often you have to wash everything will shape the experience more than a marketing feature list usually does.',
      'The system feels better when the cleanup plan is obvious.',
    ],
  },
  {
    title: 'Build in layers',
    imageSrc: '/assets/breastfeeding/pumplifestyle.png',
    imageAlt: 'Feeding setup shown as something that can be built over time.',
    paragraphs: [
      'The strongest feeding setups usually start smaller than parents expect.',
      'A realistic starting point plus the ability to adjust is more useful than trying to own every possible answer before the baby arrives.',
      'That is not under-preparing. That is editing.',
    ],
  },
] as const;

export const FEEDING_SETUP_FLOW_DECISION_BULLETS = [
  'Choose a starting setup, not a full backup warehouse.',
  'Match the tools to the routine you are most likely to use first.',
  'Treat pumping, bottles, storage, and cleaning like one connected system.',
  'Build in layers once real use gives you better information.',
] as const;

export const FEEDING_SETUP_FLOW_SOFT_CTA_LABEL = 'Final Thoughts';
export const FEEDING_SETUP_FLOW_SOFT_CTA_TITLE =
  'The goal is not to build the perfect feeding system before your baby arrives.';
export const FEEDING_SETUP_FLOW_SOFT_CTA_BODY = [
  'The goal is to build a useful one, then let real life tell you what needs to change.',
] as const;

// Implementation notes:
// - AAP breastfeeding guidance and combined-method context:
//   https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Where-We-Stand-Breastfeeding.aspx
// - CDC pumping guidance:
//   https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/pumping-breast-milk.html
// - AAP pumping practicality note:
//   https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/low-breast-milk-supply.aspx
// - AAP bottle introduction note:
//   https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Introducing-the-Bottle.aspx
// - CDC cleaning and sanitizing guidance:
//   https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html
// - CDC milk storage guidance:
//   https://www.cdc.gov/breastfeeding/pdf/preparation-of-breast-milk_h.pdf
export const FEEDING_SETUP_FLOW_IMPLEMENTATION_NOTES = [
  'AAP and CDC guidance were checked for breastfeeding framing, pumping frequency, bottle introduction, cleaning, and milk storage timing before seeding this module.',
  'This module is intentionally practical and non-clinical. It does not replace personalized feeding support.',
] as const;

export function buildFeedingSetupFlowMarkdownContent() {
  const lines = [
    `# ${FEEDING_SETUP_FLOW_ACADEMY_TITLE}`,
    '',
    FEEDING_SETUP_FLOW_ACADEMY_SUBHEAD,
    '',
    '## Module 7 of 9 · Gear',
    '',
    ...FEEDING_SETUP_FLOW_HERO_INTRO.flatMap((paragraph) => [paragraph, '']),
    `> ${FEEDING_SETUP_FLOW_PULL_QUOTE}`,
    '',
    '## Start With A Flexible Feeding System',
    '',
    ...FEEDING_SETUP_FLOW_MODULE_INTRO.flatMap((paragraph) => [paragraph, '']),
    FEEDING_SETUP_FLOW_GENTLE_NOTE,
    '',
    '## Feeding Pathways Overview',
    '',
    ...FEEDING_SETUP_FLOW_PATHWAYS.flatMap((pathway) => [
      `### ${pathway.title}`,
      '',
      pathway.description,
      '',
      `Setup it often needs: ${pathway.setup}`,
      '',
      `Why it may appeal: ${pathway.appeal}`,
      '',
    ]),
    '## Feeding Gear Categories By Pathway',
    '',
    ...FEEDING_SETUP_FLOW_NEEDS.flatMap((card) => [
      `### ${card.title}`,
      '',
      ...card.items.map((item) => `- ${item}`),
      '',
    ]),
    '## What To Buy Now Vs Later',
    '',
    '### Buy now',
    '',
    ...FEEDING_SETUP_FLOW_BUY_NOW.map((item) => `- ${item}`),
    '',
    '### Wait and see',
    '',
    ...FEEDING_SETUP_FLOW_WAIT_AND_SEE.map((item) => `- ${item}`),
    '',
    `> ${FEEDING_SETUP_FLOW_BUY_NOW_QUOTE}`,
    '',
    '## Pumping In Real Life',
    '',
    ...FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS.flatMap((paragraph) => [paragraph, '']),
    'Think through:',
    '',
    ...FEEDING_SETUP_FLOW_PUMPING_CHECKLIST.map((item) => `- ${item}`),
    '',
    '## Bottles In Real Life',
    '',
    ...FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS.flatMap((paragraph) => [paragraph, '']),
    ...FEEDING_SETUP_FLOW_BOTTLE_POINTS.map((item) => `- ${item}`),
    '',
    `> ${FEEDING_SETUP_FLOW_BOTTLE_QUOTE}`,
    '',
    '## Storage + Cleaning Basics',
    '',
    ...FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS.flatMap((paragraph) => [paragraph, '']),
    'Freshly expressed milk can generally be stored:',
    '',
    ...FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS.map((item) => `- ${item}`),
    '',
    'A realistic feeding cleanup setup may include:',
    '',
    ...FEEDING_SETUP_FLOW_SIMPLE_SETUP.map((item) => `- ${item}`),
    '',
    '## Build The Setup, Not The Fantasy',
    '',
    ...FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS.flatMap((paragraph) => [paragraph, '']),
    'You do not need:',
    '',
    ...FEEDING_SETUP_FLOW_DO_NOT_NEED.map((item) => `- ${item}`),
    '',
    'You do need:',
    '',
    ...FEEDING_SETUP_FLOW_DO_NEED.map((item) => `- ${item}`),
    '',
    `> ${FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE}`,
    '',
    '## Final Thoughts',
    '',
    ...FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS.flatMap((paragraph) => [paragraph, '']),
    ...FEEDING_SETUP_FLOW_TAKEAWAYS.map((item) => `- ${item}`),
    '',
    FEEDING_SETUP_FLOW_CLOSE,
    '',
    '## Next Steps',
    '',
    '- Continue to Breast Pump',
    '- Continue to Bottles & Baby Utensils',
    '- Back to Daily Use Gear',
  ];

  return lines.join('\n').trim();
}
