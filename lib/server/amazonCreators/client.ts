import 'server-only';

import {
  AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE,
  AMAZON_CREATORS_GET_ITEMS_PATH,
  AMAZON_CREATORS_RESOURCES,
  AMAZON_CREATORS_SEARCH_ITEMS_PATH,
  AMAZON_CREATORS_TOKEN_REFRESH_SKEW_MS,
  type AmazonCreatorsResource,
} from '@/lib/server/amazonCreators/constants';
import { getAmazonCreatorsConfig, type AmazonCreatorsConfig } from '@/lib/server/amazonCreators/config';

type FetchLike = typeof fetch;
type Sleep = (ms: number) => Promise<void>;

type TokenCacheEntry = {
  accessToken: string;
  expiresAtMs: number;
  clientId: string;
  tokenEndpoint: string;
};

let cachedToken: TokenCacheEntry | null = null;

const sleep: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRetryAfterSeconds(value: string | null | undefined) {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const dateMs = Date.parse(value);
  if (Number.isFinite(dateMs)) return Math.max(0, Math.ceil((dateMs - Date.now()) / 1000));
  return null;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function errorReason(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const record = body as Record<string, unknown>;
  const direct = record.reason ?? record.code ?? record.error ?? record.type;
  if (typeof direct === 'string') return direct;
  const errors = Array.isArray(record.errors) ? record.errors : Array.isArray(record.Errors) ? record.Errors : [];
  const first = errors.find((entry) => entry && typeof entry === 'object') as Record<string, unknown> | undefined;
  const nested = first?.reason ?? first?.code ?? first?.Code;
  return typeof nested === 'string' ? nested : null;
}

function errorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') return fallback;
  const record = body as Record<string, unknown>;
  const direct = record.message ?? record.error_description;
  if (typeof direct === 'string') return direct;
  const errors = Array.isArray(record.errors) ? record.errors : Array.isArray(record.Errors) ? record.Errors : [];
  const first = errors.find((entry) => entry && typeof entry === 'object') as Record<string, unknown> | undefined;
  const nested = first?.message ?? first?.Message;
  return typeof nested === 'string' ? nested : fallback;
}

export class AmazonCreatorsApiError extends Error {
  readonly status: number;
  readonly reason: string | null;
  readonly retryAfterSeconds: number | null;
  readonly responseBody: unknown;

  constructor({
    status,
    reason,
    retryAfterSeconds,
    responseBody,
    message,
  }: {
    status: number;
    reason: string | null;
    retryAfterSeconds: number | null;
    responseBody: unknown;
    message: string;
  }) {
    super(message);
    this.name = 'AmazonCreatorsApiError';
    this.status = status;
    this.reason = reason;
    this.retryAfterSeconds = retryAfterSeconds;
    this.responseBody = responseBody;
  }
}

export function classifyAmazonCreatorsError(error: unknown): 'ASSOCIATE_NOT_ELIGIBLE' | 'RATE_LIMITED' | 'ERROR' {
  if (!(error instanceof AmazonCreatorsApiError)) return 'ERROR';
  if (error.reason === 'AssociateNotEligible') return 'ASSOCIATE_NOT_ELIGIBLE';
  if (error.status === 429 || error.reason === 'ThrottleException') return 'RATE_LIMITED';
  return 'ERROR';
}

export function resetAmazonCreatorsTokenCacheForTests() {
  cachedToken = null;
}

export async function getAmazonCreatorsAccessToken({
  config,
  fetchImpl = fetch,
  nowMs = () => Date.now(),
}: {
  config: AmazonCreatorsConfig;
  fetchImpl?: FetchLike;
  nowMs?: () => number;
}) {
  const now = nowMs();
  if (
    cachedToken &&
    cachedToken.clientId === config.clientId &&
    cachedToken.tokenEndpoint === config.tokenEndpoint &&
    cachedToken.expiresAtMs - AMAZON_CREATORS_TOKEN_REFRESH_SKEW_MS > now
  ) {
    return cachedToken.accessToken;
  }

  const response = await fetchImpl(config.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'creatorsapi::default',
    }),
  });
  const body = await readJson(response);

  if (!response.ok) {
    throw new AmazonCreatorsApiError({
      status: response.status,
      reason: errorReason(body),
      retryAfterSeconds: parseRetryAfterSeconds(response.headers.get('retry-after')),
      responseBody: body,
      message: errorMessage(body, `Amazon token request failed with HTTP ${response.status}.`),
    });
  }

  const tokenBody = body as Record<string, unknown>;
  const accessToken = typeof tokenBody.access_token === 'string' ? tokenBody.access_token : null;
  const expiresIn = typeof tokenBody.expires_in === 'number' ? tokenBody.expires_in : 3600;
  if (!accessToken) {
    throw new Error('Amazon token response did not include access_token.');
  }

  cachedToken = {
    accessToken,
    clientId: config.clientId,
    tokenEndpoint: config.tokenEndpoint,
    expiresAtMs: now + expiresIn * 1000,
  };
  return accessToken;
}

