import { Prisma } from '@prisma/client';
import {
  resolveCompatibilityCarSeatImage,
  resolveProductCardImage,
} from '@/lib/blog/productCardImages';
import { adapterTitleMatchesStrollerModel } from '@/lib/catalog/adapterModelMatching';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { canonicalStrollerBrand, isExcludedStrollerFinderProduct } from '@/lib/catalog/strollerFinderRules';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { normalizeStrollerVariantModel } from '@/lib/catalog/strollerVariantIdentity';
import { hasPublicCoreRetailer, isGoodBuyGearUrl } from '@/lib/catalog/publicRetailerVisibility';
import { parseCarSeatModel, parseStrollerModel } from '@/lib/catalog/strollerModel';
import {
  compareCompatibleCarSeats,
  compareCompatibleStrollers,
  isTravelSystemOnlySeat,
  normalizeCompatibilityConfidence,
  normalizeCompatibilityType,
  type CompatibleCarSeatResult,
  type CompatibleStrollerResult,
  type TravelSystemCarSeatOption,
  type TravelSystemCompatibilityByCarSeatResponse,
  type TravelSystemCompatibilityResponse,
  type TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';
import { getPublicStrollerCatalogTravelSystemOptions } from '@/lib/server/publicStrollerCatalog';
import prisma from '@/lib/server/prisma';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';

type StrollerRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  amazonUrl?: string | null;
};

type CarSeatRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  amazonUrl?: string | null;
};

type CarSeatCompatibilityRow = {
  carSeatId: string;
  brand: string;
  model: string;
  displayName: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  amazonUrl?: string | null;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  adapterBabylistUrl: string | null;
  adapterImage: string | null;
  adapterPrice: number | null;
  notes: string | null;
  confidence: string;
};

type StrollerCompatibilityRow = {
  strollerId: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  amazonUrl?: string | null;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  adapterBabylistUrl: string | null;
  adapterImage: string | null;
  adapterPrice: number | null;
  notes: string | null;
  confidence: string;
};

// ── Babylist (Impact.com) enrichment ──────────────────────────────────────────
type BabylistFields = {
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
};

const EMPTY_BABYLIST: BabylistFields = { babylistUrl: null, babylistPrice: null, babylistImage: null };
type MacroBabyFields = {
  macroBabyUrl: string | null;
  macroBabyPrice: number | null;
  macroBabyImage: string | null;
};
type PublicRetailerFields = BabylistFields & MacroBabyFields;

const EMPTY_MACROBABY: MacroBabyFields = { macroBabyUrl: null, macroBabyPrice: null, macroBabyImage: null };
const EMPTY_PUBLIC_RETAILERS: PublicRetailerFields = { ...EMPTY_BABYLIST, ...EMPTY_MACROBABY };

const babylistKey = (brand: string, model: string) => `${brand.toLowerCase()}:::${model.toLowerCase()}`;

type PublicAvailabilityRow = {
  brand: string;
  model: string;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  amazonUrl?: string | null;
};

function hasPublicTravelSystemRetailer(row: PublicAvailabilityRow) {
  // Travel-system-only seats (e.g. Nuna PIPA urbn) have no standalone retailer
  // but must still surface — they're purchased bundled with a Nuna stroller.
  if (isTravelSystemOnlySeat(row.brand, row.model)) return true;
  return hasPublicCoreRetailer([
    { source: 'Babylist', url: row.babylistUrl ?? null, price: row.babylistPrice ?? null },
    { source: 'MacroBaby', url: row.macroBabyUrl ?? null, price: row.macroBabyPrice ?? null },
    { source: 'Amazon', url: row.amazonUrl ?? null, price: null },
  ]);
}

