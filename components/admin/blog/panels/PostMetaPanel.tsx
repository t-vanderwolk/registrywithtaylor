import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { BLOG_CATEGORIES, type BlogCategory } from '@/lib/blogCategories';

const formatDateTime = (value?: Date | string) => {
  if (!value) {
    return 'Not saved yet';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function PostMetaPanel({
  slug,
  category,
  featured,
  createdAt,
  updatedAt,
  onSlugChange,
  onCategoryChange,
  onToggleFeatured,
}: {
  slug: string;
  category: BlogCategory;
  featured: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  onSlugChange: (value: string) => void;
  onCategoryChange: (value: BlogCategory) => void;
  onToggleFeatured: (value: boolean) => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Metadata</p>
        <h2 className="admin-h2">Routing details</h2>
        <p className="admin-body">Keep the slug readable and the category aligned with the article theme.</p>
      </div>

      <AdminField label="Slug" htmlFor="post-slug" help="If left empty, the API will generate one from the title.">
        <AdminInput
          id="post-slug"
          value={slug}
          onChange={(event) => onSlugChange(event.target.value)}
          placeholder="auto-generated-on-save"
        />
      </AdminField>

      <AdminField label="Category" htmlFor="post-category">
        <AdminSelect
          id="post-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as BlogCategory)}
        >
          {BLOG_CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <label className="admin-toggle" htmlFor="post-featured">
        <input
          id="post-featured"
          type="checkbox"
          checked={featured}
          onChange={(event) => onToggleFeatured(event.target.checked)}
        />
        <span>{featured ? 'Featured on homepage' : 'Not featured on homepage'}</span>
      </label>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Created: {formatDateTime(createdAt)}</p>
        <p className="admin-micro">Updated: {formatDateTime(updatedAt)}</p>
      </div>
    </AdminSurface>
  );
}
