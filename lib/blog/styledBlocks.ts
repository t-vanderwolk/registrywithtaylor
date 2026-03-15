export type StyledBlockId =
  | 'callout'
  | 'advice'
  | 'pullquote'
  | 'pros'
  | 'cons'
  | 'comparison'
  | 'product'
  | 'faq'
  | 'decision'
  | 'takeaways';

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
      type: 'pros' | 'cons' | 'takeaways';
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
      imageUrl: string | null;
      imageAlt: string | null;
    }
  | {
      type: 'faq';
      question: string;
      answer: string;
    }
  | {
      type: 'decision';
      question: string;
      option: string;
      result: string;
    };

const STYLED_BLOCK_OPEN_PATTERN =
  /^:::(callout|advice|pullquote|quote|pros|cons|comparison|product|faq|decision|takeaways)\s*$/i;
const STYLED_BLOCK_CLOSE = ':::';

function trimNonEmptyLines(lines: string[]) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function normalizeBlockType(rawType: string) {
  return (rawType.toLowerCase() === 'quote' ? 'pullquote' : rawType.toLowerCase()) as StyledBlockId;
}

function parseKeyValueLine(line: string) {
  const separatorIndex = line.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  const label = line.slice(0, separatorIndex).trim();
  const value = line.slice(separatorIndex + 1).trim();
  if (!label || !value) {
    return null;
  }

  return {
    label,
    normalizedLabel: label.toLowerCase(),
    value,
  };
}

function parseListItems(lines: string[]) {
  return lines.map((line) => line.replace(/^[-*]\s+/, '')).filter(Boolean);
}