function babylistDestinationText(url: string | null | undefined) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const destination = parsed.searchParams.get('u');
    return `${url} ${destination ? decodeURIComponent(destination) : ''}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function hasInvalidInfantCarSeatBabylistDestination(url: string | null | undefined) {
  const destination = babylistDestinationText(url);
  if (!destination) return false;
  return /\b(travel[-\s]?systems?|travel[-\s]?bags?|convertible|all[-\s]?in[-\s]?one|boosters?|adapters?|covers?|canop(?:y|ies)|inserts?|mirrors?|protectors?)\b/i.test(destination);
}

function publicBabylistFields(fields: BabylistFields, table: 'Stroller' | 'CarSeat'): BabylistFields {
  if (table === 'CarSeat' && hasInvalidInfantCarSeatBabylistDestination(fields.babylistUrl)) {
    return EMPTY_BABYLIST;
  }

  if (!isGoodBuyGearUrl(fields.babylistUrl)) return fields;

  return {
    babylistUrl: null,
    babylistPrice: null,
    babylistImage: fields.babylistImage,
  };
}

type BabylistLookupRow = {
  brand: string;
  model: string;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
};

type MacroBabyLookupRow = {
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  enrichment: { canonicalBrand: string | null; canonicalName: string | null } | null;
};

/** Build a brand:::model → Babylist-fields map for the given table (one query). */
async function loadBabylistMap(table: 'Stroller' | 'CarSeat'): Promise<Map<string, BabylistFields>> {
  try {
    const rows =
      table === 'Stroller'
        ? await prisma.$queryRaw<BabylistLookupRow[]>`
            SELECT "brand", "model", "babylistUrl", "babylistPrice", "babylistImage" FROM "Stroller"
          `
        : await prisma.$queryRaw<BabylistLookupRow[]>`
            SELECT "brand", "model", "babylistUrl", "babylistPrice", "babylistImage" FROM "CarSeat"
          `;

    const map = new Map<string, BabylistFields>();
    for (const row of rows) {
      map.set(
        babylistKey(row.brand, row.model),
        publicBabylistFields(
          {
            babylistUrl: row.babylistUrl,
            babylistPrice: row.babylistPrice,
            babylistImage: row.babylistImage,
          },
          table,
        ),
      );
    }
    return map;
  } catch (error) {
    // If the babylist columns aren't there yet (pre-migration), degrade gracefully.
    if (hasMissingTravelSystemSchema(error)) return new Map();
    throw error;
  }
}

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(stroller|infant|car seat|adapter|accessory|base|cover|canopy|insert|mirror|net)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

function setCheapestMacroBabyOffer(
  map: Map<string, MacroBabyFields>,
  key: string,
  offer: MacroBabyFields,
) {
  const current = map.get(key);
  if (!current || (offer.macroBabyPrice != null && (current.macroBabyPrice == null || offer.macroBabyPrice < current.macroBabyPrice))) {
    map.set(key, offer);
  }
}

async function loadMacroBabyMap(table: 'Stroller' | 'CarSeat'): Promise<Map<string, MacroBabyFields>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const rows: MacroBabyLookupRow[] = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: 'shopify_macrobaby',
        isActiveInFeed: true,
        enrichment: {
          is:
            table === 'Stroller'
              ? {
                  tmbcCategory: 'Strollers',
                  needsReview: false,
                  reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
                }
              : {
                  productType: 'infant car seat',
                  needsReview: false,
                  reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
                },
        },
      },
      select: {
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true } },
      },
    });

    const map = new Map<string, MacroBabyFields>();
    for (const row of rows) {
      if (table === 'Stroller' && isExcludedStrollerFinderProduct({
        brand: row.brand,
        title: row.title,
        affiliateUrl: row.affiliateUrl,
      })) {
        continue;
      }
      const brand = canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand);
      if (!brand) continue;
      const offer: MacroBabyFields = {
        macroBabyUrl: row.affiliateUrl,
        macroBabyPrice: row.price,
        macroBabyImage: row.imageUrl,
      };
      const keys = new Set<string>();
      const canonicalName = modelLikeCanonicalName(row.enrichment?.canonicalName);
      if (canonicalName) keys.add(babylistKey(brand, canonicalName));
      const parsed =
        table === 'Stroller'
          ? parseStrollerModel(row.title, brand)
          : parseCarSeatModel(row.title, brand);
      if (parsed) keys.add(babylistKey(brand, parsed));
      for (const key of keys) setCheapestMacroBabyOffer(map, key, offer);
    }
    return map;
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) return new Map();
    throw error;
  }
}

/**
 * Babylist offers that live in the affiliate catalog under provider
 * `babylist_impact` (manually-added products — e.g. strollers we wired up by
 * hand). The synced Babylist data normally lands on the Stroller / CarSeat
 * table, but manual adds live only in the catalog, so read them here too or the
 * checker would treat those strollers as having no public retailer.
 */
async function loadBabylistImpactMap(table: 'Stroller' | 'CarSeat'): Promise<Map<string, BabylistFields>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const rows: MacroBabyLookupRow[] = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: 'babylist_impact',
        isActiveInFeed: true,
        enrichment: {
          is:
            table === 'Stroller'
              ? { tmbcCategory: 'Strollers', needsReview: false, reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] } }
              : { productType: 'infant car seat', needsReview: false, reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] } },
        },
      },
      select: {
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true } },
      },
    });

    const map = new Map<string, BabylistFields>();
    for (const row of rows) {
      if (table === 'Stroller' && isExcludedStrollerFinderProduct({
        brand: row.brand,
        title: row.title,
        affiliateUrl: row.affiliateUrl,
      })) {
        continue;
      }
      const brand = canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand);
      if (!brand) continue;
      const offer: BabylistFields = {
        babylistUrl: row.affiliateUrl,
        babylistPrice: row.price,
        babylistImage: row.imageUrl,
      };
      const keys = new Set<string>();
      const canonicalName = modelLikeCanonicalName(row.enrichment?.canonicalName);
      if (canonicalName) keys.add(babylistKey(brand, canonicalName));
      const parsed =
        table === 'Stroller' ? parseStrollerModel(row.title, brand) : parseCarSeatModel(row.title, brand);
      if (parsed) keys.add(babylistKey(brand, parsed));
      for (const key of keys) if (!map.has(key)) map.set(key, offer);
    }
    return map;
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) return new Map();
    throw error;
  }
}

async function loadPublicRetailerMap(table: 'Stroller' | 'CarSeat'): Promise<Map<string, PublicRetailerFields>> {
  const [babylistMap, babylistImpactMap, macroBabyMap] = await Promise.all([
    loadBabylistMap(table),
    loadBabylistImpactMap(table),
    loadMacroBabyMap(table),
  ]);
  const out = new Map<string, PublicRetailerFields>();
  const keys = new Set([...babylistMap.keys(), ...babylistImpactMap.keys(), ...macroBabyMap.keys()]);
  for (const key of keys) {
    const tableBabylist = babylistMap.get(key);
    // Prefer the synced Stroller/CarSeat babylist offer; fall back to the
    // babylist_impact catalog offer for manually-added products.
    const babylist =
      tableBabylist && tableBabylist.babylistUrl
        ? tableBabylist
        : babylistImpactMap.get(key) ?? tableBabylist ?? EMPTY_BABYLIST;
    out.set(key, {
      ...babylist,
      ...(macroBabyMap.get(key) ?? EMPTY_MACROBABY),
    });
  }
  return out;
}

/** Attach public retailer url/price/image to each result; prefer core retailer photos. */
function enrichWithPublicRetailers<T extends { brand: string; model: string; imageUrl?: string | null }>(
  items: T[],
  map: Map<string, PublicRetailerFields>,
): T[] {
  return items.map((item) => {
    const fields = map.get(babylistKey(item.brand, item.model)) ?? EMPTY_PUBLIC_RETAILERS;
    // A manually-entered Amazon link (Stroller.amazonUrl / CarSeat.amazonUrl) wins;
    // otherwise fall back to the static per-model Amazon map when the item is public.
    const manualAmazon = (item as { amazonUrl?: string | null }).amazonUrl ?? null;
    const amazonUrl =
      manualAmazon ??
      (hasPublicTravelSystemRetailer({ ...item, ...fields }) ? getAffiliateLinks(item.brand, item.model).amazonUrl ?? null : null);
    return {
      ...item,
      ...fields,
      amazonUrl,
      imageUrl: fields.babylistImage ?? fields.macroBabyImage ?? item.imageUrl ?? null,
    };
  });
}

const DIRECT_DEFAULT_BRANDS = new Set([
  'cybex',
  'joie',
  'nuna',
  'orbit baby',
  'peg perego',
  'romer',
  'uppababy',
]);

const SHARED_ADAPTER_BRANDS = new Set(['britax', 'clek', 'cybex', 'maxi-cosi', 'nuna']);

/**
 * Brands that share the same click-and-go infant-seat adapter standard.
 * If a non-Nuna stroller is compatible with any seat from this group,
 * it is inferred to also accept seats from the expansion brands below.
 */
const SHARED_ADAPTER_TRIGGER_BRAND = 'nuna';
// Britax (B-Safe + Willow) uses the same click-and-go adapter as Maxi-Cosi / Nuna
// / CYBEX / Clek. (B-Safe is discontinued but kept so owners can check fitment.)
const SHARED_ADAPTER_EXPANSION_BRANDS = ['cybex', 'clek', 'maxi-cosi', 'britax'];

/**
 * ── Nuna asymmetry rule ──────────────────────────────────────────────────────
 * Nuna STROLLERS are a closed ecosystem: they accept ONLY same-brand (Nuna)
 * infant seats — no adapters, no cross-brand inference. Nuna CAR SEATS, by
 * contrast, are universal: a Nuna PIPA rides on other brands' strollers through
 * the shared click-and-go adapter. The two halves are intentionally asymmetric.
 *
 *   • Closed direction (stroller → seat): enforced by isClosedEcosystemStroller()
 *     below, which (a) filters a closed stroller's explicit seats down to its own
 *     brand and (b) makes getSharedAdapterInferredSeats() return nothing for it.
 *   • Universal direction (seat → stroller): Nuna is in SHARED_ADAPTER_BRANDS, so
 *     a Nuna seat flows through getSharedAdapterInferredStrollers() onto every
 *     non-closed stroller that takes the shared adapter.
 */
const CLOSED_ECOSYSTEM_STROLLER_BRANDS = new Set(['nuna']);
function isClosedEcosystemStroller(brand: string) {
  return CLOSED_ECOSYSTEM_STROLLER_BRANDS.has(normalizeBrand(brand));
}

// Model-specific direct-fit-only frames: they accept a fixed short list of infant
// seats (via explicit DIRECT rows) and must NOT flow through the shared euro
// adapter expansion in either direction. e.g. the Silver Cross Clic direct-fits
// Nuna + Joie only — no adapter, no Maxi-Cosi / CYBEX / Clek inference.
const DIRECT_FIT_ONLY_STROLLERS: { brand: string; model: RegExp }[] = [
  { brand: 'silver cross', model: /\bclic\b/i },
];
function isDirectFitOnlyStroller(brand: string, model: string) {
  const normalizedBrand = normalizeBrand(brand);
  return DIRECT_FIT_ONLY_STROLLERS.some((rule) => rule.brand === normalizedBrand && rule.model.test(model));
}

function usesSharedInfantSeatAdapter(brand: string) {
  return SHARED_ADAPTER_BRANDS.has(normalizeBrand(brand));
}

function getDisplayName(brand: string, model: string, displayName?: string | null) {
  const generated = `${brand} ${model}`.replace(/\s+/g, ' ').trim();
  const explicit = displayName?.replace(/\s+/g, ' ').trim();
  const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9+]+/g, '');
  const normalizedModel = model.toLowerCase().replace(/[^a-z0-9+]+/g, '');
  const normalizedExplicit = (explicit ?? '').toLowerCase().replace(/[^a-z0-9+]+/g, '');
  const normalizedGenerated = generated.toLowerCase().replace(/[^a-z0-9+]+/g, '');

  if (explicit && normalizedExplicit !== normalizedGenerated) return explicit;
  if (normalizedModel.startsWith(normalizedBrand)) return model;
  return explicit || generated;
}

function normalizeBrand(value: string) {
  return value.trim().toLowerCase();
}

function normalizeModel(value: string) {
  return value.trim().toLowerCase();
}

async function findPublicStrollerCatalogOption(brand: string, model: string) {
  const normalizedBrand = normalizeBrand(brand);
  const normalizedModel = normalizeModel(model);
  const options = await getPublicStrollerCatalogTravelSystemOptions();
  return options.find(
    (option) =>
      normalizeBrand(option.brand) === normalizedBrand &&
      normalizeModel(option.model) === normalizedModel,
  ) ?? null;
}

function supportsSameBrandDirectDefault(brand: string) {
  return DIRECT_DEFAULT_BRANDS.has(normalizeBrand(brand));
}

function getAdapterType(
  strollerBrand: string,
  carSeatBrand: string,
  adapterRequired: boolean,
  adapterType?: string | null,
  notes?: string | null,
) {
  if (!adapterRequired) {
    return null;
  }

  if (usesSharedInfantSeatAdapter(carSeatBrand)) {
    return `${strollerBrand} adapter for Maxi-Cosi / Nuna / CYBEX / Clek / Britax infant seats`;
  }

  if (adapterType?.trim()) {
    return adapterType.trim();
  }

  const note = notes?.toLowerCase() ?? '';
  if (note.includes('included')) {
    return 'Included with stroller';
  }

  if (note.includes('sold separately')) {
    return `${strollerBrand} car seat adapter (sold separately)`;
  }

  if (normalizeBrand(carSeatBrand) === normalizeBrand(strollerBrand)) {
    return `${strollerBrand} infant car seat adapter`;
  }

  return `${strollerBrand} adapter for ${carSeatBrand} infant seats`;
}

function hasMissingTravelSystemSchema(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2010' || error.code === 'P2021' || error.code === 'P2022';
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      (message.includes('relation') && message.includes('does not exist')) ||
      (message.includes('table') && message.includes('does not exist')) ||
      (message.includes('column') && message.includes('does not exist'))
    );
  }

  return false;
}

async function findStrollerByBrandAndModel(brand: string, model: string) {
  return prisma.$queryRaw<StrollerRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary",
      "babylistUrl",
      "babylistPrice",
      "babylistImage"
    FROM "Stroller"
    WHERE LOWER("brand") = LOWER(${brand})
    ORDER BY
      CASE
        WHEN LOWER("model") = LOWER(${model}) THEN 0
        WHEN LOWER("model") LIKE LOWER(${`${model}%`}) THEN 1
        WHEN LOWER(COALESCE("displayName", "brand" || ' ' || "model")) = LOWER(${`${brand} ${model}`}) THEN 2
        WHEN LOWER(COALESCE("displayName", "brand" || ' ' || "model")) LIKE LOWER(${`%${model}%`}) THEN 3
        ELSE 4
      END,
      LENGTH("model"),
      LOWER("model")
    LIMIT 1
  `;
}

