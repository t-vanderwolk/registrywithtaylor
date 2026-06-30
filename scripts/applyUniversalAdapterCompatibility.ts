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
  /**
   * Extra infant-seat brands this stroller's adapter supports beyond the shared
   * Nuna / CYBEX / Clek / Maxi-Cosi / Britax group — e.g. Graco, Chicco, or
   * UPPAbaby (Mesa). Each gets an explicit ADAPTER row in addition to the Nuna
   * trigger that drives the shared-group expansion.
   */
  extraSeatBrands?: string[];
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
  { brand: 'Mima', model: /\b(miro|xari|zigi|creo)\b/i, family: 'Miro / Xari / Zigi / Creo' },
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
  // Thule joggers take Nuna / Maxi-Cosi / CYBEX (+ Chicco) via the Urban Glide /
  // Spring / Sleek universal car seat adapter. Chariot (sling, not a car seat) is
  // excluded by matching only the glide / spring / sleek frames.
  { brand: 'Thule', model: /\b(glide|spring|sleek)\b/i, family: 'Urban Glide / Glide / Spring / Sleek' },
  // UPPAbaby Vista / Cruz / Minu / Ridge take UPPAbaby Mesa (same-brand default),
  // Nuna / Maxi-Cosi / CYBEX / Clek via the UPPAbaby adapter, AND Chicco KeyFit via
  // the separate UPPAbaby Chicco adapter.
  { brand: 'UPPAbaby', model: /\b(ridge|vista|cruz|minu)\b/i, family: 'Vista / Cruz / Minu / Ridge', extraSeatBrands: ['Chicco'] },
  // BOB joggers take Britax / Nuna / CYBEX / Maxi-Cosi via the BOB universal infant
  // car seat adapter (Wayfinder / Revolution / Alterrain).
  { brand: 'BOB', model: /\b(wayfinder|revolution|alterrain)\b/i, family: 'Wayfinder / Revolution / Alterrain' },
  // Silver Cross modular + travel frames take Nuna / Maxi-Cosi / CYBEX / Clek via
  // their car seat adapter (on top of the same-brand Silver Cross Dream seat).
  { brand: 'Silver Cross', model: null, family: 'all Silver Cross frames' },
  // Guava Roam takes Nuna / Maxi-Cosi / CYBEX (+ Chicco / Graco / Britax) via the
  // Roam car seat adapter.
  { brand: 'Guava Family', model: /\broam\b/i, family: 'Roam' },
  // Older Baby Jogger frames not already covered take Maxi-Cosi / CYBEX / Nuna via
  // the Baby Jogger car seat adapter (Graco City GO is handled separately).
  { brand: 'Baby Jogger', model: /\b(city prix|city mini air)\b/i, family: 'City Prix / City Mini Air' },
  // WonderFold W & L Series wagons take a 360° car seat adapter: shared Nuna /
  // CYBEX / Clek / Maxi-Cosi / Britax group PLUS Graco / Chicco / UPPAbaby Mesa.
  // (Brand match is startsWith, so this also covers the "WonderFold Wagon" rows.)
  { brand: 'WonderFold', model: null, family: 'W & L Series', extraSeatBrands: ['Graco', 'Chicco', 'UPPAbaby'] },
  // Veer Switchback (&Roll / &Jog) takes Maxi-Cosi / Nuna / Clek / CYBEX via the
  // Switchback infant car seat adapter (shared euro group only). Cruiser frames
  // are already covered elsewhere.
  { brand: 'Veer', model: /\bswitch\b/i, family: 'Switchback (&Roll / &Jog)' },
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
    const matching = strollers.filter((stroller) => matchesRule(rule, stroller));

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
