import { revalidatePath } from 'next/cache';
import { getGuideParentSlug, getGuidePath } from '@/lib/guides/routing';
import { resolvePostLifecycle } from '@/lib/server/blogPostLifecycle';
import type { PostStatusValue } from '@/lib/blog/postStatus';

type GuideLifecycleFields = {
  status: PostStatusValue;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
};

export function getRevalidationPathsForGuide(
  guide: Pick<{ id: string; slug: string; topicCluster?: string | null }, 'id' | 'slug' | 'topicCluster'>,
) {
  const publicPath = getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });
  const parentSlug = getGuideParentSlug({ slug: guide.slug, topicCluster: guide.topicCluster });

  return Array.from(
    new Set([
      '/admin/guides',
      '/admin/guides/analytics',
      `/admin/guides/${guide.id}`,
      `/admin/guides/${guide.id}/edit`,
      `/admin/guides/${guide.id}/preview`,
      '/guides',
      parentSlug ? `/guides/${parentSlug}` : null,
      `/guides/${guide.slug}`,
      publicPath,
      '/learn',
      `/learn/${guide.slug}`,
      '/',
    ].filter((path): path is string => Boolean(path))),
  );
}

export function revalidateGuidePaths(
  guide: Pick<{ id: string; slug: string; topicCluster?: string | null }, 'id' | 'slug' | 'topicCluster'>,
) {
  for (const path of getRevalidationPathsForGuide(guide)) {
    revalidatePath(path);
  }
}

export function deriveGuideLifecycle({
  existing,
  content,
  requestedStatus,
  requestedPublished,
  requestedScheduledFor,
}: {
  existing: GuideLifecycleFields;
  content: string;
  requestedStatus?: unknown;
  requestedPublished?: unknown;
  requestedScheduledFor?: unknown;
}) {
  return resolvePostLifecycle({
    status: requestedStatus,
    published: requestedPublished,
    scheduledFor: requestedScheduledFor,
    content,
    existing,
  });
}
