import BlogDraftEditor from '@/components/admin/BlogDraftEditor';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { createDraft } from '@/lib/admin/blogStore';

export const dynamic = 'force-dynamic';

export default async function NewDraftPage() {
  const draft = await createDraft();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title="New draft"
        subtitle="Start with confidence. Then refine with calm editorial cadence."
      />
      <AdminSurface>
        <BlogDraftEditor draftId={draft.id} initialDraft={draft} />
      </AdminSurface>
    </AdminStack>
  );
}
