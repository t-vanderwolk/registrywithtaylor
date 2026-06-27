/**
 * Scan all new/open-box catalogs (Babylist, ANB Baby, MacroBaby, GoodBuyGear) for car-seat ADAPTER products, parse
 * each adapter's stroller (brand + model) and the infant-seat brands it names,
 * and map that onto the travel-system Compatibility graph.
 *
 * Matching uses the DB's own vocabulary (no fragile free-text parsing):
 *   - stroller side: a Stroller row of the adapter's brand whose model string
 *     appears in the adapter title (e.g. "VISTA" in "UPPAbaby VISTA adapter").
 *   - seat side: every INFANT CarSeat whose brand is named in the adapter title
 *     (Maxi-Cosi / Nuna / CYBEX / Clek / Britax / Chicco / …).
 * Each (stroller × seat) pair becomes an ADAPTER Compatibility row carrying the
 * adapter's image / affiliate URL / price.
 *
 * Safe by construction: only CREATES missing rows — existing (hand-curated)
 * compatibility rows are never modified.
 *
 *   npx tsx scripts/scanAdapterCompatibility.ts          # dry-run report (default)
 *   npx tsx scripts/scanAdapterCompatibility.ts --apply  # write new rows
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:scan-adapters
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Catalogs: Babylist (Impact), ANB Baby (Awin), MacroBaby (Shopify), GoodBuyGear (Impact).
const PROVIDERS = ['babylist_impact', 'awin_anbbaby', 'shopify_macrobaby', 'impact_goodbuygear'];

// Infant-seat brands an adapter might name, with the aliases that show up in titles.
const SEAT_BRAND_ALIASES: Array<{ brand: string; res: RegExp[] }> = [
  { brand: 'Maxi-Cosi', res: [/maxi[\s-]?cosi/i] },
  { brand: 'Nuna', res: [/\bnuna\b/i, /\bpipa\b/i] },
  { brand: 'Cybex', res: [/\bcybex\b/i, /\baton\b/i] },
  { brand: 'Clek', res: [/\bclek\b/i, /\bliing\b/i] },
  { brand: 'Britax', res: [/\bbritax\b/i, /\bb-?safe\b/i, /\bwillow\b/i] },
  { brand: 'Chicco', res: [/\bchicco\b/i, /keyfit/i, /fit2/i] },
  { brand: 'Graco', res: [/\bgraco\b/i, /snugride/i] },
  { brand: 'Peg Perego', res: [/peg[\s-]?perego/i, /primo\s?viaggio/i] },
  { brand: 'Joie', res: [/\bjoie\b/i] },
  // Only "Mesa" (the seat) — not the "UPPAbaby" brand word, which appears in every
  // UPPAbaby adapter title and would otherwise be a false positive.
  { brand: 'UPPAbaby', res: [/\bmesa\b/i] },
  { brand: 'BeSafe', res: [/\bbe-?safe\b/i] },
  { brand: 'Bugaboo', res: [/\bturtle\b/i] },
  { brand: 'Doona', res: [/\bdoona\b/i] },
  { brand: 'Evenflo', res: [/\bevenflo\b/i] },
  { brand: 'Silver Cross', res: [/silver ?cross/i] },
];

function seatBrandsInTitle(title: string): string[] {
  const found = new Set<string>();
  for (const { brand, res } of SEAT_BRAND_ALIASES) {
    if (res.some((re) => re.test(title))) found.add(brand);
  }
  return [...found];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// A model may carry a trailing descriptor the adapter title omits (e.g. the
// Stroller row "City Mini GT3 All-Terrain" vs the title's "City Mini GT3"). Try
// the full model and a core with those generic suffixes stripped.
function modelVariants(model: string): string[] {
  const full = norm(model);
  // Strip only generic descriptors that never distinguish one model from another.
  // NOT "single"/"double" — those separate the single from the double stroller.
  const core = full
    .replace(/\b(all terrain|stroller|complete|seat)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return core && core !== full ? [full, core] : [full];
}

type AdapterRow = {
  brand: string | null;
  title: string;
  imageUrl: string | null;
  affiliateUrl: string | null;
  price: number | null;
  provider: string;
};
type StrollerRow = { id: string; brand: string; model: string };
type SeatRow = { id: string; brand: string; model: string };

async function hasAffiliateCatalogProduct() {
  return db
    .$queryRawUnsafe("SELECT to_regclass('public.\"AffiliateCatalogProduct\"')::text AS exists")
    .then((rows: Array<{ exists: string | null }>) => Boolean(rows[0]?.exists))
    .catch(() => false);
}

async function main() {
  const apply = process.argv.includes('--apply');

  if (!(await hasAffiliateCatalogProduct())) {
    console.log('── Scan catalog adapters → model-specific compatibility ──');
    console.log('  AffiliateCatalogProduct table is not present in this database; skipping catalog-adapter audit.');
    return;
  }

  const adapters: AdapterRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      provider: { in: PROVIDERS },
      isActiveInFeed: true,
      title: { contains: 'adapter', mode: 'insensitive' },
      enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } },
    },
    select: { brand: true, title: true, imageUrl: true, affiliateUrl: true, price: true, provider: true },
  });

  const strollers: StrollerRow[] = await db.stroller.findMany({ select: { id: true, brand: true, model: true } });
  const seats: SeatRow[] = await db.carSeat.findMany({
    where: { seatType: 'INFANT' },
    select: { id: true, brand: true, model: true },
  });

  const seatsByBrand = new Map<string, SeatRow[]>();
  for (const s of seats) {
    const k = canonicalBrand(s.brand).toLowerCase();
    (seatsByBrand.get(k) ?? seatsByBrand.set(k, []).get(k)!).push(s);
  }

  type Pair = { stroller: StrollerRow; seat: SeatRow; adapter: AdapterRow };
  const pairs: Pair[] = [];
  const seenPair = new Set<string>();
  let adaptersWithStroller = 0;
  let adaptersWithSeatBrand = 0;
  const report: Array<{ title: string; strollers: string[]; seatBrands: string[] }> = [];

  for (const a of adapters) {
    const title = a.title || '';
    const aBrandCanon = canonicalBrand(a.brand).toLowerCase();
    const ntitle = norm(title);

    const strollerMatches = strollers.filter((st) => {
      if (canonicalBrand(st.brand).toLowerCase() !== aBrandCanon) return false;
      return modelVariants(st.model).some((m) => m.length >= 2 && ntitle.includes(m));
    });
    const seatBrands = seatBrandsInTitle(title);

    if (strollerMatches.length) adaptersWithStroller += 1;
    if (seatBrands.length) adaptersWithSeatBrand += 1;
    report.push({
      title,
      strollers: strollerMatches.map((s) => `${s.brand} ${s.model}`),
      seatBrands,
    });

    for (const st of strollerMatches) {
      for (const sb of seatBrands) {
        for (const seat of seatsByBrand.get(canonicalBrand(sb).toLowerCase()) ?? []) {
          const key = `${st.id}:::${seat.id}`;
          if (seenPair.has(key)) continue;
          seenPair.add(key);
          pairs.push({ stroller: st, seat, adapter: a });
        }
      }
    }
  }

  // Which candidate pairs already have a compatibility row (never touched).
  const strollerIds = [...new Set(pairs.map((p) => p.stroller.id))];
  const existing: Array<{ strollerId: string; carSeatId: string }> =
    strollerIds.length > 0
      ? await db.compatibility.findMany({
          where: { strollerId: { in: strollerIds } },
          select: { strollerId: true, carSeatId: true },
        })
      : [];
  const existingSet = new Set(existing.map((e) => `${e.strollerId}:::${e.carSeatId}`));
  const toCreate = pairs.filter((p) => !existingSet.has(`${p.stroller.id}:::${p.seat.id}`));

  console.log('── Scan catalog adapters → model-specific compatibility ──');
  console.log(
    `  adapter products: ${adapters.length}   with a matched stroller: ${adaptersWithStroller}   naming a seat brand: ${adaptersWithSeatBrand}`,
  );
  console.log(`  Stroller rows: ${strollers.length}   infant CarSeat rows: ${seats.length}`);
  console.log(
    `  candidate (stroller × seat) pairs: ${pairs.length}   new to write: ${toCreate.length}   already present: ${pairs.length - toCreate.length}\n`,
  );

  console.log('  sample parse (adapter title → strollers | seat brands):');
  report
    .filter((r) => r.strollers.length || r.seatBrands.length)
    .slice(0, 30)
    .forEach((r) => {
      console.log(`    • ${r.title}`);
      console.log(`        strollers: ${r.strollers.join(', ') || '—'}    seats: ${r.seatBrands.join(', ') || '—'}`);
    });

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Review the parse above, then re-run with --apply.)');
    return;
  }

  let written = 0;
  for (const p of toCreate) {
    const adapterType = (p.adapter.title || '').trim() || `${p.stroller.brand} car seat adapter`;
    await db.compatibility.create({
      data: {
        strollerId: p.stroller.id,
        carSeatId: p.seat.id,
        compatibilityType: 'ADAPTER',
        adapterRequired: true,
        adapterType,
        confidence: 'MEDIUM',
        adapterImage: p.adapter.imageUrl ?? null,
        adapterBabylistUrl: p.adapter.affiliateUrl ?? null,
        adapterPrice: p.adapter.price ?? null,
        adapterUpdatedAt: new Date(),
        notes: `Inferred from the catalog adapter "${adapterType}".`,
      },
    });
    written += 1;
  }
  console.log(`\n  Created ${written} ADAPTER compatibility rows (existing rows untouched).`);
}

main()
  .catch((error) => {
    console.error('[scanAdapterCompatibility] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
