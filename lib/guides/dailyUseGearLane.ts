import type { GuideStageLabel } from '@/lib/guides/guideFlow';
import type { DecisionBlockItem } from '@/components/guides/DecisionBlock';
import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

export const DAILY_USE_GEAR_HUB_PATH = '/learn/gear/daily-use-gear' as const;

export const DAILY_USE_GEAR_HUB_SLIDES = [
  { id: 'daily-use-gear-orientation', label: 'Orientation', shortLabel: 'Start' },
  { id: 'daily-use-gear-what-this-lane-is', label: 'What This Lane Is', shortLabel: 'Why' },
  { id: 'daily-use-gear-who-this-is-for', label: 'Who This Is For', shortLabel: 'Fit' },
  { id: 'daily-use-gear-category-cards', label: 'Category Cards', shortLabel: 'Cards' },
  { id: 'daily-use-gear-how-to-use-this', label: 'How To Use This', shortLabel: 'Use' },
  { id: 'daily-use-gear-next-step', label: 'Next Step', shortLabel: 'Next' },
] as const;

export const DAILY_USE_GEAR_JOURNEY_PATH = ['Learn', 'Travel', 'Daily Use Gear'] as const;

export const DAILY_USE_GEAR_HUB_ORIENTATION_BODY = [
  'These are the products you will use every single day.',
  'Not the ones you research for weeks.',
  'The ones that quietly support your routine.',
  'Feeding.',
  'Bathing.',
  'Holding.',
  'Soothing.',
  'Resting.',
  'This is where function matters more than anything else.',
] as const;

export const DAILY_USE_GEAR_HUB_WHO_THIS_IS_FOR = [
  'Parents who already handled the big gear and now want the smaller workhorses to make more sense.',
  'Families who keep asking whether a product will actually earn daily use or just a brief phase of optimism.',
  'People with limited storage who need function to win over novelty quickly.',
  'Anyone building a registry who wants the smaller categories to feel calmer before they become duplicate magnets.',
] as const;

export type DailyUseGearCategorySlug =
  | 'carriers'
  | 'highchairs'
  | 'baby-bath'
  | 'bouncers'
  | 'pack-and-play'
  | 'swings';

type DailyUseGearCategoryDefinition = {
  slug: DailyUseGearCategorySlug;
  title: string;
  description: string;
  icon: GuideHubIconKey;
  heroEyebrow: string;
  heroImageSrc: string;
  heroImageAlt: string;
  orientation: string[];
  whatItDoes: {
    description: string;
    intro: string[];
    supportPoints: string[];
    calloutBody: string;
    whatThisIs: string;
    whyItExists: string;
  };
  typesDescription: string;
  types: string[];
  whatActuallyMattersDescription: string;
  whatActuallyMatters: string[];
  commonMistakesDescription: string;
  commonMistakes: string[];
  howToChooseDescription: string;
  howToChoose: DecisionBlockItem[];
};

type DailyUseGearNextStep = {
  label: string;
  href: string;
  description: string;
  stage: GuideStageLabel;
};

type DailyUseGearHubDecisionItem = DecisionBlockItem;

const CATEGORY_ORDER: DailyUseGearCategorySlug[] = [
  'carriers',
  'highchairs',
  'baby-bath',
  'bouncers',
  'pack-and-play',
  'swings',
];

export function getDailyUseGearCategoryPath(slug: DailyUseGearCategorySlug) {
  return `${DAILY_USE_GEAR_HUB_PATH}/${slug}` as const;
}

