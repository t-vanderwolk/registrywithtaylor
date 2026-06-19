import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stroller Matchmaker — data layer scaffold.
 *
 * Returns ALL StrollerSpec records joined with Stroller. Filtering is DISABLED
 * (`filtered: false`) until the StrollerSpec quiz-dimension fields are manually
 * curated — they are null on every row right now, so any filter would drop
 * everything. The query params are parsed and documented below so the UI session
 * can wire them up once specs are seeded.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  // Parsed now, applied later. TODO for each:
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const _lifestyle = sp.getAll('lifestyle'); // TODO: keep specs whose `lifestyle` String[] overlaps ANY of these ("city"|"suburban"|"trail"|"travel")
  const _budget = sp.get('budget'); //            TODO: keep specs where `priceRange` === budget ("budget"|"mid"|"premium"|"luxury")
  const _foldType = sp.get('foldType'); //         TODO: keep specs where `foldType` === foldType, unless "any"
  const _expandable = sp.get('expandable'); //     TODO: keep specs where `isExpandable` === (expandable === "yes"), unless "any"
  const _jogging = sp.get('jogging'); //           TODO: keep specs where `suitableForJogging` === (jogging === "yes"), unless "any"
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const specs = await prisma.strollerSpec.findMany({
    include: { stroller: true },
    orderBy: { updatedAt: 'desc' },
  });

  const results = specs.map((spec) => ({
    id: spec.stroller.id,
    name: spec.stroller.displayName ?? `${spec.stroller.brand} ${spec.stroller.model}`,
    brand: spec.stroller.brand,
    babylistUrl: spec.babylistUrl ?? spec.stroller.babylistUrl ?? null,
    babylistPrice: spec.babylistPrice ?? spec.stroller.babylistPrice ?? null,
    babylistImage: spec.babylistImage ?? spec.stroller.babylistImage ?? null,
    spec,
  }));

  return NextResponse.json({ results, total: results.length, filtered: false });
}
