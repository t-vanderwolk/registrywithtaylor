import { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';
import {
  compareCompatibleCarSeats,
  normalizeCompatibilityConfidence,
  normalizeCompatibilityType,
  type CompatibleCarSeatResult,
  type TravelSystemCompatibilityResponse,
  type TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';

type StrollerRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
};

type CompatibilityRow = {
  brand: string;
  model: string;
  displayName: string | null;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  notes: string | null;
  confidence: string;
};

function getDisplayName(brand: string, model: string, displayName?: string | null) {
  return displayName?.trim() ? displayName : `${brand} ${model}`;
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

  if (carSeatBrand.toLowerCase() === strollerBrand.toLowerCase()) {
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
    strollers = await prisma.$queryRaw<StrollerRow[]>`
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

  let rows: CompatibilityRow[];
  try {
    rows = await prisma.$queryRaw<CompatibilityRow[]>`
      WITH explicit_matches AS (
        SELECT
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
      ),
      same_brand_defaults AS (
        SELECT
          seat."brand" AS "brand",
          seat."model" AS "model",
          seat."displayName" AS "displayName",
          'DIRECT'::text AS "compatibilityType",
          false AS "adapterRequired",
          NULL::text AS "adapterType",
          'This is the same-brand default path. Confirm the current release details before you buy, but it is the cleanest place to start.'::text AS "notes",
          'MEDIUM'::text AS "confidence"
        FROM "CarSeat" AS seat
        WHERE seat."seatType" = 'INFANT'
          AND LOWER(seat."brand") = LOWER(${stroller.brand})
          AND NOT EXISTS (
            SELECT 1
            FROM "Compatibility" AS compat
            WHERE compat."strollerId" = ${stroller.id}
              AND compat."carSeatId" = seat."id"
          )
      )
      SELECT * FROM explicit_matches
      UNION ALL
      SELECT * FROM same_brand_defaults
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

  const compatibleCarSeats = rows
    .map<CompatibleCarSeatResult>((row) => ({
      brand: row.brand,
      model: row.model,
      displayName: getDisplayName(row.brand, row.model, row.displayName),
      compatibilityType: normalizeCompatibilityType(row.compatibilityType),
      adapterRequired: row.adapterRequired,
      adapterType: getAdapterType(stroller.brand, row.brand, row.adapterRequired, row.adapterType, row.notes),
      notes: row.notes,
      confidence: normalizeCompatibilityConfidence(row.confidence),
    }))
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