export const DAILY_USE_GEAR_CATEGORIES: Record<DailyUseGearCategorySlug, DailyUseGearCategoryDefinition> = {
  carriers: {
    slug: 'carriers',
    title: 'Baby Carriers',
    description: 'Hands-free support that keeps baby close without making your whole day stop.',
    icon: 'bag',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/growing-with-confidence.jpg',
    heroImageAlt: 'Parent holding baby close in a calm everyday moment.',
    orientation: [
      'This is the product that gives you your hands back.',
      'And keeps your baby close at the same time.',
    ],
    whatItDoes: {
      description: 'A baby carrier should make movement easier, not turn getting out the door into an instructional film.',
      intro: [
        'A baby carrier lets you keep your baby against your body while you stay mobile enough to make lunch, answer the door, or walk the dog without staging a full production.',
        'It supports bonding, movement, and the part of daily life where your baby wants closeness and you still need both hands to remain members of the team.',
      ],
      supportPoints: [
        'Bonding without parking yourself on the couch every time.',
        'Movement when the stroller is too much or simply not the point.',
        'Everyday functionality when the baby wants closeness and the laundry would still like a word.',
      ],
      calloutBody: 'Start with your body, your routine, and how often you want another adult to be able to use the same carrier easily.',
      whatThisIs: 'A daily-use support tool, not a fashion identity or a complicated hobby.',
      whyItExists: 'Because some days the easiest way to keep the routine moving is to keep your baby with you instead of transferring them in and out of three different stations.',
    },
    typesDescription: 'Most carrier confusion disappears once you stop treating them like one category with different colors.',
    types: [
      'Wraps: Soft fabric that gives newborn closeness and flexibility, but asks for a little more patience up front.',
      'Ring slings: A quick one-shoulder option that works well for short carries and fast ups and downs.',
      'Soft structured carriers: The easiest everyday option for many families because the buckles, straps, and support are more straightforward.',
      'Hybrid carriers: A middle lane that borrows some softness from wraps and some convenience from structured carriers.',
    ],
    whatActuallyMattersDescription: 'This category gets easier fast when you judge it by use, not by how serene it looks in a parking-lot photo.',
    whatActuallyMatters: [
      'Comfort for you, because a beautiful carrier that hurts your back becomes decorative very quickly.',
      'Ease of getting baby in and out, especially when the carrier will be used during actual errands.',
      'Adjustability between caregivers if more than one adult needs to use it without resentment.',
      'Newborn support that feels secure without turning every carry into advanced geometry.',
      'Fabric and climate comfort if you live somewhere warm or plan to babywear often.',
    ],
    commonMistakesDescription: 'Most carrier regret comes from over-romanticizing the category instead of fitting it to the actual day.',
    commonMistakes: [
      'Choosing based on aesthetics and hoping the fit will sort itself out.',
      'Buying a system that feels too complicated to reach for on a normal Tuesday.',
      'Ignoring fit and assuming the most popular carrier will automatically work for your body.',
      'Expecting one carrier to be perfect for every stage, every weather pattern, and every caregiver.',
    ],
    howToChooseDescription: 'Use the version of babywearing you will actually do, not the aspirational version with a quieter schedule.',
    howToChoose: [
      {
        condition: 'want soft newborn closeness and do not mind a learning curve',
        recommendation: 'Start with a wrap. It is the closest-feeling option, but only if you will genuinely use it.',
      },
      {
        condition: 'want quick up-and-down carrying for shorter stretches',
        recommendation: 'A ring sling is usually the cleaner fit.',
      },
      {
        condition: 'want the easiest shared everyday option',
        recommendation: 'Choose a soft structured carrier and let convenience win on purpose.',
      },
      {
        condition: 'want something softer than a structured carrier but less fiddly than a wrap',
        recommendation: 'A hybrid carrier is the middle ground worth trying.',
      },
    ],
  },
  highchairs: {
    slug: 'highchairs',
    title: 'Highchairs',
    description: 'A feeding seat that makes solids, cleanup, and table time less annoying.',
    icon: 'checklist',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/feeding.png',
    heroImageAlt: 'Editorial feeding setup with baby mealtime essentials.',
    orientation: [
      'This is where feeding gets real.',
      'A good highchair will not make cleanup fun, but it can keep it from feeling personal.',
    ],
    whatItDoes: {
      description: 'A highchair gives baby a consistent, supported place to eat and gives the adults a better chance of keeping mealtimes from becoming full-contact improvisation.',
      intro: [
        'Once solids begin, the highchair becomes one of the clearest routine anchors in the house. It is where snacks happen, meals happen, and at some point a suspicious amount of avocado also happens.',
        'The right one supports posture, pulls your baby into the family table rhythm, and makes cleanup realistic enough that you will keep using it.',
      ],
      supportPoints: [
        'Consistent mealtime positioning once solids enter the picture.',
        'A better routine around the table instead of wandering feeding stations.',
        'Cleaner cleanup logic when the tray, seat, and straps are not fighting you.',
      ],
      calloutBody: 'Start with the table, the floor space, and how much cleanup patience you realistically have after breakfast.',
      whatThisIs: 'A daily feeding workstation, not a decorative dining accessory.',
      whyItExists: 'Because mealtime becomes much easier when baby has one reliable place to sit and the seat itself does not create extra work.',
    },
    typesDescription: 'The main differences here are footprint, cleanup, and how long you expect the seat to stay in the routine.',
    types: [
      'Traditional full-size highchairs: A steady everyday option with a larger footprint and usually the most obvious tray setup.',
      'Compact or folding highchairs: Better when space is tight and the seat cannot live in the middle of the kitchen forever.',
      'Convertible highchairs: Designed to grow with the routine and stay useful beyond the earliest feeding stage.',
      'Booster-style hybrids: A smaller setup that works when you already have a solid dining chair and want less gear overall.',
    ],
    whatActuallyMattersDescription: 'This category is less about features and more about whether the chair still feels easy after the twentieth wipe-down.',
    whatActuallyMatters: [
      'How easy it is to clean, because those tiny seat crevices absolutely have a plan for your afternoon.',
      'Foot support and seated posture once baby is eating more regularly.',
      'Tray removal and reattachment without a wrestling match.',
      'Whether the size fits your table and floor plan without turning the room into an obstacle course.',
      'How easy the straps are to use and wash once real meals enter the chat.',
    ],
    commonMistakesDescription: 'Highchair regret usually comes from forgetting that the seat has to survive actual food, not just the registry photo.',
    commonMistakes: [
      'Choosing the prettiest seat before checking whether it cleans up well.',
      'Ignoring footprint and only realizing later that the chair lives in the exact worst place.',
      'Buying too early and storing a giant chair for months while it judges your pantry.',
      'Assuming every expensive highchair is automatically more practical.',
    ],
    howToChooseDescription: 'The best fit is the one that matches your space, your table routine, and your tolerance for cleanup repetition.',
    howToChoose: [
      {
        condition: 'want the strongest everyday mealtime setup and have room for it',
        recommendation: 'A traditional or convertible highchair usually makes the most sense.',
      },
      {
        condition: 'need the seat to disappear or fold more easily',
        recommendation: 'Choose a compact or folding highchair.',
      },
      {
        condition: 'want one seat to stay relevant longer',
        recommendation: 'A convertible highchair is the cleaner long-game choice.',
      },
      {
        condition: 'already have a sturdy dining chair and want less bulk',
        recommendation: 'A booster-style hybrid can be the smarter fit.',
      },
    ],
  },
  'baby-bath': {
    slug: 'baby-bath',
    title: 'Baby Bath',
    description: 'Bath support that keeps the process safer, simpler, and less slippery.',
    icon: 'home',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/welcome.png',
    heroImageAlt: 'Editorial first-weeks image for bathing and early routine support.',
    orientation: [
      'Bath gear is less about luxury and more about not performing a wet one-handed negotiation over the sink.',
      'That is a respectable goal.',
    ],
    whatItDoes: {
      description: 'Baby bath gear gives you a safer, more supported way to wash baby without turning the adult ergonomics into an afterthought.',
      intro: [
        'This category exists to make bath time feel more contained, more stable, and less physically awkward while your baby is still tiny and slippery.',
        'The right setup depends less on brand and more on where the bath is happening, how much storage you have, and how long you want one setup to last.',
      ],
      supportPoints: [
        'Safer support for a stage where baby is not helping you much yet.',
        'Less strain on the adult doing the actual bathing.',
        'A simpler cleanup routine once water, towels, and baby all need attention at the same time.',
      ],
      calloutBody: 'Start with where bath time will happen most often. The sink, the counter, and the tub do not need the same gear.',
      whatThisIs: 'A support category for the bathing routine, not a place where more accessories automatically equal a better bath.',
      whyItExists: 'Because early bath time is mostly a handling and setup question, and the right support makes that question much less dramatic.',
    },
    typesDescription: 'The real split is not cute versus plain. It is where the bath happens and how long the setup should last.',
    types: [
      'Sink inserts: Best when the sink is the easiest early-stage bath location and you want something compact.',
      'Infant tubs: A simple dedicated tub that gives baby more support outside the sink.',
      'Convertible tubs: Built to stretch across more stages so you are not replacing the setup immediately.',
      'Bath seats and supports: Meant for older babies who already have more strength and stability, not for tiny newborns.',
    ],
    whatActuallyMattersDescription: 'The practical details matter more here than the category likes to admit.',
    whatActuallyMatters: [
      'Stage fit, because older-baby support is not the same as newborn support.',
      'How easy the setup is to drain, dry, and store between baths.',
      'Whether it works in the actual place you plan to use it most often.',
      'Non-slip support and handling confidence for you as much as for baby.',
      'How much space it takes up once it is wet and no longer looking streamlined online.',
    ],
    commonMistakesDescription: 'Bath gear gets more complicated than it needs to when the setup is chosen in theory instead of in the bathroom.',
    commonMistakes: [
      'Buying a giant tub without deciding where it will actually live.',
      'Choosing based on cuteness instead of stage fit and stability.',
      'Using an older-baby seat too soon because it looked simpler.',
      'Forgetting that drying and storing the setup is part of the job too.',
    ],
    howToChooseDescription: 'Pick the setup that works in the space you already have instead of forcing the room to become a spa identity project.',
    howToChoose: [
      {
        condition: 'want the smallest early-stage setup and the sink is practical',
        recommendation: 'Start with a sink insert.',
      },
      {
        condition: 'want a straightforward dedicated bath setup from the beginning',
        recommendation: 'Choose an infant tub.',
      },
      {
        condition: 'want one setup to last across more stages',
        recommendation: 'A convertible tub is usually the cleaner fit.',
      },
      {
        condition: 'have an older baby who is sturdier and only need light support',
        recommendation: 'A bath seat or support can make sense at that stage.',
      },
    ],
  },
  bouncers: {
    slug: 'bouncers',
    title: 'Bouncers',
    description: 'A simple place to set baby down for awake-time support without adding a giant footprint.',
    icon: 'layers',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/teddy-glow.png',
    heroImageAlt: 'Editorial home support image for calm awake-time routines.',
    orientation: [
      'This is the put-baby-down-for-a-minute category.',
      'Respectfully, that is a very real job.',
    ],
    whatItDoes: {
      description: 'A bouncer gives you a lightweight, temporary place for baby to hang out while you do the tiny household tasks that still insist on happening.',
      intro: [
        'The value of a bouncer is usually not mystery or technology. It is the fact that you can set baby down nearby while you shower, eat, or unload the dishwasher without dragging a giant seat through the house.',
        'This category works best when it stays simple and supports awake-time use well.',
      ],
      supportPoints: [
        'A safe nearby spot during awake time.',
        'Easy room-to-room movement when you need baby close.',
        'A lighter footprint than bulkier soothing gear.',
      ],
      calloutBody: 'Start with where the seat will move during the day. If you need it to travel from room to room, bulk loses quickly.',
      whatThisIs: 'A lightweight awake-time station, not a sleep solution and not a permanent command center.',
      whyItExists: 'Because sometimes the most helpful gear is the gear that lets you put the baby down briefly without creating a new project.',
    },
    typesDescription: 'Most bouncers solve the same basic problem, but they do it with very different amounts of bulk and complexity.',
    types: [
      'Simple manual bouncers: Lightweight, easy to move, and usually the cleanest everyday answer.',
      'Rocker-bouncer hybrids: A slightly loungier option when you want more than one motion style.',
      'Fold-flat travel bouncers: Best when storage or mobility matters almost as much as the seat itself.',
      'Premium design-led bouncers: A polished version of the same basic job, often with nicer materials and a higher price tag to match.',
    ],
    whatActuallyMattersDescription: 'This is one of the clearest categories where simpler often wins.',
    whatActuallyMatters: [
      'How easy it is to move around the house.',
      'Whether the cover is washable once real baby life gets involved.',
      'How much floor space it takes when you are not using it.',
      'The age and weight window, because some seats have a shorter runway than people expect.',
      'How quickly you can place baby in it without adjusting twelve things first.',
    ],
    commonMistakesDescription: 'Bouncer regret usually comes from expecting the seat to do a much bigger job than it was built for.',
    commonMistakes: [
      'Treating it like a sleep setup instead of an awake-time helper.',
      'Buying something much bulkier than the job requires.',
      'Overestimating how long the seat will be a daily favorite.',
      'Paying for extra complexity when you mainly need simplicity and portability.',
    ],
    howToChooseDescription: 'Let the seat match the actual support job instead of the fantasy version where every accessory gets used equally.',
    howToChoose: [
      {
        condition: 'want the easiest everyday nearby seat',
        recommendation: 'Start with a simple manual bouncer.',
      },
      {
        condition: 'want a little more lounge feel without committing to a full swing',
        recommendation: 'A rocker-bouncer hybrid is usually the better fit.',
      },
      {
        condition: 'need something you can fold away or travel with more easily',
        recommendation: 'Choose a fold-flat or compact bouncer.',
      },
      {
        condition: 'know the seat will live in your main space and you care about finish as well as function',
        recommendation: 'A premium bouncer can make sense if it still stays simple to use.',
      },
    ],
  },
  'pack-and-play': {
    slug: 'pack-and-play',
    title: 'Pack & Play',
    description: 'A flexible second-zone setup for sleep, play, travel, or downstairs life.',
    icon: 'sleep',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/babyincrib.png',
    heroImageAlt: 'Editorial sleep and home setup image for baby rest spaces.',
    orientation: [
      'This is the category people buy just in case and then sometimes use constantly.',
      'That depends on whether the setup actually matches the job.',
    ],
    whatItDoes: {
      description: 'A pack and play gives you a flexible secondary setup for sleep, play, travel, or downstairs containment without building a second full nursery.',
      intro: [
        'Some families use a playard constantly. Others unfold it twice and then remember they own it when guests come over. The difference is usually not quality. It is clarity about the actual job.',
        'This category makes the most sense when you know whether you need a second sleep zone, a travel sleep setup, or simply a contained place for baby to play nearby.',
      ],
      supportPoints: [
        'A backup or secondary sleep/play zone without a second full furniture setup.',
        'Portable flexibility for travel, downstairs life, or grandparent houses.',
        'A clearer place for baby to be when the whole house cannot become one giant play mat.',
      ],
      calloutBody: 'Start with whether this is for everyday downstairs life, travel, or occasional backup. Those are different jobs.',
      whatThisIs: 'A flexible support station that works best when the use case is narrow and honest.',
      whyItExists: 'Because not every family needs a second crib, but many families do need a second place for baby to safely sleep or play.',
    },
    typesDescription: 'The category splits mostly by use case: everyday station, travel companion, or all-in-one early-month helper.',
    types: [
      'Basic playards: The cleanest option when you want one simple second zone without a pile of attachments.',
      'Bassinet-included playards: Better for the early months when bending all the way down every time gets old fast.',
      'Changer-attachment models: Useful when you genuinely want one downstairs station doing several jobs early on.',
      'Travel-light playards: Built for easier transport when the portable part really matters.',
    ],
    whatActuallyMattersDescription: 'The smartest pack and play is the one whose weight, fold, and setup match where it will really live.',
    whatActuallyMatters: [
      'Whether the main job is sleep, play, travel, or a downstairs station.',
      'Setup and fold effort, because portable gear that nobody wants to fold is only portable in theory.',
      'Weight and footprint if it will move in and out of the car.',
      'Sleep-safe configuration for the stage you are actually in.',
      'Whether the extra attachments solve a real problem or just make the box larger.',
    ],
    commonMistakesDescription: 'This category gets overbuilt quickly when families buy the most feature-packed version before they know the real use pattern.',
    commonMistakes: [
      'Buying a large all-in-one version for occasional travel.',
      'Paying for attachments that will be ignored after the first few weeks.',
      'Assuming every playard is equally easy to move, fold, and carry.',
      'Confusing convenient add-ons with the part that actually needs to work well long-term.',
    ],
    howToChooseDescription: 'Choose the pack and play for the main job, not for every side quest it could theoretically take on.',
    howToChoose: [
      {
        condition: 'want a simple second zone at home',
        recommendation: 'A basic playard or bassinet-included model is usually enough.',
      },
      {
        condition: 'need a real travel setup',
        recommendation: 'Choose a lighter travel-friendly playard on purpose.',
      },
      {
        condition: 'want an early-month downstairs station doing several jobs',
        recommendation: 'A bassinet or changer attachment model can earn its keep.',
      },
      {
        condition: 'have limited space and hate bulky extras',
        recommendation: 'Pick the simplest footprint that still handles the main use well.',
      },
    ],
  },
  swings: {
    slug: 'swings',
    title: 'Swings',
    description: 'Motion-based soothing gear that can help, but only when it fits the real room and the real baby.',
    icon: 'road',
    heroEyebrow: 'Daily Use Gear',
    heroImageSrc: '/assets/editorial/teddy-glow.png',
    heroImageAlt: 'Editorial soothing and home support image for calm baby routines.',
    orientation: [
      'A swing can be helpful.',
      "It can also become the world's most expensive opinionated chair. So let's be selective.",
    ],
    whatItDoes: {
      description: 'A swing gives some babies soothing motion during awake time, which can be genuinely helpful if the seat fits the room and the baby actually likes the motion.',
      intro: [
        'This is one of the most baby-specific categories in the whole gear conversation. Some babies love swings. Some barely tolerate them. The gear does not know that before it arrives.',
        'That is why the category works best when you stay practical about footprint, timing, and how much of your routine really needs motion support.',
      ],
      supportPoints: [
        'Automated soothing for babies who respond well to motion.',
        'A temporary hands-free option during awake time.',
        'A support tool when the routine benefits from a little more motion than a basic bouncer offers.',
      ],
      calloutBody: 'Start with two questions: do you have room for it, and are you comfortable owning a seat your baby may or may not care about deeply.',
      whatThisIs: 'A motion tool, not a guaranteed fix and not a replacement for safe sleep setup.',
      whyItExists: 'Because for the right baby and the right room, motion can be genuinely helpful. The key phrase there is the right.',
    },
    typesDescription: 'Most swing choices come down to footprint, motion variety, and whether you want one job done simply or several done somewhat.',
    types: [
      'Full-size swings: Better when you want stronger motion options and have room to spare.',
      'Compact portable swings: Easier in smaller homes where the seat cannot become permanent furniture.',
      'Multi-motion swings: More settings and directions of motion when you want to test a few soothing styles.',
      'Swing-bouncer combos: A mixed setup for families who want one seat to cover more than one kind of use.',
    ],
    whatActuallyMattersDescription: 'This is where the room size and the babys actual preferences matter more than the feature list.',
    whatActuallyMatters: [
      'Footprint, because swings get big fast.',
      'Weight and age range so you understand how long the useful window may be.',
      'Plug-in versus battery use if the swing will run often.',
      'Noise level and ease of cleaning when the seat lives in your main space.',
      'Whether you are comfortable treating this as a maybe-helpful tool instead of a guaranteed hero product.',
    ],
    commonMistakesDescription: 'Most swing disappointment comes from assuming the category can promise more than it really can.',
    commonMistakes: [
      'Assuming every baby will love a swing because the reviews sounded deeply certain.',
      'Buying the biggest model before checking whether the room can carry it gracefully.',
      'Using it as a sleep workaround instead of an awake-time support tool.',
      'Paying for app features and settings that do not change the main question of whether the seat will actually be used.',
    ],
    howToChooseDescription: 'The best swing is the one that fits the space and the routine without asking you to believe in miracles.',
    howToChoose: [
      {
        condition: 'want the strongest soothing options and space is not tight',
        recommendation: 'A full-size or multi-motion swing usually makes the most sense.',
      },
      {
        condition: 'need something smaller that can live in a tighter room',
        recommendation: 'Choose a compact portable swing.',
      },
      {
        condition: 'want one seat that covers both simple bouncing and motion support',
        recommendation: 'A swing-bouncer combo is the cleaner middle ground.',
      },
      {
        condition: 'are not sure your baby will care about a swing at all',
        recommendation: 'Wait, borrow, or stay conservative before buying the biggest version.',
      },
    ],
  },
};

