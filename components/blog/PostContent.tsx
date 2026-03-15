'use client';

import type { AffiliateNetwork } from '@prisma/client';
import type { ReactNode } from 'react';
import BlogAffiliateCTA from '@/components/blog/BlogAffiliateCTA';
import BlogContent from '@/components/blog/BlogContent';
import BlogDivider from '@/components/blog/BlogDivider';
import Advice from '@/components/content-widgets/Advice';
import Callout from '@/components/content-widgets/Callout';
import Comparison from '@/components/content-widgets/Comparison';
import Cons from '@/components/content-widgets/Cons';
import DecisionHelper from '@/components/content-widgets/DecisionHelper';
import FAQ from '@/components/content-widgets/FAQ';
import ProductCard from '@/components/content-widgets/ProductCard';
import Pros from '@/components/content-widgets/Pros';
import ContentPullQuote from '@/components/content-widgets/PullQuote';
import Takeaways from '@/components/content-widgets/Takeaways';
import { slugify } from '@/lib/slugify';
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

function stripMarkdownFormatting(value: string) {
  return value
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

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
      <Callout
        key={`${postId}-callout-${index}`}
        title={block.title ? renderInlineContent(block.title, `${postId}-callout-title-${index}`) : undefined}
      >
        {renderInlineContent(block.body, `${postId}-callout-inline-${index}`)}
      </Callout>
    );
  }

  if (block.type === 'advice') {
    return (
      <Advice
        key={`${postId}-advice-${index}`}
        title={block.title ? renderInlineContent(block.title, `${postId}-advice-title-${index}`) : undefined}
      >
        {renderInlineContent(block.body, `${postId}-advice-inline-${index}`)}
      </Advice>
    );
  }

  if (block.type === 'pullquote') {
    return (
      <ContentPullQuote
        key={`${postId}-pullquote-${index}`}
        quote={renderInlineContent(`“${block.quote}”`, `${postId}-pullquote-inline-${index}`)}
        attribution={
          block.attribution ? renderInlineContent(block.attribution, `${postId}-pullquote-attribution-${index}`) : undefined
        }
      />
    );
  }

  if (block.type === 'pros') {
    return (
      <Pros
        key={`${postId}-pros-${index}`}
        title={renderInlineContent(block.title, `${postId}-pros-title-${index}`)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-pros-inline-${index}-${itemIndex}`),
        )}
      />
    );
  }

  if (block.type === 'cons') {
    return (
      <Cons
        key={`${postId}-cons-${index}`}
        title={renderInlineContent(block.title, `${postId}-cons-title-${index}`)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-cons-inline-${index}-${itemIndex}`),
        )}
      />
    );
  }

  if (block.type === 'takeaways') {
    return (
      <Takeaways
        key={`${postId}-takeaways-${index}`}
        title={renderInlineContent(block.title, `${postId}-takeaways-title-${index}`)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-takeaways-inline-${index}-${itemIndex}`),
        )}
      />
    );
  }

  if (block.type === 'comparison') {
    return (
      <Comparison
        key={`${postId}-comparison-${index}`}
        title={renderInlineContent(block.title, `${postId}-comparison-title-${index}`)}
        rows={block.rows.map((row, rowIndex) => ({
          label: renderInlineContent(row.label, `${postId}-comparison-label-${index}-${rowIndex}`),
          value: renderInlineContent(row.value, `${postId}-comparison-inline-${index}-${rowIndex}`),
        }))}
      />
    );
  }

  if (block.type === 'product') {
    return (
      <ProductCard
        key={`${postId}-product-${index}`}
        brand={block.brand}
        productName={block.productName}
        review={renderInlineContent(block.shortReview, `${postId}-product-review-${index}`)}
        bestFor={renderInlineContent(block.bestFor, `${postId}-product-bestfor-${index}`)}
        standout={block.standout ? renderInlineContent(block.standout, `${postId}-product-standout-${index}`) : undefined}
        pros={block.pros.map((pro, proIndex) => renderInlineContent(pro, `${postId}-product-pro-${index}-${proIndex}`))}
        affiliateLinks={block.affiliateLinks}
        imageUrl={block.imageUrl}
        imageAlt={block.imageAlt}
      />
    );
  }

  if (block.type === 'faq') {
    return (
      <FAQ
        key={`${postId}-faq-widget-${index}`}
        question={renderInlineContent(block.question, `${postId}-faq-question-${index}`)}
        answer={renderInlineContent(block.answer, `${postId}-faq-answer-${index}`)}
      />
    );
  }

  if (block.type === 'decision') {
    return (
      <DecisionHelper
        key={`${postId}-decision-${index}`}
        question={renderInlineContent(block.question, `${postId}-decision-question-${index}`)}
        option={renderInlineContent(block.option, `${postId}-decision-option-${index}`)}
        result={renderInlineContent(block.result, `${postId}-decision-result-${index}`)}
      />
    );
  }

  return null;
}

export default function PostContent({
  postId,
  content,
  className,
  ctaPartners = {},
}: PostContentProps) {
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
        const headingIdCounts = new Map<string, number>();

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

            const headingText = line.replace(/^##\s+/, '');
            const baseHeadingId = slugify(stripMarkdownFormatting(headingText)) || 'section';
            const nextHeadingCount = headingIdCounts.get(baseHeadingId) ?? 0;
            headingIdCounts.set(baseHeadingId, nextHeadingCount + 1);
            const headingId = nextHeadingCount === 0 ? baseHeadingId : `${baseHeadingId}-${nextHeadingCount + 1}`;

            nodes.push(
              <h2 key={`${postId}-h2-${i}`} id={headingId} className="scroll-mt-24 text-[var(--tmbc-blog-charcoal)]">
                {renderInlineContent(headingText, `${postId}-h2-inline-${i}`)}
              </h2>,
            );
            h2Count += 1;
            i += 1;
            continue;
          }

          if (line.startsWith('### ')) {
            const headingText = line.replace(/^###\s+/, '');
            const baseHeadingId = slugify(stripMarkdownFormatting(headingText)) || 'section';
            const nextHeadingCount = headingIdCounts.get(baseHeadingId) ?? 0;
            headingIdCounts.set(baseHeadingId, nextHeadingCount + 1);
            const headingId = nextHeadingCount === 0 ? baseHeadingId : `${baseHeadingId}-${nextHeadingCount + 1}`;

            nodes.push(
              <h3 key={`${postId}-h3-${i}`} id={headingId} className="scroll-mt-24 text-[var(--tmbc-blog-charcoal)]">
                {renderInlineContent(headingText, `${postId}-h3-inline-${i}`)}
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
            const dividerIndex = i;
            i += 1;

            // Collapse repeated divider markers into a single visual rule.
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';

              if (!candidate) {
                i += 1;
                continue;
              }

              if (!isDividerLine(candidate)) {
                break;
              }

              i += 1;
            }

            nodes.push(<BlogDivider key={`${postId}-rule-${dividerIndex}`} />);
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
              <ContentPullQuote
                key={`${postId}-quote-${i}`}
                quote={renderInlineContent(quoteLines.join(' '), `${postId}-quote-inline-${i}`)}
              />,
            );
            continue;
          }

          const imageLineMatch = line.match(imageLinePattern);
          if (imageLineMatch) {
            const [, altText, src, title] = imageLineMatch;
            const imageDescription = altText || title || '';
            const isPlaceholderImage =
              src.includes('/assets/placeholders/') || /^temporary placeholder image:/i.test(imageDescription);
            nodes.push(
              <figure
                key={`${postId}-img-${i}`}
                className={`tmbc-inline-image guide-inline-image${isPlaceholderImage ? ' tmbc-inline-image--placeholder guide-inline-image--placeholder' : ''}`}
              >
                <img
                  src={src}
                  alt={imageDescription}
                  loading="lazy"
                  decoding="async"
                  className={`tmbc-inline-image__asset guide-inline-image__asset${isPlaceholderImage ? ' tmbc-inline-image__asset--placeholder guide-inline-image__asset--placeholder' : ''}`}
                />
                {imageDescription && (
                  <figcaption
                    className={`tmbc-inline-image__caption guide-inline-image__caption${
                      isPlaceholderImage ? ' tmbc-inline-image__caption--placeholder guide-inline-image__caption--placeholder' : ''
                    }`}
                  >
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
