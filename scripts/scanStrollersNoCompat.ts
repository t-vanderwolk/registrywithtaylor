/**
 * Find strollers the travel-system checker shows NO compatible car seats for,
 * then bucket them so you can act:
 *   - DUPLICATES: a same-brand stroller WITH compatibility whose model overlaps
 *     (e.g. "Fox 5 Renew Complete" ≈ "Fox 5") — merge/remove the variant.
 *   - same-brand-default saved: brand still shows its own seats (not empty).
 *   - TRULY EMPTY: no rows, no duplicate, no same-brand default — needs compat.
 *
 * Report only — no writes.
 *
 *   npx tsx scripts/scanStrollersNoCompat.ts
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:scan-orphan-strollers
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Brands whose strollers show their own car seats even with no explicit row
// (mirrors DIRECT_DEFAULT_BRANDS in lib/server/travelSystemCompatibility.ts).
const SAME_BRAND_DEFAULT = new Set(['cybex', 'joie', 'nuna', 'orbit baby', 'peg perego', 'romer', 'uppababy']);
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

type Row = { id: string; brand: string; model: string };

async function main() {
  const strollers: Row[] = await db.stroller.findMany({ select: { id: true, brand: true, model: true } });
  const compat: Array<{ strollerId: string }> = await db.compatibility.findMany({ select: { strollerId: true } });

  const compatCount = new Map<string, number>();
  for (const c of compat) compatCount.set(c.strollerId, (compatCount.get(c.strollerId) ?? 0) + 1);

  const withCompat = strollers.filter((s) => (compatCount.get(s.id) ?? 0) > 0);
  const orphans = strollers.filter((s) => (compatCount.get(s.id) ?? 0) === 0);

  const compatByBrand = new Map<string, Row[]>();
  for (const s of withCompat) {
    const b = canonicalBrand(s.brand).toLowerCase();
    (compatByBrand.get(b) ?? compatByBrand.set(b, []).get(b)!).push(s);
  }

  const dupes: Array<{ orphan: Row; match: Row }> = [];
  const sameBrandSaved: Row[] = [];
  const trulyEmpty: Row[] = [];

  for (const o of orphans) {
    const b = canonicalBrand(o.brand).toLowerCase();
    const om = squash(o.model);
    const match = (compatByBrand.get(b) ?? []).find((c) => {
      const cm = squash(c.model);
      return cm.length >= 3 && om.length >= 3 && (om.includes(cm) || cm.includes(om));
    });
    if (match) dupes.push({ orphan: o, match });
    else if (SAME_BRAND_DEFAULT.has(b)) sameBrandSaved.push(o);
    else trulyEmpty.push(o);
  }

  console.log('── Strollers with NO compatible car seats ──');
  console.log(
    `  total strollers: ${strollers.length}   with explicit compatibility: ${withCompat.length}   orphans (0 rows): ${orphans.length}\n`,
  );

  console.log(`  likely DUPLICATES of a matched stroller (${dupes.length}) — merge/remove the variant:`);
  dupes
    .sort((a, b) => a.orphan.brand.localeCompare(b.orphan.brand))
    .forEach(({ orphan, match }) =>
      console.log(`    "${orphan.brand} ${orphan.model}"  ≈  "${match.brand} ${match.model}"  (${compatCount.get(match.id)} matches)`),
    );

  console.log(`\n  saved by same-brand default — these still show their own seats (${sameBrandSaved.length}):`);
  sameBrandSaved.forEach((s) => console.log(`    ${s.brand} ${s.model}`));

  console.log(`\n  TRULY EMPTY — no compat, no duplicate, no same-brand default (${trulyEmpty.length}) — add compatibility:`);
  trulyEmpty
    .sort((a, b) => a.brand.localeCompare(b.brand))
    .forEach((s) => console.log(`    ${s.brand} ${s.model}`));

  console.log('\n  (report only — merge/remove duplicates or add compatibility as you see fit.)');
}

main()
  .catch((error) => {
    console.error('[scanStrollersNoCompat] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
