import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/babylist/search?q=uppababy+vista
 * Searches the local Babylist catalog mirror (BabylistCatalogItem). Admin-only.
 * Returns up to 15 candidates so an admin can click one to assign its SKU.
 */
export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) return unauthorizedResponse();

  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json({ items: [] });

  const items = await prisma.babylistCatalogItem
    .findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { manufacturer: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 15,
      select: { sku: true, name: true, manufacturer: true, price: true, imageUrl: true },
    })
    .catch(() => []);

  return NextResponse.json({ items });
}
