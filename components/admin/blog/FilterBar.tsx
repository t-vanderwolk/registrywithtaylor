import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { BLOG_STAGE_LABELS, type BlogStageValue } from '@/lib/blog/postStage';

type SelectOption = {
  value: string;
  label: string;
};

export default function FilterBar({
  search,
  status,
  stage,
  category,
  featured,
  sort,
  categoryOptions,
  onSearchChange,
  onStatusChange,
  onStageChange,
  onCategoryChange,
  onFeaturedChange,
  onSortChange,
}: {
  search: string;
  status: 'all' | PostStatusValue;
  stage: 'all' | BlogStageValue;
  category: string;
  featured: 'all' | 'featured' | 'standard';
  sort: 'updated' | 'publishedAt' | 'title';
  categoryOptions: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | PostStatusValue) => void;
  onStageChange: (value: 'all' | BlogStageValue) => void;
  onCategoryChange: (value: string) => void;
  onFeaturedChange: (value: 'all' | 'featured' | 'standard') => void;
  onSortChange: (value: 'updated' | 'publishedAt' | 'title') => void;
}) {
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'DRAFT', label: POST_STATUS_LABELS.DRAFT },
    { value: 'SCHEDULED', label: POST_STATUS_LABELS.SCHEDULED },
    { value: 'PUBLISHED', label: POST_STATUS_LABELS.PUBLISHED },
    { value: 'ARCHIVED', label: POST_STATUS_LABELS.ARCHIVED },
  ];
  const stageOptions: SelectOption[] = [
    { value: 'all', label: 'All stages' },
    ...Object.entries(BLOG_STAGE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
        <AdminInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title, slug, excerpt, keyword"
          aria-label="Search posts"
        />

        <AdminSelect value={status} onChange={(event) => onStatusChange(event.target.value as 'all' | PostStatusValue)} aria-label="Filter by status">
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AdminSelect>

        <AdminSelect value={stage} onChange={(event) => onStageChange(event.target.value as 'all' | BlogStageValue)} aria-label="Filter by stage">
          {stageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AdminSelect>

        <AdminSelect value={category} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>

        <AdminSelect value={featured} onChange={(event) => onFeaturedChange(event.target.value as 'all' | 'featured' | 'standard')} aria-label="Filter by featured state">
          <option value="all">All featured states</option>
          <option value="featured">Featured only</option>
          <option value="standard">Non-featured only</option>
        </AdminSelect>

        <AdminSelect value={sort} onChange={(event) => onSortChange(event.target.value as 'updated' | 'publishedAt' | 'title')} aria-label="Sort posts">
          <option value="updated">Updated</option>
          <option value="publishedAt">Published date</option>
          <option value="title">Title</option>
        </AdminSelect>
      </div>
    </AdminSurface>
  );
}
