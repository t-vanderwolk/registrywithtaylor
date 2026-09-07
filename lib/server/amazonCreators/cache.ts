import 'server-only';

import { Prisma } from '@prisma/client';
import {
  AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION,
  AMAZON_CREATORS_DEFAULT_MARKETPLACE,
  AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
  AMAZON_CREATORS_RATE_LIMIT_BACKOFF_MS,
} from '@/lib/server/amazonCreators/constants';
import { parseAmazonAsinFromUrl } from '@/lib/server/amazonCreators/url';
import type {
  AmazonCachedProduct,
  AmazonProductForRender,
  AmazonProductSyncStatus,
} from '@/lib/server/amazonCreators/types';
import type { NormalizedAmazonItem } from '@/lib/server/amazonCreators/item';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

function jsonValue(value: unknown) {
  return value == null ? Prisma.JsonNull : value;
}

function dateValue(value: unknown): Date | null {
  return value instanceof Date ? value : null;
}

function isFuture(value: Date | null | undefined, now: Date) {
  return value instanceof Date && value.getTime() > now.getTime();
}

export function amazonOfferIsFresh(row: Pick<AmazonCachedProduct, 'syncStatus' | 'offerExpiresAt'>, now = new Date()) {
  return row.syncStatus === 'SYNCED' && isFuture(row.offerExpiresAt ?? null, now);
}

export function amazonProductDataIsFresh(
  row: Pick<AmazonCachedProduct, 'syncStatus' | 'productDataExpiresAt'>,
  now = new Date(),
) {
  return row.syncStatus === 'SYNCED' && isFuture(row.productDataExpiresAt ?? null, now);
}

export function amazonCacheNeedsRefresh(
  row: AmazonCachedProduct | null | undefined,
  now = new Date(),
  force = false,
) {
  if (force) return true;
  if (!row) return true;
  if (row.syncStatus === 'ASSOCIATE_NOT_ELIGIBLE') return false;
  if (row.syncStatus === 'RATE_LIMITED' && row.lastFetchedAt) {
    return now.getTime() - row.lastFetchedAt.getTime() >= AMAZON_CREATORS_RATE_LIMIT_BACKOFF_MS;
  }
  if (row.syncStatus !== 'SYNCED') return true;
  return !amazonOfferIsFresh(row, now) || !amazonProductDataIsFresh(row, now);
}

export function toAmazonProductForRender(
  row: AmazonCachedProduct | null | undefined,
  now = new Date(),
): AmazonProductForRender | null {
  if (!row || row.syncStatus !== 'SYNCED') return null;

  const hasFreshProductData = amazonProductDataIsFresh(row, now);
  const hasFreshOffer = amazonOfferIsFresh(row, now);
  if (!hasFreshProductData && !hasFreshOffer) return null;

  return {
    asin: row.asin,
    detailPageUrl: hasFreshProductData ? row.detailPageUrl ?? null : null,
    title: hasFreshProductData ? row.title ?? null : null,
    imageUrl: hasFreshProductData
      ? row.primaryImageLargeUrl ?? row.primaryImageMediumUrl ?? null
      : null,
    priceAmount: hasFreshOffer ? row.priceAmount ?? null : null,
    priceDisplay: hasFreshOffer ? row.priceDisplay ?? null : null,
    availability: hasFreshOffer ? row.availability ?? null : null,
    hasFreshOffer,
    hasFreshProductData,
  };
}

export function bestAmazonUrl(existingUrl: string | null | undefined, product: AmazonProductForRender | null | undefined) {
  return product?.detailPageUrl ?? existingUrl ?? null;
}

export function bestAmazonImage(existingImage: string | null | undefined, product: AmazonProductForRender | null | undefined) {
  return product?.imageUrl ?? existingImage ?? null;
}

export function bestAmazonPrice(existingPrice: number | null | undefined, product: AmazonProductForRender | null | undefined) {
  return product?.priceAmount ?? existingPrice ?? null;
}

export function bestAmazonPriceSource(
  existingSource: string | null | undefined,
  product: AmazonProductForRender | null | undefined,
) {
  return product?.priceAmount != null ? 'Amazon' : existingSource ?? null;
}

