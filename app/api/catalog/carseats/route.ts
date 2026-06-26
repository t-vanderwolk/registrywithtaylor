import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { parseCarSeatModel } from '@/lib/catalog/strollerModel';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROVIDER_GBG = 'impact_goodbuygear';
const PROVIDER_ANB = 'awin_anbbaby';

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

type RetailerOffer = { price: number | null; url: string | null };
type FinderProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  source: 'babylist' | 'anb' | 'openbox';
  retailers: {
    babylist: RetailerOffer | null;
    anb: RetailerOffer | null;
    goodbuygear: RetailerOffer | null;
  };
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

  type Offer = { price: number | null; url: string | null; image: string | null; title: string };
  type Group = {
    brand: string;
    model: string;
    babylist: Offer | null;
    anb: Offer | null;
    gbg: Offer | null;
  };
  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const r of rows) {
    if (r.itemGroupId) {
      if (seenGroups.has(r.itemGroupId)) continue;
      seenGroups.add(r.itemGroupId);
    }
    const brand = canonicalBrand(r.brand);
    const model = parseCarSeatModel(r.title, brand);
    const key = (model ? `${brand}|${model}` : `${brand}|${r.title}`).toLowerCase().replace(/[^a-z0-9|]+/g, '');

    let g = groups.get(key);
    if (!g) {
      g = { brand, model, babylist: null, anb: null, gbg: null };
      groups.set(key, g);
    }
    const offer: Offer = { price: r.price, url: r.affiliateUrl, image: r.imageUrl, title: r.title };
    const cheaper = (cur: Offer | null) =>
      !cur || (offer.price != null && (cur.price == null || offer.price < cur.price));
    if (r.provider === PROVIDER_GBG) {
      if (cheaper(g.gbg)) g.gbg = offer;
    } else if (r.provider === PROVIDER_ANB) {
      if (cheaper(g.anb)) g.anb = offer;
    } else if (!g.babylist) {
      g.babylist = offer;
    }
  }

  const byBrand = new Map<string, FinderProduct[]>();
  for (const g of groups.values()) {
    const primary = g.babylist ?? g.anb ?? g.gbg;
    if (!primary) continue;
    if (!byBrand.has(g.brand)) byBrand.set(g.brand, []);
    byBrand.get(g.brand)!.push({
      name: primary.title,
      model: g.model,
      price: primary.price,
      image: g.babylist?.image ?? g.anb?.image ?? g.gbg?.image ?? null,
      affiliateUrl: primary.url,
      source: g.babylist ? 'babylist' : g.anb ? 'anb' : 'openbox',
      retailers: {
        babylist: g.babylist ? { price: g.babylist.price, url: g.babylist.url } : null,
        anb: g.anb ? { price: g.anb.price, url: g.anb.url } : null,
        goodbuygear: g.gbg ? { price: g.gbg.price, url: g.gbg.url } : null,
      },
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
