/**
 * Attach the Thule car-seat adapter link + image to the Thule compatibility rows
 * that are currently missing one (Maxi-Cosi / Nuna / CYBEX pairings), from
 * lib/catalog/thuleAdapters. Only fills EMPTY adapter links — never overwrites an
 * existing one.
 *
 *   npx tsx scripts/applyThuleAdapterLinks.ts            # dry run
 *   npx tsx scripts/applyThuleAdapterLinks.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:thule-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';
import { thuleAdapterForModel } from '@/lib/catalog/thuleAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
const has = (v: string | null | undefined) => typeof v === 'string' && v.trim().length > 0;

async function main() {
  console.log(`── Attach Thule adapter links + images ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const rows: Array<{
    id: string;
    compatibilityType: string;
    adapterRequired: boolean;
    adapterBabylistUrl: string | null;
    stroller: { brand: string; model: string; displayName: string | null };
    carSeat: { brand: string; model: string };
  }> = await db.compatibility.findMany({
    where: { stroller: { brand: { equals: 'Thule', mode: 'insensitive' } } },
    select: {
      id: true,
      compatibilityType: true,
      adapterRequired: true,
      adapterBabylistUrl: true,
      stroller: { select: { brand: true, model: true, displayName: true } },
      carSeat: { select: { brand: true, model: true } },
    },
  });

  let updated = 0;
  let skippedHasLink = 0;
  let skippedNoRule = 0;
  let skippedOtherBrand = 0;
  const perStroller = new Map<string, number>();

  for (const r of rows) {
    const isAdapter = r.compatibilityType === 'ADAPTER' || r.adapterRequired === true;
    if (!isAdapter) continue;

    const rule = thuleAdapterForModel(r.stroller.model);
    if (!rule) { skippedNoRule += 1; continue; }
    if (!rule.seatBrands.some((b) => norm(b) === norm(r.carSeat.brand))) { skippedOtherBrand += 1; continue; }
    if (has(r.adapterBabylistUrl)) { skippedHasLink += 1; continue; }

    updated += 1;
    const label = r.stroller.displayName || `${r.stroller.brand} ${r.stroller.model}`;
    perStroller.set(label, (perStroller.get(label) ?? 0) + 1);
    if (APPLY) {
      await db.compatibility.update({
        where: { id: r.id },
        data: { adapterType: rule.adapterType, adapterBabylistUrl: rule.adapterUrl, adapterImage: rule.adapterImage },
      });
    }
  }

  for (const [label, n] of [...perStroller.entries()].sort()) {
    console.log(`  ${label}  —  ${n} adapter pairing(s) linked`);
  }

  console.log(
    `\n${APPLY ? 'Applied' : 'Dry run'} — ${updated} row(s) linked; ` +
      `${skippedHasLink} already had a link, ${skippedOtherBrand} other seat brand (needs a different Thule adapter), ${skippedNoRule} no Thule rule (UG2/Shine/Double — pending).`,
  );
  if (!APPLY) console.log('\nRe-run with --apply to write these links.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[applyThuleAdapterLinks] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
