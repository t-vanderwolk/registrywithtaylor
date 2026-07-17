/**
 * Enforce the real Cybex travel-system rule across the compatibility graph:
 *   • Cybex strollers only accept the UNIVERSAL adapter seat set —
 *     Cybex, Nuna, Maxi-Cosi, Clek.
 *   • Every one of those fits is ADAPTER-required (adapterRequired = true).
 *     No Cybex stroller has a DIRECT infant-seat fit.
 *
 * So for every Cybex Stroller row this script:
 *   • DELETES compatibility rows to any other seat brand (Britax, Chicco, Graco,
 *     Peg Perego, etc.).
 *   • CONVERTS any remaining DIRECT/direct-fit rows to ADAPTER (adapterRequired
 *     true), filling a default adapterType only when one is missing.
 *
 * Idempotent; dry-run default.
 *
 *   npx tsx scripts/fixCybexStrollerCompat.ts            # dry run
 *   npx tsx scripts/fixCybexStrollerCompat.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-cybex-compat-apply
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const UNIVERSAL = new Set(['Cybex', 'Nuna', 'Maxi-Cosi', 'Clek'].map((b) => canonicalBrand(b).toLowerCase()));

type Row = {
  id: string;
  compatibilityType: string | null;
  adapterRequired: boolean | null;
  adapterType: string | null;
  stroller: { brand: string; model: string };
  carSeat: { brand: string; model: string };
};

async function main() {
  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    where: { brand: { contains: 'Cybex', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true },
  });
  const ids = strollers.map((s) => s.id);
  console.log(`── Fix Cybex stroller compatibility ──  (${APPLY ? 'APPLY' : 'dry-run'})`);
  console.log(`  Cybex strollers: ${strollers.length}`);
  if (!ids.length) return;

  const rows: Row[] = await db.compatibility.findMany({
    where: { strollerId: { in: ids } },
    select: {
      id: true, compatibilityType: true, adapterRequired: true, adapterType: true,
      stroller: { select: { brand: true, model: true } },
      carSeat: { select: { brand: true, model: true } },
    },
  });

  const toDelete = rows.filter((r) => !UNIVERSAL.has(canonicalBrand(r.carSeat.brand).toLowerCase()));
  const toConvert = rows.filter(
    (r) =>
      UNIVERSAL.has(canonicalBrand(r.carSeat.brand).toLowerCase()) &&
      (r.compatibilityType !== 'ADAPTER' || r.adapterRequired !== true),
  );

  console.log(`  compatibility rows on Cybex strollers: ${rows.length}`);
  console.log(`  → delete (non-universal seat brand): ${toDelete.length}`);
  console.log(`  → convert direct → adapter: ${toConvert.length}\n`);

  const brandCount = new Map<string, number>();
  for (const r of toDelete) {
    const b = canonicalBrand(r.carSeat.brand);
    brandCount.set(b, (brandCount.get(b) ?? 0) + 1);
  }
  if (brandCount.size) {
    console.log('  seat brands being removed from Cybex strollers:');
    for (const [b, n] of [...brandCount.entries()].sort((a, z) => z[1] - a[1])) console.log(`    · ${b}: ${n}`);
  }
  for (const r of toConvert.slice(0, 20)) {
    console.log(`    ↻ ${r.stroller.brand} ${r.stroller.model} × ${r.carSeat.brand} ${r.carSeat.model} (${r.compatibilityType})`);
  }

  if (!APPLY) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  let deleted = 0;
  if (toDelete.length) {
    const res = await db.compatibility.deleteMany({ where: { id: { in: toDelete.map((r) => r.id) } } });
    deleted = res.count ?? toDelete.length;
  }
  let converted = 0;
  for (const r of toConvert) {
    await db.compatibility.update({
      where: { id: r.id },
      data: {
        compatibilityType: 'ADAPTER',
        adapterRequired: true,
        adapterType: r.adapterType ?? 'Cybex infant car seat adapter (Cybex / Nuna / Maxi-Cosi / Clek)',
      },
    });
    converted += 1;
  }
  console.log(`\n  Deleted ${deleted} non-universal row(s); converted ${converted} direct fit(s) to adapter-required.`);
}

main()
  .catch((error) => {
    console.error('[fixCybexStrollerCompat] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
