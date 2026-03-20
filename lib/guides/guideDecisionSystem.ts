import { getCarSeatProductExamples } from '@/lib/data/products/carSeats';
import { getStrollerProductExamples } from '@/lib/data/products/strollers';
import {
  CAR_SEAT_HUB_FIT_CHECK,
  CAR_SEAT_SYSTEM_GUIDE_SLUGS,
  getCarSeatCategory,
  getCarSeatComparisonBandGroups,
  getCarSeatContextStripData,
  getCarSeatHubStartingPointCards,
  getCarSeatSpecializedGuideLinks,
} from '@/lib/guides/carSeatSystem';
import { getStrollerCategoryGuideConfig, getStrollerRelatedGuideCards } from '@/lib/guides/strollerCluster';
import type { GuideComparisonBandGroup, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import {
  STROLLER_SYSTEM_GUIDE_SLUGS,
  getStrollerComparisonBandGroups,
  getStrollerContextStripData,
  getStrollerHubStartingPointCards,
  getStrollerSystemCategory,
} from '@/lib/guides/strollerSystem';
import { getCarSeatCategoryGuideConfig, isCarSeatCategoryGuideSlug } from '@/lib/guides/carSeatCategoryGuides';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';

type DecisionLink = {
  label: string;
  href: string;
};

type DecisionBlockConfig = {
  title: string;
  description: string;
  fitSummary: string;
  fitBullets: readonly string[];
  notFitSummary: string;
  notFitBullets: readonly string[];
  signatureMoment?: string | null;
  decisionLinks?: DecisionLink[];
};

type CategoryStartCard = {
  eyebrow: string;
  text: string;
};

type DecisionContext = {
  breadcrumb: readonly string[];
  currentLabel: string;
  compareLabel: string;
  compareHref: string;
  compareCtaLabel: string;
  hubLabel: string;
  hubHref: string;
  hubCtaLabel: string;
};

type ProductExampleGroupConfig = {
  id: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  examples: GuideProductExampleData[];
};

export type DecisionHubPageConfig = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    stats: Array<{ label: string; value: string }>;
    highlights: Array<{ label: string; text: string }>;
  };
  decisionCards: {
    eyebrow: string;
    title: string;
    description: string;
    cards: GuideHubLink[];
  };
  categoryGrid: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<GuideHubLink & { tradeoff?: string }>;
  };
  fitCheck: DecisionBlockConfig;
  comparison: {
    title: string;
    description: string;
    groups: GuideComparisonBandGroup[];
  };
  productExamples: {
    title: string;
    description: string;
    groups: ProductExampleGroupConfig[];
  };
  continueExploring: {
    title: string;
    description: string;
    links: GuideHubLink[];
  };
  softCta: {
    title: string;
    description: string;
  };
};

export type DecisionCategoryPageConfig = {
  heroEyebrow: string;
  heroDescription: string;
  startPanel: {
    startDescription: string;
    questionTitle: string;
    summaryCards: CategoryStartCard[];
  };
  context: DecisionContext;
  fitCheck: DecisionBlockConfig;
  comparison: {
    title: string;
    description: string;
    groups: GuideComparisonBandGroup[];
  };
  productExamples: {
    title: string;
    description: string;
    groups: ProductExampleGroupConfig[];
  };
  continueExploring: {
    title: string;
    description: string;
    links: GuideHubLink[];
  };
  softCta: {
    title: string;
    description: string;
  };
};

function normalizeStrollerContext(slug: string): DecisionContext | null {
  const context = getStrollerContextStripData(slug);
  if (!context) {
    return null;
  }

  return {
    breadcrumb: context.breadcrumb,
    currentLabel: context.currentLabel,
    compareLabel: context.compareLabel,
    compareHref: context.compareHref,
    compareCtaLabel: 'Explore this neighboring lane ->',
    hubLabel: 'Stroller Hub',
    hubHref: context.hubHref,
    hubCtaLabel: 'Return to the stroller map ->',
  };
}

