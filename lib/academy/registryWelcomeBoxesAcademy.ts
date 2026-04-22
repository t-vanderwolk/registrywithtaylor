import type { AcademyModuleHubCard } from '@/components/academy/AcademyModuleHub';
import type { ModuleLayoutData } from '@/components/academy/ModuleLayout';
import { REGISTRY_PATH_IMAGES } from '@/lib/academy/registryModules';

export const REGISTRY_WELCOME_BOXES_HUB_PATH = '/academy/registry/welcome-boxes-perks' as const;
export const REGISTRY_WELCOME_BOXES_TITLE = 'Welcome Boxes & Registry Perks';
export const REGISTRY_WELCOME_BOXES_DECK =
  'The part everyone talks about - but almost no one uses strategically.';

export type RegistryWelcomeBoxesSubmoduleSlug =
  | 'target'
  | 'babylist'
  | 'amazon'
  | 'macrobaby';

type RegistryWelcomeBoxesSubmoduleDefinition = {
  slug: RegistryWelcomeBoxesSubmoduleSlug;
  order: number;
  title: string;
  cardSummary: string;
  metadataDescription: string;
  deck: string;
  intro: string[];
  heroImageSrc: string;
  heroImageAlt: string;
  coreSections: ModuleLayoutData['coreSections'];
  decisionBullets: string[];
  note: {
    eyebrow: string;
    title: string;
    body: string;
  };
};

const SUBMODULE_ORDER: RegistryWelcomeBoxesSubmoduleSlug[] = ['target', 'babylist', 'amazon', 'macrobaby'];

export const REGISTRY_WELCOME_BOXES_HUB_INTRO = [
  'Most people hear "welcome box" and think: free stuff.',
  'And yes, technically, that is true.',
  'But what most people miss is this:',
  "Each one tells you how the retailer wants you to shop, what brands they prioritize, how their registry system is structured, and what perks are actually worth your time.",
] as const;

export const REGISTRY_WELCOME_BOXES_PULL_QUOTE =
  "Welcome boxes aren't just freebies. They're signals of how each registry platform actually works.";

export const REGISTRY_WELCOME_BOXES_LEARNING_HIGHLIGHTS = [
  'How to qualify for each major welcome box without turning the process into administrative theater.',
  'Which registries are actually worth setting up and which perks are mainly decorative.',
  'How to layer perks across platforms without making the registry harder for guests or for yourself.',
  'How to use welcome boxes as information and testing support instead of as proof you need more products.',
  'How to avoid wasting time chasing offers that sound exciting but do not really improve the plan.',
] as const;

export const REGISTRY_WELCOME_BOXES_STRATEGY = [
  'Welcome boxes are useful when they help you understand the platform behind them. The smartest move is not collecting every possible box. It is noticing what each one reveals about returns, requirements, guest experience, and how much friction the retailer adds to the process.',
  'That is why TMBC treats perks as strategy, not scavenger hunt. A strong setup usually layers the platforms that do different jobs well instead of asking one registry to be elegant, flexible, easy for guests, and magically perfect at everything.',
] as const;

export const REGISTRY_WELCOME_BOXES_GUIDANCE_LINES = [
  'Target -> ease + guest experience',
  'Babylist -> flexibility',
  'Amazon -> convenience',
  'MacroBaby -> expertise',
] as const;

export const REGISTRY_WELCOME_BOXES_NEXT_LINKS: AcademyModuleHubCard[] = [
  {
    href: '/academy/registry/shop-local-get-support',
    title: 'Shop Local & Hybrid Support',
    description:
      'Continue into support, store strategy, and the guidance layer that helps the big registry choices feel less isolating.',
    ctaLabel: 'Continue ->',
    eyebrow: 'Next Step',
  },
  {
    href: '/academy/registry',
    title: 'Registry Path',
    description:
      'Go back to the full Registry path if you want the wider sequence before opening another module.',
    ctaLabel: 'Back ->',
    eyebrow: 'Back',
  },
];

