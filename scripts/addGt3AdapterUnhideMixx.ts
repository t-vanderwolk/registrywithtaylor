/**
 *  1. Add the Baby Jogger City Mini GT3 Car Seat Adapter (Nuna) — babylist_impact,
 *     Travel Systems & Adapters. Title carries "City Mini GT3" + "Nuna" so the
 *     engine matches it to the GT3 stroller for Nuna seats.
 *  2. Un-hide the Nuna MIXX next stroller so it shows in the finder + checker
 *     again (REVIEWED / public), ensures its Stroller row, and gives it Nuna PIPA
 *     direct-fit compatibility.
 *
 *   npx tsx scripts/addGt3AdapterUnhideMixx.ts            # dry run (default)
 *   npx tsx scripts/addGt3AdapterUnhideMixx.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:gt3-mixx-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const ADAPTER = {
  externalId: '2444114',
  brand: 'Baby Jogger',
  title: 'Baby Jogger City Mini GT3 Car Seat Adapter (Nuna)',
  productUrl: 'https://www.babylist.com/gp/baby-jogger-city-mini-gt3-car-seat-adapter-nuna/73653/2444114',
  imageUrl:
    'https://images.ctfassets.net/50gzycvace50/8067c06e44b19949ca641103741efc83b546ce429bd5f5ebf5a2f9ca71cfb421/55812430a5866509f206f0cf5b7ffa0c/8067c06e44b19949ca641103741efc83b546ce429bd5f5ebf5a2f9ca71cfb421.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
  price: 49.99,
};

const MIXX = { brand: 'Nuna', model: 'MIXX next' };

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add GT3 Nuna adapter + un-hide Nuna MIXX next ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // ── 1. Adapter ──
  console.log(`Adapter: ${ADAPTER.title}  $${ADAPTER.price}`);
  if (apply) {
    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'babylist_impact', externalId: ADAPTER.externalId } },
      update: {
        brand: ADAPTER.brand,
        title: ADAPTER.title,
        affiliateUrl: babylistAffiliate(ADAPTER.productUrl),
        imageUrl: ADAPTER.imageUrl,
        price: ADAPTER.price,
        retailer: 'Babylist',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: 'babylist_impact',
        externalId: ADAPTER.externalId,
        brand: ADAPTER.brand,
        title: ADAPTER.title,
        affiliateUrl: babylistAffiliate(ADAPTER.productUrl),
        imageUrl: ADAPTER.imageUrl,
        price: ADAPTER.price,
        retailer: 'Babylist',
        isActiveInFeed: true,
      },
      select: { id: true },
    });
    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: ADAPTER.brand,
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: ADAPTER.brand,
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
  }

  // ── 2. Un-hide Nuna MIXX next (catalog) ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mixxRows: any[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { startsWith: 'Nuna', mode: 'insensitive' },
      title: { contains: 'mixx', mode: 'insensitive' },
      enrichment: { is: { tmbcCategory: 'Strollers' } },
    },
    select: { id: true, title: true, enrichment: { select: { id: true, reviewStatus: true } } },
  });
  const hidden = mixxRows.filter((r) => r.enrichment && r.enrichment.reviewStatus !== 'REVIEWED');
  console.log(`\nNuna MIXX catalog products: ${mixxRows.length} (${hidden.length} to un-hide)`);
  mixxRows.forEach((r) => console.log(`   • [${r.enrichment?.reviewStatus}] ${r.title.slice(0, 62)}`));
  if (apply && hidden.length) {
    await db.productEnrichment.updateMany({
      where: { id: { in: hidden.map((r) => r.enrichment.id) } },
      data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    });
  }

  // Ensure the MIXX next Stroller row + Nuna PIPA direct-fit.
  let strollerId: string | null = null;
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: MIXX.brand, mode: 'insensitive' }, model: { contains: 'mixx', mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) {
    strollerId = existing.id;
    console.log('\nStroller row: exists');
  } else if (apply) {
    const created = await db.stroller.create({
      data: { brand: MIXX.brand, model: MIXX.model, displayName: `${MIXX.brand} ${MIXX.model}`, babylistUpdatedAt: new Date() },
      select: { id: true },
    });
    strollerId = created.id;
    console.log('\nStroller row: created');
  } else {
    console.log('\nStroller row: would create');
  }

  if (apply && strollerId) {
    const pipaSeats: { id: string }[] = await db.carSeat.findMany({
      where: { brand: { equals: 'Nuna', mode: 'insensitive' }, seatType: 'INFANT' },
      select: { id: true },
    });
    let added = 0;
    for (const seat of pipaSeats) {
      const existsRow = await db.compatibility.findFirst({ where: { strollerId, carSeatId: seat.id }, select: { id: true } });
      if (existsRow) continue;
      await db.compatibility.create({
        data: {
          strollerId,
          carSeatId: seat.id,
          compatibilityType: 'DIRECT',
          adapterRequired: false,
          adapterType: null,
          confidence: 'HIGH',
          notes: 'Nuna MIXX next connects directly with Nuna PIPA series infant car seats — no adapter needed.',
        },
      });
      added += 1;
    }
    console.log(`Nuna PIPA direct-fit rows added: ${added}`);
  }

  console.log(`\n${apply ? 'Done.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addGt3AdapterUnhideMixx] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
