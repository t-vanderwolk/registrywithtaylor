'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AffiliateNetwork } from '@prisma/client';
import { BLOG_CATEGORIES, type BlogCategory } from '@/lib/blogCategories';
import { formatFileSize, isPdfMediaType } from '@/lib/media';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminToast from '@/components/admin/ui/AdminToast';

type AffiliateOption = {
  id: string;
  name: string;
  network: AffiliateNetwork;
};

type MediaRecord = {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date | string;
};

type PostRecord = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  coverImage: string | null;
  featuredImageId: string | null;
  featuredImage: MediaRecord | null;
  content: string;
  mediaIds: string[];
  media: MediaRecord[];
  published: boolean;
  affiliateIds: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSavedText(saving: boolean, savedAt: number | null) {
  if (saving) return 'Saving changes...';
  if (savedAt) return `Saved at ${new Date(savedAt).toLocaleTimeString()}`;
  return 'Autosave is on. Changes save every few seconds.';
}

function dedupeMedia(mediaItems: MediaRecord[]) {
  const seen = new Set<string>();
  const deduped: MediaRecord[] = [];

  for (const media of mediaItems) {
    if (seen.has(media.id)) {
      continue;
    }

    seen.add(media.id);
    deduped.push(media);
  }

  return deduped;
}

function toAltText(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return baseName || 'Image';
}

