import { NextRequest, NextResponse } from 'next/server';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { deriveLifecycleAndStage, revalidatePostPaths } from '@/lib/server/blogMutation';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.flatMap((entry) => (typeof entry === 'string' && entry.trim() ? [entry.trim()] : []))
    : [];

type BulkAction =
  | 'set-stage'
  | 'set-category'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'unarchive';

export async function POST(req: NextRequest) {
  const token = await requireAdmin(req);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const ids = Array.from(new Set(asStringArray(body.ids)));
  const action = asText(body.action) as BulkAction;

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Select at least one post.' }, { status: 400 });
  }

  const posts = await prisma.post.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      slug: true,
      content: true,
      category: true,
      status: true,
      stage: true,
      publishedAt: true,
      scheduledFor: true,
      archivedAt: true,
    },
  });

  if (posts.length !== ids.length) {
    return NextResponse.json({ error: 'One or more posts could not be found.' }, { status: 404 });
  }

  const updatedPosts = await prisma.$transaction(async (tx) => {
    const updates = [];

    for (const post of posts) {
      if (action === 'set-category') {
        updates.push(
          await tx.post.update({
            where: { id: post.id },
            data: {
              category: normalizeBlogCategory(body.category),
            },
            select: {
              id: true,
              slug: true,
            },
          }),
        );
        continue;
      }

      const lifecycle = deriveLifecycleAndStage({
        existing: post,
        content: post.content,
        requestedStatus:
          action === 'set-stage'
            ? asText(body.stage) === 'PUBLISHED'
              ? 'PUBLISHED'
              : asText(body.stage) === 'ARCHIVED'
                ? 'ARCHIVED'
                : 'DRAFT'
            : action === 'publish'
              ? 'PUBLISHED'
              : action === 'unpublish' || action === 'unarchive'
                ? 'DRAFT'
                : action === 'archive'
                  ? 'ARCHIVED'
                  : undefined,
        requestedStage:
          action === 'set-stage'
            ? body.stage
            : action === 'archive'
              ? 'ARCHIVED'
              : action === 'publish'
                ? 'PUBLISHED'
                : 'DRAFT',
      });

      if (!lifecycle.ok) {
        throw new Error(lifecycle.error);
      }

      updates.push(
        await tx.post.update({
          where: { id: post.id },
          data: {
            stage: lifecycle.stage,
            status: lifecycle.status,
            publishedAt: lifecycle.publishedAt,
            scheduledFor: lifecycle.scheduledFor,
            archivedAt: lifecycle.archivedAt,
            published: lifecycle.published,
          },
          select: {
            id: true,
            slug: true,
          },
        }),
      );
    }

    return updates;
  }).catch((error) =>
    error instanceof Error
      ? { error: error.message }
      : { error: 'Unable to update the selected posts.' },
  );

  if ('error' in updatedPosts) {
    return NextResponse.json({ error: updatedPosts.error }, { status: 400 });
  }

  updatedPosts.forEach((post) => revalidatePostPaths(post));
  return NextResponse.json({ ok: true, count: updatedPosts.length });
}
