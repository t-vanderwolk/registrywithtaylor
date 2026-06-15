import type { ModuleLayoutData } from '@/components/academy/ModuleLayout';
import type { AcademyModuleHubCard } from '@/components/academy/AcademyModuleHub';
import {
  CAR_SEAT_CATEGORY_GUIDE_SLUGS,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import {
  getCarSeatAcademyLane,
  getCarSeatAcademyLanes,
} from '@/lib/guides/carSeatAcademy';
import { getCarSeatCategory } from '@/lib/guides/carSeatSystem';

export const CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH = '/academy/gear/car-seat-foundations' as const;

export const CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE = 'Car Seat Foundations';
export const CAR_SEAT_FOUNDATIONS_ACADEMY_DECK = 'Safety is the baseline. Fit is what matters next.';

export const CAR_SEAT_FOUNDATIONS_ACADEMY_INTRO = [
  'Car seats feel high stakes because they are. They also get much louder than they need to because stage, vehicle fit, installation reality, and convenience all get discussed at once.',
  'The calmer way through is to sort the category first. Infant, convertible, all-in-one, booster, rotating, and travel-lightweight seats are not competing for the exact same job.',
  'This module helps you name the job first so the safer everyday fit becomes much easier to see.',
] as const;

export const CAR_SEAT_FOUNDATIONS_ACADEMY_PULL_QUOTE =
  'A better car seat decision usually starts with the right category, not the loudest convenience feature.';

export const CAR_SEAT_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS = [
  'How each main car seat category fits a different stage, routine, or convenience question.',
  'What most parents do not realize until later: install confidence and vehicle fit matter just as much as headline features.',
  'When infant seats are genuinely helpful and when a longer-run installed seat may be the calmer answer.',
  'How rotating and travel-lightweight seats solve narrower jobs than the marketing sometimes suggests.',
  'Why the right category usually shrinks the shortlist faster than another round of reviews.',
] as const;

export const CAR_SEAT_FOUNDATIONS_ACADEMY_PHILOSOPHY = [
  'TMBC treats car seats like a fit question, not a panic contest. Safety is the non-negotiable baseline. After that, the conversation becomes about stage, vehicle reality, install confidence, and how the seat behaves in your actual week.',
  'The category matters because it keeps convenience honest. A feature can sound brilliant and still be solving a problem you do not really have. The right lane gets quieter. The wrong one usually needs more persuasion.',
] as const;

export const CAR_SEAT_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE = [
  'Start with the stage.',
  'Then your vehicle.',
  'Then the loading routine you will repeat most.',
  'That is usually enough to make the category less dramatic.',
] as const;

export const CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS: AcademyModuleHubCard[] = [
  {
    href: '/academy/gear/stroller-foundations',
    title: 'Stroller Foundations',
    description:
      'Go back one step if the stroller lane is still affecting the car seat conversation more than it should.',
    ctaLabel: 'Review previous module ->',
    eyebrow: 'Previous Gear Module',
  },
  {
    href: '/academy/gear/travel-systems',
    title: 'Travel Systems',
    description:
      'Continue the Gear path into stroller and infant seat compatibility once the car seat category feels cleaner.',
    ctaLabel: 'Continue to next module ->',
    eyebrow: 'Next Gear Module',
  },
];

const SECTION_IMAGES = {
  test: {
    src: '/assets/car-seats/piparx.png',
    alt: 'Parent moving through daily life with confidence.',
    caption: 'Good fit should feel steadier in daily use, not just smarter in theory.',
  },
} as const;

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function buildTestParagraphs(lane: NonNullable<ReturnType<typeof getCarSeatAcademyLane>>) {
  return lane.testSections.flatMap((section) => [
    `${section.title}: ${section.items.map((item) => item.label).join('; ')}.`,
  ]);
}

function buildProductExamples(lane: NonNullable<ReturnType<typeof getCarSeatAcademyLane>>) {
  return lane.productExamples.slice(0, 3).map((product) => ({
    name: product.productName || 'Car seat example',
    brand: product.brand ?? '',
    description:
      product.shortReview?.trim() ||
      product.bestFor?.trim() ||
      'A helpful car seat example for this category.',
    pros:
      product.pros && product.pros.length > 0
        ? product.pros.slice(0, 3)
        : product.notes && product.notes.length > 0
          ? product.notes.slice(0, 3)
          : ['A useful example for understanding this category.'],
    affiliateUrl: product.affiliateLinks[0]?.url ?? null,
    category: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
    imageSrc: product.imageUrl ?? null,
    imageAlt: product.imageAlt ?? null,
  }));
}

export function getCarSeatFoundationsAcademySubmodulePath(slug: CarSeatCategoryGuideSlug) {
  return `${CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH}/${slug}` as const;
}

export function isCarSeatFoundationsAcademySubmoduleSlug(value: string): value is CarSeatCategoryGuideSlug {
  return CAR_SEAT_CATEGORY_GUIDE_SLUGS.includes(value as CarSeatCategoryGuideSlug);
}

export function getCarSeatFoundationsAcademySubmoduleCards(): AcademyModuleHubCard[] {
  return getCarSeatAcademyLanes().map((lane) => ({
    href: getCarSeatFoundationsAcademySubmodulePath(lane.slug),
    title: lane.title,
    description: lane.definition,
    ctaLabel: 'Explore category ->',
    eyebrow: 'Car Seat Category',
  }));
}

export function buildCarSeatFoundationsAcademySubmoduleModule(
  slug: CarSeatCategoryGuideSlug,
): ModuleLayoutData {
  const lane = getCarSeatAcademyLane(slug);
  const laneCards = getCarSeatAcademyLanes();
  const laneIndex = laneCards.findIndex((entry) => entry.slug === slug);
  const category = getCarSeatCategory(slug);

  if (!lane || !category || laneIndex < 0) {
    throw new Error(`Missing car seat academy category for "${slug}".`);
  }

  const previousLane = laneIndex > 0 ? laneCards[laneIndex - 1] ?? null : null;
  const nextLane = laneIndex < laneCards.length - 1 ? laneCards[laneIndex + 1] ?? null : null;
  const compareCards = lane.compareAgainst
    .map((candidateSlug) => getCarSeatAcademyLane(candidateSlug))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
    .slice(0, 2);

  return {
    slug,
    pathSlug: 'gear',
    href: getCarSeatFoundationsAcademySubmodulePath(slug),
    title: lane.title,
    description: lane.definition,
    subhead: lane.heroDescription,
    intro: uniqueItems(
      [lane.definition, lane.worksForSummary, lane.signatureMoment, lane.everydayFeel],
      3,
    ),
    imagePath: category.imageSrc ?? '/assets/editorial/gear.jpg',
    imageAlt: category.imageAlt ?? lane.title,
    progress: {
      current: laneIndex + 1,
      total: laneCards.length,
    },
    coreSections: [
      {
        title: 'What this category is really solving',
        paragraphs: uniqueItems(
          [lane.definition, `Best for: ${lane.bestFor}`, lane.expertTip],
          3,
        ),
        imageSrc: category.imageSrc ?? '/assets/editorial/gear.jpg',
        imageAlt: category.imageAlt ?? lane.title,
        imageCaption: lane.signatureMoment,
      },
      {
        title: 'When it tends to feel right',
        paragraphs: uniqueItems([lane.worksForSummary, ...lane.worksForBullets], 5),
      },
      {
        title: 'Where it gets over-assigned',
        paragraphs: uniqueItems([lane.notBestFitSummary, ...lane.notBestFitBullets], 5),
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
      },
    ],
    decisionTitle: 'What This Means For You',
    decisionBullets: uniqueItems(
      [...lane.worksForBullets, ...lane.notBestFitBullets, lane.buyNote],
      5,
    ),
    products: buildProductExamples(lane),
    softCtaLabel: 'TMBC note',
    softCtaTitle: 'The calmer car seat answer is the one you can picture using correctly on an ordinary day.',
    softCtaBody: [lane.buyNote],
    previous: previousLane
      ? {
          href: getCarSeatFoundationsAcademySubmodulePath(previousLane.slug),
          title: previousLane.title,
          description: previousLane.definition,
          ctaLabel: 'Previous category ->',
        }
      : {
          href: CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
          title: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
          description: 'Return to the car seat hub if you want the wider category map again.',
          ctaLabel: 'Back to hub ->',
        },
    next: nextLane
      ? {
          href: getCarSeatFoundationsAcademySubmodulePath(nextLane.slug),
          title: nextLane.title,
          description: nextLane.definition,
          ctaLabel: 'Next category ->',
        }
      : {
          href: '/academy/gear/travel-systems',
          title: 'Travel Systems',
          description: 'Continue the Gear path into compatibility once the car seat category is clear.',
          ctaLabel: 'Continue gear path ->',
        },
    related: compareCards[0]
      ? {
          href: getCarSeatFoundationsAcademySubmodulePath(compareCards[0].slug),
          title: compareCards[0].title,
          description: compareCards[0].definition,
          ctaLabel: 'Compare nearby category ->',
        }
      : {
          href: CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
          title: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
          description: 'Return to the hub to compare the categories side by side.',
          ctaLabel: 'Back to hub ->',
        },
    submoduleSection: compareCards.length
      ? {
          title: 'Compare Nearby Car Seat Categories',
          description:
            'Open the category beside yours when two answers still feel close. That usually gets clearer faster than another round of feature sorting.',
          cards: compareCards.map((card) => ({
            href: getCarSeatFoundationsAcademySubmodulePath(card.slug),
            title: card.title,
            description: card.definition,
            ctaLabel: 'Compare category ->',
            eyebrow: 'Nearby Category',
          })),
        }
      : null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: 'Gear', href: '/academy/gear' },
      { label: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE, href: CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH },
      { label: lane.title },
    ],
  };
}
