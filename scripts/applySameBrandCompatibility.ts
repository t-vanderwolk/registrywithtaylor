/**
 * Add conservative same-brand stroller -> infant car seat compatibility rows.
 *
 * This is intentionally not universal same-brand compatibility. Each rule ties
 * specific modular stroller families to specific same-brand infant seat families.
 *
 *   npm run catalog:same-brand-compatibility
 *   npm run catalog:same-brand-compatibility-apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const REPORT_JSON = 'reports/same-brand-compatibility.json';
const REPORT_CSV = 'reports/same-brand-compatibility.csv';

type Rule = {
  brand: string;
  strollerFamily: string;
  strollerModel: RegExp;
  carSeatFamily: string;
  carSeatModel: RegExp;
};

type Row = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
};

type ReportRow = {
  brand: string;
  stroller: string;
  carSeat: string;
  strollerFamily: string;
  carSeatFamily: string;
  action: 'create' | 'skip-existing';
};

const RULES: Rule[] = [
  {
    brand: 'Graco',
    strollerFamily: 'Modes / Ready2Grow',
    strollerModel: /\b(modes|ready2grow)\b/i,
    carSeatFamily: 'SnugRide',
    carSeatModel: /\bsnugride\b/i,
  },
  {
    brand: 'Evenflo',
    strollerFamily: 'Pivot / Pivot Xpand',
    strollerModel: /\bpivot(?!\s+xplore)(?:\s+xpand)?\b/i,
    carSeatFamily: 'LiteMax',
    carSeatModel: /\blitemax\b/i,
  },
  {
    brand: 'Chicco',
    strollerFamily: 'Bravo / Corso',
    strollerModel: /\b(bravo|corso)\b/i,
    carSeatFamily: 'KeyFit / Fit2',
    carSeatModel: /\b(keyfit|fit2)\b/i,
  },
  {
    brand: 'Britax',
    strollerFamily: 'Grove / Prism / Brook / Juniper',
    strollerModel: /\b(grove|prism|brook|juniper)\b/i,
    carSeatFamily: 'Willow / Cypress / B-Safe',
    carSeatModel: /\b(willow|cypress|b-?safe)\b/i,
  },
  {
    brand: 'Baby Trend',
    strollerFamily: 'Expedition',
    strollerModel: /\bexpedition\b/i,
    carSeatFamily: 'EZ-Lift / Secure-Lift',
    carSeatModel: /\b(ez-?lift|secure-?lift)\b/i,
  },
  {
    brand: 'Maxi-Cosi',
    strollerFamily: 'Fame / Oxford / Tayla / Zelia',
    strollerModel: /\b(fame|oxford|tayla|zelia)\b/i,
    carSeatFamily: 'Mico / Coral / Peri',
    carSeatModel: /\b(mico|coral|peri)\b/i,
  },
  {
    brand: 'Silver Cross',
    strollerFamily: 'Silver Cross modular / compact',
    strollerModel: /\b(breez|nia|wave|coast|reef|clic|tide|dune|comet)\b/i,
    carSeatFamily: 'Dream',
    carSeatModel: /\bdream\b/i,
  },
];

function label(row: Row) {
  return row.displayName || `${row.brand} ${row.model}`.replace(/\s+/g, ' ').trim();
}

function csvEscape(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeReports(rows: ReportRow[]) {
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), REPORT_JSON), `${JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2)}\n`);
  const csv = [
    ['brand', 'stroller', 'carSeat', 'strollerFamily', 'carSeatFamily', 'action'].join(','),
    ...rows.map((row) => [
      row.brand,
      row.stroller,
      row.carSeat,
      row.strollerFamily,
      row.carSeatFamily,
      row.action,
    ].map(csvEscape).join(',')),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${csv.join('\n')}\n`);
}

async function main() {
  const apply = process.argv.includes('--apply');
  const reportRows: ReportRow[] = [];
  let created = 0;
  let existing = 0;

  for (const rule of RULES) {
    const [strollers, carSeats] = await Promise.all([
      db.stroller.findMany({
        where: { brand: { equals: rule.brand, mode: 'insensitive' } },
        select: { id: true, brand: true, model: true, displayName: true },
        orderBy: { model: 'asc' },
      }) as Promise<Row[]>,
      db.carSeat.findMany({
        where: { brand: { equals: rule.brand, mode: 'insensitive' }, seatType: 'INFANT' },
        select: { id: true, brand: true, model: true, displayName: true },
        orderBy: { model: 'asc' },
      }) as Promise<Row[]>,
    ]);

    const matchingStrollers = strollers.filter((stroller) => rule.strollerModel.test(`${stroller.model} ${stroller.displayName ?? ''}`));
    const matchingCarSeats = carSeats.filter((carSeat) => rule.carSeatModel.test(`${carSeat.model} ${carSeat.displayName ?? ''}`));

    for (const stroller of matchingStrollers) {
      for (const carSeat of matchingCarSeats) {
        const existingRow = await db.compatibility.findFirst({
          where: { strollerId: stroller.id, carSeatId: carSeat.id },
          select: { id: true },
        });
        if (existingRow) {
          existing += 1;
          reportRows.push({
            brand: rule.brand,
            stroller: label(stroller),
            carSeat: label(carSeat),
            strollerFamily: rule.strollerFamily,
            carSeatFamily: rule.carSeatFamily,
            action: 'skip-existing',
          });
          continue;
        }

        reportRows.push({
          brand: rule.brand,
          stroller: label(stroller),
          carSeat: label(carSeat),
          strollerFamily: rule.strollerFamily,
          carSeatFamily: rule.carSeatFamily,
          action: 'create',
        });

        if (apply) {
          await db.compatibility.create({
            data: {
              strollerId: stroller.id,
              carSeatId: carSeat.id,
              compatibilityType: 'DIRECT',
              adapterRequired: false,
              adapterType: null,
              confidence: 'MEDIUM',
              notes: `Conservative same-brand default for ${rule.strollerFamily} strollers and ${rule.carSeatFamily} infant seats. Confirm current model-year details before purchase.`,
            },
          });
        }
        created += 1;
      }
    }
  }

  writeReports(reportRows);

  console.log('── Same-brand compatibility ──');
  console.log(`  mode: ${apply ? 'apply' : 'dry-run'}`);
  console.log(`  rules: ${RULES.length}`);
  console.log(`  new rows ${apply ? 'created' : 'to create'}: ${created}`);
  console.log(`  existing rows: ${existing}`);
  console.log(`  reports: ${REPORT_JSON}, ${REPORT_CSV}`);
  if (!apply) console.log('\n  (dry run - no database writes.)');
}

main()
  .catch((error) => {
    console.error('[sameBrandCompatibility] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
