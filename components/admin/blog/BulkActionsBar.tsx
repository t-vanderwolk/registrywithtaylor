import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { BLOG_STAGE_LABELS, type BlogStageValue } from '@/lib/blog/postStage';

export default function BulkActionsBar({
  selectedCount,
  categoryOptions,
  onApplyStage,
  onApplyCategory,
  onPublish,
  onUnpublish,
  onArchive,
  onUnarchive,
}: {
  selectedCount: number;
  categoryOptions: string[];
  onApplyStage: (value: BlogStageValue) => void;
  onApplyCategory: (value: string) => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
}) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <AdminSurface className="admin-stack gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Bulk actions</p>
          <p className="admin-body">{selectedCount} post{selectedCount === 1 ? '' : 's'} selected.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[180px]">
            <AdminSelect
              aria-label="Set stage for selected posts"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) {
                  onApplyStage(event.target.value as BlogStageValue);
                  event.target.value = '';
                }
              }}
            >
              <option value="">Set stage…</option>
              {Object.entries(BLOG_STAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div className="min-w-[180px]">
            <AdminSelect
              aria-label="Set category for selected posts"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) {
                  onApplyCategory(event.target.value);
                  event.target.value = '';
                }
              }}
            >
              <option value="">Set category…</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </AdminSelect>
          </div>

          <AdminButton size="sm" variant="secondary" onClick={onPublish}>
            Publish
          </AdminButton>
          <AdminButton size="sm" variant="secondary" onClick={onUnpublish}>
            Unpublish
          </AdminButton>
          <AdminButton size="sm" variant="secondary" onClick={onUnarchive}>
            Unarchive
          </AdminButton>
          <AdminButton size="sm" variant="danger" onClick={onArchive}>
            Archive
          </AdminButton>
        </div>
      </div>
    </AdminSurface>
  );
}
