import type { GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath, getGuideParentSlug, resolveGuideSlugFromRouteSegment } from '@/lib/guides/routing';
import { getRegistrySubGuideBySlug } from '@/lib/guides/registrySubguides';

export const TMBC_GUIDE_JOURNEY_STORAGE_KEY = 'tmbc-guide-journey';

export const TMBC_MASTER_GUIDE_FLOW = [
  {
    slug: 'minimalist-baby-registry',
    label: 'Registry',
    stepLabel: 'Step 1',
    title: 'Registry',
    description: 'Build the plan in the right order before the products start performing for attention.',
    href: getGuidePath({ slug: 'minimalist-baby-registry' }),
    icon: 'checklist',
    imageSrc: '/assets/editorial/registry.jpg',
    imageAlt: 'Editorial registry planning image for Taylor-Made Baby Co.',
  },
  {
    slug: 'nursery-setup-guide',
    label: 'Nursery',
    stepLabel: 'Step 2',
    title: 'Nursery',
    description: 'Plan the room around the routes, storage, and routines that need to work half asleep.',
    href: getGuidePath({ slug: 'nursery-setup-guide' }),
    icon: 'home',
    imageSrc: '/assets/editorial/nursery.jpg',
    imageAlt: 'Editorial nursery planning image for Taylor-Made Baby Co.',
  },
  {
    slug: 'best-strollers',
    label: 'Strollers',
    stepLabel: 'Step 3',
    title: 'Strollers',
    description: 'Choose the stroller lane that fits your week before you compare the products inside it.',
    href: getGuidePath({ slug: 'best-strollers' }),
    icon: 'stroller',
    imageSrc: '/assets/editorial/strollers.png',
    imageAlt: 'Editorial stroller image for Taylor-Made Baby Co.',
  },
  {
    slug: 'best-infant-car-seats',
    label: 'Car Seats',
    stepLabel: 'Step 4',
    title: 'Car Seats',
    description: 'Sort stage, fit, install reality, and travel-system logic before feature lists take over.',
    href: getGuidePath({ slug: 'best-infant-car-seats' }),
    icon: 'carseat',
    imageSrc: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear image for car seat planning.',
  },
  {
    slug: 'travel-with-baby',
    label: 'Travel',
    stepLabel: 'Step 5',
    title: 'Travel',
    description: 'Use movement, portability, and real outing friction to simplify what needs to come with you.',
    href: getGuidePath({ slug: 'travel-with-baby' }),
    icon: 'plane',
    imageSrc: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Editorial travel-with-baby image for Taylor-Made Baby Co.',
  },
  {
    slug: 'daily-use-gear',
    label: 'Daily Use Gear',
    stepLabel: 'Step 6',
    title: 'Daily Use Gear',
    description: 'Sort the smaller everyday workhorses so feeding, soothing, bathing, and holding feel easier to live with.',
    href: '/academy/gear/daily-use-gear',
    icon: 'bag',
    imageSrc: '/assets/editorial/babystuff.png',
    imageAlt: 'Editorial daily use baby gear image for Taylor-Made Baby Co.',
  },
] as const satisfies readonly (GuideHubLink & {
  slug: string;
  label: string;
  stepLabel: string;
})[];

export const TMBC_BUY_STEP = {
  slug: 'buy',
  label: 'Buy',
  title: 'Buy With Confidence',
  description: 'Book guidance when you want help turning the calmer plan into an actual shortlist and buying decision.',
  href: '/book',
  icon: 'strategy',
} as const;

export type TmbcMasterGuideSlug = (typeof TMBC_MASTER_GUIDE_FLOW)[number]['slug'];

export type TmbcGuideJourneyState = {
  slug: string;
  title: string;
  sourceRoute: string;
  laneSlug: TmbcMasterGuideSlug | null;
  nextLaneSlug: TmbcMasterGuideSlug | 'buy' | null;
  updatedAt: string;
};

export function getMasterGuideFlowCards() {
  return TMBC_MASTER_GUIDE_FLOW.map((item) => ({ ...item }));
}

export function getGuideMasterLaneSlug({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}): TmbcMasterGuideSlug | null {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const registrySubGuide = getRegistrySubGuideBySlug(resolvedSlug);

  if (registrySubGuide) {
    return 'minimalist-baby-registry';
  }

  const parentSlug = getGuideParentSlug({ slug: resolvedSlug, topicCluster });
  const candidate = (parentSlug ?? resolvedSlug) as TmbcMasterGuideSlug;

  return TMBC_MASTER_GUIDE_FLOW.some((item) => item.slug === candidate) ? candidate : null;
}

export function getGuideMasterLaneIndex({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const laneSlug = getGuideMasterLaneSlug({ slug, topicCluster });
  if (!laneSlug) {
    return -1;
  }

  return TMBC_MASTER_GUIDE_FLOW.findIndex((item) => item.slug === laneSlug);
}

export function getNextGuideLane({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const laneIndex = getGuideMasterLaneIndex({ slug, topicCluster });
  if (laneIndex < 0) {
    return null;
  }

  const nextLane = TMBC_MASTER_GUIDE_FLOW[laneIndex + 1];
  if (nextLane) {
    return { ...nextLane };
  }

  return { ...TMBC_BUY_STEP };
}

export function getPreviousGuideLane({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const laneIndex = getGuideMasterLaneIndex({ slug, topicCluster });
  if (laneIndex <= 0) {
    return null;
  }

  return { ...TMBC_MASTER_GUIDE_FLOW[laneIndex - 1]! };
}

export function getGuideJourneyStepFlow() {
  return [
    ...TMBC_MASTER_GUIDE_FLOW.map((item, index) => ({
      id: item.slug,
      step: index + 1,
      title: item.title,
      description: item.description,
      href: item.href,
      icon: item.icon,
      imageSrc: item.imageSrc,
      imageAlt: item.imageAlt,
    })),
    {
      id: TMBC_BUY_STEP.slug,
      step: TMBC_MASTER_GUIDE_FLOW.length + 1,
      title: TMBC_BUY_STEP.title,
      description: TMBC_BUY_STEP.description,
      href: TMBC_BUY_STEP.href,
      icon: TMBC_BUY_STEP.icon,
      imageSrc: undefined,
      imageAlt: undefined,
    },
  ];
}

export function getGuideJourneyState({
  slug,
  title,
  sourceRoute,
  topicCluster,
}: {
  slug: string;
  title: string;
  sourceRoute: string;
  topicCluster?: string | null;
}): TmbcGuideJourneyState {
  const laneSlug = getGuideMasterLaneSlug({ slug, topicCluster });
  const nextLane = getNextGuideLane({ slug, topicCluster });

  return {
    slug,
    title,
    sourceRoute,
    laneSlug,
    nextLaneSlug: nextLane?.slug ?? null,
    updatedAt: new Date().toISOString(),
  };
}
