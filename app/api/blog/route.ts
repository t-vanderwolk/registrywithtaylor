import { NextRequest, NextResponse } from 'next/server';
import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { DEFAULT_BLOG_CATEGORY, normalizeBlogCategory } from '@/lib/blogCategories';
import { generateUniqueSlug } from '@/lib/server/blog';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import {
  resolveAffiliateBrandIdsFromLegacyAffiliateIds,
  resolveLegacyAffiliateIdsFromBrandIds,
} from '@/lib/server/affiliateBrands';
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
  const requestedAffiliateBrandIds = Array.from(new Set(asStringArray(body.affiliateBrandIds)));
  const affiliateIds = Array.from(new Set(asStringArray(body.affiliateIds)));
  const deck = asNullableText(body.deck);
  const focusKeyword = asNullableText(body.focusKeyword);
  const seoTitle = asNullableText(body.seoTitle);
  const seoDescription = asNullableText(body.seoDescription);
  const canonicalUrl = asNullableText(body.canonicalUrl);
  const featuredImageUrl = asNullableText(body.featuredImageUrl);
  const featured = Boolean(body.featured);
  const images = asImageArray(body.images);
  const lifecycle = deriveLifecycleAndStage({
    existing: {
      status: 'DRAFT',
      publishedAt: null,
      scheduledFor: null,
      archivedAt: null,
      stage: 'DRAFT',
    },
    requestedStatus: body.status,
    requestedPublished: body.published,
    requestedScheduledFor: body.scheduledFor,
    requestedStage: body.stage,
    content,
  });

  if (!lifecycle.ok) {
    return NextResponse.json({ error: lifecycle.error }, { status: 400 });
  }

  const slug = await generateUniqueSlug(slugInput || title);
  const affiliateBrandIds =
    requestedAffiliateBrandIds.length > 0
      ? requestedAffiliateBrandIds
      : await resolveAffiliateBrandIdsFromLegacyAffiliateIds(affiliateIds);
  const legacyAffiliateIds =
    affiliateIds.length > 0 ? affiliateIds : await resolveLegacyAffiliateIdsFromBrandIds(affiliateBrandIds);
  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        title,
        slug,
        category: category || DEFAULT_BLOG_CATEGORY,
        content: content || '',
        deck,
        excerpt,
        focusKeyword,
        seoTitle,
        seoDescription,
        canonicalUrl,
        featuredImageUrl,
        coverImage,
        featuredImageId,
        media: mediaIds.length > 0 ? { connect: mediaIds.map((id) => ({ id })) } : undefined,
        images: images.length > 0 ? { create: images } : undefined,
        affiliateBrands:
          affiliateBrandIds.length > 0
            ? {
                connect: affiliateBrandIds.map((id) => ({ id })),
              }
            : undefined,
        stage: lifecycle.stage,
        status: lifecycle.status,
        publishedAt: lifecycle.publishedAt,
        scheduledFor: lifecycle.scheduledFor,
        archivedAt: lifecycle.archivedAt,
        featured,
        published: lifecycle.published,
        authorId: token.id as string,
      },
    });

    if (legacyAffiliateIds.length > 0) {
      await tx.blogPostAffiliate.createMany({
        data: legacyAffiliateIds.map((affiliateId) => ({
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
        affiliateBrands: {
          select: {
            id: true,
          },
        },
      },
    });
  });

  if (!post) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  revalidatePostPaths(post);

  return NextResponse.json(
    {
      ...post,
      deck: post.deck,
      focusKeyword: post.focusKeyword,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      canonicalUrl: post.canonicalUrl,
      featuredImageUrl: post.featuredImageUrl,
      stage: post.stage,
      status: post.status,
      publishedAt: post.publishedAt,
      scheduledFor: post.scheduledFor,
      archivedAt: post.archivedAt,
      featured: post.featured,
      featuredImageId: post.featuredImageId,
      mediaIds: post.media.map((entry) => entry.id),
      images: post.images,
      affiliateBrandIds: post.affiliateBrands.map((entry) => entry.id),
      affiliateIds: post.affiliates.map((entry) => entry.affiliateId),
    },
    { status: 201 },
  );
}
