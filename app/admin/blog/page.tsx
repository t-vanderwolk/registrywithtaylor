import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import BlogWorkspace from '@/components/admin/blog/BlogWorkspace';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminBlogIndex() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      deck: true,
      excerpt: true,
      status: true,
      publishedAt: true,
      scheduledFor: true,
      archivedAt: true,
      featured: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title="Posts workspace"
        subtitle="Search, duplicate, preview, and ship from one screen."
      />

      <AdminSurface className="admin-stack">
        <BlogWorkspace
          posts={posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            deck: post.deck,
            excerpt: post.excerpt,
            status: post.status,
            publishedAt: post.publishedAt?.toISOString() ?? null,
            scheduledFor: post.scheduledFor?.toISOString() ?? null,
            archivedAt: post.archivedAt?.toISOString() ?? null,
            featured: post.featured,
            published: post.published,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            authorLabel: post.author.email,
          }))}
        />
      </AdminSurface>
    </AdminStack>
  );
}
