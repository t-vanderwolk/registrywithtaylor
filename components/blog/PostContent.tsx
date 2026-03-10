'use client';

import type { AffiliateNetwork } from '@prisma/client';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import BlogAffiliateCTA from '@/components/blog/BlogAffiliateCTA';
import BlogContent from '@/components/blog/BlogContent';
import BlogDivider from '@/components/blog/BlogDivider';
import ProductRecommendationCard from '@/components/blog/ProductRecommendationCard';
import PullQuote from '@/components/blog/PullQuote';
import { Body } from '@/components/ui/MarketingHeading';
import {
  extractStoredCtaButtons,
  parseCtaSlotLine,
  type CtaButton as StoredCtaButton,
} from '@/lib/blog/ctaButtons';
import {
  isStyledBlockStart,
  parseStyledBlock,
  type ParsedStyledBlock,
} from '@/lib/blog/styledBlocks';

type PostContentProps = {
  postId: string;
  content: string;
  className?: string;
  trackView?: boolean;
  ctaPartners?: Record<
    string,
    {
      id: string;
      slug: string;
      name: string;
      network: AffiliateNetwork;
      logoUrl: string | null;
      baseUrl: string | null;
      affiliatePid: string | null;
    }
  >;
};

type CtaButtonVariant = 'primary' | 'secondary' | 'text';

type LegacyCtaButtonBlock = {
  type: 'ctaButton';
  label: string;
  url: string;
  variant?: CtaButtonVariant;
};

const orderedListPattern = /^\d+\.\s+/;
const imageLinePattern = /^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)$/;
const inlineTokenPattern =
  /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/;