function normalizeCarSeatContext(slug: string): DecisionContext | null {
  const context = getCarSeatContextStripData(slug);
  if (!context) {
    return null;
  }

  return {
    breadcrumb: context.breadcrumb,
    currentLabel: context.currentLabel,
    compareLabel: context.compareLabel,
    compareHref: context.compareHref,
    compareCtaLabel: 'Compare this stage next ->',
    hubLabel: 'Car Seat Hub',
    hubHref: context.hubHref,
    hubCtaLabel: 'Return to the car seat map ->',
  };
}

function getStrollerDecisionLinks(slug: string): DecisionLink[] {
  switch (slug) {
    case 'full-size-modular-strollers':
      return [
        { label: 'If this feels too big, explore compact ->', href: getGuidePath({ slug: 'compact-lightweight-strollers' }) },
        { label: 'If you are planning ahead, explore convertible ->', href: getGuidePath({ slug: 'convertible-strollers' }) },
      ];
    case 'compact-lightweight-strollers':
      return [
        { label: 'If this still feels too big, explore travel ->', href: getGuidePath({ slug: 'travel-strollers' }) },
        { label: 'If you want more daily comfort, explore full size ->', href: getGuidePath({ slug: 'full-size-modular-strollers' }) },
      ];
    case 'travel-strollers':
      return [
        { label: 'If this feels too minimal, explore compact ->', href: getGuidePath({ slug: 'compact-lightweight-strollers' }) },
        { label: 'If the destination matters more, explore full size ->', href: getGuidePath({ slug: 'full-size-modular-strollers' }) },
      ];
    case 'convertible-strollers':
      return [
        { label: 'If you need two seats now, explore double ->', href: getGuidePath({ slug: 'double-strollers' }) },
        { label: 'If future planning feels too vague, explore full size ->', href: getGuidePath({ slug: 'full-size-modular-strollers' }) },
      ];
    case 'double-strollers':
      return [
        { label: 'If you are still planning ahead, explore convertible ->', href: getGuidePath({ slug: 'convertible-strollers' }) },
        { label: 'If one child usually rides, explore compact ->', href: getGuidePath({ slug: 'compact-lightweight-strollers' }) },
      ];
    case 'jogging-all-terrain-strollers':
      return [
        { label: 'If you need less stroller indoors, explore compact ->', href: getGuidePath({ slug: 'compact-lightweight-strollers' }) },
        { label: 'If rough routes are occasional, explore full size ->', href: getGuidePath({ slug: 'full-size-modular-strollers' }) },
      ];
    default:
      return [];
  }
}

function getCarSeatDecisionLinks(slug: string): DecisionLink[] {
  switch (slug) {
    case 'infant-car-seats':
      return [
        { label: 'If you are planning ahead, explore convertible ->', href: getGuidePath({ slug: 'convertible-car-seats' }) },
        { label: 'If longevity matters most, explore all-in-one ->', href: getGuidePath({ slug: 'all-in-one-car-seats' }) },
      ];
    case 'convertible-car-seats':
      return [
        { label: 'If you still want newborn portability, explore infant ->', href: getGuidePath({ slug: 'infant-car-seats' }) },
        { label: 'If you want the longest runway, explore all-in-one ->', href: getGuidePath({ slug: 'all-in-one-car-seats' }) },
      ];
    case 'all-in-one-car-seats':
      return [
        { label: 'If you want a simpler installed seat, explore convertible ->', href: getGuidePath({ slug: 'convertible-car-seats' }) },
        { label: 'If portability matters first, explore infant ->', href: getGuidePath({ slug: 'infant-car-seats' }) },
      ];
    case 'booster-seats':
      return [
        { label: 'If you are still choosing a first seat, return to the hub ->', href: getGuidePath({ slug: 'best-infant-car-seats' }) },
        { label: 'If you are comparing long-run seats, explore all-in-one ->', href: getGuidePath({ slug: 'all-in-one-car-seats' }) },
      ];
    case 'rotating-car-seats':
      return [
        { label: 'If you need stage clarity first, explore convertible ->', href: getGuidePath({ slug: 'convertible-car-seats' }) },
        { label: 'If you want the newborn lane, explore infant ->', href: getGuidePath({ slug: 'infant-car-seats' }) },
      ];
    case 'travel-lightweight-car-seats':
      return [
        { label: 'If this seat will stay in one main car, explore convertible ->', href: getGuidePath({ slug: 'convertible-car-seats' }) },
        { label: 'If you want newborn carry convenience, explore infant ->', href: getGuidePath({ slug: 'infant-car-seats' }) },
      ];
    default:
      return [];
  }
}