async function findCarSeatByBrandAndModel(brand: string, model: string) {
  return prisma.$queryRaw<CarSeatRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary",
      "babylistUrl",
      "babylistPrice",
      "babylistImage"
    FROM "CarSeat"
    WHERE "seatType" = 'INFANT'
      AND LOWER("brand") = LOWER(${brand})
    ORDER BY
      CASE
        WHEN LOWER("model") = LOWER(${model}) THEN 0
        WHEN LOWER("model") LIKE LOWER(${`${model}%`}) THEN 1
        WHEN LOWER(COALESCE("displayName", "brand" || ' ' || "model")) = LOWER(${`${brand} ${model}`}) THEN 2
        WHEN LOWER(COALESCE("displayName", "brand" || ' ' || "model")) LIKE LOWER(${`%${model}%`}) THEN 3
        ELSE 4
      END,
      LENGTH("model"),
      LOWER("model")
    LIMIT 1
  `;
}

async function getSameBrandDefaultCarSeats(
  stroller: StrollerRow,
  explicitSeatIds: Set<string>,
  retailerMap: Map<string, PublicRetailerFields>,
) {
  if (!supportsSameBrandDirectDefault(stroller.brand)) {
    return [];
  }

  const rows = await prisma.$queryRaw<CarSeatRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary",
      "babylistUrl",
      "babylistPrice",
      "babylistImage"
    FROM "CarSeat"
    WHERE "seatType" = 'INFANT'
      AND LOWER("brand") = LOWER(${stroller.brand})
    ORDER BY LOWER("model")
  `;

  return enrichWithPublicRetailers(rows, retailerMap)
    .filter((row) => !explicitSeatIds.has(row.id) && hasPublicTravelSystemRetailer(row));
}

