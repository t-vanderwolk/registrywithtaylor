import type { ReactNode } from 'react';

/**
 * TMBC signature "circle a word" annotation, available site-wide.
 *
 * Any string wrapped in double parentheses — `((word))` or `(( a short phrase ))` —
 * renders with a hand-drawn pink loop around it (the same mark used in blog posts).
 * Non-string nodes pass through untouched, so it is safe to run on any children.
 *
 * Usage: wrap the text where it renders, e.g. `<H2>{circleText(heading)}</H2>` —
 * already wired into MarketingHeading (H1/H2/H3/Body/Eyebrow) and the Hero title,
 * subtitle, and eyebrow, so authors can just type `((word))` in the copy.
 */
const CIRCLE_RE = /\(\(\s*(.+?)\s*\)\)/g;

export function circleText(node: ReactNode): ReactNode {
  if (typeof node !== 'string' || !node.includes('((')) return node;

  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  CIRCLE_RE.lastIndex = 0;

  while ((match = CIRCLE_RE.exec(node)) !== null) {
    if (match.index > lastIndex) out.push(node.slice(lastIndex, match.index));
    out.push(
      <span key={`tmbc-circle-${key++}`} className="tmbc-circle">
        {match[1]}
        <svg
          className="tmbc-circle__mark"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6,20 C4,9 27,4 50,4 C75,4 97,8 96,19 C95,32 70,37 47,36 C21,35 5,31 6,18" />
        </svg>
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < node.length) out.push(node.slice(lastIndex));
  return out;
}
