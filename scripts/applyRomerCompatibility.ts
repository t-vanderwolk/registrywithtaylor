/**
 * Apply Romer travel-system compatibility from Romer's own Stroller
 * Compatibility chart (romerbaby.com), transcribed in lib/catalog/romerAdapters.
 *
 * Romer makes its own infant seats (Juni, Sera) and lists a specific set of
 * cross-brand seats for the Tura and Lani:
 *   • Romer Juni / Sera        → DIRECT (same-brand)
 *   • Nuna Pipa Series         → ADAPTER
 *   • Cybex Aton 2/M, Cloud Q/T/G → ADAPTER
 *   • Britax Willow/S/SC, Cypress(S) → ADAPTER
 *   • BOB Gear Champ           → ADAPTER
 *
 * Exact seats are found case-insensitively and CREATED (INFANT) if missing.
 * "Family" seats (Nuna Pipa Series) only ever attach to seats that already
 * exist — never created — so we don't invent Pipa models the catalog lacks.
 *
 *   npx tsx scripts/applyRomerCompatibility.ts            # dry run
 *   npx tsx scripts/applyRomerCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:romer-compat-apply
 */
import prismaBase from '@/lib/server/prisma';
import { ROMER_ADAPTER, romerRuleForModel, type RomerFit, type RomerSeatRule } from '@/lib/catalog/romerAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type StrollerRow = { id: string; brand: string; model: string; displayName: string | null };
type SeatRow = { id: string; brand: string; model: string };

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Resolve a seat rule to concrete catalog seats (creating exact ones if missing). */
async function resolveSeats(rule: RomerSeatRule, allSeats: SeatRow[]): Promise<SeatRow[]> {
  if (rule.kind === 'family') {
    const wantBrand = norm(rule.brand);
    const hits = allSeats.filter((s) => norm(s.brand) === wantBrand && rule.pattern.test(s.model));
    if (hits.length === 0) console.log(`      ! no ${rule.label} seats in catalog`);
    return hits;
  }
  const wantBrand = norm(rule.brand);
  const wantModel = norm(rule.model);
  const hit = allSeats.find((s) => norm(s.brand) === wantBrand && norm(s.model) === wantModel);
  if (hit) return [hit];

  if (APPLY) {
    const created: SeatRow = await db.carSeat.create({
      data: { brand: rule.brand, model: rule.model, seatType: 'INFANT', summary: `${rule.brand} ${rule.model} infant car seat.` },
      select: { id: true, brand: true, model: true },
    });
    allSeats.push(created);
    console.log(`      + created seat ${rule.brand} ${rule.model}`);
    return [created];
  }
  console.log(`      + would create seat ${rule.brand} ${rule.model}`);
  const placeholder = { id: `(new) ${rule.brand} ${rule.model}`, brand: rule.brand, model: rule.model };
  allSeats.push(placeholder);
  return [placeholder];
}

function rowData(fit: RomerFit, strollerLabel: string) {
  if (fit === 'direct') {
    return {
      compatibilityType: 'DIRECT',
      adapterRequired: false,
      adapterType: null as string | null,
      confidence: 'HIGH',
      notes: `Same-brand direct fit on the Romer ${strollerLabel} (Romer stroller compatibility chart).`,
    };
  }
  return {
    compatibilityType: 'ADAPTER',
    adapterRequired: true,
    adapterType: ROMER_ADAPTER,
    confidence: 'HIGH',
    notes: `Listed as compatible with the Romer ${strollerLabel} (Romer stroller compatibility chart). Use the ${ROMER_ADAPTER}; confirm the exact part for this seat brand.`,
  };
}

async function main() {
  console.log(`── Romer compatibility (romerbaby.com chart) ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: StrollerRow[] = await db.stroller.findMany({
    where: { brand: { equals: 'Romer', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });
  if (strollers.length === 0) {
    console.error('No Romer strollers found.');
    process.exitCode = 1;
    return;
  }

  const allSeats: SeatRow[] = await db.carSeat.findMany({
    where: {
      seatType: 'INFANT',
      brand: { in: ['Romer', 'Nuna', 'Cybex', 'Britax', 'BOB Gear', 'BOB'], mode: 'insensitive' },
    },
    select: { id: true, brand: true, model: true },
  });

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  const offChart: string[] = [];

  for (const stroller of strollers) {
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    const rule = romerRuleForModel(stroller.model);
    if (!rule) {
      offChart.push(label);
      continue;
    }
    console.log(`  ${label}  →  ${rule.label}`);

    for (const group of rule.groups) {
      const data = rowData(group.fit, rule.label);
      for (const seatRule of group.seats) {
        const seats = await resolveSeats(seatRule, allSeats);
        for (const seat of seats) {
          const isPlaceholder = seat.id.startsWith('(new) ');
          const found = isPlaceholder
            ? null
            : await db.compatibility.findFirst({
                where: { strollerId: stroller.id, carSeatId: seat.id },
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
            if (APPLY) await db.compatibility.update({ where: { id: found.id }, data });
            console.log(`      ~ update  ${seat.brand} ${seat.model}  (${found.compatibilityType} → ${data.compatibilityType})`);
          } else {
            created += 1;
            if (APPLY && !isPlaceholder) {
              await db.compatibility.create({ data: { strollerId: stroller.id, carSeatId: seat.id, ...data } });
            }
            console.log(`      + ${group.fit === 'direct' ? '[direct] ' : ''}${seat.brand} ${seat.model}`);
          }
        }
      }
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${created} new, ${updated} updated, ${unchanged} already correct.`);
  if (offChart.length) {
    console.log(`\nRomer strollers NOT on the chart (left untouched — ${offChart.length}):`);
    for (const l of offChart) console.log(`  · ${l}`);
  }
  if (!APPLY) console.log('\nRe-run with --apply to write these rows. Then run catalog:romer-prune.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[applyRomerCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
