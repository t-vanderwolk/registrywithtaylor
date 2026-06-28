import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prisma from '@/lib/server/prisma';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';
import {
  normalizeStrollerVariantModel,
  strollerVariantNoiseScore,
} from '@/lib/catalog/strollerVariantIdentity';

const REPORT_JSON = 'reports/stroller-model-variant-duplicates.json';
const REPORT_CSV = 'reports/stroller-model-variant-duplicates.csv';

type StrollerRow = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  createdAt: Date;
  babylistUrl: string | null;
  babylistPrice: number | null;
  compatCount: number;
};

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function noiseReasons(row: StrollerRow) {
  const reasons: string[] = [];
  const model = row.model;

  if (/\b([a-z0-9]+)\s+\1\b/i.test(model)) reasons.push('brand repeated in model');
  if (/\bin\s+[a-z][a-z\s/.-]+$/i.test(model)) reasons.push('color phrase');
  if (/\bsize\b|"\s*x\s*|\d+(?:\.\d+)?\s*"/i.test(model)) reasons.push('size text');
  if (/\b(?:with|w)\s+magnetic\s+buckle\b/i.test(model)) reasons.push('magnetic buckle variant');
  if (/\bbmw\b|\bspecial\s+edition\b/i.test(model)) reasons.push('BMW/special edition variant');
  if (/\b(?:cleartex|clearlux|tencel|recycled|leatherette|leather|mesh)\b/i.test(model)) {
    reasons.push('fabric/material variant');
  }
  if (strollerVariantNoiseScore(model, row.brand) > 0) reasons.push('normalizes to shorter model');

  return [...new Set(reasons)];
}

function csvEscape(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  const rows = await prisma.$queryRaw<StrollerRow[]>`
    SELECT
      stroller."id",
      stroller."brand",
      stroller."model",
      stroller."displayName",
      stroller."createdAt",
      stroller."babylistUrl",
      stroller."babylistPrice",
      COUNT(compat."id")::int AS "compatCount"
    FROM "Stroller" AS stroller
    LEFT JOIN "Compatibility" AS compat
      ON compat."strollerId" = stroller."id"
    GROUP BY stroller."id", stroller."brand", stroller."model", stroller."displayName", stroller."createdAt", stroller."babylistUrl", stroller."babylistPrice"
    ORDER BY LOWER(stroller."brand"), LOWER(stroller."model")
  `;

  const enriched = rows.map((row) => {
    const brand = canonicalStrollerBrand(row.brand);
    return {
      ...row,
      canonicalBrand: brand,
      normalizedModel: normalizeStrollerVariantModel(row.model, brand),
      noiseReasons: noiseReasons(row),
    };
  });

  const groups = new Map<string, typeof enriched>();
  for (const row of enriched) {
    if (!row.normalizedModel) continue;
    const key = `${normalizeText(row.canonicalBrand)}|${row.normalizedModel}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  const duplicateGroups = [...groups.entries()]
    .map(([key, group]) => {
      const uniqueModels = new Set(group.map((row) => normalizeText(row.model)));
      if (group.length < 2 || uniqueModels.size < 2) return null;

      const sorted = [...group].sort(
        (a, b) =>
          b.compatCount - a.compatCount ||
          strollerVariantNoiseScore(a.model, a.brand) - strollerVariantNoiseScore(b.model, b.brand) ||
          a.createdAt.getTime() - b.createdAt.getTime(),
      );

      return {
        key,
        brand: sorted[0].canonicalBrand,
        normalizedModel: sorted[0].normalizedModel,
        count: sorted.length,
        likelyKeep: sorted[0].id,
        rows: sorted.map((row) => ({
          id: row.id,
          brand: row.brand,
          model: row.model,
          displayName: row.displayName,
          compatCount: row.compatCount,
          babylistUrl: row.babylistUrl,
          babylistPrice: row.babylistPrice,
          createdAt: row.createdAt.toISOString(),
          noiseReasons: row.noiseReasons,
        })),
      };
    })
    .filter((group): group is NonNullable<typeof group> => Boolean(group))
    .sort((a, b) => a.brand.localeCompare(b.brand) || a.normalizedModel.localeCompare(b.normalizedModel));

  const colorOrVariantRows = enriched
    .filter((row) => row.noiseReasons.length > 0)
    .sort((a, b) => a.canonicalBrand.localeCompare(b.canonicalBrand) || a.normalizedModel.localeCompare(b.normalizedModel));

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      strollerRowsScanned: rows.length,
      probableDuplicateGroups: duplicateGroups.length,
      probableDuplicateRows: duplicateGroups.reduce((sum, group) => sum + group.count, 0),
      nunaDuplicateGroups: duplicateGroups.filter((group) => group.brand === 'Nuna').length,
      nunaDuplicateRows: duplicateGroups
        .filter((group) => group.brand === 'Nuna')
        .reduce((sum, group) => sum + group.count, 0),
      rowsWithColorOrVariantTerms: colorOrVariantRows.length,
    },
    duplicateGroups,
    nunaDuplicateGroups: duplicateGroups.filter((group) => group.brand === 'Nuna'),
    colorOrVariantRows: colorOrVariantRows.map((row) => ({
      id: row.id,
      brand: row.brand,
      model: row.model,
      normalizedModel: row.normalizedModel,
      compatCount: row.compatCount,
      noiseReasons: row.noiseReasons,
    })),
  };

  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), REPORT_JSON), `${JSON.stringify(report, null, 2)}\n`);

  const csvRows = [
    ['brand', 'normalizedModel', 'groupCount', 'id', 'model', 'compatCount', 'noiseReasons', 'likelyKeep'].join(','),
    ...duplicateGroups.flatMap((group) =>
      group.rows.map((row) =>
        [
          group.brand,
          group.normalizedModel,
          group.count,
          row.id,
          row.model,
          row.compatCount,
          row.noiseReasons.join('; '),
          row.id === group.likelyKeep ? 'yes' : 'no',
        ]
          .map(csvEscape)
          .join(','),
      ),
    ),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${csvRows.join('\n')}\n`);

  console.log('── Stroller model variant duplicate audit ──');
  console.log(`  stroller rows scanned:        ${report.totals.strollerRowsScanned}`);
  console.log(`  probable duplicate groups:    ${report.totals.probableDuplicateGroups}`);
  console.log(`  probable duplicate rows:      ${report.totals.probableDuplicateRows}`);
  console.log(`  Nuna duplicate groups:        ${report.totals.nunaDuplicateGroups}`);
  console.log(`  Nuna duplicate rows:          ${report.totals.nunaDuplicateRows}`);
  console.log(`  rows with variant text:       ${report.totals.rowsWithColorOrVariantTerms}`);
  console.log(`  reports: ${REPORT_JSON}, ${REPORT_CSV}`);
}

main()
  .catch((error) => {
    console.error('[auditStrollerVariantDuplicates] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
