import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BabylistFields = {
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  openBoxPrice: number | null;
  openBoxUrl: string | null;
  albeePrice: number | null;
  albeeUrl: string | null;
};

const EMPTY: BabylistFields = {
  babylistUrl: null,
  babylistPrice: null,
  babylistImage: null,
  openBoxPrice: null,
  openBoxUrl: null,
  albeePrice: null,
  albeeUrl: null,
};

// Stroller.babylistSku is the Impact catalog item id (form "product_8981_<n>");
// the affiliate catalog stores the bare feed id as externalId. Strip the prefix
// to link a stroller to its fresh AffiliateCatalogProduct row.
function toExternalId(sku: string | null): string | null {
  if (!sku) return null;
  return sku.replace(/^product_\d+_/, '').trim() || null;
}

/**
 * GET /api/babylist/lookup?items=Brand:::Model,Brand:::Model
 *
 * Returns Babylist price/image/link for each stroller, keyed by the exact
 * "Brand:::Model" string passed in. Prefers the fresh local affiliate catalog
 * (AffiliateCatalogProduct, refreshed by the feed import) and falls back to the
 * Stroller table's synced fields. Used by the stroller finder, the matchmaker
 * quiz, and the preview product cards. Public; unmatched products come back as
 * nulls so the caller can fall back.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('items') ?? '';
  const pairs = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [brand = '', model = ''] = s.split(':::');
      return { key: s, brand: brand.trim(), model: model.trim() };
    })
    .filter((p) => p.brand && p.model);

  if (pairs.length === 0) return NextResponse.json({ results: {} });

  // Look up across both strollers and car seats so the travel-system checker
  // (which lists both sides of a combo) and the matchmaker quiz share one API.
  type LookupRow = {
    brand: string;
    model: string;
    babylistSku: string | null;
    babylistUrl: string | null;
    babylistPrice: number | null;
    babylistImage: string | null;
  };
  const [strollerRows, carSeatRows] = await Promise.all([
    prisma.stroller
      .findMany({
        select: { brand: true, model: true, babylistSku: true, babylistUrl: true, babylistPrice: true, babylistImage: true },
      })
      .catch(() => [] as LookupRow[]),
    prisma.carSeat
      .findMany({
        select: { brand: true, model: true, babylistSku: true, babylistUrl: true, babylistPrice: true, babylistImage: true },
      })
      .catch(() => [] as LookupRow[]),
  ]);
  const rows: LookupRow[] = [...strollerRows, ...carSeatRows];

  // Pull the fresh catalog rows for every linked SKU in one query. The catalog
  // client model is generated on the Heroku build, so cast to keep tsc green.
  const externalIds = [
    ...new Set(rows.map((r) => toExternalId(r.babylistSku)).filter((x): x is string => Boolean(x))),
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const catalogRows: Array<{
    externalId: string;
    price: number | null;
    imageUrl: string | null;
    affiliateUrl: string | null;
  }> =
    externalIds.length > 0
      ? await db.affiliateCatalogProduct
          .findMany({
            where: { externalId: { in: externalIds }, isActiveInFeed: true },
            select: { externalId: true, price: true, imageUrl: true, affiliateUrl: true },
          })
          .catch(() => [])
      : [];
  const catByExternal = new Map(catalogRows.map((c) => [c.externalId, c]));

  // GoodBuyGear (open-box) prices for the same models — cheapest wins.
  const gbgRows: Array<{ brand: string | null; title: string; price: number | null; affiliateUrl: string | null }> =
    await db.affiliateCatalogProduct
      .findMany({
        where: {
          provider: 'impact_goodbuygear',
          isActiveInFeed: true,
          enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
        },
        select: { brand: true, title: true, price: true, affiliateUrl: true },
      })
      .catch(() => []);
  // Albee Baby (CJ) prices for the same models — cheapest wins, same as GBG.
  const albeeRows: Array<{ brand: string | null; title: string; price: number | null; affiliateUrl: string | null }> =
    await db.affiliateCatalogProduct
      .findMany({
        where: {
          provider: 'cj_albeebaby',
          isActiveInFeed: true,
          enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
        },
        select: { brand: true, title: true, price: true, affiliateUrl: true },
      })
      .catch(() => []);

  // Collapse a provider's rows to the cheapest price per brand:::model key.
  const buildByKey = (list: typeof gbgRows) => {
    const map = new Map<string, { price: number; url: string | null }>();
    for (const g of list) {
      if (g.price == null) continue;
      const b = canonicalBrand(g.brand);
      const m = parseStrollerModel(g.title, b);
      if (!m) continue;
      const key = `${b.toLowerCase()}:::${m.toLowerCase()}`;
      const ex = map.get(key);
      if (!ex || g.price < ex.price) map.set(key, { price: g.price, url: g.affiliateUrl });
    }
    return map;
  };
  const openBoxByKey = buildByKey(gbgRows);
  const albeeByKey = buildByKey(albeeRows);

  const byKey = new Map<string, BabylistFields>();
  for (const r of rows) {
    const cat = catByExternal.get(toExternalId(r.babylistSku) ?? '');
    const key = `${r.brand.toLowerCase()}:::${r.model.toLowerCase()}`;
    const ob = openBoxByKey.get(key);
    const ab = albeeByKey.get(key);
    byKey.set(key, {
      // Prefer the fresh feed data; fall back to the Stroller table's synced fields.
      babylistUrl: cat?.affiliateUrl ?? r.babylistUrl,
      babylistPrice: cat?.price ?? r.babylistPrice,
      babylistImage: cat?.imageUrl ?? r.babylistImage,
      openBoxPrice: ob?.price ?? null,
      openBoxUrl: ob?.url ?? null,
      albeePrice: ab?.price ?? null,
      albeeUrl: ab?.url ?? null,
    });
  }

  const results: Record<string, BabylistFields> = {};
  for (const p of pairs) {
    results[p.key] = byKey.get(`${p.brand.toLowerCase()}:::${p.model.toLowerCase()}`) ?? EMPTY;
  }

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
