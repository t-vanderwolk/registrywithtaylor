import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Roles } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/blog';
import prisma from '@/lib/prisma';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.role !== Roles.ADMIN) {
    return null;
  }

  return token;
};

const toDraftShape = (post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt ?? '',
  coverImageUrl: post.coverImage ?? '',
  content: post.content,
  status: post.published ? 'published' : 'draft',
  createdAt: post.createdAt.getTime(),
  updatedAt: post.updatedAt.getTime(),
});

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ drafts: posts.map(toDraftShape) });
}

export async function POST(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = await generateUniqueSlug(`untitled-post-${Date.now()}`);
  const post = await prisma.post.create({
    data: {
      title: 'Untitled post',
      slug,
      excerpt: '',
      coverImage: '',
      content: 'Start writing...',
      published: false,
      authorId: token.id as string,
    },
  });

  return NextResponse.json({ draft: toDraftShape(post) }, { status: 201 });
}
