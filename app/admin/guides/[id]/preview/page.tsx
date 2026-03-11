import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import GuideArticleView from '@/components/guides/GuideArticleView';
import { toGuideCardItemFromGuide } from '@/lib/guides/presentation';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { isGuidePubliclyVisible } from '@/lib/guides/status';
import { guideArticleSelect, toGuideArticleRecord } from '@/lib/server/guideArticleRecord';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import prisma from '@/lib/server/prisma';
import '../../../../../styles/blog.css';

export const dynamic = 'force-dynamic';

type AdminGuidePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGuidePreviewPage({ params }: AdminGuidePreviewPageProps) {
  const { id } = await params;

  let guide = null;
  try {
    guide = await prisma.guide.findUnique({
      where: { id },
      select: guideArticleSelect,
    });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return (
        <AdminStack gap="xl">
          <AdminHeader
            eyebrow="Preview"
            title="Guide preview"
            subtitle="Guide previews are blocked until the Guide tables exist in the database."
          />
          <GuideStorageNotice backHref="/admin/guides" backLabel="Back to guides" />
        </AdminStack>
      );
    }

    throw error;
  }

  if (!guide) {
    notFound();
  }

  try {
    await logGuideEvent({
      guideId: guide.id,
      event: GuideAnalyticsEvents.GUIDE_PREVIEWED,
      sourceRoute: `/admin/guides/${guide.id}/preview`,
      meta: {
        guide_id: guide.id,
        guide_title: guide.title,
        guide_slug: guide.slug,
        guide_category: guide.category,
        author_id: guide.author.id,
        status: guide.status,
        source_route: `/admin/guides/${guide.id}/preview`,
      },
    });
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      throw error;
    }
  }

  let relatedGuides: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    category: string;
    heroImageUrl: string | null;
    heroImageAlt: string | null;
  }> = [];
  if (guide.relatedGuideIds.length > 0) {
    try {
      relatedGuides = await prisma.guide.findMany({
        where: {
          id: {
            in: guide.relatedGuideIds,
          },
        },
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        select: {
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          heroImageUrl: true,
          heroImageAlt: true,
        },
      });
    } catch (error) {
      if (!isGuideStorageUnavailableError(error)) {
        throw error;
      }
    }
  }

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Preview"
        title={guide.title?.trim() ? guide.title : 'Untitled guide'}
        subtitle="This preview uses the public guide renderer without incrementing public view analytics."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href={`/admin/guides/${guide.id}/edit`}>Back to editor</Link>
            </AdminButton>
            {isGuidePubliclyVisible(guide.status, guide.scheduledFor) ? (
              <AdminButton asChild variant="ghost">
                <Link href={`/guides/${guide.slug}`} target="_blank">
                  View public guide
                </Link>
              </AdminButton>
            ) : null}
          </>
        }
      />

      <GuideArticleView
        guide={toGuideArticleRecord(guide)}
        relatedGuides={relatedGuides.map((entry) => toGuideCardItemFromGuide(entry))}
        preview
      />
    </AdminStack>
  );
}
