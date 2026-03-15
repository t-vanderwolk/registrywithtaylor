import { stripMarkdown } from '@/lib/blog/contentText';
import { slugify } from '@/lib/slugify';

export type GuideTocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type GuideSection = {
  id: string;
  title: string;
  content: string;
};

export type GuideOutline = {
  preface: string;
  sections: GuideSection[];
  tocItems: GuideTocItem[];
};

function createTocItem({
  label,
  level,
  usedIds,
}: {
  label: string;
  level: 2 | 3;
  usedIds: Map<string, number>;
}): GuideTocItem | null {
  const cleanedLabel = stripMarkdown(label).trim();
  if (!cleanedLabel) {
    return null;
  }

  const baseId = slugify(cleanedLabel) || 'section';
  const seenCount = usedIds.get(baseId) ?? 0;
  usedIds.set(baseId, seenCount + 1);

  return {
    id: seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`,
    label: cleanedLabel,
    level,
  };
}

export function buildGuideOutline(content: string): GuideOutline {
  const lines = content.split('\n');
  const usedIds = new Map<string, number>();
  const tocItems: GuideTocItem[] = [];
  const prefaceLines: string[] = [];
  const sections: GuideSection[] = [];
  let currentSectionTitle: string | null = null;
  let currentSectionId = '';
  let currentSectionLines: string[] = [];

  const flushSection = () => {
    if (!currentSectionTitle) {
      return;
    }

    const sectionContent = currentSectionLines.join('\n').trim();
    if (sectionContent) {
      sections.push({
        id: currentSectionId,
        title: currentSectionTitle,
        content: sectionContent,
      });
    }

    currentSectionTitle = null;
    currentSectionId = '';
    currentSectionLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      flushSection();

      const tocItem = createTocItem({
        label: line.replace(/^##\s+/, ''),
        level: 2,
        usedIds,
      });

      if (!tocItem) {
        continue;
      }

      tocItems.push(tocItem);
      currentSectionTitle = tocItem.label;
      currentSectionId = tocItem.id;
      currentSectionLines = [rawLine];
      continue;
    }

    if (line.startsWith('### ')) {
      const tocItem = createTocItem({
        label: line.replace(/^###\s+/, ''),
        level: 3,
        usedIds,
      });

      if (tocItem) {
        tocItems.push(tocItem);
      }
    }

    if (currentSectionTitle) {
      currentSectionLines.push(rawLine);
    } else {
      prefaceLines.push(rawLine);
    }
  }

  flushSection();

  return {
    preface: prefaceLines.join('\n').trim(),
    sections,
    tocItems,
  };
}

export function stripFaqBlocks(content: string) {
  const lines = content.split('\n');
  const keptLines: string[] = [];
  let skippingFaq = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === ':::faq') {
      skippingFaq = true;
      continue;
    }

    if (skippingFaq) {
      if (line === ':::') {
        skippingFaq = false;
      }
      continue;
    }

    keptLines.push(rawLine);
  }

  return keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
