import 'server-only';

import {
  AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE,
  AMAZON_CREATORS_RESOURCES,
} from '@/lib/server/amazonCreators/constants';
import {
  amazonCacheNeedsRefresh,
  getRawAmazonCacheMapForAsins,
  markAmazonProductCacheFailure,
  upsertAmazonProductCacheItem,
} from '@/lib/server/amazonCreators/cache';
import {
  AmazonCreatorsClient,
  classifyAmazonCreatorsError,
} from '@/lib/server/amazonCreators/client';
import { normalizeAmazonItem, normalizeAmazonItemsResponse } from '@/lib/server/amazonCreators/item';
import { discoverAmazonSyncTargets } from '@/lib/server/amazonCreators/targets';
import type {
  AmazonCachedProduct,
  AmazonProductSyncStatus,
  AmazonSyncTarget,
} from '@/lib/server/amazonCreators/types';

export type AmazonSyncScope = 'blog' | 'all';

export type AmazonSyncPlan = {
  scope: AmazonSyncScope;
  targetCount: number;
  targetsWithAsin: number;
  missingAsinTargets: AmazonSyncTarget[];
  uniqueAsins: string[];
  freshAsins: string[];
  asinsToRefresh: string[];
  sourceCounts: Record<string, number>;
  surfaceCounts: Record<string, number>;
};

export type AmazonSyncResult = AmazonSyncPlan & {
  applied: boolean;
  syncedAsins: string[];
  failedAsins: Array<{ asin: string; status: AmazonProductSyncStatus; message: string }>;
};

