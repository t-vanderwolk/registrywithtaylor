/**
 * Apply Britax travel-system compatibility strictly from Britax's own US Stroller
 * Compatibility Chart (03.2026), transcribed cell-by-cell in
 * lib/catalog/britaxAdapters.
 *
 * Britax is NOT a universal-adapter brand — it makes its own infant seats and
 * lists specific seat MODELS per frame (never whole brands, and never Clek). So
 * every pairing is written explicitly:
 *   • Brook / Brook+ / Grove → DIRECT (no adapter)
 *   • Phases                 → DIRECT, Britax Arbor only
 *   • Juniper                → no infant seat at all (nothing written)
 *   • Juniper+               → ADAPTER, Britax Juniper+ adapter (S15054400)
 *   • Prism                  → ADAPTER, adapters included in the box
 *
 * Seats referenced by the chart are found case-insensitively and CREATED (as
 * INFANT) if the catalog doesn't have them yet, so the exact rows can exist.
 * Existing Compatibility rows are UPDATED to match the chart (the chart is
 * authoritative) rather than left stale.
 *
 *   npx tsx scripts/applyBritaxCompatibility.ts            # dry run
 *   npx tsx scripts/applyBritaxCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:britax-compat-apply
 */
import prismaBase from '@/lib/server/prisma';
import {
  BRITAX_JUNIPER_PLUS_ADAPTER,
  britaxRuleForModel,
  type BritaxSeat,
} from '@/lib/catalog/britaxAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type StrollerRow = { id: string; brand: string; model: string; displayName: string | null };
type SeatRow = { id: string; brand: string; model: string };

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Find a car seat by case/punct-insensitive brand+model, or create it (INFANT). */
async function findOrCreateSeat(seat: BritaxSeat, allSeats: SeatRow[]): Promise<SeatRow> {
  const wantBrand = norm(seat.brand);
  const wantModel = norm(seat.model);
  const hit = allSeats.find((s) => norm(s.brand) === wantBrand && norm(s.model) === wantModel);
  if (hit) return hit;

  if (APPLY) {
    const created: SeatRow = await db.carSeat.create({
      data: {
        brand: seat.brand,
        model: seat.model,
        seatType: 'INFANT',
        summary: `${seat.brand} ${seat.model} infant car seat.`,
      },
      select: { id: true, brand: true, model: true },
    });
    allSeats.push(created);
    console.log(`      + created seat ${seat.brand} ${seat.model}`);
    return created;
  }
  console.log(`      + would create seat ${seat.brand} ${seat.model}`);
  // Dry-run placeholder id so the rest of the log is coherent.
  const placeholder = { id: `(new) ${seat.brand} ${seat.model}`, brand: seat.brand, model: seat.model };
  allSeats.push(placeholder);
  return placeholder;
}

function rowData(fit: 'direct' | 'adapter' | 'included', strollerLabel: string) {
  if (fit === 'direct') {
    return {
      compatibilityType: 'DIRECT',
      adapterRequired: false,
      adapterType: null as string | null,
      confidence: 'HIGH',
      notes: `Direct fit — clicks straight onto the ${strollerLabel}, no adapter needed (Britax US chart 03.2026).`,
    };
  }
  if (fit === 'included') {
    return {
      compatibilityType: 'ADAPTER',
      adapterRequired: true,
      adapterType: 'Included with stroller',
      confidence: 'HIGH',
      notes: `Adapters are included with the ${strollerLabel} — not sold separately (Britax US chart 03.2026).`,
    };
  }
  return {
    compatibilityType: 'ADAPTER',
    adapterRequired: true,
    adapterType: BRITAX_JUNIPER_PLUS_ADAPTER,
    confidence: 'HIGH',
    notes: `Use the ${BRITAX_JUNIPER_PLUS_ADAPTER}. Adapter sold separately (Britax US chart 03.2026).`,
  };
}

async function main() {
  console.log(`── Britax compatibility (US chart 03.2026) ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: StrollerRow[] = await db.stroller.findMany({
    where: { brand: { equals: 'Britax', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });
  if (strollers.length === 0) {
    console.error('No Britax strollers found.');
    process.exitCode = 1;
    return;
  }

  // Every seat referenced anywhere in the matrix — cache once for find-or-create.
  const allSeats: SeatRow[] = await db.carSeat.findMany({
    where: {
      seatType: 'INFANT',
      brand: { in: ['Britax', 'Nuna', 'Maxi-Cosi', 'Cybex'], mode: 'insensitive' },
    },
    select: { id: true, brand: true, model: true },
  });

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  const noSeat: string[] = [];
  const offChart: string[] = [];

  for (const stroller of strollers) {
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    const rule = britaxRuleForModel(stroller.model);

    if (!rule) {
      offChart.push(label);
      continue;
    }
    if (rule.seats.length === 0) {
      noSeat.push(`${label} (${rule.label}) — chart lists no compatible infant car seat`);
      continue;
    }

    console.log(`  ${label}  →  ${rule.label} (${rule.fit}, ${rule.seats.length} seats)`);
    const data = rowData(rule.fit, rule.label);

    for (const seat of rule.seats) {
      const seatRow = await findOrCreateSeat(seat, allSeats);
      const isPlaceholder = seatRow.id.startsWith('(new) ');

      const found = isPlaceholder
        ? null
        : await db.compatibility.findFirst({
            where: { strollerId: stroller.id, carSeatId: seatRow.id },
            select: { id: true, compatibilityType: true, adapterType: true, adapterRequired: true },
          });

      if (found) {
        const differs =
          found.compatibilityType !== data.compatibilityType ||
          found.adapterRequired !== data.adapterRequired ||
          (found.adapterType ?? null) !== (data.adapterType ?? null);
        if (!differs) {
          unchanged += 1;
          continue;
        }
        updated += 1;
        if (APPLY) {
          await db.compatibility.update({ where: { id: found.id }, data });
        }
        console.log(`      ~ update  ${seat.brand} ${seat.model}  (${found.compatibilityType} → ${data.compatibilityType})`);
      } else {
        created += 1;
        if (APPLY && !isPlaceholder) {
          await db.compatibility.create({
            data: { strollerId: stroller.id, carSeatId: seatRow.id, ...data },
          });
        }
        console.log(`      + ${seat.brand} ${seat.model}`);
      }
    }
  }

  console.log(
    `\n${APPLY ? 'Applied' : 'Dry run'} — ${created} new, ${updated} updated, ${unchanged} already correct.`,
  );
  if (noSeat.length) {
    console.log(`\nNo infant seat on the chart (${noSeat.length}):`);
    for (const l of noSeat) console.log(`  · ${l}`);
  }
  if (offChart.length) {
    console.log(`\nBritax strollers NOT on the 03.2026 chart (left untouched — ${offChart.length}):`);
    for (const l of offChart) console.log(`  · ${l}`);
  }
  if (!APPLY) console.log('\nRe-run with --apply to write these rows. Then run catalog:britax-prune.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[applyBritaxCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
