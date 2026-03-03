import { NextRequest, NextResponse } from 'next/server';
import { parseAdminBlogListParams, listAdminPosts } from '@/lib/server/adminBlog';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);

  if (!token) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(req.url);
  const params = parseAdminBlogListParams({
    search: searchParams.get('search') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    stage: searchParams.get('stage') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    featured: searchParams.get('featured') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? undefined,
  });

  const result = await listAdminPosts(params);
  return NextResponse.json(result);
}
