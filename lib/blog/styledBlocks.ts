export type StyledBlockId = 'callout' | 'advice' | 'pullquote' | 'pros' | 'cons' | 'comparison' | 'product';

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
      type: 'advice';
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
    }
  | {
      type: 'product';
      brand: string;
      productName: string;
      shortReview: string;
      pros: string[];
      bestFor: string;
      standout: string | null;
      affiliateLinks: Array<{ label: string; url: string }>;
    };

const STYLED_BLOCK_OPEN_PATTERN = /^:::(callout|advice|pullquote|quote|pros|cons|comparison|product)\s*$/i;
const STYLED_BLOCK_CLOSE = ':::';

function trimNonEmptyLines(lines: string[]) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

export const STYLED_BLOCKS: StyledBlockDefinition[] = [
  {
    id: 'callout',
    label: 'Intro Block',
    description: 'A highlighted opening note for the warm, calm thesis at the top of the post.',
    snippet: `:::callout
Relatable observation
Lead with the human observation that frames the rest of the article.
:::`,
  },
  {
    id: 'advice',
    label: 'Advice Block',
    description: 'A practical guidance box for calm authority and direct recommendations.',
    snippet: `:::advice
Expert insight
Name the clearest recommendation and the real-world reasoning behind it.
:::`,
  },
  {
    id: 'pullquote',
    label: 'Quote Block',
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
    label: 'Comparison Block',
    description: 'A compact profile card for an option inside a roundup or comparison post.',
    snippet: `:::comparison
Title: Option name
Best for: Busy families who want the simplest daily setup
Standout: Name the strongest reason to choose it
Watchout: Name the main tradeoff or caveat
:::`,
  },
  {
    id: 'product',
    label: 'Product Recommendation',
    description: 'A structured product card with pros, best-for guidance, and one or more affiliate links.',
    snippet: `:::product
Brand: Bugaboo
Product: Fox 5
Review: A premium all-terrain stroller that still feels manageable day to day.
Best for: Families who want one stroller that can handle neighborhood walks and rougher paths.
Standout: Suspension + smooth maneuverability
Pros: Easy push | Large basket | Feels sturdy
Link: Shop at Albee Baby | https://example.com/bugaboo
Link: Shop at Amazon | https://example.com/amazon-bugaboo
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

  const rawType = match[1].toLowerCase();
  const type = (rawType === 'quote' ? 'pullquote' : rawType) as StyledBlockId;
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

  if (type === 'callout' || type === 'advice') {
    if (contentLines.length === 0) {
      return {
        block: { type, title: null, body: '' },
        nextIndex: cursor,
      };
    }

    if (contentLines.length === 1) {
      return {
        block: { type, title: null, body: contentLines[0] },
        nextIndex: cursor,
      };
    }

    return {
      block: {
        type,
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

  if (type === 'product') {
    let brand = 'Brand';
    let productName = 'Recommended product';
    let shortReview = 'A practical recommendation chosen for this guide.';
    let bestFor = 'Parents who want the clearest fit for this category.';
    let standout: string | null = null;
    const pros: string[] = [];
    const affiliateLinks: Array<{ label: string; url: string }> = [];

    contentLines.forEach((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) {
        return;
      }

      const label = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();

      if (!value) {
        return;
      }

      if (label === 'brand') {
        brand = value;
        return;
      }

      if (label === 'product' || label === 'product name' || label === 'title') {
        productName = value;
        return;
      }

      if (label === 'review' || label === 'short review') {
        shortReview = value;
        return;
      }

      if (label === 'best for') {
        bestFor = value;
        return;
      }

      if (label === 'standout') {
        standout = value;
        return;
      }

      if (label === 'pros' || label === 'pro') {
        value
          .split('|')
          .map((entry) => entry.trim())
          .filter(Boolean)
          .forEach((entry) => pros.push(entry));
        return;
      }

      if (label === 'link' || label === 'affiliate link' || label === 'shop') {
        const [linkLabel, linkUrl] = value.split('|').map((entry) => entry.trim());
        if (!linkUrl && /^(https?:\/\/|\/)/i.test(linkLabel)) {
          affiliateLinks.push({ label: 'Shop now', url: linkLabel });
          return;
        }

        if (linkLabel && linkUrl && /^(https?:\/\/|\/)/i.test(linkUrl)) {
          affiliateLinks.push({ label: linkLabel, url: linkUrl });
        }
      }
    });

    return {
      block: {
        type: 'product',
        brand,
        productName,
        shortReview,
        pros,
        bestFor,
        standout,
        affiliateLinks,
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
