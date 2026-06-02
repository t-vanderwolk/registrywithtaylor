import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrReviewer, unauthorizedResponse } from '@/lib/server/apiAuth';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = await requireAdminOrReviewer(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const analytics = await getBlogRevenueAnalytics();
  return NextResponse.json(analytics);
}
