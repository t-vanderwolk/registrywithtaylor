/**
 * Scan all new/open-box catalogs (Babylist, ANB Baby, MacroBaby, GoodBuyGear) for car-seat ADAPTER products, parse
 * each adapter's stroller (brand + model) and the infant-seat brands it names,
 * and map that onto the travel-system Compatibility graph.
 *
 * Matching uses the DB's own vocabulary (no fragile free-text parsing):
 *   - stroller side: a Stroller row whose model string appears in the adapter
 *     title (e.g. "VISTA V2" in "UPPAbaby VISTA V2 adapter").
 *   - seat side: every INFANT CarSeat whose brand is named in the adapter title
 *     (Maxi-Cosi / Nuna / CYBEX / Clek / Britax / Chicco / …).
 * Each (stroller × seat) pair becomes an ADAPTER Compatibility row carrying the
 * adapter's image / affiliate URL / price.
 *
 * Safe by construction: only CREATES missing rows and only PRUNES previously
 * generated rows whose adapter title no longer supports the stroller/seat match.
 * Hand-curated compatibility rows are never modified.
 *
 *   npx tsx scripts/scanAdapterCompatibility.ts          # dry-run report (default)
 *   npx tsx scripts/scanAdapterCompatibility.ts --apply  # write new rows
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:scan-adapters
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prismaBase from '@/lib/server/prisma';
import { adapterTitleMatchesStrollerModel } from '@/lib/catalog/adapterModelMatching';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Catalogs: Babylist (Impact), ANB Baby (Awin), MacroBaby (Shopify), GoodBuyGear (Impact).
const PROVIDERS = ['babylist_impact', 'awin_anbbaby', 'shopify_macrobaby', 'impact_goodbuygear'];
const REPORT_JSON = 'reports/adapter-compatibility-scan.json';
const REPORT_CSV = 'reports/adapter-compatibility-scan.csv';

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function seatBrandSearchText(title: string, adapterBrand: string | null | undefined) {
  let text = title;
  const brand = canonicalBrand(adapterBrand).trim();
  if (brand) {
    const brandPattern = brand
      .split(/\s+/)
      .map(escapeRegExp)
      .join('[-\\s]+');
    text = text.replace(new RegExp(`^\\s*${brandPattern}\\s*[-:–—]?\\s*`, 'i'), '');
  }
  return text;
}

function seatBrandsInTitle(title: string, adapterBrand: string | null | undefined): string[] {
  const text = seatBrandSearchText(title, adapterBrand);
  const found = new Set<string>();
  for (const { brand, res } of SEAT_BRAND_ALIASES) {
    if (res.some((re) => re.test(text))) found.add(brand);
  }
  if (canonicalBrand(adapterBrand) !== 'UPPAbaby' && /\buppababy\b/i.test(text)) {
    found.add('UPPAbaby');
  }
  return [...found];
}

type AdapterRow = {
  brand: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  price: number | null;
  provider: string;
};
type StrollerRow = { id: string; brand: string; model: string };
type SeatRow = { id: string; brand: string; model: string };
type StrollerMatch = { stroller: StrollerRow; matchedModel: string };
type SeatMatch = { seat: SeatRow; matchedModel: string };

const CAR_SEAT_GENERIC_WORDS = /\b(infant|car|seat|seats|safezone|sensorsafe|sensor safe)\b/g;
const CAR_SEAT_DISTINGUISHING_TOKEN_RE =
  /^(?:v?\d+|g\d+|lx|rx|aire|air|lite|urbn|max|plus|pro|luxe|xp|ap|nxt|swivel|one|shield|comfort|extend|180|30|35)$/i;

function csvEscape(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string | null | undefined) {
  return normalizeText(value).split(' ').filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function contiguousIndex(haystack: string[], needle: string[]) {
  if (!needle.length || needle.length > haystack.length) return -1;
  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    let matches = true;
    for (let j = 0; j < needle.length; j += 1) {
      if (haystack[i + j] !== needle[j]) {
        matches = false;
        break;
      }
    }
    if (matches) return i;
  }
  return -1;
}

function stripCarSeatBrand(model: string, brand: string) {
  const modelTokens = tokens(model);
  const brandTokens = tokens(brand);
  if (brandTokens.length && contiguousIndex(modelTokens, brandTokens) === 0) {
    return modelTokens.slice(brandTokens.length).join(' ');
  }
  return modelTokens.join(' ');
}

function carSeatModelCandidates(seat: SeatRow) {
  const withoutBrand = stripCarSeatBrand(seat.model, seat.brand)
    .replace(CAR_SEAT_GENERIC_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const full = normalizeText(seat.model)
    .replace(CAR_SEAT_GENERIC_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return unique([withoutBrand, full]).filter((candidate) => tokens(candidate).length > 0);
}

function carSeatPhraseMatches(textTokens: string[], phrase: string) {
  const phraseTokens = tokens(phrase);
  if (phraseTokens.length === 0) return false;
  const index = contiguousIndex(textTokens, phraseTokens);
  if (index < 0) return false;

  const nextTextToken = textTokens[index + phraseTokens.length];
  if (nextTextToken && CAR_SEAT_DISTINGUISHING_TOKEN_RE.test(nextTextToken)) return false;

  return true;
}

function adapterTextMatchesCarSeat(text: string, seat: SeatRow): SeatMatch | null {
  const textTokens = tokens(text);
  if (!textTokens.length) return null;
  const brandTokens = tokens(seat.brand);
  if (brandTokens.length && contiguousIndex(textTokens, brandTokens) < 0) return null;

  for (const candidate of carSeatModelCandidates(seat)) {
    if (!carSeatPhraseMatches(textTokens, candidate)) continue;
    return { seat, matchedModel: candidate };
  }

  return null;
}

function titleBrandSeatMatches(title: string, adapterBrand: string | null | undefined, seats: SeatRow[]) {
  const titleBrands = seatBrandsInTitle(title, adapterBrand);
  if (!titleBrands.length) return null;
  const titleBrandKeys = new Set(titleBrands.map((brand) => canonicalBrand(brand)));
  return seats
    .filter((seat) => titleBrandKeys.has(canonicalBrand(seat.brand)))
    .map<SeatMatch>((seat) => ({ seat, matchedModel: canonicalBrand(seat.brand) }));
}

function generatedRowHasExplicitSeatBrandMismatch(row: {
  adapterType: string | null;
  stroller: StrollerRow;
  carSeat: SeatRow;
}) {
  const adapterTitle = row.adapterType ?? '';
  const titleBrands = seatBrandsInTitle(adapterTitle, row.stroller.brand);
  if (!titleBrands.length) return false;
  const titleBrandKeys = new Set(titleBrands.map((brand) => canonicalBrand(brand)));
  return !titleBrandKeys.has(canonicalBrand(row.carSeat.brand));
}

function writeReports({
  totals,
  parsedAdapters,
  newCompatibilityRows,
  existingGeneratedRowsWithoutModelMatch,
}: {
  totals: Record<string, number>;
  parsedAdapters: Array<{ title: string; strollers: string[]; seatBrands: string[] }>;
  newCompatibilityRows: Array<{
    stroller: string;
    carSeat: string;
    adapterTitle: string;
    provider: string;
    adapterUrl: string | null;
    adapterPrice: number | null;
  }>;
  existingGeneratedRowsWithoutModelMatch: Array<{
    id: string;
    stroller: string;
    carSeat: string;
    adapterTitle: string;
  }>;
}) {
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(
    resolve(process.cwd(), REPORT_JSON),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totals,
        parsedAdapters,
        newCompatibilityRows,
        existingGeneratedRowsWithoutCurrentAdapterMatch: existingGeneratedRowsWithoutModelMatch,
      },
      null,
      2,
    )}\n`,
  );
  const lines = [
    ['stroller', 'carSeat', 'adapterTitle', 'provider', 'adapterUrl', 'adapterPrice'].join(','),
    ...newCompatibilityRows.map((row) => [
      row.stroller,
      row.carSeat,
      row.adapterTitle,
      row.provider,
      row.adapterUrl,
      row.adapterPrice,
    ].map(csvEscape).join(',')),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${lines.join('\n')}\n`);
}

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
    select: { brand: true, title: true, description: true, imageUrl: true, affiliateUrl: true, price: true, provider: true },
  });

  const strollers: StrollerRow[] = await db.stroller.findMany({ select: { id: true, brand: true, model: true } });
  const seats: SeatRow[] = await db.carSeat.findMany({
    where: { seatType: 'INFANT' },
    select: { id: true, brand: true, model: true },
  });

  type Pair = { stroller: StrollerRow; seat: SeatRow; adapter: AdapterRow };
  const pairs: Pair[] = [];
  const seenPair = new Set<string>();
  let adaptersWithStroller = 0;
  let adaptersWithSeatBrand = 0;
  const report: Array<{ title: string; strollers: string[]; seatBrands: string[] }> = [];

  for (const a of adapters) {
    const title = a.title || '';
    const adapterSeatText = [title, a.description].filter(Boolean).join(' ');

    const strollerMatches: StrollerMatch[] = strollers
      .map((stroller) => ({ stroller, match: adapterTitleMatchesStrollerModel(title, stroller.model, stroller.brand) }))
      .filter(({ match }) => match.matched)
      .map(({ stroller, match }) => ({ stroller, matchedModel: match.matchedModel ?? stroller.model }));
    const seatMatches: SeatMatch[] =
      titleBrandSeatMatches(title, a.brand, seats) ??
      seats
        .map((seat) => adapterTextMatchesCarSeat(adapterSeatText, seat))
        .filter((match): match is SeatMatch => Boolean(match));
    const seatBrands = unique(seatMatches.map(({ seat }) => canonicalBrand(seat.brand)));

    if (strollerMatches.length) adaptersWithStroller += 1;
    if (seatMatches.length) adaptersWithSeatBrand += 1;
    report.push({
      title,
      strollers: strollerMatches.map(({ stroller, matchedModel }) => `${stroller.brand} ${stroller.model} [model: ${matchedModel}]`),
      seatBrands,
    });

    for (const { stroller } of strollerMatches) {
      for (const { seat } of seatMatches) {
        const key = `${stroller.id}:::${seat.id}`;
        if (seenPair.has(key)) continue;
        seenPair.add(key);
        pairs.push({ stroller, seat, adapter: a });
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
  const generatedCompatibilityRows: Array<{
    id: string;
    adapterType: string | null;
    stroller: StrollerRow;
    carSeat: SeatRow;
  }> = await db.compatibility.findMany({
    where: { notes: { startsWith: 'Inferred from the catalog adapter' } },
    select: {
      id: true,
      adapterType: true,
      stroller: { select: { id: true, brand: true, model: true } },
      carSeat: { select: { id: true, brand: true, model: true } },
    },
  });
  const existingGeneratedRowsWithoutModelMatch = generatedCompatibilityRows
    .filter((row) => {
      const strollerMatches = adapterTitleMatchesStrollerModel(
        row.adapterType ?? '',
        row.stroller.model,
        row.stroller.brand,
      ).matched;
      return !strollerMatches || generatedRowHasExplicitSeatBrandMismatch(row);
    })
    .map((row) => ({
      id: row.id,
      stroller: `${row.stroller.brand} ${row.stroller.model}`,
      carSeat: `${row.carSeat.brand} ${row.carSeat.model}`,
      adapterTitle: row.adapterType ?? '',
    }));
  const newCompatibilityRows = toCreate.map((p) => ({
    stroller: `${p.stroller.brand} ${p.stroller.model}`,
    carSeat: `${p.seat.brand} ${p.seat.model}`,
    adapterTitle: p.adapter.title,
    provider: p.adapter.provider,
    adapterUrl: p.adapter.affiliateUrl ?? null,
    adapterPrice: p.adapter.price ?? null,
  }));
  const totals = {
    adapterProducts: adapters.length,
    adaptersWithMatchedStroller: adaptersWithStroller,
    adaptersNamingSeatBrand: adaptersWithSeatBrand,
    strollerRows: strollers.length,
    infantCarSeatRows: seats.length,
    candidatePairs: pairs.length,
    newToWrite: toCreate.length,
    alreadyPresent: pairs.length - toCreate.length,
    existingGeneratedRowsWithoutCurrentAdapterMatch: existingGeneratedRowsWithoutModelMatch.length,
    generatedRowsToPrune: existingGeneratedRowsWithoutModelMatch.length,
  };
  writeReports({
    totals,
    parsedAdapters: report,
    newCompatibilityRows,
    existingGeneratedRowsWithoutModelMatch,
  });

  console.log('── Scan catalog adapters → model-specific compatibility ──');
  console.log(
    `  adapter products: ${adapters.length}   with a matched stroller: ${adaptersWithStroller}   naming a seat brand: ${adaptersWithSeatBrand}`,
  );
  console.log(`  Stroller rows: ${strollers.length}   infant CarSeat rows: ${seats.length}`);
  console.log(
    `  candidate (stroller × seat) pairs: ${pairs.length}   new to write: ${toCreate.length}   already present: ${pairs.length - toCreate.length}\n`,
  );
  console.log(`  existing generated rows without current adapter match: ${existingGeneratedRowsWithoutModelMatch.length}`);
  console.log(`  reports: ${REPORT_JSON}, ${REPORT_CSV}\n`);

  console.log('  sample parse (adapter title → strollers | seat brands):');
  report
    .filter((r) => r.strollers.length || r.seatBrands.length)
    .slice(0, 30)
    .forEach((r) => {
      console.log(`    • ${r.title}`);
      console.log(`        strollers: ${r.strollers.join(', ') || '—'}    seats: ${r.seatBrands.join(', ') || '—'}`);
    });
  if (newCompatibilityRows.length) {
    console.log('\n  new compatibility rows to write:');
    newCompatibilityRows.slice(0, 50).forEach((row) => {
      console.log(`    • ${row.stroller} × ${row.carSeat}`);
      console.log(`        adapter: ${row.adapterTitle}`);
    });
  }
  if (existingGeneratedRowsWithoutModelMatch.length) {
    console.log('\n  existing generated rows whose adapter title no longer supports the stroller/seat match:');
    existingGeneratedRowsWithoutModelMatch.slice(0, 50).forEach((row) => {
      console.log(`    • ${row.stroller} × ${row.carSeat}`);
      console.log(`        adapter: ${row.adapterTitle}`);
    });
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Review the parse above, then re-run with --apply.)');
    return;
  }

  let pruned = 0;
  const idsToPrune = existingGeneratedRowsWithoutModelMatch.map((row) => row.id);
  if (idsToPrune.length) {
    const result = await db.compatibility.deleteMany({
      where: {
        id: { in: idsToPrune },
        notes: { startsWith: 'Inferred from the catalog adapter' },
      },
    });
    pruned = result.count ?? idsToPrune.length;
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
  console.log(`\n  Pruned ${pruned} generated adapter rows without current adapter matches.`);
  console.log(`  Created ${written} ADAPTER compatibility rows.`);
}

main()
  .catch((error) => {
    console.error('[scanAdapterCompatibility] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