export async function getAmazonCacheMapForAsins(
  asins: Iterable<string>,
  now = new Date(),
): Promise<Map<string, AmazonProductForRender>> {
  const uniqueAsins = [...new Set([...asins].map((asin) => asin.trim().toUpperCase()).filter(Boolean))];
  if (uniqueAsins.length === 0) return new Map();

  try {
    const rows = (await db.amazonProductCache.findMany({
      where: {
        asin: { in: uniqueAsins },
        marketplace: AMAZON_CREATORS_DEFAULT_MARKETPLACE,
        partnerTag: AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
      },
    })) as AmazonCachedProduct[];
    return new Map(
      rows.flatMap((row) => {
        const product = toAmazonProductForRender(row, now);
        return product ? [[row.asin.toUpperCase(), product] as const] : [];
      }),
    );
  } catch {
    return new Map();
  }
}

export async function getAmazonCacheMapForUrls(
  urls: Iterable<string | null | undefined>,
  now = new Date(),
): Promise<Map<string, AmazonProductForRender>> {
  const urlToAsin = new Map<string, string>();
  const unresolvedUrls: string[] = [];
  for (const rawUrl of urls) {
    const url = rawUrl?.trim();
    if (!url) continue;
    const asin = parseAmazonAsinFromUrl(url);
    if (asin) {
      urlToAsin.set(url, asin);
    } else if (!unresolvedUrls.includes(url)) {
      unresolvedUrls.push(url);
    }
  }

  const asinMap = await getAmazonCacheMapForAsins(urlToAsin.values(), now);
  const out = new Map<string, AmazonProductForRender>();
  for (const [url, asin] of urlToAsin.entries()) {
    const product = asinMap.get(asin);
    if (product) out.set(url, product);
  }

  if (unresolvedUrls.length > 0) {
    try {
      const rows = (await db.amazonProductCache.findMany({
        where: {
          marketplace: AMAZON_CREATORS_DEFAULT_MARKETPLACE,
          partnerTag: AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
          sourceUrls: { hasSome: unresolvedUrls },
        },
      })) as AmazonCachedProduct[];
      const requestedUrls = new Set(unresolvedUrls);
      for (const row of rows) {
        const product = toAmazonProductForRender(row, now);
        if (!product) continue;
        for (const sourceUrl of row.sourceUrls ?? []) {
          if (requestedUrls.has(sourceUrl)) out.set(sourceUrl, product);
        }
      }
    } catch {
      // The cache migration may not be applied during a build.
    }
  }
  return out;
}

export async function getRawAmazonCacheMapForAsins(asins: Iterable<string>): Promise<Map<string, AmazonCachedProduct>> {
  const uniqueAsins = [...new Set([...asins].map((asin) => asin.trim().toUpperCase()).filter(Boolean))];
  if (uniqueAsins.length === 0) return new Map();

  try {
    const rows = (await db.amazonProductCache.findMany({
      where: { asin: { in: uniqueAsins } },
    })) as AmazonCachedProduct[];
    return new Map(rows.map((row) => [row.asin.toUpperCase(), row]));
  } catch {
    return new Map();
  }
}

