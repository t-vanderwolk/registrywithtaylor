import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export default function PostMiniPreviewCard({
  title,
  excerpt,
  slug,
  canPreview,
  onOpenPreview,
}: {
  title: string;
  excerpt: string | null;
  slug: string;
  canPreview: boolean;
  onOpenPreview: () => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Preview</p>
        <h2 className="admin-h2">Open the full article view</h2>
        <p className="admin-body">Use the admin preview route to verify the exact article renderer before publishing.</p>
      </div>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="font-serif text-lg leading-tight text-admin">{title || 'Untitled post'}</p>
        <p className="admin-micro">{excerpt?.trim() || 'No excerpt yet.'}</p>
        <p className="admin-micro">Slug: {slug || 'auto-generated-on-save'}</p>
      </div>

      <AdminButton type="button" variant="secondary" size="sm" onClick={onOpenPreview} disabled={!canPreview}>
        Open full preview
      </AdminButton>
    </AdminSurface>
  );
}
