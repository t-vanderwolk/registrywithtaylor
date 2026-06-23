import { Prisma } from '@prisma/client';
import {
  resolveCompatibilityCarSeatImage,
  resolveProductCardImage,
} from '@/lib/blog/productCardImages';
import {
  compareCompatibleCarSeats,
  compareCompatibleStrollers,
  normalizeCompatibilityConfidence,
  normalizeCompatibilityType,
  type CompatibleCarSeatResult,
  type CompatibleStrollerResult,
  type TravelSystemCarSeatOption,
  type TravelSystemCompatibilityByCarSeatResponse,
  type TravelSystemCompatibilityResponse,
  type TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';
import prisma from '@/lib/server/prisma';

type StrollerRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
};

type CarSeatRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
};

type CarSeatCompatibilityRow = {
  carSeatId: string;
  brand: string;
  model: string;
  displayName: string | null;
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

const babylistKey = (brand: string, model: string) => `${brand.toLowerCase()}:::${model.toLowerCase()}`;

type BabylistLookupRow = {
  brand: string;
  model: string;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
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
      map.set(babylistKey(row.brand, row.model), {
        babylistUrl: row.babylistUrl,
        babylistPrice: row.babylistPrice,
        babylistImage: row.babylistImage,
      });
    }
    return map;
  } catch (error) {
    // If the babylist columns aren't there yet (pre-migration), degrade gracefully.
    if (hasMissingTravelSystemSchema(error)) return new Map();
    throw error;
  }
}

