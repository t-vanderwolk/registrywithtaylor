import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CatalogProductOut = {
  brand: string;
  product: string;
  imageUrl: string | null;
  price: number | null;
  priceSource: string | null;
  babylistUrl: string | null;
  amazonUrl: string | null;
  shopUrl: string | null;
  shopRetailer: string | null;
};

/**
 * GET /api/admin/blog/catalog-products?q=vista
 *
 * Admin-only. Scans every post body for `:::catalog-product` blocks and returns
 * the distinct products (brand + product) with their image, price, and retailer
 * links — so the checklist-pick editor can pull a product a card already exists
 * for in the blog. The reverse of /api/admin/checklist/search.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  let posts: Array<{ content: string }> = [];
  try {
    posts = await db.post.findMany({ select: { content: true } });
  } catch {
    return NextResponse.json({ results: [] });
  }

  // Distinct by brand+product (first occurrence wins).
  const byKey = new Map<string, CatalogProductOut>();
  for (const post of posts) {
    if (!post.content || !post.content.includes(':::catalog-product')) continue;
    for (const block of extractStyledBlocks(post.content)) {
      if (block.type !== 'catalog-product') continue;
      const brand = block.brand?.trim() ?? '';
      const product = block.productName?.trim() ?? '';
      if (!brand && !product) continue;
      const key = `${brand.toLowerCase()}|${product.toLowerCase()}`;
      if (byKey.has(key)) continue;
      byKey.set(key, {
        brand,
        product,
        imageUrl: block.imageUrl ?? null,
        price: block.price ?? null,
        priceSource: block.priceSource ?? null,
        babylistUrl: block.babylistUrl ?? null,
        amazonUrl: block.amazonUrl ?? null,
        // Any non-Babylist/Amazon retailer link (macrobaby or a labeled Shop).
        shopUrl: block.shopUrl ?? block.macrobabyUrl ?? null,
        shopRetailer: block.shopRetailer ?? (block.macrobabyUrl ? 'MacroBaby' : null),
      });
    }
  }

  let results = [...byKey.values()];
  if (q.length >= 2) {
    results = results.filter(
      (r) => r.brand.toLowerCase().includes(q) || r.product.toLowerCase().includes(q),
    );
  }
  results.sort((a, b) => a.brand.localeCompare(b.brand) || a.product.localeCompare(b.product));

  return NextResponse.json({ results: results.slice(0, 50) });
}
