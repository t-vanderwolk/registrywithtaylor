import type { BlogCategory } from '@/lib/blogCategories';
import {
  estimateReadingTimeFromContent,
  extractLeadParagraphs,
  stripMarkdown,
} from '@/lib/blog/contentText';
import { SITE_URL } from '@/lib/marketing/metadata';
import { slugify } from '@/lib/slugify';

export type BlogHeadingOutlineItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type BlogSeoInput = {
  title: string;
  slug: string;
  category: BlogCategory | string;
  content: string;
  excerpt?: string | null;
  deck?: string | null;
  focusKeyword?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  shareTitle?: string | null;
  shareDescription?: string | null;
  canonicalUrl?: string | null;
  readingTime?: number | null;
};

const MAX_DESCRIPTION_LENGTH = 160;
const MAX_SHARE_DESCRIPTION_LENGTH = 180;
const MAX_TITLE_LENGTH = 68;
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'how',
  'in',
  'into',
  'is',
  'it',
  'more',
  'most',
  'not',
  'of',
  'on',
  'or',
  'our',
  'that',
  'the',
  'their',
  'this',
  'to',
  'up',
  'what',
  'with',
  'without',
  'your',
]);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function truncateAtWordBoundary(value: string, maxLength: number) {
  const normalized = normalizeWhitespace(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, maxLength + 1);
  const boundary = slice.lastIndexOf(' ');
  const safeSlice = slice.slice(0, boundary > 0 ? boundary : maxLength).trim();
  return `${safeSlice}...`;
}

function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, SITE_URL).toString();
}

function titleCaseWords(words: string[]) {
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

function inferTopicKeywords(title: string, content: string, category: string) {
  const text = `${title} ${content} ${category}`.toLowerCase();
  const keywords: string[] = [];

  if (text.includes('registry')) {
    keywords.push('baby registry planning', 'registry strategy');
  }

  if (text.includes('nursery')) {
    keywords.push('nursery planning', 'nursery setup');
  }

  if (text.includes('gear')) {
    keywords.push('baby gear guidance', 'how to choose baby gear');
  }

  if (text.includes('stroller')) {
    keywords.push('stroller guidance');
  }

  if (text.includes('car seat')) {
    keywords.push('car seat guidance');
  }

  return keywords;
}

function deriveFocusKeyword({ title, focusKeyword }: Pick<BlogSeoInput, 'title' | 'focusKeyword'>) {
  if (focusKeyword?.trim()) {
    return focusKeyword.trim();
  }

  return title.trim();
}

function buildKeywordSet(input: BlogSeoInput) {
  const title = input.title.trim();
  const category = normalizeWhitespace(String(input.category));
  const focusKeyword = deriveFocusKeyword(input);
  const titleTokens = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  const tokenPhrase = titleCaseWords(titleTokens.slice(0, 4));

  return [
    focusKeyword,
    title,
    category,
    tokenPhrase || null,
    'Taylor-Made Baby Co.',
    ...inferTopicKeywords(title, input.content, category),
  ].filter((value, index, collection): value is string => {
    if (!value) {
      return false;
    }

    return collection.findIndex((candidate) => typeof candidate === 'string' && candidate.toLowerCase() === value.toLowerCase()) === index;
  });
}

function buildDescription(input: BlogSeoInput, maxLength: number) {
  const explicitDescription = input.seoDescription?.trim();
  if (explicitDescription) {
    return truncateAtWordBoundary(explicitDescription, maxLength);
  }

  const excerpt = input.excerpt?.trim() || input.deck?.trim();
  if (excerpt) {
    return truncateAtWordBoundary(excerpt, maxLength);
  }

  const leadParagraphs = extractLeadParagraphs(input.content, 2);
  if (leadParagraphs.length > 0) {
    return truncateAtWordBoundary(leadParagraphs.map((paragraph) => stripMarkdown(paragraph)).join(' '), maxLength);
  }

  return truncateAtWordBoundary(stripMarkdown(input.content), maxLength);
}

function buildSeoTitle(input: BlogSeoInput) {
  const explicitTitle = input.seoTitle?.trim();
  if (explicitTitle) {
    return explicitTitle;
  }

  const brandedTitle = `${input.title.trim()} | Taylor-Made Baby Co.`;
  return brandedTitle.length <= MAX_TITLE_LENGTH ? brandedTitle : input.title.trim();
}

function buildShareTitle(input: BlogSeoInput) {
  return input.shareTitle?.trim() || buildSeoTitle(input);
}

function buildCanonicalUrl(input: BlogSeoInput) {
  return toAbsoluteUrl(input.canonicalUrl?.trim() || `/blog/${input.slug}`);
}

export function extractBlogHeadingOutline(content: string) {
  const headings: BlogHeadingOutlineItem[] = [];
  const counts = new Map<string, number>();

  content.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    const headingMatch = line.match(/^(##|###)\s+(.+)$/);
    if (!headingMatch) {
      return;
    }

    const level = headingMatch[1] === '##' ? 2 : 3;
    const text = normalizeWhitespace(stripMarkdown(headingMatch[2] ?? ''));
    if (!text) {
      return;
    }

    const baseId = slugify(text) || 'section';
    const seen = counts.get(baseId) ?? 0;
    counts.set(baseId, seen + 1);

    headings.push({
      id: seen === 0 ? baseId : `${baseId}-${seen + 1}`,
      text,
      level,
    });
  });

  return headings;
}

export function buildBlogSeoSnapshot(input: BlogSeoInput) {
  const focusKeyword = deriveFocusKeyword(input);
  const seoTitle = buildSeoTitle(input);
  const seoDescription = buildDescription(input, MAX_DESCRIPTION_LENGTH);
  const shareTitle = buildShareTitle(input);
  const shareDescription = truncateAtWordBoundary(
    input.shareDescription?.trim() || seoDescription,
    MAX_SHARE_DESCRIPTION_LENGTH,
  );
  const canonicalUrl = buildCanonicalUrl(input);
  const readingTime = input.readingTime ?? estimateReadingTimeFromContent(input.content);
  const keywords = buildKeywordSet(input);
  const outline = extractBlogHeadingOutline(input.content);
  const articlePlainText = stripMarkdown(input.content);
  const wordCount = articlePlainText ? articlePlainText.split(/\s+/).filter(Boolean).length : 0;

  return {
    focusKeyword,
    seoTitle,
    seoDescription,
    shareTitle,
    shareDescription,
    canonicalUrl,
    readingTime,
    keywords,
    outline,
    wordCount,
  };
}
