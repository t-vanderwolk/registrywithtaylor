import { notFound } from 'next/navigation';
import BlogDraftEditor from '@/components/admin/BlogDraftEditor';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type EditDraftProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDraftPage({ params }: EditDraftProps) {
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
      createdAt: true,
      updatedAt: true,
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
        <BlogDraftEditor draftId={post.id} initialDraft={post} />
      </AdminSurface>
    </AdminStack>
  );
}
