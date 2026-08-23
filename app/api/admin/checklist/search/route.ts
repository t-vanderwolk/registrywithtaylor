import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/checklist/search?q=britax
 *
 * Admin-only. Searches the admin checklist picks (ChecklistProduct) by
 * brand/product so the blog editor can insert a product a pick was already
 * created for. Returns everything needed to build a :::catalog-product block:
 * brand, product, image, price, and the Babylist/Amazon/other retailer links.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  type Row = {
    id: string;
    brand: string;
    product: string;
    bestFor: string;
    affiliateUrl: string;
    amazonUrl: string | null;
    secondaryUrl: string | null;
    secondaryRetailer: string | null;
    price: number | null;
    priceSource: string | null;
    imageUrl: string | null;
    badge: string | null;
  };
  let rows: Row[] = [];
  try {
    rows = await db.checklistProduct.findMany({
      where: {
        OR: [
          { brand: { contains: q, mode: 'insensitive' } },
          { product: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        brand: true,
        product: true,
        bestFor: true,
        affiliateUrl: true,
        amazonUrl: true,
        secondaryUrl: true,
        secondaryRetailer: true,
        price: true,
        priceSource: true,
        imageUrl: true,
        badge: true,
      },
      orderBy: [{ brand: 'asc' }, { product: 'asc' }],
      take: 25,
    });
  } catch {
    return NextResponse.json({ results: [] });
  }

  const results = rows.map((r) => ({
    id: r.id,
    brand: r.brand,
    product: r.product,
    bestFor: r.bestFor || null,
    // The sentinel means "no live Babylist link" — surface it as null.
    babylistUrl: r.affiliateUrl && r.affiliateUrl !== 'AFFILIATE_LINK_NEEDED' ? r.affiliateUrl : null,
    amazonUrl: r.amazonUrl,
    secondaryUrl: r.secondaryUrl,
    secondaryRetailer: r.secondaryRetailer,
    price: r.price,
    priceSource: r.priceSource,
    imageUrl: r.imageUrl,
    badge: r.badge,
  }));

  return NextResponse.json({ results });
}
