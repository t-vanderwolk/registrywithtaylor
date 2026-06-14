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
  type MediaRecord,
  type GuideSavePayload,
  type PersistedGuideRecord,
  type RelatedGuideOption,
} from '@/components/admin/guides/guideEditorTypes';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import {
  GUIDE_SECTION_SNIPPETS,
  GUIDE_SECTION_SNIPPET_OPTIONS,
  GUIDE_TEMPLATES,
  GUIDE_TEMPLATE_OPTIONS,
  type GuideSectionSnippetId,
  type GuideTemplateId,
} from '@/lib/guides/guideTemplates';
import { getGuidePublicPath } from '@/lib/guides/publicPath';
import { sanitizeGuideAffiliateModules, sanitizeGuideFaqItems, sanitizeStringList } from '@/lib/guides/types';
import { GUIDE_STATUS_LABELS, requiresLiveGuideContent, type GuideStatusValue } from '@/lib/guides/status';
import { STYLED_BLOCKS, getStyledBlockSnippet, isStyledBlockStart, parseStyledBlock, type StyledBlockId } from '@/lib/blog/styledBlocks';
import { buildDefaultAffiliateCtaText } from '@/lib/affiliatePartners';
import {
  extractGuideMarkdownImages,
  getGuideMarkdownImageLineOffset,
  updateGuideMarkdownImage,
} from '@/lib/guides/markdownImages';
import { slugify } from '@/lib/slugify';

type SaveMode = 'debounced' | 'immediate' | 'manual';
type GuideEditorVariant = 'learningContent' | 'academyModule';
type GuideContentFormatAction =
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'divider'
  | 'image'
  | 'link';
type GuideMediaPickerTarget =
  | { kind: 'hero' }
  | { kind: 'og' }
  | { kind: 'inlineInsert' }
  | { kind: 'inlineReplace'; lineNumber: number };

type GuideState = PersistedGuideRecord;
type TemplateSelectValue = 'blank' | GuideTemplateId;
type HelperNotice = {
  tone: 'success' | 'warning';
  message: string;
};
type AcademySectionSnippetId =
  | 'moduleIntro'
  | 'coreConsiderations'
  | 'whatThisMeans'
  | 'productExamples'
  | 'softCta'
  | 'nextSteps';
type AcademySectionSnippet = {
  label: string;
  content: string;
};
type MarkdownSection = {
  title: string;
  content: string;
};
type AcademyDraftStructureSummary = {
  moduleIntroParagraphs: number;
  coreSectionCount: number;
  coreSectionsWithImages: number;
  checklistItemCount: number;
  productWidgetCount: number;
  softCtaTitle: string | null;
  hasNextStepsSection: boolean;
};

const placementOptions = [
  { value: 'before_affiliates', label: 'Before affiliate modules' },
  { value: 'after_intro', label: 'After intro' },
  { value: 'before_conclusion', label: 'Before conclusion' },
] as const;

const ACADEMY_IGNORED_SECTION_TITLES = new Set([
  'core considerations',
  'what this means for you',
  'product examples',
  'examples that support this setup',
  'next steps',
]);

const ACADEMY_SECTION_SNIPPETS: Record<AcademySectionSnippetId, AcademySectionSnippet> = {
  moduleIntro: {
    label: 'Module Intro',
    content: `## Module X of Y · Path

Add 2 to 4 short paragraphs here.

This becomes the live intro beneath the hero.`,
  },
  coreConsiderations: {
    label: 'Core Considerations',
    content: `## Core Considerations

### First consideration

![Editorial image alt](https://example.com/editorial-image.jpg)

Add a short paragraph that explains what actually matters here.

### Second consideration

![Editorial image alt](https://example.com/editorial-image.jpg)

Add a second grounded consideration.`,
  },
  whatThisMeans: {
    label: 'What This Means',
    content: `## What This Means For You

- First practical takeaway
- Second decision point
- Third grounded reminder`,
  },
  productExamples: {
    label: 'Product Examples',
    content: `## Examples That Support This Setup

Add one or more \`:::product\` widgets below this heading. Each product widget becomes a live academy product card.`,
  },
  softCta: {
    label: 'Soft CTA',
    content: `## A Note Before You Move Forward

Add 1 to 3 short paragraphs here.

The live academy module uses the first non-core section like this as the TMBC expert callout.`,
  },
  nextSteps: {
    label: 'Next Steps',
    content: `## Next Steps

- Continue to the next module
- Back to the previous module`,
  },
};

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

  return hasPersistedGuide ? 'Autosave is on.' : 'Create the record on first save.';
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
    return 'Scheduled records must use a future date and time.';
  }

  return undefined;
}

function toAltText(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return baseName || 'Editorial image';
}

