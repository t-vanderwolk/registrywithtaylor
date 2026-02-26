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
const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

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
  const published = Boolean(body.published);

  if (published && !content) {
    return NextResponse.json({ error: 'Content is required before publishing' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(slugInput || title);
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content: content || '',
      excerpt,
      coverImage,
      published,
      authorId: token.id as string,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
