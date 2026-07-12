/**
 * The Orbit Baby G5 infant car seat and the Orbit Baby G5 stroller both carried
 * the bare model "G5", so the finder grouped them under one brand+model key
 * (`productModelKey("Orbit Baby", "G5")`) — dragging the car seat's GoodBuy Gear
 * open-box price + car-seat image onto the G5 stroller card.
 *
 * Fix: give the car seat a distinct name ("G5 Infant Car Seat") and move it to
 * the Car Seats category so it (a) no longer shares the stroller's model key and
 * (b) drops out of the stroller finder entirely, surfacing with the car seats
 * where it belongs. Idempotent — safe to re-run.
 *
 * Matches any Orbit Baby catalog row whose title reads like an infant car seat
 * (contains "car seat", excludes "adapter"/"base"/"stroller"), across providers.
 *
 *   npx tsx scripts/renameOrbitBabyG5CarSeat.ts            # dry run (default)
 *   npx tsx scripts/renameOrbitBabyG5CarSeat.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:rename-orbit-g5-carseat-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const NEW_TITLE = 'Orbit Baby G5 Infant Car Seat';
const NEW_CANONICAL_NAME = 'G5 Infant Car Seat';

type Row = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  enrichment: {
    id: string;
    tmbcCategory: string | null;
    productType: string | null;
    canonicalName: string | null;
  } | null;
};

function isG5InfantSeat(title: string) {
  const t = title.toLowerCase();
  if (!/\bcar ?seat\b/.test(t)) return false;
  if (/\b(adapter|adaptor|base|stroller|stand|cover|canopy)\b/.test(t)) return false;
  // Only the G5 seat — leave any other Orbit Baby seats untouched.
  return /\bg5\b/.test(t) || /\binfant\b/.test(t);
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Rename Orbit Baby G5 infant car seat ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Orbit Baby', mode: 'insensitive' } },
    select: {
      id: true,
      provider: true,
      brand: true,
      title: true,
      enrichment: {
        select: { id: true, tmbcCategory: true, productType: true, canonicalName: true },
      },
    },
  });

  const targets = rows.filter((r) => isG5InfantSeat(r.title));

  if (targets.length === 0) {
    console.log('  No Orbit Baby infant-car-seat rows matched.');
    console.log('  (Matched Orbit Baby rows in catalog:', rows.length, '— none look like the G5 seat.)');
    return;
  }

  for (const r of targets) {
    const already =
      r.title === NEW_TITLE &&
      r.enrichment?.canonicalName === NEW_CANONICAL_NAME &&
      r.enrichment?.tmbcCategory === 'Car Seats';
    console.log(
      `  ${already ? '✓ up-to-date' : '→ rename'}  [${r.provider}]  "${r.title}"  ` +
        `(cat: ${r.enrichment?.tmbcCategory ?? '—'}, name: ${r.enrichment?.canonicalName ?? '—'})`,
    );
    if (!apply || already) continue;

    await db.affiliateCatalogProduct.update({
      where: { id: r.id },
      data: { title: NEW_TITLE },
    });

    const enrichmentData = {
      canonicalBrand: 'Orbit Baby',
      canonicalName: NEW_CANONICAL_NAME,
      tmbcCategory: 'Car Seats',
      productType: 'infant car seat',
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    };
    if (r.enrichment) {
      await db.productEnrichment.update({ where: { id: r.enrichment.id }, data: enrichmentData });
    } else {
      await db.productEnrichment.create({ data: { rawProductId: r.id, ...enrichmentData } });
    }
    console.log(`      renamed → "${NEW_TITLE}"  ·  Car Seats · infant car seat`);
  }

  console.log(
    `\n${apply ? `Done — updated ${targets.length} row(s).` : '(dry run — re-run with --apply.)'}`,
  );
  if (apply) {
    console.log('The G5 stroller card in the finder will no longer inherit the car-seat open-box + image.');
  }
}

main()
  .catch((error) => {
    console.error('[renameOrbitBabyG5CarSeat] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