function combineGuideContent(guide: Pick<GuideState, 'intro' | 'content' | 'conclusion'>) {
  return [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
}

function stripMarkdownForWordCount(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>#|[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(value: string) {
  const normalized = stripMarkdownForWordCount(value);
  return normalized ? normalized.split(/\s+/).length : 0;
}

function normalizeSectionTitle(value: string) {
  return value
    .replace(/[*_`~]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitMarkdownSections(content: string, headingLevel: 2 | 3): MarkdownSection[] {
  const headingPrefix = `${'#'.repeat(headingLevel)} `;
  const lines = content.split('\n');
  const sections: MarkdownSection[] = [];
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith(headingPrefix)) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentLines.join('\n').trim(),
        });
      }

      currentTitle = line.slice(headingPrefix.length).trim();
      currentLines = [];
      continue;
    }

    if (currentTitle) {
      currentLines.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentLines.join('\n').trim(),
    });
  }

  return sections;
}

function isAcademyParagraphBlock(block: string) {
  const trimmed = block.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith(':::') &&
    !trimmed.startsWith('![') &&
    !trimmed.startsWith('>') &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed)
  );
}

function countParagraphBlocks(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(isAcademyParagraphBlock).length;
}

function extractMarkdownListCount(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)).length;
}

function countProductStyledBlocks(content: string) {
  const lines = content.split('\n');
  let productCount = 0;

  for (let index = 0; index < lines.length;) {
    if (!isStyledBlockStart(lines[index] ?? '')) {
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      index += 1;
      continue;
    }

    index = parsed.nextIndex;
    if (parsed.block.type === 'product') {
      productCount += 1;
    }
  }

  return productCount;
}

function summarizeAcademyDraftStructure(content: string): AcademyDraftStructureSummary {
  const sections = splitMarkdownSections(content, 2);
  const introSection =
    sections.find((section) => normalizeSectionTitle(section.title).startsWith('module ')) ?? null;
  const coreSection =
    sections.find((section) => normalizeSectionTitle(section.title) === 'core considerations') ?? null;
  const checklistSection =
    sections.find((section) => normalizeSectionTitle(section.title) === 'what this means for you') ?? null;
  const productSection =
    sections.find((section) => {
      const normalizedTitle = normalizeSectionTitle(section.title);
      return normalizedTitle === 'product examples' || normalizedTitle === 'examples that support this setup';
    }) ?? null;
  const softCtaSection =
    sections.find((section) => {
      const normalizedTitle = normalizeSectionTitle(section.title);
      return !ACADEMY_IGNORED_SECTION_TITLES.has(normalizedTitle) && !normalizedTitle.startsWith('module ');
    }) ?? null;
  const nextStepsSection =
    sections.find((section) => normalizeSectionTitle(section.title) === 'next steps') ?? null;
  const coreSubsections = coreSection ? splitMarkdownSections(coreSection.content, 3) : [];

  return {
    moduleIntroParagraphs: introSection ? countParagraphBlocks(introSection.content) : 0,
    coreSectionCount: coreSubsections.length,
    coreSectionsWithImages: coreSubsections.filter((section) => /!\[[^\]]*]\([^)]+\)/.test(section.content)).length,
    checklistItemCount: checklistSection ? extractMarkdownListCount(checklistSection.content) : 0,
    productWidgetCount: productSection ? countProductStyledBlocks(productSection.content) : 0,
    softCtaTitle: softCtaSection?.title ?? null,
    hasNextStepsSection: Boolean(nextStepsSection),
  };
}

function getReadingTimeMinutes(wordCount: number) {
  return wordCount === 0 ? 0 : Math.ceil(wordCount / 200);
}

function buildInsertedContent(currentContent: string, snippet: string, selectionStart?: number, selectionEnd?: number) {
  const start = selectionStart ?? currentContent.length;
  const end = selectionEnd ?? currentContent.length;
  const before = currentContent.slice(0, start);
  const after = currentContent.slice(end);
  const trimmedSnippet = snippet.trim();
  const prefix = before.length === 0 ? '' : before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  const suffix = after.length === 0 ? '' : after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
  const inserted = `${prefix}${trimmedSnippet}${suffix}`;

  return {
    nextContent: `${before}${inserted}${after}`,
    cursorPosition: before.length + inserted.length,
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

function toGuideState(guide: PersistedGuideRecord): GuideState {
  const combinedContent = combineGuideContent(guide);

  return {
    ...guide,
    intro: null,
    content: combinedContent,
    conclusion: null,
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
  const combinedContent = combineGuideContent(guide);

  if (requiresLiveGuideContent(guide.status) && !combinedContent.trim()) {
    return 'Guide content is required before publishing or scheduling.';
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

  for (const image of extractGuideMarkdownImages(guide.content)) {
    if (!isValidImageUrl(image.src)) {
      return 'Inline image URLs must start with http://, https://, or /.';
    }
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
    intro: null,
    content: guide.content,
    conclusion: null,
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
  mediaLibrary = [],
  adminBasePath = '/admin/academy',
  listingHref,
  editorVariant = 'learningContent',
}: {
  initialGuide: PersistedGuideRecord;
  authorOptions: AuthorOption[];
  affiliatePartnerOptions: AffiliatePartnerOption[];
  relatedGuideOptions: RelatedGuideOption[];
  mediaLibrary?: MediaRecord[];
  adminBasePath?: string;
  listingHref?: string;
  editorVariant?: GuideEditorVariant;
}) {
  const router = useRouter();
  const isAcademyModuleEditor = editorVariant === 'academyModule';
  const resolvedListingHref = listingHref ?? adminBasePath;
  const initialState = useMemo(() => toGuideState(initialGuide), [initialGuide]);
  const [guide, setGuide] = useState<GuideState>(initialState);
  const [currentGuideId, setCurrentGuideId] = useState<string | null>(initialState.id);
  const [activeTab, setActiveTab] = useState<GuideEditorTabId>('core');
  const [saving, setSaving] = useState(false);
  const [hasScheduledSave, setHasScheduledSave] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingKind, setUploadingKind] = useState<'hero' | 'og' | 'inline' | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [helperNotice, setHelperNotice] = useState<HelperNotice | null>(null);
  const [pendingTemplateId, setPendingTemplateId] = useState<GuideTemplateId | null>(null);
  const [templateSelection, setTemplateSelection] = useState<TemplateSelectValue>('blank');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<GuideMediaPickerTarget | null>(null);
  const [mediaLibrarySearch, setMediaLibrarySearch] = useState('');
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
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const pendingInlineImageLineRef = useRef<number | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasPersistedGuide = Boolean(currentGuideId);
  const guideDraftContent = combineGuideContent(guide);
  const wordCount = countWords(guideDraftContent);
  const readingTimeMinutes = getReadingTimeMinutes(wordCount);
  const readingTimeLabel = `${readingTimeMinutes} min read`;
  const wordCountToneClass =
    wordCount >= 4000 ? 'text-admin-success' : wordCount >= 2000 ? 'text-admin-warning' : 'text-admin-micro';
  const hasTemplateContent = Boolean(guide.content.trim());
  const canPreview = Boolean(currentGuideId || guide.title.trim() || guideDraftContent.trim() || guide.excerpt?.trim());
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
  const guideTemplateOptions = GUIDE_TEMPLATE_OPTIONS.filter((template) => template.source === 'guide');
  const blogTemplateOptions = GUIDE_TEMPLATE_OPTIONS.filter((template) => template.source === 'blog');
  const selectedTemplateOption =
    templateSelection === 'blank'
      ? null
      : GUIDE_TEMPLATE_OPTIONS.find((template) => template.id === templateSelection) ?? null;
  const contentEditorialImages = useMemo(() => extractGuideMarkdownImages(guide.content), [guide.content]);
  const academyDraftStructure = useMemo(() => summarizeAcademyDraftStructure(guide.content), [guide.content]);
  const filteredMediaLibrary = useMemo(() => {
    const normalizedSearch = mediaLibrarySearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return mediaLibrary;
    }

    return mediaLibrary.filter((media) => {
      const haystack = `${media.fileName} ${media.url}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [mediaLibrary, mediaLibrarySearch]);

  const mediaPickerTitle =
    mediaPickerTarget?.kind === 'hero'
      ? 'Choose a hero image'
      : mediaPickerTarget?.kind === 'og'
        ? 'Choose an OG image'
        : mediaPickerTarget?.kind === 'inlineReplace'
          ? 'Replace this editorial image'
          : mediaPickerTarget?.kind === 'inlineInsert'
            ? 'Insert an editorial image'
            : 'Choose an image';
  const mediaPickerActionLabel =
    mediaPickerTarget?.kind === 'hero'
      ? 'Use for hero'
      : mediaPickerTarget?.kind === 'og'
        ? 'Use for OG'
        : mediaPickerTarget?.kind === 'inlineReplace'
          ? 'Replace image'
          : 'Insert image';

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
    setHelperNotice(null);
    setPendingTemplateId(null);
    setTemplateSelection('blank');
    setMediaPickerTarget(null);
    setMediaLibrarySearch('');
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
    setHelperNotice(null);
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
    const sourceRoute = currentGuideIdRef.current ? `${adminBasePath}/${currentGuideIdRef.current}/edit` : `${adminBasePath}/new`;
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
        setSaveError(typeof json?.error === 'string' ? json.error : 'Unable to save learning content changes.');
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
        router.replace(`${adminBasePath}/${nextPersisted.id}/edit`);
      }

      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save learning content changes.');
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
    if (nextStatus === 'PUBLISHED' && !combineGuideContent(guide).trim()) {
      setSaveError('Add content before publishing.');
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
        'manual',
      );
      await flushGuideEdits('Hero image uploaded.');
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
        'manual',
      );
      await flushGuideEdits('OG image uploaded.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload OG image.');
    } finally {
      setUploadingKind(null);
    }
  }

  function closeTemplateModal() {
    setPendingTemplateId(null);
    setTemplateSelection('blank');
  }

  function handleTemplateSelection(value: TemplateSelectValue) {
    setTemplateSelection(value);

    if (value === 'blank') {
      setPendingTemplateId(null);
      return;
    }

    if (hasTemplateContent) {
      setHelperNotice({
        tone: 'warning',
        message: 'Template content only inserts into a blank draft. Clear the current draft first.',
      });
      setTemplateSelection('blank');
      return;
    }

    setPendingTemplateId(value);
  }

  function confirmTemplateInsertion() {
    if (!pendingTemplateId) {
      return;
    }

    const template = GUIDE_TEMPLATES[pendingTemplateId];
    const currentGuide = stateRef.current;

    if (combineGuideContent(currentGuide).trim()) {
      setHelperNotice({
        tone: 'warning',
        message: 'Template content only inserts into a blank draft. Clear the current draft first.',
      });
      closeTemplateModal();
      return;
    }

    applyGuideUpdate(
      (current) => ({
        ...current,
        intro: null,
        content: [template.intro, template.content, template.conclusion].filter(Boolean).join('\n\n'),
        conclusion: null,
      }),
      'debounced',
    );
    setActiveTab('structure');
    setHelperNotice({
      tone: 'success',
      message: `${template.name} inserted. Edit the copy so it matches the category you are covering.`,
    });
    closeTemplateModal();
  }

  function focusGuideContentSelection(start: number, end: number) {
    setActiveTab('structure');
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

  function insertGuideContentBlockAtCursor(value: string, saveMode: SaveMode = 'debounced') {
    const currentGuide = stateRef.current;
    const textarea = contentTextareaRef.current;
    const insertion = buildInsertedContent(
      currentGuide.content,
      value,
      textarea?.selectionStart,
      textarea?.selectionEnd,
    );

    applyGuideUpdate(
      (current) => ({
        ...current,
        content: insertion.nextContent,
      }),
      saveMode,
    );

    focusGuideContentSelection(insertion.cursorPosition, insertion.cursorPosition);
  }

  function insertGuideImageAtSelection({
    alt,
    src,
    saveMode = 'debounced',
  }: {
    alt: string;
    src: string;
    saveMode?: SaveMode;
  }) {
    const currentGuide = stateRef.current;
    const textarea = contentTextareaRef.current;
    const insertion = buildInsertedContent(
      currentGuide.content,
      `![${alt.trim()}](${src.trim()})`,
      textarea?.selectionStart,
      textarea?.selectionEnd,
    );

    applyGuideUpdate(
      (current) => ({
        ...current,
        content: insertion.nextContent,
      }),
      saveMode,
    );

    focusGuideContentSelection(insertion.cursorPosition, insertion.cursorPosition);
  }

  function openInlineImagePicker(lineNumber?: number) {
    pendingInlineImageLineRef.current = typeof lineNumber === 'number' ? lineNumber : null;
    inlineInputRef.current?.click();
  }

  function applyGuideMarkdownFormat(action: GuideContentFormatAction) {
    const currentGuide = stateRef.current;
    const textarea = contentTextareaRef.current;
    const start = textarea?.selectionStart ?? currentGuide.content.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = currentGuide.content.slice(start, end);
    const hasSelection = selected.length > 0;

    const applyReplacement = (replacement: ReturnType<typeof replaceSelection>) => {
      applyGuideUpdate(
        (current) => ({
          ...current,
          content: replacement.content,
        }),
        'debounced',
      );

      focusGuideContentSelection(replacement.nextSelectionStart, replacement.nextSelectionEnd);
    };

    if (action === 'bold') {
      const text = hasSelection ? selected : 'bold text';
      const replacement = `**${text}**`;
      applyReplacement(replaceSelection(currentGuide.content, start, end, replacement, start + 2, start + 2 + text.length));
      return;
    }

    if (action === 'italic') {
      const text = hasSelection ? selected : 'italic text';
      const replacement = `*${text}*`;
      applyReplacement(replaceSelection(currentGuide.content, start, end, replacement, start + 1, start + 1 + text.length));
      return;
    }

    if (action === 'h2' || action === 'h3') {
      const prefix = action === 'h2' ? '## ' : '### ';
      const text = hasSelection ? selected.replace(/\n+/g, ' ').trim() : action === 'h2' ? 'Section heading' : 'Subheading';
      const block = `${prefix}${text}`;
      const replacement = start === 0 ? `${block}\n\n` : `\n\n${block}\n\n`;
      const nextStart = start + (start === 0 ? prefix.length : prefix.length + 2);
      applyReplacement(replaceSelection(currentGuide.content, start, end, replacement, nextStart, nextStart + text.length));
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
      applyReplacement(replaceSelection(currentGuide.content, start, end, replacement));
      return;
    }

    if (action === 'quote') {
      const lines = (hasSelection ? selected : 'Quoted note')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `> ${line}`)
        .join('\n');
      applyReplacement(replaceSelection(currentGuide.content, start, end, lines));
      return;
    }

    if (action === 'divider') {
      insertGuideContentBlockAtCursor('---');
      return;
    }

    if (action === 'image') {
      const selectedAlt = hasSelection ? selected.replace(/\n+/g, ' ').trim() : '';
      const altText = selectedAlt || window.prompt('Enter alt text (optional)', '')?.trim() || '';
      const href = window.prompt('Enter the image URL', 'https://');
      if (!href) {
        return;
      }

      const insertion = buildInsertedContent(currentGuide.content, `![${altText}](${href.trim()})`, start, end);
      applyGuideUpdate(
        (current) => ({
          ...current,
          content: insertion.nextContent,
        }),
        'debounced',
      );
      focusGuideContentSelection(insertion.cursorPosition, insertion.cursorPosition);
      return;
    }

    if (action === 'link') {
      const label = hasSelection ? selected : 'Link text';
      const href = window.prompt('Enter the destination URL', 'https://');
      if (!href) {
        return;
      }

      const replacement = `[${label}](${href.trim()})`;
      applyReplacement(replaceSelection(currentGuide.content, start, end, replacement, start + 1, start + 1 + label.length));
    }
  }

  function insertSectionSnippet(snippetId: GuideSectionSnippetId) {
    const snippet = GUIDE_SECTION_SNIPPETS[snippetId];
    insertGuideContentBlockAtCursor(snippet.content, 'debounced');
    setHelperNotice({
      tone: 'success',
      message: `${snippet.name} inserted into the draft.`,
    });
  }

  function insertAcademySectionSnippet(snippetId: AcademySectionSnippetId) {
    const snippet = ACADEMY_SECTION_SNIPPETS[snippetId];
    insertGuideContentBlockAtCursor(snippet.content, 'debounced');
    setHelperNotice({
      tone: 'success',
      message: `${snippet.label} inserted into the academy module draft.`,
    });
  }

  function insertStyledBlock(blockId: StyledBlockId) {
    const snippet = getStyledBlockSnippet(blockId);
    if (!snippet) {
      return;
    }

    insertGuideContentBlockAtCursor(snippet, 'debounced');
    const block = STYLED_BLOCKS.find((entry) => entry.id === blockId);
    if (block) {
      setHelperNotice({
        tone: 'success',
        message: `${block.label} inserted into the draft.`,
      });
    }
  }

  function handleContentImageUpdate(
    lineNumber: number,
    partial: {
      alt?: string;
      src?: string;
    },
    saveMode: SaveMode = 'debounced',
  ) {
    applyGuideUpdate(
      (current) => ({
        ...current,
        content: updateGuideMarkdownImage(current.content, lineNumber, partial),
      }),
      saveMode,
    );
  }

  async function flushGuideEdits(successMessage?: string) {
    const saved = await flushSaveRef.current();

    if (!saved) {
      return false;
    }

    if (successMessage) {
      setUploadFeedback(successMessage);
    }

    return true;
  }

  async function flushContentImageEdits(lineNumber?: number, successMessage?: string) {
    const saved = await flushGuideEdits(successMessage);

    if (!saved) {
      return false;
    }

    if (typeof lineNumber === 'number') {
      jumpToContentImage(lineNumber);
    }

    return true;
  }

  function openMediaPicker(target: GuideMediaPickerTarget) {
    setUploadError(null);
    setUploadFeedback(null);
    setMediaLibrarySearch('');
    setMediaPickerTarget(target);
  }

  function closeMediaPicker() {
    setMediaPickerTarget(null);
    setMediaLibrarySearch('');
  }

  async function handleSelectMediaFromLibrary(media: MediaRecord) {
    const target = mediaPickerTarget;
    if (!target) {
      return;
    }

    const nextAltText = toAltText(media.fileName);
    setUploadError(null);
    setUploadFeedback(null);

    try {
      if (target.kind === 'hero') {
        applyGuideUpdate(
          (current) => ({
            ...current,
            heroImageUrl: media.url,
            heroImageAlt: current.heroImageAlt?.trim() ? current.heroImageAlt : nextAltText,
          }),
          'manual',
        );

        const saved = await flushGuideEdits('Hero image updated from the media library.');
        if (saved) {
          closeMediaPicker();
        }
        return;
      }

      if (target.kind === 'og') {
        applyGuideUpdate(
          (current) => ({
            ...current,
            ogImageUrl: media.url,
            ogImageAlt: current.ogImageAlt?.trim() ? current.ogImageAlt : nextAltText,
          }),
          'manual',
        );

        const saved = await flushGuideEdits('OG image updated from the media library.');
        if (saved) {
          closeMediaPicker();
        }
        return;
      }

      if (target.kind === 'inlineReplace') {
        const currentImage = extractGuideMarkdownImages(stateRef.current.content).find(
          (image) => image.lineNumber === target.lineNumber,
        );

        handleContentImageUpdate(
          target.lineNumber,
          {
            src: media.url,
            alt: currentImage?.alt?.trim() || nextAltText,
          },
          'manual',
        );

        const saved = await flushContentImageEdits(
          target.lineNumber,
          'Editorial image updated from the media library.',
        );
        if (saved) {
          closeMediaPicker();
        }
        return;
      }

      insertGuideImageAtSelection({
        alt: nextAltText,
        src: media.url,
        saveMode: 'manual',
      });

      const saved = await flushGuideEdits('Image inserted from the media library.');
      if (saved) {
        closeMediaPicker();
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to use this image from the media library.');
    }
  }

  function jumpToContentImage(lineNumber: number) {
    const currentContent = stateRef.current.content;
    const start = getGuideMarkdownImageLineOffset(currentContent, lineNumber);
    const line = currentContent.split('\n')[lineNumber] ?? '';
    focusGuideContentSelection(start, start + line.length);
  }

  async function handleInlineImageUpload(file: File) {
    setUploadingKind('inline');
    setUploadError(null);
    setUploadFeedback(null);

    try {
      const url = await uploadFile(file);
      const pendingLineNumber = pendingInlineImageLineRef.current;
      pendingInlineImageLineRef.current = null;

      if (typeof pendingLineNumber === 'number') {
        const currentImage = extractGuideMarkdownImages(stateRef.current.content).find((image) => image.lineNumber === pendingLineNumber);
        handleContentImageUpdate(
          pendingLineNumber,
          {
            src: url,
            alt: currentImage?.alt?.trim() || toAltText(file.name),
          },
          'manual',
        );
        await flushContentImageEdits(pendingLineNumber, 'Image uploaded and saved to the draft.');
        return;
      }

      insertGuideImageAtSelection({
        alt: toAltText(file.name),
        src: url,
        saveMode: 'manual',
      });
      await flushContentImageEdits(undefined, 'Image uploaded and inserted into the draft.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to upload inline image.');
    } finally {
      pendingInlineImageLineRef.current = null;
      setUploadingKind(null);
    }
  }

  async function openPreview() {
    const previewWindow = window.open('', '_blank');
    const saved = await flushSave();
    if (!saved || !currentGuideIdRef.current) {
      previewWindow?.close();
      return;
    }

    const previewUrl = `${adminBasePath}/${currentGuideIdRef.current}/preview`;
    if (previewWindow) {
      previewWindow.location.href = previewUrl;
      return;
    }

    window.open(previewUrl, '_blank') ?? router.push(previewUrl);
  }

  const editorUtilitySurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">{isAcademyModuleEditor ? 'Academy Module' : 'Learning Content'}</p>
          <h2 className="admin-h2">{isAcademyModuleEditor ? 'Live Module Structure' : 'Start From Template'}</h2>
          <p className="admin-body">
            {isAcademyModuleEditor
              ? 'This editor maps directly to the live academy renderer. Build the module with the exact sections below, then use preview to confirm the public layout.'
              : 'Load either a learning-content framework or one of the blog editor starters into the draft before you refine it for search and authority.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminButton variant="secondary" size="sm" onClick={() => void openPreview()} disabled={!canPreview || saving}>
            {isAcademyModuleEditor ? 'Preview live module' : 'Preview content'}
          </AdminButton>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {isAcademyModuleEditor ? (
          <>
            <div className="admin-stack gap-3">
              <div className="admin-stack gap-1">
                <p className="admin-label">Academy Section Scaffolds</p>
                <p className="admin-micro">
                  Insert the exact headings the live academy module parser reads. Missing sections fall back to seeded defaults on the public page.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(Object.entries(ACADEMY_SECTION_SNIPPETS) as Array<[AcademySectionSnippetId, AcademySectionSnippet]>).map(
                  ([snippetId, snippet]) => (
                    <AdminButton
                      key={snippetId}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => insertAcademySectionSnippet(snippetId)}
                    >
                      {snippet.label}
                    </AdminButton>
                  ),
                )}
              </div>

              {helperNotice ? <AdminToast tone={helperNotice.tone}>{helperNotice.message}</AdminToast> : null}
            </div>

            <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
              <p className="admin-label">Live Structure Snapshot</p>
              <p className="admin-micro">Intro paragraphs: {academyDraftStructure.moduleIntroParagraphs}</p>
              <p className="admin-micro">
                Core cards: {academyDraftStructure.coreSectionCount} · with images: {academyDraftStructure.coreSectionsWithImages}
              </p>
              <p className="admin-micro">Checklist bullets: {academyDraftStructure.checklistItemCount}</p>
              <p className="admin-micro">Product widgets: {academyDraftStructure.productWidgetCount}</p>
              <p className="admin-micro">
                Soft CTA: {academyDraftStructure.softCtaTitle ? academyDraftStructure.softCtaTitle : 'Using seeded fallback'}
              </p>
              <p className="admin-micro">
                Next steps section: {academyDraftStructure.hasNextStepsSection ? 'Present in draft' : 'Not written yet'}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="admin-stack gap-2">
              <AdminField
                label="Start From Template"
                htmlFor="guide-template-select"
                help="Templates only insert into a blank draft. Blog editor starters are included here too."
              >
                <AdminSelect
                  id="guide-template-select"
                  value={templateSelection}
                  onChange={(event) => handleTemplateSelection(event.target.value as TemplateSelectValue)}
                >
                  <option value="blank">Blank Draft</option>
                  <optgroup label="Learning content templates">
                    {guideTemplateOptions.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Blog editor templates">
                    {blogTemplateOptions.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.label}
                      </option>
                    ))}
                  </optgroup>
                </AdminSelect>
              </AdminField>

              {selectedTemplateOption ? (
                <div className="rounded-[20px] border border-[var(--admin-color-border)] bg-white p-4">
                  <p className="admin-label">
                    {selectedTemplateOption.source === 'blog' ? 'Blog editor template' : 'Learning content template'}
                  </p>
                  {selectedTemplateOption.description ? (
                    <p className="admin-micro mt-2">{selectedTemplateOption.description}</p>
                  ) : null}
                </div>
              ) : null}

              {helperNotice ? <AdminToast tone={helperNotice.tone}>{helperNotice.message}</AdminToast> : null}
            </div>

            <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
              <p className="admin-label">Authority Goal</p>
              <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${wordCountToneClass}`}>
                Word Count: {wordCount.toLocaleString()}
              </p>
              <p className="admin-micro">Target: Minimum 4000 words</p>
              <p className="admin-micro">Estimated reading time: {readingTimeLabel}</p>
            </div>
          </>
        )}
      </div>
    </AdminSurface>
  );

  const publishSurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Publish</p>
        <h2 className="admin-h2">{GUIDE_STATUS_LABELS[guide.status]}</h2>
        <p className="admin-body">Learning content moves from private drafts to scheduled or published authority pages.</p>
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
          help="Use your local time. Scheduled records stay private until this moment."
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
      </div>

      <p className="admin-micro">Keyboard: press Cmd/Ctrl+S to save immediately.</p>
    </AdminSurface>
  );

  const metaSurface = (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Content Metadata</p>
        <h2 className="admin-h2">Routing and ownership</h2>
        <p className="admin-body">Keep the slug, category, cluster, and author aligned from the start.</p>
      </div>

      <AdminField label="Slug" htmlFor="guide-slug" help="If left empty, the API will generate one from the title.">
        <AdminInput
          id="guide-slug"
          value={guide.slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          placeholder="best-strollers-2026"
        />
      </AdminField>

      <AdminField label="Content category" htmlFor="guide-category">
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
        <h2 className="admin-h2">{isAcademyModuleEditor ? 'Live module summary' : 'Editor summary'}</h2>
      </div>

      <div className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">
          Public route: {guide.slug ? getGuidePublicPath({
            slug: guide.slug,
            topicCluster: guide.topicCluster,
            canonicalUrl: guide.canonicalUrl,
          }) : 'Not generated yet'}
        </p>
        {isAcademyModuleEditor ? (
          <>
            <p className="admin-micro">Hero image: {guide.heroImageUrl?.trim() ? 'Ready for live module' : 'Using fallback or empty'}</p>
            <p className="admin-micro">Path summary: {guide.excerpt?.trim() ? 'Ready for live cards' : 'Missing excerpt / summary'}</p>
            <p className="admin-micro">Core cards detected: {academyDraftStructure.coreSectionCount}</p>
            <p className="admin-micro">Checklist bullets detected: {academyDraftStructure.checklistItemCount}</p>
            <p className="admin-micro">Product widgets detected: {academyDraftStructure.productWidgetCount}</p>
          </>
        ) : (
          <>
            <p className="admin-micro">Target keyword: {guide.targetKeyword || 'Not set'}</p>
            <p className="admin-micro">Related records: {guide.relatedGuideIds.length}</p>
            <p className="admin-micro">Affiliate modules: {guide.affiliateModules.length}</p>
          </>
        )}
      </div>

      {hasPersistedGuide && guide.slug ? (
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="secondary" size="sm">
            <Link
              href={getGuidePublicPath({
                slug: guide.slug,
                topicCluster: guide.topicCluster,
                canonicalUrl: guide.canonicalUrl,
              })}
              target="_blank"
            >
              View public page
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
            <p className="admin-eyebrow">{isAcademyModuleEditor ? 'Module Basics' : 'Core Content'}</p>
            <h2 className="admin-h2">{isAcademyModuleEditor ? 'Academy module basics' : 'Learning content basics'}</h2>
            <p className="admin-body">
              {isAcademyModuleEditor
                ? 'These fields feed the live academy hero, path cards, and module summary before the markdown sections render below.'
                : 'Set the core editorial framing before filling in the long-form sections.'}
            </p>
          </div>

          <AdminField
            label="Title"
            htmlFor="guide-title"
            help={`Slug auto-generates from the title until you edit it manually. Estimated reading time: ${readingTimeLabel}.`}
          >
            <AdminInput
              id="guide-title"
              value={guide.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Best Strollers of 2026"
            />
          </AdminField>

          <AdminField
            label="Excerpt / summary"
            htmlFor="guide-excerpt"
            help={
              isAcademyModuleEditor
                ? 'Used on academy path pages, live module summaries, and social previews.'
                : 'Used on learning-content listings and social previews.'
            }
          >
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
              placeholder="An editor-style summary of what this record helps parents decide."
            />
          </AdminField>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Hero image URL"
              htmlFor="guide-hero-image-url"
              help={isAcademyModuleEditor ? 'This is the live academy hero image. Use a full URL or root-relative path.' : 'Use a full URL or root-relative path.'}
            >
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
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => openMediaPicker({ kind: 'hero' })}
              disabled={mediaLibrary.length === 0}
            >
              Use library image
            </AdminButton>
            <AdminButton asChild type="button" variant="ghost" size="sm">
              <Link href="/admin/media">Open media library</Link>
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
            <p className="admin-eyebrow">{isAcademyModuleEditor ? 'Module Metadata' : 'SEO / Metadata'}</p>
            <h2 className="admin-h2">{isAcademyModuleEditor ? 'Search and sharing metadata' : 'Search and social metadata'}</h2>
            <p className="admin-body">
              {isAcademyModuleEditor
                ? 'These fields shape search, sharing, and admin discoverability. They do not replace the academy module body sections.'
                : 'This layer controls how the record is framed for search, sharing, and internal discovery.'}
            </p>
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
              placeholder="A clear take on infant car seats, compatibility, and everyday fit."
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
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => openMediaPicker({ kind: 'og' })}
              disabled={mediaLibrary.length === 0}
            >
              Use library image
            </AdminButton>
            <AdminButton asChild type="button" variant="ghost" size="sm">
              <Link href="/admin/media">Open media library</Link>
            </AdminButton>
          </div>
        </AdminSurface>

        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Internal linking</p>
            <h2 className="admin-h2">Related content and notes</h2>
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
              placeholder="Link from stroller comparison, travel stroller, and registry timing content."
            />
          </AdminField>

          <div className="admin-stack gap-3">
            <p className="admin-label">Related learning content</p>
            {relatedOptions.length === 0 ? (
              <p className="admin-micro">No other learning-content records available yet.</p>
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
        {isAcademyModuleEditor ? (
          <AdminSurface className="admin-stack gap-4">
            <div className="admin-stack gap-1.5">
              <p className="admin-eyebrow">Live Academy Mapping</p>
              <h2 className="admin-h2">What the public module actually reads</h2>
              <p className="admin-body">
                The academy preview and live module do not render this draft as a generic article. They parse the headings below into TMBC academy cards, checklists, product widgets, and callouts.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {[
                {
                  title: 'Title + excerpt + hero image',
                  status: guide.title.trim() && guide.excerpt?.trim() && guide.heroImageUrl?.trim() ? 'Ready' : 'Needs attention',
                  body: 'These fields drive the module title, summary, and hero media on the live academy page.',
                },
                {
                  title: '## Module X of Y',
                  status: academyDraftStructure.moduleIntroParagraphs > 0 ? `${academyDraftStructure.moduleIntroParagraphs} intro paragraphs` : 'Missing in draft',
                  body: 'This section becomes the intro copy beneath the hero.',
                },
                {
                  title: '## Core Considerations',
                  status:
                    academyDraftStructure.coreSectionCount > 0
                      ? `${academyDraftStructure.coreSectionCount} live cards`
                      : 'Missing in draft',
                  body: 'Each `###` subsection becomes its own live editorial card. Inline markdown images inside those subsections become the section visuals.',
                },
                {
                  title: '## What This Means For You',
                  status:
                    academyDraftStructure.checklistItemCount > 0
                      ? `${academyDraftStructure.checklistItemCount} checklist bullets`
                      : 'Missing in draft',
                  body: 'The bullet list in this section becomes the checklist-style decision widget.',
                },
                {
                  title: '## Examples That Support This Setup',
                  status:
                    academyDraftStructure.productWidgetCount > 0
                      ? `${academyDraftStructure.productWidgetCount} product widgets`
                      : 'Using seeded examples or none',
                  body: 'Only `:::product` widgets inside this section become live academy product cards.',
                },
                {
                  title: 'First non-core section',
                  status: academyDraftStructure.softCtaTitle ? academyDraftStructure.softCtaTitle : 'Using seeded fallback',
                  body: 'Usually this is `## A Note Before You Move Forward`. The first non-core section becomes the TMBC expert callout.',
                },
                {
                  title: '## Next Steps',
                  status: academyDraftStructure.hasNextStepsSection ? 'Present in draft' : 'Optional editorial copy',
                  body: 'This section is editorial only. Actual module navigation still comes from the module order and next/previous slugs.',
                },
              ].map((item) => (
                <div key={item.title} className="space-y-2 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                  <p className="admin-label">{item.title}</p>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-admin">{item.status}</p>
                  <p className="admin-micro">{item.body}</p>
                </div>
              ))}
            </div>
          </AdminSurface>
        ) : null}

        <AdminSurface className="admin-stack gap-4">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">{isAcademyModuleEditor ? 'Module Structure' : 'Content Structure'}</p>
            <h2 className="admin-h2">{isAcademyModuleEditor ? 'Academy markdown' : 'Long-form content'}</h2>
            <p className="admin-body">
              {isAcademyModuleEditor
                ? 'Write the academy module in one field, but keep the heading structure exact. The live academy layout converts these sections into widgets and editorial cards.'
                : 'Write the full record in one continuous field. Use markdown headings to create structure where it actually helps the reader.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p className={`admin-micro ${wordCountToneClass}`}>Word Count: {wordCount.toLocaleString()}</p>
              <p className="admin-micro">
                {isAcademyModuleEditor ? 'Focus on clear sections, not long-form SEO length.' : 'Target: Minimum 4000 words'}
              </p>
            </div>
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

          <AdminField
            label={isAcademyModuleEditor ? 'Module content' : 'Guide content'}
            htmlFor="guide-content"
            help={
              isAcademyModuleEditor
                ? 'Use the exact academy headings shown above. `###` sections inside `## Core Considerations` become live cards.'
                : 'Write in markdown with clear H2 and H3 structure where needed.'
            }
          >
            <div className="admin-stack gap-3">
              <div className="admin-stack gap-1">
                <p className="admin-eyebrow">Formatting Tools</p>
                <p className="admin-micro">Add headings, lists, quotes, links, dividers, and inline images without hand-writing the markdown each time.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('h2')}>
                  H2
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('h3')}>
                  H3
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('bold')}>
                  Bold
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('italic')}>
                  Italic
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('bulletList')}>
                  Bullets
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('numberedList')}>
                  Numbers
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('quote')}>
                  Quote
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('link')}>
                  Link
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('image')}>
                  Image
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => openInlineImagePicker()}
                  disabled={uploadingKind !== null}
                >
                  {uploadingKind === 'inline' ? 'Uploading image...' : 'Upload image'}
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => openMediaPicker({ kind: 'inlineInsert' })}
                  disabled={mediaLibrary.length === 0}
                >
                  Library image
                </AdminButton>
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => applyGuideMarkdownFormat('divider')}>
                  Divider
                </AdminButton>
              </div>

              <div className="admin-stack gap-3">
                <div className="admin-stack gap-1">
                  <p className="admin-eyebrow">Editorial Images</p>
                  <p className="admin-micro">
                    Academy modules and learning-content layouts read these markdown image rows directly. Swap placeholder URLs here instead of digging through the draft.
                  </p>
                </div>

                {contentEditorialImages.length === 0 ? (
                  <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                    <p className="admin-micro">
                      No inline images in this draft yet. Use the Image or Upload image buttons above to insert one, then manage it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contentEditorialImages.map((image) => (
                      <div
                        key={`${image.lineNumber}-${image.index}`}
                        className="space-y-4 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="admin-stack gap-1">
                            <p className="admin-label">{image.heading || `Image ${image.index + 1}`}</p>
                            <p className="admin-micro">
                              {image.isPlaceholder ? 'Placeholder active' : 'Live image'} · line {image.lineNumber + 1}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => openInlineImagePicker(image.lineNumber)}
                              disabled={uploadingKind !== null}
                            >
                              {uploadingKind === 'inline' ? 'Uploading image...' : 'Upload replacement'}
                            </AdminButton>
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => openMediaPicker({ kind: 'inlineReplace', lineNumber: image.lineNumber })}
                              disabled={mediaLibrary.length === 0}
                            >
                              Use library image
                            </AdminButton>
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                void flushContentImageEdits(image.lineNumber, 'Editorial image changes saved.')
                              }
                            >
                              Save image changes
                            </AdminButton>
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => jumpToContentImage(image.lineNumber)}
                            >
                              Jump to markdown
                            </AdminButton>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <AdminField label="Image URL" htmlFor={`guide-inline-image-url-${image.lineNumber}`}>
                            <AdminInput
                              id={`guide-inline-image-url-${image.lineNumber}`}
                              value={image.src}
                              onChange={(event) =>
                                handleContentImageUpdate(image.lineNumber, {
                                  src: event.target.value,
                                })
                              }
                              onBlur={() =>
                                void flushContentImageEdits(image.lineNumber, 'Editorial image changes saved.')
                              }
                              placeholder="https://cdn.example.com/editorial-image.jpg"
                            />
                          </AdminField>

                          <AdminField label="Alt text" htmlFor={`guide-inline-image-alt-${image.lineNumber}`}>
                            <AdminInput
                              id={`guide-inline-image-alt-${image.lineNumber}`}
                              value={image.alt}
                              onChange={(event) =>
                                handleContentImageUpdate(image.lineNumber, {
                                  alt: event.target.value,
                                })
                              }
                              onBlur={() =>
                                void flushContentImageEdits(image.lineNumber, 'Editorial image changes saved.')
                              }
                              placeholder="Editorial image description"
                            />
                          </AdminField>
                        </div>

                        {image.src ? (
                          <div className="overflow-hidden rounded-[20px] border border-[var(--admin-color-border)] bg-[rgba(251,248,245,0.8)]">
                            <img src={image.src} alt={image.alt || 'Learning content editorial preview'} className="h-auto w-full" />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-stack gap-1">
                <p className="admin-eyebrow">{isAcademyModuleEditor ? 'Insert Content Section' : 'Insert Section'}</p>
                <p className="admin-micro">
                  {isAcademyModuleEditor
                    ? 'Use these generic TMBC sections when you need extra framing inside a module. The academy-specific scaffold buttons live above.'
                    : 'Drop a ready-made TMBC section into the draft at the current cursor position.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {GUIDE_SECTION_SNIPPET_OPTIONS.map((snippet) => (
                  <AdminButton
                    key={snippet.id}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => insertSectionSnippet(snippet.id)}
                  >
                    {snippet.label}
                  </AdminButton>
                ))}
              </div>

              <div className="admin-stack gap-1">
                <p className="admin-eyebrow">Content Widgets</p>
                <p className="admin-micro">Insert richer content blocks that render as visual learning-content widgets on the public page.</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {STYLED_BLOCKS.map((block) => (
                  <div
                    key={block.id}
                    className="admin-stack justify-between gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4"
                  >
                    <div className="admin-stack gap-1.5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-admin">{block.label}</h3>
                      <p className="admin-micro">{block.description}</p>
                    </div>

                    <div className="flex justify-start">
                      <AdminButton type="button" variant="secondary" size="sm" onClick={() => insertStyledBlock(block.id)}>
                        Insert widget
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>

              <AdminTextarea
                ref={contentTextareaRef}
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
                className="min-h-[720px]"
                placeholder="## Introduction&#10;&#10;Start the draft here...&#10;&#10;## What to look for&#10;&#10;Build the rest of the record in one continuous draft."
              />
            </div>
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
                placeholder="This learning-content record may include affiliate links."
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
                placeholder="/learn"
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
          <Link href={resolvedListingHref}>Back to workspace</Link>
        </AdminButton>
        <p className="admin-micro">Academy workspace: structure on the left, workflow controls on the right.</p>
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

      {editorUtilitySurface}

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

      {mediaPickerTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-media-dialog-title"
            className="w-full max-w-5xl rounded-[28px] border border-[var(--admin-color-border)] bg-[var(--admin-color-background)] p-6 shadow-[var(--admin-shadow-popover)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="admin-stack gap-2">
                <p className="admin-eyebrow">Media library</p>
                <h2 id="guide-media-dialog-title" className="admin-h2">{mediaPickerTitle}</h2>
                <p className="admin-body">
                  Use one of your uploaded images, or upload a new one from the editor and it will appear here too.
                </p>
              </div>

              <AdminButton variant="secondary" size="sm" onClick={closeMediaPicker}>
                Close
              </AdminButton>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="min-w-[16rem] flex-1">
                <AdminInput
                  value={mediaLibrarySearch}
                  onChange={(event) => setMediaLibrarySearch(event.target.value)}
                  placeholder="Search by file name"
                />
              </div>
              <AdminButton asChild variant="ghost" size="sm">
                <Link href="/admin/media">Open full media library</Link>
              </AdminButton>
            </div>

            {filteredMediaLibrary.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-6">
                <p className="admin-body">
                  No uploaded images match this search yet. Upload one from this editor, or open the media library to review your assets.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid max-h-[65vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredMediaLibrary.map((media) => (
                  <div
                    key={media.id}
                    className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 shadow-[0_10px_24px_rgba(39,28,32,0.04)]"
                  >
                    <div className="overflow-hidden rounded-[20px] border border-[var(--admin-color-border)] bg-[rgba(251,248,245,0.8)]">
                      <img src={media.url} alt={media.fileName} className="aspect-[4/3] w-full object-cover" />
                    </div>

                    <div className="mt-4 admin-stack gap-1.5">
                      <p className="admin-label">{media.fileName}</p>
                      <p className="admin-micro truncate">{media.url}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <AdminButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => void handleSelectMediaFromLibrary(media)}
                      >
                        {mediaPickerActionLabel}
                      </AdminButton>
                      <AdminButton asChild type="button" variant="ghost" size="sm">
                        <a href={media.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {pendingTemplateId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-template-dialog-title"
            className="w-full max-w-xl rounded-[28px] border border-[var(--admin-color-border)] bg-[var(--admin-color-background)] p-6 shadow-[var(--admin-shadow-popover)]"
          >
            <div className="admin-stack gap-2">
              <p className="admin-eyebrow">Insert template content?</p>
              <h2 id="guide-template-dialog-title" className="admin-h2">Insert template content?</h2>
              <p className="admin-body">
                This will populate the current draft with the{' '}
                {GUIDE_TEMPLATES[pendingTemplateId].name.toLowerCase()} starter structure.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <AdminButton variant="secondary" size="sm" onClick={closeTemplateModal}>
                Cancel
              </AdminButton>
              <AdminButton variant="primary" size="sm" onClick={confirmTemplateInsertion}>
                Insert template
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}

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

      <input
        ref={inlineInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.currentTarget.value = '';
          if (!file) {
            pendingInlineImageLineRef.current = null;
            return;
          }

          void handleInlineImageUpload(file);
        }}
      />
    </AdminStack>
  );
}
