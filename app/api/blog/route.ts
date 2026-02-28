import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BLOG_CATEGORY, normalizeBlogCategory } from '@/lib/blogCategories';
import { generateUniqueSlug } from '@/lib/server/blog';
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
  const where = token?.role === 'ADMIN' ? undefined : { published: true };

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
  const published = Boolean(body.published);
  const affiliateIds = Array.from(new Set(asStringArray(body.affiliateIds)));

  if (published && !content) {
    return NextResponse.json({ error: 'Content is required before publishing' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(slugInput || title);
  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        title,
        slug,
        category: category || DEFAULT_BLOG_CATEGORY,
        content: content || '',
        excerpt,
        coverImage,
        featuredImageId,
        media: mediaIds.length > 0 ? { connect: mediaIds.map((id) => ({ id })) } : undefined,
        published,
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
      featuredImageId: post.featuredImageId,
      mediaIds: post.media.map((entry) => entry.id),
      affiliateIds: post.affiliates.map((entry) => entry.affiliateId),
    },
    { status: 201 },
  );
}
