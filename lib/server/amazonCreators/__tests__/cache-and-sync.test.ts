import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  amazonCacheNeedsRefresh,
  bestAmazonImage,
  bestAmazonPrice,
  bestAmazonUrl,
  toAmazonProductForRender,
} from '@/lib/server/amazonCreators/cache';
import { AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE } from '@/lib/server/amazonCreators/constants';
import { normalizeAmazonItem, normalizeAmazonItemsResponse } from '@/lib/server/amazonCreators/item';
import {
  buildAmazonSourceUrlsByAsin,
  buildAmazonSyncPlan,
  chunkAsins,
} from '@/lib/server/amazonCreators/sync';
import type { AmazonCachedProduct, AmazonSyncTarget } from '@/lib/server/amazonCreators/types';

const NOW = new Date('2026-09-06T12:00:00Z');

function cacheRow(overrides: Partial<AmazonCachedProduct> = {}): AmazonCachedProduct {
  return {
    asin: 'B0BK1421MF',
    marketplace: 'www.amazon.com',
    partnerTag: 'taylormadebab-20',
    detailPageUrl: 'https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20',
    title: 'Veer adapter',
    primaryImageMediumUrl: 'https://m.media-amazon.com/images/I/example-medium.jpg',
    primaryImageLargeUrl: 'https://m.media-amazon.com/images/I/example-large.jpg',
    priceAmount: 79,
    priceDisplay: '$79.00',
    availability: 'In Stock',
    lastFetchedAt: NOW,
    offerFetchedAt: NOW,
    offerExpiresAt: new Date(NOW.getTime() + 60 * 60 * 1000),
    productDataExpiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    syncStatus: 'SYNCED',
    ...overrides,
  };
}

function target(sourceId: string, asin: string | null, surface: AmazonSyncTarget['surface']): AmazonSyncTarget {
  return {
    source: surface === 'blog' ? 'blog_content' : 'checklist_product',
    sourceId,
    surface,
    label: sourceId,
    url: asin ? `https://www.amazon.com/dp/${asin}?tag=taylormadebab-20` : 'https://amzn.to/example',
    asin,
    asinSource: asin ? 'direct-url' : 'missing',
  };
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    return stat.isDirectory() ? filesUnder(fullPath) : [fullPath];
  });
}

