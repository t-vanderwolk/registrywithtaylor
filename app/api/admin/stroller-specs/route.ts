import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stroller-specs
 * Returns StrollerSpec rows that still need manual curation (a core quiz
 * dimension is null/empty). Admin-only.
 */
export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) return unauthorizedResponse();

  const specs = await prisma.strollerSpec.findMany({
    where: {
      OR: [{ priceRange: null }, { foldType: null }, { lifestyle: { isEmpty: true } }],
    },
    include: {
      stroller: { select: { id: true, brand: true, model: true, displayName: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ specs, total: specs.length });
}
