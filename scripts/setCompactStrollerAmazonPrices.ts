/**
 * Add the manual Amazon price to the Thule Shine and Peg Perego City Loop cards
 * in blog-best-compact-strollers-2026 (their only retailer is Amazon, which
 * carries no price in the catalogue).
 *
 *   npx tsx scripts/setCompactStrollerAmazonPrices.ts            # dry run
 *   npx tsx scripts/setCompactStrollerAmazonPrices.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/setCompactStrollerAmazonPrices.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

// productName substring (squashed) -> "Price: $X via Amazon"
const PRICES: Array<{ match: RegExp; line: string; label: string }> = [
  { match: /shine/i, line: 'Price: $449.95 via Amazon', label: 'Thule Shine' },
  { match: /city ?loop/i, line: 'Price: $411.59 via Amazon', label: 'Peg Perego City Loop' },
];

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const lines: string[] = (post.content ?? '').split('\n');
  const notes: string[] = [];
  let changed = 0;

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i]?.trim() !== ':::catalog-product') continue;
    let end = -1;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j]?.trim() === ':::') {
        end = j;
        break;
      }
    }
    if (end === -1) continue;

    const productLine = lines.slice(i, end + 1).find((l) => /^product\s*:/i.test(l.trim())) ?? '';
    const product = productLine.slice(productLine.indexOf(':') + 1).trim();
    const spec = PRICES.find((p) => p.match.test(product));
    if (!spec) {
      i = end;
      continue;
    }

    const priceIdx = lines.slice(i, end + 1).findIndex((l) => /^price\s*:/i.test(l.trim()));
    if (priceIdx >= 0) {
      const abs = i + priceIdx;
      if (lines[abs].trim() === spec.line) {
        notes.push(`• ${spec.label}: already set — skipped.`);
      } else {
        lines[abs] = spec.line;
        changed += 1;
        notes.push(`• ${spec.label}: updated → ${spec.line}`);
      }
    } else {
      // Insert the price line just before the closing ::: fence.
      lines.splice(end, 0, spec.line);
      changed += 1;
      notes.push(`• ${spec.label}: added → ${spec.line}`);
    }
    i = end + 1;
  }

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.slug}`);
  console.log(`Prices set: ${changed}`);
  console.log('\n' + notes.join('\n'));

  if (changed === 0) {
    console.log('\nNothing to change.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: lines.join('\n') } });
  console.log(`\n✓ Applied. Set ${changed} price(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
