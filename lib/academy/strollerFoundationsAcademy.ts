import type { ModuleLayoutData } from '@/components/academy/ModuleLayout';
import type { AcademyModuleHubCard } from '@/components/academy/AcademyModuleHub';
import {
  STROLLER_CATEGORY_GUIDE_SLUGS,
  type StrollerCategoryGuideSlug,
} from '@/lib/guides/strollerCluster';
import {
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
} from '@/lib/guides/strollerAcademy';
import { getStrollerSystemCategory } from '@/lib/guides/strollerSystem';

export const STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH = '/academy/gear/stroller-foundations' as const;

export const STROLLER_FOUNDATIONS_ACADEMY_TITLE = 'Stroller Foundations';
export const STROLLER_FOUNDATIONS_ACADEMY_DECK = 'Not all strollers are built for the same life.';

export const STROLLER_FOUNDATIONS_ACADEMY_INTRO = [
  'Stroller shopping gets dramatically easier once you stop asking which stroller is best and start asking what job the stroller actually has.',
  'Some strollers are built for real weekly mileage. Some are built for easier storage, easier lifts, and quicker exits. Some are built for travel. Some are built for siblings. Those are not the same assignment with different cup holders.',
  'This module exists to sort the lanes first so the shortlist can get smaller for the right reason.',
] as const;

export const STROLLER_FOUNDATIONS_ACADEMY_PULL_QUOTE =
  'The best stroller is not the one with the most features. It is the one that behaves well in your actual week.';

export const STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS = [
  'How the main stroller lanes differ before product comparison muddies the question.',
  'Which routines usually point toward full-size, compact, travel, convertible, double, or jogging.',
  'What most parents do not realize until later: fold behavior, storage, and route friction matter more than showroom charm.',
  'How to compare the lane beside yours when two categories still feel close.',
  'Why the calmer stroller answer usually gets more specific, not more expensive.',
] as const;

export const STROLLER_FOUNDATIONS_ACADEMY_PHILOSOPHY = [
  'Strollers get marketed like universal solutions when they are really workflow tools. That is why the category gets noisy so fast. Every model starts auditioning for a life it was never actually built to support.',
  'TMBC looks at stroller decisions in lanes because that is what keeps the question honest. Once the lane is right, the product comparison becomes much less theatrical and much more useful.',
] as const;

export const STROLLER_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE = [
  'Start with your route.',
  'Then your storage.',
  'Then the person who has to fold it most.',
  'That order usually tells the truth faster than the features page.',
] as const;

export const STROLLER_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS: AcademyModuleHubCard[] = [
  {
    href: '/academy/gear/how-to-think-about-baby-gear',
    title: 'How to Think About Baby Gear',
    description:
      'Go back one step if you want the wider TMBC framework for judging baby gear by fit before category details take over.',
    ctaLabel: 'Review previous module ->',
    eyebrow: 'Previous Gear Module',
  },
  {
    href: '/academy/gear/car-seat-foundations',
    title: 'Car Seat Foundations',
    description:
      'Continue the gear path into infant, convertible, all-in-one, rotating, booster, and travel-lightweight car seat decisions.',
    ctaLabel: 'Continue to next module ->',
    eyebrow: 'Next Gear Module',
  },
];

const SECTION_IMAGES = {
  fit: {
    src: '/assets/editorial/strollers.png',
    alt: 'Editorial stroller planning image.',
    caption: 'The lane usually matters more than the model ranking.',
  },
  tradeoff: {
    src: '/assets/editorial/stroller-folds.jpg',
    alt: 'Stroller fold and storage editorial image.',
    caption: 'The right stroller should feel honest in the trunk, the hallway, and the tired part of the week.',
  },
  test: {
    src: '/assets/editorial/editorialstroller.png',
    alt: 'Parent moving through daily life with baby gear.',
    caption: 'Real-life friction usually shows itself within a few practical questions.',
  },
  compare: {
    src: '/assets/editorial/fullsize.png',
    alt: 'Editorial stroller comparison image.',
    caption: 'Comparison only helps once the neighboring lanes are actually solving a similar job.',
  },
} as const;

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function buildTestParagraphs(lane: NonNullable<ReturnType<typeof getStrollerAcademyLane>>) {
  return lane.testSections.flatMap((section) => [
    `${section.title}: ${section.items.map((item) => item.label).join('; ')}.`,
  ]);
}

