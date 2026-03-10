import PostEditor from '@/components/admin/PostEditor';
import { DEFAULT_BLOG_CATEGORY } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { listAffiliateBrandOptions } from '@/lib/server/affiliateBrands';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const session = await requireAdminSession();
  const [affiliateBrandOptions, affiliatePartnerOptions, authorOptions] = await Promise.all([
    listAffiliateBrandOptions(),
    listAffiliatePartnerOptions(),
    listBlogAuthorOptions(),
  ]);
  const defaultAuthor = authorOptions.find((option) => option.id === session.user.id) ?? authorOptions[0] ?? null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="New draft"
        subtitle="Nothing is created in Prisma until the first save or autosave flush."
      />

      <PostEditor
        key="new-post-editor"
        initialPost={{
          id: null,
          title: '',
          slug: '',
          category: DEFAULT_BLOG_CATEGORY,
          stage: 'IDEA',
          deck: '',
          excerpt: '',
          focusKeyword: '',
          seoTitle: '',
          seoDescription: '',
          canonicalUrl: '',
          readingTime: 1,
          shareTitle: '',
          shareDescription: '',
          featuredImageUrl: '',
          coverImage: null,
          featuredImageId: null,
          featuredImage: null,
          content: '',
          media: [],
          mediaIds: [],
          images: [],
          status: 'DRAFT',
          publishedAt: null,
          scheduledFor: null,
          archivedAt: null,
          featured: false,
          published: false,
          affiliateBrandIds: [],
          authors: defaultAuthor ? [{ userId: defaultAuthor.id, role: 'Primary Author' }] : [],
        }}
        affiliateBrandOptions={affiliateBrandOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        authorOptions={authorOptions}
      />
    </AdminStack>
  );
}
