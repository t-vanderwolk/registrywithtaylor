import GuideEditor from '@/components/admin/guides/GuideEditor';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { DEFAULT_GUIDE_CATEGORY } from '@/lib/guides/categories';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { isGuideStorageReady, listGuideRelationOptions } from '@/lib/server/guides';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export default async function NewGuidePage() {
  const session = await requireAdminSession();
  const storageReady = await isGuideStorageReady();

  if (!storageReady) {
    return (
      <AdminStack gap="xl">
        <AdminHeader
          eyebrow="Guides"
          title="New guide draft"
          subtitle="Guide editing is blocked until the Guide tables exist in the database."
        />
        <GuideStorageNotice backHref="/admin/guides" backLabel="Back to guides" />
      </AdminStack>
    );
  }

  const [authorOptions, affiliatePartnerOptions, relatedGuideOptions] = await Promise.all([
    listBlogAuthorOptions(),
    listAffiliatePartnerOptions(),
    listGuideRelationOptions(),
  ]);
  const defaultAuthor = authorOptions.find((option) => option.id === session.user.id) ?? authorOptions[0] ?? null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Guides"
        title="New guide draft"
        subtitle="Nothing is written to Prisma until the first save or autosave flush."
      />

      <GuideEditor
        key="new-guide-editor"
        initialGuide={{
          id: null,
          title: '',
          slug: '',
          excerpt: '',
          intro: '',
          content: '',
          conclusion: '',
          heroImageUrl: '',
          heroImageAlt: '',
          authorId: defaultAuthor?.id ?? '',
          authorLabel: defaultAuthor?.name ?? '',
          category: DEFAULT_GUIDE_CATEGORY,
          topicCluster: '',
          status: 'DRAFT',
          publishedAt: null,
          scheduledFor: null,
          archivedAt: null,
          seoTitle: '',
          seoDescription: '',
          ogTitle: '',
          ogDescription: '',
          ogImageUrl: '',
          ogImageAlt: '',
          canonicalUrl: '',
          targetKeyword: '',
          secondaryKeywords: [],
          internalLinkNotes: '',
          tableOfContentsEnabled: true,
          faqItems: [],
          affiliateDisclosureEnabled: true,
          affiliateDisclosureText: '',
          affiliateDisclosurePlacement: 'before_affiliates',
          affiliateModules: [],
          consultationCtaEnabled: true,
          consultationCtaLabel: 'Book a Consultation',
          newsletterCtaEnabled: false,
          newsletterCtaLabel: '',
          newsletterCtaDescription: '',
          newsletterCtaHref: '',
          nextStepCtaLabel: 'Explore related guides',
          nextStepCtaHref: '/guides',
          founderSignatureEnabled: false,
          founderSignatureText: '',
          relatedGuideIds: [],
          views: 0,
        }}
        authorOptions={authorOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        relatedGuideOptions={relatedGuideOptions}
      />
    </AdminStack>
  );
}
