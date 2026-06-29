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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const REPORT_JSON = 'reports/universal-adapter-compatibility.json';
const REPORT_CSV = 'reports/universal-adapter-compatibility.csv';

const TRIGGER_SEAT_BRAND = 'Nuna';

type Rule = {
  brand: string;
  /** Match against "<model> <displayName>". null = every model of this brand. */
  model: RegExp | null;
  family: string;
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
  triggerSeat: string;
  family: string;
  action: 'create' | 'skip-existing';
};

// Strollers whose brand makes no infant seat but accepts the shared
// Maxi-Cosi / Nuna / CYBEX / Clek click-and-go adapter (sold separately).
const ADAPTER_STROLLERS: Rule[] = [
  { brand: 'Bugaboo', model: /\bdonkey\b/i, family: 'Donkey' },
  { brand: 'Joolz', model: /\b(dot|geo)\b/i, family: 'Dot / Geo' },
  { brand: 'Mima', model: /\b(miro|xari|zigi)\b/i, family: 'Miro / Xari / Zigi' },
  { brand: 'Zoe', model: null, family: 'all Zoe strollers' },
  { brand: 'Ergobaby', model: /\bmetro\b/i, family: 'Metro / Metro+' },
  // Full-size Mompush travel systems only — Lithe / Velo / Wiz are compact and
  // typically don't take an infant seat; confirm those by hand before adding.
  { brand: 'Mompush', model: /\b(ultimate|meteor)\b/i, family: 'Ultimate / Meteor' },
  { brand: 'Mercedes', model: null, family: 'Mercedes-Benz (Hartan)' },
  // Peg Perego City Loop takes Peg Perego seats directly (same-brand default) AND
  // other-brand infant seats via its Foldable Car Seat Adapter — so it also earns
  // the shared Nuna / Maxi-Cosi / CYBEX / Clek expansion on top of its own seats.
  { brand: 'Peg Perego', model: /\bcity loop\b/i, family: 'City Loop' },
  // Orbit Baby strollers take the Orbit Baby seat (same-brand default) AND other
  // brands via the universal Orbit Baby car seat adapter — same expansion.
  { brand: 'Orbit Baby', model: null, family: 'all Orbit Baby strollers' },
];

function label(row: Row) {
  return row.displayName || `${row.brand} ${row.model}`.replace(/\s+/g, ' ').trim();
}

function matchesRule(rule: Rule, stroller: Row) {
  if (rule.model === null) return true;
  return rule.model.test(`${stroller.model} ${stroller.displayName ?? ''}`);
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

  const nunaSeats: Row[] = await db.carSeat.findMany({
    where: { brand: { equals: TRIGGER_SEAT_BRAND, mode: 'insensitive' }, seatType: 'INFANT' },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });

  if (nunaSeats.length === 0) {
    console.error(`[universalAdapter] no ${TRIGGER_SEAT_BRAND} infant seats found — cannot seed adapter triggers.`);
    process.exitCode = 1;
    return;
  }

  for (const rule of ADAPTER_STROLLERS) {
    const strollers: Row[] = await db.stroller.findMany({
      where: { brand: { equals: rule.brand, mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    });
    const matching = strollers.filter((stroller) => matchesRule(rule, stroller));

    for (const stroller of matching) {
      strollersTouched += 1;
      for (const seat of nunaSeats) {
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
