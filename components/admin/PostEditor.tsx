'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requiresLiveContent, type PostStatusValue } from '@/lib/blog/postStatus';
import { resolveBlogStage, type BlogStageValue } from '@/lib/blog/postStage';
import { isImageMediaType, isPdfMediaType } from '@/lib/media';
import {
  createCtaSlotToken,
  createEmptyCtaButton,
  extractEditorCtaButtons,
  isValidCtaUrl,
  serializeCtaButtons,
  validateCtaButtons,
  type CtaButton,
} from '@/lib/blog/ctaButtons';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminStack from '@/components/admin/ui/AdminStack';
import {
  getContentTemplate,
  type ContentTemplateId,
} from '@/components/admin/blog/contentTemplates';
import {
  getStyledBlockSnippet,
  type StyledBlockId,
} from '@/lib/blog/styledBlocks';
import PostEditorLayout, { type PostEditorTabId } from '@/components/admin/blog/PostEditorLayout';
import InternalLinkInsertModal from '@/components/admin/blog/InternalLinkInsertModal';
import PostHealthCard from '@/components/admin/blog/PostHealthCard';
import PostContentPanel, { type ContentFormatAction } from '@/components/admin/blog/panels/PostContentPanel';
import PostMediaPanel from '@/components/admin/blog/panels/PostMediaPanel';
import PostSeoPanel from '@/components/admin/blog/panels/PostSeoPanel';
import PostPublishPanel from '@/components/admin/blog/panels/PostPublishPanel';
import PostAffiliatesPanel from '@/components/admin/blog/panels/PostAffiliatesPanel';
import PostCtaButtonsPanel from '@/components/admin/blog/panels/PostCtaButtonsPanel';
import PostMetaPanel from '@/components/admin/blog/panels/PostMetaPanel';
import PostMiniPreviewCard from '@/components/admin/blog/panels/PostMiniPreviewCard';
import type {
  AffiliateOption,
  EditorPostState,
  MediaRecord,
  PersistedPostRecord,
  PostSavePayload,
} from '@/components/admin/blog/postEditorTypes';

type SaveMode = 'debounced' | 'immediate' | 'manual';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSavedText({
  hasPersistedPost,
  isSaving,
  isDirty,
  hasScheduledSave,
  savedAt,
}: {
  hasPersistedPost: boolean;
  isSaving: boolean;
  isDirty: boolean;
  hasScheduledSave: boolean;
  savedAt: number | null;
}) {
  if (isSaving) {
    return hasPersistedPost ? 'Saving changes...' : 'Creating draft...';
  }

  if (isDirty || hasScheduledSave) {
    return 'Unsaved changes';
  }

  if (savedAt) {
    return `Saved at ${new Date(savedAt).toLocaleTimeString()}`;
  }

  return hasPersistedPost ? 'Autosave is on.' : 'Create the draft on first save.';
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

function needsLeadingSpacing(content: string, index: number) {
  if (index <= 0) {
    return false;
  }

  return !/\n\s*\n\s*$/.test(content.slice(0, index));
}

function needsTrailingSpacing(content: string, index: number) {
  if (index >= content.length) {
    return false;
  }

  return !/^\s*\n\s*\n/.test(content.slice(index));
}

function insertAtSelection(content: string, selectionStart: number, selectionEnd: number, nextValue: string) {
  const nextContent = `${content.slice(0, selectionStart)}${nextValue}${content.slice(selectionEnd)}`;
  return {
    content: nextContent,
    nextCursorPosition: selectionStart + nextValue.length,
  };
}

function replaceSelection(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  nextValue: string,
  nextSelectionStart?: number,
  nextSelectionEnd?: number,
) {
  const nextContent = `${content.slice(0, selectionStart)}${nextValue}${content.slice(selectionEnd)}`;
  return {
    content: nextContent,
    nextSelectionStart: nextSelectionStart ?? selectionStart,
    nextSelectionEnd: nextSelectionEnd ?? selectionStart + nextValue.length,
  };
}

function toIsoFromLocalDateTime(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function isValidImageUrl(value: string) {
  return /^https?:\/\//i.test(value.trim()) || value.trim().startsWith('/');
}

function getScheduleError(status: PostStatusValue, scheduledFor?: Date | string | null) {
  if (status !== 'SCHEDULED') {
    return undefined;
  }

  if (!scheduledFor) {
    return 'Choose a future date and time.';
  }

  const scheduledDate = new Date(scheduledFor);
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
    return 'Scheduled posts must use a future date and time.';
  }

  return undefined;
}

function toEditorState(post: PersistedPostRecord) {
  const parsed = extractEditorCtaButtons(post.content);

  return {
    state: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      stage: post.stage,
      deck: post.deck,
      excerpt: post.excerpt,
      focusKeyword: post.focusKeyword,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      canonicalUrl: post.canonicalUrl,
      featuredImageUrl: post.featuredImageUrl,
      coverImage: post.coverImage,
      featuredImageId: post.featuredImageId,
      featuredImage: post.featuredImage,
      body: parsed.body,
      ctaButtons: parsed.buttons,
      mediaIds: post.mediaIds,
      media: post.media,
      images: post.images,
      status: post.status,
      publishedAt: post.publishedAt,
      scheduledFor: post.scheduledFor,
      archivedAt: post.archivedAt,
      featured: post.featured,
      published: post.published,
      affiliateIds: post.affiliateIds,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    } satisfies EditorPostState,
    malformedCta: parsed.malformed,
  };
}

