import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import { formatFileSize } from '@/lib/media';
import type { MediaRecord } from '@/components/admin/blog/postEditorTypes';

export default function PostMediaPanel({
  title,
  featuredImageUrl,
  featuredUploadLabel,
  featuredUploadDisabled,
  onOpenFeaturedPicker,
  onRemoveFeaturedImage,
  pdfResources,
  pdfUploadLabel,
  pdfUploadDisabled,
  onOpenPdfPicker,
  onRemovePdfResource,
}: {
  title: string;
  featuredImageUrl: string | null;
  featuredUploadLabel: string;
  featuredUploadDisabled: boolean;
  onOpenFeaturedPicker: () => void;
  onRemoveFeaturedImage: () => void;
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
