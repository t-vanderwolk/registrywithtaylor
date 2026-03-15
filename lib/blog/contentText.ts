import { extractWidgetFaqEntries } from '@/lib/blog/styledBlocks';

const markdownCodeFencePattern = /```[\s\S]*?```/g;
const markdownCodePattern = /`[^`]*`/g;
const markdownImagePattern = /!\[[^\]]*\]\([^)]+\)/g;
const markdownLinkPattern = /\[([^\]]+)\]\([^)]+\)/g;
const markdownHeadingPattern = /^#{1,6}\s+/gm;
const markdownWidgetFencePattern = /^:::[a-zA-Z]+\s*$|^:::\s*$/gm;
const markdownDecoratorsPattern = /[*_~>#]/g;
const orderedListPattern = /^\d+\.\s+/;
const monthPattern =
  /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/i;
const yearPattern = /\b20\d{2}\b/;
const updatedPattern = /\b(?:updated|published|last updated)\b/i;
const readTimePattern = /\b\d+\s*(?:min|minute)s?\s+read\b/i;
const slashDatePattern = /\b\d{1,2}\/\d{1,2}\/20\d{2}\b/;

export type NormalizeLegacyArticleContentOptions = {
  title?: string | null;
  authors?: string[];
  categoryLabel?: string | null;
};

export function stripMarkdown(value: string) {
  return value
    .replace(markdownCodeFencePattern, ' ')
    .replace(markdownCodePattern, ' ')
    .replace(markdownImagePattern, ' ')
    .replace(markdownLinkPattern, '$1')
    .replace(markdownHeadingPattern, '')
    .replace(markdownWidgetFencePattern, ' ')
    .replace(markdownDecoratorsPattern, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const normalizeForComparison = (value: string) =>
  stripMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const isStructuralLeadBlock = (block: string) => {
  const trimmed = block.trim();

  return (
    !trimmed ||
    trimmed.startsWith('## ') ||
    trimmed.startsWith('### ') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith(':::') ||
    trimmed.startsWith('- ') ||
    trimmed.startsWith('![') ||
    trimmed.startsWith('<!--TMBC_CTA_BUTTONS:') ||
    orderedListPattern.test(trimmed)
  );
};

const hasCalendarSignal = (value: string) =>
  updatedPattern.test(value) ||
  readTimePattern.test(value) ||
  slashDatePattern.test(value) ||
  (monthPattern.test(value) && yearPattern.test(value));

const hasAuthorSignal = (value: string, authors: string[]) => {
  const normalizedValue = normalizeForComparison(value);

  return authors
    .map((author) => normalizeForComparison(author))
    .filter(Boolean)
    .some((author) => normalizedValue.includes(author));
};

const hasCategorySignal = (value: string, categoryLabel?: string | null) => {
  if (!categoryLabel?.trim()) {
    return false;
  }

  const normalizedCategory = normalizeForComparison(categoryLabel);
  if (!normalizedCategory) {
    return false;
  }

  return normalizeForComparison(value).includes(normalizedCategory);
};

const isLeadingTitleBlock = (block: string, title?: string | null) => {
  const trimmed = block.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('# ')) {
    return true;
  }

  if (!title?.trim()) {
    return false;
  }

  return normalizeForComparison(trimmed) === normalizeForComparison(title);
};

export function sanitizeLegacyArticleContent(
  content: string,
  options: NormalizeLegacyArticleContentOptions = {},
) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return content.trim();
  }

  let startIndex = 0;
  if (isLeadingTitleBlock(blocks[startIndex] ?? '', options.title)) {
    startIndex += 1;
  }

  const candidateBlocks: string[] = [];
  while (startIndex + candidateBlocks.length < blocks.length && candidateBlocks.length < 3) {
    const candidate = blocks[startIndex + candidateBlocks.length] ?? '';

    if (isStructuralLeadBlock(candidate)) {
      break;
    }

    candidateBlocks.push(candidate);
  }

  if (candidateBlocks.length > 0) {
    const combinedCandidateText = candidateBlocks.map((block) => stripMarkdown(block)).join(' ');
    const hasCompactMetadataShape =
      candidateBlocks.every((block) => stripMarkdown(block).length <= 140) && combinedCandidateText.length <= 280;
    const hasAuthor = hasAuthorSignal(combinedCandidateText, options.authors ?? []);
    const hasCategory = hasCategorySignal(combinedCandidateText, options.categoryLabel);
    const hasCalendar = hasCalendarSignal(combinedCandidateText);

    if (
      hasCompactMetadataShape &&
      ((hasAuthor && hasCalendar) || (hasAuthor && hasCategory) || (hasCalendar && hasCategory))
    ) {
      startIndex += candidateBlocks.length;
    }
  }

  return blocks.slice(startIndex).join('\n\n').trim();
}

export function estimateReadingTimeFromContent(content: string, wordsPerMinute = 190) {
  const plainText = stripMarkdown(content);
  if (!plainText) {
    return 1;
  }

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function extractLeadParagraphs(content: string, maxParagraphs = 2) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(
      (paragraph) =>
        Boolean(paragraph) &&
        !paragraph.startsWith('# ') &&
        !paragraph.startsWith('## ') &&
        !paragraph.startsWith('### ') &&
        !paragraph.startsWith(':::') &&
        !paragraph.startsWith('> ') &&
        !paragraph.startsWith('<!--TMBC_CTA_BUTTONS:'),
    );

  return paragraphs.slice(0, maxParagraphs);
}

export type FaqEntry = {
  question: string;
  answer: string;
};

export function extractFaqEntries(content: string) {
  const widgetFaqs = extractWidgetFaqEntries(content);
  const lines = content.split('\n');
  const faqs: FaqEntry[] = [];
  let inFaqSection = false;
  let currentQuestion: string | null = null;
  let answerLines: string[] = [];

  const flushCurrent = () => {
    if (!currentQuestion) {
      return;
    }

    const answer = stripMarkdown(answerLines.join(' ').trim());
    if (answer) {
      faqs.push({
        question: currentQuestion,
        answer,
      });
    }

    currentQuestion = null;
    answerLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      flushCurrent();
      inFaqSection = /^##\s+(faq|frequently asked questions)/i.test(line);
      continue;
    }

    if (!inFaqSection) {
      continue;
    }

    if (line.startsWith('### ')) {
      flushCurrent();
      currentQuestion = stripMarkdown(line.replace(/^###\s+/, ''));
      continue;
    }

    if (!line) {
      continue;
    }

    answerLines.push(line);
  }

  flushCurrent();

  return [...widgetFaqs, ...faqs].filter(
    (entry, index, collection) =>
      collection.findIndex(
        (candidate) =>
          candidate.question.toLowerCase() === entry.question.toLowerCase() &&
          candidate.answer.toLowerCase() === entry.answer.toLowerCase(),
      ) === index,
  );
}
