import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueSlug } from '@/lib/server/blog';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const asNullableText = (value: unknown) => {
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
  content: string;
  excerpt: string | null;
  coverImage: string | null;
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
  content: post.content,
  excerpt: post.excerpt,
  coverImage: post.coverImage,
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

  if (token?.role !== 'ADMIN' && !post.published) {
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
  const nextContent = hasOwn(body, 'content') ? asText(body.content) : existingPost.content;
  const nextExcerpt = hasOwn(body, 'excerpt') ? asNullableText(body.excerpt) : existingPost.excerpt;
  const nextCoverImage = hasOwn(body, 'coverImage') ? asNullableText(body.coverImage) : existingPost.coverImage;
  const nextPublished = hasOwn(body, 'published') ? Boolean(body.published) : existingPost.published;
  const nextAffiliateIds = hasOwn(body, 'affiliateIds')
    ? Array.from(new Set(asStringArray(body.affiliateIds)))
    : null;

  if (nextPublished && !nextContent) {
    return NextResponse.json({ error: 'Content is required before publishing' }, { status: 400 });
  }

  const slugSeed = shouldUpdateSlug ? asText(body.slug) || nextTitle : existingPost.slug;
  const slug = shouldUpdateSlug ? await generateUniqueSlug(slugSeed, id) : existingPost.slug;
  const post = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        title: nextTitle,
        slug,
        content: nextContent,
        excerpt: nextExcerpt,
        coverImage: nextCoverImage,
        published: nextPublished,
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
