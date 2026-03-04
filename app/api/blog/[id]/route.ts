import { NextRequest, NextResponse } from 'next/server';
import { isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { generateUniqueSlug } from '@/lib/server/blog';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import { deriveLifecycleAndStage, revalidatePostPaths } from '@/lib/server/blogMutation';
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

type ImageInput = {
  url: string;
  alt: string | null;
};

const isValidImageUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith('/');

const asImageArray = (value: unknown): ImageInput[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .flatMap((entry) => {
      if (!entry || typeof entry !== 'object') {
        return [];
      }

      const candidate = entry as { url?: unknown; alt?: unknown };
      const url = asText(candidate.url);
      if (!url || !isValidImageUrl(url)) {
        return [];
      }

      const alt = asNullableText(candidate.alt);
      return [{ url, alt }];
    })
    .filter((entry, index, collection) => collection.findIndex((candidate) => candidate.url === entry.url) === index);
};

type PostWithAffiliateIds = {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  deck: string | null;
  excerpt: string | null;
  focusKeyword: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  featuredImageUrl: string | null;
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
  images: Array<{
    id: number;
    url: string;
    alt: string | null;
    createdAt: Date;
  }>;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  stage: 'IDEA' | 'OUTLINE' | 'DRAFT' | 'READY' | 'PUBLISHED' | 'ARCHIVED';
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
  focusKeyword: post.focusKeyword,
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
  canonicalUrl: post.canonicalUrl,
  featuredImageUrl: post.featuredImageUrl,
  coverImage: post.coverImage,
  featuredImageId: post.featuredImageId,
  featuredImage: post.featuredImage,
  mediaIds: post.media.map((entry) => entry.id),
  media: post.media,
  images: post.images,
  status: post.status,
  stage: post.stage,
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
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
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
  const nextFocusKeyword = hasOwn(body, 'focusKeyword') ? asNullableText(body.focusKeyword) : existingPost.focusKeyword;
  const nextSeoTitle = hasOwn(body, 'seoTitle') ? asNullableText(body.seoTitle) : existingPost.seoTitle;
  const nextSeoDescription = hasOwn(body, 'seoDescription')
    ? asNullableText(body.seoDescription)
    : existingPost.seoDescription;
  const nextCanonicalUrl = hasOwn(body, 'canonicalUrl') ? asNullableText(body.canonicalUrl) : existingPost.canonicalUrl;
  const nextFeaturedImageUrl = hasOwn(body, 'featuredImageUrl')
    ? asNullableText(body.featuredImageUrl)
    : existingPost.featuredImageUrl;
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
  const nextImages = hasOwn(body, 'images') ? asImageArray(body.images) : null;
  const lifecycle = deriveLifecycleAndStage({
    existing: {
      status: existingPost.status,
      publishedAt: existingPost.publishedAt,
      scheduledFor: existingPost.scheduledFor,
      archivedAt: existingPost.archivedAt,
      stage: existingPost.stage,
    },
    requestedStatus: hasOwn(body, 'status') ? body.status : undefined,
    requestedPublished: hasOwn(body, 'published') ? body.published : undefined,
    requestedScheduledFor: hasOwn(body, 'scheduledFor') ? body.scheduledFor : undefined,
    requestedStage: hasOwn(body, 'stage') ? body.stage : undefined,
    content: nextContent,
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
        focusKeyword: nextFocusKeyword,
        seoTitle: nextSeoTitle,
        seoDescription: nextSeoDescription,
        canonicalUrl: nextCanonicalUrl,
        featuredImageUrl: nextFeaturedImageUrl,
        coverImage: nextCoverImage,
        featuredImageId: nextFeaturedImageId,
        media: nextMediaIds !== null ? { set: nextMediaIds.map((mediaId) => ({ id: mediaId })) } : undefined,
        stage: lifecycle.stage,
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

    if (nextImages !== null) {
      await tx.postImage.deleteMany({ where: { postId: id } });
      if (nextImages.length > 0) {
        await tx.postImage.createMany({
          data: nextImages.map((image) => ({
            postId: id,
            url: image.url,
            alt: image.alt,
          })),
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
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            createdAt: true,
          },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
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

  revalidatePostPaths(post);

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

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existingPost) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });
  revalidatePostPaths(existingPost);
  return NextResponse.json({ ok: true });
}
