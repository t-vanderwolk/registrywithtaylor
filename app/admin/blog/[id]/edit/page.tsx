import { notFound } from 'next/navigation';
import BlogDraftEditor from '@/components/admin/BlogDraftEditor';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { getDraftById } from '@/lib/admin/blogStore';

export const dynamic = 'force-dynamic';

type EditDraftProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDraftPage({ params }: EditDraftProps) {
  const { id } = await params;
  const draft = await getDraftById(id);

  if (!draft) notFound();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title={draft.title?.trim() ? draft.title : 'Untitled draft'}
        subtitle="Local draft mode with autosave and manual publish status."
      />
      <AdminSurface>
        <BlogDraftEditor draftId={draft.id} initialDraft={draft} />
      </AdminSurface>
    </AdminStack>
  );
}
