import { cache } from 'react';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { mergeStrollerModel, overrideStrollerCategory } from '@/lib/catalog/strollerModelMerges';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import {
  normalizeStrollerVariantModel,
  strollerPublicDisplayModel,
  strollerVariantNoiseScore,
} from '@/lib/catalog/strollerVariantIdentity';
import {
  canonicalStrollerBrand,
  isExcludedStrollerFinderProduct,
  isExcludedStrollerFinderModel,
} from '@/lib/catalog/strollerFinderRules';
import { hasPublicCoreRetailer, isGoodBuyGearOffer, isGoodBuyGearUrl, isBombiOffer, isAmazonOffer, isAmazonUrl } from '@/lib/catalog/publicRetailerVisibility';
import { gbgBadgeKey, applyGbgBadge } from '@/lib/catalog/gbgBadge';
import { getGbgBadgeOverrides } from '@/lib/server/gbgBadgeOverrides';
import prisma from '@/lib/server/prisma';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';
import { isMacroBabyAllowedForBrand, MACROBABY_SHOP_LINKS_ENABLED } from '@/lib/affiliateShopFallbacks';
import { getExactDirectAffiliateLink, isDirectProgramUrl } from '@/lib/catalog/directAffiliateLinks';
import { isStoreUrlOn, storeRetailerName } from '@/lib/catalog/storeRetailers';
import { isHttpUrl, parseRetailerLinks, type RetailerLink } from '@/lib/retailerLinks';
import { getStrollerProfile } from '@/lib/resources/strollerProfiles';
import {
  bestAmazonImage,
  bestAmazonPrice,
  bestAmazonUrl,
  getAmazonCacheMapForUrls,
} from '@/lib/server/amazonCreators/cache';
import type { TravelSystemStrollerOption } from '@/lib/compatibilityEngine';

const PROVIDER_ANB = 'awin_anbbaby';
const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';
const PROVIDER_BOMBI = 'bombi_direct';
const PROVIDER_MANUAL = 'manual_tmbc';

export const PUBLIC_STROLLER_TYPE_ORDER: StrollerCategory[] = [
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
  productUrl: string | null;
  affiliateUrl: string | null;
  manualAmazonUrl: string | null;
  retailer: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null; canonicalBrand: string | null; canonicalName: string | null } | null;
};

type RetailerOffer = { price: number | null; url: string | null };
type Offer = RetailerOffer & { image: string | null; title: string };
type StoreOffer = Offer & { retailer: string };

export type PublicStrollerProduct = {
  name: string;
  model: string;
  displayModel: string;
  /** Short TMBC summary from the curated profile (null if none written yet). */
  summary: string | null;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  /** 'store' = a hand-added store link (Target, a brand site…); 'direct' = the
   *  brand's own affiliate program (Mima, Silver Cross), which the cards render. */
  source: 'babylist' | 'macrobaby' | 'bombi' | 'amazon' | 'store' | 'direct' | 'goodbuygear';
  retailers: {
    babylist: RetailerOffer | null;
    amazon: RetailerOffer | null;
    macrobaby: RetailerOffer | null;
    bombi: RetailerOffer | null;
    anb: RetailerOffer | null;
    goodbuygear: RetailerOffer | null;
  };
  /** Hand-added store links (Target, Nordstrom, a brand's own site), each named
   *  for its store. Buy links in their own right, never filed under Amazon. */
  extraRetailers?: RetailerLink[];
  /** Raw (ungated) open-box match, regardless of any admin badge override — used
   *  by the admin GoodBuy Gear audit. `retailers.goodbuygear` is the *displayed*
   *  (override-gated) value. */
  gbgMatch?: RetailerOffer | null;
};

export type PublicStrollerType = {
  category: StrollerCategory;
  label: string;
  products: PublicStrollerProduct[];
};

export type PublicStrollerBrand = {
  brand: string;
  count: number;
  types: PublicStrollerType[];
};

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(stroller|travel system|adapter|accessory|bassinet|seat pack|second seat|snack tray|cup holder)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

function cleanPublicModelName(value: string, brand: string) {
  return parseStrollerModel(value, brand) || value.trim();
}

