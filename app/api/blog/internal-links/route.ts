import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);

  if (!token) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const excludeId = searchParams.get('excludeId')?.trim() ?? '';

  if (query.length === 0) {
    return NextResponse.json({ posts: [] });
  }

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        excludeId ? { id: { not: excludeId } } : {},
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { focusKeyword: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      focusKeyword: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      focusKeyword: post.focusKeyword,
      status: post.status,
      href: `/blog/${post.slug}`,
      markdown: `[${post.title}](/blog/${post.slug})`,
      updatedAt: post.updatedAt.toISOString(),
    })),
  });
}
