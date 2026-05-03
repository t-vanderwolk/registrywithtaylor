import { notFound } from 'next/navigation';
import GuideEditor from '@/components/admin/guides/GuideEditor';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { getGuidePublicPath, isAcademyPublicPath } from '@/lib/guides/publicPath';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { guideEditorSelect, toGuideEditorRecord } from '@/lib/server/guideEditorRecord';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { listGuideRelationOptions } from '@/lib/server/guides';
import { listImageMediaLibrary } from '@/lib/server/mediaLibrary';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type EditAcademyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAcademyPage({ params }: EditAcademyPageProps) {
  const { id } = await params;
  let guide = null;
  try {
    guide = await prisma.guide.findUnique({
      where: { id },
      select: guideEditorSelect,
    });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return (
        <AdminStack gap="xl">
          <AdminHeader
            eyebrow="Academy"
            title="Academy editor"
            subtitle="Academy editing is blocked until the learning-content tables exist in the database."
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

  const [authorOptions, affiliatePartnerOptions, relatedGuideOptions, mediaLibrary] = await Promise.all([
    listBlogAuthorOptions(),
    listAffiliatePartnerOptions(),
    listGuideRelationOptions(id),
    listImageMediaLibrary(),
  ]);
  const publicPath = getGuidePublicPath({
    slug: guide.slug,
    topicCluster: guide.topicCluster,
    canonicalUrl: guide.canonicalUrl,
  });
  const isAcademyGuide = isAcademyPublicPath(publicPath);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow={isAcademyGuide ? 'Academy' : 'Learning Content'}
        title={guide.title?.trim() ? guide.title : 'Untitled learning content'}
        subtitle={
          isAcademyGuide
            ? 'This Academy page lives on the shared learning-content model. Keep the route metadata and module structure aligned here.'
            : 'Autosave is enabled. Keep structure, metadata, commerce modules, and conversion layers in one learning-content workspace.'
        }
      />

      <GuideEditor
        key={guide.id}
        initialGuide={toGuideEditorRecord(guide)}
        authorOptions={authorOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        relatedGuideOptions={relatedGuideOptions}
        mediaLibrary={mediaLibrary}
        adminBasePath="/admin/academy"
        listingHref="/admin/academy"
        editorVariant={isAcademyGuide ? 'academyModule' : 'learningContent'}
      />
    </AdminStack>
  );
}
