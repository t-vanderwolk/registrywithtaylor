import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';

export default function PostSeoPanel({
  focusKeyword,
  seoTitle,
  seoDescription,
  canonicalUrl,
  onFocusKeywordChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onCanonicalUrlChange,
}: {
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  onFocusKeywordChange: (value: string) => void;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">SEO</p>
        <h2 className="admin-h2">Search metadata</h2>
        <p className="admin-body">These values drive article metadata and the editor health score.</p>
      </div>

      <AdminField label="Focus keyword" htmlFor="seo-panel-focus-keyword">
        <AdminInput
          id="seo-panel-focus-keyword"
          value={focusKeyword}
          onChange={(event) => onFocusKeywordChange(event.target.value)}
          placeholder="best travel stroller"
        />
      </AdminField>

      <AdminField label="SEO title" htmlFor="seo-panel-title" help="Defaults to the article title if blank.">
        <AdminInput
          id="seo-panel-title"
          value={seoTitle}
          onChange={(event) => onSeoTitleChange(event.target.value)}
          placeholder="Best Travel Stroller for Airport Days | Taylor-Made Baby Co."
        />
      </AdminField>

      <AdminField label="Meta description" htmlFor="seo-panel-description" help="Aim for a concise summary that matches the search intent.">
        <AdminTextarea
          id="seo-panel-description"
          value={seoDescription}
          onChange={(event) => onSeoDescriptionChange(event.target.value)}
          className="min-h-[160px]"
          placeholder="A practical stroller guide for travel days, tight trunks, and everyday airport logistics."
        />
      </AdminField>

      <AdminField label="Canonical URL" htmlFor="seo-panel-canonical" help="Optional. Use only when the preferred URL should live somewhere else.">
        <AdminInput
          id="seo-panel-canonical"
          value={canonicalUrl}
          onChange={(event) => onCanonicalUrlChange(event.target.value)}
          placeholder="https://www.taylormadebabyco.com/blog/post-slug"
        />
      </AdminField>
    </AdminSurface>
  );
}
