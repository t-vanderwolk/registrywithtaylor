import type { ReactNode } from 'react';
import InternalLink from '@/components/content/InternalLink';
import type { ContextualInternalLink } from '@/lib/internal-links/types';

type RenderTextWithInternalLinksInput = {
  text: string;
  suggestions: ContextualInternalLink[];
  usedHrefs: Set<string>;
  keyPrefix: string;
  className?: string;
  maxLinks?: number;
  placement?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSentenceChunks(text: string) {
  return text.match(/[^.!?]+[.!?]*\s*|.+$/g) ?? [text];
}

function getMatchForSuggestion(text: string, suggestion: ContextualInternalLink) {
  const sortedAnchors = [...suggestion.anchors]
    .map((anchor) => anchor.trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  for (const anchor of sortedAnchors) {
    const match = new RegExp(`(^|[^\\w/])(${escapeRegExp(anchor)})(?=[^\\w-]|$)`, 'i').exec(text);
    if (match && match.index !== undefined) {
      const offset = match[1]?.length ?? 0;
      return {
        anchor,
        index: match.index + offset,
        matchedText: match[2] ?? anchor,
      };
    }
  }

  return null;
}

export function renderTextWithInternalLinks({
  text,
  suggestions,
  usedHrefs,
  keyPrefix,
  className,
  maxLinks = 2,
  placement = 'inline',
}: RenderTextWithInternalLinksInput): ReactNode[] {
  if (!text.trim() || suggestions.length === 0) {
    return [text];
  }

  let insertedLinks = 0;

  return getSentenceChunks(text).flatMap((chunk, chunkIndex) => {
    if (!chunk.trim() || insertedLinks >= maxLinks) {
      return [chunk];
    }

    const availableSuggestions = [...suggestions]
      .filter((suggestion) => !usedHrefs.has(suggestion.href))
      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));

    for (const suggestion of availableSuggestions) {
      const match = getMatchForSuggestion(chunk, suggestion);

      if (!match) {
        continue;
      }

      const before = chunk.slice(0, match.index);
      const after = chunk.slice(match.index + match.matchedText.length);
      usedHrefs.add(suggestion.href);
      insertedLinks += 1;

      return [
        before,
        <InternalLink
          key={`${keyPrefix}-${chunkIndex}-${suggestion.href}`}
          href={suggestion.href}
          anchorText={match.matchedText}
          destinationKind={suggestion.kind}
          placement={placement}
          className={className}
        >
          {match.matchedText}
        </InternalLink>,
        after,
      ];
    }

    return [chunk];
  });
}
