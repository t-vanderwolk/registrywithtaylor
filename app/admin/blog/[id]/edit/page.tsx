import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type EditPostProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      content: true,
      published: true,
      affiliates: {
        select: {
          affiliateId: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const affiliateOptions = await prisma.affiliatePartner.findMany({
    where: { isActive: true },
    orderBy: [{ network: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      network: true,
    },
  });

  if (!post) notFound();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title={post.title?.trim() ? post.title : 'Untitled post'}
        subtitle="Autosave is enabled. Publish when you are ready."
      />
      <AdminSurface>
        <PostEditor
          postId={post.id}
          initialPost={{ ...post, affiliateIds: post.affiliates.map((entry) => entry.affiliateId) }}
          affiliateOptions={affiliateOptions}
        />
      </AdminSurface>
    </AdminStack>
  );
}
