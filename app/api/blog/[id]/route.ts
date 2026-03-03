import { NextRequest, NextResponse } from 'next/server';
import { isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
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
const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);
const asStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .flatMap((entry) => (typeof entry === 'string' ? [entry.trim()] : []))
    .filter((entry) => entry.length > 0);
};

type PostWithAffiliateIds = {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  deck: string | null;
  excerpt: string | null;
  coverImage: string | null;
  featuredImageId: string | null;
  featuredImage: {
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  } | null;
  media: Array<{
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
  featured: boolean;
  published: boolean;
  authorId: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  affiliates: Array<{ affiliateId: string }>;
};

const toResponsePost = (post: PostWithAffiliateIds) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  category: post.category,
  content: post.content,
  deck: post.deck,
  excerpt: post.excerpt,
  coverImage: post.coverImage,
  featuredImageId: post.featuredImageId,
  featuredImage: post.featuredImage,
  mediaIds: post.media.map((entry) => entry.id),
  media: post.media,
  status: post.status,
  publishedAt: post.publishedAt,
  scheduledFor: post.scheduledFor,
  archivedAt: post.archivedAt,
  featured: post.featured,
  published: post.published,
  authorId: post.authorId,
  views: post.views,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  affiliateIds: post.affiliates.map((entry) => entry.affiliateId),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await getRequestToken(req);
  const post = await prisma.post.findUnique({
    where: { id },
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

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (
    token?.role !== 'ADMIN' &&
    !isPostPubliclyVisible(post.status, post.scheduledFor)
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(toResponsePost(post));
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await requireAdmin(req);

  if (!token) {
    return unauthorizedResponse();
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const shouldUpdateSlug = hasOwn(body, 'slug') || hasOwn(body, 'title');
  const nextTitle = hasOwn(body, 'title') ? asText(body.title) || 'Untitled post' : existingPost.title;
  const nextCategory = hasOwn(body, 'category') ? normalizeBlogCategory(body.category) : existingPost.category;
  const nextContent = hasOwn(body, 'content') ? asText(body.content) : existingPost.content;
  const nextDeck = hasOwn(body, 'deck') ? asNullableText(body.deck) : existingPost.deck;
  const nextExcerpt = hasOwn(body, 'excerpt') ? asNullableText(body.excerpt) : existingPost.excerpt;
  const nextCoverImage = hasOwn(body, 'coverImage') ? asNullableText(body.coverImage) : existingPost.coverImage;
  const nextFeaturedImageId = hasOwn(body, 'featuredImageId')
    ? asNullableId(body.featuredImageId)
    : existingPost.featuredImageId;
  const nextMediaIds = hasOwn(body, 'mediaIds')
    ? Array.from(new Set(asStringArray(body.mediaIds)))
    : null;
  const nextFeatured = hasOwn(body, 'featured') ? Boolean(body.featured) : existingPost.featured;
  const nextAffiliateIds = hasOwn(body, 'affiliateIds')
    ? Array.from(new Set(asStringArray(body.affiliateIds)))
    : null;
  const lifecycle = resolvePostLifecycle({
    status: hasOwn(body, 'status') ? body.status : undefined,
    published: hasOwn(body, 'published') ? body.published : undefined,
    scheduledFor: hasOwn(body, 'scheduledFor') ? body.scheduledFor : undefined,
    content: nextContent,
    existing: {
      status: existingPost.status,
      publishedAt: existingPost.publishedAt,
      scheduledFor: existingPost.scheduledFor,
      archivedAt: existingPost.archivedAt,
    },
  });

  if (!lifecycle.ok) {
    return NextResponse.json({ error: lifecycle.error }, { status: 400 });
  }

  const slugSeed = shouldUpdateSlug ? asText(body.slug) || nextTitle : existingPost.slug;
  const slug = shouldUpdateSlug ? await generateUniqueSlug(slugSeed, id) : existingPost.slug;
  const post = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        title: nextTitle,
        slug,
        category: nextCategory,
        content: nextContent,
        deck: nextDeck,
        excerpt: nextExcerpt,
        coverImage: nextCoverImage,
        featuredImageId: nextFeaturedImageId,
        media: nextMediaIds !== null ? { set: nextMediaIds.map((mediaId) => ({ id: mediaId })) } : undefined,
        status: lifecycle.status,
        publishedAt: lifecycle.publishedAt,
        scheduledFor: lifecycle.scheduledFor,
        archivedAt: lifecycle.archivedAt,
        featured: nextFeatured,
        published: lifecycle.published,
      },
    });

    if (nextAffiliateIds !== null) {
      await tx.blogPostAffiliate.deleteMany({ where: { blogPostId: id } });

      if (nextAffiliateIds.length > 0) {
        await tx.blogPostAffiliate.createMany({
          data: nextAffiliateIds.map((affiliateId) => ({
            blogPostId: id,
            affiliateId,
          })),
          skipDuplicates: true,
        });
      }
    }

    return tx.post.findUnique({
      where: { id },
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
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(toResponsePost(post));
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await requireAdmin(req);

  if (!token) {
    return unauthorizedResponse();
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
