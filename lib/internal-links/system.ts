import { getGuideLinksForBlogPost } from '@/lib/guides/blogLinks';
import { getGuidePath } from '@/lib/guides/routing';
import type { GuideCardItem } from '@/lib/guides/presentation';
import type {
  ContextualInternalLink,
  InternalLinkCard,
  InternalLinkCluster,
  InternalLinkMapEntry,
} from '@/lib/internal-links/types';

type BlogLinkSource = {
  slug: string;
  title: string;
  category: string;
  content: string;
  focusKeyword?: string | null;
};

type RelatedBlogSource = {
  slug: string;
  title: string;
  category: string;
  excerpt?: string | null;
};

type AcademyLinkSource = {
  href: `/${string}`;
  pathSlug: 'registry' | 'nursery' | 'gear' | 'postpartum';
  slug: string;
  title: string;
  description: string;
};

type GuideLinkSource = {
  href?: `/${string}`;
  slug: string;
  title: string;
  category: string;
  topicCluster?: string | null;
};

const SERVICES_CARD: InternalLinkCard = {
  id: 'services',
  href: '/services',
  title: 'Work with Taylor',
  description: 'Bring the shortlist, the registry, or the room plan into one calmer conversation when you want expert judgment instead of more tabs.',
  ctaLabel: 'Explore services ->',
  eyebrow: 'Services',
  kind: 'service',
  cluster: 'general',
};

const GUIDE_HUB_CARD: InternalLinkCard = {
  id: 'guide-hub',
  href: '/guides',
  title: 'TMBC Guide Hub',
  description: 'Use the wider guide map when you want the order of decisions to get calmer before the narrower category does.',
  ctaLabel: 'Open guide hub ->',
  eyebrow: 'Guide Hub',
  kind: 'guide',
  cluster: 'general',
};

const ACADEMY_HUB_CARD: InternalLinkCard = {
  id: 'academy-hub',
  href: '/academy',
  title: 'TMBC Academy',
  description: 'Use the Academy when you want the step-by-step learning layer behind the shorter guide or blog read.',
  ctaLabel: 'Open Academy ->',
  eyebrow: 'Academy',
  kind: 'academy',
  cluster: 'general',
};

const GUIDE_LIBRARY = {
  registry: {
    id: 'guide-registry',
    href: getGuidePath({ slug: 'minimalist-baby-registry' }),
    title: 'Baby Registry Guide',
    description: 'Start with the registry structure before the list gets louder than it needs to.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'registry',
    anchors: ['baby registry guide', 'registry guide', 'registry strategy', 'baby registry'],
  },
  whereToRegister: {
    id: 'guide-where-to-register',
    href: getGuidePath({ slug: 'where-to-register', topicCluster: 'TMBC Learning Library: Registry' }),
    title: 'Where to Register & Why',
    description: 'Use this when the platform question matters more than the product list.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'registry',
    anchors: ['where to register', 'registry platforms', 'registry retailer'],
  },
  strollers: {
    id: 'guide-strollers',
    href: getGuidePath({ slug: 'best-strollers' }),
    title: 'Stroller Guide',
    description: 'Use the pillar guide when the stroller category still feels bigger than the product list.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'strollers',
    anchors: ['stroller guide', 'stroller categories', 'best strollers', 'travel strollers'],
  },
  carSeats: {
    id: 'guide-car-seats',
    href: getGuidePath({ slug: 'best-infant-car-seats' }),
    title: 'Car Seat Guide',
    description: 'A calmer explanation of the seat stages before specs and installs start shouting over each other.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'car-seats',
    anchors: ['car seat guide', 'car seat stages', 'infant car seats', 'car seats'],
  },
  nursery: {
    id: 'guide-nursery',
    href: getGuidePath({ slug: 'nursery-setup-guide' }),
    title: 'Nursery Setup Guide',
    description: 'Good nursery planning starts with room flow, storage, and the tired version of real life.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'nursery',
    anchors: ['nursery setup guide', 'nursery planning', 'nursery setup'],
  },
  travel: {
    id: 'guide-travel',
    href: getGuidePath({ slug: 'travel-with-baby' }),
    title: 'Travel With Baby Guide',
    description: 'Use this when the decision has one foot in daily life and the other in airports, trunks, or family trips.',
    ctaLabel: 'Open guide ->',
    eyebrow: 'Guide',
    kind: 'guide',
    cluster: 'travel',
    anchors: ['travel with baby', 'travel gear', 'travel stroller'],
  },
} as const satisfies Record<string, ContextualInternalLink>;

