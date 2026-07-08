/**
 * Restore / un-hide the missing Cybex strollers to the finder + checker:
 *   Priam, Mios, Gazelle (Gazelle S), e-Priam, e-Gazelle.
 *
 * For each model it finds the Cybex stroller listings in the affiliate catalog
 * (excluding accessories/frames/bundles) and promotes their enrichment to a
 * public, reviewed "Strollers" row. If a model isn't in any feed, it adds a
 * manual_tmbc entry so it still appears.
 *
 * After applying, run `npm run strollers:import` to (re)create the Stroller rows.
 * Cybex is a same-brand-default brand, so each then shows Cybex infant seats.
 *
 *   npx tsx scripts/restoreCybexPriamMiosGazelle.ts            # dry run (default)
 *   npx tsx scripts/restoreCybexPriamMiosGazelle.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/restoreCybexPriamMiosGazelle.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';

// Anything that is an accessory / part / bundle rather than the stroller itself.
const ACCESSORY_RE =
  /\b(cot|carry ?cot|bassinet|second seat|seat pack|adapter|adaptor|rain ?cover|bundle|footmuff|cup ?holder|organi[sz]er|tray|cover|stand|frame only|chassis|wheel|canopy|liner|board|parasol)\b/i;

const FULLSIZE = 'Home > Newborn Must-Haves > Strollers > Full-Size Strollers';
const COMPACT = 'Home > Newborn Must-Haves > Strollers > Compact Strollers';
const CONVERTIBLE = 'Home > Newborn Must-Haves > Strollers > Convertible Strollers';

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
    label: 'Cybex Priam',
    test: (t) => /\bpriam\b/i.test(t) && !/\be-?\s?priam\b|epriam|electric/i.test(t),
    externalId: 'cybex-priam',
    brand: 'Cybex',
    title: 'Cybex Priam Stroller',
    path: FULLSIZE,
    productType: 'full-size stroller',
  },
  {
    label: 'Cybex e-Priam',
    test: (t) => /\be-?\s?priam\b|epriam/i.test(t) || (/\bpriam\b/i.test(t) && /electric/i.test(t)),
    externalId: 'cybex-e-priam',
    brand: 'Cybex',
    title: 'Cybex e-Priam Electric Stroller',
    path: FULLSIZE,
    productType: 'full-size stroller',
  },
  {
    label: 'Cybex Mios',
    test: (t) => /\bmios\b/i.test(t),
    externalId: 'cybex-mios',
    brand: 'Cybex',
    title: 'Cybex Mios Stroller',
    path: COMPACT,
    productType: 'compact stroller',
  },
  {
    label: 'Cybex Gazelle S',
    test: (t) => /\bgazelle\b/i.test(t) && !/\be-?\s?gazelle\b|egazelle|electric/i.test(t),
    externalId: 'cybex-gazelle-s',
    brand: 'Cybex',
    title: 'Cybex Gazelle S Stroller',
    path: CONVERTIBLE,
    productType: 'single-to-double stroller',
  },
  {
    label: 'Cybex e-Gazelle',
    test: (t) => /\be-?\s?gazelle\b|egazelle/i.test(t) || (/\bgazelle\b/i.test(t) && /electric/i.test(t)),
    externalId: 'cybex-e-gazelle',
    brand: 'Cybex',
    title: 'Cybex e-Gazelle S Electric Stroller',
    path: CONVERTIBLE,
    productType: 'single-to-double stroller',
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
    where: { brand: { contains: 'Cybex', mode: 'insensitive' } },
    select: {
      id: true,
      provider: true,
      title: true,
      isActiveInFeed: true,
      enrichment: { select: { id: true, reviewStatus: true, tmbcCategory: true, isPublic: true } },
    },
  });

  console.log('── Restore Cybex Priam / Mios / Gazelle (+ e- variants) ──');
  console.log(`   ${catalog.length} Cybex catalog listing(s) total\n`);

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
    console.error('[restoreCybexPriamMiosGazelle] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