export default function PostEditor({
  postId,
  initialPost,
  affiliateOptions,
}: {
  postId: string;
  initialPost: PostRecord;
  affiliateOptions: AffiliateOption[];
}) {
  const [post, setPost] = useState<PostRecord>(initialPost);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploadingKind, setUploadingKind] = useState<'featured' | 'inline' | 'pdf' | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const featuredInputRef = useRef<HTMLInputElement | null>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const apiUrl = useMemo(() => `/api/blog/${postId}`, [postId]);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage;
  const pdfResources = post.media.filter((media) => isPdfMediaType(media.fileType));

  async function save(partial: Partial<PostRecord>) {
    setSaving(true);
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok && json?.id) {
      setPost(json as PostRecord);
      setSavedAt(Date.now());
    }
  }

  function queueSave(partial: Partial<PostRecord>) {
    setPost((currentPost) => ({ ...currentPost, ...partial }));
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      void save(partial);
    }, 350);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function toggleAffiliate(affiliateId: string, checked: boolean) {
    setPost((currentPost) => {
      const currentAffiliateIds = currentPost.affiliateIds ?? [];
      const nextAffiliateIds = checked
        ? Array.from(new Set([...currentAffiliateIds, affiliateId]))
        : currentAffiliateIds.filter((id) => id !== affiliateId);

      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        void save({ affiliateIds: nextAffiliateIds });
      }, 350);

      return { ...currentPost, affiliateIds: nextAffiliateIds };
    });
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | ({ error?: string } & Partial<MediaRecord>)
      | null;

    if (!response.ok || !payload?.id || !payload.url || !payload.fileName || !payload.fileType || typeof payload.fileSize !== 'number') {
      throw new Error(payload?.error || 'Upload failed.');
    }

    return payload as MediaRecord;
  }

  function attachMediaToPost(media: MediaRecord) {
    return {
      media: dedupeMedia([...post.media, media]),
      mediaIds: Array.from(new Set([...post.mediaIds, media.id])),
    };
  }

  async function handleFeaturedUpload(file: File) {
    setUploadingKind('featured');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const media = await uploadFile(file);
      queueSave({
        featuredImageId: media.id,
        featuredImage: media,
        coverImage: media.url,
      });
      setUploadFeedback('Featured image uploaded.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload featured image.');
    } finally {
      setUploadingKind(null);
    }
  }

  async function handleInlineUpload(file: File) {
    setUploadingKind('inline');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const media = await uploadFile(file);
      const textarea = contentTextareaRef.current;
      const start = textarea?.selectionStart ?? post.content.length;
      const end = textarea?.selectionEnd ?? start;
      const markdown = `\n\n![${toAltText(media.fileName)}](${media.url})\n\n`;
      const nextContent = `${post.content.slice(0, start)}${markdown}${post.content.slice(end)}`;
      const nextCursorPosition = start + markdown.length;
      const mediaState = attachMediaToPost(media);

      queueSave({
        content: nextContent,
        media: mediaState.media,
        mediaIds: mediaState.mediaIds,
      });

      requestAnimationFrame(() => {
        if (!textarea) {
          return;
        }

        textarea.focus();
        textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
      });

      setUploadFeedback('Image uploaded and inserted into the post.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload inline image.');
    } finally {
      setUploadingKind(null);
    }
  }

  async function handlePdfUpload(file: File) {
    setUploadingKind('pdf');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const media = await uploadFile(file);
      const mediaState = attachMediaToPost(media);
      queueSave({
        media: mediaState.media,
        mediaIds: mediaState.mediaIds,
      });
      setUploadFeedback('PDF resource uploaded and attached to the post.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload PDF resource.');
    } finally {
      setUploadingKind(null);
    }
  }

  function removeAttachedMedia(mediaId: string) {
    const nextMedia = post.media.filter((media) => media.id !== mediaId);
    const nextMediaIds = post.mediaIds.filter((id) => id !== mediaId);

    queueSave({
      media: nextMedia,
      mediaIds: nextMediaIds,
    });
  }

  return (
    <AdminStack gap="lg">
      <div className="admin-surface-muted md:sticky md:top-4 md:z-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <AdminToast tone={saving ? 'warning' : 'success'}>{getSavedText(saving, savedAt)}</AdminToast>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton asChild variant="secondary" size="sm">
              <Link href="/admin/blog" aria-label="Back to posts">
                Back to posts
              </Link>
            </AdminButton>
            <AdminButton variant="ghost" size="sm" disabled aria-disabled="true">
              Preview on site (coming soon)
            </AdminButton>
            <AdminButton variant="primary" size="sm" onClick={() => void save(post)}>
              Save now
            </AdminButton>
          </div>
        </div>
      </div>

      <AdminStack gap="lg" className="pb-2">
        <AdminField label="Title" htmlFor="post-title">
          <AdminInput
            id="post-title"
            value={post.title ?? ''}
            onChange={(event) => {
              const title = event.target.value;
              const nextSlug = post.slug && post.slug.trim().length > 0 ? post.slug : slugify(title);
              queueSave({ title, slug: nextSlug });
            }}
            placeholder="The Art of the Registry"
          />
        </AdminField>

        <AdminField label="Slug" htmlFor="post-slug" help="If left empty, slug is generated from the title.">
          <AdminInput
            id="post-slug"
            value={post.slug ?? ''}
            onChange={(event) => queueSave({ slug: event.target.value })}
            placeholder="auto-generated-if-empty"
          />
        </AdminField>

        <AdminField
          label="Category"
          htmlFor="post-category"
          help="Choose one editorial focus for navigation and SEO."
        >
          <AdminSelect
            id="post-category"
            value={post.category}
            onChange={(event) => queueSave({ category: event.target.value as BlogCategory })}
          >
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </AdminSelect>
        </AdminField>

        <AdminField
          label="Featured Image"
          htmlFor="post-featured-image-upload"
          help="Upload a JPG, PNG, or WEBP image up to 10 MB."
        >
          <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
            {featuredImageUrl ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.02)]">
                  <img
                    src={featuredImageUrl}
                    alt={post.title || 'Featured image preview'}
                    className="h-auto max-h-[320px] w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => featuredInputRef.current?.click()}
                    disabled={uploadingKind === 'featured'}
                  >
                    {uploadingKind === 'featured' ? 'Uploading...' : 'Replace image'}
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      queueSave({
                        featuredImageId: null,
                        featuredImage: null,
                        coverImage: null,
                      })
                    }
                  >
                    Remove image
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-4 py-5">
                <div className="space-y-1">
                  <p className="text-sm text-admin">Upload a featured image for the blog card and post header.</p>
                  <p className="admin-micro">Direct upload only. External URLs are no longer required.</p>
                </div>
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => featuredInputRef.current?.click()}
                  disabled={uploadingKind === 'featured'}
                >
                  {uploadingKind === 'featured' ? 'Uploading...' : 'Upload image'}
                </AdminButton>
              </div>
            )}

            <input
              ref={featuredInputRef}
              id="post-featured-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = '';
                if (!file) {
                  return;
                }

                await handleFeaturedUpload(file);
              }}
            />
          </div>
        </AdminField>

        <AdminField label="Excerpt" htmlFor="post-excerpt">
          <AdminTextarea
            id="post-excerpt"
            value={post.excerpt ?? ''}
            onChange={(event) => queueSave({ excerpt: event.target.value })}
            className="min-h-[130px]"
            placeholder="A calm, practical approach to building a registry that fits your real life."
          />
        </AdminField>

        <AdminField
          label="Downloadable Resource"
          htmlFor="post-pdf-resource-upload"
          help="Attach PDFs that should render as downloadable resources on the post."
        >
          <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-admin">
                Upload PDF resources directly to storage and attach them to this article.
              </p>
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => pdfInputRef.current?.click()}
                disabled={uploadingKind === 'pdf'}
              >
                {uploadingKind === 'pdf' ? 'Uploading...' : 'Upload PDF'}
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
                      <p className="admin-micro">
                        PDF · {formatFileSize(media.fileSize)}
                      </p>
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
                        onClick={() => removeAttachedMedia(media.id)}
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

            <input
              ref={pdfInputRef}
              id="post-pdf-resource-upload"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = '';
                if (!file) {
                  return;
                }

                await handlePdfUpload(file);
              }}
            />
          </div>
        </AdminField>

        <AdminField label="Publishing" htmlFor="post-published" help="Published posts are visible on the public blog.">
          <label className="admin-toggle" htmlFor="post-published">
            <input
              id="post-published"
              type="checkbox"
              checked={post.published}
              onChange={(event) => queueSave({ published: event.target.checked })}
            />
            <span>Published</span>
          </label>
        </AdminField>

        <AdminField
          label="Affiliate Partners"
          help="Optional: check any partner relevant to this post."
        >
          <div id="post-affiliates" className="rounded-2xl border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
            {affiliateOptions.length === 0 ? (
              <p className="admin-micro">No affiliate partners available.</p>
            ) : (
              <div className="space-y-3">
                {affiliateOptions.map((partner) => {
                  const checked = (post.affiliateIds ?? []).includes(partner.id);

                  return (
                    <label key={partner.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.02]">
                      <input
                        type="checkbox"
                        name="affiliateIds"
                        value={partner.id}
                        checked={checked}
                        onChange={(event) => toggleAffiliate(partner.id, event.target.checked)}
                        className="h-4 w-4 rounded border-[var(--admin-color-border)]"
                      />
                      <span className="text-sm text-admin">
                        {partner.name} <span className="text-admin-muted">({partner.network})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </AdminField>

        <AdminField label="Content" htmlFor="post-content">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inlineInputRef.current?.click()}
                disabled={uploadingKind === 'inline'}
              >
                {uploadingKind === 'inline' ? 'Uploading...' : 'Upload image'}
              </AdminButton>
              <p className="admin-micro">Uploaded images are inserted into the markdown editor automatically.</p>
            </div>

            <AdminTextarea
              ref={contentTextareaRef}
              id="post-content"
              value={post.content ?? ''}
              onChange={(event) => queueSave({ content: event.target.value })}
              className="min-h-[420px]"
              placeholder="Paste your draft here..."
            />

            <input
              ref={inlineInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = '';
                if (!file) {
                  return;
                }

                await handleInlineUpload(file);
              }}
            />
          </div>
        </AdminField>

        {(uploadFeedback || uploadError) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              uploadError
                ? 'border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] text-admin-danger'
                : 'border-[rgba(47,106,67,0.18)] bg-[rgba(47,106,67,0.05)] text-admin-success'
            }`}
          >
            {uploadError ?? uploadFeedback}
          </div>
        )}
      </AdminStack>
    </AdminStack>
  );
}
