import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import { formatFileSize } from '@/lib/media';
import type { MediaRecord } from '@/components/admin/blog/postEditorTypes';

export default function PostMediaPanel({
  title,
  featuredImageUrl,
  featuredImageId,
  featuredUploadLabel,
  featuredUploadDisabled,
  onOpenFeaturedPicker,
  onRemoveFeaturedImage,
  imageAssets,
  imageUploadLabel,
  imageUploadDisabled,
  onOpenImagePicker,
  onInsertImage,
  onSetFeaturedImage,
  onRemoveImage,
  pdfResources,
  pdfUploadLabel,
  pdfUploadDisabled,
  onOpenPdfPicker,
  onRemovePdfResource,
}: {
  title: string;
  featuredImageUrl: string | null;
  featuredImageId?: string | null;
  featuredUploadLabel: string;
  featuredUploadDisabled: boolean;
  onOpenFeaturedPicker: () => void;
  onRemoveFeaturedImage: () => void;
  imageAssets: MediaRecord[];
  imageUploadLabel: string;
  imageUploadDisabled: boolean;
  onOpenImagePicker: () => void;
  onInsertImage: (media: MediaRecord) => void;
  onSetFeaturedImage: (media: MediaRecord) => void;
  onRemoveImage: (mediaId: string) => void;
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
