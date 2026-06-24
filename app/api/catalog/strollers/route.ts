import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

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
  'umbrella',
  'wagon',
];

type CatalogProductRow = {
  provider: string;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null } | null;
};

const PROVIDER_GBG = 'impact_goodbuygear';

// `model` is the parsed model name used to deep-link into the travel-system
// checker (brand + model → /api/compatibility), so the finder's "check
// compatibility" CTA lands on the same brand:::model key the checker resolves.
type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  source: 'babylist' | 'openbox';
  openBox: { price: number; url: string | null } | null;
};

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
        provider: true,
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

  // Group every active row by brand+model. Babylist is the primary card; any
  // GoodBuyGear (open-box) listing for the same model contributes the cheapest
  // "as low as" open-box price + link.
  type Group = {
    primary: CatalogProductRow;
    category: StrollerCategory;
    brand: string;
    model: string;
    openBoxPrice: number | null;
    openBoxUrl: string | null;
  };
  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const r of rows) {
    const category = strollerCategoryFromProductType(r.enrichment?.productType);
    if (!category) continue; // skip accessories / unmapped types
    // Collapse colour/variant duplicates (the feed groups them by item_group_id).
    if (r.itemGroupId) {
      if (seenGroups.has(r.itemGroupId)) continue;
      seenGroups.add(r.itemGroupId);
    }
    const brand = canonicalBrand(r.brand);
    const model = parseStrollerModel(r.title, brand);
    const key = (model ? `${brand}|${model}` : `${brand}|${r.title}`).toLowerCase().replace(/[^a-z0-9|]+/g, '');
    const isGbg = r.provider === PROVIDER_GBG;

    let g = groups.get(key);
    if (!g) {
      g = { primary: r, category, brand, model, openBoxPrice: null, openBoxUrl: null };
      groups.set(key, g);
    } else if (g.primary.provider === PROVIDER_GBG && !isGbg) {
      g.primary = r; // prefer a Babylist listing as the primary card
      g.category = category;
    }
    if (isGbg && r.price != null && (g.openBoxPrice == null || r.price < g.openBoxPrice)) {
      g.openBoxPrice = r.price;
      g.openBoxUrl = r.affiliateUrl;
    }
  }

  const byBrand = new Map<string, Map<StrollerCategory, FinderProduct[]>>();
  for (const g of groups.values()) {
    const isGbgPrimary = g.primary.provider === PROVIDER_GBG;
    const product: FinderProduct = {
      name: g.primary.title,
      model: g.model,
      price: g.primary.price,
      image: g.primary.imageUrl,
      affiliateUrl: g.primary.affiliateUrl,
      source: isGbgPrimary ? 'openbox' : 'babylist',
      openBox: !isGbgPrimary && g.openBoxPrice != null ? { price: g.openBoxPrice, url: g.openBoxUrl } : null,
    };
    if (!byBrand.has(g.brand)) byBrand.set(g.brand, new Map());
    const byCat = byBrand.get(g.brand)!;
    if (!byCat.has(g.category)) byCat.set(g.category, []);
    byCat.get(g.category)!.push(product);
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
