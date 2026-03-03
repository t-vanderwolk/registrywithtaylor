import { revalidatePath } from 'next/cache';
import type { Post } from '@prisma/client';
import { resolvePostLifecycle } from '@/lib/server/blogPostLifecycle';
import {
  normalizeBlogStage,
  resolveBlogStage,
  stageImpliesStatus,
  type BlogStageValue,
} from '@/lib/blog/postStage';

export function getRevalidationPathsForPost(post: Pick<Post, 'id' | 'slug'>) {
  return [
    '/admin/blog',
    '/admin/blog/planner',
    `/admin/blog/${post.id}/edit`,
    `/admin/blog/${post.id}/preview`,
    '/blog',
    `/blog/${post.slug}`,
    '/',
  ];
}

export function revalidatePostPaths(post: Pick<Post, 'id' | 'slug'>) {
  for (const path of getRevalidationPathsForPost(post)) {
    revalidatePath(path);
  }
}

export function deriveLifecycleAndStage({
  existing,
  content,
  requestedStatus,
  requestedPublished,
  requestedScheduledFor,
  requestedStage,
}: {
  existing: Pick<Post, 'status' | 'publishedAt' | 'scheduledFor' | 'archivedAt' | 'stage'>;
  content: string;
  requestedStatus?: unknown;
  requestedPublished?: unknown;
  requestedScheduledFor?: unknown;
  requestedStage?: unknown;
}) {
  const normalizedRequestedStage = normalizeBlogStage(requestedStage, existing.stage as BlogStageValue);
  const statusFromStage = stageImpliesStatus(normalizedRequestedStage);
  const lifecycle = resolvePostLifecycle({
    status: requestedStatus ?? statusFromStage ?? undefined,
    published: requestedPublished,
    scheduledFor: requestedScheduledFor,
    content,
    existing: {
      status: existing.status as typeof existing.status,
      publishedAt: existing.publishedAt,
      scheduledFor: existing.scheduledFor,
      archivedAt: existing.archivedAt,
    },
  });

  if (!lifecycle.ok) {
    return lifecycle;
  }

  return {
    ...lifecycle,
    stage: resolveBlogStage({
      stageInput: requestedStage ?? normalizedRequestedStage,
      status: lifecycle.status,
      fallback: existing.stage as BlogStageValue,
    }),
  };
}
