/**
 * Fix Nuna own-brand compatibility rows that are wrongly typed as ADAPTER.
 *
 * Nuna is a closed ecosystem: Nuna infant seats (PIPA family) click DIRECTLY onto
 * Nuna strollers (MIXX next, TRIV, DEMI, TAVO, …) — no adapter, ever. Some rows
 * were seeded as ADAPTER with an empty adapter link/image, which made the audit
 * flag those strollers as "missing adapter link/image." This converts every
 * Nuna-stroller × Nuna-seat row to DIRECT and clears the adapter fields.
 *
 *   npx tsx scripts/fixNunaOwnBrandDirectFit.ts            # dry run
 *   npx tsx scripts/fixNunaOwnBrandDirectFit.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-nuna-direct-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

async function main() {
  console.log(`── Fix Nuna own-brand direct fit ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const rows: Array<{
    id: string;
    compatibilityType: string;
    adapterRequired: boolean;
    stroller: { brand: string; model: string };
    carSeat: { brand: string; model: string };
  }> = await db.compatibility.findMany({
    where: {
      stroller: { brand: { equals: 'Nuna', mode: 'insensitive' } },
      carSeat: { brand: { equals: 'Nuna', mode: 'insensitive' } },
      OR: [{ compatibilityType: 'ADAPTER' }, { adapterRequired: true }],
    },
    select: {
      id: true,
      compatibilityType: true,
      adapterRequired: true,
      stroller: { select: { brand: true, model: true } },
      carSeat: { select: { brand: true, model: true } },
    },
  });

  if (rows.length === 0) {
    console.log('  Nothing to fix — no Nuna×Nuna ADAPTER rows found.');
    await db.$disconnect?.();
    return;
  }

  const data = {
    compatibilityType: 'DIRECT',
    adapterRequired: false,
    adapterType: null as string | null,
    adapterBabylistUrl: null as string | null,
    adapterImage: null as string | null,
    adapterPrice: null as number | null,
    adapterBabylistSku: null as string | null,
    confidence: 'HIGH',
    notes: 'Same-brand direct fit — Nuna PIPA seats click straight onto Nuna strollers, no adapter needed.',
  };

  for (const r of rows) {
    console.log(`  → ${r.stroller.model}  ×  ${r.carSeat.model}   (${r.compatibilityType} → DIRECT)`);
    if (APPLY) await db.compatibility.update({ where: { id: r.id }, data });
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${rows.length} row(s) ${APPLY ? 'converted to DIRECT' : 'would convert to DIRECT'}.`);
  if (!APPLY) console.log('\nRe-run with --apply to write these changes.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[fixNunaOwnBrandDirectFit] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
