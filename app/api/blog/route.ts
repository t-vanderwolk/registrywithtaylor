import { NextRequest, NextResponse } from 'next/server';
import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { DEFAULT_BLOG_CATEGORY, normalizeBlogCategory } from '@/lib/blogCategories';
import { generateUniqueSlug } from '@/lib/server/blog';
import { resolvePostLifecycle } from '@/lib/server/blogPostLifecycle';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};
const asNullableId = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};
const asStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .flatMap((entry) => (typeof entry === 'string' ? [entry.trim()] : []))
    .filter((entry) => entry.length > 0);
};

export async function GET(req: NextRequest) {
  const token = await getRequestToken(req);
  const where = token?.role === 'ADMIN' ? undefined : getPublicPostWhere();

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const token = await requireAdmin(req);

  if (!token?.id) {
    return unauthorizedResponse();
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const titleInput = asText(body.title);
  const title = titleInput || 'Untitled post';
  const slugInput = asText(body.slug);
  const excerpt = asNullableText(body.excerpt);
  const coverImage = asNullableText(body.coverImage);
  const content = asText(body.content);
  const category = normalizeBlogCategory(body.category);
  const featuredImageId = asNullableId(body.featuredImageId);
  const mediaIds = Array.from(new Set(asStringArray(body.mediaIds)));
  const affiliateIds = Array.from(new Set(asStringArray(body.affiliateIds)));
  const deck = asNullableText(body.deck);
  const featured = Boolean(body.featured);
  const lifecycle = resolvePostLifecycle({
    status: body.status,
    published: body.published,
    scheduledFor: body.scheduledFor,
    content,
  });

  if (!lifecycle.ok) {
    return NextResponse.json({ error: lifecycle.error }, { status: 400 });
  }

  const slug = await generateUniqueSlug(slugInput || title);
  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        title,
        slug,
        category: category || DEFAULT_BLOG_CATEGORY,
        content: content || '',
        deck,
        excerpt,
        coverImage,
        featuredImageId,
        media: mediaIds.length > 0 ? { connect: mediaIds.map((id) => ({ id })) } : undefined,
        status: lifecycle.status,
        publishedAt: lifecycle.publishedAt,
        scheduledFor: lifecycle.scheduledFor,
        archivedAt: lifecycle.archivedAt,
        featured,
        published: lifecycle.published,
        authorId: token.id as string,
      },
    });

    if (affiliateIds.length > 0) {
      await tx.blogPostAffiliate.createMany({
        data: affiliateIds.map((affiliateId) => ({
          blogPostId: created.id,
          affiliateId,
        })),
        skipDuplicates: true,
      });
    }

    return tx.post.findUnique({
      where: { id: created.id },
      include: {
        featuredImage: {
          select: {
            id: true,
            url: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
        },
        media: {
          select: {
            id: true,
            url: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
        },
        affiliates: {
          select: {
            affiliateId: true,
          },
        },
      },
    });
  });

  if (!post) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  return NextResponse.json(
    {
      ...post,
      deck: post.deck,
      status: post.status,
      publishedAt: post.publishedAt,
      scheduledFor: post.scheduledFor,
      archivedAt: post.archivedAt,
      featured: post.featured,
      featuredImageId: post.featuredImageId,
      mediaIds: post.media.map((entry) => entry.id),
      affiliateIds: post.affiliates.map((entry) => entry.affiliateId),
    },
    { status: 201 },
  );
}