function buildProductExamples(lane: NonNullable<ReturnType<typeof getStrollerAcademyLane>>) {
  return lane.productExamples.slice(0, 3).map((product) => ({
    name: product.productName ?? product.name,
    brand: product.brand ?? '',
    description:
      product.shortReview?.trim() ||
      product.bestFor?.trim() ||
      'A helpful stroller example for this lane.',
    pros:
      product.pros && product.pros.length > 0
        ? product.pros.slice(0, 3)
        : product.notes && product.notes.length > 0
          ? product.notes.slice(0, 3)
          : ['A useful example for understanding this lane.'],
    affiliateUrl: product.affiliateUrl ?? null,
    category: STROLLER_FOUNDATIONS_ACADEMY_TITLE,
    imageSrc: product.imageSrc ?? null,
    imageAlt: product.imageAlt ?? null,
  }));
}

export function getStrollerFoundationsAcademySubmodulePath(slug: StrollerCategoryGuideSlug) {
  return `${STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}/${slug}` as const;
}

export function isStrollerFoundationsAcademySubmoduleSlug(value: string): value is StrollerCategoryGuideSlug {
  return STROLLER_CATEGORY_GUIDE_SLUGS.includes(value as StrollerCategoryGuideSlug);
}

export function getStrollerFoundationsAcademySubmoduleCards(): AcademyModuleHubCard[] {
  return getStrollerAcademyLanes().map((lane) => ({
    href: getStrollerFoundationsAcademySubmodulePath(lane.slug),
    title: lane.title,
    description: lane.definition,
    ctaLabel: 'Explore lane ->',
    eyebrow: 'Stroller Lane',
  }));
}

