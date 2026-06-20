/**
 * List Babylist catalogue candidates by keyword — from the cached
 * BabylistCatalogItem table — so you can pick products to feature in the
 * academy preview lessons (Nursery Foundations, Art of the Registry, etc.).
 *
 *   npx tsx scripts/listCatalogCandidates.ts                          # default nursery/registry set
 *   npx tsx scripts/listCatalogCandidates.ts crib bassinet monitor   # your own keywords
 *   npx tsx scripts/listCatalogCandidates.ts --limit=20 "convertible crib"
 *   npx tsx scripts/listCatalogCandidates.ts --all glider            # include items with no price
 *
 * Requires the catalogue cache to be populated first:
 *   npx tsx scripts/cacheBabylistCatalog.ts
 *
 * Prints to the console and also writes scripts/output/catalog-candidates-<ts>.md
 * (with product URLs) for easy browsing.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_KEYWORDS = [
  'convertible crib', 'mini crib', 'bassinet', 'crib mattress', 'glider',
  'dresser', 'changing pad', 'baby monitor', 'sound machine', 'diaper pail',
  'humidifier', 'night light', 'baby carrier', 'swaddle', 'diaper bag',
];

function parseArgs(argv: string[]) {
  const keywords: string[] = [];
  let limit = 12;
  let requirePrice = true;
  for (const arg of argv) {
    if (arg.startsWith('--limit=')) limit = Number.parseInt(arg.slice(8), 10) || limit;
    else if (arg === '--all') requirePrice = false;
    else keywords.push(arg);
  }
  return { keywords: keywords.length ? keywords : DEFAULT_KEYWORDS, limit, requirePrice };
}

type Row = { sku: string; name: string; manufacturer: string | null; price: number | null; url: string };

async function search(kw: string, limit: number, requirePrice: boolean): Promise<Row[]> {
  return prisma.babylistCatalogItem
    .findMany({
      where: {
        AND: [
          requirePrice ? { price: { not: null } } : {},
          {
            OR: [
              { name: { contains: kw, mode: 'insensitive' } },
              { manufacturer: { contains: kw, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: { name: 'asc' },
      take: limit,
      select: { sku: true, name: true, manufacturer: true, price: true, url: true },
    })
    .catch(() => [] as Row[]);
}

async function main() {
  const { keywords, limit, requirePrice } = parseArgs(process.argv.slice(2));

  const total = await prisma.babylistCatalogItem.count().catch(() => 0);
  console.log(
    `Catalogue cache: ${total} items. ${keywords.length} keyword(s), up to ${limit} each${requirePrice ? ', priced only' : ''}.`,
  );
  if (total === 0) {
    console.log('Cache is empty — run:  npx tsx scripts/cacheBabylistCatalog.ts');
    return;
  }

  const md: string[] = [
    '# Babylist catalogue candidates',
    `_${total} items in cache · generated ${new Date().toISOString()}_`,
  ];

  for (const kw of keywords) {
    const items = await search(kw, limit, requirePrice);
    console.log(`\n══ ${kw.toUpperCase()} ══ (${items.length})`);
    md.push(`\n## ${kw}  (${items.length})\n`);
    if (items.length === 0) {
      console.log('  (no matches — try a different keyword)');
      md.push('_(no matches)_');
      continue;
    }
    for (const it of items) {
      const price = it.price != null ? `$${it.price.toFixed(2)}` : '—';
      console.log(`  [${it.sku}] ${price.padStart(8)}  ${it.name}${it.manufacturer ? `  ·  ${it.manufacturer}` : ''}`);
      md.push(`- **[${it.sku}]** ${price} — ${it.name}${it.manufacturer ? ` · ${it.manufacturer}` : ''}  \n  ${it.url}`);
    }
  }

  const dir = path.join(process.cwd(), 'scripts', 'output');
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `catalog-candidates-${Date.now()}.md`);
  writeFileSync(file, md.join('\n'));
  console.log(`\nWritten ${file}`);
  console.log('\nPick the ones you want, then send me their [SKU] (or brand + product name) and which preview (nursery / registry).');
}

main()
  .catch((error) => {
    console.error('[list-candidates] failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
