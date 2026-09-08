/**
 * Silver Cross travel-system correction.
 *
 * Canonical public/audit stroller set:
 *   Reef, Cove 2, Breez, Nia, Clic, Jet Double, Wave, Wave 3.
 *
 * Compatibility:
 *   - Every target stroller except Clic accepts Nuna / CYBEX / Clek / Maxi-Cosi
 *     infant seats via a model-specific Silver Cross adapter.
 *   - Clic direct-fits Nuna PIPA-series + Joie Mint Latch only.
 *
 *   npm run catalog:fix-silver-cross
 *   npm run catalog:fix-silver-cross-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type StrollerRow = { id: string; brand: string; model: string; displayName: string | null };
type SeatRow = { id: string; brand: string; model: string; displayName: string | null };
type ProductRow = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  retailer: string | null;
  enrichment: { canonicalName: string | null; reviewStatus: string; isPublic: boolean; needsReview: boolean } | null;
};

type TargetStroller = {
  model: string;
  productType: string;
  sharedAdapter: boolean;
  aliases: string[];
  match: RegExp;
  directUrl?: string;
};

const sc = (slug: string) => `https://silvercrossus.com/product/${slug}/?ref=4762`;

const TARGETS: TargetStroller[] = [
  {
    model: 'Reef',
    productType: 'full-size stroller',
    sharedAdapter: true,
    aliases: ['reef', 'reef 2'],
    match: /\breef(?:\s*2)?\b/i,
    directUrl: sc('silver-cross-reef-2-foldable-stroller'),
  },
  {
    model: 'Cove 2',
    productType: 'full-size stroller',
    sharedAdapter: true,
    aliases: ['cove 2'],
    match: /\bcove\s*2\b/i,
    directUrl: sc('cove-2-full-size-stroller'),
  },
  {
    model: 'Breez',
    productType: 'compact stroller',
    sharedAdapter: true,
    aliases: ['breez'],
    match: /\bbreez\b/i,
    directUrl: sc('breez-compact-stroller'),
  },
  {
    model: 'Nia',
    productType: 'travel stroller',
    sharedAdapter: true,
    aliases: ['nia', 'nia travel'],
    match: /\bnia\b/i,
    directUrl: sc('nia-compact-folding-traveling-stroller'),
  },
  {
    model: 'Clic',
    productType: 'travel stroller',
    sharedAdapter: false,
    aliases: ['clic', 'clic compact'],
    match: /\bclic\b/i,
  },
  {
    model: 'Jet Double',
    productType: 'double stroller',
    sharedAdapter: true,
    aliases: ['jet double'],
    match: /\bjet\b.*\bdouble\b|\bdouble\b.*\bjet\b/i,
  },
  {
    model: 'Wave',
    productType: 'single-to-double stroller',
    sharedAdapter: true,
    aliases: ['wave'],
    match: /\bwave\b(?!\s*3)/i,
    directUrl: sc('wave-3-single-to-double-stroller'),
  },
  {
    model: 'Wave 3',
    productType: 'single-to-double stroller',
    sharedAdapter: true,
    aliases: ['wave 3', 'wave 3 single to double'],
    match: /\bwave\s*3\b/i,
    directUrl: sc('wave-3-single-to-double-stroller'),
  },
];

const SHARED_SEAT_BRANDS = ['Nuna', 'Cybex', 'Clek', 'Maxi-Cosi'];
const CLIC_SEAT_BRANDS = ['Nuna', 'Joie'];
const CATALOG_PROVIDERS = ['babylist_impact', 'shopify_macrobaby', 'manual_tmbc'];

function normalize(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slug(value: string) {
  return normalize(value).replace(/\s+/g, '-');
}

function label(row: Pick<StrollerRow, 'brand' | 'model' | 'displayName'>) {
  return row.displayName || `${row.brand} ${row.model}`.replace(/\s+/g, ' ').trim();
}

function isClicCompatibleSeat(seat: SeatRow) {
  const brand = normalize(seat.brand);
  const text = normalize(`${seat.model} ${seat.displayName ?? ''}`);
  if (brand === 'nuna') return /\bpipa\b/.test(text);
  if (brand === 'joie') return /\bmint\b/.test(text) && /\blatch\b/.test(text);
  return false;
}

function bestImageProduct(products: ProductRow[]) {
  return products.find((product) => product.imageUrl) ?? products[0] ?? null;
}

function isStrollerProduct(product: ProductRow) {
  const text = `${product.title} ${product.enrichment?.canonicalName ?? ''}`;
  return /\bstroller\b/i.test(text) && !/\b(car\s*seat|adapter|adaptors?|rain\s*cover|snack\s*tray|cup\s*holder|organizer|bag)\b/i.test(text);
}

function productMatchesTarget(product: ProductRow, target: TargetStroller) {
  const text = `${product.title} ${product.enrichment?.canonicalName ?? ''}`;
  return isStrollerProduct(product) && target.match.test(text);
}

async function loadSeats(brands: string[]) {
  return db.carSeat.findMany({
    where: {
      seatType: 'INFANT',
      OR: brands.map((brand) => ({ brand: { equals: brand, mode: 'insensitive' } })),
    },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  }) as Promise<SeatRow[]>;
}

async function ensureTargetStroller(
  target: TargetStroller,
  allRows: StrollerRow[],
  claimedIds: Set<string>,
  apply: boolean,
) {
  const exact = allRows.find((row) => normalize(row.model) === normalize(target.model));
  if (exact) {
    claimedIds.add(exact.id);
    return exact;
  }

  const alias = allRows.find((row) => target.aliases.includes(normalize(row.model)) && !claimedIds.has(row.id));
  if (alias) {
    claimedIds.add(alias.id);
    if (apply) {
      await db.stroller.update({
        where: { id: alias.id },
        data: { model: target.model, displayName: `Silver Cross ${target.model}` },
      });
    }
    return { ...alias, model: target.model, displayName: `Silver Cross ${target.model}` };
  }

  if (!apply) {
    return {
      id: `(would-create-${slug(target.model)})`,
      brand: 'Silver Cross',
      model: target.model,
      displayName: `Silver Cross ${target.model}`,
    };
  }

  const created = await db.stroller.create({
    data: {
      brand: 'Silver Cross',
      model: target.model,
      displayName: `Silver Cross ${target.model}`,
    },
    select: { id: true, brand: true, model: true, displayName: true },
  });
  claimedIds.add(created.id);
  return created as StrollerRow;
}

async function promoteCatalogTarget(target: TargetStroller, products: ProductRow[], apply: boolean) {
  const matches = products.filter((product) => productMatchesTarget(product, target));
  const coreMatches = matches.filter((product) => product.provider !== 'impact_goodbuygear');
  const source = bestImageProduct(coreMatches.length ? coreMatches : matches);

  const chosenExact = coreMatches.find((product) => product.provider === 'babylist_impact');
  if (chosenExact && apply) {
    await db.productEnrichment.upsert({
      where: { rawProductId: chosenExact.id },
      update: {
        canonicalBrand: 'Silver Cross',
        canonicalName: target.model,
        tmbcCategory: 'Strollers',
        productType: target.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
        visibility: 'public',
      },
      create: {
        rawProductId: chosenExact.id,
        canonicalBrand: 'Silver Cross',
        canonicalName: target.model,
        tmbcCategory: 'Strollers',
        productType: target.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
        visibility: 'public',
      },
    });
  }

  if (target.directUrl && apply) {
    const externalId = `tmbc-silver-cross-${slug(target.model)}`;
    const manual = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'manual_tmbc', externalId } },
      update: {
        brand: 'Silver Cross',
        title: `Silver Cross ${target.model}`,
        affiliateUrl: target.directUrl,
        productUrl: target.directUrl,
        imageUrl: source?.imageUrl ?? undefined,
        price: source?.price ?? undefined,
        retailer: 'Silver Cross',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: 'manual_tmbc',
        externalId,
        brand: 'Silver Cross',
        title: `Silver Cross ${target.model}`,
        affiliateUrl: target.directUrl,
        productUrl: target.directUrl,
        imageUrl: source?.imageUrl ?? null,
        price: source?.price ?? null,
        retailer: 'Silver Cross',
        isActiveInFeed: true,
      },
      select: { id: true },
    });
    await db.productEnrichment.upsert({
      where: { rawProductId: manual.id },
      update: {
        canonicalBrand: 'Silver Cross',
        canonicalName: target.model,
        tmbcCategory: 'Strollers',
        productType: target.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
        visibility: 'public',
      },
      create: {
        rawProductId: manual.id,
        canonicalBrand: 'Silver Cross',
        canonicalName: target.model,
        tmbcCategory: 'Strollers',
        productType: target.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
        visibility: 'public',
      },
    });
  }

  return {
    matchedCatalogProducts: matches.length,
    promotedBabylistProduct: chosenExact?.title ?? null,
    manualFallback: target.directUrl ? `manual_tmbc:tmbc-silver-cross-${slug(target.model)}` : null,
  };
}

async function replaceCompatibility(stroller: StrollerRow, seats: SeatRow[], target: TargetStroller, apply: boolean) {
  const existing = await db.compatibility.count({ where: { strollerId: stroller.id } });
  if (!apply || stroller.id.startsWith('(would-create-')) {
    return { existing, created: seats.length };
  }

  await db.compatibility.deleteMany({ where: { strollerId: stroller.id } });
  await db.compatibility.createMany({
    data: seats.map((seat) => ({
      strollerId: stroller.id,
      carSeatId: seat.id,
      compatibilityType: target.sharedAdapter ? 'ADAPTER' : 'DIRECT',
      adapterRequired: target.sharedAdapter,
      adapterType: target.sharedAdapter
        ? 'Silver Cross car seat adapter (model-specific, sold separately)'
        : null,
      confidence: 'HIGH',
      notes: target.sharedAdapter
        ? `Silver Cross ${target.model} accepts ${seat.brand} infant car seats via a model-specific Silver Cross car seat adapter.`
        : `Silver Cross Clic clicks directly onto ${seat.brand} ${seat.model} — no adapter needed.`,
    })),
    skipDuplicates: true,
  });

  return { existing, created: seats.length };
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Silver Cross compatibility correction ── (${apply ? 'apply' : 'dry-run'})\n`);

  const [strollers, sharedSeats, clicCandidateSeats, catalogProducts] = await Promise.all([
    db.stroller.findMany({
      where: { brand: { startsWith: 'Silver Cross', mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    }) as Promise<StrollerRow[]>,
    loadSeats(SHARED_SEAT_BRANDS),
    loadSeats(CLIC_SEAT_BRANDS),
    db.affiliateCatalogProduct.findMany({
      where: {
        provider: { in: CATALOG_PROVIDERS },
        brand: { startsWith: 'Silver Cross', mode: 'insensitive' },
        isActiveInFeed: true,
      },
      select: {
        id: true,
        provider: true,
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        retailer: true,
        enrichment: {
          select: { canonicalName: true, reviewStatus: true, isPublic: true, needsReview: true },
        },
      },
    }) as Promise<ProductRow[]>,
  ]);
  const clicSeats = clicCandidateSeats.filter(isClicCompatibleSeat);

  console.log(`  Existing Silver Cross stroller rows: ${strollers.length}`);
  console.log(`  Shared-adapter seats: ${sharedSeats.length} (${SHARED_SEAT_BRANDS.join(', ')})`);
  console.log(`  Clic direct-fit seats: ${clicSeats.length} (Nuna PIPA-series + Joie Mint Latch)\n`);

  const claimedIds = new Set<string>();
  let targetRows = 0;
  let compatibilityRowsToCreate = 0;

  for (const target of TARGETS) {
    const stroller = await ensureTargetStroller(target, strollers, claimedIds, apply);
    const seats = target.sharedAdapter ? sharedSeats : clicSeats;
    const compat = await replaceCompatibility(stroller, seats, target, apply);
    const catalog = await promoteCatalogTarget(target, catalogProducts, apply);
    targetRows += 1;
    compatibilityRowsToCreate += seats.length;

    console.log(
      `  ${target.model}: ${stroller.id} | clear ${compat.existing}, add ${compat.created} ` +
        `${target.sharedAdapter ? 'ADAPTER' : 'DIRECT'} | catalog matches ${catalog.matchedCatalogProducts}` +
        `${catalog.promotedBabylistProduct ? ` | Babylist ${catalog.promotedBabylistProduct}` : ''}` +
        `${catalog.manualFallback ? ` | ${catalog.manualFallback}` : ''}`,
    );
  }

  const nonTargetRows = strollers.filter((row) => !claimedIds.has(row.id));
  const nonTargetIds = nonTargetRows.map((row) => row.id);
  const nonTargetCompat = nonTargetIds.length
    ? await db.compatibility.count({ where: { strollerId: { in: nonTargetIds } } })
    : 0;
  console.log(`\n  Non-target Silver Cross stroller rows to clear: ${nonTargetRows.length}`);
  for (const row of nonTargetRows) console.log(`    - ${label(row)} (${row.id})`);

  if (apply && nonTargetIds.length) {
    await db.compatibility.deleteMany({ where: { strollerId: { in: nonTargetIds } } });
  }

  console.log('\nSummary');
  console.log(`  target strollers: ${targetRows}`);
  console.log(`  target compatibility rows ${apply ? 'created' : 'to create'}: ${compatibilityRowsToCreate}`);
  console.log(`  non-target compatibility rows ${apply ? 'cleared' : 'to clear'}: ${nonTargetCompat}`);
  if (!apply) console.log('\n  (dry run — no database writes.)');
}

main()
  .catch((error) => {
    console.error('[fixSilverCrossCompatibility] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
