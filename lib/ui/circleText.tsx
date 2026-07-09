import type { ReactNode } from 'react';

/**
 * TMBC signature body annotations, available site-wide (marketing pages + blog).
 *
 *   (( word ))       → hand-drawn pink circle around a word or short phrase.
 *   [[ sentence ]]   → pink underline (same colour + weight as the circle) that
 *                      follows line wraps, for standout sentences too long to circle.
 *
 * Spaces INSIDE the brackets are required: `(( word ))` is correct, `((word))` is
 * not (it renders as plain text). Body copy only: wired into MarketingHeading's
 * Body (not headings), so it renders in paragraphs, never in a hero or heading.
 * Non-string nodes pass through untouched. Do NOT wrap an already bold/italic word.
 */
const ANNOTATION_RE = /\(\(\s+(.+?)\s+\)\)|\[\[\s+(.+?)\s+\]\]/g;

export function annotate(node: ReactNode): ReactNode {
  if (typeof node !== 'string' || (!node.includes('((') && !node.includes('[['))) return node;

  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  ANNOTATION_RE.lastIndex = 0;

  while ((match = ANNOTATION_RE.exec(node)) !== null) {
    if (match.index > lastIndex) out.push(node.slice(lastIndex, match.index));

    const circle = match[1];
    const underline = match[2];

    if (circle !== undefined) {
      out.push(
        <span key={`tmbc-circle-${key++}`} className="tmbc-circle">
          {circle}
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
    } else if (underline !== undefined) {
      out.push(
        <span key={`tmbc-underline-${key++}`} className="tmbc-underline">
          {underline}
        </span>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < node.length) out.push(node.slice(lastIndex));
  return out;
}

/** @deprecated use `annotate` — kept as an alias during migration. */
export const circleText = annotate;
