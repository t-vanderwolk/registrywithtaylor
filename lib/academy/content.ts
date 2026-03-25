import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import {
  getNurseryAcademyModule,
  isNurseryAcademyModuleSlug,
  NURSERY_ACADEMY_MODULES,
  type NurseryAcademyModuleSlug,
} from '@/lib/academy/nurseryModules';
import { STROLLER_PRODUCT_GROUPS } from '@/lib/data/products/strollers';
import { stripMarkdown } from '@/lib/blog/contentText';
import {
  buildGuideOutline,
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideSection,
  type GuideSectionSubsection,
} from '@/lib/guides/articleOutline';
import { extractMarkdownListItems } from '@/lib/guides/guideFlow';
import { CAR_SEAT_PRODUCT_GROUPS } from '@/lib/guides/carSeatProductCatalog';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';

export type AcademyPathSlug = 'registry' | 'nursery' | 'gear' | 'postpartum';

export type AcademyModuleSlug =
  | 'registry-foundations'
  | NurseryAcademyModuleSlug
  | 'stroller-foundations'
  | 'travel-systems'
  | 'car-seat-basics'
  | 'recovery-and-support'
  | 'feeding-and-home-rhythm'
  | 'first-weeks-essentials';

export type AcademyBreadcrumbItem = {
  label: string;
  href?: string;
};

export type AcademyCoreSection = {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
};

export type AcademyProductExample = {
  name: string;
  brand: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
  category: string;
};

