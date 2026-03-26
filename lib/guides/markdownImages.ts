const markdownImageLinePattern = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/;
const markdownHeadingPattern = /^(#{2,6})\s+(.+?)\s*$/;

export type GuideMarkdownImage = {
  index: number;
  lineNumber: number;
  alt: string;
  src: string;
  title: string | null;
  heading: string | null;
  isPlaceholder: boolean;
};

function stripMarkdownLabel(value: string) {
  return value
    .replace(/[*_`>#]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractGuideMarkdownImages(content: string): GuideMarkdownImage[] {
  const lines = content.split('\n');
  const images: GuideMarkdownImage[] = [];
  let currentHeading: string | null = null;

  lines.forEach((line, lineNumber) => {
    const trimmedLine = line.trim();
    const headingMatch = trimmedLine.match(markdownHeadingPattern);

    if (headingMatch) {
      const headingText = stripMarkdownLabel(headingMatch[2] ?? '');
      currentHeading = headingText || currentHeading;
      return;
    }

    const imageMatch = trimmedLine.match(markdownImageLinePattern);
    if (!imageMatch) {
      return;
    }

    const src = imageMatch[2]?.trim() ?? '';
    images.push({
      index: images.length,
      lineNumber,
      alt: imageMatch[1]?.trim() ?? '',
      src,
      title: imageMatch[3]?.trim() || null,
      heading: currentHeading,
      isPlaceholder: src.includes('/placeholders/') || src.includes('/placeholder'),
    });
  });

  return images;
}

export function updateGuideMarkdownImage(
  content: string,
  lineNumber: number,
  updates: Partial<Pick<GuideMarkdownImage, 'alt' | 'src' | 'title'>>,
) {
  const lines = content.split('\n');
  const currentLine = lines[lineNumber];

  if (currentLine === undefined) {
    return content;
  }

  const trimmedLine = currentLine.trim();
  const imageMatch = trimmedLine.match(markdownImageLinePattern);

  if (!imageMatch) {
    return content;
  }

  const currentAlt = imageMatch[1]?.trim() ?? '';
  const currentSrc = imageMatch[2]?.trim() ?? '';
  const currentTitle = imageMatch[3]?.trim() || null;
  const nextAlt = updates.alt ?? currentAlt;
  const nextSrc = updates.src ?? currentSrc;
  const nextTitle = updates.title !== undefined ? (updates.title?.trim() || null) : currentTitle;
  const leadingWhitespace = currentLine.match(/^\s*/)?.[0] ?? '';

  lines[lineNumber] = `${leadingWhitespace}![${nextAlt}](${nextSrc}${nextTitle ? ` "${nextTitle}"` : ''})`;

  return lines.join('\n');
}

export function getGuideMarkdownImageLineOffset(content: string, lineNumber: number) {
  if (lineNumber <= 0) {
    return 0;
  }

  const lines = content.split('\n');
  return lines.slice(0, lineNumber).reduce((total, line) => total + line.length + 1, 0);
}
