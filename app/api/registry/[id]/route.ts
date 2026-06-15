import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

type RouteContext = { params: { id: string } };

// ─── PATCH /api/registry/[id] ─────────────────────────────────────────────────

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const existing = await prisma.registry.findUnique({
    where:  { id: params.id },
    select: { userId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, url, itemCount, completedCount, notes } = body as Record<string, unknown>;

  // Validate URL if provided
  if (url !== undefined) {
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'URL cannot be empty' }, { status: 400 });
    }
    try {
      new URL(url as string);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined)           data.name           = typeof name === 'string' ? name.trim() || null : null;
  if (url !== undefined)            data.url            = (url as string).trim();
  if (itemCount !== undefined)      data.itemCount      = typeof itemCount === 'number' && itemCount > 0 ? itemCount : null;
  if (completedCount !== undefined) data.completedCount = typeof completedCount === 'number' && completedCount >= 0 ? completedCount : null;
  if (notes !== undefined)          data.notes          = typeof notes === 'string' ? notes.trim() || null : null;

  const registry = await prisma.registry.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ registry });
}

// ─── DELETE /api/registry/[id] ───────────────────────────────────────────────

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const existing = await prisma.registry.findUnique({
    where:  { id: params.id },
    select: { userId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.registry.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
