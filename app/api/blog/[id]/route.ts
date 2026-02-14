import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { Roles } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/blog';

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.role !== Roles.ADMIN) {
    return null;
  }
  return token;
};

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

  const body = await req.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() || null : null;
  const published = Boolean(body.published);

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(title, id);
  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      excerpt,
      published,
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
