import {
  AMAZON_CREATORS_OFFER_TTL_MS,
  AMAZON_CREATORS_PRODUCT_DATA_TTL_MS,
} from '@/lib/server/amazonCreators/constants';
import { assertAmazonDetailPageUrl } from '@/lib/server/amazonCreators/url';
import type { AmazonProductSyncStatus } from '@/lib/server/amazonCreators/types';

type JsonObject = Record<string, unknown>;

export type NormalizedAmazonItem = {
  asin: string;
  detailPageUrl: string | null;
  title: string | null;
  byLineInfo: unknown;
  features: string[];
  productInfo: unknown;
  primaryImageMediumUrl: string | null;
  primaryImageLargeUrl: string | null;
  priceAmount: number | null;
  priceDisplay: string | null;
  currency: string | null;
  availability: string | null;
  dealDetails: unknown;
  parentAsin: string | null;
  rawItem: unknown;
  lastFetchedAt: Date;
  offerFetchedAt: Date;
  offerExpiresAt: Date;
  productDataExpiresAt: Date;
  syncStatus: AmazonProductSyncStatus;
  syncError: string | null;
};

function asObject(value: unknown): JsonObject | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.]+/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickDisplayValue(value: unknown): string | null {
  const object = asObject(value);
  return asString(object?.displayValue) ?? asString(object?.DisplayValue) ?? asString(value);
}

function imageUrl(item: JsonObject, size: 'medium' | 'large') {
  const images = asObject(item.images);
  const primary = asObject(images?.primary);
  const sized = asObject(primary?.[size]);
  return asString(sized?.url) ?? asString(sized?.URL);
}

function firstListing(item: JsonObject): JsonObject | null {
  const offers = asObject(item.offersV2);
  const listings = asArray(offers?.listings);
  return asObject(listings[0]);
}

function priceValue(listing: JsonObject | null) {
  const price = asObject(listing?.price) ?? asObject(listing?.Price);
  const money = asObject(price?.money) ?? asObject(price?.Money) ?? price;
  return {
    amount: asNumber(money?.amount ?? money?.Amount),
    display: asString(money?.displayAmount ?? money?.DisplayAmount ?? money?.displayValue),
    currency: asString(money?.currency ?? money?.Currency),
  };
}

function availabilityValue(listing: JsonObject | null) {
  const availability = asObject(listing?.availability) ?? asObject(listing?.Availability);
  return (
    asString(availability?.message) ??
    asString(availability?.displayValue) ??
    asString(availability?.type) ??
    asString(listing?.availability) ??
    null
  );
}

function featureValues(itemInfo: JsonObject | null) {
  const features = asObject(itemInfo?.features);
  return asArray(features?.displayValues ?? features?.DisplayValues).flatMap((entry) => {
    const value = asString(entry);
    return value ? [value] : [];
  });
}

export function normalizeAmazonItem({
  item,
  partnerTag,
  fetchedAt = new Date(),
}: {
  item: unknown;
  partnerTag: string;
  fetchedAt?: Date;
}): NormalizedAmazonItem | null {
  const object = asObject(item);
  const asin = asString(object?.asin)?.toUpperCase() ?? null;
  if (!object || !asin) return null;

  const detailPageUrlRaw = asString(object.detailPageURL ?? object.detailPageUrl);
  const detailPageUrlCheck = assertAmazonDetailPageUrl(detailPageUrlRaw, partnerTag);
  const listing = firstListing(object);
  const price = priceValue(listing);
  const itemInfo = asObject(object.itemInfo);
  const offerExpiresAt = new Date(fetchedAt.getTime() + AMAZON_CREATORS_OFFER_TTL_MS);
  const productDataExpiresAt = new Date(fetchedAt.getTime() + AMAZON_CREATORS_PRODUCT_DATA_TTL_MS);

  return {
    asin,
    detailPageUrl: detailPageUrlCheck.ok ? detailPageUrlCheck.url : null,
    title: pickDisplayValue(asObject(itemInfo?.title) ?? itemInfo?.title),
    byLineInfo: asObject(itemInfo?.byLineInfo) ?? null,
    features: featureValues(itemInfo),
    productInfo: asObject(itemInfo?.productInfo) ?? null,
    primaryImageMediumUrl: imageUrl(object, 'medium'),
    primaryImageLargeUrl: imageUrl(object, 'large'),
    priceAmount: price.amount,
    priceDisplay: price.display,
    currency: price.currency,
    availability: availabilityValue(listing),
    dealDetails: asObject(listing?.dealDetails) ?? null,
    parentAsin: asString(object.parentASIN ?? object.parentAsin),
    rawItem: item,
    lastFetchedAt: fetchedAt,
    offerFetchedAt: fetchedAt,
    offerExpiresAt,
    productDataExpiresAt,
    syncStatus: detailPageUrlCheck.ok ? 'SYNCED' : 'ERROR',
    syncError: detailPageUrlCheck.ok ? null : detailPageUrlCheck.reason,
  };
}

export function normalizeAmazonItemsResponse(response: unknown): {
  items: unknown[];
  errors: Array<{ code: string | null; message: string | null; asin: string | null }>;
} {
  const object = asObject(response);
  const result =
    asObject(object?.itemsResult) ??
    asObject(object?.searchResult) ??
    // Retain this fallback for older test fixtures and defensive compatibility.
    asObject(object?.itemResults);
  const items = asArray(result?.items);
  const errors = asArray(object?.errors).flatMap((error) => {
    const row = asObject(error);
    if (!row) return [];
    const message = asString(row.message);
    const asinFromMessage = message?.match(/\b[A-Z0-9]{10}\b/i)?.[0] ?? null;
    return [{
      code: asString(row.code ?? row.reason),
      message,
      asin: (asString(row.itemId ?? row.resourceId) ?? asinFromMessage)?.toUpperCase() ?? null,
    }];
  });

  return { items, errors };
}
