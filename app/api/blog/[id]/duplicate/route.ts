import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueSlug } from '@/lib/server/blog';
import { revalidatePostPaths } from '@/lib/server/blogMutation';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await requireAdmin(req);

  if (!token?.id) {
    return unauthorizedResponse();
  }

  const source = await prisma.post.findUnique({
    where: { id },
    include: {
      media: {
        select: { id: true },
      },
      affiliates: {
        select: { affiliateId: true },
      },
    },
  });

  if (!source) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const title = `${source.title} (Copy)`;
  const slug = await generateUniqueSlug(title);

  const duplicated = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        title,
        slug,
        category: source.category,
        stage: 'DRAFT',
        content: source.content,
        deck: source.deck,
        excerpt: source.excerpt,
        focusKeyword: source.focusKeyword,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        canonicalUrl: source.canonicalUrl,
        coverImage: source.coverImage,
        featuredImageId: source.featuredImageId,
        media: source.media.length > 0 ? { connect: source.media.map((entry) => ({ id: entry.id })) } : undefined,
        status: 'DRAFT',
        publishedAt: null,
        scheduledFor: null,
        archivedAt: null,
        featured: false,
        published: false,
        authorId: token.id as string,
      },
    });

    if (source.affiliates.length > 0) {
      await tx.blogPostAffiliate.createMany({
        data: source.affiliates.map((entry) => ({
          blogPostId: created.id,
          affiliateId: entry.affiliateId,
        })),
        skipDuplicates: true,
      });
    }

    return created;
  });

  revalidatePostPaths(duplicated);
  return NextResponse.json({ id: duplicated.id, slug: duplicated.slug }, { status: 201 });
}