export class AmazonCreatorsClient {
  private readonly config: AmazonCreatorsConfig;
  private readonly fetchImpl: FetchLike;
  private readonly nowMs: () => number;
  private readonly sleepImpl: Sleep;

  constructor({
    config = getAmazonCreatorsConfig(),
    fetchImpl = fetch,
    nowMs = () => Date.now(),
    sleepImpl = sleep,
  }: {
    config?: AmazonCreatorsConfig | null;
    fetchImpl?: FetchLike;
    nowMs?: () => number;
    sleepImpl?: Sleep;
  } = {}) {
    if (!config) {
      throw new Error('Amazon Creators API configuration is missing.');
    }
    this.config = config;
    this.fetchImpl = fetchImpl;
    this.nowMs = nowMs;
    this.sleepImpl = sleepImpl;
  }

  get partnerTag() {
    return this.config.partnerTag;
  }

  get marketplace() {
    return this.config.marketplace;
  }

  get credentialVersion() {
    return this.config.credentialVersion;
  }

  async getItems(
    itemIds: string[],
    resources: readonly AmazonCreatorsResource[] = AMAZON_CREATORS_RESOURCES,
  ): Promise<unknown> {
    if (itemIds.length === 0) return { itemsResult: { items: [] } };
    if (itemIds.length > AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE) {
      throw new Error(`Amazon GetItems supports at most ${AMAZON_CREATORS_GET_ITEMS_BATCH_SIZE} ASINs per request.`);
    }

    return this.request(AMAZON_CREATORS_GET_ITEMS_PATH, {
      itemIds,
      itemIdType: 'ASIN',
      marketplace: this.config.marketplace,
      partnerTag: this.config.partnerTag,
      resources,
    });
  }

  async searchItems({
    keywords,
    searchIndex,
    itemCount = 10,
    resources = AMAZON_CREATORS_RESOURCES,
  }: {
    keywords: string;
    searchIndex?: string;
    itemCount?: number;
    resources?: readonly AmazonCreatorsResource[];
  }): Promise<unknown> {
    return this.request(AMAZON_CREATORS_SEARCH_ITEMS_PATH, {
      keywords,
      ...(searchIndex ? { searchIndex } : {}),
      itemCount,
      marketplace: this.config.marketplace,
      partnerTag: this.config.partnerTag,
      resources,
    });
  }

  private async request(path: string, body: Record<string, unknown>, maxRetries = 1): Promise<unknown> {
    let attempt = 0;
    let lastError: AmazonCreatorsApiError | null = null;

    while (attempt <= maxRetries) {
      const accessToken = await getAmazonCreatorsAccessToken({
        config: this.config,
        fetchImpl: this.fetchImpl,
        nowMs: this.nowMs,
      });
      const response = await this.fetchImpl(`${this.config.apiBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-marketplace': this.config.marketplace,
        },
        body: JSON.stringify(body),
      });
      const responseBody = await readJson(response);

      if (response.ok) return responseBody;

      const apiError = new AmazonCreatorsApiError({
        status: response.status,
        reason: errorReason(responseBody),
        retryAfterSeconds: parseRetryAfterSeconds(response.headers.get('retry-after')),
        responseBody,
        message: errorMessage(responseBody, `Amazon Creators API request failed with HTTP ${response.status}.`),
      });

      const tokenCanRefresh =
        response.status === 401 &&
        (apiError.reason === 'TokenExpired' || apiError.reason === 'InvalidToken');
      const retryable = tokenCanRefresh || response.status === 429 || response.status >= 500;
      if (!retryable || attempt >= maxRetries) throw apiError;

      lastError = apiError;
      if (tokenCanRefresh) {
        cachedToken = null;
      } else {
        const waitMs = Math.min((apiError.retryAfterSeconds ?? 2 ** attempt) * 1000, 30_000);
        await this.sleepImpl(waitMs);
      }
      attempt += 1;
    }

    throw lastError ?? new Error('Amazon Creators API request failed.');
  }
}

export function createAmazonCreatorsClient(env: NodeJS.ProcessEnv = process.env) {
  return new AmazonCreatorsClient({ config: getAmazonCreatorsConfig(env) });
}
