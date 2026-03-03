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

type CtaButtonVariant = 'primary' | 'secondary';

type CtaButtonBlock = {
  type: 'ctaButton';
  label: string;
  url: string;
  variant?: CtaButtonVariant;
};

type ParsedCtaButtonLine = {
  lineIndex: number;
  raw: string;
  block: CtaButtonBlock;
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

type PostSavePayload = Pick<
  PostRecord,
  'title' | 'slug' | 'category' | 'excerpt' | 'coverImage' | 'featuredImageId' | 'content' | 'mediaIds' | 'published' | 'affiliateIds'
>;

const CTA_BUTTON_PREFIX = '::cta-button ';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeCtaVariant(value: unknown): CtaButtonVariant {
  return value === 'secondary' ? 'secondary' : 'primary';
}

function isValidCtaUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
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

function isCtaButtonBlock(value: unknown): value is CtaButtonBlock {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CtaButtonBlock>;
  return candidate.type === 'ctaButton' && typeof candidate.label === 'string' && typeof candidate.url === 'string';
}

function serializeCtaButton(block: Omit<CtaButtonBlock, 'type'> | CtaButtonBlock) {
  return `${CTA_BUTTON_PREFIX}${JSON.stringify({
    type: 'ctaButton',
    label: block.label,
    url: block.url,
    variant: normalizeCtaVariant(block.variant),
  })}`;
}

function parseCtaButtonLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith(CTA_BUTTON_PREFIX)) {
    return null;
  }

  const rawPayload = trimmed.slice(CTA_BUTTON_PREFIX.length).trim();
  if (!rawPayload) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawPayload) as unknown;
    if (!isCtaButtonBlock(parsed)) {
      return null;
    }

    return {
      type: 'ctaButton',
      label: parsed.label.trim(),
      url: parsed.url.trim(),
      variant: normalizeCtaVariant(parsed.variant),
    } satisfies CtaButtonBlock;
  } catch {
    return null;
  }
}

function collectCtaButtons(content: string) {
  const buttons: ParsedCtaButtonLine[] = [];
  const invalidLines: Array<{ lineIndex: number; raw: string }> = [];

  content.split('\n').forEach((raw, lineIndex) => {
    const trimmed = raw.trim();
    if (!trimmed.startsWith(CTA_BUTTON_PREFIX)) {
      return;
    }

    const block = parseCtaButtonLine(trimmed);
    if (!block) {
      invalidLines.push({ lineIndex, raw });
      return;
    }

    buttons.push({ lineIndex, raw, block });
  });

  return { buttons, invalidLines };
}

