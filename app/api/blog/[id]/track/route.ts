import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const normalizeEvent = (type: unknown) => {
  if (typeof type !== 'string') {
    return null;
  }

  const lower = type.toLowerCase();
  if (lower === 'view') {
    return 'VIEW';
  }
  if (lower === 'click') {
    return 'CLICK';
  }
  if (lower === 'affiliate_click') {
    return 'AFFILIATE_CLICK';
  }

  return null;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await req.json();
  const event = normalizeEvent(body.type);

  if (!event) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    const updated =
      event === 'VIEW'
        ? await prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
            select: { id: true, views: true },
          })
        : await prisma.post.findUniqueOrThrow({
            where: { id },
            select: { id: true, views: true },
          });

    await prisma.postAnalytics.create({
      data: {
        postId: id,
        event,
        meta: body.meta ?? null,
      },
    });

    const affiliateClicks = await prisma.postAnalytics.count({
      where: { postId: id, event: 'AFFILIATE_CLICK' },
    });

    return NextResponse.json({
      postId: updated.id,
      views: updated.views,
      affiliateClicks,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    throw error;
  }
}