export type AcademyModuleCard = {
  slug: AcademyModuleSlug;
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export type AcademyRelatedLink = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export type AcademyPathData = {
  slug: AcademyPathSlug;
  href: string;
  title: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
  moduleCards: AcademyModuleCard[];
  breadcrumb: AcademyBreadcrumbItem[];
};

export type AcademyModuleData = {
  slug: AcademyModuleSlug;
  pathSlug: AcademyPathSlug;
  href: string;
  title: string;
  description: string;
  subhead: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
  progress: {
    current: number;
    total: number;
  };
  coreSections: AcademyCoreSection[];
  decisionTitle: string;
  decisionBullets: string[];
  products: AcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  previous: AcademyRelatedLink | null;
  next: AcademyRelatedLink | null;
  related: AcademyRelatedLink | null;
  breadcrumb: AcademyBreadcrumbItem[];
  trackingGuideId?: string | null;
};

export type AcademyHomePathCard = {
  slug: AcademyPathSlug;
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  imagePath: string;
  imageAlt: string;
};

export type AcademyHomeData = {
  title: string;
  description: string;
  explanationTitle: string;
  explanationBody: string;
  paths: AcademyHomePathCard[];
};

type AcademyPathDefinition = {
  title: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
};

type AcademyModuleDefinition = {
  pathSlug: AcademyPathSlug;
  title: string;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  relatedSlug: AcademyModuleSlug | null;
};

type AcademyModuleContent = {
  intro: string[];
  coreSections: AcademyCoreSection[];
  decisionBullets: string[];
  products: AcademyProductExample[];
  softCtaLabel?: string;
  softCtaTitle?: string;
  softCtaBody?: string[];
};

const GUIDE_FILES = {
  stroller: 'taylor-made-stroller-guide.md',
  compact: 'taylor-made-compact-lightweight-stroller-guide.md',
  travelStroller: 'taylor-made-travel-stroller-guide.md',
  travel: 'taylor-made-travel-with-baby-guide.md',
  registry: 'taylor-made-baby-registry-guide.md',
  nursery: 'taylor-made-nursery-guide.md',
  sleep: 'taylor-made-nursery-sleep-setup-guide.md',
  changing: 'taylor-made-changing-station-guide.md',
  storage: 'taylor-made-nursery-storage-guide.md',
  furniture: 'taylor-made-nursery-furniture-guide.md',
  carSeat: 'taylor-made-car-seat-guide.md',
  infantCarSeat: 'taylor-made-infant-car-seat-guide.md',
  convertibleCarSeat: 'taylor-made-convertible-car-seat-guide.md',
  allInOneCarSeat: 'taylor-made-all-in-one-car-seat-guide.md',
} as const;

const ACADEMY_PATH_ORDER: AcademyPathSlug[] = ['registry', 'nursery', 'gear', 'postpartum'];

const ACADEMY_PATH_MODULES: Record<AcademyPathSlug, AcademyModuleSlug[]> = {
  registry: ['registry-foundations'],
  nursery: NURSERY_ACADEMY_MODULES.map((module) => module.slug),
  gear: ['stroller-foundations', 'travel-systems', 'car-seat-basics'],
  postpartum: ['recovery-and-support', 'feeding-and-home-rhythm', 'first-weeks-essentials'],
};

const ACADEMY_PATH_DEFINITIONS: Record<AcademyPathSlug, AcademyPathDefinition> = {
  registry: {
    title: 'Registry',
    shortDescription: 'Start with what matters',
    heroTitle: 'Registry Path',
    heroDescription:
      'Build the list around systems, timing, and what actually supports life with a baby before the categories start multiplying.',
    intro: [
      'Registry planning usually gets easier once you stop treating it like a giant shopping assignment and start treating it like a household plan.',
      'This path starts with the life you are building, then helps you decide what belongs on the list now, what can wait, and what never needed prime registry real estate in the first place.',
    ],
    imagePath: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry planning editorial image for TMBC Baby Academy.',
  },
  nursery: {
    title: 'Nursery',
    shortDescription: 'Start with your space',
    heroTitle: 'Nursery Path',
    heroDescription:
      'Build the room around sleep, storage, and the route you will actually repeat when everyone is tired.',
    intro: [
      'Nursery planning works better when it starts as a working system, not a decorating sprint.',
      'This path moves from the big-picture vision into room flow and then into the smaller station decisions that make the room easier to live in.',
    ],
    imagePath: '/assets/editorial/nursery.jpg',
    imageAlt: 'Calm nursery editorial image for TMBC Baby Academy.',
  },
  gear: {
    title: 'Gear',
    shortDescription: 'Understand before you choose',
    heroTitle: 'Gear Path',
    heroDescription:
      'Sort the lanes, the tradeoffs, and the daily-life fit first so the product comparison starts making sense.',
    intro: [
      'Most gear decisions get noisy because families start with models before they understand the job the gear needs to do.',
      'This path keeps the order calmer: stroller foundations first, travel-system logic second, and car seat stage clarity after that.',
    ],
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear image for TMBC Baby Academy.',
  },
  postpartum: {
    title: 'Postpartum',
    shortDescription: 'Support your real life',
    heroTitle: 'Postpartum Path',
    heroDescription:
      'Make room for recovery, feeding rhythm, and the practical support that helps the adults function, too.',
    intro: [
      'Postpartum is often treated like a side note in baby prep. It should not be.',
      'This path turns recovery, feeding rhythm, and first-weeks support into a real sequence so the household gets prepared alongside the baby.',
    ],
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Postpartum and early parenthood editorial image for TMBC Baby Academy.',
  },
};

const ACADEMY_MODULE_DEFINITIONS: Record<AcademyModuleSlug, AcademyModuleDefinition> = {
  'registry-foundations': {
    pathSlug: 'registry',
    title: 'Vision and Lifestyle',
    description: 'Start with the life you are building before the registry and nursery start collecting too much momentum.',
    subhead: 'This is the calmer place to begin when the plan still feels bigger than the products.',
    imagePath: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry planning image for the Vision and Lifestyle academy module.',
    relatedSlug: 'first-weeks-essentials',
  },
  'vision-and-lifestyle': {
    pathSlug: 'nursery',
    title: 'Vision & Lifestyle Foundations',
    description: 'Start with your space and your real rhythm before the nursery turns into a shopping list.',
    subhead: 'Start with your space - not your shopping list.',
    imagePath: '/assets/editorial/nursery.jpg',
    imageAlt: 'Calm nursery editorial image for the Vision & Lifestyle Foundations academy module.',
    relatedSlug: 'registry-foundations',
  },
  'sleep-space-decisions': {
    pathSlug: 'nursery',
    title: 'Sleep Space Decisions',
    description: 'Decide where your baby will actually sleep based on your space, your nights, and your comfort level.',
    subhead: 'Where your baby sleeps - and why it matters more than you think.',
    imagePath: '/assets/editorial/babyincrib.png',
    imageAlt: 'Baby sleep editorial image for the Sleep Space Decisions module.',
    relatedSlug: 'registry-foundations',
  },
  'furniture-that-actually-works': {
    pathSlug: 'nursery',
    title: 'Furniture That Actually Works',
    description: 'Choose the pieces that support your routine instead of filling the room for the sake of completion.',
    subhead: 'What you need - and what you do not.',
    imagePath: '/assets/editorial/nursery2.png',
    imageAlt: 'Nursery furniture editorial image for the Furniture That Actually Works module.',
    relatedSlug: 'registry-foundations',
  },
  'layout-and-flow': {
    pathSlug: 'nursery',
    title: 'Layout & Flow',
    description: 'Design the room around movement, access, and nighttime usability before styling details take over.',
    subhead: 'How your nursery actually works in real life.',
    imagePath: '/assets/editorial/nurseryzones.png',
    imageAlt: 'Nursery zones editorial image for the Layout & Flow module.',
    relatedSlug: 'feeding-and-home-rhythm',
  },
  'storage-and-organization': {
    pathSlug: 'nursery',
    title: 'Storage & Organization',
    description: 'Build an organization system that is easy to maintain before the room starts collecting quiet chaos.',
    subhead: 'How to reduce chaos before it starts.',
    imagePath: '/assets/editorial/clipboard.png',
    imageAlt: 'Nursery organization editorial image for the Storage & Organization module.',
    relatedSlug: 'first-weeks-essentials',
  },
  'atmosphere-and-safety': {
    pathSlug: 'nursery',
    title: 'Atmosphere & Safety',
    description: 'Bring the room together around calm, safety, and the kind of simplicity that still works at 2:14 AM.',
    subhead: 'How your nursery feels - and functions.',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Calm nursery atmosphere image for the Atmosphere & Safety module.',
    relatedSlug: 'stroller-foundations',
  },
  'stroller-foundations': {
    pathSlug: 'gear',
    title: 'Stroller Foundations',
    description: 'Get clear on stroller lanes before comparing products that were never solving the same job.',
    subhead: 'The calmer stroller decision starts with routine, storage, terrain, and longevity instead of a brand shortlist.',
    imagePath: '/assets/editorial/strollers.png',
    imageAlt: 'Editorial stroller planning image for the Stroller Foundations academy module.',
    relatedSlug: 'vision-and-lifestyle',
  },
  'travel-systems': {
    pathSlug: 'gear',
    title: 'Travel Systems',
    description: 'Understand how travel strollers, infant seats, and portability work together before convenience starts running the whole decision.',
    subhead: 'This module is about transitions: how you leave, move, load, and arrive with less friction.',
    imagePath: '/assets/editorial/stroller-folds.jpg',
    imageAlt: 'Travel stroller fold image for the Travel Systems academy module.',
    relatedSlug: 'storage-and-organization',
  },
  'car-seat-basics': {
    pathSlug: 'gear',
    title: 'Car Seat Basics',
    description: 'Make the stage-based car seat decision clearer before brand language turns the category into homework.',
    subhead: 'Start with the stage, the vehicle, and the routine. The rest gets much quieter from there.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Car seat and gear image for the Car Seat Basics academy module.',
    relatedSlug: 'first-weeks-essentials',
  },
  'recovery-and-support': {
    pathSlug: 'postpartum',
    title: 'Recovery and Support',
    description: 'Plan for the adult side of early parenthood with more intention than a snack basket and a hopeful to-do list.',
    subhead: 'Recovery deserves structure, support, and room inside the plan from the beginning.',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Soft postpartum support image for the Recovery and Support academy module.',
    relatedSlug: 'layout-and-flow',
  },
  'feeding-and-home-rhythm': {
    pathSlug: 'postpartum',
    title: 'Feeding and Home Rhythm',
    description: 'Build one workable feeding setup and a calmer household rhythm before backup systems multiply.',
    subhead: 'The goal is not to predict every scenario. It is to make the repeated parts of the day easier to move through.',
    imagePath: '/assets/editorial/feeding.png',
    imageAlt: 'Feeding editorial image for the Feeding and Home Rhythm academy module.',
    relatedSlug: 'storage-and-organization',
  },
  'first-weeks-essentials': {
    pathSlug: 'postpartum',
    title: 'First-Weeks Essentials',
    description: 'Trim the list down to what actually supports the first stretch, then let real life finish the rest.',
    subhead: 'A calmer first-weeks setup usually looks smaller, smarter, and more forgiving than the internet suggested.',
    imagePath: '/assets/editorial/babystuff.png',
    imageAlt: 'First-weeks essentials image for the First-Weeks Essentials academy module.',
    relatedSlug: 'registry-foundations',
  },
};

function normalizeTitle(value: string) {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function isParagraphBlock(block: string) {
  const trimmed = block.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith(':::') &&
    !trimmed.startsWith('![') &&
    !trimmed.startsWith('>') &&
    !trimmed.startsWith('::cta-slot') &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed)
  );
}