function toSavePayload(post: EditorPostState): PostSavePayload {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    stage: post.stage,
    deck: post.deck,
    excerpt: post.excerpt,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    featuredImageUrl: post.featuredImageUrl,
    coverImage: post.coverImage,
    featuredImageId: post.featuredImageId,
    content: serializeCtaButtons(post.body, post.ctaButtons),
    mediaIds: post.mediaIds,
    images: post.images.map((image) => ({
      url: image.url,
      alt: image.alt,
    })),
    status: post.status,
    scheduledFor: post.scheduledFor,
    featured: post.featured,
    affiliateIds: post.affiliateIds,
  };
}

function mergeServerState(current: EditorPostState, server: EditorPostState) {
  return {
    ...current,
    id: server.id,
    createdAt: server.createdAt ?? current.createdAt,
    updatedAt: server.updatedAt ?? current.updatedAt,
    status: server.status,
    publishedAt: server.publishedAt,
    archivedAt: server.archivedAt,
    scheduledFor: current.status === 'SCHEDULED' ? current.scheduledFor ?? server.scheduledFor : server.scheduledFor,
    slug: current.slug.trim() || server.slug,
    title: current.title.trim() || server.title,
    stage: server.stage,
    deck: current.deck?.trim() ? current.deck : server.deck,
    excerpt: current.excerpt?.trim() ? current.excerpt : server.excerpt,
    focusKeyword: current.focusKeyword?.trim() ? current.focusKeyword : server.focusKeyword,
    seoTitle: current.seoTitle?.trim() ? current.seoTitle : server.seoTitle,
    seoDescription: current.seoDescription?.trim() ? current.seoDescription : server.seoDescription,
    canonicalUrl: current.canonicalUrl?.trim() ? current.canonicalUrl : server.canonicalUrl,
    featuredImageUrl: current.featuredImageUrl?.trim() ? current.featuredImageUrl : server.featuredImageUrl,
    coverImage: current.coverImage ?? server.coverImage,
    featuredImageId: current.featuredImageId ?? server.featuredImageId,
    featuredImage: current.featuredImage ?? server.featuredImage,
    mediaIds: current.mediaIds.length > 0 ? current.mediaIds : server.mediaIds,
    media: current.media.length > 0 ? current.media : server.media,
    images: current.images,
    published: server.published,
  } satisfies EditorPostState;
}

function validateEditorState(post: EditorPostState) {
  if (requiresLiveContent(post.status) && !post.body.trim()) {
    return 'Content is required before publishing or scheduling.';
  }

  if (post.canonicalUrl?.trim() && !/^https?:\/\//i.test(post.canonicalUrl.trim())) {
    return 'Canonical URL must start with http:// or https://.';
  }

  if (post.featuredImageUrl?.trim() && !isValidImageUrl(post.featuredImageUrl.trim())) {
    return 'Featured image URL must start with http://, https://, or /.';
  }

  for (const image of post.images) {
    if (!isValidImageUrl(image.url)) {
      return 'Gallery images must use http://, https://, or root-relative paths.';
    }
  }

  const scheduleError = getScheduleError(post.status, post.scheduledFor);
  if (scheduleError) {
    return scheduleError;
  }

  return validateCtaButtons(post.ctaButtons);
}

