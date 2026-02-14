import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { Roles } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/blog';

const getSessionToken = async (req: NextRequest) =>
  getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

export async function GET(req: NextRequest) {
  const token = await getSessionToken(req);
  const where = token?.role === Roles.ADMIN ? undefined : { published: true };

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
  const token = await getSessionToken(req);

  if (token?.role !== Roles.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() || null : null;
  const published = Boolean(body.published);

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(title);
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      published,
      authorId: token.id as string,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