async function getSameBrandDefaultStrollers(
  carSeat: CarSeatRow,
  explicitStrollerIds: Set<string>,
  retailerMap: Map<string, PublicRetailerFields>,
) {
  if (!supportsSameBrandDirectDefault(carSeat.brand)) {
    return [];
  }

  const rows = await prisma.$queryRaw<StrollerRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary",
      "babylistUrl",
      "babylistPrice",
      "babylistImage"
    FROM "Stroller"
    WHERE LOWER("brand") = LOWER(${carSeat.brand})
    ORDER BY LOWER("model")
  `;

  return enrichWithPublicRetailers(rows, retailerMap)
    .filter((row) => !explicitStrollerIds.has(row.id) && hasPublicTravelSystemRetailer(row));
}

/**
 * For non-Nuna strollers that have at least one explicit Nuna infant-seat compatibility:
 * also infer adapter-based compatibility with all CYBEX, Clek, and Maxi-Cosi infant seats.
 * (They share the same click-and-go adapter standard as Nuna.)
 *
 * Nuna strollers are a closed ecosystem and always return empty here.
 */
async function getSharedAdapterInferredSeats(
  stroller: StrollerRow,
  explicitRows: CarSeatCompatibilityRow[],
  retailerMap: Map<string, PublicRetailerFields>,
): Promise<CarSeatRow[]> {
  // Closed-ecosystem strollers (Nuna) never expand cross-brand — they only ever
  // accept their own same-brand infant seats.
  if (isClosedEcosystemStroller(stroller.brand)) {
    return [];
  }

  // Direct-fit-only frames (e.g. Silver Cross Clic) never expand cross-brand.
  if (isDirectFitOnlyStroller(stroller.brand, stroller.model)) {
    return [];
  }

  // Only expand if the stroller already has an explicit Nuna seat in its list
  const hasNunaTrigger = explicitRows.some(
    (row) => normalizeBrand(row.brand) === SHARED_ADAPTER_TRIGGER_BRAND,
  );
  if (!hasNunaTrigger) {
    return [];
  }

  const explicitSeatIds = new Set(explicitRows.map((row) => row.carSeatId));
  const inferred: CarSeatRow[] = [];

  for (const brand of SHARED_ADAPTER_EXPANSION_BRANDS) {
    const rows = await prisma.$queryRaw<CarSeatRow[]>`
      SELECT
        "id",
        "brand",
        "model",
        "displayName",
        "summary",
        "babylistUrl",
        "babylistPrice",
        "babylistImage"
      FROM "CarSeat"
      WHERE "seatType" = 'INFANT'
        AND LOWER("brand") = LOWER(${brand})
      ORDER BY LOWER("model")
    `;
    for (const row of enrichWithPublicRetailers(rows, retailerMap)) {
      if (!explicitSeatIds.has(row.id) && hasPublicTravelSystemRetailer(row)) {
        inferred.push(row);
        explicitSeatIds.add(row.id); // prevent dupes across expansion brands
      }
    }
  }

  return inferred;
}

/**
 * Reverse of getSharedAdapterInferredSeats: for a shared-adapter infant seat
 * (Maxi-Cosi / Nuna / CYBEX / Clek / Britax), list every non-Nuna stroller that
 * explicitly accepts a Nuna seat — those strollers take the same shared adapter,
 * so they also accept this seat. Nuna strollers (closed ecosystem) are excluded.
 */
async function getSharedAdapterInferredStrollers(
  carSeat: CarSeatRow,
  seenStrollerIds: Set<string>,
  retailerMap: Map<string, PublicRetailerFields>,
): Promise<StrollerRow[]> {
  if (!usesSharedInfantSeatAdapter(carSeat.brand)) {
    return [];
  }

  // No "SELECT DISTINCT … ORDER BY LOWER(col)" — Postgres requires DISTINCT's
  // ORDER BY expressions to be in the select list. Dedupe + sort in JS instead.
  const rows = await prisma.$queryRaw<StrollerRow[]>`
    SELECT
      stroller."id",
      stroller."brand",
      stroller."model",
      stroller."displayName",
      stroller."summary",
      stroller."babylistUrl",
      stroller."babylistPrice",
      stroller."babylistImage"
    FROM "Compatibility" AS compat
    INNER JOIN "Stroller" AS stroller ON stroller."id" = compat."strollerId"
    INNER JOIN "CarSeat" AS seat ON seat."id" = compat."carSeatId"
    WHERE seat."seatType" = 'INFANT'
      AND LOWER(seat."brand") = ${SHARED_ADAPTER_TRIGGER_BRAND}
      AND LOWER(stroller."brand") NOT IN (${Prisma.join([...CLOSED_ECOSYSTEM_STROLLER_BRANDS])})
  `;

  const seen = new Set(seenStrollerIds);
  const out: StrollerRow[] = [];
  for (const row of enrichWithPublicRetailers(rows, retailerMap)) {
    if (seen.has(row.id) || !hasPublicTravelSystemRetailer(row)) continue;
    // Direct-fit-only frames (Silver Cross Clic) don't accept the shared adapter.
    if (isDirectFitOnlyStroller(row.brand, row.model)) continue;
    seen.add(row.id);
    out.push(row);
  }
  out.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
  return out;
}

export async function getTravelSystemStrollers() {
  try {
    return await getPublicStrollerCatalogTravelSystemOptions();
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return [];
    }

    throw error;
  }
}

export async function getTravelSystemCarSeats() {
  try {
    const rows = await prisma.$queryRaw<CarSeatRow[]>`
      SELECT
        "id",
        "brand",
        "model",
        "displayName",
        "summary",
        "babylistUrl",
        "babylistPrice",
        "babylistImage",
        "amazonUrl"
      FROM "CarSeat"
      WHERE "seatType" = 'INFANT'
      ORDER BY LOWER("brand"), LOWER("model")
    `;

    const retailerMap = await loadPublicRetailerMap('CarSeat');

    return enrichWithPublicRetailers(rows, retailerMap)
      .filter(hasPublicTravelSystemRetailer)
      .map<TravelSystemCarSeatOption>((row) => ({
        brand: row.brand,
        model: row.model,
        displayName: getDisplayName(row.brand, row.model, row.displayName),
        summary: row.summary,
        babylistUrl: row.babylistUrl,
        babylistImage: row.babylistImage,
        babylistPrice: row.babylistPrice,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        amazonUrl: row.amazonUrl ?? null,
        travelSystemOnly: isTravelSystemOnlySeat(row.brand, row.model),
      }));
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return [];
    }

    throw error;
  }
}

// ─── Adapter product enrichment (from the affiliate catalog) ────────────────
// Explicit Compatibility rows can carry a synced adapter (image/url/price), but
// most adapter-required matches are inferred and have only a descriptive name.
// Fill the image + Babylist link from the catalog so the checker shows the
// actual adapter to buy. Affiliate URLs are used exactly as stored.

type CatalogAdapter = { provider: string; title: string; imageUrl: string | null; affiliateUrl: string | null; price: number | null };
type StrollerAdapterRef = { brand: string; model: string };

// Car-seat adapters only surface Babylist / MacroBaby / manual links. ANB Baby
// (Awin) is intentionally excluded, and Babylist is preferred when several match.
const ADAPTER_PROVIDERS = ['babylist_impact', 'shopify_macrobaby', 'manual_tmbc'];
const ADAPTER_PROVIDER_RANK: Record<string, number> = { babylist_impact: 0, shopify_macrobaby: 1, manual_tmbc: 2 };

/** True for an ANB Baby / Awin affiliate link, which we never surface for adapters. */
function isAnbAdapterUrl(url: string | null | undefined): boolean {
  return !!url && /awin1?\.com|anb-?baby/i.test(url);
}

async function getCatalogAdapters(): Promise<CatalogAdapter[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const rows: CatalogAdapter[] = await db.affiliateCatalogProduct.findMany({
      where: {
        isActiveInFeed: true,
        provider: { in: ADAPTER_PROVIDERS },
        title: { contains: 'adapter', mode: 'insensitive' },
        enrichment: {
          is: {
            tmbcCategory: 'Travel Systems & Adapters',
            needsReview: false,
            reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
          },
        },
      },
      select: { provider: true, title: true, imageUrl: true, affiliateUrl: true, price: true },
    });
    return rows
      .filter((r) => /adapter/i.test(r.title || '') && !isAnbAdapterUrl(r.affiliateUrl))
      .sort((a, b) => (ADAPTER_PROVIDER_RANK[a.provider] ?? 9) - (ADAPTER_PROVIDER_RANK[b.provider] ?? 9));
  } catch {
    return [];
  }
}

function adaptersForStrollerModel(adapters: CatalogAdapter[], stroller: StrollerAdapterRef) {
  return adapters.filter((adapter) => adapterTitleMatchesStrollerModel(adapter.title, stroller.model, stroller.brand).matched);
}

const normalizeAlnum = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

// Nuna / Maxi-Cosi / CYBEX / Clek share one "euro" click-and-go adapter, so an
// adapter naming any one of them fits the whole group. (Britax is intentionally
// NOT here — it pairs with the Graco-style adapter, not the euro one.)
const EURO_SEAT_GROUP = ['nuna', 'maxicosi', 'cybex', 'clek'];

// Infant car-seat brand tokens that, when named in an adapter title, mark that
// adapter as a brand-specific variant (e.g. the Mockingbird "Graco/Chicco/Baby
// Jogger/Britax" adapter vs the separate "UPPAbaby" one). A title naming none of
// these is a universal adapter that fits the shared euro group.
const CAR_SEAT_BRAND_TOKENS = [
  'nuna', 'maxicosi', 'cybex', 'clek', 'britax', 'besafe', 'bsafe',
  'graco', 'chicco', 'uppababy', 'pegperego', 'joie', 'babyjogger',
  'doona', 'evenflo', 'safety1st', 'cosco',
];

function adapterNamesSpecificSeatBrands(title: string): boolean {
  const normalized = normalizeAlnum(title);
  return CAR_SEAT_BRAND_TOKENS.some((token) => normalized.includes(token));
}

/** Pick the adapter that actually fits THIS car-seat brand for the stroller.
 *  Adapters are stroller-model specific → car-seat-brand specific, so we never
 *  fall back to a wrong branded variant: match the exact brand (euro seats match
 *  any euro-group adapter), else a universal adapter, else null so the caller
 *  uses a brand-scoped search link instead of a mismatched adapter. */
function pickAdapter(adapters: CatalogAdapter[], carSeatBrand: string): CatalogAdapter | null {
  if (adapters.length === 0) return null;
  const cs = normalizeAlnum(carSeatBrand);
  const csIsEuro = EURO_SEAT_GROUP.includes(cs);

  // 1a. Prefer an adapter that names THIS car-seat brand exactly.
  const exact = adapters.find((a) => normalizeAlnum(a.title).includes(cs));
  if (exact) return exact;

  // 1b. Euro-group seats otherwise accept any shared euro adapter (one adapter
  //     covers Nuna / Maxi-Cosi / CYBEX / Clek). Only AFTER an exact-brand match,
  //     so a Nuna-only ring adapter is never picked for a Maxi-Cosi seat.
  if (csIsEuro) {
    const euro = adapters.find((a) => EURO_SEAT_GROUP.some((brand) => normalizeAlnum(a.title).includes(brand)));
    if (euro) return euro;
  }

  // 2. No brand match. Use a universal adapter (names no specific seat brand) if
  //    one exists; otherwise return null so we don't surface a wrong variant.
  const generic = adapters.filter((a) => !adapterNamesSpecificSeatBrands(a.title));
  if (generic.length > 0) {
    return generic.find((a) => /car ?seat|infant/i.test(a.title)) ?? generic[0];
  }
  return null;
}

/** Last-resort adapter link so an adapter-required pairing is never left with a
 *  dead "Adapter link unavailable" state. Points at an Amazon search scoped to
 *  the exact stroller + car-seat brands, with the affiliate tag. */
function amazonAdapterSearchUrl(strollerBrand: string, carSeatBrand: string) {
  const query = `${strollerBrand} ${carSeatBrand} infant car seat adapter`.replace(/\s+/g, ' ').trim();
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=taylormadebab-20`;
}

