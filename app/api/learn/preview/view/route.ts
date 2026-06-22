import { NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { GuideAnalyticsEvents } from '@/lib/guides/events';

const PREVIEW_MODULE_SLUGS = [
  'art-of-the-registry',
  'nursery-foundations',
  'stroller-foundations',
] as const;

type PreviewModuleSlug = (typeof PREVIEW_MODULE_SLUGS)[number];

const PREVIEW_MODULE_META: Record<PreviewModuleSlug, { title: string }> = {
  'art-of-the-registry': { title: 'The Art of the Registry' },
  'nursery-foundations': { title: 'Nursery Foundations' },
  'stroller-foundations': { title: 'The Stroller Equation' },
};

function isPreviewSlug(value: unknown): value is PreviewModuleSlug {
  return PREVIEW_MODULE_SLUGS.includes(value as PreviewModuleSlug);
}

// POST /api/learn/preview/view
// Logs a view event for a free preview lesson.
// Upserts a Guide record on first call so tracking works without a separate seed step.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { slug, visitorHash } = body as { slug?: unknown; visitorHash?: unknown };

  if (!isPreviewSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const meta = PREVIEW_MODULE_META[slug];
  const canonicalUrl = `/learn/${slug}`;
  const guideSlug = `preview-${slug}`;

  // Find or lazily create the Guide record for this preview module
  let guide = await prisma.guide.findFirst({
    where: { canonicalUrl: { equals: canonicalUrl, mode: 'insensitive' } },
    select: { id: true },
  });

  if (!guide) {
    const author = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (!author) {
      // No admin user found — skip tracking gracefully
      return NextResponse.json({ ok: false, reason: 'no_author' });
    }

    guide = await prisma.guide.upsert({
      where: { slug: guideSlug },
      update: {},
      create: {
        slug: guideSlug,
        title: meta.title,
        content: '',
        category: 'Preview Module',
        topicCluster: 'TMBC Preview Module',
        canonicalUrl,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
      },
      select: { id: true },
    });
  }

  await logGuideEvent({
    guideId: guide.id,
    event: GuideAnalyticsEvents.VIEW,
    sourceRoute: canonicalUrl,
    visitorHash: typeof visitorHash === 'string' ? visitorHash : null,
  });

  return NextResponse.json({ ok: true });
}
