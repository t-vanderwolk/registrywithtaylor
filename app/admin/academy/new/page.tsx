import GuideEditor from '@/components/admin/guides/GuideEditor';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { DEFAULT_GUIDE_CATEGORY } from '@/lib/guides/categories';
import { getAcademyEditorSeedByPath } from '@/lib/server/academyEditorWorkspace';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { isGuideStorageReady, listGuideRelationOptions } from '@/lib/server/guides';
import { listImageMediaLibrary } from '@/lib/server/mediaLibrary';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function asSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewAcademyPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await requireAdminSession();
  const storageReady = await isGuideStorageReady();

  if (!storageReady) {
    return (
      <AdminStack gap="xl">
        <AdminHeader
          eyebrow="Academy"
          title="New learning content draft"
          subtitle="Academy editing is blocked until the learning-content tables exist in the database."
        />
        <GuideStorageNotice backHref="/admin/academy" backLabel="Back to academy" />
      </AdminStack>
    );
  }

  const params = searchParams ? await searchParams : undefined;
  const academySeed = getAcademyEditorSeedByPath(asSingle(params?.path));
  const [authorOptions, affiliatePartnerOptions, relatedGuideOptions, mediaLibrary] = await Promise.all([
    listBlogAuthorOptions(),
    listAffiliatePartnerOptions(),
    listGuideRelationOptions(),
    listImageMediaLibrary(),
  ]);
  const defaultAuthor = authorOptions.find((option) => option.id === session.user.id) ?? authorOptions[0] ?? null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy"
        title={academySeed ? `New ${academySeed.title} draft` : 'New learning content draft'}
        subtitle={
          academySeed
            ? `This draft is preloaded for ${academySeed.publicPath}, so the canonical Academy route is already locked in.`
            : 'Create Academy and learning-content records in one workspace. Nothing is written to Prisma until the first save or autosave flush.'
        }
      />

      <GuideEditor
        key={academySeed?.publicPath ?? 'new-academy-editor'}
        initialGuide={{
          id: null,
          title: academySeed?.title ?? '',
          slug: academySeed?.slug ?? '',
          excerpt: academySeed?.description ?? '',
          intro: '',
          content: '',
          conclusion: '',
          heroImageUrl: '',
          heroImageAlt: '',
          authorId: defaultAuthor?.id ?? '',
          authorLabel: defaultAuthor?.name ?? '',
          category: academySeed?.category ?? DEFAULT_GUIDE_CATEGORY,
          topicCluster: academySeed?.topicCluster ?? '',
          status: 'DRAFT',
          publishedAt: null,
          scheduledFor: null,
          archivedAt: null,
          seoTitle: academySeed?.title ?? '',
          seoDescription: academySeed?.description ?? '',
          ogTitle: academySeed?.title ?? '',
          ogDescription: academySeed?.description ?? '',
          ogImageUrl: '',
          ogImageAlt: '',
          canonicalUrl: academySeed?.publicPath ?? '',
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
          consultationCtaLabel: 'Book a Registry Consult',
          newsletterCtaEnabled: false,
          newsletterCtaLabel: '',
          newsletterCtaDescription: '',
          newsletterCtaHref: '',
          nextStepCtaLabel: academySeed ? 'Continue through the Academy' : 'Explore related learning content',
          nextStepCtaHref: academySeed ? '/academy' : '/learn',
          founderSignatureEnabled: false,
          founderSignatureText: '',
          relatedGuideIds: [],
          views: 0,
        }}
        authorOptions={authorOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        relatedGuideOptions={relatedGuideOptions}
        mediaLibrary={mediaLibrary}
        adminBasePath="/admin/academy"
        listingHref="/admin/academy"
        editorVariant={academySeed ? 'academyModule' : 'learningContent'}
      />
    </AdminStack>
  );
}
