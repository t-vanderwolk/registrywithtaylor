import { notFound } from 'next/navigation';
import GuideEditor from '@/components/admin/guides/GuideEditor';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { guideEditorSelect, toGuideEditorRecord } from '@/lib/server/guideEditorRecord';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { listGuideRelationOptions } from '@/lib/server/guides';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type EditGuidePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditGuidePage({ params }: EditGuidePageProps) {
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
            eyebrow="Guides"
            title="Guide editor"
            subtitle="Guide editing is blocked until the Guide tables exist in the database."
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

  const [authorOptions, affiliatePartnerOptions, relatedGuideOptions] = await Promise.all([
    listBlogAuthorOptions(),
    listAffiliatePartnerOptions(),
    listGuideRelationOptions(id),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Guides"
        title={guide.title?.trim() ? guide.title : 'Untitled guide'}
        subtitle="Autosave is enabled. Keep the guide structure, metadata, commerce modules, and conversion layer in one workspace."
      />

      <GuideEditor
        key={guide.id}
        initialGuide={toGuideEditorRecord(guide)}
        authorOptions={authorOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        relatedGuideOptions={relatedGuideOptions}
      />
    </AdminStack>
  );
}