function getCarSeatProductGroupKey(slug: string) {
  switch (slug) {
    case 'infant-car-seats':
      return 'infant';
    case 'convertible-car-seats':
      return 'convertible';
    case 'all-in-one-car-seats':
      return 'allInOne';
    case 'booster-seats':
      return 'booster';
    case 'rotating-car-seats':
      return 'rotating';
    case 'travel-lightweight-car-seats':
      return 'travelLightweight';
    default:
      return null;
  }
}

function buildStrollerHubCategoryCards() {
  return STROLLER_SYSTEM_GUIDE_SLUGS.map((slug) => {
    const category = getStrollerSystemCategory(slug);
    if (!category) {
      return null;
    }

    return {
      title: category.title,
      description: category.lifestyleDescriptor,
      bestFor: category.bestFor,
      tradeoff: category.tradeoff,
      href: category.href,
      icon: category.icon,
      imageSrc: category.imageSrc,
      imageAlt: category.imageAlt,
    };
  }).filter((card): card is NonNullable<typeof card> => Boolean(card));
}

function buildStrollerHubProductGroups(): ProductExampleGroupConfig[] {
  return ['full-size-modular-strollers', 'compact-lightweight-strollers', 'travel-strollers'].flatMap((slug) => {
    const category = getStrollerSystemCategory(slug);
    if (!category) {
      return [];
    }

    return [
      {
        id: slug,
        title: category.title,
        description: category.bestFor,
        href: category.href,
        ctaLabel: `Open ${category.shortTitle}`,
        examples: getStrollerProductExamples(slug).slice(0, 3),
      },
    ];
  });
}

function buildCarSeatHubProductGroups(): ProductExampleGroupConfig[] {
  return CAR_SEAT_SYSTEM_GUIDE_SLUGS.filter((slug) => slug !== 'booster-seats').flatMap((slug) => {
    const category = getCarSeatCategory(slug);
    const productGroupKey = getCarSeatProductGroupKey(slug);
    if (!category || !productGroupKey) {
      return [];
    }

    return [
      {
        id: slug,
        title: category.title,
        description: category.bestFor,
        href: category.href,
        ctaLabel: `Open ${category.shortTitle}`,
        examples: getCarSeatProductExamples(productGroupKey).slice(0, 3),
      },
    ];
  });
}

function buildCarSeatHubCategoryCards() {
  return CAR_SEAT_SYSTEM_GUIDE_SLUGS.flatMap((slug) => {
    const category = getCarSeatCategory(slug);
    if (!category) {
      return [];
    }

    return [
      {
        title: category.title,
        description: category.lifestyleDescriptor,
        bestFor: category.bestFor,
        tradeoff: category.tradeoff,
        href: category.href,
        icon: category.icon,
        imageSrc: category.imageSrc,
        imageAlt: category.imageAlt,
      },
    ];
  });
}

