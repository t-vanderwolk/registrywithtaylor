import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { generateUniqueSlug } from '@/lib/blog';
import { Roles } from '@/lib/auth';
import prisma from '@/lib/prisma';

type AdminBlogRouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(req: NextRequest, context: AdminBlogRouteContext) {
  const token = await requireAdmin(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const post = await prisma.post.findUnique({
    where: { id },
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
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ draft: toDraftShape(post) });
}

export async function PATCH(req: NextRequest, context: AdminBlogRouteContext) {
  const token = await requireAdmin(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextTitle = hasOwn(body, 'title') ? asText(body.title) || 'Untitled post' : post.title;
  const nextContent = hasOwn(body, 'content') ? asText(body.content) : post.content;
  const nextExcerpt = hasOwn(body, 'excerpt') ? asNullableText(body.excerpt) : post.excerpt;
  const nextCoverImage = hasOwn(body, 'coverImageUrl') ? asNullableText(body.coverImageUrl) : post.coverImage;
  const nextPublished = hasOwn(body, 'status')
    ? body.status === 'published'
    : hasOwn(body, 'published')
      ? Boolean(body.published)
      : post.published;

  if (nextPublished && !nextContent) {
    return NextResponse.json({ error: 'Content is required before publishing' }, { status: 400 });
  }

  const shouldUpdateSlug = hasOwn(body, 'slug') || hasOwn(body, 'title');
  const slugSeed = shouldUpdateSlug ? asText(body.slug) || nextTitle : post.slug;
  const slug = shouldUpdateSlug ? await generateUniqueSlug(slugSeed, id) : post.slug;

  const updated = await prisma.post.update({
    where: { id },
    data: {
      title: nextTitle,
      slug,
      excerpt: nextExcerpt,
      coverImage: nextCoverImage,
      content: nextContent,
      published: nextPublished,
    },
  });

  return NextResponse.json({ draft: toDraftShape(updated) });
}

export async function DELETE(req: NextRequest, context: AdminBlogRouteContext) {
  const token = await requireAdmin(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  try {
    await prisma.post.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
