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
const PROVIDER_ALBEE = 'cj_albeebaby';

// `model` is the parsed model name used to deep-link into the travel-system
// checker (brand + model → /api/compatibility), so the finder's "check
// compatibility" CTA lands on the same brand:::model key the checker resolves.
type RetailerOffer = { price: number | null; url: string | null };
type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  source: 'babylist' | 'albee' | 'openbox';
  retailers: {
    babylist: RetailerOffer | null;
    albee: RetailerOffer | null;
    goodbuygear: RetailerOffer | null;
  };
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

  // Group every active row by brand+model, tracking each retailer's offer so the
  // card can show stacked CTAs. Babylist is the primary card when present; the
  // primary image falls back to Albee Baby, then GoodBuyGear. GoodBuyGear and
  // Albee Baby each keep their cheapest listing for the same model.
  type Offer = { price: number | null; url: string | null; image: string | null; title: string };
  type Group = {
    category: StrollerCategory;
    brand: string;
    model: string;
    babylist: Offer | null;
    albee: Offer | null;
    gbg: Offer | null;
  };
  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const r of rows) {
    const category = strollerCategoryFromProductType(r.enrichment?.productType);
    if (!category) continue; // skip accessories / unmapped types
    // Collapse Babylist colour/variant duplicates (grouped by item_group_id).
    if (r.itemGroupId) {
      if (seenGroups.has(r.itemGroupId)) continue;
      seenGroups.add(r.itemGroupId);
    }
    const brand = canonicalBrand(r.brand);
    const model = parseStrollerModel(r.title, brand);
    const key = (model ? `${brand}|${model}` : `${brand}|${r.title}`).toLowerCase().replace(/[^a-z0-9|]+/g, '');

    let g = groups.get(key);
    if (!g) {
      g = { category, brand, model, babylist: null, albee: null, gbg: null };
      groups.set(key, g);
    }
    const offer: Offer = { price: r.price, url: r.affiliateUrl, image: r.imageUrl, title: r.title };
    const cheaper = (cur: Offer | null) =>
      !cur || (offer.price != null && (cur.price == null || offer.price < cur.price));
    if (r.provider === PROVIDER_GBG) {
      if (cheaper(g.gbg)) g.gbg = offer;
    } else if (r.provider === PROVIDER_ALBEE) {
      if (cheaper(g.albee)) g.albee = offer;
    } else if (!g.babylist) {
      g.babylist = offer;
      g.category = category; // Babylist's categorization wins for the card
    }
  }

  const byBrand = new Map<string, Map<StrollerCategory, FinderProduct[]>>();
  for (const g of groups.values()) {
    const primary = g.babylist ?? g.albee ?? g.gbg;
    if (!primary) continue;
    const product: FinderProduct = {
      name: primary.title,
      model: g.model,
      price: primary.price,
      image: g.babylist?.image ?? g.albee?.image ?? g.gbg?.image ?? null,
      affiliateUrl: primary.url,
      source: g.babylist ? 'babylist' : g.albee ? 'albee' : 'openbox',
      retailers: {
        babylist: g.babylist ? { price: g.babylist.price, url: g.babylist.url } : null,
        albee: g.albee ? { price: g.albee.price, url: g.albee.url } : null,
        goodbuygear: g.gbg ? { price: g.gbg.price, url: g.gbg.url } : null,
      },
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