function increment(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

export function chunkAsins(asins: string[], batchSize = AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE) {
  const chunks: string[][] = [];
  for (let index = 0; index < asins.length; index += batchSize) {
    chunks.push(asins.slice(index, index + batchSize));
  }
  return chunks;
}

export function buildAmazonSourceUrlsByAsin(
  targets: AmazonSyncTarget[],
  cacheMap: Map<string, AmazonCachedProduct>,
) {
  const sourceUrlsByAsin = new Map<string, string[]>();
  for (const target of targets) {
    if (!target.asin) continue;
    const asin = target.asin.toUpperCase();
    const urls = sourceUrlsByAsin.get(asin) ?? [...(cacheMap.get(asin)?.sourceUrls ?? [])];
    for (const url of [target.url, target.resolvedUrl]) {
      const normalized = url?.trim();
      if (normalized && !urls.includes(normalized)) urls.push(normalized);
    }
    sourceUrlsByAsin.set(asin, urls);
  }
  return sourceUrlsByAsin;
}

export function buildAmazonSyncPlan({
  scope,
  targets,
  cacheMap,
  now = new Date(),
  force = false,
  limit = null,
}: {
  scope: AmazonSyncScope;
  targets: AmazonSyncTarget[];
  cacheMap: Map<string, AmazonCachedProduct>;
  now?: Date;
  force?: boolean;
  limit?: number | null;
}): AmazonSyncPlan {
  const sourceCounts: Record<string, number> = {};
  const surfaceCounts: Record<string, number> = {};
  const missingAsinTargets: AmazonSyncTarget[] = [];
  const uniqueAsins: string[] = [];
  const seenAsins = new Set<string>();

  for (const target of targets) {
    increment(sourceCounts, target.source);
    increment(surfaceCounts, target.surface);

    if (!target.asin) {
      missingAsinTargets.push(target);
      continue;
    }

    const asin = target.asin.toUpperCase();
    if (!seenAsins.has(asin)) {
      seenAsins.add(asin);
      uniqueAsins.push(asin);
    }
  }

  const refreshCandidates = uniqueAsins.filter((asin) => amazonCacheNeedsRefresh(cacheMap.get(asin), now, force));
  const asinsToRefresh = limit == null ? refreshCandidates : refreshCandidates.slice(0, Math.max(0, limit));
  const refreshSet = new Set(asinsToRefresh);
  const freshAsins = uniqueAsins.filter((asin) => !refreshSet.has(asin) && !amazonCacheNeedsRefresh(cacheMap.get(asin), now, force));

  return {
    scope,
    targetCount: targets.length,
    targetsWithAsin: targets.length - missingAsinTargets.length,
    missingAsinTargets,
    uniqueAsins,
    freshAsins,
    asinsToRefresh,
    sourceCounts,
    surfaceCounts,
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function itemErrorStatus(code: string | null): Exclude<AmazonProductSyncStatus, 'SYNCED'> {
  if (code === 'AssociateNotEligible') return 'ASSOCIATE_NOT_ELIGIBLE';
  if (code === 'ThrottleException' || code === 'TooManyRequests') return 'RATE_LIMITED';
  return 'ERROR';
}

export async function runAmazonCreatorsSync({
  scope,
  apply = false,
  force = false,
  limit = null,
  resolveShortLinks = true,
  now = new Date(),
  client,
}: {
  scope: AmazonSyncScope;
  apply?: boolean;
  force?: boolean;
  limit?: number | null;
  resolveShortLinks?: boolean;
  now?: Date;
  client?: AmazonCreatorsClient;
}): Promise<AmazonSyncResult> {
  const targets = await discoverAmazonSyncTargets({ scope, resolveShortLinks });
  const asins = [...new Set(targets.flatMap((target) => (target.asin ? [target.asin] : [])))];
  const cacheMap = await getRawAmazonCacheMapForAsins(asins);
  const sourceUrlsByAsin = buildAmazonSourceUrlsByAsin(targets, cacheMap);
  const plan = buildAmazonSyncPlan({ scope, targets, cacheMap, now, force, limit });

  if (!apply || plan.asinsToRefresh.length === 0) {
    return {
      ...plan,
      applied: false,
      syncedAsins: [],
      failedAsins: [],
    };
  }

  const api = client ?? new AmazonCreatorsClient();
  const syncedAsins: string[] = [];
  const failedAsins: AmazonSyncResult['failedAsins'] = [];

  for (const batch of chunkAsins(plan.asinsToRefresh)) {
    try {
      const response = await api.getItems(batch, AMAZON_CREATORS_RESOURCES);
      const parsed = normalizeAmazonItemsResponse(response);
      const returned = new Set<string>();

      for (const rawItem of parsed.items) {
        const item = normalizeAmazonItem({ item: rawItem, partnerTag: api.partnerTag, fetchedAt: now });
        if (!item) continue;
        returned.add(item.asin);
        await upsertAmazonProductCacheItem({
          item,
          sourceUrls: sourceUrlsByAsin.get(item.asin) ?? [],
          marketplace: api.marketplace,
          partnerTag: api.partnerTag,
          credentialVersion: api.credentialVersion,
          requestedResources: AMAZON_CREATORS_RESOURCES,
        });

        if (item.syncStatus === 'SYNCED') {
          syncedAsins.push(item.asin);
        } else {
          failedAsins.push({ asin: item.asin, status: item.syncStatus, message: item.syncError ?? 'Amazon item could not be synced.' });
        }
      }

      for (const itemError of parsed.errors) {
        const asin = itemError.asin;
        if (!asin || returned.has(asin)) continue;
        const status = itemErrorStatus(itemError.code);
        const message = itemError.message ?? itemError.code ?? 'Amazon returned an item-level error.';
        await markAmazonProductCacheFailure({
          asins: [asin],
          status,
          message,
          marketplace: api.marketplace,
          partnerTag: api.partnerTag,
          credentialVersion: api.credentialVersion,
          fetchedAt: now,
        });
        failedAsins.push({ asin, status, message });
      }

      const accountedFor = new Set([...returned, ...parsed.errors.flatMap((error) => (error.asin ? [error.asin] : []))]);
      const missingFromResponse = batch.filter((asin) => !accountedFor.has(asin));
      if (missingFromResponse.length > 0) {
        await markAmazonProductCacheFailure({
          asins: missingFromResponse,
          status: 'ERROR',
          message: 'Amazon did not return this ASIN in itemsResult or errors.',
          marketplace: api.marketplace,
          partnerTag: api.partnerTag,
          credentialVersion: api.credentialVersion,
          fetchedAt: now,
        });
        for (const asin of missingFromResponse) {
          failedAsins.push({ asin, status: 'ERROR', message: 'Amazon did not return this ASIN in itemsResult or errors.' });
        }
      }
    } catch (error) {
      const status = classifyAmazonCreatorsError(error);
      const message = errorMessage(error);
      await markAmazonProductCacheFailure({
        asins: batch,
        status,
        message,
        marketplace: api.marketplace,
        partnerTag: api.partnerTag,
        credentialVersion: api.credentialVersion,
        fetchedAt: now,
      });
      for (const asin of batch) {
        failedAsins.push({ asin, status, message });
      }
    }
  }

  return {
    ...plan,
    applied: true,
    syncedAsins,
    failedAsins,
  };
}