describe('Amazon cache and sync planning', () => {
  it('uses one-hour offer TTL and one-day product TTL for rendering', () => {
    const fresh = toAmazonProductForRender(cacheRow(), NOW)!;
    expect(fresh.detailPageUrl).toContain('tag=taylormadebab-20');
    expect(fresh.imageUrl).toContain('example-large');
    expect(fresh.priceAmount).toBe(79);

    const staleOffer = toAmazonProductForRender(cacheRow({ offerExpiresAt: new Date(NOW.getTime() - 1) }), NOW)!;
    expect(staleOffer.detailPageUrl).toContain('tag=taylormadebab-20');
    expect(staleOffer.priceAmount).toBeNull();

    expect(amazonCacheNeedsRefresh(cacheRow({ productDataExpiresAt: new Date(NOW.getTime() - 1) }), NOW)).toBe(true);
  });

  it('suppresses normal retry for AssociateNotEligible rows', () => {
    expect(amazonCacheNeedsRefresh(cacheRow({ syncStatus: 'ASSOCIATE_NOT_ELIGIBLE' }), NOW)).toBe(false);
    expect(amazonCacheNeedsRefresh(cacheRow({ syncStatus: 'ASSOCIATE_NOT_ELIGIBLE' }), NOW, true)).toBe(true);
  });

  it('keeps editorial fallbacks when the Amazon cache is unavailable', () => {
    const failedProduct = toAmazonProductForRender(cacheRow({ syncStatus: 'ERROR' }), NOW);

    expect(failedProduct).toBeNull();
    expect(bestAmazonUrl('https://amzn.to/editorial', failedProduct)).toBe('https://amzn.to/editorial');
    expect(bestAmazonImage('https://tmbc.example/product.jpg', failedProduct)).toBe('https://tmbc.example/product.jpg');
    expect(bestAmazonPrice(79, failedProduct)).toBe(79);
  });

  it('enforces max 10 ASINs per GetItems chunk', () => {
    const chunks = chunkAsins(Array.from({ length: 21 }, (_, index) => `B000000${String(index).padStart(3, '0')}`));
    expect(chunks).toHaveLength(3);
    expect(chunks.every((chunk) => chunk.length <= AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE)).toBe(true);
  });

  it('builds separate blog-only and all-product refresh plans', () => {
    const targets = [
      target('blog-card', 'B0BK1421MF', 'blog'),
      target('checklist-pick', 'B075WGCSCM', 'checklist'),
      target('short-link', null, 'blog'),
    ];
    const cacheMap = new Map<string, AmazonCachedProduct>([
      ['B0BK1421MF', cacheRow()],
    ]);

    const blogPlan = buildAmazonSyncPlan({ scope: 'blog', targets: targets.filter((row) => row.surface === 'blog'), cacheMap, now: NOW });
    expect(blogPlan.scope).toBe('blog');
    expect(blogPlan.freshAsins).toEqual(['B0BK1421MF']);
    expect(blogPlan.missingAsinTargets).toHaveLength(1);

    const allPlan = buildAmazonSyncPlan({ scope: 'all', targets, cacheMap, now: NOW });
    expect(allPlan.scope).toBe('all');
    expect(allPlan.asinsToRefresh).toEqual(['B075WGCSCM']);
  });

  it('preserves short-link mappings when an ASIN is resolved during sync', () => {
    const shortLinkTarget: AmazonSyncTarget = {
      ...target('short-link', 'B0BK1421MF', 'blog'),
      url: 'https://amzn.to/4hdEYM0',
      resolvedUrl: 'https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20',
      asinSource: 'short-url',
    };
    const cacheMap = new Map<string, AmazonCachedProduct>([
      ['B0BK1421MF', cacheRow({ sourceUrls: ['https://www.amazon.com/legacy/B0BK1421MF'] })],
    ]);

    expect(buildAmazonSourceUrlsByAsin([shortLinkTarget], cacheMap).get('B0BK1421MF')).toEqual([
      'https://www.amazon.com/legacy/B0BK1421MF',
      'https://amzn.to/4hdEYM0',
      'https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20',
    ]);
  });

  it('marks returned Amazon URLs without the TMBC tag as unusable', () => {
    const normalized = normalizeAmazonItem({
      partnerTag: 'taylormadebab-20',
      fetchedAt: NOW,
      item: {
        asin: 'B0BK1421MF',
        detailPageURL: 'https://www.amazon.com/dp/B0BK1421MF?tag=wrong-20',
        itemInfo: { title: { displayValue: 'Wrong tag item' } },
      },
    })!;

    expect(normalized.syncStatus).toBe('ERROR');
    expect(normalized.detailPageUrl).toBeNull();
    expect(normalized.syncError).toMatch(/tag=taylormadebab-20/);
  });

  it('parses official GetItems, SearchItems, and OffersV2 response shapes', () => {
    const rawItem = {
      asin: 'B0BK1421MF',
      detailPageURL: 'https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20',
      offersV2: {
        listings: [{
          availability: { message: 'In Stock', type: 'IN_STOCK' },
          price: { money: { amount: 79, currency: 'USD', displayAmount: '$79.00' } },
        }],
      },
    };
    const getItems = normalizeAmazonItemsResponse({
      itemsResult: { items: [rawItem] },
      errors: [{ code: 'InvalidParameterValue', message: 'The ItemIds B08N5WRWNW provided in the request is invalid.' }],
    });
    const searchItems = normalizeAmazonItemsResponse({ searchResult: { items: [rawItem] } });
    const normalized = normalizeAmazonItem({ item: getItems.items[0], partnerTag: 'taylormadebab-20', fetchedAt: NOW })!;

    expect(getItems.items).toHaveLength(1);
    expect(getItems.errors[0].asin).toBe('B08N5WRWNW');
    expect(searchItems.items).toHaveLength(1);
    expect(normalized.priceAmount).toBe(79);
    expect(normalized.priceDisplay).toBe('$79.00');
    expect(normalized.currency).toBe('USD');
    expect(normalized.availability).toBe('In Stock');
  });

  it('keeps Amazon credential env names out of client bundle directories', () => {
    const repoRoot = fileURLToPath(new URL('../../../..', import.meta.url));
    const clientDirs = ['components', 'lib/blog', 'lib/compatibilityEngine.ts'].map((entry) => path.join(repoRoot, entry));
    const credentialPattern = /AMAZON_CREATORS_CLIENT_(ID|SECRET)/;

    for (const entry of clientDirs) {
      const files = statSync(entry).isDirectory() ? filesUnder(entry) : [entry];
      for (const file of files.filter((filePath) => /\.(ts|tsx)$/.test(filePath))) {
        expect(readFileSync(file, 'utf8'), file).not.toMatch(credentialPattern);
      }
    }
  });
});
