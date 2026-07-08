'use client';

import type { AffiliateNetwork } from '@prisma/client';
import type { ReactNode } from 'react';
import BlogAffiliateCTA from '@/components/blog/BlogAffiliateCTA';
import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';
import BlogContent from '@/components/blog/BlogContent';
import BlogDivider from '@/components/blog/BlogDivider';
import BlogProductInsightCard from '@/components/blog/BlogProductInsightCard';
import GuideSignoffMark from '@/components/blog/GuideSignoffMark';
import { renderBrandWordmarkText } from '@/components/ui/BrandWordmark';
import Advice from '@/components/content-widgets/Advice';
import Callout from '@/components/content-widgets/Callout';
import Comparison from '@/components/content-widgets/Comparison';
import Cons from '@/components/content-widgets/Cons';
import DecisionHelper from '@/components/content-widgets/DecisionHelper';
import FAQ from '@/components/content-widgets/FAQ';
import ProductCard from '@/components/content-widgets/ProductCard';
import Pros from '@/components/content-widgets/Pros';
import SpecTable from '@/components/content-widgets/SpecTable';
import ContentPullQuote from '@/components/content-widgets/PullQuote';
import Takeaways from '@/components/content-widgets/Takeaways';
import { chunkArray } from '@/lib/chunkArray';
import { filterRenderableGuideProductBlocks } from '@/lib/guides/renderableProductExamples';
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
import { blogProductKey, type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import { enrichProductBlockWithCatalog } from '@/lib/blog/enrichCatalogProduct';
import { renderTextWithInternalLinks } from '@/lib/internal-links/render';
import type { ContextualInternalLink } from '@/lib/internal-links/types';

type PostContentProps = {
  postId: string;
  content: string;
  className?: string;
  variant?: 'default' | 'plain' | 'guide';
  highlightBrandWordmark?: boolean;
  afterFirstParagraph?: ReactNode;
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
  contextualInternalLinks?: ContextualInternalLink[];
  /** Live affiliate-catalogue matches keyed by blogProductKey(brand, productName). */
  productCatalogMap?: Record<string, BlogCatalogMatch>;
  /** Travel-system checker hrefs keyed by blogProductKey(brand, productName). */
  strollerCompatHrefs?: Record<string, string>;
  /** GoodBuy Gear open-box offers keyed by blogProductKey(brand, productName). */
  goodBuyGearOffers?: Record<string, { url: string | null; price: number | null }>;
};

type CtaButtonVariant = 'primary' | 'secondary' | 'text';

type LegacyCtaButtonBlock = {
  type: 'ctaButton';
  label: string;
  url: string;
  variant?: CtaButtonVariant;
};

type GuideProductBlock = Extract<ParsedStyledBlock, { type: 'product' }>;

const orderedListPattern = /^\d+\.\s+/;
const unorderedListPattern = /^(?:[-•])\s+/;
const imageLinePattern = /^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)$/;
const inlineTokenPattern =
  /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/;
