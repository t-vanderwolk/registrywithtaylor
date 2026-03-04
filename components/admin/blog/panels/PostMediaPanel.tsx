import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import type { PostImageRecord } from '@/components/admin/blog/postEditorTypes';

export default function PostMediaPanel({
  title,
  featuredImageUrl,
  featuredImageUrlInput,
  onFeaturedImageUrlChange,
  onRemoveFeaturedImage,
  galleryImages,
  newGalleryImageUrl,
  newGalleryImageAlt,
  onNewGalleryImageUrlChange,
  onNewGalleryImageAltChange,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onRemoveGalleryImage,
}: {
  title: string;
  featuredImageUrl: string | null;
  featuredImageUrlInput: string;
  onFeaturedImageUrlChange: (value: string) => void;
  onRemoveFeaturedImage: () => void;
  galleryImages: PostImageRecord[];
  newGalleryImageUrl: string;
  newGalleryImageAlt: string;
  onNewGalleryImageUrlChange: (value: string) => void;
  onNewGalleryImageAltChange: (value: string) => void;
  onAddGalleryImage: () => void;
  onUpdateGalleryImage: (index: number, partial: { alt?: string }) => void;
  onRemoveGalleryImage: (index: number) => void;
}) {
  return (
    <div className="admin-stack gap-5">
      <AdminField
        label="Featured Image URL"
        htmlFor="post-featured-image-url"
        help="Use a direct image URL for the article header and blog card."
      >
        <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
          <AdminInput
            id="post-featured-image-url"
            value={featuredImageUrlInput}
            onChange={(event) => onFeaturedImageUrlChange(event.target.value)}
            placeholder="https://cdn.example.com/featured-image.jpg"
          />

          {featuredImageUrl ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.02)]">
                <img
                  src={featuredImageUrl}
                  alt={title || 'Featured image preview'}
                  className="h-auto max-h-[320px] w-full object-cover"
                />
              </div>
              <div className="flex justify-start">
                <AdminButton type="button" variant="ghost" size="sm" onClick={onRemoveFeaturedImage}>
                  Clear featured image
                </AdminButton>
              </div>
            </div>
          ) : (
            <p className="admin-micro">No featured image URL set yet.</p>
          )}
        </div>
      </AdminField>

      <AdminField
        label="Gallery URLs"
        htmlFor="post-gallery-image-url"
        help="Add additional image URLs to display in the post gallery below the article body."
      >
        <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[2fr_1.2fr_auto] md:items-end">
            <AdminInput
              id="post-gallery-image-url"
              value={newGalleryImageUrl}
              onChange={(event) => onNewGalleryImageUrlChange(event.target.value)}
              placeholder="https://cdn.example.com/gallery-image.jpg"
            />
            <AdminInput
              value={newGalleryImageAlt}
              onChange={(event) => onNewGalleryImageAltChange(event.target.value)}
              placeholder="Alt text (optional)"
            />
            <AdminButton type="button" variant="secondary" size="sm" onClick={onAddGalleryImage}>
              Add image
            </AdminButton>
          </div>

          {galleryImages.length > 0 ? (
            <div className="space-y-3">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image.id}-${image.url}`}
                  className="space-y-3 rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-admin underline decoration-[rgba(0,0,0,0.2)] underline-offset-4"
                    >
                      {image.url}
                    </a>
                    <AdminButton type="button" variant="ghost" size="sm" onClick={() => onRemoveGalleryImage(index)}>
                      Remove
                    </AdminButton>
                  </div>
                  <AdminInput
                    value={image.alt ?? ''}
                    onChange={(event) => onUpdateGalleryImage(index, { alt: event.target.value })}
                    placeholder="Alt text (optional)"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-micro">No gallery URLs added yet.</p>
          )}
        </div>
      </AdminField>
    </div>
  );
}