/** Fill missing adapter image/link/price on adapter-required rows from the
 *  catalog, keyed on the stroller model (cached) and the car-seat brand. Every
 *  adapter-required row is guaranteed a link: catalog product first, otherwise
 *  an Amazon adapter search fallback. */
async function fillAdapterProducts<
  T extends {
    adapterRequired: boolean;
    adapterImage?: string | null;
    adapterUrl?: string | null;
    adapterPrice?: number | null;
  },
>(rows: T[], strollerOf: (row: T) => StrollerAdapterRef, carSeatBrandOf: (row: T) => string): Promise<void> {
  const adapters = await getCatalogAdapters();
  const cache = new Map<string, CatalogAdapter[]>();
  for (const row of rows) {
    if (!row.adapterRequired) continue;
    const stroller = strollerOf(row);
    const carSeatBrand = carSeatBrandOf(row);

    if (!row.adapterUrl && !row.adapterImage) {
      const key = `${stroller.brand.toLowerCase().trim()}:::${stroller.model.toLowerCase().trim()}`;
      if (!cache.has(key)) cache.set(key, adaptersForStrollerModel(adapters, stroller));
      const adapter = pickAdapter(cache.get(key)!, carSeatBrand);
      if (adapter) {
        row.adapterImage = adapter.imageUrl ?? row.adapterImage ?? null;
        row.adapterUrl = adapter.affiliateUrl ?? row.adapterUrl ?? null;
        row.adapterPrice = adapter.price ?? row.adapterPrice ?? null;
      }
    }

    // Guarantee availability: no adapter-required pairing is ever link-less.
    if (!row.adapterUrl) {
      row.adapterUrl = amazonAdapterSearchUrl(stroller.brand, carSeatBrand);
    }
  }
}

