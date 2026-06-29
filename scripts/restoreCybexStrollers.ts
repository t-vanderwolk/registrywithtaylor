/**
 * Restore the Cybex Gazelle S and Cybex Libelle strollers to the finder + checker.
 *
 * Both were dropped by an earlier removeStrollerModels pass. Gazelle S is in the
 * MacroBaby feed, so we un-hide + promote its stroller listings; Libelle is not in
 * the feed, so we add it as a manual_tmbc product. Accessory listings (Cot, Second
 * Seat, Adapter, Rain Cover, Bundle) are left alone.
 *
 * After this, run `npm run strollers:import` to (re)create the Stroller rows. Cybex
 * is a same-brand-default brand, so both then show Cybex infant seats automatically.
 *
 *   npx tsx scripts/restoreCybexStrollers.ts            # dry run (default)
 *   npx tsx scripts/restoreCybexStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:restore-cybex-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';

const ACCESSORY_RE =
  /\b(cot|second seat|adapter|adaptor|rain cover|bundle|bassinet|seat pack|footmuff|cup ?holder|organi[sz]er|tray|cover|stand)\b/i;

type Target = {
  label: string;
  re: RegExp;
  externalId: string;
  brand: string;
  title: string; // manual fallback title
  path: string; // manual fallback category path
  productType: string;
};

const TARGETS: Target[] = [
  {
    label: 'Cybex Gazelle S',
    re: /\b(e-?gazelle|gazelle)\b/i,
    externalId: 'cybex-gazelle-s',
    brand: 'Cybex',
    title: 'Cybex Gazelle S Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Convertible Strollers',
    productType: 'single-to-double stroller',
  },
  {
    label: 'Cybex Libelle',
    re: /\blibelle\b/i,
    externalId: 'cybex-libelle',
    brand: 'Cybex',
    title: 'Cybex Libelle Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Travel Strollers',
    productType: 'travel stroller',
  },
];

type Cat = {
  id: string;
  provider: string;
  title: string;
  enrichment: { id: string; reviewStatus: string | null; tmbcCategory: string | null } | null;
};

const isStrollerProduct = (title: string) => /\bstroller\b/i.test(title) && !ACCESSORY_RE.test(title);

async function upsertStrollerEnrichment(rawId: string, productType: string) {
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
      enrichment: { select: { id: true, reviewStatus: true, tmbcCategory: true } },
    },
  });

  console.log('── Restore Cybex Gazelle S + Libelle to the stroller options ──');

  for (const target of TARGETS) {
    const matches = catalog.filter((c) => target.re.test(c.title) && isStrollerProduct(c.title));
    console.log(`\n  ${target.label}: ${matches.length} stroller listing(s) in catalog`);
    matches.forEach((c) =>
      console.log(
        `    • [${c.provider}] ${c.title.slice(0, 60)}  [${c.enrichment?.tmbcCategory ?? '—'}/${c.enrichment?.reviewStatus ?? 'no-enrichment'}]`,
      ),
    );

    if (apply && matches.length) {
      for (const c of matches) await upsertStrollerEnrichment(c.id, target.productType);
      console.log(`    ✓ un-hid + promoted ${matches.length} listing(s)`);
    }

    if (matches.length === 0) {
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
        await upsertStrollerEnrichment(raw.id, target.productType);
        console.log(`    ✓ added manual_tmbc "${target.title}"`);
      }
    }
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply, then `npm run strollers:import`.)');
    return;
  }
  console.log('\n  Done. Next: `npm run strollers:import` to (re)create the Stroller rows.');
  console.log('  Cybex is a same-brand-default brand, so both show Cybex infant seats automatically.');
}

main()
  .catch((error) => {
    console.error('[restoreCybexStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