function extractParagraphs(content: string, maxParagraphs = 4) {
  return stripLeadingGuideHeading(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(isParagraphBlock)
    .map((block) => stripMarkdown(block))
    .filter(Boolean)
    .slice(0, maxParagraphs);
}

function buildCoreSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imageCaption,
}: AcademyCoreSection) {
  return {
    title,
    paragraphs,
    imageSrc,
    imageAlt,
    imageCaption,
  } satisfies AcademyCoreSection;
}

const readGuideFile = cache(async (fileName: string) => {
  const absolutePath = path.join(process.cwd(), 'content', 'guides', fileName);
  return fs.readFile(absolutePath, 'utf8');
});

const getGuideDocument = cache(async (fileName: string) => {
  const content = await readGuideFile(fileName);
  const outline = buildGuideOutline(content);

  return {
    content,
    outline,
  };
});

function findSectionByTitle(sections: GuideSection[], title: string) {
  const target = normalizeTitle(title);

  return (
    sections.find((section) => {
      const candidate = normalizeTitle(section.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

function findSubsectionByTitle(subsections: GuideSectionSubsection[], title: string) {
  const target = normalizeTitle(title);

  return (
    subsections.find((subsection) => {
      const candidate = normalizeTitle(subsection.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

async function getPrefaceParagraphs(fileName: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  return extractParagraphs(document.outline.preface, maxParagraphs);
}

async function getSectionParagraphs(fileName: string, sectionTitle: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractParagraphs(section.content, maxParagraphs) : [];
}

async function getSubsectionParagraphs(
  fileName: string,
  sectionTitle: string,
  subsectionTitle: string,
  maxParagraphs = 2,
) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  if (!section) {
    return [];
  }

  const subsection = findSubsectionByTitle(splitGuideSectionContent(section.content).subsections, subsectionTitle);
  return subsection ? extractParagraphs(subsection.content, maxParagraphs) : [];
}

async function getSectionListItems(fileName: string, sectionTitle: string, maxItems = 5) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractMarkdownListItems(section.content, maxItems) : [];
}

function toSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildGenericProductExample({
  name,
  description,
  pros,
  category,
}: {
  name: string;
  description: string;
  pros: string[];
  category: string;
}): AcademyProductExample {
  return {
    name,
    brand: '',
    description: toSentence(description),
    pros: uniqueItems(pros, 3),
    affiliateUrl: null,
    category,
  };
}

function buildStrollerProductExample({
  groupSlug,
  index,
  category,
}: {
  groupSlug: keyof typeof STROLLER_PRODUCT_GROUPS;
  index: number;
  category: string;
}) {
  const products = STROLLER_PRODUCT_GROUPS[groupSlug] as GuideProductExampleData[];
  const product = products[index];

  return {
    name: product.productName ?? product.name,
    brand: product.brand ?? '',
    description: toSentence(product.shortReview ?? product.bestFor ?? 'A helpful guided example.'),
    pros: uniqueItems(product.pros ?? [], 3),
    affiliateUrl: product.affiliateUrl ?? null,
    category,
  } satisfies AcademyProductExample;
}

function buildCarSeatProductExample({
  groupSlug,
  index,
  category,
}: {
  groupSlug: keyof typeof CAR_SEAT_PRODUCT_GROUPS;
  index: number;
  category: string;
}) {
  const products = CAR_SEAT_PRODUCT_GROUPS[groupSlug] as GuideProductExampleData[];
  const product = products[index];

  return {
    name: product.productName ?? product.name,
    brand: product.brand ?? '',
    description: toSentence(product.shortReview ?? product.bestFor ?? 'A helpful guided example.'),
    pros: uniqueItems(product.pros ?? [], 3),
    affiliateUrl: null,
    category,
  } satisfies AcademyProductExample;
}

function getAcademyPathHref(pathSlug: AcademyPathSlug) {
  return `/academy/${pathSlug}`;
}

function getAcademyModuleHref(pathSlug: AcademyPathSlug, moduleSlug: AcademyModuleSlug) {
  return `/academy/${pathSlug}/${moduleSlug}`;
}

function getModuleCard(slug: AcademyModuleSlug): AcademyModuleCard {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];

  return {
    slug,
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: definition.description,
    ctaLabel: 'Start module ->',
  };
}

function getRelatedLink(slug: AcademyModuleSlug, ctaLabel: string): AcademyRelatedLink {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];
  const pathDefinition = ACADEMY_PATH_DEFINITIONS[definition.pathSlug];

  return {
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: `${definition.description} Inside the ${pathDefinition.title} path.`,
    ctaLabel,
  };
}

async function buildRegistryFoundationsModule(): Promise<AcademyModuleContent> {
  const title = ACADEMY_MODULE_DEFINITIONS['registry-foundations'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.registry, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.nursery, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.registry, 'Decision Framework', 4)),
    ...(await getSectionListItems(GUIDE_FILES.nursery, 'Decision Framework', 3)),
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Systems before products',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.registry, 'Core Content', 'Build the registry by system, not by aisle', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.registry, 'What This Is', 1)),
        ], 3),
        imageSrc: '/assets/editorial/registry.png',
        imageAlt: 'Registry planning notebook and essentials.',
        imageCaption: 'When the systems are clear, the product list usually gets shorter on its own.',
      }),
      buildCoreSection({
        title: 'First-stage clarity matters more than future-stage noise',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.registry, 'Core Content', 'Focus on the first stage first', 2)),
          ...(await getSubsectionParagraphs(GUIDE_FILES.sleep, 'Core Content', 'Start with the first-stage plan', 1)),
        ], 3),
        imageSrc: '/assets/editorial/babyincrib.png',
        imageAlt: 'Editorial baby sleep image for first-stage planning.',
        imageCaption: 'You do not need to solve every future chapter before the newborn one begins.',
      }),
      buildCoreSection({
        title: 'Let your home do the editing',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.registry, 'Core Content', 'Big-ticket items should solve real friction', 2)),
          ...(await getSubsectionParagraphs(GUIDE_FILES.nursery, 'Core Content', 'Furniture should earn its floor space', 1)),
        ], 3),
        imageSrc: '/assets/editorial/nursery2.png',
        imageAlt: 'Calm nursery layout image for real-life planning.',
        imageCaption: 'The room, the storage, and the route should get a real vote before anything expensive lands on the list.',
      }),
      buildCoreSection({
        title: 'Useful support is allowed to look boring',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.registry, 'Core Content', 'Practical support matters more than people expect', 2)),
          ...(await getSubsectionParagraphs(GUIDE_FILES.nursery, 'Core Content', 'Storage should shorten the route', 1)),
        ], 3),
        imageSrc: '/assets/editorial/clipboard.png',
        imageAlt: 'Editorial planning tools image for practical support.',
        imageCaption: 'The items that quietly reduce repeated friction tend to age better than the flashy ones.',
      }),
    ],
    decisionBullets,
    products: [
      buildGenericProductExample({
        name: 'Mini Crib Setup',
        description: 'A practical fit when a smaller room needs the sleep zone to work without crowding the rest of the route.',
        pros: ['Helps tighter rooms stay usable', 'Leaves space for storage and movement', 'Works well when flow matters more than maximum footprint'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Dresser with Changing Pad',
        description: 'A strong example when you want one furniture piece to handle storage and diapering in the same footprint.',
        pros: ['Combines two daily jobs', 'Keeps the room from feeling over-furnished', 'Supports a shorter reset after changes'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Rolling Supply Cart',
        description: 'Useful when your support items need to move between rooms or stay flexible through the early weeks.',
        pros: ['Keeps daily items close', 'Works well in smaller or shared spaces', 'Easy to rethink as routines change'],
        category: title,
      }),
    ],
  };
}

