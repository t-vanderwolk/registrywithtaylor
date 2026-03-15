const GUIDE_PARENT_BY_CLUSTER: Record<string, string> = {
  'TMBC Learning Library: Strollers': 'best-strollers',
};

const GUIDE_PARENT_BY_SLUG: Record<string, string> = {
  'full-size-modular-strollers': 'best-strollers',
  'compact-lightweight-strollers': 'best-strollers',
  'travel-strollers': 'best-strollers',
  'jogging-all-terrain-strollers': 'best-strollers',
  'double-strollers': 'best-strollers',
};

const GUIDE_ROUTE_SEGMENT_BY_SLUG: Record<string, string> = {
  'best-strollers': 'strollers',
  'best-infant-car-seats': 'car-seats',
  'minimalist-baby-registry': 'baby-registry',
  'nursery-setup-guide': 'nursery',
  'travel-with-baby': 'travel-with-baby',
  'jogging-all-terrain-strollers': 'jogging-strollers',
};

const GUIDE_SLUG_BY_ROUTE_SEGMENT = Object.fromEntries(
  Object.entries(GUIDE_ROUTE_SEGMENT_BY_SLUG).map(([slug, routeSegment]) => [routeSegment, slug]),
);

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