export async function getTravelSystemCompatibility(
  strollerBrand: string,
  strollerModel: string,
): Promise<TravelSystemCompatibilityResponse | null> {
  const brand = strollerBrand.trim();
  const model = strollerModel.trim();

  if (!brand || !model) {
    return null;
  }

  let strollers: StrollerRow[];
  try {
    strollers = await findStrollerByBrandAndModel(brand, model);
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return null;
    }

    throw error;
  }

  const strollerRetailerMap = await loadPublicRetailerMap('Stroller');
  const stroller = enrichWithPublicRetailers(strollers, strollerRetailerMap)[0];
  if (!stroller || !hasPublicTravelSystemRetailer(stroller)) {
    const catalogOption = await findPublicStrollerCatalogOption(brand, model);
    if (catalogOption) {
      return {
        stroller: catalogOption,
        compatibleCarSeats: [],
      };
    }
    return null;
  }

  let explicitRows: CarSeatCompatibilityRow[];
  try {
    explicitRows = await prisma.$queryRaw<CarSeatCompatibilityRow[]>`
      SELECT
        seat."id" AS "carSeatId",
        seat."brand" AS "brand",
        seat."model" AS "model",
        seat."displayName" AS "displayName",
        seat."babylistUrl" AS "babylistUrl",
        seat."babylistPrice" AS "babylistPrice",
        seat."babylistImage" AS "babylistImage",
        compat."compatibilityType"::text AS "compatibilityType",
        compat."adapterRequired" AS "adapterRequired",
        compat."adapterType" AS "adapterType",
        compat."adapterBabylistUrl" AS "adapterBabylistUrl",
        compat."adapterImage" AS "adapterImage",
        compat."adapterPrice" AS "adapterPrice",
        compat."notes" AS "notes",
        compat."confidence"::text AS "confidence"
      FROM "Compatibility" AS compat
      INNER JOIN "CarSeat" AS seat
        ON seat."id" = compat."carSeatId"
      WHERE compat."strollerId" = ${stroller.id}
        AND seat."seatType" = 'INFANT'
    `;
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return {
        stroller: {
          brand: stroller.brand,
          model: stroller.model,
          displayName: getDisplayName(stroller.brand, stroller.model, stroller.displayName),
          summary: stroller.summary,
        },
        compatibleCarSeats: [],
      };
    }

    throw error;
  }

  // Closed-ecosystem strollers (Nuna) only accept their own same-brand seats —
  // drop any cross-brand explicit row before enrichment.
  const isClosedStroller = isClosedEcosystemStroller(stroller.brand);
  const carSeatRetailerMap = await loadPublicRetailerMap('CarSeat');
  const filteredExplicitRows = enrichWithPublicRetailers(
    isClosedStroller
    ? explicitRows.filter((row) => normalizeBrand(row.brand) === normalizeBrand(stroller.brand))
    : explicitRows,
    carSeatRetailerMap,
  );
  const publicExplicitRows = filteredExplicitRows.filter(hasPublicTravelSystemRetailer);

  const explicitSeatIds = new Set(publicExplicitRows.map((row) => row.carSeatId));
  const sameBrandDefaults = await getSameBrandDefaultCarSeats(stroller, explicitSeatIds, carSeatRetailerMap);
  const inferredSeats = await getSharedAdapterInferredSeats(stroller, publicExplicitRows, carSeatRetailerMap);

  const compatibleCarSeats = [
    ...publicExplicitRows.map<CompatibleCarSeatResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveCompatibilityCarSeatImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        compatibilityType: normalizeCompatibilityType(row.compatibilityType),
        adapterRequired: row.adapterRequired,
        adapterType: getAdapterType(stroller.brand, row.brand, row.adapterRequired, row.adapterType, row.notes),
        adapterImage: row.adapterImage,
        adapterUrl: isAnbAdapterUrl(row.adapterBabylistUrl) ? null : row.adapterBabylistUrl,
        adapterPrice: row.adapterPrice,
        notes: row.notes,
        confidence: normalizeCompatibilityConfidence(row.confidence),
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
        travelSystemOnly: isTravelSystemOnlySeat(row.brand, row.model),
      };
    }),
    ...sameBrandDefaults.map<CompatibleCarSeatResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveCompatibilityCarSeatImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        compatibilityType: 'DIRECT',
        adapterRequired: false,
        adapterType: null,
        notes:
          'This is the same-brand default path. Confirm the current release details before you buy, but it is the cleanest place to start.',
        confidence: 'MEDIUM',
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
        travelSystemOnly: isTravelSystemOnlySeat(row.brand, row.model),
      };
    }),
    // Inferred seats: CYBEX / Clek / Maxi-Cosi seats share the same adapter standard as Nuna
    ...inferredSeats.map<CompatibleCarSeatResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveCompatibilityCarSeatImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        compatibilityType: 'ADAPTER',
        adapterRequired: true,
        adapterType: getAdapterType(stroller.brand, row.brand, true, null, null),
        notes:
          'Compatible via the shared Nuna / CYBEX / Clek / Maxi-Cosi adapter standard. Verify the specific adapter for your stroller model before purchase.',
        confidence: 'MEDIUM',
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
        travelSystemOnly: isTravelSystemOnlySeat(row.brand, row.model),
      };
    }),
  ]
    .filter((row) => row.compatibilityType !== 'INCOMPATIBLE')
    .sort(compareCompatibleCarSeats);

  // Stroller-first: the adapter is the selected stroller's; the car seat varies.
  await fillAdapterProducts(
    compatibleCarSeats,
    () => ({ brand: stroller.brand, model: stroller.model }),
    (row) => row.brand,
  );

  return {
    stroller: {
      brand: stroller.brand,
      model: stroller.model,
      displayName: getDisplayName(stroller.brand, stroller.model, stroller.displayName),
      summary: stroller.summary,
      babylistUrl: stroller.babylistUrl,
      babylistImage: stroller.babylistImage,
      babylistPrice: stroller.babylistPrice,
      macroBabyUrl: stroller.macroBabyUrl ?? null,
      macroBabyImage: stroller.macroBabyImage ?? null,
      macroBabyPrice: stroller.macroBabyPrice ?? null,
      amazonUrl: stroller.amazonUrl ?? null,
    },
    compatibleCarSeats: compatibleCarSeats.filter(hasPublicTravelSystemRetailer),
  };
}

