/**
 * Restore / un-hide the Mima brand card in the finder + checker with its three
 * stroller product cards:
 *   Miro (compact), Creo (full-size), Xari (full-size).
 *
 * For each model it finds the Mima stroller listings in the affiliate catalog
 * (excluding accessories/frames/bundles) and promotes their enrichment to a
 * public, reviewed "Strollers" row. If a model isn't in any feed, it adds a
 * manual_tmbc entry so it still appears.
 *
 * The public finder brand card is driven by AffiliateCatalogProduct + enrichment
 * (lib/server/publicStrollerCatalog.ts), so promoting enrichment is enough for
 * the Mima card to reappear. Run `npm run strollers:import` afterward only to
 * (re)build the Stroller rows the compatibility engine uses.
 *
 *   npx tsx scripts/restoreMimaStrollers.ts            # dry run (default)
 *   npx tsx scripts/restoreMimaStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/restoreMimaStrollers.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';

// Anything that is an accessory / part / bundle rather than the stroller itself.
const ACCESSORY_RE =
  /\b(cot|carry ?cot|bassinet|second seat|seat pack|adapter|adaptor|rain ?cover|bundle|footmuff|cup ?holder|organi[sz]er|tray|cover|stand|frame only|stroller frame|chassis|wheel|canopy|liner|board|parasol|colou?r ?pack|inlay|bag|starter pack|winter kit)\b/i;

const FULLSIZE = 'Home > Newborn Must-Haves > Strollers > Full-Size Strollers';
const COMPACT = 'Home > Newborn Must-Haves > Strollers > Compact Strollers';

type Target = {
  label: string;
  test: (title: string) => boolean;
  externalId: string;
  brand: string;
  title: string;
  path: string;
  productType: string;
};

const TARGETS: Target[] = [
  {
    label: 'Mima Miro',
    test: (t) => /\bmiro\b/i.test(t),
    externalId: 'mima-miro',
    brand: 'Mima',
    title: 'Mima Miro Stroller',
    path: COMPACT,
    productType: 'compact stroller',
  },
  {
    label: 'Mima Creo',
    test: (t) => /\bcreo\b/i.test(t),
    externalId: 'mima-creo',
    brand: 'Mima',
    title: 'Mima Creo Stroller',
    path: FULLSIZE,
    productType: 'full-size stroller',
  },
  {
    label: 'Mima Xari',
    test: (t) => /\bxari\b/i.test(t) && !/\bzigi\b/i.test(t),
    externalId: 'mima-xari',
    brand: 'Mima',
    title: 'Mima Xari Stroller',
    path: FULLSIZE,
    productType: 'full-size stroller',
  },
];

type Cat = {
  id: string;
  provider: string;
  title: string;
  isActiveInFeed: boolean;
  enrichment: { id: string; reviewStatus: string | null; tmbcCategory: string | null; isPublic: boolean | null } | null;
};

const isStrollerProduct = (title: string) => !ACCESSORY_RE.test(title);

async function promote(rawId: string, productType: string) {
  await db.productEnrichment.upsert({
    where: { rawProductId: rawId },
    update: { tmbcCategory: 'Strollers', productType, reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    create: { rawProductId: rawId, tmbcCategory: 'Strollers', productType, reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
  });
}

async function main() {
  const apply = process.argv.includes('--apply');

  const catalog: Cat[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Mima', mode: 'insensitive' } },
    select: {
      id: true,
      provider: true,
      title: true,
      isActiveInFeed: true,
      enrichment: { select: { id: true, reviewStatus: true, tmbcCategory: true, isPublic: true } },
    },
  });

  console.log('── Restore Mima Miro / Creo / Xari ──');
  console.log(`   ${catalog.length} Mima catalog listing(s) total\n`);

  let promoted = 0;
  let added = 0;

  for (const target of TARGETS) {
    const matches = catalog.filter((c) => target.test(c.title) && isStrollerProduct(c.title));
    console.log(`  ${target.label}: ${matches.length} stroller listing(s)`);
    matches.forEach((c) =>
      console.log(
        `    • [${c.provider}] ${c.title.slice(0, 62)}  [${c.enrichment?.tmbcCategory ?? '—'}/${c.enrichment?.reviewStatus ?? 'no-enrichment'}${c.enrichment?.isPublic ? '' : '/hidden'}]`,
      ),
    );

    if (matches.length > 0) {
      if (apply) {
        for (const c of matches) await promote(c.id, target.productType);
        console.log(`    ✓ un-hid + promoted ${matches.length}`);
      }
      promoted += matches.length;
    } else {
      console.log(`    not in feed — ${apply ? 'adding' : 'would add'} manual entry "${target.title}"`);
      if (apply) {
        const raw = await db.affiliateCatalogProduct.upsert({
          where: { provider_externalId: { provider: MANUAL_PROVIDER, externalId: target.externalId } },
          update: { brand: target.brand, title: target.title, productTypePath: target.path, isActiveInFeed: true, lastSyncedAt: new Date() },
          create: {
            provider: MANUAL_PROVIDER,
            externalId: target.externalId,
            brand: target.brand,
            title: target.title,
            productTypePath: target.path,
            isActiveInFeed: true,
            affiliateUrl: null,
            price: null,
            imageUrl: null,
          },
        });
        await promote(raw.id, target.productType);
        console.log(`    ✓ added manual_tmbc "${target.title}"`);
      }
      added += 1;
    }
    console.log('');
  }

  console.log(`Summary: ${promoted} listing(s) promoted, ${added} manual entr(y/ies) ${apply ? 'added' : 'to add'}.`);
  if (!apply) {
    console.log('\n(dry run — nothing changed. Re-run with --apply, then `npm run strollers:import`.)');
    return;
  }
  console.log('\nDone. Next: `npm run strollers:import` to (re)create the Stroller rows.');
}

main()
  .catch((error) => {
    console.error('[restoreMimaStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
