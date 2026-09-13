import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('@/lib/server/prisma', () => ({
  default: {
    outboundClick: {
      create: mocks.create,
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('@/lib/server/rateLimit', () => ({
  consumeRateLimit: () => ({ allowed: true, remaining: 119, retryAfterSeconds: 0 }),
}));

vi.mock('@/lib/server/viewTracking', () => ({
  getRequestIp: () => null,
  isLikelyBot: () => false,
  visitorHashFrom: () => null,
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