/** Attach synced Babylist url/price/image to each result; prefer the real product photo. */
function enrichWithBabylist<T extends { brand: string; model: string; imageUrl?: string | null }>(
  items: T[],
  map: Map<string, BabylistFields>,
): T[] {
  return items.map((item) => {
    const bl = map.get(babylistKey(item.brand, item.model)) ?? EMPTY_BABYLIST;
    return {
      ...item,
      babylistUrl: bl.babylistUrl,
      babylistPrice: bl.babylistPrice,
      babylistImage: bl.babylistImage,
      imageUrl: bl.babylistImage ?? item.imageUrl ?? null,
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

const SHARED_ADAPTER_BRANDS = new Set(['clek', 'cybex', 'maxi-cosi', 'nuna']);

/**
 * Brands that share the same click-and-go infant-seat adapter standard.
 * If a non-Nuna stroller is compatible with any seat from this group,
 * it is inferred to also accept seats from the expansion brands below.
 */
const SHARED_ADAPTER_TRIGGER_BRAND = 'nuna';
const SHARED_ADAPTER_EXPANSION_BRANDS = ['cybex', 'clek', 'maxi-cosi'];

/**
 * Nuna strollers use a closed ecosystem — they only accept Nuna infant car seats.
 * Any cross-brand inference is suppressed for this stroller brand.
 */
const NUNA_CLOSED_STROLLER_BRAND = 'nuna';

function usesSharedInfantSeatAdapter(brand: string) {
  return SHARED_ADAPTER_BRANDS.has(normalizeBrand(brand));
}

function getDisplayName(brand: string, model: string, displayName?: string | null) {
  return displayName?.trim() ? displayName : `${brand} ${model}`;
}

function normalizeBrand(value: string) {
  return value.trim().toLowerCase();
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
    return `${strollerBrand} adapter for Maxi-Cosi / Nuna / CYBEX / Clek infant seats`;
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
      "summary"
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
      "summary"
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

async function getSameBrandDefaultCarSeats(stroller: StrollerRow, explicitSeatIds: Set<string>) {
  if (!supportsSameBrandDirectDefault(stroller.brand)) {
    return [];
  }

  const rows = await prisma.$queryRaw<CarSeatRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary"
    FROM "CarSeat"
    WHERE "seatType" = 'INFANT'
      AND LOWER("brand") = LOWER(${stroller.brand})
    ORDER BY LOWER("model")
  `;

  return rows.filter((row) => !explicitSeatIds.has(row.id));
}

async function getSameBrandDefaultStrollers(carSeat: CarSeatRow, explicitStrollerIds: Set<string>) {
  if (!supportsSameBrandDirectDefault(carSeat.brand)) {
    return [];
  }

  const rows = await prisma.$queryRaw<StrollerRow[]>`
    SELECT
      "id",
      "brand",
      "model",
      "displayName",
      "summary"
    FROM "Stroller"
    WHERE LOWER("brand") = LOWER(${carSeat.brand})
    ORDER BY LOWER("model")
  `;

  return rows.filter((row) => !explicitStrollerIds.has(row.id));
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
): Promise<CarSeatRow[]> {
  // Nuna strollers are closed — no cross-brand expansion
  if (normalizeBrand(stroller.brand) === NUNA_CLOSED_STROLLER_BRAND) {
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
        "summary"
      FROM "CarSeat"
      WHERE "seatType" = 'INFANT'
        AND LOWER("brand") = LOWER(${brand})
      ORDER BY LOWER("model")
    `;
    for (const row of rows) {
      if (!explicitSeatIds.has(row.id)) {
        inferred.push(row);
        explicitSeatIds.add(row.id); // prevent dupes across expansion brands
      }
    }
  }

  return inferred;
}

export async function getTravelSystemStrollers() {
  try {
    const rows = await prisma.$queryRaw<StrollerRow[]>`
      SELECT
        "id",
        "brand",
        "model",
        "displayName",
        "summary"
      FROM "Stroller"
      ORDER BY LOWER("brand"), LOWER("model")
    `;

    return rows.map<TravelSystemStrollerOption>((row) => ({
      brand: row.brand,
      model: row.model,
      displayName: getDisplayName(row.brand, row.model, row.displayName),
      summary: row.summary,
    }));
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
        "summary"
      FROM "CarSeat"
      WHERE "seatType" = 'INFANT'
      ORDER BY LOWER("brand"), LOWER("model")
    `;

    return rows.map<TravelSystemCarSeatOption>((row) => ({
      brand: row.brand,
      model: row.model,
      displayName: getDisplayName(row.brand, row.model, row.displayName),
      summary: row.summary,
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

type CatalogAdapter = { title: string; imageUrl: string | null; affiliateUrl: string | null; price: number | null };

async function getAdaptersForStrollerBrand(brand: string): Promise<CatalogAdapter[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const rows: CatalogAdapter[] = await db.affiliateCatalogProduct.findMany({
      where: {
        isActiveInFeed: true,
        brand: { equals: brand.trim(), mode: 'insensitive' },
        enrichment: { is: { tmbcCategory: 'Travel Systems & Adapters', reviewStatus: { not: 'HIDDEN' } } },
      },
      select: { title: true, imageUrl: true, affiliateUrl: true, price: true },
      take: 60,
    });
    return rows.filter((r) => /adapter/i.test(r.title || ''));
  } catch {
    return [];
  }
}

function pickAdapter(adapters: CatalogAdapter[], carSeatBrand: string): CatalogAdapter | null {
  if (adapters.length === 0) return null;
  const cs = carSeatBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mentionsSeat = adapters.find((a) => a.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cs));
  if (mentionsSeat) return mentionsSeat;
  const carSeatAdapter = adapters.find((a) => /car ?seat|infant/i.test(a.title));
  return carSeatAdapter ?? adapters[0];
}

/** Fill missing adapter image/link/price on adapter-required rows from the
 *  catalog, keyed on the stroller brand (cached) and the car-seat brand. */
async function fillAdapterProducts<
  T extends {
    adapterRequired: boolean;
    adapterImage?: string | null;
    adapterUrl?: string | null;
    adapterPrice?: number | null;
  },
>(rows: T[], strollerBrandOf: (row: T) => string, carSeatBrandOf: (row: T) => string): Promise<void> {
  const cache = new Map<string, CatalogAdapter[]>();
  for (const row of rows) {
    if (!row.adapterRequired || row.adapterUrl || row.adapterImage) continue;
    const sBrand = strollerBrandOf(row);
    const key = sBrand.toLowerCase().trim();
    if (!cache.has(key)) cache.set(key, await getAdaptersForStrollerBrand(sBrand));
    const adapter = pickAdapter(cache.get(key)!, carSeatBrandOf(row));
    if (adapter) {
      row.adapterImage = adapter.imageUrl ?? row.adapterImage ?? null;
      row.adapterUrl = adapter.affiliateUrl ?? row.adapterUrl ?? null;
      row.adapterPrice = adapter.price ?? row.adapterPrice ?? null;
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

  const stroller = strollers[0];
  if (!stroller) {
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

  // Nuna strollers are closed ecosystem — only Nuna infant seats apply
  const isNunaStroller = normalizeBrand(stroller.brand) === NUNA_CLOSED_STROLLER_BRAND;
  const filteredExplicitRows = isNunaStroller
    ? explicitRows.filter((row) => normalizeBrand(row.brand) === NUNA_CLOSED_STROLLER_BRAND)
    : explicitRows;

  const explicitSeatIds = new Set(filteredExplicitRows.map((row) => row.carSeatId));
  const sameBrandDefaults = await getSameBrandDefaultCarSeats(stroller, explicitSeatIds);
  const inferredSeats = await getSharedAdapterInferredSeats(stroller, filteredExplicitRows);

  const compatibleCarSeats = [
    ...filteredExplicitRows.map<CompatibleCarSeatResult>((row) => {
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
        adapterUrl: row.adapterBabylistUrl,
        adapterPrice: row.adapterPrice,
        notes: row.notes,
        confidence: normalizeCompatibilityConfidence(row.confidence),
        imageUrl: resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
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
        imageUrl: resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
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
        imageUrl: resolvedImage?.src ?? null,
        imageAlt: resolvedImage?.alt ?? null,
      };
    }),
  ]
    .filter((row) => row.compatibilityType !== 'INCOMPATIBLE')
    .sort(compareCompatibleCarSeats);

  // Stroller-first: the adapter is the selected stroller's; the car seat varies.
  await fillAdapterProducts(compatibleCarSeats, () => stroller.brand, (row) => row.brand);

  return {
    stroller: {
      brand: stroller.brand,
      model: stroller.model,
      displayName: getDisplayName(stroller.brand, stroller.model, stroller.displayName),
      summary: stroller.summary,
    },
    compatibleCarSeats: enrichWithBabylist(compatibleCarSeats, await loadBabylistMap('CarSeat')),
  };
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

  const carSeat = carSeats[0];
  if (!carSeat) {
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

  const explicitStrollerIds = new Set(explicitRows.map((row) => row.strollerId));
  const sameBrandDefaults = await getSameBrandDefaultStrollers(carSeat, explicitStrollerIds);

  const compatibleStrollers = [
    ...explicitRows.map<CompatibleStrollerResult>((row) => {
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
        adapterUrl: row.adapterBabylistUrl,
        adapterPrice: row.adapterPrice,
        notes: row.notes,
        confidence: normalizeCompatibilityConfidence(row.confidence),
        imageUrl: resolvedImage && !resolvedImage.isFallback ? resolvedImage.src : null,
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
        imageUrl: resolvedImage && !resolvedImage.isFallback ? resolvedImage.src : null,
        imageAlt: resolvedImage && !resolvedImage.isFallback ? resolvedImage.alt : null,
      };
    }),
  ]
    .filter((row) => row.compatibilityType !== 'INCOMPATIBLE')
    .sort(compareCompatibleStrollers);

  // Car-seat-first: the adapter is each matched stroller's; the car seat is fixed.
  await fillAdapterProducts(compatibleStrollers, (row) => row.brand, () => carSeat.brand);

  return {
    carSeat: {
      brand: carSeat.brand,
      model: carSeat.model,
      displayName: getDisplayName(carSeat.brand, carSeat.model, carSeat.displayName),
      summary: carSeat.summary,
    },
    compatibleStrollers: enrichWithBabylist(compatibleStrollers, await loadBabylistMap('Stroller')),
  };
}
