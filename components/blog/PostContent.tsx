'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';

type PostContentProps = {
  postId: string;
  content: string;
  className?: string;
};

type CtaButtonVariant = 'primary' | 'secondary';

type CtaButtonBlock = {
  type: 'ctaButton';
  label: string;
  url: string;
  variant?: CtaButtonVariant;
};

const orderedListPattern = /^\d+\.\s+/;
const imageLinePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const inlineTokenPattern =
  /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/;
const CTA_BUTTON_PREFIX = '::cta-button ';
const CTA_BUTTON_FOCUS_CLASS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const opensNewTab = (href: string) => isExternalHref(href) || /\.pdf(?:[?#].*)?$/i.test(href);

function normalizeCtaVariant(value: unknown): CtaButtonVariant {
  return value === 'secondary' ? 'secondary' : 'primary';
}

function isCtaButtonBlock(value: unknown): value is CtaButtonBlock {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CtaButtonBlock>;
  return candidate.type === 'ctaButton' && typeof candidate.label === 'string' && typeof candidate.url === 'string';
}

function parseCtaButtonLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith(CTA_BUTTON_PREFIX)) {
    return null;
  }

  const rawPayload = trimmed.slice(CTA_BUTTON_PREFIX.length).trim();
  if (!rawPayload) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawPayload) as unknown;
    if (!isCtaButtonBlock(parsed)) {
      return null;
    }

    return {
      type: 'ctaButton',
      label: parsed.label.trim(),
      url: parsed.url.trim(),
      variant: normalizeCtaVariant(parsed.variant),
    } satisfies CtaButtonBlock;
  } catch {
    return null;
  }
}

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
          className="link-underline transition-colors duration-200 hover:text-neutral-900"
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
              <H2
                key={`${postId}-h2-${i}`}
                className="mt-16 mb-6 font-serif text-neutral-900"
              >
                {renderInlineContent(line.replace(/^##\s+/, ''), `${postId}-h2-inline-${i}`)}
              </H2>,
            );
            h2Count += 1;
            i += 1;
            continue;
          }

          if (line.startsWith('### ')) {
            nodes.push(
              <H3
                key={`${postId}-h3-${i}`}
                className="mt-12 mb-4 font-serif tracking-tight text-neutral-900"
              >
                {renderInlineContent(line.replace(/^###\s+/, ''), `${postId}-h3-inline-${i}`)}
              </H3>,
            );
            i += 1;
            continue;
          }

          const ctaButtonBlock = parseCtaButtonLine(line);
          if (ctaButtonBlock) {
            if (ctaButtonBlock.url) {
              nodes.push(
                <div key={`${postId}-cta-${i}`} className="my-8">
                  <a
                    href={ctaButtonBlock.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={
                      ctaButtonBlock.variant === 'secondary'
                        ? `btn btn--secondary ${CTA_BUTTON_FOCUS_CLASS}`
                        : `btn btn--primary ${CTA_BUTTON_FOCUS_CLASS}`
                    }
                  >
                    {ctaButtonBlock.label}
                  </a>
                </div>,
              );
            }
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
                  className="w-full rounded-2xl shadow-sm"
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
              Boolean(parseCtaButtonLine(candidate)) ||
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
              <Body
                key={`${postId}-p-${i}`}
                className={
                  paragraphCount === 1
                    ? 'text-charcoal/85'
                    : 'mt-6 text-charcoal/85'
                }
              >
                {renderInlineContent(paragraphLines.join(' '), `${postId}-p-inline-${i}`)}
              </Body>,
            );
          }
        }

        return nodes;
      })()}
    </div>
  );
}
