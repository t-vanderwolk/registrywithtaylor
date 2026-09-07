#!/usr/bin/env tsx
/**
 * Refresh local Amazon Creators API cache rows for TMBC product surfaces.
 *
 * Dry run:
 *   npm run amazon:sync-dry
 *   npm run amazon:sync-blog-dry
 *
 * Apply:
 *   npm run amazon:sync
 *   npm run amazon:sync-blog
 *
 * Controlled SearchItems lookup, for admin/backfill only:
 *   npm run amazon:search -- --search="Cybex Gazelle S stroller"
 */
import { AmazonCreatorsClient } from '@/lib/server/amazonCreators/client';
import { AMAZON_CREATORS_RESOURCES } from '@/lib/server/amazonCreators/constants';
import { normalizeAmazonItemsResponse } from '@/lib/server/amazonCreators/item';
import { runAmazonCreatorsSync, type AmazonSyncScope } from '@/lib/server/amazonCreators/sync';

type Args = {
  apply: boolean;
  force: boolean;
  limit: number | null;
  resolveShortLinks: boolean;
  scope: AmazonSyncScope;
  search: string | null;
};

function readArg(name: string) {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const scopeRaw = readArg('scope') ?? 'all';
  if (scopeRaw !== 'blog' && scopeRaw !== 'all') {
    throw new Error('Expected --scope=blog or --scope=all.');
  }

  const limitRaw = readArg('limit');
  const limit = limitRaw ? Number(limitRaw) : null;
  if (limit != null && (!Number.isInteger(limit) || limit < 0)) {
    throw new Error('Expected --limit to be a non-negative integer.');
  }

  return {
    apply: argv.includes('--apply'),
    force: argv.includes('--force'),
    limit,
    resolveShortLinks: !argv.includes('--no-resolve-short-links'),
    scope: scopeRaw,
    search: readArg('search') ?? null,
  };
}

function printCounts(title: string, counts: Record<string, number>) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (entries.length === 0) return;
  console.log(`\n${title}`);
  for (const [key, count] of entries) {
    console.log(`  ${String(count).padStart(5)}  ${key}`);
  }
}

async function runSearch(keywords: string) {
  const client = new AmazonCreatorsClient();
  const response = await client.searchItems({
    keywords,
    itemCount: 10,
    resources: AMAZON_CREATORS_RESOURCES,
  });
  const parsed = normalizeAmazonItemsResponse(response);
  console.log(`\nAmazon Creators SearchItems results for "${keywords}"`);
  console.log('Admin/backfill only. Review manually before adding ASINs to TMBC data.\n');
  for (const rawItem of parsed.items) {
    const item = rawItem as Record<string, unknown>;
    const itemInfo = item.itemInfo as Record<string, unknown> | undefined;
    const title = (itemInfo?.title as Record<string, unknown> | undefined)?.displayValue;
    console.log(`  ${item.asin ?? '(no ASIN)'}  ${typeof title === 'string' ? title : '(untitled)'}`);
    console.log(`     ${typeof item.detailPageURL === 'string' ? item.detailPageURL : '(no detailPageURL)'}`);
  }
  if (parsed.errors.length > 0) {
    console.log('\nErrors');
    for (const error of parsed.errors) {
      console.log(`  ${error.code ?? 'ERROR'}: ${error.message ?? '(no message)'}`);
    }
  }
}

async function main() {
  const args = parseArgs();

  if (args.search) {
    await runSearch(args.search);
    return;
  }

  const result = await runAmazonCreatorsSync({
    scope: args.scope,
    apply: args.apply,
    force: args.force,
    limit: args.limit,
    resolveShortLinks: args.resolveShortLinks,
  });

  console.log(`\nAmazon Creators ${result.applied ? 'sync' : 'dry run'} · scope=${result.scope}`);
  console.log(`  Targets found:          ${result.targetCount}`);
  console.log(`  Targets with ASIN:      ${result.targetsWithAsin}`);
  console.log(`  Missing ASIN targets:   ${result.missingAsinTargets.length}`);
  console.log(`  Unique ASINs:           ${result.uniqueAsins.length}`);
  console.log(`  Fresh cached ASINs:     ${result.freshAsins.length}`);
  console.log(`  ASINs to refresh:       ${result.asinsToRefresh.length}`);
  if (result.applied) {
    console.log(`  Synced ASINs:           ${result.syncedAsins.length}`);
    console.log(`  Failed ASINs:           ${result.failedAsins.length}`);
  } else {
    console.log('  Writes:                 none');
  }

  printCounts('By surface', result.surfaceCounts);
  printCounts('By source', result.sourceCounts);

  if (result.missingAsinTargets.length > 0) {
    console.log('\nMissing ASIN targets, first 20');
    for (const target of result.missingAsinTargets.slice(0, 20)) {
      console.log(`  ${target.surface} · ${target.label}`);
      console.log(`     ${target.url}`);
    }
  }

  if (result.failedAsins.length > 0) {
    console.log('\nFailures, first 20');
    for (const failure of result.failedAsins.slice(0, 20)) {
      console.log(`  ${failure.asin} · ${failure.status} · ${failure.message}`);
    }
  }

  if (!result.applied && result.asinsToRefresh.length > 0) {
    console.log('\nDry run complete. Re-run with --apply to refresh the cache.');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
