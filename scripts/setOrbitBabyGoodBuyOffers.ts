/**
 * Move the GoodBuy Gear open-box badge off the Orbit Baby G5 stroller and onto
 * the Orbit Baby M+ travel stroller.
 *
 *  1. Hide every GoodBuy Gear (provider "impact_goodbuygear") Orbit Baby STROLLER
 *     row (leaves car seats alone) — this drops the open-box badge from the G5
 *     card and removes any duplicate imported M+ row.
 *  2. Add the M+ as a hand-added (manual_tmbc) product whose buy link is the
 *     GoodBuy Gear open-box listing. The finder now surfaces a manual GoodBuy
 *     Gear link as a shoppable primary + open-box badge (see publicStrollerCatalog).
 *
 * Idempotent — safe to re-run.
 *
 *   npx tsx scripts/setOrbitBabyGoodBuyOffers.ts            # dry run (default)
 *   npx tsx scripts/setOrbitBabyGoodBuyOffers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:orbit-goodbuy-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';

const M_PLUS = {
  externalId: 'orbit-baby-m-plus',
  brand: 'Orbit Baby',
  title: 'Orbit Baby M+ Stroller',
  canonicalName: 'M+',
  productType: 'travel stroller',
  path: 'Home > Newborn Must-Haves > Strollers > Travel Strollers',
  price: 570.94,
  imageUrl:
    'https://goodbuygear.com/cdn/shop/files/M_Stroller_Black_Luxe_Black_01_1200x1200.webp?v=1782229086',
  affiliateUrl:
    'https://goodbuygear.pxf.io/c/6560395/3220593/40600?u=https%3A%2F%2Fgoodbuygear.com%2Fproducts%2Forbit-baby-m-plus-stroller-black-2025-black-luxe-1%3F_pos%3D68%26_sid%3D9430d61b7%26_ss%3Dr&partnerpropertyid=7490466',
};

type GbgRow = {
  id: string;
  title: string;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Orbit Baby GoodBuy Gear: G5 → M+ ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // 1) Hide GoodBuy Gear Orbit Baby STROLLER rows (keep car seats).
  const gbgRows: GbgRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      provider: 'impact_goodbuygear',
      brand: { contains: 'Orbit Baby', mode: 'insensitive' },
    },
    select: {
      id: true,
      title: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
  });

  const strollerRows = gbgRows.filter((r) => !/car ?seat/i.test(r.title));
  console.log('  GoodBuy Gear Orbit Baby rows:', gbgRows.length, '| strollers to hide:', strollerRows.length);
  for (const r of strollerRows) {
    const already = r.enrichment?.reviewStatus === 'HIDDEN';
    console.log(`    ${already ? '✓ hidden' : '→ hide  '}  "${r.title}"`);
    if (apply && !already && r.enrichment) {
      await db.productEnrichment.update({
        where: { id: r.enrichment.id },
        data: { reviewStatus: 'HIDDEN', isPublic: false },
      });
    }
  }

  // 2) Upsert the M+ as a manual product whose link is the GoodBuy Gear open-box.
  console.log(`\n  ${apply ? '→' : 'would'} add M+  "${M_PLUS.title}"  $${M_PLUS.price}  (GoodBuy Gear open box)`);
  if (apply) {
    const raw = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: MANUAL_PROVIDER, externalId: M_PLUS.externalId } },
      update: {
        brand: M_PLUS.brand,
        title: M_PLUS.title,
        productTypePath: M_PLUS.path,
        affiliateUrl: M_PLUS.affiliateUrl,
        imageUrl: M_PLUS.imageUrl,
        price: M_PLUS.price,
        retailer: 'GoodBuy Gear',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: MANUAL_PROVIDER,
        externalId: M_PLUS.externalId,
        brand: M_PLUS.brand,
        title: M_PLUS.title,
        productTypePath: M_PLUS.path,
        affiliateUrl: M_PLUS.affiliateUrl,
        imageUrl: M_PLUS.imageUrl,
        price: M_PLUS.price,
        currency: 'USD',
        retailer: 'GoodBuy Gear',
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    const enrichment = {
      canonicalBrand: M_PLUS.brand,
      canonicalName: M_PLUS.canonicalName,
      tmbcCategory: 'Strollers',
      productType: M_PLUS.productType,
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    };
    await db.productEnrichment.upsert({
      where: { rawProductId: raw.id },
      update: enrichment,
      create: { rawProductId: raw.id, ...enrichment },
    });
  }

  console.log(`\n${apply ? 'Done — G5 badge removed, M+ open-box added.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[setOrbitBabyGoodBuyOffers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