function isPublicBabylistOffer(offer: Offer | null) {
  return Boolean(
    offer &&
      hasPublicCoreRetailer({
        provider: PROVIDER_BABYLIST,
        retailer: 'Babylist',
        url: offer.url,
        price: offer.price,
      }),
  );
}

function isPublicMacroBabyOffer(offer: Offer | null) {
  // Checked here as well as at the buy-button gate so duplicate-variant picking
  // never keeps a MacroBaby-only variant over one another store still sells.
  return Boolean(
    MACROBABY_SHOP_LINKS_ENABLED &&
    offer &&
      hasPublicCoreRetailer({
        provider: PROVIDER_MACROBABY,
        retailer: 'MacroBaby',
        url: offer.url,
        price: offer.price,
      }),
  );
}

function isPublicBombiOffer(offer: Offer | null) {
  return Boolean(
    offer &&
      isBombiOffer({ provider: PROVIDER_BOMBI, retailer: 'Bombi', url: offer.url, price: offer.price }) &&
      Boolean(offer.url?.trim() || offer.price != null),
  );
}

function isPublicAmazonOffer(offer: Offer | null) {
  return Boolean(offer && (isAmazonOffer({ url: offer.url }) || offer.url?.trim()) && Boolean(offer.url?.trim()));
}

type StrollerCompatibilityCountRow = {
  brand: string;
  model: string;
  compatibilityCount: number;
};

async function loadStrollerCompatibilityCounts() {
  try {
    const rows = await prisma.$queryRaw<StrollerCompatibilityCountRow[]>`
      SELECT
        stroller."brand",
        stroller."model",
        COUNT(compat."id")::int AS "compatibilityCount"
      FROM "Stroller" AS stroller
      LEFT JOIN "Compatibility" AS compat
        ON compat."strollerId" = stroller."id"
      GROUP BY stroller."id", stroller."brand", stroller."model"
    `;

    return new Map(
      rows.map((row) => [
        productModelKey(canonicalStrollerBrand(row.brand), row.model),
        row.compatibilityCount,
      ]),
    );
  } catch {
    return new Map<string, number>();
  }
}

type StrollerRetailerLinkRow = { brand: string; model: string; retailerLinks: unknown };

/**
 * Admin-entered store links from `Stroller.retailerLinks` — Bloomingdale's,
 * Nordstrom, Target, a brand's own site — keyed like every other lookup here.
 *
 * This catalog previously built store buttons only from feed rows whose
 * affiliate URL happened to be a known store domain, so hand-added links were
 * invisible to the finder and quiz while Compare (which reads the column
 * directly) showed them. That asymmetry is the bug this closes.
 *
 * Read with $queryRaw rather than the typed client on purpose: `retailerLinks`
 * only lands in the generated client once a build regenerates it, and a stale
 * client throws "Unknown field `retailerLinks`" instead of returning rows.
 */
async function loadStrollerRetailerLinks() {
  try {
    const rows = await prisma.$queryRaw<StrollerRetailerLinkRow[]>`
      SELECT "brand", "model", "retailerLinks"
      FROM "Stroller"
      WHERE "retailerLinks" IS NOT NULL
    `;

    return new Map(
      rows
        .map(
          (row) =>
            [
              productModelKey(canonicalStrollerBrand(row.brand), row.model),
              parseRetailerLinks(row.retailerLinks) ?? [],
            ] as const,
        )
        .filter(([, links]) => links.length > 0),
    );
  } catch {
    return new Map<string, RetailerLink[]>();
  }
}

/**
 * Feed-derived store offers first (they carry a price and photo), then the
 * admin's hand-added links, deduped by URL so a store present in both sources
 * renders one button rather than two.
 */
function mergeExtraRetailers(
  group: { brand: string; model: string; stores: StoreOffer[] },
  adminLinks: Map<string, RetailerLink[]>,
): RetailerLink[] {
  const merged: RetailerLink[] = group.stores.map((store) => ({
    retailer: store.retailer,
    url: store.url as string,
  }));
  const seen = new Set(merged.map((link) => link.url));

  const key = productModelKey(canonicalStrollerBrand(group.brand), group.model);
  for (const link of adminLinks.get(key) ?? []) {
    if (!isHttpUrl(link.url) || seen.has(link.url)) continue;
    seen.add(link.url);
    merged.push(link);
  }

  return merged;
}

