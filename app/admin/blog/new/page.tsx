import PostEditor from '@/components/admin/PostEditor';
import { DEFAULT_BLOG_CATEGORY, normalizeBlogCategory } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { generateUniqueSlug } from '@/lib/server/blog';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const session = await requireAdminSession();
  const slug = await generateUniqueSlug(`untitled-post-${Date.now()}`);

  const post = await prisma.post.create({
    data: {
      title: 'Untitled post',
      slug,
      category: DEFAULT_BLOG_CATEGORY,
      excerpt: '',
      coverImage: '',
      featuredImageId: null,
      content: 'Start writing...',
      published: false,
      authorId: session.user.id,
    },
  });

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
        eyebrow="Blog"
        title="New post"
        subtitle="Start with confidence. Then refine with calm editorial cadence."
      />
      <AdminSurface>
        <PostEditor
          postId={post.id}
          initialPost={{
            ...post,
            category: normalizeBlogCategory(post.category),
            featuredImage: null,
            media: [],
            mediaIds: [],
            affiliateIds: [],
          }}
          affiliateOptions={affiliateOptions}
        />
      </AdminSurface>
    </AdminStack>
  );
}
