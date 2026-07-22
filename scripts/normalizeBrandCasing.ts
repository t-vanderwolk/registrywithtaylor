/**
 * Collapse brand-casing / spelling variants in the catalog to their canonical
 * form (canonicalBrand), for BOTH strollers and car seats.
 *
 * The Babylist feed sometimes ships the same brand under two strings — most
 * visibly "CYBEX" vs "Cybex" — which produces duplicate rows and doubled lines
 * in the compatibility tools. canonicalBrand already knows the right form; this
 * script rewrites the stored brand to match.
 *
 * Because both Stroller and CarSeat have @@unique([brand, model]), a plain rename
 * can collide with an existing canonical row (e.g. renaming "CYBEX Aton G" when
 * "Cybex Aton G" already exists). Those are MERGED: the duplicate's Compatibility
 * rows are moved onto the canonical row (skipping any that would duplicate), then
 * the duplicate row is deleted. Rows with no canonical twin are simply renamed.
 *
 *   npx tsx scripts/normalizeBrandCasing.ts            # dry run (default)
 *   npx tsx scripts/normalizeBrandCasing.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:normalize-brands-apply
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type Row = { id: string; brand: string; model: string };

async function normalizeTable(table: 'stroller' | 'carSeat', fkField: 'strollerId' | 'carSeatId') {
  const label = table === 'stroller' ? 'Stroller' : 'CarSeat';
  const rows: Row[] = await db[table].findMany({ select: { id: true, brand: true, model: true } });

  // Index canonical (brand,model) → id so we can detect collisions.
  const byKey = new Map<string, string>();
  const key = (brand: string, model: string) => `${brand.toLowerCase()}|${model.toLowerCase()}`;
  for (const r of rows) byKey.set(key(r.brand, r.model), r.id);

  let renamed = 0;
  let merged = 0;

  for (const r of rows) {
    const canonical = canonicalBrand(r.brand);
    if (canonical === r.brand) continue; // already canonical

    const twinId = byKey.get(key(canonical, r.model));
    if (twinId && twinId !== r.id) {
      // A canonical-brand twin exists → MERGE this row into it.
      console.log(`  ${APPLY ? 'MERGE' : 'plan-merge'}  ${label}: "${r.brand} ${r.model}" → "${canonical} ${r.model}"`);
      merged += 1;
      if (APPLY) {
        // Move compatibility rows that won't collide; delete the rest.
        const compatRows: Array<{ id: string; strollerId: string; carSeatId: string }> = await db.compatibility.findMany({
          where: { [fkField]: r.id },
          select: { id: true, strollerId: true, carSeatId: true },
        });
        for (const c of compatRows) {
          const target = fkField === 'strollerId' ? { strollerId: twinId, carSeatId: c.carSeatId } : { strollerId: c.strollerId, carSeatId: twinId };
          const exists = await db.compatibility.findFirst({
            where: { strollerId: target.strollerId, carSeatId: target.carSeatId },
            select: { id: true },
          });
          if (exists) {
            await db.compatibility.delete({ where: { id: c.id } });
          } else {
            await db.compatibility.update({ where: { id: c.id }, data: { [fkField]: twinId } });
          }
        }
        await db[table].delete({ where: { id: r.id } });
      }
    } else {
      // No twin → safe to rename in place.
      console.log(`  ${APPLY ? 'RENAME' : 'plan-rename'} ${label}: "${r.brand} ${r.model}" → "${canonical} ${r.model}"`);
      renamed += 1;
      if (APPLY) await db[table].update({ where: { id: r.id }, data: { brand: canonical } });
      byKey.set(key(canonical, r.model), r.id);
    }
  }

  return { renamed, merged };
}

async function main() {
  console.log(`── Normalize brand casing ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const seat = await normalizeTable('carSeat', 'carSeatId');
  const stroller = await normalizeTable('stroller', 'strollerId');

  console.log(
    `\n${APPLY ? 'Applied' : 'Dry run'} — CarSeat: ${seat.renamed} renamed, ${seat.merged} merged. ` +
      `Stroller: ${stroller.renamed} renamed, ${stroller.merged} merged.`,
  );
  if (!APPLY) console.log('Re-run with --apply to write.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[normalizeBrandCasing] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