export async function upsertAmazonProductCacheItem({
  item,
  sourceUrls = [],
  marketplace = AMAZON_CREATORS_DEFAULT_MARKETPLACE,
  partnerTag = AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
  credentialVersion = AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION,
  requestedResources,
}: {
  item: NormalizedAmazonItem;
  sourceUrls?: Iterable<string>;
  marketplace?: string;
  partnerTag?: string;
  credentialVersion?: string;
  requestedResources: readonly string[];
}) {
  const normalizedSourceUrls = [...new Set([...sourceUrls].map((url) => url.trim()).filter(Boolean))];
  const data = {
    ...(normalizedSourceUrls.length > 0 ? { sourceUrls: normalizedSourceUrls } : {}),
    marketplace,
    partnerTag,
    credentialVersion,
    detailPageUrl: item.detailPageUrl,
    title: item.title,
    byLineInfo: jsonValue(item.byLineInfo),
    features: item.features,
    productInfo: jsonValue(item.productInfo),
    primaryImageMediumUrl: item.primaryImageMediumUrl,
    primaryImageLargeUrl: item.primaryImageLargeUrl,
    priceAmount: item.priceAmount,
    priceDisplay: item.priceDisplay,
    currency: item.currency,
    availability: item.availability,
    dealDetails: jsonValue(item.dealDetails),
    parentAsin: item.parentAsin,
    requestedResources: [...requestedResources],
    rawItem: jsonValue(item.rawItem),
    lastFetchedAt: item.lastFetchedAt,
    offerFetchedAt: item.offerFetchedAt,
    offerExpiresAt: item.offerExpiresAt,
    productDataExpiresAt: item.productDataExpiresAt,
    syncStatus: item.syncStatus,
    syncError: item.syncError,
  };

  await db.amazonProductCache.upsert({
    where: { asin: item.asin },
    create: { asin: item.asin, ...data },
    update: data,
  });
}

export async function markAmazonProductCacheFailure({
  asins,
  status,
  message,
  marketplace = AMAZON_CREATORS_DEFAULT_MARKETPLACE,
  partnerTag = AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
  credentialVersion = AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION,
  fetchedAt = new Date(),
}: {
  asins: Iterable<string>;
  status: Exclude<AmazonProductSyncStatus, 'SYNCED'>;
  message: string;
  marketplace?: string;
  partnerTag?: string;
  credentialVersion?: string;
  fetchedAt?: Date;
}) {
  for (const asin of new Set([...asins].map((value) => value.trim().toUpperCase()).filter(Boolean))) {
    await db.amazonProductCache.upsert({
      where: { asin },
      create: {
        asin,
        marketplace,
        partnerTag,
        credentialVersion,
        lastFetchedAt: fetchedAt,
        syncStatus: status,
        syncError: message,
      },
      update: {
        marketplace,
        partnerTag,
        credentialVersion,
        lastFetchedAt: fetchedAt,
        syncStatus: status,
        syncError: message,
      },
    });
  }
}

export function coerceAmazonCachedProduct(row: Record<string, unknown>): AmazonCachedProduct {
  return {
    asin: String(row.asin ?? ''),
    sourceUrls: Array.isArray(row.sourceUrls)
      ? row.sourceUrls.filter((value): value is string => typeof value === 'string')
      : [],
    marketplace: String(row.marketplace ?? AMAZON_CREATORS_DEFAULT_MARKETPLACE),
    partnerTag: String(row.partnerTag ?? AMAZON_CREATORS_DEFAULT_PARTNER_TAG),
    credentialVersion: typeof row.credentialVersion === 'string' ? row.credentialVersion : null,
    detailPageUrl: typeof row.detailPageUrl === 'string' ? row.detailPageUrl : null,
    title: typeof row.title === 'string' ? row.title : null,
    primaryImageMediumUrl: typeof row.primaryImageMediumUrl === 'string' ? row.primaryImageMediumUrl : null,
    primaryImageLargeUrl: typeof row.primaryImageLargeUrl === 'string' ? row.primaryImageLargeUrl : null,
    priceAmount: typeof row.priceAmount === 'number' ? row.priceAmount : null,
    priceDisplay: typeof row.priceDisplay === 'string' ? row.priceDisplay : null,
    currency: typeof row.currency === 'string' ? row.currency : null,
    availability: typeof row.availability === 'string' ? row.availability : null,
    parentAsin: typeof row.parentAsin === 'string' ? row.parentAsin : null,
    lastFetchedAt: dateValue(row.lastFetchedAt),
    offerFetchedAt: dateValue(row.offerFetchedAt),
    offerExpiresAt: dateValue(row.offerExpiresAt),
    productDataExpiresAt: dateValue(row.productDataExpiresAt),
    syncStatus: (typeof row.syncStatus === 'string' ? row.syncStatus : 'PENDING') as AmazonProductSyncStatus,
    syncError: typeof row.syncError === 'string' ? row.syncError : null,
  };
}
