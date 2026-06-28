import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import {
  canonicalStrollerBrand,
  isExcludedStrollerFinderProduct,
} from '@/lib/catalog/strollerFinderRules';
import { hasPublicCoreRetailer, isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';

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
  productUrl: string | null;
  affiliateUrl: string | null;
  retailer: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null; canonicalBrand: string | null; canonicalName: string | null } | null;
};

const PROVIDER_ANB = 'awin_anbbaby';
const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';

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
  source: 'babylist' | 'macrobaby';
  retailers: {
    babylist: RetailerOffer | null;
    amazon: RetailerOffer | null;
    macrobaby: RetailerOffer | null;
    anb: RetailerOffer | null;
    goodbuygear: RetailerOffer | null;
  };
};

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(stroller|travel system|adapter|accessory|bassinet|seat pack|second seat|snack tray|cup holder)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

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
        productUrl: true,
        affiliateUrl: true,
        retailer: true,
        itemGroupId: true,
        enrichment: { select: { productType: true, canonicalBrand: true, canonicalName: true } },
      },
      orderBy: { title: 'asc' },
    })
    .catch(() => [] as CatalogProductRow[]);

  // Group every active row by brand+model, tracking each retailer's offer so the
  // card can show stacked CTAs. GoodBuy Gear stays badge-only; it can provide an
  // image only after a public new-retail offer exists.
  type Offer = { price: number | null; url: string | null; image: string | null; title: string };
  type Group = {
    category: StrollerCategory;
    brand: string;
    model: string;
    babylist: Offer | null;
    macrobaby: Offer | null;
    anb: Offer | null;
    gbg: Offer | null;
  };
  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const r of rows) {
    const category = strollerCategoryFromProductType(r.enrichment?.productType);
    if (!category) continue; // skip accessories / unmapped types
    if (isExcludedStrollerFinderProduct({ brand: r.brand, title: r.title })) continue;
    // Collapse colour/variant duplicates within a provider.
    if (r.itemGroupId) {
      const groupIdKey = `${r.provider}:${r.itemGroupId}`;
      if (seenGroups.has(groupIdKey)) continue;
      seenGroups.add(groupIdKey);
    }
    const rawBrand = (r.enrichment?.canonicalBrand || r.brand || '').trim();
    const brand = canonicalStrollerBrand(rawBrand);
    const model = modelLikeCanonicalName(r.enrichment?.canonicalName) ?? parseStrollerModel(r.title, rawBrand || brand);
    const key = (model ? `${brand}|${model}` : `${brand}|${r.title}`).toLowerCase().replace(/[^a-z0-9|]+/g, '');

    let g = groups.get(key);
    if (!g) {
      g = { category, brand, model, babylist: null, macrobaby: null, anb: null, gbg: null };
      groups.set(key, g);
    }
    const offer: Offer = { price: r.price, url: r.affiliateUrl, image: r.imageUrl, title: r.title };
    const cheaper = (cur: Offer | null) =>
      !cur || (offer.price != null && (cur.price == null || offer.price < cur.price));
    const isGoodBuyGear = isGoodBuyGearOffer({
      provider: r.provider,
      retailer: r.retailer,
      url: r.affiliateUrl,
      productUrl: r.productUrl,
    });

    if (isGoodBuyGear) {
      if (cheaper(g.gbg)) g.gbg = offer;
    } else if (r.provider === PROVIDER_BABYLIST) {
      if (!g.babylist) {
        g.babylist = offer;
        g.category = category; // Babylist's categorization wins for the card
      }
    } else if (r.provider === PROVIDER_MACROBABY) {
      if (cheaper(g.macrobaby)) g.macrobaby = offer;
    } else if (r.provider === PROVIDER_ANB) {
      if (cheaper(g.anb)) g.anb = offer;
    }
  }

  const byBrand = new Map<string, Map<StrollerCategory, FinderProduct[]>>();
  for (const g of groups.values()) {
    const babylist = g.babylist && hasPublicCoreRetailer({
      provider: PROVIDER_BABYLIST,
      retailer: 'Babylist',
      url: g.babylist.url,
      price: g.babylist.price,
    })
      ? g.babylist
      : null;
    const macrobaby = g.macrobaby && hasPublicCoreRetailer({
      provider: PROVIDER_MACROBABY,
      retailer: 'MacroBaby',
      url: g.macrobaby.url,
      price: g.macrobaby.price,
    })
      ? g.macrobaby
      : null;
    const primary = babylist ?? macrobaby;
    if (!primary) continue;

    const amazonUrl = getAffiliateLinks(g.brand, g.model).amazonUrl ?? null;
    const amazon = amazonUrl ? { price: null, url: amazonUrl, image: null, title: 'Amazon' } : null;
    const product: FinderProduct = {
      name: primary.title,
      model: g.model,
      price: primary.price,
      image: babylist?.image ?? macrobaby?.image ?? g.anb?.image ?? g.gbg?.image ?? null,
      affiliateUrl: primary.url,
      source: babylist ? 'babylist' : 'macrobaby',
      retailers: {
        babylist: babylist ? { price: babylist.price, url: babylist.url } : null,
        amazon: amazon ? { price: null, url: amazon.url } : null,
        macrobaby: macrobaby ? { price: macrobaby.price, url: macrobaby.url } : null,
        anb: null,
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