function buildNurseryAcademyModule(slug: NurseryAcademyModuleSlug): AcademyModuleContent {
  const module = getNurseryAcademyModule(slug);
  return {
    intro: module.intro,
    coreSections: module.coreSections.map((section) =>
      buildCoreSection({
        title: section.title,
        paragraphs: section.paragraphs,
        imageSrc: section.imageSrc,
        imageAlt: section.imageAlt,
      }),
    ),
    decisionBullets: module.decisionBullets,
    products: module.products.map((product) =>
      buildGenericProductExample({
        name: product.name,
        description: product.description,
        pros: product.pros,
        category: module.title,
      }),
    ),
    softCtaLabel: module.softCtaLabel,
    softCtaTitle: module.softCtaTitle,
    softCtaBody: module.softCtaBody,
  };
}

async function buildStrollerFoundationsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['stroller-foundations'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.stroller, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.compact, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.stroller, 'Decision Framework', 5)),
    ...(await getSectionListItems(GUIDE_FILES.compact, 'Real-Life Fit', 4)),
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Start with the lane',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.stroller, 'What This Is', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Why This Category Feels Overwhelming', 1)),
        ], 3),
        imageSrc: '/assets/editorial/strollers.png',
        imageAlt: 'Editorial stroller lane image.',
        imageCaption: 'The category map comes first. The brand rabbit hole can wait.',
      }),
      buildCoreSection({
        title: 'Full-size and compact solve different days',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Full-size and modular strollers', 2)),
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Compact and travel strollers', 2)),
        ], 4),
        imageSrc: '/assets/editorial/fullsizemodular.png',
        imageAlt: 'Full-size stroller editorial image.',
        imageCaption: 'This is rarely about which stroller is more impressive. It is about which tradeoff is easier to live with.',
      }),
      buildCoreSection({
        title: 'Compact is a routine answer, not a downgrade',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'What Defines a Compact or Lightweight Stroller', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Real-Life Fit', 2)),
        ], 4),
        imageSrc: '/assets/editorial/compact.png',
        imageAlt: 'Compact stroller editorial image.',
        imageCaption: 'Compact wins because it keeps the week moving more easily, not because it wins a smaller-is-purer competition.',
      }),
      buildCoreSection({
        title: 'Compatibility matters, but longevity wins',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Car seat compatibility matters, but not more than longevity', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 1)),
        ], 3),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Stroller fold editorial image.',
        imageCaption: 'The stroller usually has the longer job. That should change the order of the decision.',
      }),
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 1, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 2, category: title }),
    ],
  };
}

