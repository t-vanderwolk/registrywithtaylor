export type AmazonProductSyncStatus =
  | 'PENDING'
  | 'SYNCED'
  | 'ERROR'
  | 'ASSOCIATE_NOT_ELIGIBLE'
  | 'RATE_LIMITED';

export type AmazonCachedProduct = {
  asin: string;
  sourceUrls?: string[];
  marketplace: string;
  partnerTag: string;
  credentialVersion?: string | null;
  detailPageUrl?: string | null;
  title?: string | null;
  primaryImageMediumUrl?: string | null;
  primaryImageLargeUrl?: string | null;
  priceAmount?: number | null;
  priceDisplay?: string | null;
  currency?: string | null;
  availability?: string | null;
  parentAsin?: string | null;
  lastFetchedAt?: Date | null;
  offerFetchedAt?: Date | null;
  offerExpiresAt?: Date | null;
  productDataExpiresAt?: Date | null;
  syncStatus: AmazonProductSyncStatus;
  syncError?: string | null;
};

export type AmazonProductForRender = {
  asin: string;
  detailPageUrl: string | null;
  title: string | null;
  imageUrl: string | null;
  priceAmount: number | null;
  priceDisplay: string | null;
  availability: string | null;
  hasFreshOffer: boolean;
  hasFreshProductData: boolean;
};

export type AmazonSyncTargetSource =
  | 'blog_content'
  | 'blog_affiliate_link'
  | 'guide_content'
  | 'guide_affiliate_module'
  | 'checklist_product'
  | 'stroller'
  | 'car_seat'
  | 'affiliate_catalog_manual_amazon'
  | 'affiliate_catalog_amazon'
  | 'compatibility_adapter'
  | 'static_travel_system_link'
  | 'static_product_group';

export type AmazonSyncTarget = {
  source: AmazonSyncTargetSource;
  sourceId: string;
  surface: 'blog' | 'guide' | 'checklist' | 'stroller-finder' | 'car-seat-finder' | 'travel-system' | 'static';
  label: string;
  url: string;
  asin: string | null;
  resolvedUrl?: string | null;
  asinSource: 'direct-url' | 'short-url' | 'missing';
};