const ACADEMY_LIBRARY = {
  registry: {
    id: 'academy-registry-path',
    href: '/academy/registry',
    title: 'Registry Academy',
    description: 'A structured path for platforms, perks, timing, and gifting strategy.',
    ctaLabel: 'Explore Academy ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'registry',
    anchors: ['registry academy', 'registry path', 'registry planning'],
  },
  welcomeBoxes: {
    id: 'academy-welcome-boxes',
    href: '/academy/registry/welcome-boxes-perks',
    title: 'Welcome Boxes & Registry Perks',
    description: 'Use this module when the free-box question is really a platform strategy question.',
    ctaLabel: 'Explore module ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'registry',
    anchors: ['welcome boxes', 'registry perks', 'welcome box'],
  },
  strollerFoundations: {
    id: 'academy-stroller-foundations',
    href: '/academy/gear/stroller-foundations',
    title: 'Stroller Foundations',
    description: 'Start with the stroller lanes before a shortlist starts comparing products that were never solving the same job.',
    ctaLabel: 'Explore module ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'strollers',
    anchors: ['stroller foundations', 'stroller categories', 'stroller lane'],
  },
  carSeatFoundations: {
    id: 'academy-car-seat-foundations',
    href: '/academy/gear/car-seat-foundations',
    title: 'Car Seat Foundations',
    description: 'Use this when the seat stage still needs to make sense before brand comparison begins.',
    ctaLabel: 'Explore module ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'car-seats',
    anchors: ['car seat foundations', 'car seat stages', 'infant car seats'],
  },
  dailyUseGear: {
    id: 'academy-daily-use-gear',
    href: '/academy/gear/daily-use-gear',
    title: 'Daily Use Gear',
    description: 'Carriers, highchairs, playards, and the products you feel immediately when they are wrong.',
    ctaLabel: 'Explore module ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'daily-gear',
    anchors: ['daily use gear', 'everyday baby gear', 'highchairs', 'pack and play'],
  },
  nurseryFurniture: {
    id: 'academy-nursery-furniture',
    href: '/academy/nursery/furniture-that-actually-works',
    title: 'Furniture That Actually Works',
    description: 'Cribs, gliders, dressers, monitors, and the room pieces that need to work when you are tired.',
    ctaLabel: 'Explore module ->',
    eyebrow: 'Academy',
    kind: 'academy',
    cluster: 'nursery',
    anchors: ['nursery furniture', 'cribs', 'gliders', 'nursery setup'],
  },
} as const satisfies Record<string, ContextualInternalLink>;

const BLOG_LIBRARY = {
  registry: {
    id: 'blog-registry-art',
    href: '/blog/the-art-of-the-registry',
    title: 'The Art of the Registry',
    description: 'A calmer editorial take on what a registry is actually supposed to do.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'registry',
    anchors: ['registry strategy', 'baby registry', 'registry'],
  },
  welcomeBoxes: {
    id: 'blog-target-concierge',
    href: '/blog/target-baby-concierge-virtual-specialist-guide-2026',
    title: 'Target’s Baby Boutique Is Changing Everything',
    description: 'Useful when the platform support question matters as much as the free samples.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'registry',
    anchors: ['Target Baby Concierge', 'Target registry', 'registry support'],
  },
  independentStores: {
    id: 'blog-independent-baby-stores',
    href: '/blog/best-independent-baby-stores-rewards-programs-2026',
    title: 'Best Independent Baby Store Programs & Perks',
    description: 'Helpful when the local-store question starts sounding more valuable than another generic registry.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'registry',
    anchors: ['independent baby stores', 'baby store perks', 'local baby store'],
  },
  travelStrollers: {
    id: 'blog-travel-strollers',
    href: '/blog/best-travel-strollers-2026',
    title: 'The Best Travel Strollers of 2026',
    description: 'A tighter product list once the stroller lane is already clear.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'strollers',
    anchors: ['travel strollers', 'travel stroller', 'best travel strollers'],
  },
  fullSizeStrollers: {
    id: 'blog-full-size-strollers',
    href: '/blog/best-full-size-strollers-2026',
    title: 'The 5 Best Full-Size Strollers of 2026',
    description: 'Use this once you know the full-size lane fits your real life.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'strollers',
    anchors: ['full-size strollers', 'full size strollers'],
  },
  highchairs: {
    id: 'blog-highchairs',
    href: '/blog/best-highchairs-2026-real-life-guide',
    title: 'The Best Highchairs of 2026',
    description: 'A good next step once you know what matters more than the prettiest tray photo.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'daily-gear',
    anchors: ['best highchairs', 'highchairs', 'highchair'],
  },
  nursery: {
    id: 'blog-nursery',
    href: '/blog/nursery-setup-that-actually-works',
    title: 'Nursery Setup That Actually Works',
    description: 'A practical read for room flow, changing zones, and the not-so-glamorous parts that matter fast.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: 'nursery',
    anchors: ['nursery setup', 'nursery planning'],
  },
} as const satisfies Record<string, ContextualInternalLink>;