export function buildStrollerFoundationsAcademySubmoduleModule(
  slug: StrollerCategoryGuideSlug,
): ModuleLayoutData {
  const lane = getStrollerAcademyLane(slug);
  const laneCards = getStrollerAcademyLanes();
  const laneIndex = laneCards.findIndex((entry) => entry.slug === slug);
  const category = getStrollerSystemCategory(slug);

  if (!lane || !category || laneIndex < 0) {
    throw new Error(`Missing stroller academy lane for "${slug}".`);
  }

  const previousLane = laneIndex > 0 ? laneCards[laneIndex - 1] ?? null : null;
  const nextLane = laneIndex < laneCards.length - 1 ? laneCards[laneIndex + 1] ?? null : null;
  const compareCards = lane.compareAgainst
    .map((candidateSlug) => getStrollerAcademyLane(candidateSlug))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
    .slice(0, 2);

  return {
    slug,
    pathSlug: 'gear',
    href: getStrollerFoundationsAcademySubmodulePath(slug),
    title: lane.title,
    description: lane.definition,
    subhead: lane.heroDescription,
    intro: uniqueItems(
      [lane.definition, lane.worksForSummary, lane.signatureMoment, lane.everydayFeel],
      3,
    ),
    imagePath: category.imageSrc,
    imageAlt: category.imageAlt,
    progress: {
      current: laneIndex + 1,
      total: laneCards.length,
    },
    coreSections: [
      {
        title: 'What this lane is really solving',
        paragraphs: uniqueItems(
          [lane.definition, lane.whyExists, `Best for: ${lane.bestFor}`],
          3,
        ),
        imageSrc: category.imageSrc,
        imageAlt: category.imageAlt,
        imageCaption: lane.signatureMoment,
      },
      {
        title: 'When it tends to feel right',
        paragraphs: uniqueItems([lane.worksForSummary, ...lane.worksForBullets], 5),
        imageSrc: SECTION_IMAGES.fit.src,
        imageAlt: SECTION_IMAGES.fit.alt,
        imageCaption: SECTION_IMAGES.fit.caption,
      },
      {
        title: 'Where people talk themselves into the wrong fit',
        paragraphs: uniqueItems([lane.notBestFitSummary, ...lane.notBestFitBullets], 5),
        imageSrc: SECTION_IMAGES.tradeoff.src,
        imageAlt: SECTION_IMAGES.tradeoff.alt,
        imageCaption: SECTION_IMAGES.tradeoff.caption,
      },
      {
        title: 'What to pressure-test before you buy',
        paragraphs: uniqueItems(buildTestParagraphs(lane), 4),
        imageSrc: SECTION_IMAGES.test.src,
        imageAlt: SECTION_IMAGES.test.alt,
        imageCaption: SECTION_IMAGES.test.caption,
      },
      {
        title: 'What to compare it against if the answer still feels close',
        paragraphs: uniqueItems(
          [
            lane.compareNote,
            ...compareCards.map((card) => `${card.title}: ${card.definition}`),
          ],
          3,
        ),
        imageSrc: SECTION_IMAGES.compare.src,
        imageAlt: SECTION_IMAGES.compare.alt,
        imageCaption: SECTION_IMAGES.compare.caption,
      },
    ],
    decisionTitle: 'What This Means For You',
    decisionBullets: uniqueItems(
      [...lane.worksForBullets, ...lane.notBestFitBullets, lane.buyNote],
      5,
    ),
    products: buildProductExamples(lane),
    softCtaLabel: 'TMBC note',
    softCtaTitle: 'The calmer stroller answer is usually the one that survives the fold test.',
    softCtaBody: [lane.buyNote],
    previous: previousLane
      ? {
          href: getStrollerFoundationsAcademySubmodulePath(previousLane.slug),
          title: previousLane.title,
          description: previousLane.definition,
          ctaLabel: 'Previous lane ->',
        }
      : {
          href: STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
          title: STROLLER_FOUNDATIONS_ACADEMY_TITLE,
          description: 'Return to the stroller hub if you want the wider lane map again.',
          ctaLabel: 'Back to hub ->',
        },
    next: nextLane
      ? {
          href: getStrollerFoundationsAcademySubmodulePath(nextLane.slug),
          title: nextLane.title,
          description: nextLane.definition,
          ctaLabel: 'Next lane ->',
        }
      : {
          href: '/academy/gear/car-seat-foundations',
          title: 'Car Seat Foundations',
          description: 'Continue the Gear path into car seat categories once the stroller lane feels clearer.',
          ctaLabel: 'Continue gear path ->',
        },
    related: compareCards[0]
      ? {
          href: getStrollerFoundationsAcademySubmodulePath(compareCards[0].slug),
          title: compareCards[0].title,
          description: compareCards[0].definition,
          ctaLabel: 'Compare nearby lane ->',
        }
      : {
          href: STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
          title: STROLLER_FOUNDATIONS_ACADEMY_TITLE,
          description: 'Return to the hub to compare the stroller lanes side by side.',
          ctaLabel: 'Back to hub ->',
        },
    submoduleSection: compareCards.length
      ? {
          title: 'Compare Nearby Stroller Lanes',
          description:
            'Open the lane beside yours when two answers still feel close. That usually clears the question up faster than another hour of browsing.',
          cards: compareCards.map((card) => ({
            href: getStrollerFoundationsAcademySubmodulePath(card.slug),
            title: card.title,
            description: card.definition,
            ctaLabel: 'Compare lane ->',
            eyebrow: 'Nearby Lane',
          })),
        }
      : null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: 'Gear', href: '/academy/gear' },
      { label: STROLLER_FOUNDATIONS_ACADEMY_TITLE, href: STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH },
      { label: lane.title },
    ],
  };
}
