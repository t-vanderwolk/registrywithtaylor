import { serializeSitemapIndex, sitemapResponse } from '@/lib/seo/sitemaps';

export function GET() {
  return sitemapResponse(serializeSitemapIndex());
}