export const STYLED_BLOCKS: StyledBlockDefinition[] = [
  {
    id: 'callout',
    label: 'Callout',
    description: 'A highlighted note for framing the real decision or the main shift in the guide.',
    snippet: `:::callout
Lead with the warm, grounded observation that helps the reader understand what actually matters here.
:::`,
  },
  {
    id: 'advice',
    label: 'Advice',
    description: 'A practical recommendation block for direct editorial guidance.',
    snippet: `:::advice
Taylor's take
Name the clearest recommendation and the real-world reasoning behind it.
:::`,
  },
  {
    id: 'pullquote',
    label: 'Pull Quote',
    description: 'A large serif quote to spotlight the most memorable line in the section.',
    snippet: `:::pullquote
The product you can use half asleep usually beats the product with the longest spec sheet.
— Taylor-Made Baby Co.
:::`,
  },
  {
    id: 'pros',
    label: 'Pros',
    description: 'A visual strengths list for a product, option, or recommendation.',
    snippet: `:::pros
- Easy everyday use
- Clear standout feature
- Worth the price for the right family
:::`,
  },
  {
    id: 'cons',
    label: 'Cons',
    description: 'A visual tradeoff list for caveats, compromises, or watchouts.',
    snippet: `:::cons
- Higher price point
- Takes more trunk space
- Better for one use case than another
:::`,
  },
  {
    id: 'comparison',
    label: 'Comparison',
    description: 'A responsive comparison card for side-by-side option framing.',
    snippet: `:::comparison
Title: Everyday fit snapshot
Best for: Families who want the simplest daily setup
Standout: Name the strongest reason to choose it
Watchout: Name the main tradeoff honestly
:::`,
  },
  {
    id: 'product',
    label: 'Product',
    description: 'A product card with review copy, pros, and CTA links.',
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
  {
    id: 'faq',
    label: 'FAQ',
    description: 'A structured FAQ block that also feeds FAQ schema.',
    snippet: `:::faq
Question: What actually matters most here?
Answer: Focus on how the product fits your daily routine, not how impressive it sounds in the product description.
:::`,
  },
  {
    id: 'decision',
    label: 'Decision Helper',
    description: 'A quick question-option-result card for simplifying one decision point.',
    snippet: `:::decision
Question: Do you need the lightest option or the one with the smoothest push?
Option: Choose the lighter model if you will lift it into the car constantly.
Result: Day-to-day convenience usually matters more than one premium feature you rarely use.
:::`,
  },
  {
    id: 'takeaways',
    label: 'Takeaways',
    description: 'A concise takeaways block for skimmable wrap-ups and summary sections.',
    snippet: `:::takeaways
- Start with the routine, not the brand.
- Pick the option that removes the most friction.
- Skip features that sound impressive but change very little.
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

  const type = normalizeBlockType(match[1]);
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

  if (type === 'pros' || type === 'cons' || type === 'takeaways') {
    return {
      block: {
        type,
        title: type === 'pros' ? 'Pros' : type === 'cons' ? 'Cons' : 'Key takeaways',
        items: parseListItems(contentLines),
      },
      nextIndex: cursor,
    };
  }

  if (type === 'faq') {
    let question = '';
    const answerLines: string[] = [];
    let activeField: 'question' | 'answer' | null = null;

    contentLines.forEach((line) => {
      const parsedLine = parseKeyValueLine(line);

      if (!parsedLine) {
        if (activeField === 'answer') {
          answerLines.push(line);
        } else if (!question) {
          question = line;
        } else {
          answerLines.push(line);
        }
        return;
      }

      if (parsedLine.normalizedLabel === 'question') {
        question = parsedLine.value;
        activeField = 'question';
        return;
      }

      if (parsedLine.normalizedLabel === 'answer') {
        answerLines.push(parsedLine.value);
        activeField = 'answer';
      }
    });

    return {
      block: {
        type: 'faq',
        question: question || 'Frequently asked question',
        answer: answerLines.join(' '),
      },
      nextIndex: cursor,
    };
  }

  if (type === 'decision') {
    let question = '';
    let option = '';
    const resultLines: string[] = [];
    let activeField: 'question' | 'option' | 'result' | null = null;

    contentLines.forEach((line) => {
      const parsedLine = parseKeyValueLine(line);

      if (!parsedLine) {
        if (activeField === 'result') {
          resultLines.push(line);
        }
        return;
      }

      if (parsedLine.normalizedLabel === 'question') {
        question = parsedLine.value;
        activeField = 'question';
        return;
      }

      if (parsedLine.normalizedLabel === 'option') {
        option = option ? `${option} ${parsedLine.value}` : parsedLine.value;
        activeField = 'option';
        return;
      }

      if (parsedLine.normalizedLabel === 'result') {
        resultLines.push(parsedLine.value);
        activeField = 'result';
      }
    });

    return {
      block: {
        type: 'decision',
        question: question || 'What is the real decision here?',
        option: option || 'Choose the option that reduces the most friction in daily life.',
        result: resultLines.join(' ') || 'The better fit is usually the easier one to live with consistently.',
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
    let imageUrl: string | null = null;
    let imageAlt: string | null = null;
    const pros: string[] = [];
    const affiliateLinks: Array<{ label: string; url: string }> = [];

    contentLines.forEach((line) => {
      const parsedLine = parseKeyValueLine(line);
      if (!parsedLine) {
        return;
      }

      if (parsedLine.normalizedLabel === 'brand') {
        brand = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'product' || parsedLine.normalizedLabel === 'product name' || parsedLine.normalizedLabel === 'title') {
        productName = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'review' || parsedLine.normalizedLabel === 'short review') {
        shortReview = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'best for') {
        bestFor = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'standout') {
        standout = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'image') {
        imageUrl = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'image alt') {
        imageAlt = parsedLine.value;
        return;
      }

      if (parsedLine.normalizedLabel === 'pros' || parsedLine.normalizedLabel === 'pro') {
        parsedLine.value
          .split('|')
          .map((entry) => entry.trim())
          .filter(Boolean)
          .forEach((entry) => pros.push(entry));
        return;
      }

      if (parsedLine.normalizedLabel === 'link' || parsedLine.normalizedLabel === 'affiliate link' || parsedLine.normalizedLabel === 'shop') {
        const [linkLabel, linkUrl] = parsedLine.value.split('|').map((entry) => entry.trim());
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
        imageUrl,
        imageAlt,
      },
      nextIndex: cursor,
    };
  }

  const rows: Array<{ label: string; value: string }> = [];
  let title = 'Comparison card';

  contentLines.forEach((line) => {
    const parsedLine = parseKeyValueLine(line);
    if (!parsedLine) {
      if (title === 'Comparison card') {
        title = line;
      } else {
        rows.push({ label: `Detail ${rows.length + 1}`, value: line });
      }
      return;
    }

    if (parsedLine.normalizedLabel === 'title') {
      title = parsedLine.value;
      return;
    }

    rows.push({ label: parsedLine.label, value: parsedLine.value });
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

export function extractStyledBlocks(content: string) {
  const blocks: ParsedStyledBlock[] = [];
  const lines = content.split('\n');

  for (let index = 0; index < lines.length;) {
    const line = lines[index]?.trim() ?? '';

    if (!line || !isStyledBlockStart(line)) {
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      index += 1;
      continue;
    }

    blocks.push(parsed.block);
    index = parsed.nextIndex;
  }

  return blocks;
}

export function extractWidgetFaqEntries(content: string) {
  return extractStyledBlocks(content)
    .filter((block): block is Extract<ParsedStyledBlock, { type: 'faq' }> => block.type === 'faq')
    .map((block) => ({
      question: block.question.trim(),
      answer: block.answer.trim(),
    }))
    .filter((entry) => entry.question && entry.answer);
}
