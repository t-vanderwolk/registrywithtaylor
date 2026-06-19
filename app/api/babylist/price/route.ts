import { NextRequest, NextResponse } from 'next/server';
import { getBabylistItem } from '@/lib/impact/client';

export const runtime = 'nodejs';
// Cache responses for 1 hour (prices are public and change slowly).
export const revalidate = 3600;

// ── Simple in-memory rate limiter: 30 requests / minute per IP ──────────────────
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const sku = request.nextUrl.searchParams.get('sku')?.trim();
  if (!sku) {
    return NextResponse.json({ error: 'Missing required ?sku param' }, { status: 400 });
  }

  let item;
  try {
    item = await getBabylistItem(sku);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lookup failed' },
      { status: 502 },
    );
  }

  if (!item) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const price = Number.parseFloat(item.CurrentPrice);
  const originalPriceParsed = Number.parseFloat(item.OriginalPrice);

  return NextResponse.json(
    {
      price: Number.isFinite(price) ? price : null,
      originalPrice: Number.isFinite(originalPriceParsed) ? originalPriceParsed : null,
      inStock: item.StockAvailability === 'InStock',
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
