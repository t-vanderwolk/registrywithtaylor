import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CatalogProductRow = {
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null } | null;
};

type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
};

/**
 * GET /api/catalog/carseats
 *
 * The car-seat side of the finder: every infant car seat in the local affiliate
 * catalog, grouped by brand — the same shape as /api/catalog/strollers so the
 * finder UI can browse them "just like the strollers." Car seats are a single
 * type bucket (we only keep infant car seats), variants deduped by group/model,
 * hidden products excluded, prices/images/links straight from the catalog.
 */
export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct
    .findMany({
      where: {
        isActiveInFeed: true,
        enrichment: { is: { productType: 'infant car seat', reviewStatus: { not: 'HIDDEN' } } },
      },
      select: {
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        itemGroupId: true,
        enrichment: { select: { productType: true } },
      },
      orderBy: { title: 'asc' },
    })
    .catch(() => [] as CatalogProductRow[]);

  const byBrand = new Map<string, FinderProduct[]>();
  const seenGroups = new Set<string>();
  const seenModels = new Set<string>();

  for (const r of rows) {
    if (r.itemGroupId) {
      if (seenGroups.has(r.itemGroupId)) continue;
      seenGroups.add(r.itemGroupId);
    }
    const brand = canonicalBrand(r.brand);
    const model = parseStrollerModel(r.title, brand);
    const modelKey = `${brand}|${model}`.toLowerCase().replace(/[^a-z0-9|]+/g, '');
    if (model) {
      if (seenModels.has(modelKey)) continue;
      seenModels.add(modelKey);
    }
    if (!byBrand.has(brand)) byBrand.set(brand, []);
    byBrand.get(brand)!.push({
      name: r.title,
      model,
      price: r.price,
      image: r.imageUrl,
      affiliateUrl: r.affiliateUrl,
    });
  }

  const brands = [...byBrand.entries()]
    .map(([brand, products]) => ({
      brand,
      count: products.length,
      types: [
        {
          category: 'infant-car-seat',
          label: 'Infant Car Seat',
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        },
      ],
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => a.brand.localeCompare(b.brand));

  return NextResponse.json(
    { brands },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
