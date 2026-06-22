import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// everyday → specialty ordering for the per-brand type sections
const TYPE_ORDER: StrollerCategory[] = [
  'full-size',
  'full-size-non-modular',
  'compact',
  'travel',
  'convertible-modular',
  'convertible-non-modular',
  'double',
  'double-travel',
  'double-jogging',
  'jogging',
  'wagon',
];

type CatalogProductRow = {
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null } | null;
};

type FinderProduct = { name: string; price: number | null; image: string | null; affiliateUrl: string | null };

/**
 * GET /api/catalog/strollers
 *
 * The stroller-finder's data source: every stroller in the local affiliate
 * catalog, mapped into the StrollerCategory taxonomy and grouped brand → type.
 * One card per model (variants deduped by item_group_id), hidden products
 * excluded, prices/images/links straight from the catalog.
 */
export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct
    .findMany({
      where: {
        isActiveInFeed: true,
        enrichment: { is: { tmbcCategory: 'Strollers', reviewStatus: { not: 'HIDDEN' } } },
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

  const byBrand = new Map<string, Map<StrollerCategory, FinderProduct[]>>();
  const seenGroups = new Set<string>();

  for (const r of rows) {
    const category = strollerCategoryFromProductType(r.enrichment?.productType);
    if (!category) continue; // skip accessories / unmapped types
    // Collapse colour/variant duplicates (the feed groups them by item_group_id).
    if (r.itemGroupId) {
      if (seenGroups.has(r.itemGroupId)) continue;
      seenGroups.add(r.itemGroupId);
    }
    const brand = (r.brand || 'Other').trim();
    if (!byBrand.has(brand)) byBrand.set(brand, new Map());
    const byCat = byBrand.get(brand)!;
    if (!byCat.has(category)) byCat.set(category, []);
    byCat.get(category)!.push({
      name: r.title,
      price: r.price,
      image: r.imageUrl,
      affiliateUrl: r.affiliateUrl,
    });
  }

  const brands = [...byBrand.entries()]
    .map(([brand, byCat]) => {
      const types = [...byCat.entries()]
        .map(([category, products]) => ({
          category,
          label: STROLLER_CATEGORY_LABELS[category],
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => TYPE_ORDER.indexOf(a.category) - TYPE_ORDER.indexOf(b.category));
      const count = types.reduce((n, t) => n + t.products.length, 0);
      return { brand, count, types };
    })
    .filter((b) => b.count > 0)
    .sort((a, b) => a.brand.localeCompare(b.brand));

  return NextResponse.json(
    { brands },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
