import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { forbiddenResponse, requireAdminMutation, unauthorizedResponse } from '@/lib/server/apiAuth';

export const runtime = 'nodejs';

/**
 * PATCH /api/admin/strollers/[id]
 * Body: { babylistSku?: string | null }
 * Sets the hand-mapped Babylist CatalogItemId on a stroller. Admin-only.
 * The next sync resolves this SKU exactly (no fuzzy matching).
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let token;
  try {
    token = await requireAdminMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }
  if (!token) return unauthorizedResponse();

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { babylistSku?: unknown } | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const raw = typeof body.babylistSku === 'string' ? body.babylistSku.trim() : '';
  const babylistSku = raw.length > 0 ? raw : null;

  const stroller = await prisma.stroller
    .update({
      where: { id },
      data: { babylistSku },
      select: { id: true, brand: true, model: true, babylistSku: true },
    })
    .catch(() => null);

  if (!stroller) {
    return NextResponse.json({ error: 'Stroller not found' }, { status: 404 });
  }

  return NextResponse.json({ stroller });
}
