import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { generateUniqueSlug } from '@/lib/blog';
import { Roles } from '@/lib/auth';
import prisma from '@/lib/prisma';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.role !== Roles.ADMIN) {
    return null;
  }

  return token;
};

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};
const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (token?.role !== Roles.ADMIN && !post.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await requireAdmin(req);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  if (nextPublished && !nextContent) {
    return NextResponse.json({ error: 'Content is required before publishing' }, { status: 400 });
  }

  const slugSeed = shouldUpdateSlug ? asText(body.slug) || nextTitle : existingPost.slug;
  const slug = shouldUpdateSlug ? await generateUniqueSlug(slugSeed, id) : existingPost.slug;
  const post = await prisma.post.update({
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

  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = await requireAdmin(req);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
