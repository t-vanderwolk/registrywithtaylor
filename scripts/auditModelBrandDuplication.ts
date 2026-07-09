/**
 * Audit (and optionally clean) genuine brand duplication in the Stroller / CarSeat
 * `model` field.
 *
 * Context: the admin "duplicate brand" display bug is already fixed in
 * productLabel. The stored data is normally fine — importStrollersFromCatalog
 * writes a brand-stripped `model` ("Alterrain Pro") and a `displayName` of
 * `${brand} ${model}` ("BOB Alterrain Pro"), which is correct. This script does
 * NOT touch that healthy pattern.
 *
 * It flags only the real problem: rows whose `model` itself begins with the brand
 * (a bad parse, e.g. brand "BOB" + model "BOB Alterrain Pro"). For each, it
 * proposes the brand-stripped model + a recomputed `${brand} ${cleanModel}`
 * displayName. Rows where cleaning would collide with an existing [brand, model]
 * are reported as conflicts and skipped (never auto-merged — that could orphan
 * compatibility rows).
 *
 *   npx tsx scripts/auditModelBrandDuplication.ts            # read-only audit
 *   npx tsx scripts/auditModelBrandDuplication.ts --apply    # clean safe rows
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/auditModelBrandDuplication.ts
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type Row = { id: string; brand: string; model: string; displayName: string | null };

const keyOf = (brand: string, model: string) => `${brand.toLowerCase()}|::|${model.trim().toLowerCase()}`;

/** Returns the brand-stripped model if `model` redundantly starts with `brand`, else null. */
function dirtyModelClean(brand: string, model: string): string | null {
  const b = brand.trim();
  const m = model.trim();
  if (!b || !m) return null;
  if (m.toLowerCase() === b.toLowerCase()) return null; // model IS the brand — leave it
  if (!m.toLowerCase().startsWith(`${b.toLowerCase()} `)) return null;
  const cleaned = m.slice(b.length).trim();
  return cleaned.length >= 2 ? cleaned : null;
}

async function auditTable(
  table: 'Stroller' | 'CarSeat',
  rows: Row[],
  canon: (b: string) => string,
) {
  const existing = new Set(rows.map((r) => keyOf(canon(r.brand), r.model)));
  let flagged = 0;
  let cleaned = 0;
  let conflicts = 0;

  for (const r of rows) {
    const brand = canon(r.brand);
    const clean = dirtyModelClean(brand, r.model);
    if (!clean) continue;
    flagged += 1;

    const collides = existing.has(keyOf(brand, clean));
    if (collides) {
      conflicts += 1;
      console.log(`  ⚠ [${table}] "${r.brand} ${r.model}" → "${clean}" CONFLICTS with an existing row — skipped.`);
      continue;
    }

    console.log(`  ${APPLY ? 'FIXED' : 'would fix'} [${table}] model "${r.model}" → "${clean}"  (displayName → "${brand} ${clean}")`);
    if (APPLY) {
      const model = table === 'Stroller' ? db.stroller : db.carSeat;
      await model.update({
        where: { id: r.id },
        data: { model: clean, displayName: `${brand} ${clean}` },
      });
      existing.delete(keyOf(brand, r.model));
      existing.add(keyOf(brand, clean));
      cleaned += 1;
    }
  }

  return { flagged, cleaned, conflicts, total: rows.length };
}

async function main() {
  console.log(`── Audit model/brand duplication ──  (${APPLY ? 'APPLY' : 'read-only'})\n`);

  const strollers: Row[] = await db.stroller.findMany({ select: { id: true, brand: true, model: true, displayName: true } });
  const carSeats: Row[] = await db.carSeat.findMany({ select: { id: true, brand: true, model: true, displayName: true } });

  const s = await auditTable('Stroller', strollers, canonicalStrollerBrand);
  const c = await auditTable('CarSeat', carSeats, canonicalBrand);

  console.log('\n════════════════════════════════════════');
  console.log(`Strollers: ${s.total} scanned, ${s.flagged} with brand in model, ${s.conflicts} conflict(s), ${s.cleaned} cleaned.`);
  console.log(`Car seats: ${c.total} scanned, ${c.flagged} with brand in model, ${c.conflicts} conflict(s), ${c.cleaned} cleaned.`);
  if (s.flagged === 0 && c.flagged === 0) {
    console.log('\n✓ No genuine brand-in-model duplication found — the data is clean; the fix was display-only.');
  } else if (!APPLY) {
    console.log('\nREAD-ONLY — re-run with --apply to clean the non-conflicting rows above.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
