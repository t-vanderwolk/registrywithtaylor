import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import {
  CAR_SEAT_CATEGORY_GUIDE_SLUGS,
  getCarSeatCategoryGuideConfig,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import { getCarSeatCategory } from '@/lib/guides/carSeatSystem';
import type { AcademyChecklistSection } from '@/lib/guides/strollerAcademy';

type CarSeatGuideConfig = NonNullable<ReturnType<typeof getCarSeatCategoryGuideConfig>>;
type CarSeatPlannerScenario = CarSeatGuideConfig['planner']['scenarios'][number];
type CarSeatPriorityLens = CarSeatGuideConfig['planner']['priorityLenses'][number];
type CarSeatProductExample = CarSeatGuideConfig['productExamples'][number];

type CarSeatAcademyLesson = {
  title: string;
  body: string;
};

export type CarSeatAcademyLane = {
  slug: CarSeatCategoryGuideSlug;
  title: string;
  shortTitle: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc: string | null;
  imageAlt: string;
  definition: string;
  heroDescription: string;
  bestFor: string;
  tradeoff: string;
  everydayFeel: string;
  expertTip: string;
  signatureMoment: string;
  worksForSummary: string;
  worksForBullets: string[];
  notBestFitSummary: string;
  notBestFitBullets: string[];
  compareAgainst: CarSeatCategoryGuideSlug[];
  compareNote: string;
  lessons: CarSeatAcademyLesson[];
  testSections: AcademyChecklistSection[];
  buyNote: string;
  productExamples: CarSeatProductExample[];
};

const CAR_SEAT_GUIDE_PATH_BY_SLUG = Object.fromEntries(
  CAR_SEAT_CATEGORY_GUIDE_SLUGS.map((slug) => [slug, getGuidePath({ slug })]),
) as Record<CarSeatCategoryGuideSlug, string>;

const BUY_NOTE_BY_SLUG: Record<CarSeatCategoryGuideSlug, string> = {
  'infant-car-seats':
    'Choose infant because the newborn stage actually needs the portability, not because the carrier look has good PR.',
  'convertible-car-seats':
    'Choose convertible when you want one strong installed seat from the start, not because the shorter infant stage feels philosophically offensive.',
  'all-in-one-car-seats':
    'Buy the broadest runway only if you truly want the broadest runway now. Extra seat is still extra seat.',
  'booster-seats':
    'Booster is the right answer when the child is truly at booster stage, not when the category simply sounds simpler from a distance.',
  'rotating-car-seats':
    'Rotation earns its keep when the stage is right and the loading routine keeps asking for the swivel, not when the demo just looks convincing.',
  'travel-lightweight-car-seats':
    'Lightweight only matters when the seat keeps moving with you. A seat that mostly lives in one car does not need a travel identity for sport.',
};

function toneToChecklistStatus(tone: CarSeatPlannerScenario['fitTone'] | CarSeatPriorityLens['tone']) {
  switch (tone) {
    case 'yes':
      return 'check' as const;
    case 'no':
      return 'watch' as const;
    case 'maybe':
    default:
      return 'ask' as const;
  }
}

function resolveCarSeatSlugFromHref(href: string) {
  const normalizedHref = href.split('#')[0] ?? href;

  return (
    CAR_SEAT_CATEGORY_GUIDE_SLUGS.find((slug) => CAR_SEAT_GUIDE_PATH_BY_SLUG[slug] === normalizedHref) ?? null
  );
}

function joinTitles(titles: string[]) {
  if (titles.length <= 1) {
    return titles[0] ?? '';
  }

  if (titles.length === 2) {
    return `${titles[0]} and ${titles[1]}`;
  }

  return `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`;
}

function buildCompareAgainst(slug: CarSeatCategoryGuideSlug, config: CarSeatGuideConfig) {
  const compareSlugs = new Set<CarSeatCategoryGuideSlug>();
  const primaryCompare = resolveCarSeatSlugFromHref(config.context.compareHref);

  if (primaryCompare && primaryCompare !== slug) {
    compareSlugs.add(primaryCompare);
  }

  config.continueExploring.links.forEach((link) => {
    const relatedSlug = resolveCarSeatSlugFromHref(link.href);
    if (relatedSlug && relatedSlug !== slug) {
      compareSlugs.add(relatedSlug);
    }
  });

  return Array.from(compareSlugs).slice(0, 2);
}

function buildCompareNote(title: string, compareTitles: string[]) {
  if (compareTitles.length === 0) {
    return 'Use the stage and the everyday routine to keep this category grounded before the features start acting louder than the fit.';
  }

  return `Compare ${title} against ${joinTitles(compareTitles)} when the lanes still feel close. The goal is not to crown a winner. It is to name the actual job the seat is being asked to do.`;
}

function buildTestSections(config: CarSeatGuideConfig, shortTitle: string): AcademyChecklistSection[] {
  return [
    {
      title: `Pressure-test ${shortTitle} in your routine`,
      description: 'These situations usually tell the truth faster than a product page does.',
      items: config.planner.scenarios.slice(0, 4).map((scenario) => ({
        label: scenario.label,
        detail: scenario.summary,
        status: toneToChecklistStatus(scenario.fitTone),
      })),
    },
    {
      title: 'Ask before you commit',
      description: 'Use these lenses to keep convenience language and long-range promises honest.',
      items: config.planner.priorityLenses.slice(0, 4).map((lens) => ({
        label: lens.label,
        detail: lens.watchout,
        status: 'ask' as const,
      })),
    },
  ];
}

function buildLane(slug: CarSeatCategoryGuideSlug): CarSeatAcademyLane {
  const config = getCarSeatCategoryGuideConfig(slug);
  const category = getCarSeatCategory(slug);

  if (!config || !category) {
    throw new Error(`Missing car seat academy config for "${slug}".`);
  }

  const href = CAR_SEAT_GUIDE_PATH_BY_SLUG[slug];
  const compareAgainst = buildCompareAgainst(slug, config);
  const compareTitles = compareAgainst.map((candidateSlug) => getCarSeatCategory(candidateSlug)?.title ?? candidateSlug);

  return {
    slug,
    title: category.title,
    shortTitle: category.shortTitle,
    href,
    icon: category.icon,
    imageSrc: category.imageSrc ?? null,
    imageAlt: category.imageAlt,
    definition: category.lifestyleDescriptor,
    heroDescription: config.heroDescription,
    bestFor: category.bestFor,
    tradeoff: category.tradeoff,
    everydayFeel: category.emotionalDescriptor,
    expertTip: config.planner.description,
    signatureMoment: config.fitCheck.signatureMoment,
    worksForSummary: config.fitCheck.fitSummary,
    worksForBullets: [...config.fitCheck.fitBullets],
    notBestFitSummary: config.fitCheck.notFitSummary,
    notBestFitBullets: [...config.fitCheck.notFitBullets],
    compareAgainst,
    compareNote: buildCompareNote(category.title, compareTitles),
    lessons: config.startPanel.summaryCards.map((card) => ({
      title: card.eyebrow,
      body: card.text,
    })),
    testSections: buildTestSections(config, category.shortTitle),
    buyNote: BUY_NOTE_BY_SLUG[slug],
    productExamples: config.productExamples,
  };
}

export const CAR_SEAT_ACADEMY_LANES = CAR_SEAT_CATEGORY_GUIDE_SLUGS.map((slug) => buildLane(slug));

export const CAR_SEAT_ACADEMY_LANES_BY_SLUG = Object.fromEntries(
  CAR_SEAT_ACADEMY_LANES.map((lane) => [lane.slug, lane]),
) as Record<CarSeatCategoryGuideSlug, CarSeatAcademyLane>;

export function getCarSeatAcademyLanes() {
  return CAR_SEAT_ACADEMY_LANES;
}

export function getCarSeatAcademyLane(slug: string) {
  if (!(slug in CAR_SEAT_ACADEMY_LANES_BY_SLUG)) {
    return null;
  }

  return CAR_SEAT_ACADEMY_LANES_BY_SLUG[slug as CarSeatCategoryGuideSlug];
}

export function getCarSeatAcademyCategoryCards(): GuideHubLink[] {
  return CAR_SEAT_ACADEMY_LANES.map((lane) => ({
    title: lane.title,
    description: lane.definition,
    bestFor: lane.bestFor,
    href: lane.href,
    icon: lane.icon,
    imageSrc: lane.imageSrc ?? undefined,
    imageAlt: lane.imageAlt,
  }));
}
