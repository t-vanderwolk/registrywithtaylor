import { getSitemapEntries } from '@/lib/server/sitemaps';
import { isSitemapName, serializeSitemap, sitemapResponse } from '@/lib/seo/sitemaps';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!isSitemapName(name)) return new Response('Not found', { status: 404 });

  try {
    const entries = await getSitemapEntries(name);
    if (!entries.length) throw new Error('Sitemap source returned no public URLs.');
    return sitemapResponse(serializeSitemap(entries));
  } catch (error) {
    console.error(`Failed to build ${name}.`, error);
    return new Response('Sitemap temporarily unavailable', {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Retry-After': '600' },
    });
  }
}