const REGISTRY_WELCOME_BOXES_SUBMODULES: Record<
  RegistryWelcomeBoxesSubmoduleSlug,
  RegistryWelcomeBoxesSubmoduleDefinition
> = {
  target: {
    slug: 'target',
    order: 1,
    title: 'Target Welcome Kit',
    cardSummary: 'The easiest entry point - and one of the most consistently useful.',
    metadataDescription:
      'Use the TMBC Target Welcome Kit submodule to understand qualification, value, and why Target often works well as a registry anchor.',
    deck: 'The easiest entry point - and one of the most consistently useful.',
    intro: [
      'Target is where a lot of registries begin. And honestly, that makes sense.',
      "It's familiar. It's guest-friendly. And the welcome kit is one of the easiest perks to actually use.",
      'That combination matters because a welcome box only helps if the platform around it is still practical once the samples stop being exciting.',
    ],
    heroImageSrc: REGISTRY_PATH_IMAGES.welcomeBox,
    heroImageAlt: 'Target-style welcome box and registry perks editorial image.',
    coreSections: [
      {
        title: 'What it is',
        paragraphs: [
          'Target offers a free welcome kit when you create a baby registry.',
          'It typically includes sample-size baby products, bottles or pacifiers, wipes or diapers, plus coupons and registry perks.',
          'Target often positions the value around $100+, though contents vary and the exact mix shifts over time.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.insideWelcomeBox,
        imageAlt: 'Welcome box samples and baby essentials arranged editorially.',
        imageCaption: 'The real value is usually less about the headline number and more about what you can test before buying more.',
      },
      {
        title: 'How to qualify',
        paragraphs: [
          'Create a Target Baby Registry and add a few items so the account is active and usable.',
          'Visit a Target store, head to Guest Services, and ask for the welcome kit while showing your registry barcode or the app.',
          'No purchase is required, but availability varies by location and the kit is typically in-store pickup only.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.openingWelcomeBox,
        imageAlt: 'Registry checklist and welcome box qualification steps.',
        imageCaption: 'Simple requirements are part of why this perk tends to be worth the effort.',
      },
      {
        title: 'Why it matters',
        paragraphs: [
          'Target is a strong registry anchor because it is familiar to guests, accessible nationwide, and generally easy to shop.',
          'That matters more than people expect. A registry perk feels better when the platform itself is easy to use for gifting, returns, and later buying.',
          'The kit is useful, but the bigger signal is that Target tends to keep the overall registry experience straightforward.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Guest-friendly gifting and registry planning setup.',
        imageCaption: 'Perks matter more when the guest experience stays easy too.',
      },
      {
        title: 'TMBC take',
        paragraphs: [
          'Start here. Not because it is perfect. Because it is simple, reliable, and guest-friendly.',
          'If you want one easy public registry to anchor the plan while you layer in other tools more selectively, Target often earns that role well.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Registry planning notes with an edited, strategic setup.',
        imageCaption: 'Simple and useful is a very respectable registry strategy.',
      },
      {
        title: 'Best for',
        paragraphs: [
          'Parents who want an easy starting point and a registry that does not need a long explanation for guests.',
          'Families who care about accessible stores, easier returns, and a perk that does not require much administrative stamina.',
          'Anyone who wants the registry to feel calm before it feels clever.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Calm registry setup for practical planning decisions.',
        imageCaption: 'Target works best when ease and familiarity are part of the goal.',
      },
    ],
    decisionBullets: [
      'Target is usually worth setting up because the platform itself is practical.',
      'The welcome kit is easy to claim compared with many other perks.',
      'Use Target as an anchor if guest experience and simplicity matter most.',
      'Availability varies by store, so treat the kit as a bonus, not a guarantee.',
    ],
    note: {
      eyebrow: 'Pull quote',
      title: "Target isn't trying to impress you. It's trying to make your registry easy.",
      body: 'That is exactly why it often works well as the practical backbone of a layered registry strategy.',
    },
  },
  babylist: {
    slug: 'babylist',
    order: 2,
    title: 'Babylist Hello Baby Box',
    cardSummary: 'The most flexible - but requires a little intention.',
    metadataDescription:
      'Use the TMBC Babylist Hello Baby Box submodule to understand qualification, flexibility, and when Babylist is worth the extra friction.',
    deck: 'The most flexible - but requires a little intention.',
    intro: [
      'Babylist is the platform people turn to when they want more freedom.',
      'And that flexibility can be incredibly useful. It just comes with slightly more friction than a traditional single-retailer registry.',
      'The box only makes sense in context of that larger tradeoff.',
    ],
    heroImageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
    heroImageAlt: 'Babylist-style hybrid registry planning editorial image.',
    coreSections: [
      {
        title: 'What it is',
        paragraphs: [
          'The Hello Baby Box is a curated sample box that often includes premium brand samples, bottles or feeding items, and other baby care essentials.',
          'It usually feels more brand-mix driven than store driven, which fits the Babylist model overall.',
          'The box is not the point of Babylist. It is a side benefit of choosing a platform built around flexibility.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.insideWelcomeBox,
        imageAlt: 'Curated premium-style welcome box samples.',
        imageCaption: 'Babylist tends to make more sense when flexibility is the main goal and the box is a bonus.',
      },
      {
        title: 'How to qualify',
        paragraphs: [
          'Create a Babylist registry and add items across categories so the registry is actually built out.',
          'Make a qualifying purchase from the Babylist Shop, usually around the $10+ mark, then pay shipping for the box.',
          'This is not fully free, which is exactly why it is worth asking whether the platform itself is already useful to you.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.openingWelcomeBox,
        imageAlt: 'Registry action steps and qualification tracking for Babylist.',
        imageCaption: 'The extra purchase and shipping step are the tradeoff for the Babylist setup.',
      },
      {
        title: 'Why it matters',
        paragraphs: [
          'Babylist is a universal registry, which means you can pull products from multiple retailers and organize them in one place.',
          'That flexibility is often the real value. The box just happens to be attached to a platform that solves a broader registry problem for many parents.',
          'If your registry lives across stores and specialty brands, Babylist can make the whole system easier to edit and easier to explain.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.whereToRegister,
        imageAlt: 'Universal registry planning image for layered retailer decisions.',
        imageCaption: 'Babylist shines when the registry really does need to pull from different places.',
      },
      {
        title: 'TMBC take',
        paragraphs: [
          'Worth it if you want cross-retailer flexibility and are already building a hybrid registry.',
          'Less worth it if you only care about fully free perks. If the box is the only reason you are opening Babylist, the answer is usually no.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.hybridSupport,
        imageAlt: 'Couple planning registry strategy together.',
        imageCaption: 'Use Babylist because the system fits, not because the box exists.',
      },
      {
        title: 'What to watch for',
        paragraphs: [
          'There is usually a purchase requirement.',
          'You pay shipping, which changes the value calculation quickly if you were only chasing a freebie.',
          'Some guests find Babylist slightly more complex than a single-store registry, so the flexibility comes with a small usability tradeoff.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.overwhelm,
        imageAlt: 'Slightly more complex registry planning workflow.',
        imageCaption: 'Flexibility is useful. It is not friction-free.',
      },
    ],
    decisionBullets: [
      'Use Babylist when you actually need cross-retailer flexibility.',
      'Do not open it just for the box if you do not want the extra setup.',
      'The perk matters less than the platform logic behind it.',
      'Treat the purchase and shipping requirements as part of the real cost.',
    ],
    note: {
      eyebrow: 'Pull quote',
      title: "Babylist isn't about perks. It's about flexibility.",
      body: 'If that flexibility matters to your registry, the box feels useful. If it does not, the perk alone usually is not enough.',
    },
  },
  amazon: {
    slug: 'amazon',
    order: 3,
    title: 'Amazon Welcome Box',
    cardSummary: 'Convenient, fast, and familiar - but not the most curated.',
    metadataDescription:
      'Use the TMBC Amazon Welcome Box submodule to understand qualification, convenience, and where Amazon fits in a smarter registry strategy.',
    deck: 'Convenient, fast, and familiar - but not the most curated.',
    intro: [
      'Amazon excels at one thing: making things easy to order quickly.',
      'That can absolutely be useful in a registry. It just is not the same thing as thoughtful guidance.',
      'Amazon tends to win on convenience, not on helping you make the category smaller.',
    ],
    heroImageSrc: REGISTRY_PATH_IMAGES.openingWelcomeBox,
    heroImageAlt: 'Amazon-style fast and convenient registry editorial image.',
    coreSections: [
      {
        title: 'What it is',
        paragraphs: [
          'Amazon offers a welcome box that may include baby product samples, trial-size essentials, and occasional full-size items.',
          'The contents can be helpful, but the larger story is really about how Amazon structures its registry incentives.',
          'This is a convenience-led perk attached to a convenience-led platform.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.insideWelcomeBox,
        imageAlt: 'Sample products and essentials from a convenience-focused welcome box.',
        imageCaption: 'The box is fine. The bigger decision is what role Amazon should play in the registry at all.',
      },
      {
        title: 'How to qualify',
        paragraphs: [
          'Create an Amazon Baby Registry and add at least 10 items.',
          'Complete 60% of the registry checklist, spend $10+ from the registry, and be a Prime member.',
          'That set of requirements is more involved than it first sounds, especially if Amazon is not already central to how you plan to shop.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Checklist-driven qualification steps for Amazon registry perks.',
        imageCaption: 'Amazon rewards completion and volume more than curation.',
      },
      {
        title: 'Why it matters',
        paragraphs: [
          'Amazon offers convenience, fast shipping, easy ordering, and very broad availability.',
          'That makes it useful for fulfillment, smaller essentials, and later-stage cleanup purchases when speed matters.',
          'It is a strong logistics tool. That does not automatically make it a strong decision-making tool.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.smartBuying,
        imageAlt: 'Convenient ordering and practical fulfillment setup.',
        imageCaption: 'Amazon is often strongest after the plan is clear, not before.',
      },
      {
        title: 'TMBC take',
        paragraphs: [
          'Great for fulfillment and smaller essentials.',
          'Less ideal as the only place you build a thoughtful registry because speed is not the same thing as clarity.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.research,
        imageAlt: 'Registry research and edited purchasing decisions.',
        imageCaption: 'Amazon can support the strategy well. It rarely is the strategy by itself.',
      },
      {
        title: 'What to watch for',
        paragraphs: [
          'There is a Prime requirement.',
          'The checklist requirement adds friction if Amazon is not already a natural fit for your household.',
          'The overall experience is less curated, which means it helps most after you already know what you are looking for.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.overwhelm,
        imageAlt: 'Fast but less curated registry environment.',
        imageCaption: 'Speed is useful. It just does not replace guidance.',
      },
    ],
    decisionBullets: [
      'Use Amazon for convenience and easy fulfillment, not for category clarity.',
      'Check the Prime and checklist requirements before assuming the box is easy to unlock.',
      'Amazon works well as part of a layered setup.',
      'Let speed support the plan after the decision logic is already stronger.',
    ],
    note: {
      eyebrow: 'Pull quote',
      title: 'Amazon optimizes for speed. Not for clarity.',
      body: 'That is not automatically a criticism. It just tells you what job Amazon does best inside a registry strategy.',
    },
  },
  macrobaby: {
    slug: 'macrobaby',
    order: 4,
    title: 'MacroBaby Registry Gift Box',
    cardSummary: 'The most underrated - and often the most valuable.',
    metadataDescription:
      'Use the TMBC MacroBaby Registry Gift Box submodule to understand why independent baby stores can offer more context, not just more products.',
    deck: 'The most underrated - and often the most valuable.',
    intro: [
      'MacroBaby represents something different. Not just products. Context.',
      'And that matters more than people realize.',
      'Independent baby stores often change the registry experience because the guidance around the product is part of the value too.',
    ],
    heroImageSrc: REGISTRY_PATH_IMAGES.babyStore,
    heroImageAlt: 'Independent baby store and registry expertise editorial image.',
    coreSections: [
      {
        title: 'What it is',
        paragraphs: [
          'MacroBaby offers a registry gift box tied to its registry program, often with premium baby product samples, trusted brand inclusions, and more curated essentials.',
          'The exact offer can vary, which is common with specialty retailers and event-driven promotions.',
          'The gift box matters, but the bigger draw is the education-driven store environment around it.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.babyStore,
        imageAlt: 'Independent baby store gift box and curated essentials.',
        imageCaption: 'This is one of the few perk setups where the expertise around the box matters as much as the box itself.',
      },
      {
        title: 'How to qualify',
        paragraphs: [
          'Create a MacroBaby registry and add items so the registry is active.',
          'Qualification may involve in-store participation or current promotion requirements, so confirm the current offer directly with MacroBaby.',
          'That extra confirmation step is not a flaw. It is part of how independent-store perks tend to work.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.shopLocal,
        imageAlt: 'In-store registry support and specialty retailer consultation.',
        imageCaption: 'Independent retailers often attach perks to real engagement, not just account creation.',
      },
      {
        title: 'Why it matters',
        paragraphs: [
          'MacroBaby combines curated selection, independent retailer expertise, access to real baby gear specialists, and a hybrid in-store or virtual support model.',
          'That means the gift box is tied to a better decision-making environment, not just a better shipping system.',
          'If you have access to an independent baby store like this, the context can easily be worth more than a bigger but more generic perk elsewhere.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.expertGuidance,
        imageAlt: 'Expert-led baby gear guidance compared with generic recommendation culture.',
        imageCaption: 'Independent stores tend to change the conversation because real guidance is part of the experience.',
      },
      {
        title: 'TMBC take',
        paragraphs: [
          'This is one of the most valuable boxes if it is accessible to you.',
          'Not because it is necessarily the biggest. Because it is tied to a more education-driven retail experience, and that usually makes better registry decisions downstream.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.hybridSupport,
        imageAlt: 'Thoughtful registry planning with expert support.',
        imageCaption: 'The best perk is often the one attached to the strongest support.',
      },
      {
        title: 'Best for',
        paragraphs: [
          'Parents who have access to an independent baby store or are willing to use a specialty retailer for better guidance.',
          'Families who want expert context, product testing, and more curated support alongside the registry perks.',
          'Anyone who feels like a giant online platform is convenient but not especially clarifying.',
        ],
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Registry plan shaped by expertise and calmer support.',
        imageCaption: 'MacroBaby is strongest when guidance is part of what you are trying to buy.',
      },
    ],
    decisionBullets: [
      'Explore MacroBaby if you have access to it.',
      'Confirm the live promotion details directly because qualification can vary.',
      'The real value is the expertise tied to the registry, not just the samples.',
      'Independent baby stores are often worth more attention than they get.',
    ],
    note: {
      eyebrow: 'Callout',
      title: 'Independent baby stores do not just give you products. They give you context.',
      body: 'If you have access to an independent baby store like MacroBaby, always explore it.',
    },
  },
};

export function getRegistryWelcomeBoxesAcademySubmodulePath(slug: RegistryWelcomeBoxesSubmoduleSlug) {
  return `${REGISTRY_WELCOME_BOXES_HUB_PATH}/${slug}` as const;
}

export function isRegistryWelcomeBoxesAcademySubmoduleSlug(
  value: string,
): value is RegistryWelcomeBoxesSubmoduleSlug {
  return SUBMODULE_ORDER.includes(value as RegistryWelcomeBoxesSubmoduleSlug);
}

export function getRegistryWelcomeBoxesAcademySubmodule(slug: RegistryWelcomeBoxesSubmoduleSlug) {
  return REGISTRY_WELCOME_BOXES_SUBMODULES[slug];
}

export function getRegistryWelcomeBoxesAcademySubmoduleCards(): AcademyModuleHubCard[] {
  return SUBMODULE_ORDER.map((slug) => {
    const submodule = getRegistryWelcomeBoxesAcademySubmodule(slug);

    return {
      href: getRegistryWelcomeBoxesAcademySubmodulePath(slug),
      title: submodule.title,
      description: submodule.cardSummary,
      ctaLabel: 'Explore submodule',
      eyebrow: `Submodule ${submodule.order}`,
    };
  });
}

export function buildRegistryWelcomeBoxesAcademySubmoduleModule(
  slug: RegistryWelcomeBoxesSubmoduleSlug,
): ModuleLayoutData {
  const submodule = getRegistryWelcomeBoxesAcademySubmodule(slug);
  const navigation = getRegistryWelcomeBoxesAcademySubmoduleNavigation(slug);

  return {
    slug,
    pathSlug: 'registry',
    href: getRegistryWelcomeBoxesAcademySubmodulePath(slug),
    title: submodule.title,
    description: submodule.cardSummary,
    subhead: submodule.deck,
    intro: submodule.intro,
    imagePath: submodule.heroImageSrc,
    imageAlt: submodule.heroImageAlt,
    progress: {
      current: submodule.order,
      total: SUBMODULE_ORDER.length,
    },
    coreSections: submodule.coreSections,
    decisionTitle: 'Use This Box Strategically',
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
      { label: 'Registry', href: '/academy/registry' },
      { label: REGISTRY_WELCOME_BOXES_TITLE, href: REGISTRY_WELCOME_BOXES_HUB_PATH },
      { label: submodule.title },
    ],
  };
}

export function getRegistryWelcomeBoxesAcademySubmoduleNavigation(slug: RegistryWelcomeBoxesSubmoduleSlug) {
  const currentIndex = SUBMODULE_ORDER.indexOf(slug);
  const previousSlug = currentIndex > 0 ? SUBMODULE_ORDER[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < SUBMODULE_ORDER.length - 1 ? SUBMODULE_ORDER[currentIndex + 1] : null;

  return {
    previous: previousSlug
      ? {
          href: getRegistryWelcomeBoxesAcademySubmodulePath(previousSlug),
          title: getRegistryWelcomeBoxesAcademySubmodule(previousSlug).title,
          description: 'Go back one step inside Welcome Boxes & Registry Perks if that platform still needs the cleaner answer.',
          ctaLabel: 'Previous submodule ->',
          eyebrow: 'Previous',
        }
      : null,
    hub: {
      href: REGISTRY_WELCOME_BOXES_HUB_PATH,
      title: REGISTRY_WELCOME_BOXES_TITLE,
      description: 'Return to the full welcome boxes module map before opening another perk path.',
      ctaLabel: 'Back to hub ->',
      eyebrow: 'Hub',
    },
    next: nextSlug
      ? {
          href: getRegistryWelcomeBoxesAcademySubmodulePath(nextSlug),
          title: getRegistryWelcomeBoxesAcademySubmodule(nextSlug).title,
          description: 'Keep the perk strategy moving while the platform logic is still fresh.',
          ctaLabel: 'Next submodule ->',
          eyebrow: 'Next',
        }
      : {
          href: '/academy/registry/shop-local-get-support',
          title: 'Shop Local & Hybrid Support',
          description: 'Continue into the support layer once the perk logic is cleaner and the platform fit is easier to judge.',
          ctaLabel: 'Continue module journey ->',
          eyebrow: 'Next',
        },
  };
}
