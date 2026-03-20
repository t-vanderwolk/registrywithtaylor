import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideSection } from '@/lib/guides/articleOutline';
import { splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

export type GuidePrefaceBrief = {
  leadParagraph: string;
  supportingParagraphs: string[];
  callout: {
    title?: string | null;
    body: string;
  } | null;
};

export function stripLeadingTopHeading(content: string) {
  const lines = content.split('\n');
  if (lines.length === 0) {
    return content.trim();
  }

  const firstLine = lines[0]?.trim() ?? '';
  if (firstLine.startsWith('# ')) {
    return lines.slice(1).join('\n').trim();
  }

  return content.trim();
}

function stripStyledBlocksOfTypes(content: string, blockTypes: ParsedStyledBlock['type'][]) {
  const typesToStrip = new Set(blockTypes);
  const lines = content.split('\n');
  const keptLines: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed || !isStyledBlockStart(trimmed)) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    if (typesToStrip.has(parsed.block.type)) {
      index = parsed.nextIndex;
      continue;
    }

    keptLines.push(...lines.slice(index, parsed.nextIndex));
    index = parsed.nextIndex;
  }

  return keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function splitPreface(content: string) {
  const paragraphs = stripLeadingTopHeading(content)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const [leadParagraph = '', ...remainingParagraphs] = paragraphs;

  return {
    leadParagraph,
    remainingPreface: remainingParagraphs.join('\n\n'),
  };
}

export function sanitizeGuideContent(content: string) {
  return stripLeadingTopHeading(content)
    .replace(/\n+Start with confidence\.[\s\S]*$/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function buildPrefaceBrief(content: string): GuidePrefaceBrief {
  const cleanedContent = sanitizeGuideContent(content);
  const blocks = extractStyledBlocks(cleanedContent);
  const callout =
    blocks.find((block): block is Extract<ParsedStyledBlock, { type: 'callout' }> => block.type === 'callout') ?? null;
  const textOnlyContent = stripStyledBlocksOfTypes(cleanedContent, ['callout']);
  const { leadParagraph, remainingPreface } = splitPreface(textOnlyContent);

  return {
    leadParagraph,
    supportingParagraphs: remainingPreface
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    callout,
  };
}

export function dedupeFaqEntries({
  guide,
  articleContent,
}: {
  guide: GuideArticleRecord;
  articleContent: string;
}) {
  return [
    ...guide.faqItems.map((entry) => ({
      question: entry.question,
      answer: entry.answer,
    })),
    ...extractFaqEntries(articleContent),
  ].filter(
    (entry, index, collection) =>
      collection.findIndex(
        (candidate) =>
          candidate.question.toLowerCase() === entry.question.toLowerCase() &&
          candidate.answer.toLowerCase() === entry.answer.toLowerCase(),
      ) === index,
  );
}

export function extractSectionSummary(content: string) {
  const blocks = sanitizeGuideContent(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !block.startsWith('### ') &&
        !block.startsWith(':::') &&
        !block.startsWith('![') &&
        !block.startsWith('- ') &&
        !/^\d+\.\s/.test(block),
    );

  return blocks[0] ? stripMarkdown(blocks[0]) : '';
}

export function extractSectionHighlights(content: string) {
  const { subsections } = splitGuideSectionContent(sanitizeGuideContent(content));
  return subsections.map((subsection) => stripMarkdown(subsection.title)).slice(0, 4);
}

export function stripSectionHeading(content: string) {
  return sanitizeGuideContent(stripLeadingGuideHeading(content));
}

export type DecisionStepRecord = {
  id: string;
  stepLabel: string;
  title: string;
  summary: string;
  highlights: string[];
  introContent?: string;
  subsections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
};

export function buildDecisionStepsFromSections(
  sections: GuideSection[],
  options?: {
    excludeTitles?: string[];
  },
) {
  const excludedTitles = new Set((options?.excludeTitles ?? []).map((title) => title.toLowerCase()));

  return sections
    .filter((section) => !excludedTitles.has(section.title.toLowerCase()))
    .map((section, index): DecisionStepRecord => {
      const cleanedContent = stripSectionHeading(section.content);
      const { introContent, subsections } = splitGuideSectionContent(cleanedContent);

      return {
        id: section.id,
        stepLabel: `Step ${index + 1}`,
        title: section.title,
        summary: extractSectionSummary(cleanedContent),
        highlights: extractSectionHighlights(cleanedContent),
        introContent: stripSectionHeading(introContent),
        subsections: subsections.map((subsection) => ({
          id: subsection.id,
          title: subsection.title,
          content: stripSectionHeading(subsection.content),
        })),
      };
    });
}
