import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  findFirst: vi.fn(),
  lock: vi.fn(),
  visitor: vi.fn(),
}));

vi.mock('@/lib/server/prisma', () => ({
  default: {
    $transaction: async (callback: (tx: unknown) => unknown) => callback({ outboundClick: { create: mocks.create, findFirst: mocks.findFirst }, $executeRaw: mocks.lock }),
    outboundClick: {
      create: mocks.create,
      findFirst: mocks.findFirst,
    },
  },
}));

vi.mock('@/lib/server/rateLimit', () => ({
  consumeRateLimit: () => ({ allowed: true, remaining: 119, retryAfterSeconds: 0 }),
}));

vi.mock('@/lib/server/viewTracking', () => ({
  getRequestIp: () => null,
  isLikelyBot: () => false,
  visitorHashFrom: mocks.visitor,
}));

import { POST } from '@/app/api/affiliate/click/route';

function clickRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/affiliate/click', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 Test Browser',
    },
    body: JSON.stringify(body),
  });
}

describe('affiliate click API normalization', () => {
  beforeEach(() => {
    mocks.create.mockReset();
    mocks.findFirst.mockReset();
    mocks.lock.mockReset();
    mocks.visitor.mockReset();
    mocks.visitor.mockReturnValue(null);
    mocks.create.mockResolvedValue({ id: 'click-1' });
  });

  it('stores an Amazon adapter click with canonical retailer/network and placement source', async () => {
    const response = await POST(clickRequest({
      url: 'https://amzn.to/4hdEYM0',
      retailer: 'adapter',
      source: 'tool:travel-system-checker',
      product: 'Car seat adapter',
    }));

    expect(response.status).toBe(200);
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        retailer: 'Amazon',
        network: 'Amazon Associates',
        source: 'tool:travel-system-checker:adapter',
        product: 'Car seat adapter',
      }),
    });
    await expect(response.json()).resolves.toMatchObject({ counted: true, retailer: 'Amazon' });
  });

  it('stores lowercase Babylist and MacroBaby labels canonically', async () => {
    await POST(clickRequest({
      url: 'https://babylist.pxf.io/example',
      retailer: 'babylist',
      source: 'tool:stroller-quiz',
    }));
    await POST(clickRequest({
      url: 'https://www.macrobaby.com/products/example',
      retailer: 'macrobaby',
      source: 'tool:stroller-finder',
    }));

    expect(mocks.create).toHaveBeenNthCalledWith(1, {
      data: expect.objectContaining({ retailer: 'Babylist', network: 'Impact' }),
    });
    expect(mocks.create).toHaveBeenNthCalledWith(2, {
      data: expect.objectContaining({ retailer: 'MacroBaby', network: 'Shopify' }),
    });
  });
});

it('locks before checking for a concurrent duplicate and does not insert it', async () => {
  mocks.visitor.mockReturnValue('visitor');
  mocks.findFirst.mockResolvedValue({ id: 'existing' });
  mocks.create.mockClear();
  const response = await POST(clickRequest({ url: 'https://amzn.to/test' }));
  expect(mocks.lock).toHaveBeenCalled();
  expect(mocks.lock.mock.invocationCallOrder.at(-1)).toBeLessThan(mocks.findFirst.mock.invocationCallOrder.at(-1)!);
  expect(mocks.create).not.toHaveBeenCalled();
  expect(await response.json()).toMatchObject({ counted: false, reason: 'dup' });
});