export function getDecisionHubPageConfig(slug: string): DecisionHubPageConfig | null {
  if (slug === 'best-strollers') {
    const comparisonGroups = getStrollerComparisonBandGroups('');

    return {
      hero: {
        eyebrow: 'TMBC Guided Decision System',
        title: 'Find the stroller lane that actually fits your week.',
        description:
          'This is not a pile of stroller pages. It is a calmer starting system built to help you move from broad category confusion into the next clear decision.',
        note: 'The right stroller should feel easier to live with, not more impressive on paper.',
        stats: [
          { label: 'Starting points', value: '4' },
          { label: 'Core stroller lanes', value: '6' },
          { label: 'Goal', value: 'More clarity, fewer tabs' },
        ],
        highlights: [
          { label: 'What this solves', text: 'It helps you choose the category first so the model comparison gets dramatically easier.' },
          { label: 'What to ignore', text: 'You do not need to begin with brand prestige, feature stacks, or a showroom-performance fantasy.' },
          { label: 'What comes next', text: 'Once the right lane clicks, each sub-guide keeps moving you forward instead of back into browsing.' },
        ],
      },
      decisionCards: {
        eyebrow: 'Find Your Stroller Starting Point',
        title: 'Start with the friction you actually feel.',
        description:
          'The fastest way to narrow the stroller category is to name the job first: everyday use, easier storage, true travel, or planning ahead for more than one child.',
        cards: getStrollerHubStartingPointCards(),
      },
      categoryGrid: {
        eyebrow: 'Stroller categories',
        title: 'See the full stroller map before you compare specific models.',
        description:
          'Each category solves a different version of daily life. Start there, then let the deeper guide take over.',
        cards: buildStrollerHubCategoryCards(),
      },
      fitCheck: {
        title: 'Use the category as the fit check, not the brand.',
        description:
          'Most stroller regret starts when parents compare premium features before they confirm which lane actually matches the week they are trying to make easier.',
        fitSummary: 'This guide is for you if stroller shopping keeps feeling larger than it should.',
        fitBullets: [
          'You are still deciding between full-size, compact, travel, or planning-ahead categories.',
          'You want a calmer system that narrows the lane before the model shortlist begins.',
          'You care more about daily use than buying the stroller that sounds the most premium on paper.',
        ],
        notFitSummary: 'This may not be your best fit if the category is already clear and you only need a shortlist next.',
        notFitBullets: [
          'You already know the stroller type and want model-level comparisons now.',
          'Your question is about one exact stroller rather than which lane fits your life.',
          'You need a product shortlist more than category clarity.',
        ],
        signatureMoment: 'The right stroller should feel easier to live with, not more impressive on paper.',
      },
      comparison: {
        title: 'Compare the primary stroller lanes first, then the specialty ones.',
        description:
          'Start with full size, compact, and travel. Then move into convertible, double, or jogging only if the first decision actually points you there.',
        groups: [
          { label: 'Primary stroller lanes', items: comparisonGroups.core.map((item) => ({ ...item, id: item.slug })) },
          { label: 'Secondary stroller lanes', items: comparisonGroups.secondary.map((item) => ({ ...item, id: item.slug })) },
        ],
      },
      productExamples: {
        title: 'A few real-world examples so the categories feel concrete.',
        description:
          'These are not shopping pushes. They are category anchors to help you see what each stroller lane looks like once it leaves the abstract.',
        groups: buildStrollerHubProductGroups(),
      },
      continueExploring: {
        title: 'Need the more specialized stroller lanes next?',
        description:
          'Once the primary choice is clearer, these are usually the next reads that help parents pressure-test family-growth, two-seat, or rough-route questions.',
        links: buildStrollerHubCategoryCards()
          .filter((card) => ['Convertible', 'Double', 'Jogging'].includes(card.title))
          .map(({ tradeoff, ...card }) => card),
      },
      softCta: {
        title: 'Want stroller guidance matched to your actual week?',
        description:
          'The stroller decision gets much easier once someone helps you weigh route, storage, travel, and what the fold really needs to do in your life.',
      },
    };
  }

  if (slug === 'best-infant-car-seats') {
    return {
      hero: {
        eyebrow: 'TMBC Guided Decision System',
        title: 'Find the car seat starting point that fits your real life.',
        description:
          'This is a stage-based decision system for parents who want a calmer way to sort infant, convertible, all-in-one, and booster paths before feature lists take over.',
        note: 'The safest car seat is the one that fits your child, your car, and your real life.',
        stats: [
          { label: 'Starting points', value: '3' },
          { label: 'Core categories', value: '4' },
          { label: 'Specialty guides', value: '2' },
        ],
        highlights: [
          { label: 'What this solves', text: 'It helps you identify the right stage first so the seat comparison becomes a much smaller question.' },
          { label: 'What to ignore', text: 'You do not need to start with the flashiest features or the seat that sounds longest-lasting in theory.' },
          { label: 'What comes next', text: 'Each category guide keeps walking you forward with comparisons, fit checks, and the next logical branch.' },
        ],
      },
      decisionCards: {
        eyebrow: 'Find Your Starting Point',
        title: 'Begin with the stage you are actually solving.',
        description:
          'For most parents, the calmer path is deciding whether you need newborn portability, a stay-installed seat, or the longest runway from the start.',
        cards: getCarSeatHubStartingPointCards(),
      },
      categoryGrid: {
        eyebrow: 'Car seat categories',
        title: 'See the core category map before the model map.',
        description:
          'Each lane solves a different stage problem. Once that stage is clear, the shortlist gets noticeably simpler.',
        cards: buildCarSeatHubCategoryCards(),
      },
      fitCheck: {
        ...CAR_SEAT_HUB_FIT_CHECK,
      },
      comparison: {
        title: 'Compare the main starting paths first.',
        description:
          'Infant, convertible, and all-in-one are the primary starting decision. Booster is the later stage to understand, not the newborn question to solve first.',
        groups: getCarSeatComparisonBandGroups(),
      },
      productExamples: {
        title: 'A few category examples so the stages feel more real.',
        description:
          'These examples are here to make the lanes easier to picture. They are not a push to buy the seat with the loudest feature list.',
        groups: buildCarSeatHubProductGroups(),
      },
      continueExploring: {
        title: 'Need the specialty paths after the main stage decision?',
        description:
          'These are the next guides when the real question becomes swivel convenience, travel portability, or understanding the later booster chapter.',
        links: [
          {
            title: 'Booster Guide',
            description: 'Helpful once you want the later-stage picture without confusing it with the newborn decision.',
            bestFor: 'Families mapping the longer car seat journey, not just the first purchase.',
            href: getGuidePath({ slug: 'booster-seats' }),
            icon: 'shield',
          },
          ...getCarSeatSpecializedGuideLinks(),
        ],
      },
      softCta: {
        title: 'Want help matching the right seat to your actual routine?',
        description:
          'The car seat decision gets clearer when someone helps you weigh stage, vehicle fit, loading habits, and what your family will really use every day.',
      },
    };
  }

  return null;
}

