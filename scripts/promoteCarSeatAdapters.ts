/**
 * Surface car-seat stroller adapters in the travel-system checker.
 *
 * The MacroBaby import categorizes car seat adapters under 'Travel Systems &
 * Adapters' but frequently leaves them needsReview, so getCatalogAdapters()
 * (which requires needsReview:false and reviewStatus not HIDDEN/NEEDS_REVIEW)
 * never attaches their image / link / price to adapter-required compatibility
 * rows. This promotes every car-seat adapter — Thule Urban Glide, UPPAbaby
 * Ridge, BOB Wayfinder, Peg Perego City Loop, etc. — to a reviewed, public
 * 'Travel Systems & Adapters' product. Bassinet / travel-bag adapters are left
 * alone.
 *
 *   npx tsx scripts/promoteCarSeatAdapters.ts            # dry run (default)
 *   npx tsx scripts/promoteCarSeatAdapters.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:promote-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const isCarSeatAdapter = (title: string) =>
  /\badapters?\b/i.test(title) &&
  /\b(car ?seat|infant)\b/i.test(title) &&
  !/\b(bassinet|travel bag|stroller bag|carry ?cot|rain cover|organi[sz]er|cup ?holder)\b/i.test(title);

type Row = {
  id: string;
  title: string;
  affiliateUrl: string | null;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null; needsReview: boolean | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      provider: 'shopify_macrobaby',
      isActiveInFeed: true,
      title: { contains: 'adapter', mode: 'insensitive' },
    },
    select: {
      id: true,
      title: true,
      affiliateUrl: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true, needsReview: true } },
    },
  });

  const targets = rows.filter((r) => isCarSeatAdapter(r.title));
  const alreadyLive = targets.filter(
    (r) =>
      r.enrichment?.tmbcCategory === 'Travel Systems & Adapters' &&
      r.enrichment?.needsReview === false &&
      r.enrichment?.reviewStatus !== 'HIDDEN' &&
      r.enrichment?.reviewStatus !== 'NEEDS_REVIEW',
  );
  const toPromote = targets.filter((r) => !alreadyLive.includes(r));

  console.log('── Promote car-seat adapters to the checker ──');
  console.log(`  adapter products scanned: ${rows.length}`);
  console.log(`  car-seat adapters: ${targets.length}  (already live: ${alreadyLive.length}, to promote: ${toPromote.length})\n`);
  toPromote.forEach((r) =>
    console.log(`    ↑ ${r.title.slice(0, 72)}  [${r.enrichment?.tmbcCategory ?? '—'}/${r.enrichment?.reviewStatus ?? 'no-enrichment'}${r.enrichment?.needsReview ? '/needsReview' : ''}]`),
  );

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  let promoted = 0;
  for (const r of toPromote) {
    if (r.enrichment?.id) {
      await db.productEnrichment.update({
        where: { id: r.enrichment.id },
        data: {
          tmbcCategory: 'Travel Systems & Adapters',
          productType: 'stroller adapter',
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
      });
    } else {
      await db.productEnrichment.create({
        data: {
          rawProductId: r.id,
          tmbcCategory: 'Travel Systems & Adapters',
          productType: 'stroller adapter',
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
      });
    }
    promoted += 1;
  }

  console.log(`\n  Promoted ${promoted} car-seat adapter(s) to 'Travel Systems & Adapters' (reviewed, public).`);
  console.log('  They now attach (image + link + price) wherever a stroller has an adapter-required match.');
}

main()
  .catch((error) => {
    console.error('[promoteCarSeatAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
