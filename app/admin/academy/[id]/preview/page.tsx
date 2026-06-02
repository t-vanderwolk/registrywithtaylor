import Link from 'next/link';
import { notFound } from 'next/navigation';
import ModuleLayout from '@/components/academy/ModuleLayout';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import GuideArticleView from '@/components/guides/GuideArticleView';
import { getGuidePublicPath } from '@/lib/guides/publicPath';
import { toGuideCardItemFromGuide } from '@/lib/guides/presentation';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { isGuidePubliclyVisible } from '@/lib/guides/status';
import { guideArticleSelect, toGuideArticleRecord } from '@/lib/server/guideArticleRecord';
import { getAcademyPreviewModuleFromGuide } from '@/lib/server/academyGuides';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import prisma from '@/lib/server/prisma';
import { requireAdminViewSession } from '@/lib/server/session';
import '../../../../../styles/blog.css';

export const dynamic = 'force-dynamic';

type AdminAcademyPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAcademyPreviewPage({ params }: AdminAcademyPreviewPageProps) {
  const session = await requireAdminViewSession();
  const readOnly = session.user.role === 'REVIEWER';
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
            title="Academy preview"
            subtitle="Previews are blocked until the learning-content tables exist in the database."
          />
          <GuideStorageNotice backHref="/admin/academy" backLabel="Back to academy" />
        </AdminStack>
      );
    }

    throw error;
  }

  if (!guide) {
    notFound();
  }

  const guideRecord = toGuideArticleRecord(guide);
  const publicPath = getGuidePublicPath({
    slug: guide.slug,
    topicCluster: guide.topicCluster,
    canonicalUrl: guide.canonicalUrl,
  });
  const academyModuleRecord = await getAcademyPreviewModuleFromGuide(guideRecord);
  const academyModule = academyModuleRecord
    ? {
        ...academyModuleRecord,
        trackingGuideId: null,
      }
    : null;

  if (!readOnly) {
    try {
      await logGuideEvent({
        guideId: guide.id,
        event: GuideAnalyticsEvents.GUIDE_PREVIEWED,
        sourceRoute: `/admin/academy/${guide.id}/preview`,
        meta: {
          guide_id: guide.id,
          guide_title: guide.title,
          guide_slug: guide.slug,
          guide_category: guide.category,
          author_id: guide.author.id,
          status: guide.status,
          source_route: `/admin/academy/${guide.id}/preview`,
        },
      });
    } catch (error) {
      if (!isGuideStorageUnavailableError(error)) {
        throw error;
      }
    }
  }

  let relatedGuides: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    category: string;
    topicCluster: string | null;
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
          topicCluster: true,
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
        title={guide.title?.trim() ? guide.title : 'Untitled learning content'}
        subtitle="This preview uses the public learning-content renderer without incrementing public view analytics."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/academy">{readOnly ? 'Back to Academy structure' : 'Back to Academy'}</Link>
            </AdminButton>
            {!readOnly ? (
              <AdminButton asChild variant="secondary">
                <Link href={`/admin/academy/${guide.id}/edit`}>Back to editor</Link>
              </AdminButton>
            ) : null}
            {isGuidePubliclyVisible(guide.status, guide.scheduledFor) ? (
              <AdminButton asChild variant="ghost">
                <Link href={publicPath} target="_blank">
                  View public page
                </Link>
              </AdminButton>
            ) : null}
          </>
        }
      />

      {academyModule ? (
        <ModuleLayout module={academyModule} />
      ) : (
        <GuideArticleView
          guide={guideRecord}
          relatedGuides={relatedGuides.map((entry) => toGuideCardItemFromGuide(entry))}
          preview
        />
      )}
    </AdminStack>
  );
}