/** The Stroller Finder's identity key for a stroller (brand + variant-normalized
 *  model). Used to match compatible strollers against the public catalog so the
 *  by-car-seat view shows exactly the strollers the finder / stroller-first show. */
function finderStrollerKey(brand: string, model: string) {
  const canonical = canonicalStrollerBrand(brand);
  return productModelKey(canonical, normalizeStrollerVariantModel(model, canonical) || model);
}

/**
 * Clean the "compatible strollers" list for the by-car-seat view: drop
 * accessories / non-stroller products (bassinets, second seats, frames, bundles,
 * excluded brands), keep only strollers that are publicly visible in the finder
 * (so anything hidden from the finder / stroller-first is hidden here too), and
 * collapse duplicate variants, keeping the first (already best-ranked) occurrence.
 */
function cleanCompatibleStrollers<T extends { brand: string; model: string; displayName?: string | null }>(
  rows: T[],
  publicStrollerKeys: Set<string>,
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    const title = row.displayName || `${row.brand} ${row.model}`;
    if (isExcludedStrollerFinderProduct({ brand: row.brand, title })) continue;
    const key = finderStrollerKey(row.brand, row.model);
    // Parity with the finder: if it is not in the public stroller catalog, hide it.
    if (!publicStrollerKeys.has(key)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

export async function getTravelSystemCompatibilityByCarSeat(
  carSeatBrand: string,
  carSeatModel: string,
): Promise<TravelSystemCompatibilityByCarSeatResponse | null> {
  const brand = carSeatBrand.trim();
  const model = carSeatModel.trim();

  if (!brand || !model) {
    return null;
  }

  let carSeats: CarSeatRow[];
  try {
    carSeats = await findCarSeatByBrandAndModel(brand, model);
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return null;
    }

    throw error;
  }

  const carSeatRetailerMap = await loadPublicRetailerMap('CarSeat');
  const carSeat = enrichWithPublicRetailers(carSeats, carSeatRetailerMap)[0];
  if (!carSeat || !hasPublicTravelSystemRetailer(carSeat)) {
    return null;
  }

  let explicitRows: StrollerCompatibilityRow[];
  try {
    explicitRows = await prisma.$queryRaw<StrollerCompatibilityRow[]>`
      SELECT
        stroller."id" AS "strollerId",
        stroller."brand" AS "brand",
        stroller."model" AS "model",
        stroller."displayName" AS "displayName",
        stroller."summary" AS "summary",
        stroller."babylistUrl" AS "babylistUrl",
        stroller."babylistPrice" AS "babylistPrice",
        stroller."babylistImage" AS "babylistImage",
        compat."compatibilityType"::text AS "compatibilityType",
        compat."adapterRequired" AS "adapterRequired",
        compat."adapterType" AS "adapterType",
        compat."adapterBabylistUrl" AS "adapterBabylistUrl",
        compat."adapterImage" AS "adapterImage",
        compat."adapterPrice" AS "adapterPrice",
        compat."notes" AS "notes",
        compat."confidence"::text AS "confidence"
      FROM "Compatibility" AS compat
      INNER JOIN "Stroller" AS stroller
        ON stroller."id" = compat."strollerId"
      WHERE compat."carSeatId" = ${carSeat.id}
    `;
  } catch (error) {
    if (hasMissingTravelSystemSchema(error)) {
      return {
        carSeat: {
          brand: carSeat.brand,
          model: carSeat.model,
          displayName: getDisplayName(carSeat.brand, carSeat.model, carSeat.displayName),
          summary: carSeat.summary,
        },
        compatibleStrollers: [],
      };
    }

    throw error;
  }

  const strollerRetailerMap = await loadPublicRetailerMap('Stroller');
  const publicExplicitRows = enrichWithPublicRetailers(explicitRows, strollerRetailerMap)
    .filter(hasPublicTravelSystemRetailer);
  const explicitStrollerIds = new Set(publicExplicitRows.map((row) => row.strollerId));
  const sameBrandDefaults = await getSameBrandDefaultStrollers(carSeat, explicitStrollerIds, strollerRetailerMap);
  const seenStrollerIds = new Set<string>([
    ...explicitStrollerIds,
    ...sameBrandDefaults.map((row) => row.id),
  ]);
  const inferredStrollers = await getSharedAdapterInferredStrollers(carSeat, seenStrollerIds, strollerRetailerMap);

  const compatibleStrollers = [
    ...publicExplicitRows.map<CompatibleStrollerResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveProductCardImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        summary: row.summary,
        compatibilityType: normalizeCompatibilityType(row.compatibilityType),
        adapterRequired: row.adapterRequired,
        adapterType: getAdapterType(row.brand, carSeat.brand, row.adapterRequired, row.adapterType, row.notes),
        adapterImage: row.adapterImage,
        adapterUrl: isAnbAdapterUrl(row.adapterBabylistUrl) ? null : row.adapterBabylistUrl,
        adapterPrice: row.adapterPrice,
        notes: row.notes,
        confidence: normalizeCompatibilityConfidence(row.confidence),
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? (resolvedImage && !resolvedImage.isFallback ? resolvedImage.src : null),
        imageAlt: resolvedImage && !resolvedImage.isFallback ? resolvedImage.alt : null,
      };
    }),
    ...sameBrandDefaults.map<CompatibleStrollerResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveProductCardImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        summary: row.summary,
        compatibilityType: 'DIRECT',
        adapterRequired: false,
        adapterType: null,
        notes:
          'This is the same-brand default path. Confirm the current release details before you buy, but it is the cleanest place to start.',
        confidence: 'MEDIUM',
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? (resolvedImage && !resolvedImage.isFallback ? resolvedImage.src : null),
        imageAlt: resolvedImage && !resolvedImage.isFallback ? resolvedImage.alt : null,
      };
    }),
    // Inferred strollers: any non-Nuna stroller that accepts a Nuna seat takes the
    // same shared adapter, so it also accepts this Maxi-Cosi / CYBEX / Clek / Britax seat.
    ...inferredStrollers.map<CompatibleStrollerResult>((row) => {
      const displayName = getDisplayName(row.brand, row.model, row.displayName);
      const resolvedImage = resolveProductCardImage({
        brand: row.brand,
        productName: displayName,
      });

      return {
        brand: row.brand,
        model: row.model,
        displayName,
        summary: row.summary,
        compatibilityType: 'ADAPTER',
        adapterRequired: true,
        adapterType: getAdapterType(row.brand, carSeat.brand, true, null, null),
        adapterImage: null,
        adapterUrl: null,
        adapterPrice: null,
        notes:
          'Compatible via the shared Nuna / CYBEX / Clek / Maxi-Cosi / Britax adapter standard. Verify the specific adapter for your stroller model before purchase.',
        confidence: 'MEDIUM',
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
        macroBabyUrl: row.macroBabyUrl ?? null,
        macroBabyPrice: row.macroBabyPrice ?? null,
        macroBabyImage: row.macroBabyImage ?? null,
        amazonUrl: row.amazonUrl ?? null,
        imageUrl: row.babylistImage ?? row.macroBabyImage ?? (resolvedImage && !resolvedImage.isFallback ? resolvedImage.src : null),
        imageAlt: resolvedImage && !resolvedImage.isFallback ? resolvedImage.alt : null,
      };
    }),
  ]
    .filter((row) => row.compatibilityType !== 'INCOMPATIBLE')
    .sort(compareCompatibleStrollers);

  // Car-seat-first: the adapter is each matched stroller's; the car seat is fixed.
  await fillAdapterProducts(
    compatibleStrollers,
    (row) => ({ brand: row.brand, model: row.model }),
    () => carSeat.brand,
  );

  // Parity with the finder / stroller-first: only show strollers that are in the
  // public stroller catalog, so anything hidden there is hidden here too.
  const publicStrollerKeys = new Set(
    (await getPublicStrollerCatalogTravelSystemOptions()).map((option) =>
      finderStrollerKey(option.brand, option.model),
    ),
  );

  return {
    carSeat: {
      brand: carSeat.brand,
      model: carSeat.model,
      displayName: getDisplayName(carSeat.brand, carSeat.model, carSeat.displayName),
      summary: carSeat.summary,
      babylistUrl: carSeat.babylistUrl,
      babylistImage: carSeat.babylistImage,
      babylistPrice: carSeat.babylistPrice,
      macroBabyUrl: carSeat.macroBabyUrl ?? null,
      macroBabyImage: carSeat.macroBabyImage ?? null,
      macroBabyPrice: carSeat.macroBabyPrice ?? null,
      amazonUrl: carSeat.amazonUrl ?? null,
    },
    compatibleStrollers: cleanCompatibleStrollers(
      compatibleStrollers.filter(hasPublicTravelSystemRetailer),
      publicStrollerKeys,
    ),
  };
}
