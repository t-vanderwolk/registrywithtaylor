/**
 * Seed universal click-and-go adapter compatibility for strollers whose brand
 * makes NO infant car seat of its own but accepts the shared Maxi-Cosi / Nuna /
 * CYBEX / Clek adapter standard (Bugaboo, Joolz, Mima, Zoe, Ergobaby Metro,
 * Mompush, Larktale, Mercedes/Hartan).
 *
 * Strategy: create ONE explicit ADAPTER Compatibility row per Nuna infant seat
 * for each matched stroller. That single Nuna trigger lets the travel-system
 * engine do the rest automatically —
 *   • getSharedAdapterInferredSeats() expands the stroller to every CYBEX /
 *     Clek / Maxi-Cosi / Britax infant seat (by-stroller view), and
 *   • getSharedAdapterInferredStrollers() surfaces the stroller whenever a
 *     shared-adapter seat is selected (by-car-seat view).
 *
 * Conservative on purpose: compact auto-folding strollers that typically do NOT
 * take an infant seat (Bellini Juno, Momcozy ClickGo) and special cases (Doona
 * Liki trike) are intentionally excluded — confirm those by hand before adding.
 *
 *   npm run catalog:universal-adapter-compatibility
 *   npm run catalog:universal-adapter-compatibility-apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npm run catalog:universal-adapter-compatibility-apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prismaBase from '@/lib/server/prisma';
import {
  UNIVERSAL_ADAPTER_RULES as ADAPTER_STROLLERS,
  matchesUniversalRule,
  type UniversalAdapterRule as Rule,
} from '@/lib/catalog/universalAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const REPORT_JSON = 'reports/universal-adapter-compatibility.json';
const REPORT_CSV = 'reports/universal-adapter-compatibility.csv';

const TRIGGER_SEAT_BRAND = 'Nuna';

type Row = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
};

type ReportRow = {
  brand: string;
  stroller: string;
  triggerSeat: string;
  family: string;
  action: 'create' | 'skip-existing';
};



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
    ['brand', 'stroller', 'triggerSeat', 'family', 'action'].join(','),
    ...rows.map((row) => [row.brand, row.stroller, row.triggerSeat, row.family, row.action].map(csvEscape).join(',')),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${csv.join('\n')}\n`);
}

async function main() {
  const apply = process.argv.includes('--apply');
  const reportRows: ReportRow[] = [];
  let created = 0;
  let existing = 0;
  let strollersTouched = 0;

  // Fetch the Nuna trigger seats + any extra-brand infant seats once.
  const extraBrands = Array.from(new Set(ADAPTER_STROLLERS.flatMap((r) => r.extraSeatBrands ?? [])));
  const seatsByBrand = new Map<string, Row[]>();
  for (const brand of [TRIGGER_SEAT_BRAND, ...extraBrands]) {
    const seats: Row[] = await db.carSeat.findMany({
      where: { brand: { equals: brand, mode: 'insensitive' }, seatType: 'INFANT' },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    });
    seatsByBrand.set(brand.toLowerCase(), seats);
  }
  const nunaSeats = seatsByBrand.get(TRIGGER_SEAT_BRAND.toLowerCase()) ?? [];

  if (nunaSeats.length === 0) {
    console.error(`[universalAdapter] no ${TRIGGER_SEAT_BRAND} infant seats found — cannot seed adapter triggers.`);
    process.exitCode = 1;
    return;
  }

  for (const rule of ADAPTER_STROLLERS) {
    const strollers: Row[] = await db.stroller.findMany({
      // startsWith so e.g. the WonderFold rule also matches "WonderFold Wagon".
      where: { brand: { startsWith: rule.brand, mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    });
    const matching = strollers.filter((stroller) => matchesUniversalRule(rule, stroller));

    // Seats to link: the Nuna trigger plus any extra-brand seats (deduped by id).
    const seenSeatIds = new Set<string>();
    const ruleSeats = [
      ...nunaSeats,
      ...(rule.extraSeatBrands ?? []).flatMap((brand) => seatsByBrand.get(brand.toLowerCase()) ?? []),
    ].filter((seat) => (seenSeatIds.has(seat.id) ? false : (seenSeatIds.add(seat.id), true)));

    for (const stroller of matching) {
      strollersTouched += 1;
      for (const seat of ruleSeats) {
        const existingRow = await db.compatibility.findFirst({
          where: { strollerId: stroller.id, carSeatId: seat.id },
          select: { id: true },
        });
        if (existingRow) {
          existing += 1;
          reportRows.push({ brand: rule.brand, stroller: label(stroller), triggerSeat: label(seat), family: rule.family, action: 'skip-existing' });
          continue;
        }

        reportRows.push({ brand: rule.brand, stroller: label(stroller), triggerSeat: label(seat), family: rule.family, action: 'create' });

        if (apply) {
          await db.compatibility.create({
            data: {
              strollerId: stroller.id,
              carSeatId: seat.id,
              compatibilityType: 'ADAPTER',
              adapterRequired: true,
              adapterType: null,
              confidence: 'MEDIUM',
              notes: `${rule.brand} ${rule.family} accepts Nuna / Maxi-Cosi / CYBEX / Clek infant seats via a ${rule.brand} click-and-go car seat adapter (sold separately). Confirm the exact adapter for your model year before purchase.`,
            },
          });
        }
        created += 1;
      }
    }
  }

  writeReports(reportRows);

  console.log('── Universal adapter compatibility ──');
  console.log(`  mode: ${apply ? 'apply' : 'dry-run'}`);
  console.log(`  brand rules: ${ADAPTER_STROLLERS.length}`);
  console.log(`  ${TRIGGER_SEAT_BRAND} trigger seats: ${nunaSeats.length}`);
  console.log(`  strollers matched: ${strollersTouched}`);
  console.log(`  new rows ${apply ? 'created' : 'to create'}: ${created}`);
  console.log(`  existing rows: ${existing}`);
  console.log(`  reports: ${REPORT_JSON}, ${REPORT_CSV}`);
  console.log('\n  Each matched stroller now carries an explicit Nuna ADAPTER row, so the');
  console.log('  travel-system engine auto-expands it to CYBEX / Clek / Maxi-Cosi / Britax');
  console.log('  seats (by-stroller) and surfaces it for those seats (by-car-seat).');
  if (!apply) console.log('\n  (dry run — no database writes.)');
}

main()
  .catch((error) => {
    console.error('[universalAdapterCompatibility] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
