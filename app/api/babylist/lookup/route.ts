import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BabylistFields = {
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
};

const EMPTY: BabylistFields = { babylistUrl: null, babylistPrice: null, babylistImage: null };

/**
 * GET /api/babylist/lookup?items=Brand:::Model,Brand:::Model
 *
 * Returns the synced Babylist fields for each stroller, keyed by the exact
 * "Brand:::Model" string passed in. Used by the Stroller Matchmaker quiz to show
 * a live price + Babylist shop link on its recommended picks. Public (prices are
 * public); unmatched products come back as nulls so the caller can fall back.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('items') ?? '';
  const pairs = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [brand = '', model = ''] = s.split(':::');
      return { key: s, brand: brand.trim(), model: model.trim() };
    })
    .filter((p) => p.brand && p.model);

  if (pairs.length === 0) return NextResponse.json({ results: {} });

  const rows = await prisma.stroller
    .findMany({
      select: {
        brand: true,
        model: true,
        babylistUrl: true,
        babylistPrice: true,
        babylistImage: true,
      },
    })
    .catch(() => [] as Array<{ brand: string; model: string } & BabylistFields>);

  const byKey = new Map<string, BabylistFields>();
  for (const r of rows) {
    byKey.set(`${r.brand.toLowerCase()}:::${r.model.toLowerCase()}`, {
      babylistUrl: r.babylistUrl,
      babylistPrice: r.babylistPrice,
      babylistImage: r.babylistImage,
    });
  }

  const results: Record<string, BabylistFields> = {};
  for (const p of pairs) {
    results[p.key] = byKey.get(`${p.brand.toLowerCase()}:::${p.model.toLowerCase()}`) ?? EMPTY;
  }

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