function normalizeText(value: string | null | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function dedupeCards<T extends { href: string }>(cards: T[]) {
  return Array.from(new Map(cards.map((card) => [card.href, card])).values());
}

function toCard(target: ContextualInternalLink): InternalLinkCard {
  return {
    id: target.id,
    href: target.href,
    title: target.title,
    description: target.description,
    ctaLabel: target.ctaLabel,
    eyebrow: target.eyebrow,
    kind: target.kind,
    cluster: target.cluster,
  };
}

function toGuideCardItemLink(card: GuideCardItem): InternalLinkCard {
  return {
    id: `guide-${card.slug}`,
    href: card.href as `/${string}`,
    title: card.title,
    description: card.description,
    ctaLabel: 'Open guide ->',
    eyebrow: card.eyebrow,
    kind: 'guide',
    cluster: inferClusterFromText({
      slug: card.slug,
      title: card.title,
      category: 'Registry Strategy',
      content: `${card.title} ${card.description}`,
    }),
  };
}

function toRelatedBlogCard(post: RelatedBlogSource): InternalLinkCard {
  return {
    id: `blog-${post.slug}`,
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt?.trim() || 'Continue in the journal with a narrower comparison or a more specific use case.',
    ctaLabel: 'Read article ->',
    eyebrow: 'Journal',
    kind: 'blog',
    cluster: inferClusterFromText({
      slug: post.slug,
      title: post.title,
      category: post.category,
      content: post.excerpt ?? '',
    }),
  };
}

function inferClusterFromText(input: {
  slug?: string;
  title: string;
  category?: string;
  content?: string;
  focusKeyword?: string | null;
}): InternalLinkCluster {
  const normalized = normalizeText(
    [input.slug, input.title, input.category, input.content, input.focusKeyword].filter(Boolean).join(' '),
  );

  if (
    /\b(registry|welcome box|welcome kit|perks|completion discount|babylist|amazon|target|macrobaby|baby shower|gifting|independent baby store)\b/.test(normalized)
  ) {
    return 'registry';
  }

  if (/\b(car seat|infant seat|convertible seat|all in one|booster|rotating)\b/.test(normalized)) {
    return 'car-seats';
  }

  if (/\b(carrier|highchair|playard|pack and play|baby bath|bouncer|swing|daily use gear)\b/.test(normalized)) {
    return 'daily-gear';
  }

  if (/\b(nursery|crib|glider|dresser|changing station|baby monitor|diaper pail)\b/.test(normalized)) {
    return 'nursery';
  }

  if (/\b(travel stroller|travel with baby|airport|travel gear|travel crib)\b/.test(normalized)) {
    return 'travel';
  }

  if (/\bstroller|single to double|compact stroller|full size stroller|double stroller|jogging stroller\b/.test(normalized)) {
    return 'strollers';
  }

  return 'general';
}

function getGuideCardsForCluster(cluster: InternalLinkCluster) {
  switch (cluster) {
    case 'registry':
      return [toCard(GUIDE_LIBRARY.registry), toCard(GUIDE_LIBRARY.whereToRegister)];
    case 'strollers':
      return [toCard(GUIDE_LIBRARY.strollers), toCard(GUIDE_LIBRARY.travel)];
    case 'car-seats':
      return [toCard(GUIDE_LIBRARY.carSeats), toCard(GUIDE_LIBRARY.travel)];
    case 'nursery':
      return [toCard(GUIDE_LIBRARY.nursery), toCard(GUIDE_LIBRARY.registry)];
    case 'daily-gear':
      return [toCard(GUIDE_LIBRARY.registry), toCard(GUIDE_LIBRARY.nursery)];
    case 'travel':
      return [toCard(GUIDE_LIBRARY.travel), toCard(GUIDE_LIBRARY.strollers)];
    default:
      return [toCard(GUIDE_LIBRARY.registry), toCard(GUIDE_LIBRARY.strollers)];
  }
}

function getAcademyCardForCluster(cluster: InternalLinkCluster) {
  switch (cluster) {
    case 'registry':
      return toCard(ACADEMY_LIBRARY.welcomeBoxes);
    case 'strollers':
    case 'travel':
      return toCard(ACADEMY_LIBRARY.strollerFoundations);
    case 'car-seats':
      return toCard(ACADEMY_LIBRARY.carSeatFoundations);
    case 'nursery':
      return toCard(ACADEMY_LIBRARY.nurseryFurniture);
    case 'daily-gear':
      return toCard(ACADEMY_LIBRARY.dailyUseGear);
    default:
      return toCard(ACADEMY_LIBRARY.registry);
  }
}

function getAcademyContextualLinksForCluster(cluster: InternalLinkCluster): ContextualInternalLink[] {
  switch (cluster) {
    case 'registry':
      return [GUIDE_LIBRARY.registry, GUIDE_LIBRARY.whereToRegister, ACADEMY_LIBRARY.welcomeBoxes];
    case 'strollers':
    case 'travel':
      return [GUIDE_LIBRARY.strollers, GUIDE_LIBRARY.travel, ACADEMY_LIBRARY.strollerFoundations];
    case 'car-seats':
      return [GUIDE_LIBRARY.carSeats, GUIDE_LIBRARY.travel, ACADEMY_LIBRARY.carSeatFoundations];
    case 'nursery':
      return [GUIDE_LIBRARY.nursery, GUIDE_LIBRARY.registry, ACADEMY_LIBRARY.nurseryFurniture];
    case 'daily-gear':
      return [GUIDE_LIBRARY.registry, GUIDE_LIBRARY.nursery, ACADEMY_LIBRARY.dailyUseGear];
    default:
      return [GUIDE_LIBRARY.registry, GUIDE_LIBRARY.strollers];
  }
}

function getGuideContextualLinksForCluster(cluster: InternalLinkCluster): ContextualInternalLink[] {
  switch (cluster) {
    case 'registry':
      return [GUIDE_LIBRARY.whereToRegister, ACADEMY_LIBRARY.welcomeBoxes, BLOG_LIBRARY.registry, BLOG_LIBRARY.independentStores];
    case 'strollers':
      return [GUIDE_LIBRARY.travel, ACADEMY_LIBRARY.strollerFoundations, BLOG_LIBRARY.travelStrollers, BLOG_LIBRARY.fullSizeStrollers];
    case 'travel':
      return [GUIDE_LIBRARY.strollers, ACADEMY_LIBRARY.strollerFoundations, BLOG_LIBRARY.travelStrollers];
    case 'car-seats':
      return [GUIDE_LIBRARY.travel, ACADEMY_LIBRARY.carSeatFoundations, ACADEMY_LIBRARY.strollerFoundations];
    case 'nursery':
      return [GUIDE_LIBRARY.registry, ACADEMY_LIBRARY.nurseryFurniture, BLOG_LIBRARY.nursery];
    case 'daily-gear':
      return [GUIDE_LIBRARY.registry, ACADEMY_LIBRARY.dailyUseGear, BLOG_LIBRARY.highchairs];
    case 'postpartum':
      return [GUIDE_LIBRARY.registry, ACADEMY_LIBRARY.registry, BLOG_LIBRARY.registry];
    default:
      return [GUIDE_LIBRARY.registry, ACADEMY_LIBRARY.registry, BLOG_LIBRARY.registry];
  }
}

function getJournalCardsForCluster(cluster: InternalLinkCluster) {
  switch (cluster) {
    case 'registry':
      return [toCard(BLOG_LIBRARY.registry), toCard(BLOG_LIBRARY.welcomeBoxes), toCard(BLOG_LIBRARY.independentStores)];
    case 'strollers':
    case 'travel':
      return [toCard(BLOG_LIBRARY.travelStrollers), toCard(BLOG_LIBRARY.fullSizeStrollers)];
    case 'daily-gear':
      return [toCard(BLOG_LIBRARY.highchairs)];
    case 'nursery':
      return [toCard(BLOG_LIBRARY.nursery)];
    default:
      return [toCard(BLOG_LIBRARY.registry), toCard(BLOG_LIBRARY.travelStrollers)];
  }
}

export function buildBlogInternalLinkPlan({
  post,
  relatedPosts,
}: {
  post: BlogLinkSource;
  relatedPosts: RelatedBlogSource[];
}) {
  const cluster = inferClusterFromText(post);
  const guideCards = getGuideLinksForBlogPost({
    category: post.category,
    slug: post.slug,
    title: post.title,
    content: post.content,
  }).map(toGuideCardItemLink);
  const academyCard = getAcademyCardForCluster(cluster);
  const relatedCards = relatedPosts.slice(0, 2).map(toRelatedBlogCard);
  const matchedGuideLinks = guideCards
    .map((card) => {
      const match = Object.values(GUIDE_LIBRARY).find((target) => target.href === card.href);
      return match ?? null;
    })
    .filter(Boolean) as ContextualInternalLink[];
  const contextualLinks: ContextualInternalLink[] = dedupeCards<ContextualInternalLink>([
    ...getAcademyContextualLinksForCluster(cluster),
    ...matchedGuideLinks,
  ]).slice(0, 4);
  const journeyCards = dedupeCards([
    ...guideCards.slice(0, 2),
    academyCard,
    SERVICES_CARD,
    ...relatedCards,
  ]).slice(0, 6);
  const mapEntry: InternalLinkMapEntry = {
    href: `/blog/${post.slug}`,
    title: post.title,
    kind: 'blog',
    cluster,
    outbound: journeyCards,
  };

  return {
    cluster,
    contextualLinks,
    journeyCards,
    mapEntry,
  };
}

function getAcademyCluster(source: AcademyLinkSource): InternalLinkCluster {
  if (source.pathSlug === 'registry') {
    return 'registry';
  }

  if (source.pathSlug === 'nursery') {
    return 'nursery';
  }

  if (source.pathSlug === 'postpartum') {
    return 'postpartum';
  }

  if (source.slug.includes('car-seat')) {
    return 'car-seats';
  }

  if (source.slug.includes('daily-use')) {
    return 'daily-gear';
  }

  return 'strollers';
}

export function buildAcademyInternalLinkPlan(source: AcademyLinkSource) {
  const cluster = getAcademyCluster(source);
  const guideCards = getGuideCardsForCluster(cluster);
  const journalCards = getJournalCardsForCluster(cluster);
  const journeyCards = dedupeCards([
    ...guideCards.slice(0, 2),
    ...journalCards.slice(0, 1),
    SERVICES_CARD,
  ]).slice(0, 4);
  const mapEntry: InternalLinkMapEntry = {
    href: source.href,
    title: source.title,
    kind: 'academy',
    cluster,
    outbound: journeyCards,
  };

  return {
    cluster,
    contextualLinks: getAcademyContextualLinksForCluster(cluster).slice(0, 3),
    journeyCards,
    mapEntry,
  };
}

function getGuideHref(source: GuideLinkSource) {
  return source.href ?? (getGuidePath({ slug: source.slug, topicCluster: source.topicCluster }) as `/${string}`);
}

export function buildGuideInternalLinkPlan(source: GuideLinkSource) {
  const cluster = inferClusterFromText({
    slug: source.slug,
    title: source.title,
    category: source.category,
    content: source.topicCluster ?? '',
  });
  const currentHref = getGuideHref(source);
  const academyCard = getAcademyCardForCluster(cluster);
  const guideCards = getGuideCardsForCluster(cluster).filter((card) => card.href !== currentHref);
  const journalCards = getJournalCardsForCluster(cluster).filter((card) => card.href !== currentHref);
  const contextualLinks: ContextualInternalLink[] = dedupeCards<ContextualInternalLink>(
    getGuideContextualLinksForCluster(cluster).filter((link) => link.href !== currentHref),
  ).slice(0, 4);
  const journeyCards = dedupeCards([
    ...guideCards.slice(0, 2),
    academyCard,
    ...journalCards.slice(0, 1),
    SERVICES_CARD,
  ])
    .filter((card) => card.href !== currentHref)
    .slice(0, 5);
  const mapEntry: InternalLinkMapEntry = {
    href: currentHref,
    title: source.title,
    kind: 'guide',
    cluster,
    outbound: journeyCards,
  };

  return {
    cluster,
    contextualLinks,
    journeyCards,
    academyNextStep: {
      href: academyCard.href,
      label: academyCard.title,
      description: `Use the matching Academy module when you want the step-by-step learning layer behind ${source.title.toLowerCase()}.`,
      stage: 'Compare' as const,
    },
    mapEntry,
  };
}

export function getAcademyNextStepForGuide(source: GuideLinkSource) {
  return buildGuideInternalLinkPlan(source).academyNextStep;
}

export function getServicesJourneyCards() {
  return dedupeCards([
    toCard(GUIDE_LIBRARY.registry),
    toCard(GUIDE_LIBRARY.strollers),
    GUIDE_HUB_CARD,
    toCard(ACADEMY_LIBRARY.registry),
    toCard(ACADEMY_LIBRARY.strollerFoundations),
    toCard(BLOG_LIBRARY.registry),
    SERVICES_CARD,
  ]).slice(0, 5);
}

export function buildSiteInternalLinkMap(
  blogPosts: BlogLinkSource[] = [],
  guidePages: GuideLinkSource[] = [],
): Record<string, InternalLinkMapEntry> {
  const staticEntries: InternalLinkMapEntry[] = [
    {
      href: '/services',
      title: SERVICES_CARD.title,
      kind: 'service',
      cluster: 'general',
      outbound: getServicesJourneyCards(),
    },
    {
      href: GUIDE_HUB_CARD.href,
      title: GUIDE_HUB_CARD.title,
      kind: 'guide',
      cluster: 'general',
      outbound: dedupeCards([
        toCard(GUIDE_LIBRARY.registry),
        toCard(GUIDE_LIBRARY.strollers),
        toCard(GUIDE_LIBRARY.nursery),
        ACADEMY_HUB_CARD,
        SERVICES_CARD,
      ]).slice(0, 5),
    },
    {
      href: ACADEMY_HUB_CARD.href,
      title: ACADEMY_HUB_CARD.title,
      kind: 'academy',
      cluster: 'general',
      outbound: dedupeCards([
        toCard(ACADEMY_LIBRARY.registry),
        toCard(ACADEMY_LIBRARY.strollerFoundations),
        toCard(ACADEMY_LIBRARY.nurseryFurniture),
        GUIDE_HUB_CARD,
        SERVICES_CARD,
      ]).slice(0, 5),
    },
    ...Object.values(GUIDE_LIBRARY).map((target) =>
      buildGuideInternalLinkPlan({
        href: target.href,
        slug: target.id,
        title: target.title,
        category: target.title,
      }).mapEntry,
    ),
    ...Object.values(BLOG_LIBRARY).map((target) =>
      buildBlogInternalLinkPlan({
        post: {
          slug: target.href.split('/').filter(Boolean).pop() ?? target.id,
          title: target.title,
          category: target.title,
          content: target.description,
        },
        relatedPosts: [],
      }).mapEntry,
    ),
    ...Object.values(ACADEMY_LIBRARY).map((target) => ({
      href: target.href,
      title: target.title,
      kind: target.kind,
      cluster: target.cluster,
      outbound: buildAcademyInternalLinkPlan({
        href: target.href,
        pathSlug:
          target.cluster === 'registry'
            ? 'registry'
            : target.cluster === 'nursery'
              ? 'nursery'
              : 'gear',
        slug: target.id,
        title: target.title,
        description: target.description,
      }).journeyCards,
    })),
  ];

  const blogEntries = blogPosts.map((post) =>
    buildBlogInternalLinkPlan({ post, relatedPosts: [] }).mapEntry,
  );
  const guideEntries = guidePages.map((guide) => buildGuideInternalLinkPlan(guide).mapEntry);

  return Object.fromEntries(
    [...staticEntries, ...guideEntries, ...blogEntries].map((entry) => [entry.href, entry]),
  );
}