const CTA_BUTTON_PREFIX = '::cta-button ';

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const opensNewTab = (href: string) => isExternalHref(href) || /\.pdf(?:[?#].*)?$/i.test(href);
const isDividerLine = (line: string) => line === '---' || line === '***';
const isQuoteLine = (line: string) => line.startsWith('>');

function normalizeCtaVariant(value: unknown): CtaButtonVariant {
  if (value === 'secondary' || value === 'text') {
    return value;
  }

  return 'primary';
}

function isLegacyCtaButtonBlock(value: unknown): value is LegacyCtaButtonBlock {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<LegacyCtaButtonBlock>;
  return candidate.type === 'ctaButton' && typeof candidate.label === 'string' && typeof candidate.url === 'string';
}

function parseLegacyCtaButtonLine(line: string) {
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
    if (!isLegacyCtaButtonBlock(parsed)) {
      return null;
    }

    return {
      type: 'ctaButton',
      label: parsed.label.trim(),
      url: parsed.url.trim(),
      variant: normalizeCtaVariant(parsed.variant),
    } satisfies LegacyCtaButtonBlock;
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

function renderStoredCtaButtons(
  buttons: StoredCtaButton[],
  keyPrefix: string,
  postId: string,
  ctaPartners: PostContentProps['ctaPartners'],
) {
  if (buttons.length === 0) {
    return null;
  }

  return (
    <div key={keyPrefix} className="my-8 flex flex-wrap items-center gap-3">
      {buttons.map((button, index) => (
        <BlogAffiliateCTA
          key={`${keyPrefix}-${button.id}-${index}`}
          postId={postId}
          ctaText={button.label}
          destinationUrl={button.url}
          variant={button.variant}
          partner={(button.partnerId ? ctaPartners?.[button.partnerId] : null) ?? null}
        />
      ))}
    </div>
  );
}

function renderStyledBlock(block: ParsedStyledBlock, postId: string, index: number) {
  if (block.type === 'callout') {
    return (
      <div
        key={`${postId}-callout-${index}`}
        className="blog-section-soft my-10 px-6 py-5"
      >
        {block.title ? (
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">{block.title}</p>
        ) : null}
        <Body className="text-charcoal/85">{renderInlineContent(block.body, `${postId}-callout-inline-${index}`)}</Body>
      </div>
    );
  }

  if (block.type === 'advice') {
    return (
      <div
        key={`${postId}-advice-${index}`}
        className="tmbc-blog-soft-card my-10 border-l-4 border-l-[var(--tmbc-blog-blush)] px-6 py-5"
      >
        {block.title ? (
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">{block.title}</p>
        ) : null}
        <Body className="text-charcoal/85">{renderInlineContent(block.body, `${postId}-advice-inline-${index}`)}</Body>
      </div>
    );
  }

  if (block.type === 'pullquote') {
    return (
      <figure key={`${postId}-pullquote-${index}`} className="my-12">
        <PullQuote>“{block.quote}”</PullQuote>
        {block.attribution ? (
          <figcaption className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-600">
            {block.attribution}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === 'pros' || block.type === 'cons') {
    const isPros = block.type === 'pros';
    return (
      <section
        key={`${postId}-${block.type}-${index}`}
        className={`my-10 rounded-[28px] border px-6 py-5 ${
          isPros
            ? 'border-[rgba(184,116,138,0.2)] bg-[rgba(243,227,232,0.6)]'
            : 'border-[rgba(107,103,104,0.18)] bg-white'
        }`}
      >
        <p
          className={`mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${
            isPros ? 'text-[var(--tmbc-blog-rose)]' : 'text-[var(--tmbc-blog-soft-text)]'
          }`}
        >
          {block.title}
        </p>
        <ul className="space-y-3 text-[1.02rem] leading-relaxed text-charcoal/85">
          {block.items.map((item, itemIndex) => (
            <li key={`${postId}-${block.type}-${index}-${itemIndex}`} className="flex items-start gap-3">
              <span className="mt-1 text-sm text-neutral-900">{isPros ? '+' : '−'}</span>
              <span>{renderInlineContent(item, `${postId}-${block.type}-inline-${index}-${itemIndex}`)}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === 'comparison') {
    return (
      <section key={`${postId}-comparison-${index}`} className="tmbc-blog-soft-card my-10 px-6 py-5">
        <h3 className="font-serif text-[1.45rem] tracking-[-0.02em] text-neutral-900">{block.title}</h3>
        {block.rows.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {block.rows.map((row, rowIndex) => (
              <div
                key={`${postId}-comparison-row-${index}-${rowIndex}`}
                className="rounded-[22px] border border-[rgba(215,161,175,0.2)] bg-white px-4 py-3"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">{row.label}</p>
                <Body className="mt-2 text-charcoal/85">
                  {renderInlineContent(row.value, `${postId}-comparison-inline-${index}-${rowIndex}`)}
                </Body>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  if (block.type === 'product') {
    return (
      <div key={`${postId}-product-${index}`} className="my-10">
        <ProductRecommendationCard
          brand={block.brand}
          productName={block.productName}
          shortReview={block.shortReview}
          pros={block.pros}
          bestFor={block.bestFor}
          standout={block.standout}
          affiliateLinks={block.affiliateLinks}
        />
      </div>
    );
  }

  return null;
}

export default function PostContent({
  postId,
  content,
  className,
  trackView = true,
  ctaPartners = {},
}: PostContentProps) {
  useEffect(() => {
    if (!trackView) {
      return undefined;
    }

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
  }, [postId, trackView]);

  const storedButtons = extractStoredCtaButtons(content);
  const storedButtonMap = new Map(storedButtons.buttons.map((button) => [button.id, button]));
  const articleContent = storedButtons.body;

  return (
    <BlogContent className={className ?? ''}>
      {(() => {
        const nodes: ReactNode[] = [];
        const lines = articleContent.split('\n');
        let i = 0;
        let paragraphCount = 0;
        let h2Count = 0;
        const slottedButtonIds = new Set<string>();

        while (i < lines.length) {
          const line = lines[i]?.trim() ?? '';

          if (!line) {
            i += 1;
            continue;
          }

          if (line.startsWith('## ')) {
            if (h2Count > 0) {
              nodes.push(<BlogDivider key={`${postId}-divider-${i}`} />);
            }

            nodes.push(
              <h2 key={`${postId}-h2-${i}`} className="text-[var(--tmbc-blog-charcoal)]">
                {renderInlineContent(line.replace(/^##\s+/, ''), `${postId}-h2-inline-${i}`)}
              </h2>,
            );
            h2Count += 1;
            i += 1;
            continue;
          }

          if (line.startsWith('### ')) {
            nodes.push(
              <h3 key={`${postId}-h3-${i}`} className="text-[var(--tmbc-blog-charcoal)]">
                {renderInlineContent(line.replace(/^###\s+/, ''), `${postId}-h3-inline-${i}`)}
              </h3>,
            );
            i += 1;
            continue;
          }

          const styledBlock = parseStyledBlock(lines, i);
          if (styledBlock) {
            nodes.push(renderStyledBlock(styledBlock.block, postId, i));
            i = styledBlock.nextIndex;
            continue;
          }

          if (isDividerLine(line)) {
            nodes.push(<BlogDivider key={`${postId}-rule-${i}`} />);
            i += 1;
            continue;
          }

          const ctaSlotId = parseCtaSlotLine(line);
          if (ctaSlotId) {
            const button = storedButtonMap.get(ctaSlotId);
            if (button) {
              nodes.push(renderStoredCtaButtons([button], `${postId}-stored-slot-${i}`, postId, ctaPartners));
              slottedButtonIds.add(button.id);
            }
            i += 1;
            continue;
          }

          const legacyCtaButton = parseLegacyCtaButtonLine(line);
          if (legacyCtaButton) {
            nodes.push(
              <div key={`${postId}-legacy-cta-${i}`} className="my-8">
                <BlogAffiliateCTA
                  postId={postId}
                  ctaText={legacyCtaButton.label}
                  destinationUrl={legacyCtaButton.url}
                  variant={legacyCtaButton.variant}
                />
              </div>,
            );
            i += 1;
            continue;
          }

          if (isQuoteLine(line)) {
            const quoteLines: string[] = [];

            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!isQuoteLine(candidate)) {
                break;
              }

              quoteLines.push(candidate.replace(/^>\s?/, ''));
              i += 1;
            }

            nodes.push(
              <PullQuote key={`${postId}-quote-${i}`}>
                {renderInlineContent(quoteLines.join(' '), `${postId}-quote-inline-${i}`)}
              </PullQuote>,
            );
            continue;
          }

          const imageLineMatch = line.match(imageLinePattern);
          if (imageLineMatch) {
            const [, altText, src, title] = imageLineMatch;
            const imageDescription = altText || title || '';
            nodes.push(
              <figure key={`${postId}-img-${i}`}>
                <img
                  src={src}
                  alt={imageDescription}
                  loading="lazy"
                />
                {imageDescription && (
                  <figcaption>
                    {imageDescription}
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
              isStyledBlockStart(candidate) ||
              isDividerLine(candidate) ||
              isQuoteLine(candidate) ||
              Boolean(parseLegacyCtaButtonLine(candidate)) ||
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
              <p key={`${postId}-p-${i}`} className={paragraphCount === 1 ? 'text-charcoal/85' : 'text-charcoal/85'}>
                {renderInlineContent(paragraphLines.join(' '), `${postId}-p-inline-${i}`)}
              </p>,
            );
          }
        }

        return nodes;
      })()}
    </BlogContent>
  );
}
