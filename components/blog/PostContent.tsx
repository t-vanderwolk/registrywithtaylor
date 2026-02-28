'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

type PostContentProps = {
  postId: string;
  content: string;
  className?: string;
};

const orderedListPattern = /^\d+\.\s+/;
const imageLinePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const inlineTokenPattern =
  /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/;

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const opensNewTab = (href: string) => isExternalHref(href) || /\.pdf(?:[?#].*)?$/i.test(href);

function renderInlineContent(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let tokenIndex = 0;

  while (remaining.length > 0) {
    const match = remaining.match(inlineTokenPattern);

    if (!match || match.index === undefined) {
      nodes.push(remaining);
      break;
    }

    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const [
      fullMatch,
      ,
      linkLabel,
      linkHref,
      strongA,
      strongB,
      code,
      emphasisA,
      emphasisB,
    ] = match;
    const key = `${keyPrefix}-${tokenIndex}`;

    if (linkLabel && linkHref) {
      nodes.push(
        <a
          key={key}
          href={linkHref}
          target={opensNewTab(linkHref) ? '_blank' : undefined}
          rel={opensNewTab(linkHref) ? 'noreferrer' : undefined}
          className="underline decoration-black/15 underline-offset-4 transition-colors duration-200 hover:text-neutral-900 hover:decoration-black/35"
        >
          {linkLabel}
        </a>,
      );
    } else if (strongA || strongB) {
      nodes.push(
        <strong key={key} className="font-semibold text-neutral-900">
          {strongA ?? strongB}
        </strong>,
      );
    } else if (code) {
      nodes.push(
        <code key={key} className="rounded bg-black/[0.04] px-1.5 py-0.5 text-[0.95em] text-neutral-900">
          {code}
        </code>,
      );
    } else if (emphasisA || emphasisB) {
      nodes.push(
        <em key={key} className="italic text-charcoal/80">
          {emphasisA ?? emphasisB}
        </em>,
      );
    } else {
      nodes.push(fullMatch);
    }

    remaining = remaining.slice(match.index + fullMatch.length);
    tokenIndex += 1;
  }

  return nodes;
}

export default function PostContent({ postId, content, className }: PostContentProps) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/blog/${postId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'view' }),
      signal: controller.signal,
    }).catch(() => {
      // silently ignore tracking failures
    });

    return () => controller.abort();
  }, [postId]);

  return (
    <div className={className ?? 'body-copy'}>
      {(() => {
        const nodes: ReactNode[] = [];
        const lines = content.split('\n');
        let i = 0;
        let paragraphCount = 0;
        let h2Count = 0;

        while (i < lines.length) {
          const line = lines[i]?.trim() ?? '';

          if (!line) {
            i += 1;
            continue;
          }

          if (line.startsWith('## ')) {
            if (h2Count > 0) {
              nodes.push(
                <div
                  key={`${postId}-divider-${i}`}
                  className="my-16 border-t border-black/10"
                />,
              );
            }

            nodes.push(
              <h2
                key={`${postId}-h2-${i}`}
                className="mt-16 mb-6 font-serif text-2xl md:text-3xl tracking-tight text-neutral-900"
              >
                {renderInlineContent(line.replace(/^##\s+/, ''), `${postId}-h2-inline-${i}`)}
              </h2>,
            );
            h2Count += 1;
            i += 1;
            continue;
          }

          if (line.startsWith('### ')) {
            nodes.push(
              <h3
                key={`${postId}-h3-${i}`}
                className="mt-12 mb-4 font-serif text-xl md:text-2xl tracking-tight text-neutral-900"
              >
                {renderInlineContent(line.replace(/^###\s+/, ''), `${postId}-h3-inline-${i}`)}
              </h3>,
            );
            i += 1;
            continue;
          }

          const imageLineMatch = line.match(imageLinePattern);
          if (imageLineMatch) {
            const [, altText, src] = imageLineMatch;
            nodes.push(
              <figure key={`${postId}-img-${i}`} className="mt-10 space-y-3">
                <img
                  src={src}
                  alt={altText}
                  className="w-full rounded-2xl border border-black/5 shadow-sm"
                  loading="lazy"
                />
                {altText && (
                  <figcaption className="text-sm leading-relaxed text-charcoal/60">
                    {altText}
                  </figcaption>
                )}
              </figure>,
            );
            i += 1;
            continue;
          }

          if (line.startsWith('# ')) {
            i += 1;
            continue;
          }

          if (line.startsWith('- ')) {
            const items: string[] = [];
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!candidate.startsWith('- ')) break;
              items.push(candidate.replace(/^-+\s+/, ''));
              i += 1;
            }

            nodes.push(
              <ul
                key={`${postId}-ul-${i}`}
                className="mt-8 ml-6 list-disc space-y-3 text-[1.05rem] leading-relaxed text-charcoal/85"
              >
                {items.map((item, index) => (
                  <li key={`${postId}-ul-${i}-${index}`} className="pl-1">
                    {renderInlineContent(item, `${postId}-ul-inline-${i}-${index}`)}
                  </li>
                ))}
              </ul>,
            );
            continue;
          }

          if (orderedListPattern.test(line)) {
            const items: string[] = [];
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!orderedListPattern.test(candidate)) break;
              items.push(candidate.replace(/^\d+\.\s+/, ''));
              i += 1;
            }

            nodes.push(
              <ol
                key={`${postId}-ol-${i}`}
                className="mt-8 ml-6 list-decimal space-y-3 text-[1.05rem] leading-relaxed text-charcoal/85"
              >
                {items.map((item, index) => (
                  <li key={`${postId}-ol-${i}-${index}`} className="pl-1">
                    {renderInlineContent(item, `${postId}-ol-inline-${i}-${index}`)}
                  </li>
                ))}
              </ol>,
            );
            continue;
          }

          const paragraphLines: string[] = [];
          while (i < lines.length) {
            const candidate = lines[i]?.trim() ?? '';
            if (
              !candidate ||
              candidate.startsWith('# ') ||
              candidate.startsWith('## ') ||
              candidate.startsWith('### ') ||
              imageLinePattern.test(candidate) ||
              candidate.startsWith('- ') ||
              orderedListPattern.test(candidate)
            ) {
              break;
            }
            paragraphLines.push(candidate);
            i += 1;
          }

          if (paragraphLines.length > 0) {
            paragraphCount += 1;
            nodes.push(
              <p
                key={`${postId}-p-${i}`}
                className={
                  paragraphCount === 1
                    ? 'text-[1.05rem] leading-relaxed text-charcoal/85'
                    : 'mt-6 text-[1.05rem] leading-relaxed text-charcoal/85'
                }
              >
                {renderInlineContent(paragraphLines.join(' '), `${postId}-p-inline-${i}`)}
              </p>,
            );
          }
        }

        return nodes;
      })()}
    </div>
  );
}
