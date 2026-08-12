/**
 * READ-ONLY. Cross-checks the "held" local /assets files (blog cover images,
 * editorial art, catalog product photos, the lead-magnet PDF) against the live
 * database, so we only delete ones that are genuinely unreferenced.
 *
 * The repo scan already proved none of these are referenced in CODE. The only
 * remaining place they could be used is the DB: blog post bodies + cover images,
 * guide content, and catalog imageUrl fields (admin-editable). This script pulls
 * every content/catalog row and searches the whole row for each filename, so it
 * doesn't depend on exact column names.
 *
 * It writes NOTHING. It prints two lists: KEEP (found in DB) and SAFE TO DELETE
 * (not found anywhere), plus ready-to-paste `git rm` commands for the safe set.
 *
 *   heroku run "npx tsx scripts/findUnusedHeldAssets.ts" -a registrywithtaylor
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// The 37 held files (repo paths). Basenames are what we search for in the DB.
const HELD: string[] = [
  'public/assets/car-seats/andi.png',
  'public/assets/car-seats/chiccokeyfit.png',
  'public/assets/car-seats/cloudtbase.png',
  'public/assets/car-seats/foonf.png',
  'public/assets/car-seats/pegagio.png',
  'public/assets/car-seats/pegviaggio.png',
  'public/assets/car-seats/pipaurbn.png',
  'public/assets/editorial/bunnynotebook.png',
  'public/assets/editorial/nurseryzones.png',
  'public/assets/editorial/ribbonbow-app-192.png',
  'public/assets/editorial/ribbonbow-app-512.png',
  'public/assets/editorial/ribbonbow-apple-180.png',
  'public/assets/editorial/ribbonbow.png',
  'public/assets/editorial/ribbonkey.png',
  'public/assets/editorial/step-2.png',
  'public/assets/editorial/step-3.png',
  'public/assets/editorial/tmbc-seal.png',
  'public/assets/editorial/toys-rainbow.png',
  'public/assets/editorial/ultrasound.png',
  'public/assets/editorial/vintagemom.png',
  'public/assets/journal/2026drops.png',
  'public/assets/journal/B8E2AEDF-5C05-4139-BA50-6D0C8B640383.png',
  'public/assets/journal/bears.png',
  'public/assets/journal/bears2.png',
  'public/assets/journal/bottlewasher.png',
  'public/assets/journal/lions.png',
  'public/assets/journal/panthers.png',
  'public/assets/journal/registryessencials.png',
  'public/assets/journal/saints.png',
  'public/assets/journal/silvercrossreef2cove2.png',
  'public/assets/journal/trivshowdown.png',
  'public/assets/journal/trvlvsviaa.png',
  'public/assets/journal/viking.png',
  'public/assets/strollers/indi.png',
  'public/assets/strollers/jetdouble.png',
  'public/assets/strollers/priam.png',
  'public/guides/tmbc-baby-prep-starter-guide.pdf',
];

// Prisma client models (camelCase) that hold content or image URLs. Missing
// models are skipped gracefully so schema drift doesn't crash the run.
const MODELS = [
  'post',
  'postImage',
  'media',
  'printableResource',
  'guide',
  'stroller',
  'strollerSpec',
  'carSeat',
  'compatibility',
  'affiliatePartner',
  'affiliateProgram',
  'brand',
  'babylistCatalogItem',
  'affiliateCatalogProduct',
  'productEnrichment',
  'blogPostAffiliate',
];

async function main() {
  // Accumulate one big haystack of every row's JSON, tagged by model, so we can
  // also report WHERE a filename was found.
  const found = new Map<string, Set<string>>(); // basename -> set of "model"
  for (const model of MODELS) {
    if (!db[model]?.findMany) {
      console.log(`  (skip: model "${model}" not in client)`);
      continue;
    }
    let rows: unknown[] = [];
    try {
      rows = await db[model].findMany();
    } catch (e) {
      console.log(`  (skip: ${model} query failed: ${(e as Error).message})`);
      continue;
    }
    const hay = JSON.stringify(rows);
    for (const p of HELD) {
      const base = p.split('/').pop() as string;
      if (hay.includes(base) || hay.includes(p.replace(/^public/, ''))) {
        if (!found.has(base)) found.set(base, new Set());
        found.get(base)!.add(`${model}(${rows.length})`);
      }
    }
    console.log(`  scanned ${model}: ${rows.length} rows`);
  }

  const keep: string[] = [];
  const del: string[] = [];
  for (const p of HELD) {
    const base = p.split('/').pop() as string;
    if (found.has(base)) keep.push(p);
    else del.push(p);
  }

  console.log('\n════════════════════════════════════════');
  console.log(`KEEP — referenced in the database (${keep.length}):`);
  for (const p of keep) {
    const base = p.split('/').pop() as string;
    console.log(`  ✓ ${p}   [${[...(found.get(base) || [])].join(', ')}]`);
  }

  console.log(`\nSAFE TO DELETE — not referenced anywhere (${del.length}):`);
  for (const p of del) console.log(`  ✗ ${p}`);

  if (del.length) {
    console.log('\nRun this locally to remove them, then commit:');
    console.log('  git rm ' + del.map((p) => `"${p}"`).join(' '));
  }

  console.log(
    '\nNote: keep public/guides/tmbc-baby-prep-starter-guide.pdf if it is your active lead magnet, even if it shows as unreferenced (it may be linked from a component or a not-yet-published post).',
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect?.());
