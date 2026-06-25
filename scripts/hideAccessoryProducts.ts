/**
 * Remove stroller accessories and travel-system / bundle listings from the
 * tools. These pollute the stroller finder/checker because Babylist files some
 * of them under stroller paths. Hidden = reversible: rows stay in the DB but
 * drop out of every tool, and a later import preserves HIDDEN.
 *
 * Targets (by title): sibling / second / rumble seat, cupholder, canopy,
 * bumper bar, rain cover, snack tray, piggyback board, bevvy, "Travel System"
 * bundles, and "[stroller] and [car seat]" bundles.
 *
 * NEVER touches the travel-system essentials we keep: infant car seats and
 * car-seat / stroller adapters (those legitimately contain "and" + "car seat",
 * e.g. "…Adapters for Maxi-Cosi, Nuna and Clek"). Protected two ways: by
 * enrichment.productType and by the word "adapter" in the title.
 *
 *   npx tsx scripts/hideAccessoryProducts.ts            # dry run (default)
 *   npx tsx scripts/hideAccessoryProducts.ts --apply    # hide them
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-accessories
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Travel-system essentials we always keep, even if a pattern matches.
const KEEPER_TYPES = new Set(['infant car seat', 'infant car seat adapter', 'stroller adapter']);

const PATTERNS: { label: string; re: RegExp }[] = [
  { label: 'sibling / second / rumble seat', re: /\bsibling\b|\bsecond seat\b|\brumble ?seat\b/i },
  { label: 'cupholder', re: /\bcup ?holders?\b/i },
  { label: 'canopy', re: /\bcanop(?:y|ies)\b/i },
  { label: 'bumper bar', re: /\bbumper ?bars?\b/i },
  { label: 'rain cover / shield', re: /\brain ?(?:cover|shield)s?\b/i },
  { label: 'snack tray', re: /\bsnack ?trays?\b/i },
  { label: 'piggyback board', re: /\bpiggy ?back\b/i },
  { label: 'bevvy', re: /\bbevvy\b/i },
  { label: 'frame / chassis (no seat)', re: /\bframe\b|\bchassis\b|car ?seat carrier|snap[- ]?n[- ]?go/i },
  { label: 'add-on / replacement seat', re: /\bseat unit\b|\btoddler seat\b|\bstroller seat\b|\bmain seat\b/i },
  { label: 'travel system bundle', re: /\btravel system\b/i },
  {
    label: 'stroller + car seat bundle',
    re: /(?:\band\b|&)[^\n]*\b(?:rue|latch|key ?fit|mesa|pipa|aton|nido|cabrio|infant car ?seat)\b/i,
  },
];

type Row = {
  id: string;
  title: string;
  enrichment: { id: string; productType: string | null; reviewStatus: string } | null;
};

function matchedLabels(title: string): string[] {
  return PATTERNS.filter((p) => p.re.test(title)).map((p) => p.label);
}

async function main() {
  const apply = process.argv.includes('--apply');

  const products: Row[] = await db.affiliateCatalogProduct.findMany({
    select: { id: true, title: true, enrichment: { select: { id: true, productType: true, reviewStatus: true } } },
  });

  const targets: (Row & { labels: string[] })[] = [];
  for (const p of products) {
    const pt = p.enrichment?.productType ?? '';
    if (KEEPER_TYPES.has(pt)) continue; // protect infant seats + adapters
    if (/\badapters?\b/i.test(p.title)) continue; // never touch adapter listings
    const labels = matchedLabels(p.title);
    if (labels.length === 0) continue;
    targets.push({ ...p, labels });
  }

  const toHide = targets.filter((t) => t.enrichment && t.enrichment.reviewStatus !== 'HIDDEN');
  const alreadyHidden = targets.filter((t) => t.enrichment?.reviewStatus === 'HIDDEN').length;
  const noEnrich = targets.filter((t) => !t.enrichment).length;

  const byLabel: Record<string, number> = {};
  toHide.forEach((t) => t.labels.forEach((l) => (byLabel[l] = (byLabel[l] ?? 0) + 1)));

  console.log('── Remove accessory / bundle products from the tools ──');
  console.log(
    `  matched: ${targets.length}   to hide now: ${toHide.length}   already hidden: ${alreadyHidden}   no-enrichment: ${noEnrich}`,
  );
  console.log('\n  to-hide by pattern:');
  Object.entries(byLabel)
    .sort((a, b) => b[1] - a[1])
    .forEach(([l, n]) => console.log(`    ${String(n).padStart(4)}  ${l}`));
  console.log('\n  to-hide titles (first 50):');
  toHide.slice(0, 50).forEach((t) => console.log(`    ${t.title.slice(0, 62)}  [${t.labels.join(', ')}]`));

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = toHide.map((t) => t.enrichment!.id);
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: ids } },
    data: { reviewStatus: 'HIDDEN', isPublic: false },
  });
  console.log(`\n  Hid ${res.count} accessory/bundle products (reversible).`);
}

main()
  .catch((error) => {
    console.error('[hideAccessoryProducts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
