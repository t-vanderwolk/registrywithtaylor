import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const analytics = await getBlogRevenueAnalytics();
  return NextResponse.json(analytics);
}
