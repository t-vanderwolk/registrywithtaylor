/**
 * Read-only diagnostic: dump the full catalog state of every Nuna row whose
 * title mentions MIXX or Tavo, so we can see why "MIXX next" isn't surfacing in
 * the finder/checker (missing row? wrong category? needs-review? no retailer?).
 *
 * Does NOT change anything.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:audit-nuna-mixx
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Row = {
  provider: string;
  title: string;
  price: number | null;
  affiliateUrl: string | null;
  retailer: string | null;
  isActiveInFeed: boolean;
  enrichment: {
    tmbcCategory: string | null;
    productType: string | null;
    reviewStatus: string | null;
    needsReview: boolean | null;
    isPublic: boolean | null;
    canonicalName: string | null;
  } | null;
};

async function main() {
  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { contains: 'Nuna', mode: 'insensitive' },
      OR: [{ title: { contains: 'MIXX', mode: 'insensitive' } }, { title: { contains: 'Tavo', mode: 'insensitive' } }],
    },
    select: {
      provider: true, title: true, price: true, affiliateUrl: true, retailer: true, isActiveInFeed: true,
      enrichment: {
        select: { tmbcCategory: true, productType: true, reviewStatus: true, needsReview: true, isPublic: true, canonicalName: true },
      },
    },
    orderBy: { title: 'asc' },
  });

  console.log(`── Nuna MIXX / Tavo catalog rows: ${rows.length} ──\n`);
  for (const r of rows) {
    const e = r.enrichment;
    console.log(`• ${r.title}`);
    console.log(
      `    cat=${e?.tmbcCategory ?? '—'}  type=${e?.productType ?? '—'}  review=${e?.reviewStatus ?? '—'}  ` +
        `needsReview=${e?.needsReview ?? '—'}  public=${e?.isPublic ?? '—'}  active=${r.isActiveInFeed}  ` +
        `retailer=${r.retailer ?? r.provider}  link=${r.affiliateUrl ? 'yes' : 'NO'}  price=${r.price ?? '—'}`,
    );
  }
  if (rows.length === 0) console.log('  (No Nuna MIXX/Tavo rows exist in the catalog at all.)');
}

main()
  .catch((error) => {
    console.error('[auditNunaMixxTavo] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
