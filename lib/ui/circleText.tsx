import type { ReactNode } from 'react';

/**
 * TMBC signature body annotations, available site-wide (marketing pages + blog).
 *
 *   (( word ))       → hand-drawn pink circle around a word or short phrase.
 *   [[ sentence ]]   → pink underline (same colour + weight as the circle) that
 *                      follows line wraps + sweeps in left→right on scroll.
 *   **bold**  *italic*
 *
 * Styles NEST: `(( **word** ))`, `[[ a **bold** sentence ]]`, and `**(( word ))**`
 * all work — inner content is parsed recursively. Spaces INSIDE the circle/
 * underline brackets are required: `(( word ))` is correct, `((word))` is not.
 * Body copy only (wired into MarketingHeading's Body, never a hero or heading).
 */
const TOKEN_RE = /\*\*(.+?)\*\*|\(\(\s+(.+?)\s+\)\)|\[\[\s+(.+?)\s+\]\]|\*(.+?)\*/g;

export function annotate(node: ReactNode, depth = 0): ReactNode {
  if (typeof node !== 'string') return node;
  if (depth > 6 || (!node.includes('*') && !node.includes('((') && !node.includes('[['))) return node;

  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(node)) !== null) {
    if (match.index > lastIndex) out.push(node.slice(lastIndex, match.index));

    const [, bold, circle, underline, italic] = match;
    const k = `tmbc-a-${depth}-${key++}`;

    if (bold !== undefined) {
      out.push(
        <strong key={k} className="font-semibold text-neutral-900">
          {annotate(bold, depth + 1)}
        </strong>,
      );
    } else if (circle !== undefined) {
      out.push(
        <span key={k} className="tmbc-circle">
          {annotate(circle, depth + 1)}
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
        <span key={k} className="tmbc-underline">
          {annotate(underline, depth + 1)}
        </span>,
      );
    } else if (italic !== undefined) {
      out.push(
        <em key={k} className="italic">
          {annotate(italic, depth + 1)}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < node.length) out.push(node.slice(lastIndex));
  return out;
}

/** @deprecated use `annotate` — kept as an alias during migration. */
export const circleText = annotate;
