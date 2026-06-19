import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { forbiddenResponse, requireAdminMutation, unauthorizedResponse } from '@/lib/server/apiAuth';

export const runtime = 'nodejs';

// Only the manually-curated quiz dimensions may be edited here.
const QUIZ_FIELDS = [
  'priceRange',
  'lifestyle',
  'foldType',
  'isExpandable',
  'maxWeightLbs',
  'ownWeightLbs',
  'suitableFromBirth',
  'suitableForJogging',
  'budgetMin',
  'budgetMax',
] as const;

/**
 * PATCH /api/admin/stroller-specs/[strollerId]
 * Body: Partial<StrollerSpec quiz fields>. Admin-only. Upserts the spec.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ strollerId: string }> },
) {
  let token;
  try {
    token = await requireAdminMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }
  if (!token) return unauthorizedResponse();

  const { strollerId } = await params;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const key of QUIZ_FIELDS) {
    if (key in body) data[key] = body[key];
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No editable spec fields provided' }, { status: 400 });
  }

  // Ensure the stroller exists before creating a spec for it.
  const stroller = await prisma.stroller.findUnique({ where: { id: strollerId }, select: { id: true } });
  if (!stroller) {
    return NextResponse.json({ error: 'Stroller not found' }, { status: 404 });
  }

  const spec = await prisma.strollerSpec.upsert({
    where: { strollerId },
    create: { strollerId, ...data },
    update: data,
  });

  return NextResponse.json({ spec });
}
