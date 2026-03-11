import { revalidatePath } from 'next/cache';
import { resolvePostLifecycle } from '@/lib/server/blogPostLifecycle';
import type { PostStatusValue } from '@/lib/blog/postStatus';

type GuideLifecycleFields = {
  status: PostStatusValue;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
};

export function getRevalidationPathsForGuide(guide: Pick<{ id: string; slug: string }, 'id' | 'slug'>) {
  return [
    '/admin/guides',
    '/admin/guides/analytics',
    `/admin/guides/${guide.id}`,
    `/admin/guides/${guide.id}/edit`,
    `/admin/guides/${guide.id}/preview`,
    '/guides',
    `/guides/${guide.slug}`,
    '/learn',
    `/learn/${guide.slug}`,
    '/',
  ];
}

export function revalidateGuidePaths(guide: Pick<{ id: string; slug: string }, 'id' | 'slug'>) {
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