export default function PostEditor({
  initialPost,
  affiliateOptions,
}: {
  initialPost: PersistedPostRecord;
  affiliateOptions: AffiliateOption[];
}) {
  const router = useRouter();
  const initialEditor = useMemo(() => toEditorState(initialPost), [initialPost]);
  const [post, setPost] = useState<EditorPostState>(initialEditor.state);
  const [currentPostId, setCurrentPostId] = useState<string | null>(initialEditor.state.id);
  const [activeTab, setActiveTab] = useState<PostEditorTabId>('content');
  const [saving, setSaving] = useState(false);
  const [hasScheduledSave, setHasScheduledSave] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingKind, setUploadingKind] = useState<'featured' | 'gallery' | 'inline' | 'pdf' | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [ctaMalformed, setCtaMalformed] = useState(initialEditor.malformedCta);
  const [isInternalLinkModalOpen, setIsInternalLinkModalOpen] = useState(false);
  const [newCtaButton, setNewCtaButton] = useState<CtaButton>(createEmptyCtaButton(initialEditor.state.ctaButtons.length));
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [newGalleryImageAlt, setNewGalleryImageAlt] = useState('');
  const stateRef = useRef(post);
  const currentPostIdRef = useRef(currentPostId);
  const debounceRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);
  const queuedSaveRef = useRef(false);
  const versionRef = useRef(0);
  const flushSaveRef = useRef<() => Promise<boolean>>(async () => false);
  const slugEditedRef = useRef(Boolean(initialEditor.state.id));
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const featuredInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const tempImageIdRef = useRef(-1);

  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const imageAssets = post.media.filter((media) => isImageMediaType(media.fileType));
  const pdfResources = post.media.filter((media) => isPdfMediaType(media.fileType));
  const hasPersistedPost = Boolean(currentPostId);
  const canPreview = Boolean(currentPostId || post.title.trim() || post.body.trim() || post.excerpt?.trim() || post.deck?.trim());
  const scheduleError = getScheduleError(post.status, post.scheduledFor);

  const saveText = getSavedText({
    hasPersistedPost,
    isSaving: saving,
    isDirty,
    hasScheduledSave,
    savedAt,
  });
  const saveTone = saving || isDirty || hasScheduledSave ? 'warning' : savedAt ? 'success' : 'default';

  useEffect(() => {
    stateRef.current = post;
  }, [post]);

  useEffect(() => {
    currentPostIdRef.current = currentPostId;
  }, [currentPostId]);

  useEffect(() => {
    clearScheduledSave();
    stateRef.current = initialEditor.state;
    currentPostIdRef.current = initialEditor.state.id;
    setPost(initialEditor.state);
    setCurrentPostId(initialEditor.state.id);
    setActiveTab('content');
    setSaving(false);
    isSavingRef.current = false;
    queuedSaveRef.current = false;
    setHasScheduledSave(false);
    setIsDirty(false);
    setSavedAt(null);
    setSaveError(null);
    setUploadFeedback(null);
    setUploadError(null);
    setCtaMalformed(initialEditor.malformedCta);
    setIsInternalLinkModalOpen(false);
    setNewCtaButton(createEmptyCtaButton(initialEditor.state.ctaButtons.length));
    setNewGalleryImageUrl('');
    setNewGalleryImageAlt('');
    tempImageIdRef.current = -1;
    slugEditedRef.current = Boolean(initialEditor.state.slug.trim());
  }, [initialEditor]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty && !saving && !hasScheduledSave) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasScheduledSave, isDirty, saving]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void flushSaveRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function clearScheduledSave() {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setHasScheduledSave(false);
  }

  function scheduleSave() {
    clearScheduledSave();
    setHasScheduledSave(true);
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      setHasScheduledSave(false);
      void saveNow();
    }, 1200);
  }

  function applyPostUpdate(next: EditorPostState | ((current: EditorPostState) => EditorPostState), saveMode: SaveMode) {
    setSaveError(null);
    setUploadError(null);
    versionRef.current += 1;
    setIsDirty(true);
    const updated = typeof next === 'function' ? next(stateRef.current) : next;
    stateRef.current = updated;
    setPost(updated);

    if (saveMode === 'manual') {
      clearScheduledSave();
      return;
    }

    if (saveMode === 'immediate') {
      clearScheduledSave();
      void saveNow();
      return;
    }

    scheduleSave();
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
    const currentPost = stateRef.current;

    return {
      media: dedupeMedia([...currentPost.media, media]),
      mediaIds: Array.from(new Set([...currentPost.mediaIds, media.id])),
    };
  }

  function attachMediaBatchToPost(mediaItems: MediaRecord[]) {
    const currentPost = stateRef.current;

    return {
      media: dedupeMedia([...currentPost.media, ...mediaItems]),
      mediaIds: Array.from(new Set([...currentPost.mediaIds, ...mediaItems.map((media) => media.id)])),
    };
  }

  async function saveNow() {
    if (!isDirty && !hasScheduledSave && currentPostIdRef.current) {
      return true;
    }

    const validationError = validateEditorState(stateRef.current);
    if (validationError) {
      setSaveError(validationError);
      return false;
    }

    if (isSavingRef.current) {
      queuedSaveRef.current = true;
      return false;
    }

    const versionAtSave = versionRef.current;
    const payload = toSavePayload(stateRef.current);
    const requestUrl = currentPostIdRef.current ? `/api/blog/${currentPostIdRef.current}` : '/api/blog';
    const method = currentPostIdRef.current ? 'PUT' : 'POST';

    isSavingRef.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(requestUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.id) {
        setSaveError(typeof json?.error === 'string' ? json.error : 'Unable to save changes.');
        return false;
      }

      const nextPersisted = json as PersistedPostRecord;
      const parsed = toEditorState(nextPersisted);
      const replaceAll = versionRef.current === versionAtSave;
      const nextState = replaceAll ? parsed.state : mergeServerState(stateRef.current, parsed.state);

      stateRef.current = nextState;
      setPost(nextState);
      setCurrentPostId(parsed.state.id);
      setSavedAt(Date.now());
      setCtaMalformed(false);

      if (replaceAll) {
        setIsDirty(false);
      } else {
        queuedSaveRef.current = true;
      }

      if (!currentPostIdRef.current && parsed.state.id) {
        currentPostIdRef.current = parsed.state.id;
        router.replace(`/admin/blog/${parsed.state.id}/edit`);
      }

      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save changes.');
      return false;
    } finally {
      isSavingRef.current = false;
      setSaving(false);

      if (queuedSaveRef.current) {
        queuedSaveRef.current = false;
        void saveNow();
      }
    }
  }

  async function flushSave() {
    clearScheduledSave();
    return saveNow();
  }

  flushSaveRef.current = flushSave;

  function handleTitleChange(value: string) {
    applyPostUpdate((current) => {
      const nextSlug = slugEditedRef.current ? current.slug : slugify(value);
      return {
        ...current,
        title: value,
        slug: nextSlug,
      };
    }, 'debounced');
  }

  function handleSlugChange(value: string) {
    slugEditedRef.current = value.trim().length > 0;
    applyPostUpdate(
      (current) => ({
        ...current,
        slug: value,
      }),
      'debounced',
    );
  }

  function handleStatusChange(nextStatus: PostStatusValue) {
    if (nextStatus === 'PUBLISHED' && !stateRef.current.body.trim()) {
      setSaveError('Content is required before publishing or scheduling.');
      return;
    }

    if (nextStatus === 'SCHEDULED') {
      applyPostUpdate(
        (current) => ({
          ...current,
          status: nextStatus,
          stage: resolveBlogStage({ stageInput: current.stage, status: nextStatus, fallback: current.stage }),
          published: false,
          publishedAt: null,
          archivedAt: null,
        }),
        'manual',
      );
      return;
    }

    applyPostUpdate(
      (current) => ({
        ...current,
        status: nextStatus,
        stage: resolveBlogStage({ stageInput: current.stage, status: nextStatus, fallback: current.stage }),
        scheduledFor: nextStatus === 'DRAFT' || nextStatus === 'PUBLISHED' || nextStatus === 'ARCHIVED' ? null : current.scheduledFor,
        archivedAt: nextStatus === 'ARCHIVED' ? current.archivedAt : null,
        publishedAt: nextStatus === 'DRAFT' ? null : current.publishedAt,
        published: nextStatus === 'PUBLISHED',
      }),
      'immediate',
    );
  }

  function handleStageChange(nextStage: BlogStageValue) {
    const nextStatus =
      nextStage === 'PUBLISHED' ? 'PUBLISHED' : nextStage === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT';

    applyPostUpdate(
      (current) => ({
        ...current,
        stage: nextStage,
        status: nextStatus,
        scheduledFor: nextStatus === 'DRAFT' ? null : current.scheduledFor,
        archivedAt: nextStatus === 'ARCHIVED' ? current.archivedAt : null,
        publishedAt: nextStatus === 'PUBLISHED' ? current.publishedAt : nextStatus === 'DRAFT' ? null : current.publishedAt,
        published: nextStatus === 'PUBLISHED',
      }),
      nextStatus === 'DRAFT' ? 'debounced' : 'immediate',
    );
  }

  function handleScheduledForChange(value: string) {
    const nextIso = toIsoFromLocalDateTime(value);
    applyPostUpdate(
      (current) => ({
        ...current,
        scheduledFor: nextIso,
      }),
      nextIso ? 'debounced' : 'manual',
    );
  }

  function handleAffiliateToggle(affiliateId: string, checked: boolean) {
    applyPostUpdate(
      (current) => {
        const nextAffiliateIds = checked
          ? Array.from(new Set([...current.affiliateIds, affiliateId]))
          : current.affiliateIds.filter((id) => id !== affiliateId);

        return {
          ...current,
          affiliateIds: nextAffiliateIds,
        };
      },
      'immediate',
    );
  }

  function handleCtaDraftChange(partial: Partial<CtaButton>) {
    setNewCtaButton((current) => ({ ...current, ...partial }));
  }

  function focusContentSelection(start: number, end: number) {
    setActiveTab('content');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const textarea = contentTextareaRef.current;
        if (!textarea) {
          return;
        }

        textarea.focus();
        textarea.setSelectionRange(start, end);
      });
    });
  }

  function insertBodyAtCursor(value: string, saveMode: SaveMode = 'debounced') {
    const currentPost = stateRef.current;
    const textarea = contentTextareaRef.current;
    const start = textarea?.selectionStart ?? currentPost.body.length;
    const end = textarea?.selectionEnd ?? start;
    const insertion = insertAtSelection(currentPost.body, start, end, value);

    applyPostUpdate(
      {
        ...currentPost,
        body: insertion.content,
      },
      saveMode,
    );

    focusContentSelection(insertion.nextCursorPosition, insertion.nextCursorPosition);
  }

  function insertBodyBlockAtCursor(value: string, saveMode: SaveMode = 'debounced') {
    const currentPost = stateRef.current;
    const textarea = contentTextareaRef.current;
    const start = textarea?.selectionStart ?? currentPost.body.length;
    const end = textarea?.selectionEnd ?? start;
    const block = value.trim();
    const prefix = needsLeadingSpacing(currentPost.body, start) ? '\n\n' : '';
    const suffix = needsTrailingSpacing(currentPost.body, end) ? '\n\n' : '';
    const insertion = insertAtSelection(currentPost.body, start, end, `${prefix}${block}${suffix}`);

    applyPostUpdate(
      {
        ...currentPost,
        body: insertion.content,
      },
      saveMode,
    );

    focusContentSelection(insertion.nextCursorPosition, insertion.nextCursorPosition);
  }

  function applyMarkdownFormat(action: ContentFormatAction) {
    const currentPost = stateRef.current;
    const textarea = contentTextareaRef.current;
    const start = textarea?.selectionStart ?? currentPost.body.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = currentPost.body.slice(start, end);
    const hasSelection = selected.length > 0;

    const applyReplacement = (replacement: ReturnType<typeof replaceSelection>) => {
      applyPostUpdate(
        {
          ...currentPost,
          body: replacement.content,
        },
        'debounced',
      );

      focusContentSelection(replacement.nextSelectionStart, replacement.nextSelectionEnd);
    };

    if (action === 'bold') {
      const text = hasSelection ? selected : 'bold text';
      const replacement = `**${text}**`;
      applyReplacement(replaceSelection(currentPost.body, start, end, replacement, start + 2, start + 2 + text.length));
      return;
    }

    if (action === 'italic') {
      const text = hasSelection ? selected : 'italic text';
      const replacement = `*${text}*`;
      applyReplacement(replaceSelection(currentPost.body, start, end, replacement, start + 1, start + 1 + text.length));
      return;
    }

    if (action === 'h2' || action === 'h3') {
      const prefix = action === 'h2' ? '## ' : '### ';
      const text = hasSelection ? selected.replace(/\n+/g, ' ').trim() : action === 'h2' ? 'Section heading' : 'Subheading';
      const block = `${prefix}${text}`;
      const replacement = start === 0 ? `${block}\n\n` : `\n\n${block}\n\n`;
      const nextStart = start + (start === 0 ? prefix.length : prefix.length + 2);
      applyReplacement(replaceSelection(currentPost.body, start, end, replacement, nextStart, nextStart + text.length));
      return;
    }

    if (action === 'bulletList' || action === 'numberedList') {
      const lines = (hasSelection ? selected : action === 'bulletList' ? 'List item' : 'First item\nSecond item')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const replacement = lines
        .map((line, index) => (action === 'bulletList' ? `- ${line}` : `${index + 1}. ${line}`))
        .join('\n');
      applyReplacement(replaceSelection(currentPost.body, start, end, replacement));
      return;
    }

    if (action === 'quote') {
      const lines = (hasSelection ? selected : 'Quoted note')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `> ${line}`)
        .join('\n');
      applyReplacement(replaceSelection(currentPost.body, start, end, lines));
      return;
    }

    if (action === 'divider') {
      insertBodyAtCursor('\n\n---\n\n');
      return;
    }

    if (action === 'link') {
      const label = hasSelection ? selected : 'Link text';
      const href = window.prompt('Enter the destination URL', 'https://');
      if (!href) {
        return;
      }

      const replacement = `[${label}](${href.trim()})`;
      applyReplacement(replaceSelection(currentPost.body, start, end, replacement, start + 1, start + 1 + label.length));
    }
  }

  function insertCtaIntoBody(buttonId: string) {
    insertBodyAtCursor(createCtaSlotToken(buttonId), 'immediate');
  }

  function insertContentTemplate(templateId: ContentTemplateId) {
    const template = getContentTemplate(templateId);
    if (!template) {
      return;
    }

    insertBodyBlockAtCursor(template.content, 'debounced');
  }

  function insertStyledBlock(blockId: StyledBlockId) {
    const snippet = getStyledBlockSnippet(blockId);
    if (!snippet) {
      return;
    }

    insertBodyBlockAtCursor(snippet, 'debounced');
  }

  function insertInternalLink(markdown: string) {
    insertBodyAtCursor(markdown, 'debounced');
  }

  function handleAddCtaButton(insertIntoBody = false) {
    if (!newCtaButton.label.trim() || !isValidCtaUrl(newCtaButton.url)) {
      setSaveError('CTA buttons must include a valid http:// or https:// URL and label.');
      return;
    }

    const normalizedButton = {
      ...newCtaButton,
      id: newCtaButton.id || `cta-${stateRef.current.ctaButtons.length + 1}`,
      label: newCtaButton.label.trim(),
      url: newCtaButton.url.trim(),
      partnerId: newCtaButton.partnerId ?? null,
    } satisfies CtaButton;
    const textarea = contentTextareaRef.current;
    const selectionStart = textarea?.selectionStart ?? stateRef.current.body.length;
    const selectionEnd = textarea?.selectionEnd ?? selectionStart;
    const insertion = insertIntoBody
      ? insertAtSelection(stateRef.current.body, selectionStart, selectionEnd, createCtaSlotToken(normalizedButton.id))
      : null;

    applyPostUpdate(
      (current) => ({
        ...current,
        body: insertion ? insertion.content : current.body,
        ctaButtons: [...current.ctaButtons, normalizedButton],
      }),
      'immediate',
    );
    setNewCtaButton(createEmptyCtaButton(stateRef.current.ctaButtons.length));

    if (insertion) {
      focusContentSelection(insertion.nextCursorPosition, insertion.nextCursorPosition);
    }
  }

  function handleCtaButtonChange(index: number, partial: Partial<CtaButton>, saveMode: 'debounced' | 'immediate') {
    applyPostUpdate(
      (current) => ({
        ...current,
        ctaButtons: current.ctaButtons.map((button, buttonIndex) =>
          buttonIndex === index ? { ...button, ...partial } : button,
        ),
      }),
      saveMode,
    );
  }

  function handleCtaButtonRemove(index: number) {
    applyPostUpdate(
      (current) => ({
        ...current,
        ctaButtons: current.ctaButtons.filter((_, buttonIndex) => buttonIndex !== index),
      }),
      'immediate',
    );
  }

  function addGalleryImageFromUrl() {
    const url = newGalleryImageUrl.trim();
    if (!url) {
      setUploadError('Add an image URL before saving to the gallery.');
      return;
    }

    if (!isValidImageUrl(url)) {
      setUploadError('Gallery image URLs must start with http://, https://, or /.');
      return;
    }

    const alt = newGalleryImageAlt.trim();
    applyPostUpdate(
      (current) => ({
        ...current,
        images: [
          ...current.images.filter((image) => image.url !== url),
          {
            id: tempImageIdRef.current--,
            url,
            alt: alt.length > 0 ? alt : null,
          },
        ],
      }),
      'immediate',
    );
    setNewGalleryImageUrl('');
    setNewGalleryImageAlt('');
    setUploadError(null);
    setUploadFeedback('Gallery image added.');
  }

  function updateGalleryImage(index: number, partial: { alt?: string }) {
    applyPostUpdate(
      (current) => ({
        ...current,
        images: current.images.map((image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                alt: partial.alt !== undefined ? (partial.alt.trim().length > 0 ? partial.alt : null) : image.alt,
              }
            : image,
        ),
      }),
      'debounced',
    );
  }

  function removeGalleryImage(index: number) {
    applyPostUpdate(
      (current) => ({
        ...current,
        images: current.images.filter((_, imageIndex) => imageIndex !== index),
      }),
      'immediate',
    );
  }

  async function handleFeaturedUpload(file: File) {
    setUploadingKind('featured');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const media = await uploadFile(file);
      const mediaState = attachMediaToPost(media);
      applyPostUpdate(
        (current) => ({
          ...current,
          featuredImageId: media.id,
          featuredImage: media,
          featuredImageUrl: null,
          coverImage: media.url,
          media: mediaState.media,
          mediaIds: mediaState.mediaIds,
        }),
        'immediate',
      );
      setUploadFeedback('Featured image uploaded.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload featured image.');
    } finally {
      setUploadingKind(null);
    }
  }

  async function handleGalleryUpload(files: FileList | File[]) {
    const uploads = Array.from(files);
    if (uploads.length === 0) {
      return;
    }

    setUploadingKind('gallery');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const mediaItems: MediaRecord[] = [];

      for (const file of uploads) {
        mediaItems.push(await uploadFile(file));
      }

      const mediaState = attachMediaBatchToPost(mediaItems);
      applyPostUpdate(
        (current) => ({
          ...current,
          media: mediaState.media,
          mediaIds: mediaState.mediaIds,
        }),
        'immediate',
      );
      setUploadFeedback(
        mediaItems.length === 1 ? 'Image uploaded to the post library.' : `${mediaItems.length} images uploaded to the post library.`,
      );
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload images.');
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
      const currentPost = stateRef.current;
      const textarea = contentTextareaRef.current;
      const start = textarea?.selectionStart ?? currentPost.body.length;
      const end = textarea?.selectionEnd ?? start;
      const markdown = `\n\n![${toAltText(media.fileName)}](${media.url})\n\n`;
      const insertion = insertAtSelection(currentPost.body, start, end, markdown);
      const mediaState = attachMediaToPost(media);

      applyPostUpdate(
        {
          ...currentPost,
          body: insertion.content,
          media: mediaState.media,
          mediaIds: mediaState.mediaIds,
        },
        'debounced',
      );

      requestAnimationFrame(() => {
        if (!textarea) {
          return;
        }

        textarea.focus();
        textarea.setSelectionRange(insertion.nextCursorPosition, insertion.nextCursorPosition);
      });

      setUploadFeedback('Image uploaded and inserted into the draft.');
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
      applyPostUpdate(
        (current) => ({
          ...current,
          media: mediaState.media,
          mediaIds: mediaState.mediaIds,
        }),
        'immediate',
      );
      setUploadFeedback('PDF resource uploaded and attached.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload PDF resource.');
    } finally {
      setUploadingKind(null);
    }
  }

  function removeAttachedMedia(mediaId: string) {
    applyPostUpdate(
      (current) => ({
        ...current,
        media: current.media.filter((media) => media.id !== mediaId),
        mediaIds: current.mediaIds.filter((id) => id !== mediaId),
        featuredImageId: current.featuredImageId === mediaId ? null : current.featuredImageId,
        featuredImage: current.featuredImageId === mediaId ? null : current.featuredImage,
        coverImage: current.featuredImageId === mediaId ? null : current.coverImage,
      }),
      'immediate',
    );
  }

  function handleInsertImageFromLibrary(media: MediaRecord) {
    const markdown = `\n\n![${toAltText(media.fileName)}](${media.url})\n\n`;
    insertBodyAtCursor(markdown, 'debounced');
    setUploadFeedback('Image inserted into the draft.');
  }

  function handleSetFeaturedImageFromLibrary(media: MediaRecord) {
    applyPostUpdate(
      (current) => ({
        ...current,
        featuredImageId: media.id,
        featuredImage: media,
        featuredImageUrl: null,
        coverImage: media.url,
      }),
      'immediate',
    );
    setUploadFeedback('Featured image updated from the library.');
  }

  async function openPreview() {
    const saved = await flushSave();
    if (!saved || !currentPostIdRef.current) {
      return;
    }

    router.push(`/admin/blog/${currentPostIdRef.current}/preview`);
  }

  const leftColumn =
    activeTab === 'content' ? (
      <PostContentPanel
        title={post.title}
        focusKeyword={post.focusKeyword ?? ''}
        seoTitle={post.seoTitle ?? ''}
        seoDescription={post.seoDescription ?? ''}
        canonicalUrl={post.canonicalUrl ?? ''}
        deck={post.deck ?? ''}
        excerpt={post.excerpt ?? ''}
        body={post.body}
        onTitleChange={handleTitleChange}
        onDeckChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              deck: value,
            }),
            'debounced',
          )
        }
        onExcerptChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              excerpt: value,
            }),
            'debounced',
          )
        }
        onBodyChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              body: value,
            }),
            'debounced',
          )
        }
        onFocusKeywordChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              focusKeyword: value,
            }),
            'debounced',
          )
        }
        onSeoTitleChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              seoTitle: value,
            }),
            'debounced',
          )
        }
        onSeoDescriptionChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              seoDescription: value,
            }),
            'debounced',
          )
        }
        onCanonicalUrlChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              canonicalUrl: value,
            }),
            'debounced',
          )
        }
        onApplyFormat={applyMarkdownFormat}
        onInsertTemplate={insertContentTemplate}
        onInsertStyledBlock={insertStyledBlock}
        onOpenInternalLinkModal={() => setIsInternalLinkModalOpen(true)}
        onOpenInlineImagePicker={() => inlineInputRef.current?.click()}
        inlineUploadLabel={uploadingKind === 'inline' ? 'Uploading...' : 'Upload image'}
        inlineUploadDisabled={uploadingKind === 'inline'}
        contentTextareaRef={contentTextareaRef}
      />
    ) : activeTab === 'media' ? (
      <PostMediaPanel
        title={post.title}
        featuredImageUrl={featuredImageUrl}
        featuredImageUrlInput={post.featuredImageUrl ?? ''}
        featuredImageId={post.featuredImageId}
        featuredUploadLabel={uploadingKind === 'featured' ? 'Uploading...' : featuredImageUrl ? 'Replace image' : 'Upload image'}
        featuredUploadDisabled={uploadingKind === 'featured'}
        onOpenFeaturedPicker={() => featuredInputRef.current?.click()}
        onFeaturedImageUrlChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              featuredImageUrl: value,
            }),
            'debounced',
          )
        }
        onRemoveFeaturedImage={() =>
          applyPostUpdate(
            (current) => ({
              ...current,
              featuredImageId: null,
              featuredImage: null,
              coverImage: null,
            }),
            'immediate',
          )
        }
        imageAssets={imageAssets}
        imageUploadLabel={uploadingKind === 'gallery' ? 'Uploading...' : 'Upload images'}
        imageUploadDisabled={uploadingKind === 'gallery'}
        onOpenImagePicker={() => galleryInputRef.current?.click()}
        onInsertImage={handleInsertImageFromLibrary}
        onSetFeaturedImage={handleSetFeaturedImageFromLibrary}
        onRemoveImage={removeAttachedMedia}
        galleryImages={post.images}
        newGalleryImageUrl={newGalleryImageUrl}
        newGalleryImageAlt={newGalleryImageAlt}
        onNewGalleryImageUrlChange={setNewGalleryImageUrl}
        onNewGalleryImageAltChange={setNewGalleryImageAlt}
        onAddGalleryImage={addGalleryImageFromUrl}
        onUpdateGalleryImage={updateGalleryImage}
        onRemoveGalleryImage={removeGalleryImage}
        pdfResources={pdfResources}
        pdfUploadLabel={uploadingKind === 'pdf' ? 'Uploading...' : 'Upload PDF'}
        pdfUploadDisabled={uploadingKind === 'pdf'}
        onOpenPdfPicker={() => pdfInputRef.current?.click()}
        onRemovePdfResource={removeAttachedMedia}
      />
    ) : (
      <PostSeoPanel
        focusKeyword={post.focusKeyword ?? ''}
        seoTitle={post.seoTitle ?? ''}
        seoDescription={post.seoDescription ?? ''}
        canonicalUrl={post.canonicalUrl ?? ''}
        onFocusKeywordChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              focusKeyword: value,
            }),
            'debounced',
          )
        }
        onSeoTitleChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              seoTitle: value,
            }),
            'debounced',
          )
        }
        onSeoDescriptionChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              seoDescription: value,
            }),
            'debounced',
          )
        }
        onCanonicalUrlChange={(value) =>
          applyPostUpdate(
            (current) => ({
              ...current,
              canonicalUrl: value,
            }),
            'debounced',
          )
        }
      />
    );

  return (
    <AdminStack gap="lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminButton asChild variant="secondary" size="sm">
          <Link href="/admin/blog">Back to posts</Link>
        </AdminButton>
        <p className="admin-micro">Daily workspace: edit on the left, publish controls on the right.</p>
      </div>

      {(saveError || uploadError || uploadFeedback) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            saveError || uploadError
              ? 'border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] text-admin-danger'
              : 'border-[rgba(47,106,67,0.18)] bg-[rgba(47,106,67,0.05)] text-admin-success'
          }`}
        >
          {saveError ?? uploadError ?? uploadFeedback}
        </div>
      )}

      <PostEditorLayout
        tabs={[
          { id: 'content', label: 'Content' },
          { id: 'media', label: 'Media' },
          { id: 'seo', label: 'SEO' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        leftColumn={leftColumn}
        rightColumn={
          <>
            <PostPublishPanel
              hasPersistedPost={hasPersistedPost}
              status={post.status}
              stage={post.stage}
              publishedAt={post.publishedAt}
              scheduledFor={post.scheduledFor}
              archivedAt={post.archivedAt}
              saveText={saveText}
              saveTone={saveTone}
              isSaving={saving}
              canPreview={canPreview}
              scheduleError={scheduleError}
              onStatusChange={handleStatusChange}
              onStageChange={handleStageChange}
              onScheduledForChange={handleScheduledForChange}
              onSave={() => void flushSave()}
              onOpenPreview={() => void openPreview()}
            />

            <PostHealthCard
              body={post.body}
              focusKeyword={post.focusKeyword}
              seoTitle={post.seoTitle}
              seoDescription={post.seoDescription}
              featuredImageUrl={featuredImageUrl}
            />

            <PostMetaPanel
              slug={post.slug}
              category={post.category}
              featured={post.featured}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              onSlugChange={handleSlugChange}
              onCategoryChange={(value) =>
                applyPostUpdate(
                  (current) => ({
                    ...current,
                    category: value,
                  }),
                  'immediate',
                )
              }
              onToggleFeatured={(value) =>
                applyPostUpdate(
                  (current) => ({
                    ...current,
                    featured: value,
                  }),
                  'immediate',
                )
              }
            />

            <PostAffiliatesPanel
              affiliateOptions={affiliateOptions}
              selectedAffiliateIds={post.affiliateIds}
              onToggleAffiliate={handleAffiliateToggle}
            />

            <PostCtaButtonsPanel
              draftButton={newCtaButton}
              buttons={post.ctaButtons}
              affiliateOptions={affiliateOptions}
              malformed={ctaMalformed}
              onDraftChange={handleCtaDraftChange}
              onAddButton={() => handleAddCtaButton(false)}
              onAddAndInsertButton={() => handleAddCtaButton(true)}
              onUpdateButton={handleCtaButtonChange}
              onRemoveButton={handleCtaButtonRemove}
              onInsertButton={insertCtaIntoBody}
            />

            <PostMiniPreviewCard
              title={post.title}
              excerpt={post.deck?.trim() ? post.deck : post.excerpt}
              slug={post.slug}
              canPreview={canPreview}
              onOpenPreview={() => void openPreview()}
            />
          </>
        }
      />

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

      <input
        ref={galleryInputRef}
        id="post-image-library-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={async (event) => {
          const files = event.target.files;
          event.currentTarget.value = '';
          if (!files || files.length === 0) {
            return;
          }

          await handleGalleryUpload(files);
        }}
      />

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

      <InternalLinkInsertModal
        isOpen={isInternalLinkModalOpen}
        excludeId={currentPostId}
        onClose={() => setIsInternalLinkModalOpen(false)}
        onInsert={insertInternalLink}
      />
    </AdminStack>
  );
}
