import Link from 'next/link';
import { notFound } from 'next/navigation';
import ModuleLayout from '@/components/academy/ModuleLayout';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import GuideArticleView from '@/components/guides/GuideArticleView';
import { getAcademyModuleData } from '@/lib/academy/content';
import { getGuidePublicPath, isAcademyPublicPath } from '@/lib/guides/publicPath';
import { toGuideCardItemFromGuide } from '@/lib/guides/presentation';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { isGuidePubliclyVisible } from '@/lib/guides/status';
import { guideArticleSelect, toGuideArticleRecord } from '@/lib/server/guideArticleRecord';
import {
  getAcademyModuleReferenceFromGuide,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import prisma from '@/lib/server/prisma';
import '../../../../../styles/blog.css';

export const dynamic = 'force-dynamic';

type AdminAcademyPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAcademyPreviewPage({ params }: AdminAcademyPreviewPageProps) {
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
            eyebrow="Academy Preview"
            title="Academy module preview"
            subtitle="Academy previews are blocked until the Guide tables exist in the database."
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
  const academyModuleReference = getAcademyModuleReferenceFromGuide(guideRecord);
  const academyModule =
    academyModuleReference && isAcademyPublicPath(publicPath)
      ? {
          ...mergeAcademyModuleWithGuideRecord(
            await getAcademyModuleData(academyModuleReference.moduleSlug),
            guideRecord,
          ),
          trackingGuideId: null,
        }
      : null;

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
        eyebrow="Academy Preview"
        title={guide.title?.trim() ? guide.title : 'Untitled academy module'}
        subtitle="This preview uses the live academy renderer when the record maps to an academy canonical URL."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href={`/admin/academy/${guide.id}/edit`}>Back to editor</Link>
            </AdminButton>
            {isGuidePubliclyVisible(guide.status, guide.scheduledFor) ? (
              <AdminButton asChild variant="ghost">
                <Link href={publicPath} target="_blank">
                  View public module
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
