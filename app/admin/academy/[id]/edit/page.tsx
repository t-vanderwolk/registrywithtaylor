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

type EditAcademyModulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAcademyModulePage({ params }: EditAcademyModulePageProps) {
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
            title="Academy module editor"
            subtitle="Academy editing is blocked until the Guide tables exist in the database."
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

  const [authorOptions, affiliatePartnerOptions, relatedGuideOptions] = await Promise.all([
    listBlogAuthorOptions(),
    listAffiliatePartnerOptions(),
    listGuideRelationOptions(id),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy"
        title={guide.title?.trim() ? guide.title : 'Untitled module'}
        subtitle="This reuses the live guide editor so academy modules keep the same autosave, metadata, commerce, and conversion tooling."
      />

      <GuideEditor
        key={guide.id}
        initialGuide={toGuideEditorRecord(guide)}
        authorOptions={authorOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        relatedGuideOptions={relatedGuideOptions}
        adminBasePath="/admin/academy"
        listingHref="/admin/academy"
      />
    </AdminStack>
  );
}