async function buildTravelSystemsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['travel-systems'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.travel, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.travelStroller, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.travel, 'Decision Framework', 5)),
    ...(await getSectionListItems(GUIDE_FILES.infantCarSeat, 'How to Think About It Simply', 3)),
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Travel is mostly a transition problem',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'Travel is really about transitions', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Why This Category Feels Overwhelming', 1)),
        ], 3),
        imageSrc: '/assets/editorial/gear.jpg',
        imageAlt: 'Baby travel planning image.',
        imageCaption: 'The hardest repeated transition should shape the setup more than the smallest spec sheet number.',
      }),
      buildCoreSection({
        title: 'The stroller should match the trip',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'The stroller should match the trip', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'What a Travel Stroller Should Actually Do', 2)),
        ], 4),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Travel stroller fold and portability image.',
        imageCaption: 'Airport days, road trips, and destination-heavy walking are not all asking the stroller to do the same job.',
      }),
      buildCoreSection({
        title: 'A travel system is early-stage convenience, not the whole plan',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What a Travel System Actually Means', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 2)),
        ], 4),
        imageSrc: '/assets/editorial/fullsize.png',
        imageAlt: 'Everyday stroller and travel-system planning image.',
        imageCaption: 'The click-in convenience is real. It still does not get to outrank the stroller you will use much longer.',
      }),
      buildCoreSection({
        title: 'Choose the hardest transition first',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Expert Advice', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Real-Life Fit', 2)),
        ], 4),
        imageSrc: '/assets/editorial/growing-with-confidence.jpg',
        imageAlt: 'Parent traveling confidently with baby gear.',
        imageCaption: 'Families are usually happiest when the setup solves the most stressful part of the trip first.',
      }),
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 0, category: title }),
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 1, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0, category: title }),
    ],
  };
}

async function buildCarSeatBasicsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['car-seat-basics'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.carSeat, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.infantCarSeat, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.carSeat, 'Decision Framework', 5)),
    'Choose the stage first.',
    'Confirm the seat fits your vehicle and your routine before the features start auditioning for attention.',
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Stage first, always',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.carSeat, 'What This Is', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.carSeat, 'What People Get Wrong', 1)),
        ], 3),
        imageSrc: '/assets/editorial/gear.jpg',
        imageAlt: 'Car seat stage planning image.',
        imageCaption: 'The category gets calmer once the stage is clear enough to filter the rest.',
      }),
      buildCoreSection({
        title: 'Infant seats are about portability',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.carSeat, 'Core Content', 'Infant seats are about portability, not superiority', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'Base vs Baseless Installation', 2)),
        ], 4),
        imageSrc: '/assets/editorial/welcome.png',
        imageAlt: 'Infant stage editorial image.',
        imageCaption: 'Portability can be incredibly helpful. It is still not mandatory for every family.',
      }),
      buildCoreSection({
        title: 'Convertible and all-in-one seats answer a different question',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.convertibleCarSeat, 'What Convertible Actually Solves', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.allInOneCarSeat, 'What All-in-One Actually Solves', 2)),
        ], 4),
        imageSrc: '/assets/editorial/bear-blocks.png',
        imageAlt: 'Long-run planning image for car seat stages.',
        imageCaption: 'Installed-seat convenience and long-run coverage are not the same thing, even when the category names sound efficient.',
      }),
      buildCoreSection({
        title: 'Fit and installation confidence matter most',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.carSeat, 'Core Content', 'Fit and installation confidence matter most', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters in Real Life', 1)),
        ], 3),
        imageSrc: '/assets/editorial/ipadblueprint.png',
        imageAlt: 'Car seat planning and fit image.',
        imageCaption: 'The right answer is the seat that fits your child, your vehicle, and your real week well enough to use correctly every time.',
      }),
    ],
    decisionBullets,
    products: [
      buildCarSeatProductExample({ groupSlug: 'infant', index: 0, category: title }),
      buildCarSeatProductExample({ groupSlug: 'convertible', index: 0, category: title }),
      buildCarSeatProductExample({ groupSlug: 'allInOne', index: 0, category: title }),
    ],
  };
}

async function buildRecoveryAndSupportModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['recovery-and-support'].title;

  return {
    intro: [
      'Postpartum planning is too often treated like an optional appendix to baby prep, which is a remarkably unhelpful order of operations.',
      'The adults still need the house to work. Recovery still needs support. Sleep still arrives in short, inconvenient intervals. This module puts that reality back inside the plan where it belongs.',
    ],
    coreSections: [
      buildCoreSection({
        title: 'Postpartum belongs inside the prep plan',
        paragraphs: [
          'A lot of first-time planning energy goes toward the baby categories while recovery gets reduced to a short list and a vague hope that the house will somehow cooperate. It usually does not.',
          'A stronger approach starts by giving postpartum its own structure. That means thinking about comfort, hydration, rest, feeding support, bathroom logistics, and the little repeat-use pieces that make a day feel less brittle.',
        ],
        imageSrc: '/assets/editorial/teddy-glow.png',
        imageAlt: 'Soft postpartum support image.',
        imageCaption: 'The baby is not the only one who needs the plan to work.',
      }),
      buildCoreSection({
        title: 'Support starts with the route through the house',
        paragraphs: [
          'Where you sit, where you feed, where recovery supplies live, and how many steps it takes to reach the basics all matter more after birth because the day is more repetitive and your margin is thinner.',
          'The postpartum setup usually improves when it borrows the same logic as the nursery: shorter routes, clearer stations, and fewer tasks hidden behind charming but inconvenient storage.',
        ],
        imageSrc: '/assets/editorial/nursery.jpg',
        imageAlt: 'Home setup image for postpartum support.',
        imageCaption: 'If the route is fussy before baby arrives, it rarely gets better later.',
      }),
      buildCoreSection({
        title: 'Small comforts count because repetition counts',
        paragraphs: [
          'The glamorous version of support is not usually what earns its keep. The better helpers tend to be the quiet ones: a water bottle you actually keep full, a bedside caddy that saves a trip, duplicate chargers, extra linens, and clothing that makes feeding and recovery easier instead of more performative.',
          'These things matter because they solve repeated friction. That is usually the difference between support that sounds nice and support that actually gets used.',
        ],
        imageSrc: '/assets/editorial/welcome.png',
        imageAlt: 'Comfort-focused postpartum image.',
        imageCaption: 'Useful support often looks plain on paper and excellent in real life.',
      }),
      buildCoreSection({
        title: 'Plan for backup, not perfection',
        paragraphs: [
          'The point is not to predict every hard moment. It is to make sure the basics stay close enough that small disruptions remain small.',
          'One extra layer for recovery, one for feeding, one for linens, and one for household reset is usually more useful than a drawer full of backup identities you never wanted to manage.',
        ],
        imageSrc: '/assets/editorial/growing-with-confidence.jpg',
        imageAlt: 'Parent adjusting to life with baby.',
        imageCaption: 'A good postpartum plan makes the household feel steadier, not busier.',
      }),
    ],
    decisionBullets: [
      'Start with the rooms and routines that will carry the most repetition in the first two weeks.',
      "Keep recovery basics, hydration, and comfort items within arm's reach of the spots you will use most.",
      'Let the support plan help the adults function, not just the baby categories look complete.',
      'Choose one practical backup layer for the essentials, then stop there.',
    ],
    products: [
      buildGenericProductExample({
        name: 'Bedside Recovery Caddy',
        description: 'A useful fit when you want the basics close enough that rest does not require a scavenger hunt.',
        pros: ['Keeps repeat-use items within reach', 'Supports overnight feeding or recovery windows', 'Helps one main station stay calmer'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Large Straw Water Bottle',
        description: 'Helpful when hydration is one of the easiest support wins to miss simply because the container is annoying to keep nearby.',
        pros: ['Easy to sip one-handed', 'Supports longer feeding or resting stretches', 'Simple comfort that earns its keep quickly'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Soft Layered Linens Set',
        description: 'A strong example when you want the bed, chair, or recovery zone to stay easy to reset after inevitable messier moments.',
        pros: ['Makes resets faster', 'Helps comfort stay practical', 'Useful in the first stretch when everything repeats often'],
        category: title,
      }),
    ],
  };
}

async function buildFeedingAndHomeRhythmModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['feeding-and-home-rhythm'].title;

  return {
    intro: [
      'Feeding setup gets overwhelming when families try to solve every possible preference before the baby has offered any opinions on the matter.',
      'This module keeps the sequence calmer: one workable setup first, then a home rhythm that supports the repeated parts of the day without turning every counter into a feeding category.',
    ],
    coreSections: [
      buildCoreSection({
        title: 'One workable feeding setup is enough to start',
        paragraphs: [
          'The first goal is not to own every bottle system, storage container, and backup path in the category. It is to have one reasonable setup you can use confidently when the day is still new and a little messy.',
          'That usually means a small starter layer, a clean place to store it, and enough flexibility to pivot later if your baby or your routine clearly asks for something different.',
        ],
        imageSrc: '/assets/editorial/feeding.png',
        imageAlt: 'Feeding setup image.',
        imageCaption: 'Feeding prep should support real life, not produce a drawer full of backup plans.',
      }),
      buildCoreSection({
        title: 'Keep the house arranged around repetition',
        paragraphs: [
          'Feeding does not happen in isolation. It sits inside laundry, rest, changing, hydration, dishes, and the very glamorous task of remembering where you put the burp cloths this time.',
          'When the setup works, the home rhythm starts to feel smoother because the high-use items stay obvious and the next step in the routine is easier to see.',
        ],
        imageSrc: '/assets/editorial/bottle-booties.png',
        imageAlt: 'Editorial home rhythm image.',
        imageCaption: 'The feeding zone usually improves when it is treated like a repeated route instead of a product category.',
      }),
      buildCoreSection({
        title: 'Choose convenience that actually saves a step',
        paragraphs: [
          'Some convenience items truly shorten the route. Others just relocate clutter into a more expensive shape. The distinction matters.',
          'A good filter is simple: does this item remove repeated friction in the part of the day you are actually living, or does it just make the setup feel more emotionally complete?',
        ],
        imageSrc: '/assets/editorial/registry.png',
        imageAlt: 'Planning image for feeding convenience.',
        imageCaption: 'The better convenience item is the one that quietly removes a step from the routine.',
      }),
      buildCoreSection({
        title: 'Leave room for baby preferences',
        paragraphs: [
          'Feeding is one of the clearest examples of why calmer planning leaves space to learn. Bottle shapes, feeding pace, and what feels easiest for the adults can all shift once real life begins.',
          'That does not mean you should under-prepare. It means you should stop before the prep becomes a full-time attempt to predict every future scenario.',
        ],
        imageSrc: '/assets/editorial/notebook-bunny.png',
        imageAlt: 'Editorial notebook image for feeding decisions.',
        imageCaption: 'Prepared and overcommitted are not the same thing.',
      }),
    ],
    decisionBullets: [
      'Start with one workable bottle or feeding setup before expanding into backups.',
      'Keep the highest-use items closest to the spots where feeding actually happens.',
      'Let convenience earn its place by removing repeated friction, not by sounding reassuring online.',
      'Leave enough flexibility for your baby and your routine to change the plan later.',
    ],
    products: [
      buildGenericProductExample({
        name: 'Starter Bottle Set',
        description: 'A practical first step when you want enough coverage to begin without committing to a full cabinet of one system.',
        pros: ['Keeps the first setup simple', 'Leaves room to adjust later', 'Works better than overbuying before preferences are clear'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Countertop Drying Zone',
        description: 'Helpful when the repeated wash-and-reset rhythm needs one obvious home instead of spreading across the kitchen.',
        pros: ['Makes resets faster', 'Keeps feeding items grouped together', 'Supports a calmer daily rhythm'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Portable Feeding Caddy',
        description: 'Useful when feeding happens in more than one room and the basics need to move with less effort.',
        pros: ['Keeps the essentials together', 'Supports flexible seating or recovery spots', 'Reduces back-and-forth between rooms'],
        category: title,
      }),
    ],
  };
}

async function buildFirstWeeksEssentialsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['first-weeks-essentials'].title;

  return {
    intro: [
      'A calmer essentials list usually starts by admitting that the first stretch is not asking you to prepare for every future stage at once.',
      'This module narrows the list around what actually supports sleep, feeding, changing, movement, recovery, and household reset in the first weeks, then lets the rest wait until it earns a reason.',
    ],
    coreSections: [
      buildCoreSection({
        title: 'Build for the first stretch, not every future stage',
        paragraphs: [
          'One of the fastest ways to overbuild the list is to shop for newborn life, six-month life, and toddler life at the same time. It makes the plan feel impressive while making the first stage harder to see clearly.',
          'The smarter version stays close to the first repeated routines and lets later categories arrive once your life has more information to work with.',
        ],
        imageSrc: '/assets/editorial/babystuff.png',
        imageAlt: 'First-weeks essentials flat lay.',
        imageCaption: 'Prepared does not need to mean finished for every future chapter.',
      }),
      buildCoreSection({
        title: 'Essentials are the items that reduce repeated friction',
        paragraphs: [
          'The items that matter most early are rarely the ones with the loudest marketing. They are the ones that support sleep, feeding, diapering, movement, recovery, laundry, and the small resets you will repeat every day.',
          'That is why a practical support layer often matters more than one more flashy category that sounded useful in theory.',
        ],
        imageSrc: '/assets/editorial/registry.jpg',
        imageAlt: 'Registry essentials planning image.',
        imageCaption: 'If the item is not helping a real repeated system, it probably does not belong in the first-pass essentials list.',
      }),
      buildCoreSection({
        title: 'Space and budget deserve a real vote',
        paragraphs: [
          'The right essentials list in a smaller home should not look like a failed version of a bigger one. It should look edited on purpose.',
          'The same goes for budget. Thoughtful preparation is not about buying more things faster. It is about getting the most useful things into the right order.',
        ],
        imageSrc: '/assets/editorial/nursery2.png',
        imageAlt: 'Edited home setup image.',
        imageCaption: 'The stronger list is usually the one that fits the house, the budget, and the first stage honestly.',
      }),
      buildCoreSection({
        title: 'A calmer list leaves room to learn your baby',
        paragraphs: [
          'Some categories simply need real-world feedback before they deserve a larger commitment. That is not under-preparing. It is a more mature way to prepare.',
          'The essentials list works best when it covers the first stretch well and leaves enough margin for your actual baby to tell you what comes next.',
        ],
        imageSrc: '/assets/editorial/teddy-glow.png',
        imageAlt: 'Calm first-weeks support image.',
        imageCaption: 'Real life is allowed to finish the list for you.',
      }),
    ],
    decisionBullets: [
      'Build the first-pass list around sleep, feeding, diapering, movement, recovery, and household reset.',
      'Keep maybe-later categories off the main list until they earn a clearer reason.',
      'Let the size of your home and the reality of your budget edit the list on purpose.',
      'Choose usefulness over popularity every time.',
    ],
    products: [
      buildGenericProductExample({
        name: 'Safe Sleep Starter Setup',
        description: 'A clear fit when you want the first weeks covered without turning the sleep category into a themed shopping event.',
        pros: ['Supports the first stretch directly', 'Keeps the sleep lane simple', 'Leaves room to adjust later if needed'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Diapering Basket',
        description: 'Helpful when you want the highest-use changing items together and easy to move between the spots you really use.',
        pros: ['Keeps the basics close', 'Supports quick resets', 'Useful in bedrooms, nurseries, or shared spaces'],
        category: title,
      }),
      buildGenericProductExample({
        name: 'Simple Laundry Backup Layer',
        description: 'A practical example because extra sheets, burp cloths, and repeat-use basics often solve more stress than another novelty category.',
        pros: ['Supports the daily reset', 'Helps messy moments stay manageable', 'Quietly earns its keep in the first stretch'],
        category: title,
      }),
    ],
  };
}

async function buildModuleContent(slug: AcademyModuleSlug): Promise<AcademyModuleContent | null> {
  switch (slug) {
    case 'registry-foundations':
      return buildRegistryFoundationsModule();
    case 'vision-and-lifestyle':
    case 'sleep-space-decisions':
    case 'furniture-that-actually-works':
    case 'layout-and-flow':
    case 'storage-and-organization':
    case 'atmosphere-and-safety':
      return buildNurseryAcademyModule(slug);
    case 'stroller-foundations':
      return buildStrollerFoundationsModule();
    case 'travel-systems':
      return buildTravelSystemsModule();
    case 'car-seat-basics':
      return buildCarSeatBasicsModule();
    case 'recovery-and-support':
      return buildRecoveryAndSupportModule();
    case 'feeding-and-home-rhythm':
      return buildFeedingAndHomeRhythmModule();
    case 'first-weeks-essentials':
      return buildFirstWeeksEssentialsModule();
    default:
      return null;
  }
}

export function getAcademyHomeData(): AcademyHomeData {
  return {
    title: 'TMBC Baby Academy',
    description: 'A calm, structured way to prepare for baby - without the overwhelm.',
    explanationTitle: 'Most people start with products. We start with your life.',
    explanationBody:
      'The academy is designed to move from context into decisions, then into guided examples. You do not need a louder checklist. You need a clearer next step.',
    paths: ACADEMY_PATH_ORDER.map((pathSlug) => {
      const definition = ACADEMY_PATH_DEFINITIONS[pathSlug];

      return {
        slug: pathSlug,
        href: getAcademyPathHref(pathSlug),
        title: definition.title,
        description: definition.shortDescription,
        eyebrow: `${ACADEMY_PATH_MODULES[pathSlug].length} modules`,
        imagePath: definition.imagePath,
        imageAlt: definition.imageAlt,
      };
    }),
  };
}

export function getAcademyPathSlugs() {
  return [...ACADEMY_PATH_ORDER];
}

export function getAcademyModuleParams() {
  return ACADEMY_PATH_ORDER.flatMap((pathSlug) =>
    ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => ({
      academyPath: pathSlug,
      module: moduleSlug,
    })),
  );
}

export function getAcademySitemapPaths() {
  return [
    '/academy',
    ...ACADEMY_PATH_ORDER.map((pathSlug) => getAcademyPathHref(pathSlug)),
    ...ACADEMY_PATH_ORDER.flatMap((pathSlug) =>
      ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => getAcademyModuleHref(pathSlug, moduleSlug)),
    ),
  ];
}

