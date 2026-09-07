export const AMAZON_CREATORS_DEFAULT_MARKETPLACE = 'www.amazon.com';
export const AMAZON_CREATORS_DEFAULT_PARTNER_TAG = 'taylormadebab-20';
export const AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION = 'v3.1';
export const AMAZON_CREATORS_DEFAULT_API_BASE_URL = 'https://creatorsapi.amazon';

export const AMAZON_CREATORS_TOKEN_ENDPOINT_BY_VERSION: Record<string, string> = {
  '3.1': 'https://api.amazon.com/auth/o2/token',
  'v3.1': 'https://api.amazon.com/auth/o2/token',
  '3.2': 'https://api.amazon.co.uk/auth/o2/token',
  'v3.2': 'https://api.amazon.co.uk/auth/o2/token',
  '3.3': 'https://api.amazon.co.jp/auth/o2/token',
  'v3.3': 'https://api.amazon.co.jp/auth/o2/token',
};

export const AMAZON_CREATORS_GET_ITEMS_PATH = '/catalog/v1/getItems';
export const AMAZON_CREATORS_SEARCH_ITEMS_PATH = '/catalog/v1/searchItems';
export const AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE = 10;
export const AMAZON_CREATORS_TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000;
export const AMAZON_CREATORS_OFFER_TTL_MS = 60 * 60 * 1000;
export const AMAZON_CREATORS_PRODUCT_DATA_TTL_MS = 24 * 60 * 60 * 1000;
export const AMAZON_CREATORS_RATE_LIMIT_BACKOFF_MS = 15 * 60 * 1000;

export const AMAZON_CREATORS_RESOURCES = [
  'images.primary.medium',
  'images.primary.large',
  'itemInfo.title',
  'itemInfo.byLineInfo',
  'itemInfo.features',
  'itemInfo.productInfo',
  'offersV2.listings.price',
  'offersV2.listings.availability',
  'offersV2.listings.dealDetails',
  'parentASIN',
] as const;

export type AmazonCreatorsResource = (typeof AMAZON_CREATORS_RESOURCES)[number];
