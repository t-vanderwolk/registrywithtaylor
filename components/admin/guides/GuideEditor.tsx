'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AffiliatePartnerSelect from '@/components/admin/blog/AffiliatePartnerSelect';
import PostEditorLayout from '@/components/admin/blog/PostEditorLayout';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminToast from '@/components/admin/ui/AdminToast';
import {
  type AffiliatePartnerOption,
  type AuthorOption,
  type GuideEditorTabId,
  type GuideSavePayload,
  type PersistedGuideRecord,
  type RelatedGuideOption,
} from '@/components/admin/guides/guideEditorTypes';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { sanitizeGuideAffiliateModules, sanitizeGuideFaqItems, sanitizeStringList } from '@/lib/guides/types';
import { GUIDE_STATUS_LABELS, requiresLiveGuideContent, type GuideStatusValue } from '@/lib/guides/status';
import { buildDefaultAffiliateCtaText } from '@/lib/affiliatePartners';
import { slugify } from '@/lib/slugify';

type SaveMode = 'debounced' | 'immediate' | 'manual';

type GuideState = PersistedGuideRecord;

const placementOptions = [
  { value: 'before_affiliates', label: 'Before affiliate modules' },
  { value: 'after_intro', label: 'After intro' },
  { value: 'before_conclusion', label: 'Before conclusion' },
] as const;

const createEmptyFaq = () => ({
  question: '',
  answer: '',
});

const createEmptyAffiliateModule = (index: number) => ({
  id: `guide-affiliate-${index + 1}`,
  title: '',
  productName: '',
  description: '',
  ctaLabel: '',
  destinationUrl: '',
  retailerLabel: null,
  partnerId: null,
  imageUrl: null,
  notes: null,
});

const isValidImageUrl = (value: string) => /^https?:\/\//i.test(value.trim()) || value.trim().startsWith('/');
const isValidLinkTarget = (value: string) =>
  /^https?:\/\//i.test(value.trim()) || value.trim().startsWith('/') || value.trim().startsWith('#');

