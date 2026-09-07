import { describe, expect, it, beforeEach } from 'vitest';

import { getAmazonCreatorsConfig } from '@/lib/server/amazonCreators/config';
import {
  AmazonCreatorsApiError,
  AmazonCreatorsClient,
  classifyAmazonCreatorsError,
  getAmazonCreatorsAccessToken,
  resetAmazonCreatorsTokenCacheForTests,
} from '@/lib/server/amazonCreators/client';

const config = getAmazonCreatorsConfig({
  AMAZON_CREATORS_CLIENT_ID: 'client-id',
  AMAZON_CREATORS_CLIENT_SECRET: 'client-secret',
  AMAZON_CREATORS_CREDENTIAL_VERSION: 'v3.1',
  AMAZON_CREATORS_MARKETPLACE: 'www.amazon.com',
  AMAZON_CREATORS_PARTNER_TAG: 'taylormadebab-20',
})!;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    statusText: init?.statusText,
    headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string> | undefined) },
  });
}

describe('Amazon Creators client', () => {
  beforeEach(() => {
    resetAmazonCreatorsTokenCacheForTests();
  });

  it('caches tokens until near expiry', async () => {
    let now = 0;
    const calls: string[] = [];
    const fetchImpl: typeof fetch = (async (input) => {
      calls.push(String(input));
      return jsonResponse({ access_token: `token-${calls.length}`, expires_in: 3600 });
    }) as typeof fetch;

    await getAmazonCreatorsAccessToken({ config, fetchImpl, nowMs: () => now });
    await getAmazonCreatorsAccessToken({ config, fetchImpl, nowMs: () => now + 10_000 });
    expect(calls).toHaveLength(1);

    now = 56 * 60 * 1000;
    await getAmazonCreatorsAccessToken({ config, fetchImpl, nowMs: () => now });
    expect(calls).toHaveLength(2);
  });

  it('includes partnerTag and marketplace in GetItems headers and body', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchImpl: typeof fetch = (async (input, init) => {
      calls.push({ url: String(input), init });
      if (String(input).includes('/auth/o2/token')) {
        return jsonResponse({ access_token: 'token', expires_in: 3600 });
      }
      return jsonResponse({ itemsResult: { items: [] } });
    }) as typeof fetch;

    const client = new AmazonCreatorsClient({ config, fetchImpl });
    await client.getItems(['B0BK1421MF']);

    const apiCall = calls[1];
    expect(apiCall.url).toBe('https://creatorsapi.amazon/catalog/v1/getItems');
    expect(apiCall.init?.headers).toMatchObject({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      'x-marketplace': 'www.amazon.com',
    });
    expect(JSON.parse(String(apiCall.init?.body))).toMatchObject({
      itemIds: ['B0BK1421MF'],
      itemIdType: 'ASIN',
      marketplace: 'www.amazon.com',
      partnerTag: 'taylormadebab-20',
    });
  });

  it('rejects oversized GetItems batches', async () => {
    const client = new AmazonCreatorsClient({ config, fetchImpl: (async () => jsonResponse({})) as typeof fetch });
    await expect(client.getItems(Array.from({ length: 11 }, (_, index) => `B0000000${index}`))).rejects.toThrow(/at most 10/i);
  });

  it('refreshes an expired access token once', async () => {
    const calls: Array<{ url: string; authorization: string | null }> = [];
    let tokenCount = 0;
    let apiCount = 0;
    const fetchImpl: typeof fetch = (async (input, init) => {
      const url = String(input);
      const headers = new Headers(init?.headers);
      calls.push({ url, authorization: headers.get('Authorization') });
      if (url.includes('/auth/o2/token')) {
        tokenCount += 1;
        return jsonResponse({ access_token: `token-${tokenCount}`, expires_in: 3600 });
      }
      apiCount += 1;
      if (apiCount === 1) {
        return jsonResponse(
          { type: 'UnauthorizedException', reason: 'TokenExpired', message: 'Authentication token has expired.' },
          { status: 401 },
        );
      }
      return jsonResponse({ itemsResult: { items: [] } });
    }) as typeof fetch;

    const client = new AmazonCreatorsClient({ config, fetchImpl });
    await client.getItems(['B0BK1421MF']);

    expect(tokenCount).toBe(2);
    expect(calls.filter((call) => call.url.includes('/catalog/')).map((call) => call.authorization)).toEqual([
      'Bearer token-1',
      'Bearer token-2',
    ]);
  });

  it('backs off and retries a 429 response once', async () => {
    let apiCount = 0;
    const waits: number[] = [];
    const fetchImpl: typeof fetch = (async (input) => {
      if (String(input).includes('/auth/o2/token')) {
        return jsonResponse({ access_token: 'token', expires_in: 3600 });
      }
      apiCount += 1;
      if (apiCount === 1) {
        return jsonResponse(
          { type: 'ThrottleException', message: 'Too many requests.' },
          { status: 429, headers: { 'Retry-After': '2' } },
        );
      }
      return jsonResponse({ itemsResult: { items: [] } });
    }) as typeof fetch;
    const client = new AmazonCreatorsClient({
      config,
      fetchImpl,
      sleepImpl: async (ms) => {
        waits.push(ms);
      },
    });

    await client.getItems(['B0BK1421MF']);

    expect(apiCount).toBe(2);
    expect(waits).toEqual([2_000]);
  });

  it('classifies AssociateNotEligible and 429 errors', () => {
    expect(classifyAmazonCreatorsError(new AmazonCreatorsApiError({
      status: 403,
      reason: 'AssociateNotEligible',
      retryAfterSeconds: null,
      responseBody: {},
      message: 'not eligible',
    }))).toBe('ASSOCIATE_NOT_ELIGIBLE');

    expect(classifyAmazonCreatorsError(new AmazonCreatorsApiError({
      status: 429,
      reason: 'TooManyRequests',
      retryAfterSeconds: 30,
      responseBody: {},
      message: 'too many requests',
    }))).toBe('RATE_LIMITED');
  });
});