export function getDecisionCategoryPageConfig(slug: string): DecisionCategoryPageConfig | null {
  const strollerCategory = getStrollerSystemCategory(slug);
  if (strollerCategory) {
    const guideConfig = getStrollerCategoryGuideConfig(slug);
    const context = normalizeStrollerContext(slug);
    if (!guideConfig || !context) {
      return null;
    }

    const comparisonGroups = getStrollerComparisonBandGroups(slug);

    return {
      heroEyebrow: 'Stroller Category Guide',
      heroDescription: guideConfig.heroDescription,
      startPanel: {
        startDescription:
          `Use this page to decide whether the ${strollerCategory.shortTitle.toLowerCase()} lane actually solves the version of stroller friction you are living with before you compare models.`,
        questionTitle: `Is ${strollerCategory.shortTitle.toLowerCase()} the category that fits your real routine?`,
        summaryCards: [
          { eyebrow: 'Lane feel', text: strollerCategory.emotionalDescriptor },
          { eyebrow: 'Best for', text: strollerCategory.bestFor },
          { eyebrow: 'Tradeoff', text: strollerCategory.tradeoff },
        ],
      },
      context,
      fitCheck: {
        title: `Use ${strollerCategory.shortTitle} as a fit check`,
        description:
          'The fastest way to narrow this category is to decide whether the core tradeoff actually helps your real week, not just the version of parent life you hope to buy for.',
        fitSummary: guideConfig.worksForSummary,
        fitBullets: guideConfig.worksForBullets,
        notFitSummary: guideConfig.notBestFitSummary,
        notFitBullets: guideConfig.notBestFitBullets,
        signatureMoment: guideConfig.signatureMoment,
        decisionLinks: getStrollerDecisionLinks(slug),
      },
      comparison: {
        title: 'Compare this stroller lane with the surrounding options.',
        description:
          'The best next move is usually comparing the adjacent lane, not opening a completely different product rabbit hole.',
        groups: [
          { label: 'Primary stroller lanes', items: comparisonGroups.core.map((item) => ({ ...item, id: item.slug })) },
          { label: 'Secondary stroller lanes', items: comparisonGroups.secondary.map((item) => ({ ...item, id: item.slug })) },
        ],
      },
      productExamples: {
        title: `Examples in the ${strollerCategory.shortTitle} lane`,
        description:
          'These examples are here to make the category feel tangible. They are not a shopping command.',
        groups: [
          {
            id: slug,
            title: strollerCategory.title,
            description: strollerCategory.bestFor,
            examples: getStrollerProductExamples(slug).slice(0, 3),
          },
        ],
      },
      continueExploring: {
        title: 'Continue exploring the surrounding stroller lanes.',
        description:
          'If this category feels close but not quite right, the answer is usually in the next neighboring stroller lane rather than in another brand tab.',
        links: getStrollerRelatedGuideCards(slug),
      },
      softCta: {
        title: 'Want stroller advice matched to your actual week?',
        description:
          `The ${strollerCategory.shortTitle.toLowerCase()} decision gets much easier once someone helps you weigh route, storage, travel, and what the fold needs to do in your life.`,
      },
    };
  }

  if (isCarSeatCategoryGuideSlug(slug)) {
    const category = getCarSeatCategory(slug);
    const guideConfig = getCarSeatCategoryGuideConfig(slug);
    const context = normalizeCarSeatContext(slug);
    const productGroupKey = getCarSeatProductGroupKey(slug);
    if (!category || !guideConfig || !context || !productGroupKey) {
      return null;
    }

    return {
      heroEyebrow: 'Car Seat Category Guide',
      heroDescription: guideConfig.heroDescription,
      startPanel: {
        startDescription:
          `Use this page to decide whether the ${category.shortTitle.toLowerCase()} lane actually matches your stage, your vehicle, and the routine you are trying to make easier.`,
        questionTitle: `Is ${category.shortTitle.toLowerCase()} the right starting lane for your family?`,
        summaryCards: [
          { eyebrow: 'Lane feel', text: category.emotionalDescriptor },
          { eyebrow: 'Best for', text: category.bestFor },
          { eyebrow: 'Tradeoff', text: category.tradeoff },
        ],
      },
      context,
      fitCheck: {
        ...guideConfig.fitCheck,
        decisionLinks: getCarSeatDecisionLinks(slug),
      },
      comparison: {
        title: 'Compare this car seat stage with the surrounding paths.',
        description:
          'When a category feels close but not quite right, the cleanest next move is usually comparing the adjacent stage rather than chasing more feature copy.',
        groups: getCarSeatComparisonBandGroups(slug),
      },
      productExamples: {
        title: `Examples in the ${category.shortTitle} lane`,
        description:
          'These examples help the category feel concrete without turning the page into a storefront.',
        groups: [
          {
            id: slug,
            title: category.title,
            description: category.bestFor,
            examples: getCarSeatProductExamples(productGroupKey).slice(0, 3),
          },
        ],
      },
      continueExploring: guideConfig.continueExploring,
      softCta: {
        title: 'Want help matching the right seat to your actual routine?',
        description:
          `The ${category.shortTitle.toLowerCase()} decision gets much easier once someone helps you weigh stage, car fit, loading habits, and how long the seat truly needs to work.`,
      },
    };
  }

  return null;
}
