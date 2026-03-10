import { NextRequest, NextResponse } from 'next/server';
import { normalizeAuthorAssignments } from '@/lib/blog/authors';
import { estimateReadingTimeFromContent } from '@/lib/blog/contentText';
import { isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { generateUniqueSlug } from '@/lib/server/blog';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import {
  resolveAffiliateBrandIdsFromLegacyAffiliateIds,
  resolveLegacyAffiliateIdsFromBrandIds,
} from '@/lib/server/affiliateBrands';
import { deriveLifecycleAndStage, revalidatePostPaths } from '@/lib/server/blogMutation';
import { postEditorSelect, toPostEditorRecord } from '@/lib/server/postEditorRecord';
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await getRequestToken(req);
  const post = await prisma.post.findUnique({
    where: { id },
    select: postEditorSelect,
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

  return NextResponse.json(toPostEditorRecord(post));
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

  const existingPost = await prisma.post.findUnique({ where: { id }, select: postEditorSelect });
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
  const nextShareTitle = hasOwn(body, 'shareTitle') ? asNullableText(body.shareTitle) : existingPost.shareTitle;
  const nextShareDescription = hasOwn(body, 'shareDescription')
    ? asNullableText(body.shareDescription)
    : existingPost.shareDescription;
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
  const requestedAffiliateBrandIds = hasOwn(body, 'affiliateBrandIds')
    ? Array.from(new Set(asStringArray(body.affiliateBrandIds)))
    : null;
  const nextAffiliateIds = hasOwn(body, 'affiliateIds')
    ? Array.from(new Set(asStringArray(body.affiliateIds)))
    : null;
  const nextImages = hasOwn(body, 'images') ? asImageArray(body.images) : null;
  const nextAuthors = hasOwn(body, 'authors')
    ? normalizeAuthorAssignments(
        Array.isArray(body.authors) ? (body.authors as Array<{ userId?: string | null; role?: unknown }>) : [],
        existingPost.authorId,
      )
    : normalizeAuthorAssignments(existingPost.authorships, existingPost.authorId);
  const nextPrimaryAuthorId =
    nextAuthors.find((author) => author.role === 'Primary Author')?.userId ?? existingPost.authorId;
  const nextReadingTime = estimateReadingTimeFromContent(nextContent);
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
  const nextResolvedAffiliateBrandIds =
    requestedAffiliateBrandIds !== null
      ? requestedAffiliateBrandIds
      : nextAffiliateIds !== null
        ? await resolveAffiliateBrandIdsFromLegacyAffiliateIds(nextAffiliateIds)
        : null;
  const nextResolvedLegacyAffiliateIds =
    nextAffiliateIds !== null
      ? nextAffiliateIds
      : nextResolvedAffiliateBrandIds !== null
        ? await resolveLegacyAffiliateIdsFromBrandIds(nextResolvedAffiliateBrandIds)
        : null;
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
        readingTime: nextReadingTime,
        shareTitle: nextShareTitle,
        shareDescription: nextShareDescription,
        featuredImageUrl: nextFeaturedImageUrl,
        coverImage: nextCoverImage,
        featuredImageId: nextFeaturedImageId,
        media: nextMediaIds !== null ? { set: nextMediaIds.map((mediaId) => ({ id: mediaId })) } : undefined,
        affiliateBrands:
          nextResolvedAffiliateBrandIds !== null
            ? { set: nextResolvedAffiliateBrandIds.map((brandId) => ({ id: brandId })) }
            : undefined,
        stage: lifecycle.stage,
        status: lifecycle.status,
        publishedAt: lifecycle.publishedAt,
        scheduledFor: lifecycle.scheduledFor,
        archivedAt: lifecycle.archivedAt,
        featured: nextFeatured,
        published: lifecycle.published,
        authorId: nextPrimaryAuthorId,
      },
    });

    if (hasOwn(body, 'authors')) {
      await tx.postAuthor.deleteMany({ where: { postId: id } });
      if (nextAuthors.length > 0) {
        await tx.postAuthor.createMany({
          data: nextAuthors.map((author) => ({
            postId: id,
            userId: author.userId,
            role: author.role,
          })),
          skipDuplicates: true,
        });
      }
    }

    if (nextResolvedLegacyAffiliateIds !== null) {
      await tx.blogPostAffiliate.deleteMany({ where: { blogPostId: id } });

      if (nextResolvedLegacyAffiliateIds.length > 0) {
        await tx.blogPostAffiliate.createMany({
          data: nextResolvedLegacyAffiliateIds.map((affiliateId) => ({
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
      select: postEditorSelect,
    });
  });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  revalidatePostPaths(post);

  return NextResponse.json(toPostEditorRecord(post));
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