function formatDateTime(value?: Date | string | null) {
  if (!value) {
    return 'Not set';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toDateTimeLocal(value?: Date | string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMinutes * 60_000);
  return localDate.toISOString().slice(0, 16);
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

function getSavedText({
  hasPersistedGuide,
  isSaving,
  isDirty,
  hasScheduledSave,
  savedAt,
}: {
  hasPersistedGuide: boolean;
  isSaving: boolean;
  isDirty: boolean;
  hasScheduledSave: boolean;
  savedAt: number | null;
}) {
  if (isSaving) {
    return hasPersistedGuide ? 'Saving changes...' : 'Creating draft...';
  }

  if (isDirty || hasScheduledSave) {
    return 'Unsaved changes';
  }

  if (savedAt) {
    return `Saved at ${new Date(savedAt).toLocaleTimeString()}`;
  }

  return hasPersistedGuide ? 'Autosave is on.' : 'Create the guide on first save.';
}

function getScheduleError(status: GuideStatusValue, scheduledFor?: Date | string | null) {
  if (status !== 'SCHEDULED') {
    return undefined;
  }

  if (!scheduledFor) {
    return 'Choose a future date and time.';
  }

  const scheduledDate = new Date(scheduledFor);
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
    return 'Scheduled guides must use a future date and time.';
  }

  return undefined;
}

function toGuideState(guide: PersistedGuideRecord): GuideState {
  return {
    ...guide,
    secondaryKeywords: sanitizeStringList(guide.secondaryKeywords),
    faqItems: sanitizeGuideFaqItems(guide.faqItems),
    affiliateModules: sanitizeGuideAffiliateModules(guide.affiliateModules),
    relatedGuideIds: sanitizeStringList(guide.relatedGuideIds),
  };
}

function mergeServerState(current: GuideState, server: GuideState) {
  return {
    ...current,
    id: server.id,
    slug: current.slug.trim() || server.slug,
    title: current.title.trim() || server.title,
    status: server.status,
    publishedAt: server.publishedAt,
    scheduledFor: current.status === 'SCHEDULED' ? current.scheduledFor ?? server.scheduledFor : server.scheduledFor,
    archivedAt: server.archivedAt,
    updatedAt: server.updatedAt ?? current.updatedAt,
    createdAt: server.createdAt ?? current.createdAt,
    views: server.views,
  } satisfies GuideState;
}

function validateGuideState(guide: GuideState) {
  const combinedContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');

  if (requiresLiveGuideContent(guide.status) && !combinedContent.trim()) {
    return 'Intro, body, or conclusion content is required before publishing or scheduling.';
  }

  if (!guide.authorId) {
    return 'Assign an author before saving.';
  }

  if (guide.heroImageUrl?.trim() && !isValidImageUrl(guide.heroImageUrl)) {
    return 'Hero image URLs must start with http://, https://, or /.';
  }

  if (guide.ogImageUrl?.trim() && !isValidImageUrl(guide.ogImageUrl)) {
    return 'OG image URLs must start with http://, https://, or /.';
  }

  if (guide.canonicalUrl?.trim() && !isValidLinkTarget(guide.canonicalUrl)) {
    return 'Canonical URL must start with http://, https://, /, or #.';
  }

  if (guide.newsletterCtaEnabled && !guide.newsletterCtaHref?.trim()) {
    return 'Add a newsletter or lead magnet URL when that CTA is enabled.';
  }

  if (guide.newsletterCtaHref?.trim() && !isValidLinkTarget(guide.newsletterCtaHref)) {
    return 'Newsletter CTA links must start with http://, https://, /, or #.';
  }

  if (guide.nextStepCtaHref?.trim() && !isValidLinkTarget(guide.nextStepCtaHref)) {
    return 'Next-step CTA links must start with http://, https://, /, or #.';
  }

  for (const faq of guide.faqItems) {
    const hasQuestion = faq.question.trim().length > 0;
    const hasAnswer = faq.answer.trim().length > 0;
    if (hasQuestion !== hasAnswer) {
      return 'Each FAQ row needs both a question and an answer.';
    }
  }

  for (const module of guide.affiliateModules) {
    const touched =
      module.title.trim() ||
      module.productName.trim() ||
      module.description.trim() ||
      module.ctaLabel.trim() ||
      module.destinationUrl.trim();
    if (!touched) {
      continue;
    }

    if (
      !module.title.trim() ||
      !module.productName.trim() ||
      !module.description.trim() ||
      !module.ctaLabel.trim() ||
      !/^https?:\/\//i.test(module.destinationUrl.trim())
    ) {
      return 'Each affiliate module needs a title, product name, description, CTA label, and full destination URL.';
    }
  }

  return getScheduleError(guide.status, guide.scheduledFor);
}

function toSavePayload(guide: GuideState, sourceRoute: string): GuideSavePayload {
  return {
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
    intro: guide.intro,
    content: guide.content,
    conclusion: guide.conclusion,
    heroImageUrl: guide.heroImageUrl,
    heroImageAlt: guide.heroImageAlt,
    authorId: guide.authorId,
    category: guide.category,
    topicCluster: guide.topicCluster,
    status: guide.status,
    publishedAt: guide.publishedAt,
    scheduledFor: guide.scheduledFor,
    archivedAt: guide.archivedAt,
    seoTitle: guide.seoTitle,
    seoDescription: guide.seoDescription,
    ogTitle: guide.ogTitle,
    ogDescription: guide.ogDescription,
    ogImageUrl: guide.ogImageUrl,
    ogImageAlt: guide.ogImageAlt,
    canonicalUrl: guide.canonicalUrl,
    targetKeyword: guide.targetKeyword,
    secondaryKeywords: sanitizeStringList(guide.secondaryKeywords),
    internalLinkNotes: guide.internalLinkNotes,
    tableOfContentsEnabled: guide.tableOfContentsEnabled,
    faqItems: sanitizeGuideFaqItems(guide.faqItems),
    affiliateDisclosureEnabled: guide.affiliateDisclosureEnabled,
    affiliateDisclosureText: guide.affiliateDisclosureText,
    affiliateDisclosurePlacement: guide.affiliateDisclosurePlacement,
    affiliateModules: sanitizeGuideAffiliateModules(guide.affiliateModules),
    consultationCtaEnabled: guide.consultationCtaEnabled,
    consultationCtaLabel: guide.consultationCtaLabel,
    newsletterCtaEnabled: guide.newsletterCtaEnabled,
    newsletterCtaLabel: guide.newsletterCtaLabel,
    newsletterCtaDescription: guide.newsletterCtaDescription,
    newsletterCtaHref: guide.newsletterCtaHref,
    nextStepCtaLabel: guide.nextStepCtaLabel,
    nextStepCtaHref: guide.nextStepCtaHref,
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
    relatedGuideIds: sanitizeStringList(guide.relatedGuideIds),
    sourceRoute,
  };
}

export default function GuideEditor({
  initialGuide,
  authorOptions,
  affiliatePartnerOptions,
  relatedGuideOptions,
}: {
  initialGuide: PersistedGuideRecord;
  authorOptions: AuthorOption[];
  affiliatePartnerOptions: AffiliatePartnerOption[];
  relatedGuideOptions: RelatedGuideOption[];
}) {
  const router = useRouter();
  const initialState = useMemo(() => toGuideState(initialGuide), [initialGuide]);
  const [guide, setGuide] = useState<GuideState>(initialState);
  const [currentGuideId, setCurrentGuideId] = useState<string | null>(initialState.id);
  const [activeTab, setActiveTab] = useState<GuideEditorTabId>('core');
  const [saving, setSaving] = useState(false);
  const [hasScheduledSave, setHasScheduledSave] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingKind, setUploadingKind] = useState<'hero' | 'og' | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const stateRef = useRef(guide);
  const currentGuideIdRef = useRef(currentGuideId);
  const debounceRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);
  const queuedSaveRef = useRef(false);
  const versionRef = useRef(0);
  const flushSaveRef = useRef<() => Promise<boolean>>(async () => false);
  const slugEditedRef = useRef(Boolean(initialState.id));
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const ogInputRef = useRef<HTMLInputElement | null>(null);

  const hasPersistedGuide = Boolean(currentGuideId);
  const canPreview = Boolean(
    currentGuideId || guide.title.trim() || guide.content.trim() || guide.intro?.trim() || guide.excerpt?.trim(),
  );
  const scheduleError = getScheduleError(guide.status, guide.scheduledFor);
  const saveText = getSavedText({
    hasPersistedGuide,
    isSaving: saving,
    isDirty,
    hasScheduledSave,
    savedAt,
  });
  const saveTone = saving || isDirty || hasScheduledSave ? 'warning' : savedAt ? 'success' : 'default';
  const relatedOptions = relatedGuideOptions.filter((entry) => entry.id !== currentGuideId);

  useEffect(() => {
    stateRef.current = guide;
  }, [guide]);

  useEffect(() => {
    currentGuideIdRef.current = currentGuideId;
  }, [currentGuideId]);

  useEffect(() => {
    clearScheduledSave();
    const next = toGuideState(initialGuide);
    stateRef.current = next;
    currentGuideIdRef.current = next.id;
    setGuide(next);
    setCurrentGuideId(next.id);
    setActiveTab('core');
    setSaving(false);
    isSavingRef.current = false;
    queuedSaveRef.current = false;
    setHasScheduledSave(false);
    setIsDirty(false);
    setSavedAt(null);
    setSaveError(null);
    setUploadFeedback(null);
    setUploadError(null);
    slugEditedRef.current = Boolean(next.slug.trim());
  }, [initialGuide]);

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

  function applyGuideUpdate(next: GuideState | ((current: GuideState) => GuideState), saveMode: SaveMode) {
    setSaveError(null);
    setUploadError(null);
    versionRef.current += 1;
    setIsDirty(true);
    const updated = typeof next === 'function' ? next(stateRef.current) : next;
    stateRef.current = updated;
    setGuide(updated);

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
      | ({ error?: string; url?: string })
      | null;

    if (!response.ok || !payload?.url) {
      throw new Error(payload?.error || 'Upload failed.');
    }

    return payload.url;
  }

  async function saveNow() {
    if (!isDirty && !hasScheduledSave && currentGuideIdRef.current) {
      return true;
    }

    const validationError = validateGuideState(stateRef.current);
    if (validationError) {
      setSaveError(validationError);
      return false;
    }

    if (isSavingRef.current) {
      queuedSaveRef.current = true;
      return false;
    }

    const versionAtSave = versionRef.current;
    const sourceRoute = currentGuideIdRef.current ? `/admin/guides/${currentGuideIdRef.current}/edit` : '/admin/guides/new';
    const payload = toSavePayload(stateRef.current, sourceRoute);
    const requestUrl = currentGuideIdRef.current ? `/api/guides/${currentGuideIdRef.current}` : '/api/guides';
    const method = currentGuideIdRef.current ? 'PUT' : 'POST';

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
        setSaveError(typeof json?.error === 'string' ? json.error : 'Unable to save guide changes.');
        return false;
      }

      const nextPersisted = toGuideState(json as PersistedGuideRecord);
      const replaceAll = versionRef.current === versionAtSave;
      const nextState = replaceAll ? nextPersisted : mergeServerState(stateRef.current, nextPersisted);

      stateRef.current = nextState;
      setGuide(nextState);
      setCurrentGuideId(nextPersisted.id);
      setSavedAt(Date.now());

      if (replaceAll) {
        setIsDirty(false);
      } else {
        queuedSaveRef.current = true;
      }

      if (!currentGuideIdRef.current && nextPersisted.id) {
        currentGuideIdRef.current = nextPersisted.id;
        router.replace(`/admin/guides/${nextPersisted.id}/edit`);
      }

      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save guide changes.');
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
    applyGuideUpdate((current) => {
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
    applyGuideUpdate(
      (current) => ({
        ...current,
        slug: value,
      }),
      'debounced',
    );
  }

  function handleStatusChange(nextStatus: GuideStatusValue) {
    if (nextStatus === 'PUBLISHED' && ![guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n').trim()) {
      setSaveError('Add guide content before publishing.');
      return;
    }

    if (nextStatus === 'SCHEDULED') {
      applyGuideUpdate(
        (current) => ({
          ...current,
          status: nextStatus,
          archivedAt: null,
        }),
        'manual',
      );
      return;
    }

    applyGuideUpdate(
      (current) => ({
        ...current,
        status: nextStatus,
        scheduledFor: nextStatus === 'DRAFT' || nextStatus === 'PUBLISHED' || nextStatus === 'ARCHIVED' ? null : current.scheduledFor,
        archivedAt: nextStatus === 'ARCHIVED' ? current.archivedAt : null,
        publishedAt: nextStatus === 'DRAFT' ? null : current.publishedAt,
      }),
      'immediate',
    );
  }

  function handleScheduledForChange(value: string) {
    const nextIso = toIsoFromLocalDateTime(value);
    applyGuideUpdate(
      (current) => ({
        ...current,
        scheduledFor: nextIso,
      }),
      nextIso ? 'debounced' : 'manual',
    );
  }

  function handleFaqChange(index: number, field: 'question' | 'answer', value: string) {
    applyGuideUpdate(
      (current) => ({
        ...current,
        faqItems: current.faqItems.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
      }),
      'debounced',
    );
  }

  function addFaqItem() {
    applyGuideUpdate(
      (current) => ({
        ...current,
        faqItems: [...current.faqItems, createEmptyFaq()],
      }),
      'manual',
    );
  }

  function removeFaqItem(index: number) {
    applyGuideUpdate(
      (current) => ({
        ...current,
        faqItems: current.faqItems.filter((_, itemIndex) => itemIndex !== index),
      }),
      'manual',
    );
  }

  function handleAffiliateModuleChange(
    index: number,
    partial: Partial<GuideState['affiliateModules'][number]>,
    saveMode: SaveMode = 'debounced',
  ) {
    applyGuideUpdate(
      (current) => ({
        ...current,
        affiliateModules: current.affiliateModules.map((module, moduleIndex) =>
          moduleIndex === index ? { ...module, ...partial } : module,
        ),
      }),
      saveMode,
    );
  }

  function addAffiliateModule() {
    applyGuideUpdate(
      (current) => ({
        ...current,
        affiliateModules: [...current.affiliateModules, createEmptyAffiliateModule(current.affiliateModules.length)],
      }),
      'manual',
    );
  }

  function removeAffiliateModule(index: number) {
    applyGuideUpdate(
      (current) => ({
        ...current,
        affiliateModules: current.affiliateModules.filter((_, moduleIndex) => moduleIndex !== index),
      }),
      'manual',
    );
  }

  async function handleHeroUpload(file: File) {
    setUploadingKind('hero');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const url = await uploadFile(file);
      applyGuideUpdate(
        (current) => ({
          ...current,
          heroImageUrl: url,
          heroImageAlt: current.heroImageAlt?.trim() ? current.heroImageAlt : current.title,
        }),
        'immediate',
      );
      setUploadFeedback('Hero image uploaded.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload hero image.');
    } finally {
      setUploadingKind(null);
    }
  }

  async function handleOgUpload(file: File) {
    setUploadingKind('og');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const url = await uploadFile(file);
      applyGuideUpdate(
        (current) => ({
          ...current,
          ogImageUrl: url,
          ogImageAlt: current.ogImageAlt?.trim() ? current.ogImageAlt : current.title,
        }),
        'immediate',
      );
      setUploadFeedback('OG image uploaded.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload OG image.');
    } finally {
      setUploadingKind(null);
    }
  }

  async function openPreview() {
    const saved = await flushSave();
    if (!saved || !currentGuideIdRef.current) {
      return;
    }

    router.push(`/admin/guides/${currentGuideIdRef.current}/preview`);
  }

  const publishSurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Publish</p>
        <h2 className="admin-h2">{GUIDE_STATUS_LABELS[guide.status]}</h2>
        <p className="admin-body">Guides move from private drafts to scheduled or published authority pages.</p>
      </div>

      <AdminField label="Status" htmlFor="guide-status">
        <AdminSelect id="guide-status" value={guide.status} onChange={(event) => handleStatusChange(event.target.value as GuideStatusValue)}>
          {Object.entries(GUIDE_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      {guide.status === 'SCHEDULED' ? (
        <AdminField
          label="Scheduled for"
          htmlFor="guide-scheduled-for"
          help="Use your local time. Scheduled guides stay private until this moment."
          error={scheduleError}
        >
          <AdminInput
            id="guide-scheduled-for"
            type="datetime-local"
            value={toDateTimeLocal(guide.scheduledFor)}
            min={toDateTimeLocal(new Date())}
            onChange={(event) => handleScheduledForChange(event.target.value)}
          />
        </AdminField>
      ) : null}

      <AdminToast tone={saveTone}>{saveText}</AdminToast>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Published at: {formatDateTime(guide.publishedAt)}</p>
        <p className="admin-micro">Scheduled for: {formatDateTime(guide.scheduledFor)}</p>
        <p className="admin-micro">Archived at: {formatDateTime(guide.archivedAt)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AdminButton variant="primary" size="sm" onClick={() => void flushSave()} disabled={saving}>
          {hasPersistedGuide ? (saving ? 'Saving...' : 'Save now') : saving ? 'Creating...' : 'Create draft'}
        </AdminButton>
        <AdminButton variant="secondary" size="sm" onClick={() => void openPreview()} disabled={!canPreview || saving}>
          Preview
        </AdminButton>
      </div>

      <p className="admin-micro">Keyboard: press Cmd/Ctrl+S to save immediately.</p>
    </AdminSurface>
  );

  const metaSurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Guide Metadata</p>
        <h2 className="admin-h2">Routing and ownership</h2>
        <p className="admin-body">Keep the guide slug, category, cluster, and author aligned from the start.</p>
      </div>

      <AdminField label="Slug" htmlFor="guide-slug" help="If left empty, the API will generate one from the title.">
        <AdminInput
          id="guide-slug"
          value={guide.slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          placeholder="best-strollers-2026"
        />
      </AdminField>

      <AdminField label="Guide category" htmlFor="guide-category">
        <AdminSelect
          id="guide-category"
          value={guide.category}
          onChange={(event) =>
            applyGuideUpdate(
              (current) => ({
                ...current,
                category: event.target.value,
              }),
              'immediate',
            )
          }
        >
          {GUIDE_CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Topic cluster" htmlFor="guide-topic-cluster" help="Optional subcategory or keyword cluster.">
        <AdminInput
          id="guide-topic-cluster"
          value={guide.topicCluster ?? ''}
          onChange={(event) =>
            applyGuideUpdate(
              (current) => ({
                ...current,
                topicCluster: event.target.value,
              }),
              'debounced',
            )
          }
          placeholder="travel strollers"
        />
      </AdminField>

      <AdminField label="Author" htmlFor="guide-author">
        <AdminSelect
          id="guide-author"
          value={guide.authorId}
          onChange={(event) =>
            applyGuideUpdate(
              (current) => ({
                ...current,
                authorId: event.target.value,
              }),
              'immediate',
            )
          }
        >
          {authorOptions.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Created: {formatDateTime(guide.createdAt)}</p>
        <p className="admin-micro">Updated: {formatDateTime(guide.updatedAt)}</p>
        <p className="admin-micro">Views tracked: {guide.views.toLocaleString()}</p>
      </div>
    </AdminSurface>
  );

  const performanceSurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Snapshot</p>
        <h2 className="admin-h2">Editor summary</h2>
      </div>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Public route: {guide.slug ? `/guides/${guide.slug}` : 'Not generated yet'}</p>
        <p className="admin-micro">Target keyword: {guide.targetKeyword || 'Not set'}</p>
        <p className="admin-micro">Related guides: {guide.relatedGuideIds.length}</p>
        <p className="admin-micro">Affiliate modules: {guide.affiliateModules.length}</p>
      </div>

      {hasPersistedGuide && guide.slug ? (
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="secondary" size="sm">
            <Link href={`/guides/${guide.slug}`} target="_blank">
              View public guide
            </Link>
          </AdminButton>
        </div>
      ) : null}
    </AdminSurface>
  );

  const leftColumn =
    activeTab === 'core' ? (
      <AdminStack gap="lg">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Core Content</p>
            <h2 className="admin-h2">Guide basics</h2>
            <p className="admin-body">Set the core editorial framing before filling in the long-form sections.</p>
          </div>

          <AdminField label="Title" htmlFor="guide-title">
            <AdminInput
              id="guide-title"
              value={guide.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Best Strollers of 2026"
            />
          </AdminField>

          <AdminField label="Excerpt / summary" htmlFor="guide-excerpt" help="Used on the guide index and social previews.">
            <AdminTextarea
              id="guide-excerpt"
              value={guide.excerpt ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[140px]"
              placeholder="An editor-style summary of what this guide helps parents decide."
            />
          </AdminField>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Hero image URL" htmlFor="guide-hero-image-url" help="Use a full URL or root-relative path.">
              <AdminInput
                id="guide-hero-image-url"
                value={guide.heroImageUrl ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      heroImageUrl: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="/assets/editorial/gear.jpg"
              />
            </AdminField>

            <AdminField label="Hero image alt" htmlFor="guide-hero-image-alt">
              <AdminInput
                id="guide-hero-image-alt"
                value={guide.heroImageAlt ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      heroImageAlt: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="Editorial baby gear arrangement"
              />
            </AdminField>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => heroInputRef.current?.click()}
              disabled={uploadingKind !== null}
            >
              {uploadingKind === 'hero' ? 'Uploading hero...' : 'Upload hero image'}
            </AdminButton>
          </div>

          {guide.heroImageUrl ? (
            <div className="overflow-hidden rounded-[24px] border border-[var(--admin-color-border)] bg-white">
              <img src={guide.heroImageUrl} alt={guide.heroImageAlt || guide.title} className="h-auto w-full" />
            </div>
          ) : null}
        </AdminSurface>
      </AdminStack>
    ) : activeTab === 'seo' ? (
      <AdminStack gap="lg">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">SEO / Metadata</p>
            <h2 className="admin-h2">Search and social metadata</h2>
            <p className="admin-body">This layer controls how the guide is framed for search, sharing, and internal discovery.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Target keyword" htmlFor="guide-target-keyword">
              <AdminInput
                id="guide-target-keyword"
                value={guide.targetKeyword ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      targetKeyword: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="best infant car seats"
              />
            </AdminField>

            <AdminField label="Secondary keywords" htmlFor="guide-secondary-keywords" help="Comma-separated.">
              <AdminInput
                id="guide-secondary-keywords"
                value={guide.secondaryKeywords.join(', ')}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      secondaryKeywords: event.target.value.split(',').map((entry) => entry.trim()).filter(Boolean),
                    }),
                    'debounced',
                  )
                }
                placeholder="infant car seat compatibility, newborn car seat"
              />
            </AdminField>
          </div>

          <AdminField label="SEO title" htmlFor="guide-seo-title">
            <AdminInput
              id="guide-seo-title"
              value={guide.seoTitle ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    seoTitle: event.target.value,
                  }),
                  'debounced',
                )
              }
              placeholder="Best Infant Car Seats | Taylor-Made Baby Co."
            />
          </AdminField>

          <AdminField label="Meta description" htmlFor="guide-seo-description">
            <AdminTextarea
              id="guide-seo-description"
              value={guide.seoDescription ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    seoDescription: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[140px]"
              placeholder="A clear guide to infant car seats, compatibility, and everyday fit."
            />
          </AdminField>

          <AdminField label="Canonical URL" htmlFor="guide-canonical-url">
            <AdminInput
              id="guide-canonical-url"
              value={guide.canonicalUrl ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    canonicalUrl: event.target.value,
                  }),
                  'debounced',
                )
              }
              placeholder="https://www.taylormadebabyco.com/guides/best-infant-car-seats"
            />
          </AdminField>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="OG title" htmlFor="guide-og-title">
              <AdminInput
                id="guide-og-title"
                value={guide.ogTitle ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      ogTitle: event.target.value,
                    }),
                    'debounced',
                  )
                }
              />
            </AdminField>

            <AdminField label="OG image URL" htmlFor="guide-og-image-url">
              <AdminInput
                id="guide-og-image-url"
                value={guide.ogImageUrl ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      ogImageUrl: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="/assets/editorial/gear.jpg"
              />
            </AdminField>
          </div>

          <AdminField label="OG description" htmlFor="guide-og-description">
            <AdminTextarea
              id="guide-og-description"
              value={guide.ogDescription ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    ogDescription: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[120px]"
            />
          </AdminField>

          <AdminField label="OG image alt" htmlFor="guide-og-image-alt">
            <AdminInput
              id="guide-og-image-alt"
              value={guide.ogImageAlt ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    ogImageAlt: event.target.value,
                  }),
                  'debounced',
                )
              }
            />
          </AdminField>

          <div className="flex flex-wrap items-center gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => ogInputRef.current?.click()}
              disabled={uploadingKind !== null}
            >
              {uploadingKind === 'og' ? 'Uploading OG image...' : 'Upload OG image'}
            </AdminButton>
          </div>
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Internal linking</p>
            <h2 className="admin-h2">Related guides and notes</h2>
          </div>

          <AdminField label="Internal linking notes" htmlFor="guide-internal-link-notes" help="Private notes for future link building.">
            <AdminTextarea
              id="guide-internal-link-notes"
              value={guide.internalLinkNotes ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    internalLinkNotes: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[140px]"
              placeholder="Link from stroller comparison, travel stroller, and registry timing guides."
            />
          </AdminField>

          <div className="admin-stack gap-3">
            <p className="admin-label">Related guides</p>
            {relatedOptions.length === 0 ? (
              <p className="admin-micro">No other guide records available yet.</p>
            ) : (
              <div className="space-y-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                {relatedOptions.map((relatedGuide) => {
                  const checked = guide.relatedGuideIds.includes(relatedGuide.id);
                  return (
                    <label key={relatedGuide.id} className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.02]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          applyGuideUpdate(
                            (current) => ({
                              ...current,
                              relatedGuideIds: event.target.checked
                                ? Array.from(new Set([...current.relatedGuideIds, relatedGuide.id]))
                                : current.relatedGuideIds.filter((id) => id !== relatedGuide.id),
                            }),
                            'immediate',
                          )
                        }
                        className="mt-1 h-4 w-4 rounded border-[var(--admin-color-border)]"
                      />
                      <span className="admin-stack gap-1">
                        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-admin">{relatedGuide.title}</span>
                        <span className="admin-micro">
                          {relatedGuide.category} · /guides/{relatedGuide.slug}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </AdminSurface>
      </AdminStack>
    ) : activeTab === 'structure' ? (
      <AdminStack gap="lg">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Guide Structure</p>
            <h2 className="admin-h2">Long-form content</h2>
            <p className="admin-body">Shape the guide as an evergreen editorial resource with a clear opening, core body, and finish.</p>
          </div>

          <label className="admin-toggle" htmlFor="guide-toc-enabled">
            <input
              id="guide-toc-enabled"
              type="checkbox"
              checked={guide.tableOfContentsEnabled}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    tableOfContentsEnabled: event.target.checked,
                  }),
                  'immediate',
                )
              }
            />
            <span>{guide.tableOfContentsEnabled ? 'Table of contents enabled' : 'Table of contents hidden'}</span>
          </label>

          <AdminField label="Intro" htmlFor="guide-intro">
            <AdminTextarea
              id="guide-intro"
              value={guide.intro ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    intro: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[150px]"
              placeholder="Set context for the guide, what this page covers, and who it is for."
            />
          </AdminField>

          <AdminField label="Guide body" htmlFor="guide-content" help="Write in markdown with clear H2/H3 structure.">
            <AdminTextarea
              id="guide-content"
              value={guide.content}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    content: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[420px]"
              placeholder="## What to look for&#10;&#10;Long-form guide content..."
            />
          </AdminField>

          <AdminField label="Conclusion / wrap-up" htmlFor="guide-conclusion">
            <AdminTextarea
              id="guide-conclusion"
              value={guide.conclusion ?? ''}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    conclusion: event.target.value,
                  }),
                  'debounced',
                )
              }
              className="min-h-[150px]"
              placeholder="Summarize the recommendation logic and next step."
            />
          </AdminField>

          <label className="admin-toggle" htmlFor="guide-founder-signature-enabled">
            <input
              id="guide-founder-signature-enabled"
              type="checkbox"
              checked={guide.founderSignatureEnabled}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    founderSignatureEnabled: event.target.checked,
                  }),
                  'immediate',
                )
              }
            />
            <span>{guide.founderSignatureEnabled ? 'Founder signature shown' : 'Founder signature hidden'}</span>
          </label>

          {guide.founderSignatureEnabled ? (
            <AdminField label="Founder signature text" htmlFor="guide-founder-signature-text">
              <AdminTextarea
                id="guide-founder-signature-text"
                value={guide.founderSignatureText ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      founderSignatureText: event.target.value,
                    }),
                    'debounced',
                  )
                }
                className="min-h-[120px]"
                placeholder="A closing note from Taylor."
              />
            </AdminField>
          ) : null}
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="admin-stack gap-1.5">
              <p className="admin-eyebrow">FAQ</p>
              <h2 className="admin-h2">Guide FAQs</h2>
            </div>
            <AdminButton type="button" variant="secondary" size="sm" onClick={addFaqItem}>
              Add FAQ
            </AdminButton>
          </div>

          {guide.faqItems.length === 0 ? (
            <p className="admin-micro">No FAQ rows yet.</p>
          ) : (
            <div className="space-y-4">
              {guide.faqItems.map((faq, index) => (
                <div key={`guide-faq-${index}`} className="space-y-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                  <AdminField label="Question" htmlFor={`guide-faq-question-${index}`}>
                    <AdminInput
                      id={`guide-faq-question-${index}`}
                      value={faq.question}
                      onChange={(event) => handleFaqChange(index, 'question', event.target.value)}
                    />
                  </AdminField>
                  <AdminField label="Answer" htmlFor={`guide-faq-answer-${index}`}>
                    <AdminTextarea
                      id={`guide-faq-answer-${index}`}
                      value={faq.answer}
                      onChange={(event) => handleFaqChange(index, 'answer', event.target.value)}
                      className="min-h-[140px]"
                    />
                  </AdminField>
                  <div className="flex justify-end">
                    <AdminButton type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                      Remove FAQ
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSurface>
      </AdminStack>
    ) : activeTab === 'commerce' ? (
      <AdminStack gap="lg">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Commerce / Affiliate</p>
            <h2 className="admin-h2">Disclosure and product modules</h2>
            <p className="admin-body">This section powers the affiliate-friendly recommendation layer without mixing it into the journal CMS.</p>
          </div>

          <label className="admin-toggle" htmlFor="guide-affiliate-disclosure-enabled">
            <input
              id="guide-affiliate-disclosure-enabled"
              type="checkbox"
              checked={guide.affiliateDisclosureEnabled}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    affiliateDisclosureEnabled: event.target.checked,
                  }),
                  'immediate',
                )
              }
            />
            <span>{guide.affiliateDisclosureEnabled ? 'Affiliate disclosure enabled' : 'Affiliate disclosure disabled'}</span>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Disclosure placement" htmlFor="guide-affiliate-disclosure-placement">
              <AdminSelect
                id="guide-affiliate-disclosure-placement"
                value={guide.affiliateDisclosurePlacement ?? 'before_affiliates'}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      affiliateDisclosurePlacement: event.target.value,
                    }),
                    'immediate',
                  )
                }
              >
                {placementOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>

            <AdminField label="Disclosure text" htmlFor="guide-affiliate-disclosure-text">
              <AdminInput
                id="guide-affiliate-disclosure-text"
                value={guide.affiliateDisclosureText ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      affiliateDisclosureText: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="This guide may include affiliate links."
              />
            </AdminField>
          </div>
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="admin-stack gap-1.5">
              <p className="admin-eyebrow">Affiliate modules</p>
              <h2 className="admin-h2">Editorial product recommendations</h2>
            </div>
            <AdminButton type="button" variant="secondary" size="sm" onClick={addAffiliateModule}>
              Add module
            </AdminButton>
          </div>

          {guide.affiliateModules.length === 0 ? (
            <p className="admin-micro">No affiliate modules yet.</p>
          ) : (
            <div className="space-y-4">
              {guide.affiliateModules.map((module, index) => (
                <div key={module.id} className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Module title" htmlFor={`guide-module-title-${module.id}`}>
                      <AdminInput
                        id={`guide-module-title-${module.id}`}
                        value={module.title}
                        onChange={(event) => handleAffiliateModuleChange(index, { title: event.target.value })}
                        placeholder="Best for city walks"
                      />
                    </AdminField>
                    <AdminField label="Product name" htmlFor={`guide-module-product-${module.id}`}>
                      <AdminInput
                        id={`guide-module-product-${module.id}`}
                        value={module.productName}
                        onChange={(event) => handleAffiliateModuleChange(index, { productName: event.target.value })}
                        placeholder="UPPAbaby Cruz"
                      />
                    </AdminField>
                  </div>

                  <AdminField label="Recommendation summary" htmlFor={`guide-module-description-${module.id}`}>
                    <AdminTextarea
                      id={`guide-module-description-${module.id}`}
                      value={module.description}
                      onChange={(event) => handleAffiliateModuleChange(index, { description: event.target.value })}
                      className="min-h-[140px]"
                    />
                  </AdminField>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="CTA label" htmlFor={`guide-module-cta-${module.id}`}>
                      <AdminInput
                        id={`guide-module-cta-${module.id}`}
                        value={module.ctaLabel}
                        onChange={(event) => handleAffiliateModuleChange(index, { ctaLabel: event.target.value })}
                        placeholder="Shop now"
                      />
                    </AdminField>
                    <AdminField label="Destination URL" htmlFor={`guide-module-url-${module.id}`}>
                      <AdminInput
                        id={`guide-module-url-${module.id}`}
                        type="url"
                        value={module.destinationUrl}
                        onChange={(event) => handleAffiliateModuleChange(index, { destinationUrl: event.target.value })}
                        placeholder="https://partner.example.com/..."
                      />
                    </AdminField>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Retailer label" htmlFor={`guide-module-retailer-${module.id}`}>
                      <AdminInput
                        id={`guide-module-retailer-${module.id}`}
                        value={module.retailerLabel ?? ''}
                        onChange={(event) => handleAffiliateModuleChange(index, { retailerLabel: event.target.value || null })}
                        placeholder="Strolleria"
                      />
                    </AdminField>
                    <AdminField label="Product image URL" htmlFor={`guide-module-image-${module.id}`}>
                      <AdminInput
                        id={`guide-module-image-${module.id}`}
                        value={module.imageUrl ?? ''}
                        onChange={(event) => handleAffiliateModuleChange(index, { imageUrl: event.target.value || null })}
                        placeholder="/assets/editorial/gear.jpg"
                      />
                    </AdminField>
                  </div>

                  <AffiliatePartnerSelect
                    id={`guide-module-partner-${module.id}`}
                    label="Affiliate partner"
                    options={affiliatePartnerOptions}
                    value={module.partnerId}
                    defaultContext="guide"
                    onChange={(partnerId, partner) =>
                      handleAffiliateModuleChange(
                        index,
                        partnerId
                          ? {
                              partnerId,
                              ctaLabel: module.ctaLabel.trim() ? module.ctaLabel : buildDefaultAffiliateCtaText(partner!),
                              destinationUrl:
                                module.destinationUrl.trim() || partner?.defaultDestinationUrl || partner?.baseUrl || partner?.website || '',
                              retailerLabel: module.retailerLabel?.trim() ? module.retailerLabel : partner?.name ?? null,
                            }
                          : { partnerId: null },
                        'immediate',
                      )
                    }
                  />

                  <AdminField label="Notes" htmlFor={`guide-module-notes-${module.id}`}>
                    <AdminTextarea
                      id={`guide-module-notes-${module.id}`}
                      value={module.notes ?? ''}
                      onChange={(event) => handleAffiliateModuleChange(index, { notes: event.target.value || null })}
                      className="min-h-[120px]"
                      placeholder="Optional internal note or qualification."
                    />
                  </AdminField>

                  <div className="flex justify-end">
                    <AdminButton type="button" variant="ghost" size="sm" onClick={() => removeAffiliateModule(index)}>
                      Remove module
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSurface>
      </AdminStack>
    ) : (
      <AdminStack gap="lg">
        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Conversion Support</p>
            <h2 className="admin-h2">Guided next steps</h2>
            <p className="admin-body">Configure the consultation, newsletter, and final CTA layer without hard-coding it into the body copy.</p>
          </div>

          <label className="admin-toggle" htmlFor="guide-consultation-cta-enabled">
            <input
              id="guide-consultation-cta-enabled"
              type="checkbox"
              checked={guide.consultationCtaEnabled}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    consultationCtaEnabled: event.target.checked,
                  }),
                  'immediate',
                )
              }
            />
            <span>{guide.consultationCtaEnabled ? 'Consultation CTA enabled' : 'Consultation CTA disabled'}</span>
          </label>

          {guide.consultationCtaEnabled ? (
            <AdminField label="Consultation CTA label" htmlFor="guide-consultation-cta-label">
              <AdminInput
                id="guide-consultation-cta-label"
                value={guide.consultationCtaLabel ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      consultationCtaLabel: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="Book a Consultation"
              />
            </AdminField>
          ) : null}

          <label className="admin-toggle" htmlFor="guide-newsletter-cta-enabled">
            <input
              id="guide-newsletter-cta-enabled"
              type="checkbox"
              checked={guide.newsletterCtaEnabled}
              onChange={(event) =>
                applyGuideUpdate(
                  (current) => ({
                    ...current,
                    newsletterCtaEnabled: event.target.checked,
                  }),
                  'immediate',
                )
              }
            />
            <span>{guide.newsletterCtaEnabled ? 'Newsletter / lead magnet CTA enabled' : 'Newsletter / lead magnet CTA disabled'}</span>
          </label>

          {guide.newsletterCtaEnabled ? (
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Newsletter CTA label" htmlFor="guide-newsletter-cta-label">
                <AdminInput
                  id="guide-newsletter-cta-label"
                  value={guide.newsletterCtaLabel ?? ''}
                  onChange={(event) =>
                    applyGuideUpdate(
                      (current) => ({
                        ...current,
                        newsletterCtaLabel: event.target.value,
                      }),
                      'debounced',
                    )
                  }
                  placeholder="Get the checklist"
                />
              </AdminField>
              <AdminField label="Newsletter / lead magnet URL" htmlFor="guide-newsletter-cta-href">
                <AdminInput
                  id="guide-newsletter-cta-href"
                  value={guide.newsletterCtaHref ?? ''}
                  onChange={(event) =>
                    applyGuideUpdate(
                      (current) => ({
                        ...current,
                        newsletterCtaHref: event.target.value,
                      }),
                      'debounced',
                    )
                  }
                  placeholder="/resources/checklist"
                />
              </AdminField>
              <AdminField label="Newsletter description" htmlFor="guide-newsletter-cta-description">
                <AdminTextarea
                  id="guide-newsletter-cta-description"
                  value={guide.newsletterCtaDescription ?? ''}
                  onChange={(event) =>
                    applyGuideUpdate(
                      (current) => ({
                        ...current,
                        newsletterCtaDescription: event.target.value,
                      }),
                      'debounced',
                    )
                  }
                  className="min-h-[120px] md:col-span-2"
                  placeholder="Optional supporting line for the lead magnet CTA."
                />
              </AdminField>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Next-step CTA label" htmlFor="guide-next-step-cta-label">
              <AdminInput
                id="guide-next-step-cta-label"
                value={guide.nextStepCtaLabel ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      nextStepCtaLabel: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="Explore related guides"
              />
            </AdminField>
            <AdminField label="Next-step CTA URL" htmlFor="guide-next-step-cta-href">
              <AdminInput
                id="guide-next-step-cta-href"
                value={guide.nextStepCtaHref ?? ''}
                onChange={(event) =>
                  applyGuideUpdate(
                    (current) => ({
                      ...current,
                      nextStepCtaHref: event.target.value,
                    }),
                    'debounced',
                  )
                }
                placeholder="/guides"
              />
            </AdminField>
          </div>
        </AdminSurface>
      </AdminStack>
    );

  return (
    <AdminStack gap="lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminButton asChild variant="secondary" size="sm">
          <Link href="/admin/guides">Back to guides</Link>
        </AdminButton>
        <p className="admin-micro">Guide workspace: structure on the left, workflow controls on the right.</p>
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
          { id: 'core', label: 'Core' },
          { id: 'seo', label: 'SEO' },
          { id: 'structure', label: 'Structure' },
          { id: 'commerce', label: 'Commerce' },
          { id: 'conversion', label: 'Conversion' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        leftColumn={leftColumn}
        rightColumn={
          <>
            {publishSurface}
            {metaSurface}
            {performanceSurface}
          </>
        }
      />

      <input
        ref={heroInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.currentTarget.value = '';
          if (!file) {
            return;
          }

          void handleHeroUpload(file);
        }}
      />

      <input
        ref={ogInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.currentTarget.value = '';
          if (!file) {
            return;
          }

          void handleOgUpload(file);
        }}
      />
    </AdminStack>
  );
}
