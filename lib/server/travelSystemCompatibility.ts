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
  notes: string | null;
  confidence: string;
};

const DIRECT_DEFAULT_BRANDS = new Set([
  'cybex',
  'joie',
  'nuna',
  'orbit baby',
  'peg perego',
  'romer',
  'uppababy',
]);

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

  const explicitSeatIds = new Set(explicitRows.map((row) => row.carSeatId));
  const sameBrandDefaults = await getSameBrandDefaultCarSeats(stroller, explicitSeatIds);

  const compatibleCarSeats = [
    ...explicitRows.map<CompatibleCarSeatResult>((row) => {
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
  ]
    .filter((row) => row.compatibilityType !== 'INCOMPATIBLE')
    .sort(compareCompatibleCarSeats);

  return {
    stroller: {
      brand: stroller.brand,
      model: stroller.model,
      displayName: getDisplayName(stroller.brand, stroller.model, stroller.displayName),
      summary: stroller.summary,
    },
    compatibleCarSeats,
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

  return {
    carSeat: {
      brand: carSeat.brand,
      model: carSeat.model,
      displayName: getDisplayName(carSeat.brand, carSeat.model, carSeat.displayName),
      summary: carSeat.summary,
    },
    compatibleStrollers,
  };
}
