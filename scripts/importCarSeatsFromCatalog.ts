/**
 * Import eligible infant car seats from AffiliateCatalogProduct into the
 * canonical CarSeat table so the travel-system selector can use the same
 * MacroBaby-only seats that the public car-seat catalog shows.
 *
 * MacroBaby retailer data stays in AffiliateCatalogProduct. New CarSeat rows are
 * canonical model rows only; their MacroBaby CTA/image is resolved by
 * loadMacroBabyMap('CarSeat') in the travel-system engine.
 *
 *   npm run catalog:import-carseats-from-catalog-dry-run
 *   npm run catalog:import-carseats-from-catalog-apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { parseCarSeatModel } from '@/lib/catalog/strollerModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const REPORT_JSON = 'reports/carseat-catalog-import-dry-run.json';
const REPORT_CSV = 'reports/carseat-catalog-import-dry-run.csv';

type CatalogRow = {
  id: string;
  provider: string;
  retailer: string | null;
  brand: string | null;
  title: string;
  externalId: string;
  price: number | null;
  affiliateUrl: string | null;
  imageUrl: string | null;
  itemGroupId: string | null;
  enrichment: {
    canonicalBrand: string | null;
    canonicalName: string | null;
    productType: string | null;
    reviewStatus: string;
    needsReview: boolean;
  } | null;
};

type ExistingSeat = {
  id: string;
  brand: string;
  model: string;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
};

type ReportRow = {
  catalogId: string;
  title: string;
  brand: string;
  model: string;
  action: 'create' | 'update-existing-retailer' | 'skip-existing' | 'skip-no-model' | 'skip-duplicate-input';
  reason: string;
  url: string | null;
};

function parseArgs() {
  const argv = process.argv.slice(2);
  return { apply: argv.includes('--apply') };
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function modelLikeCanonicalName(value: string | null | undefined, brand: string) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(infant|car seat|adapter|accessory|base|cover|canopy|insert|mirror|net)\b/i.test(v)) return null;
  if (/[,(|/]/.test(v)) return null;
  if (/\s+in\s+/i.test(v)) return null;
  if (/\bcollection\b/i.test(v)) return null;
  if (brand && normalizeText(v).startsWith(`${normalizeText(brand)} `)) return null;
  return v;
}

function normalizeModel(model: string) {
  return model
    .replace(/^the kindred collection\s+/i, '')
    .replace(/^peg perego\s+/i, '')
    .replace(/^peg\s+/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function isEligibleInfantCarSeat(title: string, brand: string, model: string) {
  const text = normalizeText(`${brand} ${model} ${title}`);
  const brandKey = normalizeText(brand);

  if (/\b(convertible|booster|all in one|extended rear facing|rear facing car seat)\b/.test(text)) return false;
  if (/\b(base only|extra base|car seat base|stay in car base)\b/.test(text)) return false;
  if (/\b(travel system|stroller combo|car seat stroller combo|infant car seat stroller combo)\b/.test(text) && brandKey !== 'doona') {
    return false;
  }

  const knownInfantModel =
    /\b(pipa|mesa|aria|liing|liingo|cloud|aton|keyfit|fit2|snugride|litemax|ez lift|ezlift|secure lift|go max|gomax|primo viaggio|turtle|mico|willow|cypress|safe wash|b safe|doona|g5|juni|mint latch|onboard|shyft dualride|peri 180)\b/.test(text);

  return knownInfantModel || /\binfant car seat\b/.test(text);
}

function isBabylistRow(row: CatalogRow) {
  return row.provider === 'babylist_impact' || row.retailer === 'Babylist';
}

function displayName(brand: string, model: string) {
  const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9+]+/g, '');
  const normalizedModel = model.toLowerCase().replace(/[^a-z0-9+]+/g, '');
  if (normalizedModel.startsWith(normalizedBrand)) return model;
  return `${brand} ${model}`.replace(/\s+/g, ' ').trim();
}

function csvEscape(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeReports(rows: ReportRow[]) {
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), REPORT_JSON), `${JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2)}\n`);
  const csv = [
    ['catalogId', 'title', 'brand', 'model', 'action', 'reason', 'url'].join(','),
    ...rows.map((row) => [
      row.catalogId,
      row.title,
      row.brand,
      row.model,
      row.action,
      row.reason,
      row.url,
    ].map(csvEscape).join(',')),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${csv.join('\n')}\n`);
}

async function main() {
  const { apply } = parseArgs();

  const existing: ExistingSeat[] = await db.carSeat.findMany({
    where: { seatType: 'INFANT' },
    select: { id: true, brand: true, model: true, babylistUrl: true, babylistPrice: true, babylistImage: true },
  });
  const existingByKey = new Map(existing.map((seat) => [productModelKey(canonicalBrand(seat.brand), seat.model), seat]));
  const existingKeys = new Set(existingByKey.keys());

  const rows: CatalogRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      enrichment: {
        is: {
          productType: 'infant car seat',
          needsReview: false,
          reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
        },
      },
    },
    select: {
      id: true,
      provider: true,
      retailer: true,
      brand: true,
      title: true,
      externalId: true,
      price: true,
      affiliateUrl: true,
      imageUrl: true,
      itemGroupId: true,
      enrichment: {
        select: {
          canonicalBrand: true,
          canonicalName: true,
          productType: true,
          reviewStatus: true,
          needsReview: true,
        },
      },
    },
    orderBy: [{ brand: 'asc' }, { title: 'asc' }],
  });

  const inputKeys = new Set<string>();
  const reportRows: ReportRow[] = [];
  let created = 0;
  let skippedExisting = 0;
  let skippedNoModel = 0;
  let skippedDuplicateInput = 0;
  let updatedExistingRetailer = 0;
  let errors = 0;
  const samples: string[] = [];

  for (const row of rows) {
    const brand = canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand);
    const model = normalizeModel(modelLikeCanonicalName(row.enrichment?.canonicalName, brand) ?? parseCarSeatModel(row.title, brand));
    const url = row.affiliateUrl;

    if (
      !brand ||
      !model ||
      model.length > 48 ||
      /\b(adapter|base|travel bag|cover|canopy|insert|protector)\b/i.test(model) ||
      !isEligibleInfantCarSeat(row.title, brand, model)
    ) {
      skippedNoModel += 1;
      reportRows.push({
        catalogId: row.id,
        title: row.title,
        brand,
        model,
        action: 'skip-no-model',
        reason: 'model was empty, too long, or accessory-like',
        url,
      });
      continue;
    }

    const key = productModelKey(brand, model);
    if (existingKeys.has(key)) {
      const existingSeat = existingByKey.get(key);
      if (apply && existingSeat && isBabylistRow(row) && !existingSeat.babylistUrl && row.affiliateUrl) {
        try {
          await db.carSeat.update({
            where: { id: existingSeat.id },
            data: {
              babylistUrl: row.affiliateUrl,
              babylistPrice: row.price,
              babylistImage: row.imageUrl,
              babylistUpdatedAt: new Date(),
            },
          });
          existingSeat.babylistUrl = row.affiliateUrl;
          existingSeat.babylistPrice = row.price;
          existingSeat.babylistImage = row.imageUrl;
          updatedExistingRetailer += 1;
          reportRows.push({
            catalogId: row.id,
            title: row.title,
            brand,
            model,
            action: 'update-existing-retailer',
            reason: 'canonical infant car seat already exists; Babylist retailer fields were empty and have been backfilled',
            url,
          });
          continue;
        } catch (error) {
          errors += 1;
          console.error(`[import-carseats] ${brand} ${model}:`, error instanceof Error ? error.message : error);
        }
      }
      skippedExisting += 1;
      reportRows.push({
        catalogId: row.id,
        title: row.title,
        brand,
        model,
        action: 'skip-existing',
        reason: 'canonical infant car seat already exists',
        url,
      });
      continue;
    }
    if (inputKeys.has(key)) {
      skippedDuplicateInput += 1;
      reportRows.push({
        catalogId: row.id,
        title: row.title,
        brand,
        model,
        action: 'skip-duplicate-input',
        reason: 'same brand/model already selected from catalog input',
        url,
      });
      continue;
    }
    inputKeys.add(key);
    existingKeys.add(key);

    if (samples.length < 25) samples.push(`${brand}  -  ${model}`);
    reportRows.push({
      catalogId: row.id,
      title: row.title,
      brand,
      model,
      action: 'create',
      reason: 'eligible MacroBaby infant seat missing from canonical CarSeat table',
      url,
    });

    if (!apply) {
      created += 1;
      continue;
    }

    try {
      await db.carSeat.create({
        data: {
          brand,
          model,
          displayName: displayName(brand, model),
          seatType: 'INFANT',
          summary: 'Catalog infant car seat. Retailer offer is resolved from the affiliate catalog when available.',
          ...(isBabylistRow(row) && row.affiliateUrl
            ? {
                babylistUrl: row.affiliateUrl,
                babylistPrice: row.price,
                babylistImage: row.imageUrl,
                babylistUpdatedAt: new Date(),
              }
            : {}),
        },
      });
      created += 1;
    } catch (error) {
      errors += 1;
      console.error(`[import-carseats] ${brand} ${model}:`, error instanceof Error ? error.message : error);
    }
  }

  writeReports(reportRows);

  console.log('\n-- Import infant car seats from catalog -> CarSeat table --');
  console.log(`  catalog infant-seat rows scanned: ${rows.length}`);
  console.log(`  new car seats ${apply ? 'added ' : 'to add'}:          ${created}`);
  console.log(`  existing Babylist offers updated: ${updatedExistingRetailer}`);
  console.log(`  skipped existing:               ${skippedExisting}`);
  console.log(`  skipped duplicate input:        ${skippedDuplicateInput}`);
  console.log(`  skipped no/unsafe model:        ${skippedNoModel}`);
  console.log(`  errors:                         ${errors}`);
  console.log(`  reports:                        ${REPORT_JSON}, ${REPORT_CSV}`);
  if (samples.length) {
    console.log('\n  sample brand - model parses:');
    samples.forEach((sample) => console.log(`    ${sample}`));
  }
  if (!apply) console.log('\n  (dry run - no database writes.)');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[importCarSeatsFromCatalog] failed:', error);
  await db.$disconnect?.();
  process.exitCode = 1;
});
