import PostEditor from '@/components/admin/PostEditor';
import { DEFAULT_BLOG_CATEGORY } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const affiliateOptions = await prisma.affiliatePartner.findMany({
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      network: true,
    },
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="New draft"
        subtitle="Nothing is created in Prisma until the first save or autosave flush."
      />

      <PostEditor
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
          coverImage: null,
          featuredImageId: null,
          featuredImage: null,
          content: '',
          media: [],
          mediaIds: [],
          status: 'DRAFT',
          publishedAt: null,
          scheduledFor: null,
          archivedAt: null,
          featured: false,
          published: false,
          affiliateIds: [],
        }}
        affiliateOptions={affiliateOptions}
      />
    </AdminStack>
  );
}