async function loadPublicStrollerCatalogBrands(): Promise<PublicStrollerBrand[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;

  const where = {
    isActiveInFeed: true,
    enrichment: {
      is: {
        tmbcCategory: 'Strollers',
        needsReview: false,
        reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
      },
    },
  };
  const baseSelect = {
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
  };

  // Prefer the manualAmazonUrl override, but degrade gracefully if that column
  // isn't live yet (before the affiliate_manual_amazon_links migration deploys),
  // so the finder never silently empties during the migration window.
  let rows: CatalogProductRow[];
  try {
    rows = await db.affiliateCatalogProduct.findMany({
      where,
      select: { ...baseSelect, manualAmazonUrl: true },
      orderBy: { title: 'asc' },
    });
  } catch {
    const fallback: Omit<CatalogProductRow, 'manualAmazonUrl'>[] = await db.affiliateCatalogProduct
      .findMany({ where, select: baseSelect, orderBy: { title: 'asc' } })
      .catch(() => []);
    rows = fallback.map((r) => ({ ...r, manualAmazonUrl: null }));
  }

  // Per-product admin overrides for the GoodBuy Gear open-box badge.
  const gbgOverrides = await getGbgBadgeOverrides();
  const adminStoreLinks = await loadStrollerRetailerLinks();

  type Group = {
    category: StrollerCategory;
    brand: string;
    model: string;
    babylist: Offer | null;
    macrobaby: Offer | null;
    bombi: Offer | null;
    amazon: Offer | null;
    anb: Offer | null;
    gbg: Offer | null;
    /** A hand-added (manual_tmbc) GoodBuy Gear open-box link — shoppable as its
     *  own primary CTA, unlike bulk-imported GBG offers which are badge-only. */
    gbgShop: Offer | null;
    /** Hand-added links to any other store, named for the store. */
    stores: StoreOffer[];
    /** A hand-added link on the brand's own direct-program shop. */
    direct: Offer | null;
    /** First title/photo seen for the model, for cards whose buy link carries none. */
    fallback: { title: string; image: string | null } | null;
  };

  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const row of rows) {
    let category = strollerCategoryFromProductType(row.enrichment?.productType);
    if (!category) continue;
    if (isExcludedStrollerFinderProduct({
      brand: row.brand,
      title: row.title,
      productUrl: row.productUrl,
      affiliateUrl: row.affiliateUrl,
    })) {
      continue;
    }

    const rawBrand = (row.enrichment?.canonicalBrand || row.brand || '').trim();
    const brand = canonicalStrollerBrand(rawBrand);
    const rawModel = modelLikeCanonicalName(row.enrichment?.canonicalName) ?? parseStrollerModel(row.title, rawBrand || brand);
    const model = mergeStrollerModel(brand, cleanPublicModelName(rawModel, brand));
    if (!model) continue;
    if (isExcludedStrollerFinderModel(brand, model)) continue;
    if (row.itemGroupId) {
      // Item groups normally contain cosmetic variants, but some feeds also put
      // materially different capacities (such as Veer 2- and 4-seat wagons) in
      // one group. Keep one row per canonical model within the item group.
      const groupIdKey = `${row.provider}:${row.itemGroupId}:${productModelKey(brand, model)}`;
      if (seenGroups.has(groupIdKey)) continue;
      seenGroups.add(groupIdKey);
    }
    category = overrideStrollerCategory(brand, model, category);
    const key = productModelKey(brand, model || row.title);

    let group = groups.get(key);
    if (!group) {
      group = { category, brand, model, babylist: null, macrobaby: null, bombi: null, amazon: null, anb: null, gbg: null, gbgShop: null, stores: [], direct: null, fallback: null };
      groups.set(key, group);
    }

    const offer: Offer = { price: row.price, url: row.affiliateUrl, image: row.imageUrl, title: row.title };
    if (!group.fallback) group.fallback = { title: row.title, image: row.imageUrl ?? null };
    else if (!group.fallback.image && row.imageUrl) group.fallback.image = row.imageUrl;
    const cheaper = (current: Offer | null) =>
      !current || (offer.price != null && (current.price == null || offer.price < current.price));
    const isGoodBuyGear = isGoodBuyGearOffer({
      provider: row.provider,
      retailer: row.retailer,
      url: row.affiliateUrl,
      productUrl: row.productUrl,
    });

    // Any row can carry a manual Amazon override — capture it into the Amazon slot.
    if (row.manualAmazonUrl?.trim() && !group.amazon) {
      group.amazon = { price: null, url: row.manualAmazonUrl.trim(), image: row.imageUrl, title: row.title };
    }

    if (isGoodBuyGear) {
      if (cheaper(group.gbg)) group.gbg = offer;
    } else if (row.provider === PROVIDER_BABYLIST) {
      if (!group.babylist) {
        group.babylist = offer;
        group.category = category;
      }
    } else if (row.provider === PROVIDER_MACROBABY) {
      if (cheaper(group.macrobaby)) group.macrobaby = offer;
    } else if (row.provider === PROVIDER_BOMBI) {
      if (cheaper(group.bombi)) group.bombi = offer;
    } else if (row.provider === PROVIDER_ANB) {
      if (cheaper(group.anb)) group.anb = offer;
    } else if (row.provider === PROVIDER_MANUAL) {
      // Route a hand-added product's link into the retailer slot that matches its
      // host so it shows the right buy button (Amazon / Babylist / MacroBaby).
      if (isGoodBuyGearUrl(row.affiliateUrl)) {
        // Open-box product: the GoodBuy Gear link is both the badge and the
        // shoppable primary CTA (bulk-imported GBG offers stay badge-only).
        if (cheaper(group.gbg)) group.gbg = offer;
        if (!group.gbgShop) group.gbgShop = offer;
      } else if (isAmazonUrl(row.affiliateUrl)) {
        if (!group.amazon) group.amazon = offer;
      } else if (/babylist|pxf\.io/i.test(row.affiliateUrl ?? '')) {
        if (!group.babylist) { group.babylist = offer; group.category = category; }
      } else if (/macrobaby/i.test(row.affiliateUrl ?? '')) {
        if (cheaper(group.macrobaby)) group.macrobaby = offer;
      } else if (isStoreUrlOn(row.affiliateUrl, ['bombigear.com'])) {
        // A hand-added Bombi link is Bombi's own button.
        if (cheaper(group.bombi)) group.bombi = offer;
      } else if (isDirectProgramUrl(brand, row.affiliateUrl)) {
        // The brand's own direct program (Mima, Silver Cross). The cards add the
        // tracked direct link themselves, so this row keeps the product listed
        // and supplies its photo.
        if (!group.direct) group.direct = offer;
      } else if (isHttpUrl(row.affiliateUrl)) {
        // Any other store (Target, Nordstrom, a brand site): its own button,
        // named for the store. These used to fall under "Shop Amazon".
        const retailer = storeRetailerName(row.affiliateUrl);
        const url = row.affiliateUrl.trim();
        if (retailer && !group.stores.some((store) => store.url === url)) {
          group.stores.push({ ...offer, url, retailer });
        }
      }
    }
  }

  const compatibilityCounts = await loadStrollerCompatibilityCounts();
  const groupCompatibilityCount = (group: Group) =>
    compatibilityCounts.get(productModelKey(group.brand, group.model)) ?? 0;
  const directOffer = (group: Group): Offer | null => {
    if (group.direct) return group.direct;
    const url = getExactDirectAffiliateLink(group.brand, group.model);
    return url
      ? { price: null, url, image: group.fallback?.image ?? null, title: group.fallback?.title ?? `${group.brand} ${group.model}`.trim() }
      : null;
  };
  const coreOfferCount = (group: Group) =>
    Number(isPublicBabylistOffer(group.babylist)) +
    Number(isPublicMacroBabyOffer(group.macrobaby)) +
    Number(isPublicBombiOffer(group.bombi)) +
    Number(isPublicAmazonOffer(group.amazon)) +
    Number(group.stores.length > 0) +
    Number(directOffer(group) != null);
  const duplicateVariantKey = (group: Group) => {
    const normalized = normalizeStrollerVariantModel(group.model, group.brand);
    return productModelKey(group.brand, normalized || group.model);
  };
  const compareGroupsForPublicKeep = (left: Group, right: Group) => {
    const compatDelta = groupCompatibilityCount(right) - groupCompatibilityCount(left);
    if (compatDelta !== 0) return compatDelta;

    const coreOfferDelta = coreOfferCount(right) - coreOfferCount(left);
    if (coreOfferDelta !== 0) return coreOfferDelta;

    const noiseDelta =
      strollerVariantNoiseScore(left.model, left.brand) -
      strollerVariantNoiseScore(right.model, right.brand);
    if (noiseDelta !== 0) return noiseDelta;

    return left.model.length - right.model.length || left.model.localeCompare(right.model);
  };
  const visibleGroups = new Map<string, Group>();
  for (const group of groups.values()) {
    const key = duplicateVariantKey(group);
    const current = visibleGroups.get(key);
    if (!current || compareGroupsForPublicKeep(group, current) < 0) {
      visibleGroups.set(key, group);
    }
  }

  const amazonCacheMap = await getAmazonCacheMapForUrls(
    [...visibleGroups.values()].flatMap((group) => [
      group.amazon?.url ?? null,
      getAffiliateLinks(group.brand, group.model).amazonUrl ?? null,
    ]),
  );

  const byBrand = new Map<string, Map<StrollerCategory, PublicStrollerProduct[]>>();
  for (const group of visibleGroups.values()) {
    const babylist = isPublicBabylistOffer(group.babylist) ? group.babylist : null;
    const macrobaby =
      isMacroBabyAllowedForBrand(group.brand) && isPublicMacroBabyOffer(group.macrobaby)
        ? group.macrobaby
        : null;
    const bombi = isPublicBombiOffer(group.bombi) ? group.bombi : null;
    const rawAmazon = isPublicAmazonOffer(group.amazon) ? group.amazon : null;
    const rawAmazonUrl = rawAmazon?.url ?? getAffiliateLinks(group.brand, group.model).amazonUrl ?? null;
    const amazonProduct = rawAmazonUrl ? amazonCacheMap.get(rawAmazonUrl) : null;
    const amazonUrl = bestAmazonUrl(rawAmazonUrl, amazonProduct);
    const amazonOffer = amazonUrl
      ? {
          price: bestAmazonPrice(rawAmazon?.price ?? null, amazonProduct),
          url: amazonUrl,
          image: bestAmazonImage(rawAmazon?.image ?? null, amazonProduct),
          title: amazonProduct?.title ?? rawAmazon?.title ?? `${group.brand} ${group.model}`.trim(),
        }
      : null;
    const amazon = rawAmazon && amazonOffer ? amazonOffer : null;
    // A hand-added open-box product surfaces on its GoodBuy Gear link alone.
    const gbgShop = group.gbgShop && (group.gbgShop.url || group.gbgShop.price != null) ? group.gbgShop : null;
    // A verified store link (Target, a brand site…) or the brand's own direct
    // program also keeps a stroller listed on its own.
    const store = group.stores[0] ?? null;
    const direct = directOffer(group);
    // Babylist / MacroBaby / Bombi are preferred; a stroller with only an Amazon
    // link (e.g. a hand-added product) still surfaces on Amazon alone; then a
    // store link, the brand's direct link, and finally an open-box-only product
    // surfaces on GoodBuy Gear.
    const primary = babylist ?? macrobaby ?? bombi ?? amazon ?? store ?? direct ?? gbgShop;
    if (!primary) continue;

    const source: PublicStrollerProduct['source'] = babylist
      ? 'babylist'
      : macrobaby
        ? 'macrobaby'
        : bombi
          ? 'bombi'
          : amazon
            ? 'amazon'
            : store
              ? 'store'
              : direct
                ? 'direct'
                : 'goodbuygear';
    // Raw open-box match, then gate the *badge* by the admin override. An
    // open-box-only card (source === 'goodbuygear') keeps its link — that's its
    // primary CTA, not a badge — so overrides only affect supplemental badges.
    const rawGbg: RetailerOffer | null = group.gbg
      ? { price: group.gbg.price, url: group.gbg.url }
      : gbgShop
        ? { price: gbgShop.price, url: gbgShop.url }
        : null;
    const gbgState = gbgOverrides.get(gbgBadgeKey(group.brand, group.model));
    const showGbg = source === 'goodbuygear' ? true : applyGbgBadge(!!rawGbg, gbgState);
    const product: PublicStrollerProduct = {
      name: primary.title,
      model: group.model,
      displayModel: strollerPublicDisplayModel(group.model, group.brand),
      summary: getStrollerProfile(group.brand, group.model)?.description ?? null,
      price: primary.price,
      image:
        babylist?.image ??
        macrobaby?.image ??
        bombi?.image ??
        amazonOffer?.image ??
        store?.image ??
        direct?.image ??
        group.anb?.image ??
        group.gbg?.image ??
        gbgShop?.image ??
        group.fallback?.image ??
        null,
      affiliateUrl: primary.url,
      source,
      retailers: {
        babylist: babylist ? { price: babylist.price, url: babylist.url } : null,
        amazon: amazonUrl ? { price: amazonOffer?.price ?? null, url: amazonUrl } : null,
        macrobaby: macrobaby ? { price: macrobaby.price, url: macrobaby.url } : null,
        bombi: bombi ? { price: bombi.price, url: bombi.url } : null,
        anb: null,
        goodbuygear: showGbg ? rawGbg : null,
      },
      extraRetailers: mergeExtraRetailers(group, adminStoreLinks),
      gbgMatch: rawGbg,
    };

    if (!byBrand.has(group.brand)) byBrand.set(group.brand, new Map());
    const byCategory = byBrand.get(group.brand)!;
    if (!byCategory.has(group.category)) byCategory.set(group.category, []);
    byCategory.get(group.category)!.push(product);
  }

  return [...byBrand.entries()]
    .map(([brand, byCategory]) => {
      const types = [...byCategory.entries()]
        .map(([category, products]) => ({
          category,
          label: STROLLER_CATEGORY_LABELS[category],
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => PUBLIC_STROLLER_TYPE_ORDER.indexOf(a.category) - PUBLIC_STROLLER_TYPE_ORDER.indexOf(b.category));
      const count = types.reduce((n, type) => n + type.products.length, 0);
      return { brand, count, types };
    })
    .filter((brand) => brand.count > 0)
    .sort((a, b) => a.brand.localeCompare(b.brand));
}

/**
 * The public stroller catalog, loaded once per request: the finder, Compare and
 * every travel-system lookup in a request read the same result.
 */
export const getPublicStrollerCatalogBrands = cache(loadPublicStrollerCatalogBrands);

export async function getPublicStrollerCatalogTravelSystemOptions(): Promise<TravelSystemStrollerOption[]> {
  const brands = await getPublicStrollerCatalogBrands();
  return brands.flatMap((brandRow) =>
    brandRow.types.flatMap((typeRow) =>
      typeRow.products.map((product) => ({
        brand: brandRow.brand,
        model: product.model,
        displayName: `${brandRow.brand} ${product.displayModel}`.replace(/\s+/g, ' ').trim(),
        // Same curated summary the finder shows, so the checker cards match.
        summary: getStrollerProfile(brandRow.brand, product.model)?.description ?? null,
        strollerCategory: typeRow.category,
        babylistUrl: product.retailers.babylist?.url ?? null,
        babylistImage: product.source === 'babylist' ? product.image : null,
        babylistPrice: product.retailers.babylist?.price ?? null,
        macroBabyUrl: product.retailers.macrobaby?.url ?? null,
        macroBabyImage: product.source === 'macrobaby' ? product.image : null,
        macroBabyPrice: product.retailers.macrobaby?.price ?? null,
        bombiUrl: product.retailers.bombi?.url ?? null,
        bombiImage: product.source === 'bombi' ? product.image : null,
        bombiPrice: product.retailers.bombi?.price ?? null,
        amazonImage: product.source === 'amazon' ? product.image : null,
        amazonPrice: product.retailers.amazon?.price ?? null,
        amazonUrl: product.retailers.amazon?.url ?? null,
        extraRetailers: product.extraRetailers ?? [],
        // Photo for a card sold only through a store or direct link.
        fallbackImage: product.source === 'store' || product.source === 'direct' ? product.image : null,
      })),
    ),
  );
}
