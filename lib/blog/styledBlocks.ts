export type StyledBlockId = 'callout' | 'pullquote' | 'pros' | 'cons' | 'comparison';

export type StyledBlockDefinition = {
  id: StyledBlockId;
  label: string;
  description: string;
  snippet: string;
};

export type ParsedStyledBlock =
  | {
      type: 'callout';
      title: string | null;
      body: string;
    }
  | {
      type: 'pullquote';
      quote: string;
      attribution: string | null;
    }
  | {
      type: 'pros' | 'cons';
      title: string;
      items: string[];
    }
  | {
      type: 'comparison';
      title: string;
      rows: Array<{ label: string; value: string }>;
    };

const STYLED_BLOCK_OPEN_PATTERN = /^:::(callout|pullquote|pros|cons|comparison)\s*$/i;
const STYLED_BLOCK_CLOSE = ':::';

function trimNonEmptyLines(lines: string[]) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

export const STYLED_BLOCKS: StyledBlockDefinition[] = [
  {
    id: 'callout',
    label: 'Callout',
    description: 'A highlighted takeaway box for quick recommendations and operator notes.',
    snippet: `:::callout
Quick take
Lead with the clearest recommendation or operator note here.
:::`,
  },
  {
    id: 'pullquote',
    label: 'Pull Quote',
    description: 'A large serif quote block to spotlight one memorable line.',
    snippet: `:::pullquote
The stroller you use every day beats the stroller with the longest feature list.
— Taylor-Made Baby
:::`,
  },
  {
    id: 'pros',
    label: 'Pros Block',
    description: 'A visual list of strengths for a product, service, or recommendation.',
    snippet: `:::pros
- Easy everyday use
- Clear standout feature
- Worth the price for the right family
:::`,
  },
  {
    id: 'cons',
    label: 'Cons Block',
    description: 'A visual list of tradeoffs or watchouts.',
    snippet: `:::cons
- Higher price point
- Takes more trunk space
- Better for one use case than another
:::`,
  },
  {
    id: 'comparison',
    label: 'Comparison Card',
    description: 'A compact profile card for an option inside a roundup or comparison post.',
    snippet: `:::comparison
Title: Option name
Best for: Busy families who want the simplest daily setup
Standout: Name the strongest reason to choose it
Watchout: Name the main tradeoff or caveat
:::`,
  },
];

export function getStyledBlockSnippet(blockId: StyledBlockId) {
  return STYLED_BLOCKS.find((block) => block.id === blockId)?.snippet ?? null;
}

export function isStyledBlockStart(line: string) {
  return STYLED_BLOCK_OPEN_PATTERN.test(line.trim());
}

export function parseStyledBlock(
  lines: string[],
  startIndex: number,
): { block: ParsedStyledBlock; nextIndex: number } | null {
  const startLine = lines[startIndex]?.trim() ?? '';
  const match = startLine.match(STYLED_BLOCK_OPEN_PATTERN);

  if (!match) {
    return null;
  }

  const type = match[1].toLowerCase() as StyledBlockId;
  const bodyLines: string[] = [];
  let cursor = startIndex + 1;

  while (cursor < lines.length) {
    const line = lines[cursor] ?? '';
    if (line.trim() === STYLED_BLOCK_CLOSE) {
      cursor += 1;
      break;
    }

    bodyLines.push(line);
    cursor += 1;
  }

  const contentLines = trimNonEmptyLines(bodyLines);

  if (type === 'callout') {
    if (contentLines.length === 0) {
      return {
        block: { type: 'callout', title: null, body: '' },
        nextIndex: cursor,
      };
    }

    if (contentLines.length === 1) {
      return {
        block: { type: 'callout', title: null, body: contentLines[0] },
        nextIndex: cursor,
      };
    }

    return {
      block: {
        type: 'callout',
        title: contentLines[0],
        body: contentLines.slice(1).join(' '),
      },
      nextIndex: cursor,
    };
  }

  if (type === 'pullquote') {
    let attribution: string | null = null;
    const quoteLines = [...contentLines];
    const lastLine = quoteLines.at(-1);

    if (lastLine && /^[-—]\s*/.test(lastLine)) {
      attribution = lastLine.replace(/^[-—]\s*/, '');
      quoteLines.pop();
    }

    return {
      block: {
        type: 'pullquote',
        quote: quoteLines.join(' '),
        attribution,
      },
      nextIndex: cursor,
    };
  }

  if (type === 'pros' || type === 'cons') {
    const items = contentLines.map((line) => line.replace(/^[-*]\s+/, '')).filter(Boolean);

    return {
      block: {
        type,
        title: type === 'pros' ? 'Pros' : 'Cons',
        items,
      },
      nextIndex: cursor,
    };
  }

  const rows: Array<{ label: string; value: string }> = [];
  let title = 'Comparison card';

  contentLines.forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      if (title === 'Comparison card') {
        title = line;
      } else {
        rows.push({ label: `Detail ${rows.length + 1}`, value: line });
      }
      return;
    }

    const label = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!label || !value) {
      return;
    }

    if (label.toLowerCase() === 'title') {
      title = value;
      return;
    }

    rows.push({ label, value });
  });

  return {
    block: {
      type: 'comparison',
      title,
      rows,
    },
    nextIndex: cursor,
  };
}