const CTA_BUTTON_PREFIX = '::cta-button ';

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const opensNewTab = (href: string) => isExternalHref(href) || /\.pdf(?:[?#].*)?$/i.test(href);
const isDividerLine = (line: string) => line === '---' || line === '***';
const isQuoteLine = (line: string) => line.startsWith('>');
const isUnorderedListLine = (line: string) => unorderedListPattern.test(line);

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

function parseGuideSignatureBlock(lines: string[], startIndex: number) {
  const currentLine = lines[startIndex]?.trim() ?? '';
  if (!/^xoxo$/i.test(currentLine)) {
    return null;
  }

  let index = startIndex + 1;
  while (index < lines.length && !(lines[index]?.trim() ?? '')) {
    index += 1;
  }

  const nameLine = lines[index]?.trim() ?? '';
  if (!/^(?:-|—)\s*taylor$/i.test(nameLine) && !/^taylor$/i.test(nameLine)) {
    return null;
  }
  const normalizedName = nameLine.replace(/^(?:-|—)\s*/, '').trim();

  index += 1;
  while (index < lines.length && !(lines[index]?.trim() ?? '')) {
    index += 1;
  }

  const titleLine = lines[index]?.trim() ?? '';
  const hasTitle = /^founder,\s*taylor-made baby co\.?$/i.test(titleLine);

  return {
    xoxo: 'XOXO',
    name: normalizedName,
    title: hasTitle ? titleLine : null,
    nextIndex: hasTitle ? index + 1 : index,
  };
}

function renderInlineContent(
  text: string,
  keyPrefix: string,
  highlightBrandWordmark = false,
  contextualInternalLinks: ContextualInternalLink[] = [],
  usedInternalLinks?: Set<string>,
  placement = 'inline',
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let tokenIndex = 0;

  const pushText = (value: string, suffix: string) => {
    if (!value) {
      return;
    }

    if (highlightBrandWordmark) {
      nodes.push(...renderBrandWordmarkText(value, `${keyPrefix}-${suffix}`));
      return;
    }

    if (contextualInternalLinks.length > 0 && usedInternalLinks) {
      nodes.push(
        ...renderTextWithInternalLinks({
          text: value,
          suggestions: contextualInternalLinks,
          usedHrefs: usedInternalLinks,
          keyPrefix: `${keyPrefix}-${suffix}`,
          className: 'link-underline transition-colors duration-200 hover:text-neutral-900',
          placement,
        }),
      );
      return;
    }

    nodes.push(value);
  };

  while (remaining.length > 0) {
    const match = remaining.match(inlineTokenPattern);

    if (!match || match.index === undefined) {
      pushText(remaining, `tail-${tokenIndex}`);
      break;
    }

    if (match.index > 0) {
      pushText(remaining.slice(0, match.index), `lead-${tokenIndex}`);
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
          {highlightBrandWordmark ? renderBrandWordmarkText(linkLabel, `${key}-link`) : linkLabel}
        </a>,
      );
    } else if (strongA || strongB) {
      nodes.push(
        <strong key={key} className="font-semibold text-neutral-900">
          {highlightBrandWordmark ? renderBrandWordmarkText(strongA ?? strongB ?? '', `${key}-strong`) : (strongA ?? strongB)}
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
          {highlightBrandWordmark ? renderBrandWordmarkText(emphasisA ?? emphasisB ?? '', `${key}-em`) : (emphasisA ?? emphasisB)}
        </em>,
      );
    } else {
      pushText(fullMatch, `match-${tokenIndex}`);
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

function renderGuideProductGrid(products: GuideProductBlock[], postId: string, startingPosition: number) {
  const renderableProducts = filterRenderableGuideProductBlocks(products);

  if (renderableProducts.length === 0) {
    return null;
  }

  return (
    <div key={`${postId}-guide-product-grid-${startingPosition}`} className="space-y-5">
      {chunkArray(renderableProducts, 3).map((productChunk, chunkIndex) => (
        <div key={`${postId}-guide-product-grid-${startingPosition}-chunk-${chunkIndex}`} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {productChunk.map((product, index) => {
            const position = startingPosition + chunkIndex * 3 + index + 1;

            return (
              <BlogProductInsightCard
                key={`${postId}-guide-product-${product.brand}-${product.productName}-${position}`}
                name={product.productName}
                brand={product.brand}
                imageSrc={product.imageUrl}
                imageAlt={product.imageAlt}
                description={product.shortReview}
                details={[
                  {
                    label: 'Best for',
                    content: product.bestFor,
                  },
                  {
                    label: 'Standout',
                    content:
                      product.standout ||
                      product.pros[0] ||
                      product.notes?.[0] ||
                      'A useful example to keep the category tied to real-life use.',
                  },
                  {
                    label: 'What to know',
                    content:
                      product.specGroups && product.specGroups.length > 0 ? (
                        <ul className="space-y-2">
                          {product.specGroups
                            .flatMap((group) => group.items)
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((item, detailIndex) => (
                              <li key={`${postId}-${product.productName}-detail-${detailIndex}`} className="flex items-start gap-2.5">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]/58"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                        </ul>
                      ) : product.notes?.[0] || product.pros[1] || 'The right fit is usually the one that supports the routine you will use most.',
                  },
                ]}
                links={product.affiliateLinks}
                category={product.typeLabel ?? 'Product Examples'}
                position={position}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function renderStyledBlock(
  block: ParsedStyledBlock,
  postId: string,
  index: number,
  highlightBrandWordmark = false,
  strollerCompatHrefs: Record<string, string> = {},
  goodBuyGearOffers: Record<string, { url: string | null; price: number | null }> = {},
) {
  if (block.type === 'callout') {
    return (
      <Callout
        key={`${postId}-callout-${index}`}
        title={block.title ? renderInlineContent(block.title, `${postId}-callout-title-${index}`, highlightBrandWordmark) : undefined}
      >
        {renderInlineContent(block.body, `${postId}-callout-inline-${index}`, highlightBrandWordmark)}
      </Callout>
    );
  }

  if (block.type === 'advice') {
    return (
      <Advice
        key={`${postId}-advice-${index}`}
        title={block.title ? renderInlineContent(block.title, `${postId}-advice-title-${index}`, highlightBrandWordmark) : undefined}
      >
        {renderInlineContent(block.body, `${postId}-advice-inline-${index}`, highlightBrandWordmark)}
      </Advice>
    );
  }

  if (block.type === 'pullquote') {
    return (
      <ContentPullQuote
        key={`${postId}-pullquote-${index}`}
        quote={renderInlineContent(`“${block.quote}”`, `${postId}-pullquote-inline-${index}`, highlightBrandWordmark)}
        attribution={
          block.attribution
            ? renderInlineContent(block.attribution, `${postId}-pullquote-attribution-${index}`, highlightBrandWordmark)
            : undefined
        }
      />
    );
  }

  if (block.type === 'pros') {
    return (
      <Pros
        key={`${postId}-pros-${index}`}
        title={renderInlineContent(block.title, `${postId}-pros-title-${index}`, highlightBrandWordmark)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-pros-inline-${index}-${itemIndex}`, highlightBrandWordmark),
        )}
      />
    );
  }

  if (block.type === 'cons') {
    return (
      <Cons
        key={`${postId}-cons-${index}`}
        title={renderInlineContent(block.title, `${postId}-cons-title-${index}`, highlightBrandWordmark)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-cons-inline-${index}-${itemIndex}`, highlightBrandWordmark),
        )}
      />
    );
  }

  if (block.type === 'takeaways') {
    return (
      <Takeaways
        key={`${postId}-takeaways-${index}`}
        title={renderInlineContent(block.title, `${postId}-takeaways-title-${index}`, highlightBrandWordmark)}
        items={block.items.map((item, itemIndex) =>
          renderInlineContent(item, `${postId}-takeaways-inline-${index}-${itemIndex}`, highlightBrandWordmark),
        )}
      />
    );
  }

  if (block.type === 'comparison') {
    return (
      <Comparison
        key={`${postId}-comparison-${index}`}
        title={renderInlineContent(block.title, `${postId}-comparison-title-${index}`, highlightBrandWordmark)}
        rows={block.rows.map((row, rowIndex) => ({
          label: renderInlineContent(row.label, `${postId}-comparison-label-${index}-${rowIndex}`, highlightBrandWordmark),
          value: renderInlineContent(row.value, `${postId}-comparison-inline-${index}-${rowIndex}`, highlightBrandWordmark),
        }))}
      />
    );
  }

  if (block.type === 'spec-table') {
    return (
      <SpecTable
        key={`${postId}-spec-table-${index}`}
        title={block.title ? renderInlineContent(block.title, `${postId}-spec-title-${index}`, highlightBrandWordmark) : undefined}
        columns={block.columns.map((column, colIndex) =>
          renderInlineContent(column, `${postId}-spec-col-${index}-${colIndex}`, highlightBrandWordmark),
        )}
        rows={block.rows.map((row, rowIndex) => ({
          label: renderInlineContent(row.label, `${postId}-spec-rowlabel-${index}-${rowIndex}`, highlightBrandWordmark),
          values: row.values.map((value, valueIndex) =>
            renderInlineContent(value, `${postId}-spec-cell-${index}-${rowIndex}-${valueIndex}`, highlightBrandWordmark),
          ),
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
        review={renderInlineContent(block.shortReview, `${postId}-product-review-${index}`, highlightBrandWordmark)}
        bestFor={renderInlineContent(block.bestFor, `${postId}-product-bestfor-${index}`, highlightBrandWordmark)}
        standout={
          block.standout ? renderInlineContent(block.standout, `${postId}-product-standout-${index}`, highlightBrandWordmark) : undefined
        }
        pros={block.pros.map((pro, proIndex) => renderInlineContent(pro, `${postId}-product-pro-${index}-${proIndex}`, highlightBrandWordmark))}
        affiliateLinks={block.affiliateLinks}
        imageUrl={block.imageUrl}
        imageAlt={block.imageAlt}
        position={index + 1}
      />
    );
  }

  if (block.type === 'catalog-product') {
    return (
      <BlogCatalogProductCard
        key={`${postId}-catalog-product-${index}`}
        brand={block.brand}
        productName={block.productName}
        note={block.note}
        imageUrl={block.imageUrl}
        price={block.price}
        priceSource={block.priceSource}
        babylistUrl={block.babylistUrl}
        macrobabyUrl={block.macrobabyUrl}
        shopUrl={block.shopUrl}
        shopRetailer={block.shopRetailer}
        shop2Url={block.shop2Url}
        shop2Retailer={block.shop2Retailer}
        amazonUrl={block.amazonUrl}
        primaryRetailer={block.primaryRetailer}
        comingSoon={block.comingSoon}
        compatHref={strollerCompatHrefs[blogProductKey(block.brand, block.productName)] ?? null}
        openBoxUrl={goodBuyGearOffers[blogProductKey(block.brand, block.productName)]?.url ?? null}
        openBoxPrice={goodBuyGearOffers[blogProductKey(block.brand, block.productName)]?.price ?? null}
        layout="inline"
        position={index + 1}
      />
    );
  }

  if (block.type === 'faq') {
    return (
      <FAQ
        key={`${postId}-faq-widget-${index}`}
        question={renderInlineContent(block.question, `${postId}-faq-question-${index}`, highlightBrandWordmark)}
        answer={renderInlineContent(block.answer, `${postId}-faq-answer-${index}`, highlightBrandWordmark)}
      />
    );
  }

  if (block.type === 'decision') {
    return (
      <DecisionHelper
        key={`${postId}-decision-${index}`}
        question={renderInlineContent(block.question, `${postId}-decision-question-${index}`, highlightBrandWordmark)}
        option={renderInlineContent(block.option, `${postId}-decision-option-${index}`, highlightBrandWordmark)}
        result={renderInlineContent(block.result, `${postId}-decision-result-${index}`, highlightBrandWordmark)}
      />
    );
  }

  return null;
}

export default function PostContent({
  postId,
  content,
  className,
  variant = 'default',
  highlightBrandWordmark = false,
  afterFirstParagraph,
  ctaPartners = {},
  contextualInternalLinks = [],
  productCatalogMap = {},
  strollerCompatHrefs = {},
  goodBuyGearOffers = {},
}: PostContentProps) {
  const storedButtons = extractStoredCtaButtons(content);
  const storedButtonMap = new Map(storedButtons.buttons.map((button) => [button.id, button]));
  const articleContent = storedButtons.body;

  return (
    <BlogContent className={`${className ?? ''} ${variant === 'guide' ? 'guide-content-wrapper' : ''}`} variant={variant}>
      {(() => {
        const nodes: ReactNode[] = [];
        const lines = articleContent.split('\n');
        let i = 0;
        let paragraphCount = 0;
        let h2Count = 0;
        let guideProductCount = 0;
        const slottedButtonIds = new Set<string>();
        const headingIdCounts = new Map<string, number>();
        const usedInternalLinks = new Set<string>();

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
              <h2
                key={`${postId}-h2-${i}`}
                id={headingId}
                className={`scroll-mt-24 ${variant === 'guide' ? 'mb-6 text-2xl font-serif tracking-tight text-charcoal md:text-3xl' : 'text-[var(--tmbc-blog-charcoal)]'}`}
              >
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
              <h3
                key={`${postId}-h3-${i}`}
                id={headingId}
                className={`scroll-mt-24 ${variant === 'guide' ? 'mt-6 mb-4 text-[1.25rem] font-serif tracking-tight text-charcoal md:text-[1.5rem]' : 'text-[var(--tmbc-blog-charcoal)]'}`}
              >
                {renderInlineContent(headingText, `${postId}-h3-inline-${i}`)}
              </h3>,
            );
            i += 1;
            continue;
          }

          const styledBlock = parseStyledBlock(lines, i);
          if (styledBlock && variant === 'guide' && styledBlock.block.type === 'product') {
            const productBlocks: GuideProductBlock[] = [];
            let nextIndex = i;

            while (nextIndex < lines.length) {
              while (nextIndex < lines.length && !(lines[nextIndex]?.trim() ?? '')) {
                nextIndex += 1;
              }

              const nextBlock = parseStyledBlock(lines, nextIndex);
              if (!nextBlock || nextBlock.block.type !== 'product') {
                break;
              }

              productBlocks.push(enrichProductBlockWithCatalog(nextBlock.block, productCatalogMap) as GuideProductBlock);
              nextIndex = nextBlock.nextIndex;
            }

            nodes.push(renderGuideProductGrid(productBlocks, postId, guideProductCount));
            guideProductCount += productBlocks.length;
            i = nextIndex;
            continue;
          }

          if (styledBlock) {
            nodes.push(renderStyledBlock(enrichProductBlockWithCatalog(styledBlock.block, productCatalogMap), postId, i, false, strollerCompatHrefs, goodBuyGearOffers));
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

          const guideSignature = parseGuideSignatureBlock(lines, i);
          if (guideSignature) {
            nodes.push(
              <div key={`${postId}-signature-${i}`} className="guide-signoff">
                <div className="guide-signoff__ink" aria-hidden="true">
                  <GuideSignoffMark className="guide-signoff__mark" />
                </div>
                <span className="sr-only">{`${guideSignature.xoxo} - T`}</span>
                {guideSignature.title ? <p className="guide-signoff__title">{guideSignature.title}</p> : null}
              </div>,
            );
            i = guideSignature.nextIndex;
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
                className={`tmbc-inline-image guide-inline-image${variant === 'guide' ? ' relative rounded-2xl overflow-hidden shadow-md' : ''}${isPlaceholderImage ? ' tmbc-inline-image--placeholder guide-inline-image--placeholder' : ''}`}
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

          if (isUnorderedListLine(line)) {
            const items: string[] = [];
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!isUnorderedListLine(candidate)) break;
              items.push(candidate.replace(unorderedListPattern, ''));
              i += 1;
            }

            nodes.push(
              <ul
                key={`${postId}-ul-${i}`}
                className={
                  variant === 'guide'
                    ? 'mt-6 ml-6 list-disc space-y-3 text-base leading-relaxed text-neutral-700 md:text-lg'
                    : 'mt-8 ml-6 list-disc space-y-3 leading-relaxed text-charcoal/85'
                }
              >
                {items.map((item, index) => (
                  <li key={`${postId}-ul-${i}-${index}`} className="pl-1">
                    {renderInlineContent(
                      item,
                      `${postId}-ul-inline-${i}-${index}`,
                      false,
                      contextualInternalLinks,
                      usedInternalLinks,
                      'list',
                    )}
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
                className={
                  variant === 'guide'
                    ? 'mt-6 ml-6 list-decimal space-y-3 text-base leading-relaxed text-neutral-700 md:text-lg'
                    : 'mt-8 ml-6 list-decimal space-y-3 leading-relaxed text-charcoal/85'
                }
              >
                {items.map((item, index) => (
                  <li key={`${postId}-ol-${i}-${index}`} className="pl-1">
                    {renderInlineContent(
                      item,
                      `${postId}-ol-inline-${i}-${index}`,
                      false,
                      contextualInternalLinks,
                      usedInternalLinks,
                      'list',
                    )}
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
              isUnorderedListLine(candidate) ||
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
                  variant === 'guide'
                    ? 'mb-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg'
                    : paragraphCount === 1
                      ? 'text-charcoal/85'
                      : 'text-charcoal/85'
                }
              >
                {renderInlineContent(
                  paragraphLines.join(' '),
                  `${postId}-p-inline-${i}`,
                  false,
                  contextualInternalLinks,
                  usedInternalLinks,
                  'body',
                )}
              </p>,
            );

            if (paragraphCount === 1 && afterFirstParagraph) {
              nodes.push(<div key={`${postId}-after-first-p`}>{afterFirstParagraph}</div>);
            }
          }
        }

        return nodes;
      })()}
    </BlogContent>
  );
}
