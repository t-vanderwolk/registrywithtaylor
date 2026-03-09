import PostEditor from '@/components/admin/PostEditor';
import { DEFAULT_BLOG_CATEGORY } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import { listAffiliateBrandOptions } from '@/lib/server/affiliateBrands';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const [affiliateBrandOptions, affiliatePartnerOptions] = await Promise.all([
    listAffiliateBrandOptions(),
    prisma.affiliatePartner.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        network: true,
        logoUrl: true,
      },
    }),
  ]);

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
        }}
        affiliateBrandOptions={affiliateBrandOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
      />
    </AdminStack>
  );
}