export function getDailyUseGearCategory(slug: DailyUseGearCategorySlug) {
  return DAILY_USE_GEAR_CATEGORIES[slug];
}

export function getDailyUseGearCategoryCards(): GuideHubLink[] {
  return CATEGORY_ORDER.map((slug) => {
    const category = DAILY_USE_GEAR_CATEGORIES[slug];

    return {
      title: category.title,
      description: category.description,
      href: getDailyUseGearCategoryPath(category.slug),
      icon: category.icon,
      imageSrc: category.heroImageSrc,
      imageAlt: category.heroImageAlt,
    };
  });
}

export const DAILY_USE_GEAR_HUB_DECISION_ITEMS: DailyUseGearHubDecisionItem[] = [
  {
    condition: 'need your hands back while baby still wants closeness',
    recommendation: 'Start with Baby Carriers.',
    href: getDailyUseGearCategoryPath('carriers'),
  },
  {
    condition: 'can already see solids and table time entering the routine',
    recommendation: 'Open Highchairs first.',
    href: getDailyUseGearCategoryPath('highchairs'),
  },
  {
    condition: 'mostly need help with bath setup and handling',
    recommendation: 'Go to Baby Bath.',
    href: getDailyUseGearCategoryPath('baby-bath'),
  },
  {
    condition: 'need a safe place to set baby down for awake time',
    recommendation: 'Compare Bouncers first, then Swings if motion support still feels necessary.',
    href: getDailyUseGearCategoryPath('bouncers'),
  },
  {
    condition: 'need a second sleep or play zone more than another seat',
    recommendation: 'Start with Pack & Play.',
    href: getDailyUseGearCategoryPath('pack-and-play'),
  },
];