function replaceCtaButtonLine(content: string, lineIndex: number, nextBlock: CtaButtonBlock | null) {
  const lines = content.split('\n');
  if (lineIndex < 0 || lineIndex >= lines.length) {
    return content;
  }

  if (nextBlock) {
    lines[lineIndex] = serializeCtaButton(nextBlock);
  } else {
    lines.splice(lineIndex, 1);
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function insertCtaButtonAtSelection(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  block: CtaButtonBlock,
) {
  const token = serializeCtaButton(block);
  const prefix = selectionStart > 0 && content[selectionStart - 1] !== '\n' ? '\n\n' : '';
  const suffix = selectionEnd < content.length && content[selectionEnd] !== '\n' ? '\n\n' : '\n\n';
  const nextContent = content.slice(0, selectionStart) + prefix + token + suffix + content.slice(selectionEnd);
  const nextCursorPosition = selectionStart + prefix.length + token.length + suffix.length;

  return {
    content: nextContent,
    nextCursorPosition,
  };
}

function validateCtaContent(content: string) {
  const parsed = collectCtaButtons(content);

  if (parsed.invalidLines.length > 0) {
    return 'CTA button token is malformed.';
  }

  const invalidButton = parsed.buttons.find(
    ({ block }) => !block.label.trim() || !block.url.trim() || !isValidCtaUrl(block.url),
  );

  if (invalidButton) {
    return 'CTA buttons must include a valid http:// or https:// URL and label.';
  }

  return null;
}

function toSavePayload(post: PostRecord): PostSavePayload {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    featuredImageId: post.featuredImageId,
    content: post.content,
    mediaIds: post.mediaIds,
    published: post.published,
    affiliateIds: post.affiliateIds,
  };
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingKind, setUploadingKind] = useState<'featured' | 'inline' | 'pdf' | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newCtaButton, setNewCtaButton] = useState<Omit<CtaButtonBlock, 'type'>>({
    label: 'Shop Now',
    url: '',
    variant: 'primary',
  });
  const debounceRef = useRef<number | null>(null);
  const draftRef = useRef<PostRecord>(initialPost);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const featuredInputRef = useRef<HTMLInputElement | null>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const apiUrl = useMemo(() => `/api/blog/${postId}`, [postId]);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage;
  const pdfResources = post.media.filter((media) => isPdfMediaType(media.fileType));
  const ctaButtonContent = collectCtaButtons(post.content);

  async function save(payload: PostSavePayload) {
    const contentToValidate = payload.content;
    const ctaError = validateCtaContent(contentToValidate);
    if (ctaError) {
      setSaveError(ctaError);
      return;
    }

    setSaving(true);
    setSaveError(null);
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    setSaving(false);

    if (!res.ok) {
      setSaveError(typeof json?.error === 'string' ? json.error : 'Unable to save changes.');
      return;
    }

    if (json?.id) {
      setPost(json as PostRecord);
      draftRef.current = json as PostRecord;
      setSavedAt(Date.now());
    }
  }

  function queueSave(partial: Partial<PostRecord>) {
    setSaveError(null);
    const nextPost = { ...draftRef.current, ...partial };
    draftRef.current = nextPost;
    setPost(nextPost);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      void save(toSavePayload(draftRef.current));
    }, 350);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function toggleAffiliate(affiliateId: string, checked: boolean) {
    const currentAffiliateIds = draftRef.current.affiliateIds ?? [];
    const nextAffiliateIds = checked
      ? Array.from(new Set([...currentAffiliateIds, affiliateId]))
      : currentAffiliateIds.filter((id) => id !== affiliateId);

    queueSave({ affiliateIds: nextAffiliateIds });
  }

  function insertCtaButton() {
    if (!newCtaButton.label.trim() || !isValidCtaUrl(newCtaButton.url)) {
      setSaveError('CTA buttons must include a valid http:// or https:// URL and label.');
      return;
    }

    const currentPost = draftRef.current;
    const textarea = contentTextareaRef.current;
    const start = textarea?.selectionStart ?? currentPost.content.length;
    const end = textarea?.selectionEnd ?? start;
    const { content, nextCursorPosition } = insertCtaButtonAtSelection(currentPost.content, start, end, {
      type: 'ctaButton',
      label: newCtaButton.label.trim(),
      url: newCtaButton.url.trim(),
      variant: newCtaButton.variant,
    });

    queueSave({ content });

    requestAnimationFrame(() => {
      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  }

  function updateCtaButton(lineIndex: number, nextBlock: CtaButtonBlock) {
    queueSave({
      content: replaceCtaButtonLine(post.content, lineIndex, nextBlock),
    });
  }

  function removeCtaButton(lineIndex: number) {
    queueSave({
      content: replaceCtaButtonLine(post.content, lineIndex, null),
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

    if (
      !response.ok ||
      !payload?.id ||
      !payload.url ||
      !payload.fileName ||
      !payload.fileType ||
      typeof payload.fileSize !== 'number'
    ) {
      throw new Error(payload?.error || 'Upload failed.');
    }

    return payload as MediaRecord;
  }

  function attachMediaToPost(media: MediaRecord) {
    const currentPost = draftRef.current;

    return {
      media: dedupeMedia([...currentPost.media, media]),
      mediaIds: Array.from(new Set([...currentPost.mediaIds, media.id])),
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
      const currentPost = draftRef.current;
      const textarea = contentTextareaRef.current;
      const start = textarea?.selectionStart ?? currentPost.content.length;
      const end = textarea?.selectionEnd ?? start;
      const markdown = `\n\n![${toAltText(media.fileName)}](${media.url})\n\n`;
      const nextContent = `${currentPost.content.slice(0, start)}${markdown}${currentPost.content.slice(end)}`;
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
    const currentPost = draftRef.current;
    const nextMedia = currentPost.media.filter((media) => media.id !== mediaId);
    const nextMediaIds = currentPost.mediaIds.filter((id) => id !== mediaId);

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
            <AdminButton variant="primary" size="sm" onClick={() => void save(toSavePayload(draftRef.current))}>
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

        <AdminField
          label="CTA Buttons"
          help="Add lightweight external CTA buttons for affiliate or partner URLs."
        >
          <div className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_200px]">
              <AdminField label="Button label" htmlFor="post-cta-button-label">
                <AdminInput
                  id="post-cta-button-label"
                  value={newCtaButton.label}
                  onChange={(event) =>
                    setNewCtaButton((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  placeholder="Shop Now"
                />
              </AdminField>

              <AdminField label="Destination URL" htmlFor="post-cta-button-url">
                <AdminInput
                  id="post-cta-button-url"
                  type="url"
                  value={newCtaButton.url}
                  onChange={(event) =>
                    setNewCtaButton((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  placeholder="https://partner.example.com/..."
                />
              </AdminField>

              <AdminField label="Variant" htmlFor="post-cta-button-variant">
                <AdminSelect
                  id="post-cta-button-variant"
                  value={newCtaButton.variant}
                  onChange={(event) =>
                    setNewCtaButton((current) => ({
                      ...current,
                      variant: event.target.value as CtaButtonVariant,
                    }))
                  }
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </AdminSelect>
              </AdminField>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <AdminButton type="button" variant="secondary" size="sm" onClick={insertCtaButton}>
                + CTA Button
              </AdminButton>
              <p className="admin-micro">
                Buttons open in a new tab with `rel=&quot;noopener noreferrer sponsored&quot;`.
              </p>
            </div>

            {ctaButtonContent.invalidLines.length > 0 && (
              <div className="rounded-2xl border border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] px-4 py-3 text-sm text-admin-danger">
                {ctaButtonContent.invalidLines.length} malformed CTA token
                {ctaButtonContent.invalidLines.length === 1 ? '' : 's'} found in the content field. Fix or remove
                them before publishing.
              </div>
            )}

            {ctaButtonContent.buttons.length > 0 ? (
              <div className="space-y-3">
                {ctaButtonContent.buttons.map(({ lineIndex, block }) => (
                  <div
                    key={`${lineIndex}-${block.url}`}
                    className="space-y-3 rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_200px]">
                      <AdminField label="Button label" htmlFor={`post-cta-existing-label-${lineIndex}`}>
                        <AdminInput
                          id={`post-cta-existing-label-${lineIndex}`}
                          value={block.label}
                          onChange={(event) =>
                            updateCtaButton(lineIndex, {
                              ...block,
                              label: event.target.value,
                            })
                          }
                          placeholder="Button label"
                        />
                      </AdminField>

                      <AdminField label="Destination URL" htmlFor={`post-cta-existing-url-${lineIndex}`}>
                        <AdminInput
                          id={`post-cta-existing-url-${lineIndex}`}
                          type="url"
                          value={block.url}
                          onChange={(event) =>
                            updateCtaButton(lineIndex, {
                              ...block,
                              url: event.target.value,
                            })
                          }
                          placeholder="Paste affiliate URL"
                        />
                      </AdminField>

                      <AdminField label="Variant" htmlFor={`post-cta-existing-variant-${lineIndex}`}>
                        <AdminSelect
                          id={`post-cta-existing-variant-${lineIndex}`}
                          value={block.variant ?? 'primary'}
                          onChange={(event) =>
                            updateCtaButton(lineIndex, {
                              ...block,
                              variant: event.target.value as CtaButtonVariant,
                            })
                          }
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </AdminSelect>
                      </AdminField>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="admin-micro">This CTA renders wherever its structured token appears in the content.</p>
                      <AdminButton type="button" variant="ghost" size="sm" onClick={() => removeCtaButton(lineIndex)}>
                        Remove CTA
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-micro">No CTA buttons inserted yet.</p>
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

        {(uploadFeedback || uploadError || saveError) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              uploadError || saveError
                ? 'border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] text-admin-danger'
                : 'border-[rgba(47,106,67,0.18)] bg-[rgba(47,106,67,0.05)] text-admin-success'
            }`}
          >
            {uploadError ?? saveError ?? uploadFeedback}
          </div>
        )}
      </AdminStack>
    </AdminStack>
  );
}
