import { revalidatePath } from 'next/cache';
import { getGuideParentSlug } from '@/lib/guides/routing';
import { getGuidePublicPath, isAcademyPublicPath } from '@/lib/guides/publicPath';
import { resolvePostLifecycle } from '@/lib/server/blogPostLifecycle';
import type { PostStatusValue } from '@/lib/blog/postStatus';

type GuideLifecycleFields = {
  status: PostStatusValue;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
};

export function getRevalidationPathsForGuide(
  guide: Pick<{ id: string; slug: string; topicCluster?: string | null; canonicalUrl?: string | null }, 'id' | 'slug' | 'topicCluster' | 'canonicalUrl'>,
) {
  const publicPath = getGuidePublicPath({
    slug: guide.slug,
    topicCluster: guide.topicCluster,
    canonicalUrl: guide.canonicalUrl,
  });
  const parentSlug = getGuideParentSlug({ slug: guide.slug, topicCluster: guide.topicCluster });
  const academySegments = isAcademyPublicPath(publicPath) ? publicPath.split('/').filter(Boolean) : [];
  const academyPath = academySegments[1] ? `/academy/${academySegments[1]}` : null;

  return Array.from(
    new Set([
      '/admin/guides',
      '/admin/guides/analytics',
      `/admin/guides/${guide.id}`,
      `/admin/guides/${guide.id}/edit`,
      `/admin/guides/${guide.id}/preview`,
      isAcademyPublicPath(publicPath) ? '/admin/academy' : null,
      isAcademyPublicPath(publicPath) ? '/admin/academy/analytics' : null,
      isAcademyPublicPath(publicPath) ? `/admin/academy/${guide.id}` : null,
      isAcademyPublicPath(publicPath) ? `/admin/academy/${guide.id}/edit` : null,
      isAcademyPublicPath(publicPath) ? `/admin/academy/${guide.id}/preview` : null,
      '/guides',
      parentSlug ? `/guides/${parentSlug}` : null,
      `/guides/${guide.slug}`,
      isAcademyPublicPath(publicPath) ? '/academy' : null,
      academyPath,
      publicPath,
      '/learn',
      `/learn/${guide.slug}`,
      '/',
    ].filter((path): path is string => Boolean(path))),
  );
}

export function revalidateGuidePaths(
  guide: Pick<{ id: string; slug: string; topicCluster?: string | null; canonicalUrl?: string | null }, 'id' | 'slug' | 'topicCluster' | 'canonicalUrl'>,
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
