import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Providers whose links we surface in blog product cards (mirrors the resolver).
const PROVIDERS = ['babylist_impact', 'shopify_macrobaby'];

type Row = {
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  manualAmazonUrl: string | null;
  provider: string;
  enrichment: { canonicalBrand: string | null; canonicalName: string | null } | null;
};

/**
 * GET /api/admin/catalog/search?q=vista
 *
 * Admin-only. Searches the affiliate catalogue by brand/title/canonical name and
 * returns the fields the blog editor needs to insert a catalog-linked product
 * block: brand + name (used by the render-time resolver to re-match the live
 * link) plus the Babylist/MacroBaby affiliate URL, manual Amazon URL, image, and
 * price for an immediate fallback.
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
  let rows: Row[] = [];
  try {
    rows = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: { in: PROVIDERS },
        isActiveInFeed: true,
        NOT: { enrichment: { is: { reviewStatus: 'HIDDEN' } } },
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { enrichment: { is: { canonicalName: { contains: q, mode: 'insensitive' } } } },
        ],
      },
      select: {
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        manualAmazonUrl: true,
        provider: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true } },
      },
      orderBy: [{ provider: 'asc' }, { title: 'asc' }],
      take: 25,
    });
  } catch {
    return NextResponse.json({ results: [] });
  }

  const results = rows.map((r) => ({
    brand: canonicalBrand(r.enrichment?.canonicalBrand ?? r.brand ?? ''),
    name: (r.enrichment?.canonicalName ?? r.title ?? '').trim(),
    title: r.title,
    affiliateUrl: r.affiliateUrl,
    amazonUrl: r.manualAmazonUrl,
    imageUrl: r.imageUrl,
    price: r.price,
    retailer: r.provider === 'shopify_macrobaby' ? 'MacroBaby' : 'Babylist',
  }));

  return NextResponse.json({ results });
}
