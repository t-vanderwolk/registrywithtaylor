import { NURSERY_GUIDE_PARENT_SLUG, NURSERY_GUIDE_TOPIC_CLUSTER, NURSERY_SUBGUIDE_DEFINITIONS } from '@/lib/guides/nurserySubguides';

const GUIDE_PARENT_BY_CLUSTER: Record<string, string> = {
  'TMBC Learning Library: Strollers': 'best-strollers',
  'TMBC Learning Library: Car Seats': 'best-infant-car-seats',
  [NURSERY_GUIDE_TOPIC_CLUSTER]: NURSERY_GUIDE_PARENT_SLUG,
};

const GUIDE_PARENT_BY_SLUG: Record<string, string> = {
  'full-size-modular-strollers': 'best-strollers',
  'compact-lightweight-strollers': 'best-strollers',
  'travel-strollers': 'best-strollers',
  'convertible-strollers': 'best-strollers',
  'jogging-all-terrain-strollers': 'best-strollers',
  'double-strollers': 'best-strollers',
  'infant-car-seats': 'best-infant-car-seats',
  'convertible-car-seats': 'best-infant-car-seats',
  'all-in-one-car-seats': 'best-infant-car-seats',
  'booster-seats': 'best-infant-car-seats',
  'rotating-car-seats': 'best-infant-car-seats',
  'travel-lightweight-car-seats': 'best-infant-car-seats',
  ...Object.fromEntries(NURSERY_SUBGUIDE_DEFINITIONS.map((guide) => [guide.slug, NURSERY_GUIDE_PARENT_SLUG])),
};

const GUIDE_ROUTE_SEGMENT_BY_SLUG: Record<string, string> = {
  'best-strollers': 'strollers',
  'best-infant-car-seats': 'car-seats',
  'minimalist-baby-registry': 'registry',
  'nursery-setup-guide': 'nursery',
  'travel-with-baby': 'travel-with-baby',
  'infant-car-seats': 'infant-car-seats',
  'convertible-car-seats': 'convertible-car-seats',
  'all-in-one-car-seats': 'all-in-one-car-seats',
  'booster-seats': 'booster-seats',
  'rotating-car-seats': 'rotating-car-seats',
  'travel-lightweight-car-seats': 'travel-lightweight-car-seats',
  'compact-lightweight-strollers': 'compact-strollers',
  'jogging-all-terrain-strollers': 'jogging-strollers',
  ...Object.fromEntries(NURSERY_SUBGUIDE_DEFINITIONS.map((guide) => [guide.slug, guide.routeSegment])),
};

const GUIDE_SLUG_BY_ROUTE_SEGMENT: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(GUIDE_ROUTE_SEGMENT_BY_SLUG).map(([slug, routeSegment]) => [routeSegment, slug]),
  ),
  'baby-registry': 'minimalist-baby-registry',
};

export function resolveGuideSlugFromRouteSegment(routeSegment: string) {
  return GUIDE_SLUG_BY_ROUTE_SEGMENT[routeSegment] ?? routeSegment;
}

export function getGuideRouteSegment(slug: string) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  return GUIDE_ROUTE_SEGMENT_BY_SLUG[resolvedSlug] ?? resolvedSlug;
}

export function getGuideParentSlug({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const bySlug = GUIDE_PARENT_BY_SLUG[resolvedSlug];
  if (bySlug) {
    return bySlug;
  }

  if (topicCluster) {
    const byCluster = GUIDE_PARENT_BY_CLUSTER[topicCluster];
    if (byCluster && byCluster !== slug) {
      return byCluster;
    }
  }

  return null;
}

export function isGuideSubguide({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  return Boolean(getGuideParentSlug({ slug, topicCluster }));
}

export function getGuidePath({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}): `/${string}` {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const parentSlug = getGuideParentSlug({ slug: resolvedSlug, topicCluster });
  if (parentSlug) {
    return `/guides/${getGuideRouteSegment(parentSlug)}/${getGuideRouteSegment(resolvedSlug)}`;
  }

  return `/guides/${getGuideRouteSegment(resolvedSlug)}`;
}