export function isAcademyPathSlug(value: string): value is AcademyPathSlug {
  return value in ACADEMY_PATH_DEFINITIONS;
}

export function isAcademyModuleSlug(value: string): value is AcademyModuleSlug {
  return value in ACADEMY_MODULE_DEFINITIONS;
}

export function getAcademyPathTitle(pathSlug: AcademyPathSlug) {
  return ACADEMY_PATH_DEFINITIONS[pathSlug].title;
}

export function getAcademyModuleTitle(slug: AcademyModuleSlug) {
  return ACADEMY_MODULE_DEFINITIONS[slug].title;
}

export async function getAcademyPathData(pathSlug: AcademyPathSlug): Promise<AcademyPathData> {
  const definition = ACADEMY_PATH_DEFINITIONS[pathSlug];

  return {
    slug: pathSlug,
    href: getAcademyPathHref(pathSlug),
    title: definition.title,
    shortDescription: definition.shortDescription,
    heroTitle: definition.heroTitle,
    heroDescription: definition.heroDescription,
    intro: definition.intro,
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    moduleCards: ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => getModuleCard(moduleSlug)),
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: definition.title },
    ],
  };
}

export async function getAcademyModuleData(slug: AcademyModuleSlug): Promise<AcademyModuleData> {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];
  const pathDefinition = ACADEMY_PATH_DEFINITIONS[definition.pathSlug];
  const modulesInPath = ACADEMY_PATH_MODULES[definition.pathSlug];
  const currentIndex = modulesInPath.indexOf(slug);
  const content = await buildModuleContent(slug);

  if (!content) {
    throw new Error(`Missing academy module content for ${slug}.`);
  }

  const previousSlug = currentIndex > 0 ? modulesInPath[currentIndex - 1] ?? null : null;
  const nextSlug = currentIndex < modulesInPath.length - 1 ? modulesInPath[currentIndex + 1] ?? null : null;

  return {
    slug,
    pathSlug: definition.pathSlug,
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: definition.description,
    subhead: definition.subhead,
    intro: content.intro,
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    progress: {
      current: currentIndex + 1,
      total: modulesInPath.length,
    },
    coreSections: content.coreSections,
    decisionTitle: 'What This Means For You',
    decisionBullets: content.decisionBullets,
    products: content.products,
    softCtaLabel: content.softCtaLabel ?? 'Soft CTA',
    softCtaTitle: content.softCtaTitle ?? 'This is where most families want a second opinion.',
    softCtaBody:
      content.softCtaBody ?? ['Once the logic is clear, a personal recommendation usually gets faster and much more useful.'],
    previous: previousSlug ? getRelatedLink(previousSlug, 'Previous module ->') : null,
    next: nextSlug ? getRelatedLink(nextSlug, 'Next module ->') : null,
    related: definition.relatedSlug ? getRelatedLink(definition.relatedSlug, 'Related module ->') : null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: pathDefinition.title, href: getAcademyPathHref(definition.pathSlug) },
      { label: definition.title },
    ],
  };
}
