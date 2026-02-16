import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { generateUniqueSlug } from '@/lib/blog';
import { Roles } from '@/lib/auth';
import prisma from '@/lib/prisma';

const getSessionToken = async (req: NextRequest) =>
  getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

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
  const title = asText(body.title);
  const slugInput = asText(body.slug);
  const excerpt = asText(body.excerpt) || null;
  const content = asText(body.content);
  const published = Boolean(body.published);

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(slugInput || title);
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
