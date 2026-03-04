import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import { formatFileSize } from '@/lib/media';
import type { MediaRecord, PostImageRecord } from '@/components/admin/blog/postEditorTypes';

export default function PostMediaPanel({
  title,
  featuredImageUrl,
  featuredImageUrlInput,
  featuredImageId,
  featuredUploadLabel,
  featuredUploadDisabled,
  onOpenFeaturedPicker,
  onFeaturedImageUrlChange,
  onRemoveFeaturedImage,
  imageAssets,
  imageUploadLabel,
  imageUploadDisabled,
  onOpenImagePicker,
  onInsertImage,
  onSetFeaturedImage,
  onRemoveImage,
  galleryImages,
  newGalleryImageUrl,
  newGalleryImageAlt,
  onNewGalleryImageUrlChange,
  onNewGalleryImageAltChange,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onRemoveGalleryImage,
  pdfResources,
  pdfUploadLabel,
  pdfUploadDisabled,
  onOpenPdfPicker,
  onRemovePdfResource,
}: {
  title: string;
  featuredImageUrl: string | null;
  featuredImageUrlInput: string;
  featuredImageId?: string | null;
  featuredUploadLabel: string;
  featuredUploadDisabled: boolean;
  onOpenFeaturedPicker: () => void;
  onFeaturedImageUrlChange: (value: string) => void;
  onRemoveFeaturedImage: () => void;
  imageAssets: MediaRecord[];
  imageUploadLabel: string;
  imageUploadDisabled: boolean;
  onOpenImagePicker: () => void;
  onInsertImage: (media: MediaRecord) => void;
  onSetFeaturedImage: (media: MediaRecord) => void;
  onRemoveImage: (mediaId: string) => void;
  galleryImages: PostImageRecord[];
  newGalleryImageUrl: string;
  newGalleryImageAlt: string;
  onNewGalleryImageUrlChange: (value: string) => void;
  onNewGalleryImageAltChange: (value: string) => void;
  onAddGalleryImage: () => void;
  onUpdateGalleryImage: (index: number, partial: { alt?: string }) => void;
  onRemoveGalleryImage: (index: number) => void;
  pdfResources: MediaRecord[];
  pdfUploadLabel: string;
  pdfUploadDisabled: boolean;
  onOpenPdfPicker: () => void;
  onRemovePdfResource: (mediaId: string) => void;
}) {
  return (
    <div className="admin-stack gap-5">
      <AdminField
        label="Featured Image"
        htmlFor="post-featured-image-upload"
        help="Upload a JPG, PNG, or WEBP image for the post header and blog card."
      >
        <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
          {featuredImageUrl ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.02)]">
                <img
                  src={featuredImageUrl}
                  alt={title || 'Featured image preview'}
                  className="h-auto max-h-[320px] w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onOpenFeaturedPicker}
                  disabled={featuredUploadDisabled}
                >
                  {featuredUploadLabel}
                </AdminButton>
                <AdminButton type="button" variant="ghost" size="sm" onClick={onRemoveFeaturedImage}>
                  Remove image
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-5">
              <div className="space-y-1">
                <p className="text-sm text-admin">Upload a featured image for the public article.</p>
                <p className="admin-micro">Direct upload only. External image URLs are not needed here.</p>
              </div>
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={onOpenFeaturedPicker}
                disabled={featuredUploadDisabled}
              >
                {featuredUploadLabel}
              </AdminButton>
            </div>
          )}

          <div className="space-y-2 rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-4">
            <p className="text-sm text-admin">Or paste a direct featured image URL.</p>
            <AdminInput
              value={featuredImageUrlInput}
              onChange={(event) => onFeaturedImageUrlChange(event.target.value)}
              placeholder="https://cdn.example.com/featured-image.jpg"
            />
            <p className="admin-micro">Optional fallback for external or legacy hosted images.</p>
          </div>
        </div>
      </AdminField>

      <AdminField
        label="Image Library"
        htmlFor="post-image-library-upload"
        help="Upload reusable post images, then insert them into the markdown body or promote one to featured."
      >
        <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-admin">Manage all images attached to this post in one place.</p>
              <p className="admin-micro">Use the content toolbar for quick inline uploads, or manage the library here.</p>
            </div>
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenImagePicker}
              disabled={imageUploadDisabled}
            >
              {imageUploadLabel}
            </AdminButton>
          </div>

          {imageAssets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {imageAssets.map((media) => {
                const isFeatured = featuredImageId === media.id;

                return (
                  <div
                    key={media.id}
                    className="space-y-3 rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] p-3"
                  >
                    <div className="overflow-hidden rounded-[18px] border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.02)]">
                      <img
                        src={media.url}
                        alt={media.fileName}
                        className="h-40 w-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-admin">{media.fileName}</p>
                        {isFeatured ? <span className="admin-chip admin-chip--published">Featured</span> : null}
                      </div>
                      <p className="admin-micro">Image · {formatFileSize(media.fileSize)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <AdminButton type="button" variant="secondary" size="sm" onClick={() => onInsertImage(media)}>
                        Insert
                      </AdminButton>
                      <AdminButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetFeaturedImage(media)}
                        disabled={isFeatured}
                      >
                        {isFeatured ? 'Featured' : 'Set featured'}
                      </AdminButton>
                      <AdminButton asChild variant="ghost" size="sm">
                        <a href={media.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </AdminButton>
                      <AdminButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveImage(media.id)}
                      >
                        Detach
                      </AdminButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-5">
              <p className="text-sm text-admin">No images attached yet.</p>
              <p className="admin-micro">Upload JPG, PNG, or WEBP files to build an image library for this post.</p>
            </div>
          )}
        </div>
      </AdminField>

      <AdminField
        label="Gallery URLs"
        htmlFor="post-gallery-image-url"
        help="Add additional gallery images that render automatically below the article body."
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

      <AdminField
        label="Resources"
        htmlFor="post-pdf-resource-upload"
        help="Attach PDF resources that should render in the article resource area."
      >
        <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-admin">Upload downloadable PDFs directly to storage.</p>
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenPdfPicker}
              disabled={pdfUploadDisabled}
            >
              {pdfUploadLabel}
            </AdminButton>
          </div>

          {pdfResources.length > 0 ? (
            <div className="space-y-3">
              {pdfResources.map((media) => (
                <div
                  key={media.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-admin">{media.fileName}</p>
                    <p className="admin-micro">PDF · {formatFileSize(media.fileSize)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminButton asChild variant="ghost" size="sm">
                      <a href={media.url} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    </AdminButton>
                    <AdminButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePdfResource(media.id)}
                    >
                      Detach
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-micro">No PDF resources attached yet.</p>
          )}
        </div>
      </AdminField>
    </div>
  );
}