export const DAILY_USE_GEAR_HUB_NEXT_STEPS: DailyUseGearNextStep[] = [
  {
    label: 'Back: Travel With Baby',
    href: '/learn/gear/travel-systems',
    description: 'Use Travel first if leaving the house still feels harder than the at-home routine.',
    stage: 'Compare',
  },
  {
    label: 'Book a Consultation',
    href: '/consultation',
    description: 'Once the daily-use gear is clearer, get help turning the calmer plan into the actual shortlist.',
    stage: 'Refine',
  },
];

export function getDailyUseGearNextStep(slug: DailyUseGearCategorySlug): DailyUseGearNextStep {
  const currentIndex = CATEGORY_ORDER.indexOf(slug);
  const nextSlug = CATEGORY_ORDER[currentIndex + 1];

  if (!nextSlug) {
    return {
      label: 'Book a Consultation',
      href: '/consultation',
      description: 'You reached the end of the lane. This is the right point to turn the clearer daily-use plan into real buying decisions.',
      stage: 'Refine',
    };
  }

  const nextCategory = DAILY_USE_GEAR_CATEGORIES[nextSlug];

  return {
    label: nextCategory.title,
    href: getDailyUseGearCategoryPath(nextSlug),
    description: `Continue into ${nextCategory.title.toLowerCase()} while the everyday-routine logic is still fresh.`,
    stage: 'Refine',
  };
}

export function getDailyUseGearNextStepLinks(slug: DailyUseGearCategorySlug): DailyUseGearNextStep[] {
  return [
    getDailyUseGearNextStep(slug),
    {
      label: 'Back to Daily Use Gear',
      href: DAILY_USE_GEAR_HUB_PATH,
      description: 'Step back to the lane overview if another daily-use category is the better next move.',
      stage: 'Start',
    },
  ];
}
