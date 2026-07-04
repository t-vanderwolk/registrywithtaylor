import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import {
  normalizeStrollerVariantModel,
  strollerVariantNoiseScore,
} from '@/lib/catalog/strollerVariantIdentity';
import {
  canonicalStrollerBrand,
  isExcludedStrollerFinderProduct,
} from '@/lib/catalog/strollerFinderRules';
import { hasPublicCoreRetailer, isGoodBuyGearOffer, isBombiOffer, isAmazonOffer, isAmazonUrl } from '@/lib/catalog/publicRetailerVisibility';
import prisma from '@/lib/server/prisma';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';
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
  manualAmazonUrl: string | null;
  retailer: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null; canonicalBrand: string | null; canonicalName: string | null } | null;
};

type RetailerOffer = { price: number | null; url: string | null };
type Offer = RetailerOffer & { image: string | null; title: string };

export type PublicStrollerProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  source: 'babylist' | 'macrobaby' | 'bombi' | 'amazon';
  retailers: {
    babylist: RetailerOffer | null;
    amazon: RetailerOffer | null;
    macrobaby: RetailerOffer | null;
    bombi: RetailerOffer | null;
    anb: RetailerOffer | null;
    goodbuygear: RetailerOffer | null;
  };
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
  return Boolean(
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

export async function getPublicStrollerCatalogBrands(): Promise<PublicStrollerBrand[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct
    .findMany({
      where: {
        isActiveInFeed: true,
        enrichment: {
          is: {
            tmbcCategory: 'Strollers',
            needsReview: false,
            reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
          },
        },
      },
      select: {
        provider: true,
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        productUrl: true,
        affiliateUrl: true,
        manualAmazonUrl: true,
        retailer: true,
        itemGroupId: true,
        enrichment: { select: { productType: true, canonicalBrand: true, canonicalName: true } },
      },
      orderBy: { title: 'asc' },
    })
    .catch(() => [] as CatalogProductRow[]);

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
  };

  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();

  for (const row of rows) {
    const category = strollerCategoryFromProductType(row.enrichment?.productType);
    if (!category) continue;
    if (isExcludedStrollerFinderProduct({
      brand: row.brand,
      title: row.title,
      productUrl: row.productUrl,
      affiliateUrl: row.affiliateUrl,
    })) {
      continue;
    }

    if (row.itemGroupId) {
      const groupIdKey = `${row.provider}:${row.itemGroupId}`;
      if (seenGroups.has(groupIdKey)) continue;
      seenGroups.add(groupIdKey);
    }

    const rawBrand = (row.enrichment?.canonicalBrand || row.brand || '').trim();
    const brand = canonicalStrollerBrand(rawBrand);
    const rawModel = modelLikeCanonicalName(row.enrichment?.canonicalName) ?? parseStrollerModel(row.title, rawBrand || brand);
    const model = cleanPublicModelName(rawModel, brand);
    if (!model) continue;
    const key = productModelKey(brand, model || row.title);

    let group = groups.get(key);
    if (!group) {
      group = { category, brand, model, babylist: null, macrobaby: null, bombi: null, amazon: null, anb: null, gbg: null };
      groups.set(key, group);
    }

    const offer: Offer = { price: row.price, url: row.affiliateUrl, image: row.imageUrl, title: row.title };
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
      if (isAmazonUrl(row.affiliateUrl)) {
        if (!group.amazon) group.amazon = offer;
      } else if (/babylist|pxf\.io/i.test(row.affiliateUrl ?? '')) {
        if (!group.babylist) { group.babylist = offer; group.category = category; }
      } else if (/macrobaby/i.test(row.affiliateUrl ?? '')) {
        if (cheaper(group.macrobaby)) group.macrobaby = offer;
      } else if (row.affiliateUrl?.trim() && !group.amazon) {
        // Unknown host — surface it under the generic Amazon-style CTA.
        group.amazon = offer;
      }
    }
  }

  const compatibilityCounts = await loadStrollerCompatibilityCounts();
  const groupCompatibilityCount = (group: Group) =>
    compatibilityCounts.get(productModelKey(group.brand, group.model)) ?? 0;
  const coreOfferCount = (group: Group) =>
    Number(isPublicBabylistOffer(group.babylist)) +
    Number(isPublicMacroBabyOffer(group.macrobaby)) +
    Number(isPublicBombiOffer(group.bombi)) +
    Number(isPublicAmazonOffer(group.amazon));
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

  const byBrand = new Map<string, Map<StrollerCategory, PublicStrollerProduct[]>>();
  for (const group of visibleGroups.values()) {
    const babylist = isPublicBabylistOffer(group.babylist) ? group.babylist : null;
    const macrobaby = isPublicMacroBabyOffer(group.macrobaby) ? group.macrobaby : null;
    const bombi = isPublicBombiOffer(group.bombi) ? group.bombi : null;
    const amazon = isPublicAmazonOffer(group.amazon) ? group.amazon : null;
    // Babylist / MacroBaby / Bombi are preferred; a stroller with only an Amazon
    // link (e.g. a hand-added product) still surfaces on Amazon alone.
    const primary = babylist ?? macrobaby ?? bombi ?? amazon;
    if (!primary) continue;

    // Prefer the catalog's own Amazon link (manual override); fall back to the
    // static per-model Amazon map.
    const amazonUrl = amazon?.url ?? getAffiliateLinks(group.brand, group.model).amazonUrl ?? null;
    const product: PublicStrollerProduct = {
      name: primary.title,
      model: group.model,
      price: primary.price,
      image: babylist?.image ?? macrobaby?.image ?? bombi?.image ?? amazon?.image ?? group.anb?.image ?? group.gbg?.image ?? null,
      affiliateUrl: primary.url,
      source: babylist ? 'babylist' : macrobaby ? 'macrobaby' : bombi ? 'bombi' : 'amazon',
      retailers: {
        babylist: babylist ? { price: babylist.price, url: babylist.url } : null,
        amazon: amazonUrl ? { price: amazon?.price ?? null, url: amazonUrl } : null,
        macrobaby: macrobaby ? { price: macrobaby.price, url: macrobaby.url } : null,
        bombi: bombi ? { price: bombi.price, url: bombi.url } : null,
        anb: null,
        goodbuygear: group.gbg ? { price: group.gbg.price, url: group.gbg.url } : null,
      },
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

export async function getPublicStrollerCatalogTravelSystemOptions(): Promise<TravelSystemStrollerOption[]> {
  const brands = await getPublicStrollerCatalogBrands();
  return brands.flatMap((brandRow) =>
    brandRow.types.flatMap((typeRow) =>
      typeRow.products.map((product) => ({
        brand: brandRow.brand,
        model: product.model,
        displayName: `${brandRow.brand} ${product.model}`.replace(/\s+/g, ' ').trim(),
        summary: null,
        babylistUrl: product.retailers.babylist?.url ?? null,
        babylistImage: product.source === 'babylist' ? product.image : null,
        babylistPrice: product.retailers.babylist?.price ?? null,
        macroBabyUrl: product.retailers.macrobaby?.url ?? null,
        macroBabyImage: product.source === 'macrobaby' ? product.image : null,
        macroBabyPrice: product.retailers.macrobaby?.price ?? null,
        amazonUrl: product.retailers.amazon?.url ?? null,
      })),
    ),
  );
}
