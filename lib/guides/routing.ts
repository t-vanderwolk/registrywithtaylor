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

export function getGuideParentSlug({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const bySlug = GUIDE_PARENT_BY_SLUG[slug];
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
}) {
  const parentSlug = getGuideParentSlug({ slug, topicCluster });
  if (parentSlug) {
    return `/guides/${parentSlug}/${slug}`;
  }

  return `/guides/${slug}`;
}
