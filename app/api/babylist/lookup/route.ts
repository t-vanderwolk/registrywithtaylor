import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BabylistFields = {
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  openBoxPrice: number | null;
  openBoxUrl: string | null;
  anbPrice: number | null;
  anbUrl: string | null;
  macroBabyPrice: number | null;
  macroBabyUrl: string | null;
};

const EMPTY: BabylistFields = {
  babylistUrl: null,
  babylistPrice: null,
  babylistImage: null,
  openBoxPrice: null,
  openBoxUrl: null,
  anbPrice: null,
  anbUrl: null,
  macroBabyPrice: null,
  macroBabyUrl: null,
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
  type ProviderOfferRow = {
    brand: string | null;
    title: string;
    price: number | null;
    affiliateUrl: string | null;
    imageUrl?: string | null;
  };

  const gbgRows: ProviderOfferRow[] =
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
  // ANB Baby (Awin) prices for the same models — cheapest wins, same as GBG.
  const anbRows: ProviderOfferRow[] =
    await db.affiliateCatalogProduct
      .findMany({
        where: {
          provider: 'awin_anbbaby',
          isActiveInFeed: true,
          enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
        },
        select: { brand: true, title: true, price: true, affiliateUrl: true },
      })
      .catch(() => []);
  // MacroBaby prices/images for the same models — treated as new retail, before
  // open-box fallback and after Babylist/Amazon at the UI layer.
  const macroBabyRows: ProviderOfferRow[] =
    await db.affiliateCatalogProduct
      .findMany({
        where: {
          provider: 'shopify_macrobaby',
          isActiveInFeed: true,
          enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
        },
        select: { brand: true, title: true, price: true, affiliateUrl: true, imageUrl: true },
      })
      .catch(() => []);

  // Index each provider's rows by canonical brand for squash-substring matching.
  // (parseStrollerModel is stroller-only and misses car-seat models such as
  // "PIPA RX Infant Car Seat".) squash() drops spaces/punctuation so the requested
  // "PIPA RX" matches the catalog title "Nuna PIPA RX Infant Car Seat".
  const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  type Offer = { price: number; url: string | null; sq: string; image?: string | null };
  const indexByBrand = (list: ProviderOfferRow[]) => {
    const map = new Map<string, Offer[]>();
    for (const g of list) {
      if (g.price == null) continue;
      const b = canonicalBrand(g.brand).toLowerCase();
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push({ price: g.price, url: g.affiliateUrl, sq: squash(g.title), image: g.imageUrl ?? null });
    }
    return map;
  };
  const gbgByBrand = indexByBrand(gbgRows);
  const anbByBrand = indexByBrand(anbRows);
  const macroBabyByBrand = indexByBrand(macroBabyRows);
  const cheapestMatch = (idx: Map<string, Offer[]>, brand: string, model: string): Offer | null => {
    const ms = squash(model);
    if (ms.length < 4) return null;
    let best: Offer | null = null;
    for (const c of idx.get(canonicalBrand(brand).toLowerCase()) ?? []) {
      if (c.sq.includes(ms) && (!best || c.price < best.price)) best = c;
    }
    return best;
  };

  const byKey = new Map<string, BabylistFields>();
  for (const r of rows) {
    const cat = catByExternal.get(toExternalId(r.babylistSku) ?? '');
    const key = `${r.brand.toLowerCase()}:::${r.model.toLowerCase()}`;
    byKey.set(key, {
      // Prefer the fresh feed data; fall back to the Stroller table's synced fields.
      babylistUrl: cat?.affiliateUrl ?? r.babylistUrl,
      babylistPrice: cat?.price ?? r.babylistPrice,
      babylistImage: cat?.imageUrl ?? r.babylistImage,
      // open-box (GoodBuyGear) + ANB Baby are matched per requested pair below.
      openBoxPrice: null,
      openBoxUrl: null,
      anbPrice: null,
      anbUrl: null,
      macroBabyPrice: null,
      macroBabyUrl: null,
    });
  }

  const results: Record<string, BabylistFields> = {};
  for (const p of pairs) {
    const base = byKey.get(`${p.brand.toLowerCase()}:::${p.model.toLowerCase()}`) ?? EMPTY;
    const ob = cheapestMatch(gbgByBrand, p.brand, p.model);
    const ab = cheapestMatch(anbByBrand, p.brand, p.model);
    const mb = cheapestMatch(macroBabyByBrand, p.brand, p.model);
    results[p.key] = {
      ...base,
      babylistImage: base.babylistImage ?? mb?.image ?? null,
      openBoxPrice: ob?.price ?? null,
      openBoxUrl: ob?.url ?? null,
      anbPrice: ab?.price ?? null,
      anbUrl: ab?.url ?? null,
      macroBabyPrice: mb?.price ?? null,
      macroBabyUrl: mb?.url ?? null,
    };
  }

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
