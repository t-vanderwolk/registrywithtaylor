import type React from 'react';
import type { AffiliateBrandCard } from '@/lib/affiliateBrands';
import { BlogTrackingProvider } from '@/components/analytics/TrackingContext';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { formatAffiliateNetworks } from '@/lib/affiliateBrands';
import { extractStoredCtaButtons } from '@/lib/blog/ctaButtons';
import type { BlogPostComment } from '@/lib/blog/postComments';
import { getBlogCategoryLabel, type BlogCategory } from '@/lib/blogCategories';
import { sanitizeLegacyArticleContent } from '@/lib/blog/contentText';
import { buildBlogSeoSnapshot, truncateAtWordBoundary } from '@/lib/blog/seo';
import { generateSocialSnippets } from '@/lib/blog/socialSnippets';
import { getPostDisplayDate, type PostStatusValue } from '@/lib/blog/postStatus';
import { getAffiliatePartnerLogo } from '@/lib/affiliatePartnerLogos';
import { formatFileSize, isImageMediaType, isPdfMediaType } from '@/lib/media';
import { SITE_URL } from '@/lib/marketing/metadata';
import type { BlogAuthorProfile } from '@/lib/server/blogAuthors';
import { getAffiliatePartnerLookup } from '@/lib/server/affiliatePartners';
import AffiliateDisclosure from '@/components/blog/AffiliateDisclosure';
import BlogShareBar from '@/components/blog/BlogShareBar';
import BlogCatalogProductRecap from '@/components/blog/BlogCatalogProductRecap';
import BlogSoftCTA from '@/components/blog/BlogSoftCTA';
import BlogViewTracker from '@/components/blog/BlogViewTracker';
import BlogArticleCompass from '@/components/blog/BlogArticleCompass';
import JournalCard from '@/components/blog/JournalCard';
import PostCommentsSection from '@/components/blog/PostCommentsSection';
import PostContent from '@/components/blog/PostContent';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';
import { resolveBlogProductCatalogLinks } from '@/lib/server/blogCatalogLinks';
import TMBCBlogTemplate from '@/components/blog/TMBCBlogTemplate';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import AffiliateLogoBadge from '@/components/ui/AffiliateLogoBadge';
import MarketingSurface from '@/components/ui/MarketingSurface';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { getBlogCategoryFallbackImage } from '@/lib/blog/images';
import { buildBlogInternalLinkPlan } from '@/lib/internal-links/system';

export type DownloadableResource = {
  title: string;
  href: string;
  description: string | null;
  fileSize: string | null;
};

export type ExtractedResourceResult = {
  content: string;
  resource: DownloadableResource | null;
};

export type PostArticleRecord = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  content: string;
  deck: string | null;
  excerpt: string | null;
  focusKeyword?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featuredImage: {
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  } | null;
  media: Array<{
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
  images: Array<{
    id: number;
    url: string;
    alt: string | null;
    createdAt: Date;
  }>;
  comments: BlogPostComment[];
  affiliateBrands: AffiliateBrandCard[];
  status: PostStatusValue;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  archivedAt: Date | null;
  canonicalUrl: string | null;
  readingTime: number | null;
  shareTitle: string | null;
  shareDescription: string | null;
  authors: BlogAuthorProfile[];
  createdAt: Date;
  updatedAt: Date;
};

export type PostArticleRelatedPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt?: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
};

const orderedListPattern = /^\d+\.\s+/;
const markdownPdfLinePattern =
  /^\s*(?:Resource\s*:\s*|Download(?:\s+PDF)?\s*:\s*)?\[([^\]]+)\]\(([^)\s]+\.pdf(?:\?[^)]*)?)\)(?:\s*(?:[-|·]\s*(.+))?)?\s*$/i;
const plainPdfLinePattern =
  /^\s*(?:Resource\s*:\s*|Download(?:\s+PDF)?\s*:\s*)?(https?:\/\/\S+\.pdf(?:\?\S+)?|\/\S+\.pdf(?:\?\S+)?)(?:\s*(?:[-|·]\s*(.+))?)?\s*$/i;
const fileSizePattern = /\b\d+(?:\.\d+)?\s?(?:KB|MB|GB)\b/i;

export const formatArticleDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^:::[a-zA-Z]+\s*$|^:::\s*$/gm, ' ')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const toExcerpt = (excerpt: string | null, content: string, maxLength = 160) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

const toTitleCase = (value: string) =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

const titleFromHref = (href: string) => {
  const normalizedHref = href.split('?')[0] ?? href;
  const lastSegment = normalizedHref.split('/').filter(Boolean).pop() ?? 'downloadable-pdf';

  return toTitleCase(lastSegment.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '));
};

const isBodyTextLine = (line: string) => {
  const trimmed = line.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith('- ') &&
    !orderedListPattern.test(trimmed)
  );
};

export const extractDownloadableResource = (content: string): ExtractedResourceResult => {
  const lines = content.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? '';
    if (!line) {
      continue;
    }

    const markdownMatch = line.match(markdownPdfLinePattern);
    const plainMatch = line.match(plainPdfLinePattern);

    if (!markdownMatch && !plainMatch) {
      continue;
    }

    const href = markdownMatch?.[2] ?? plainMatch?.[1];
    if (!href) {
      continue;
    }

    const title = (markdownMatch?.[1] ?? titleFromHref(href)).trim();
    const trailingCopy = (markdownMatch?.[3] ?? plainMatch?.[2] ?? '').trim();
    const fileSize = trailingCopy.match(fileSizePattern)?.[0] ?? null;
    const trailingDescription = trailingCopy
      .replace(fileSizePattern, '')
      .replace(/^[\s|·-]+|[\s|·-]+$/g, '')
      .trim();

    let description = trailingDescription || null;
    let descriptionIndex: number | null = null;

    if (!description) {
      for (let lookahead = index + 1; lookahead < lines.length; lookahead += 1) {
        const candidate = lines[lookahead]?.trim() ?? '';

        if (!candidate) {
          continue;
        }

        if (isBodyTextLine(candidate)) {
          description = candidate;
          descriptionIndex = lookahead;
        }
        break;
      }
    }

    const cleanedContent = lines
      .filter((_, candidateIndex) => candidateIndex !== index && candidateIndex !== descriptionIndex)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      content: cleanedContent,
      resource: {
        title,
        href,
        description: description ?? 'A concise PDF companion to this article.',
        fileSize,
      },
    };
  }

  return {
    content,
    resource: null,
  };
};

export default async function PostArticleView({
  post,
  relatedPosts = [],
  trackView = true,
  newsletterCapture,
}: {
  post: PostArticleRecord;
  relatedPosts?: PostArticleRelatedPost[];
  trackView?: boolean;
  newsletterCapture?: React.ReactNode;
}) {
  const categoryLabel = getBlogCategoryLabel(post.category);
  const normalizedContent = sanitizeLegacyArticleContent(post.content, {
    title: post.title,
    authors: post.authors.map((author) => author.name).filter(Boolean),
    categoryLabel,
  });
  const storedCtas = extractStoredCtaButtons(normalizedContent);
  const { content: articleContent, resource } = extractDownloadableResource(normalizedContent);
  const featuredImageUrl =
    post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl ?? getBlogCategoryFallbackImage(post.category);
  const attachedPdfResources = post.media.filter((media) => isPdfMediaType(media.fileType));
  const mediaGalleryImages = post.media
    .filter((media) => isImageMediaType(media.fileType))
    .map((media) => ({
      id: media.id,
      url: media.url,
      alt: null as string | null,
    }));
  const galleryImages = (post.images.length > 0 ? post.images : mediaGalleryImages).filter(
    (image, index, collection) =>
      image.url !== featuredImageUrl && collection.findIndex((candidate) => candidate.url === image.url) === index,
  );
  const seoSnapshot = buildBlogSeoSnapshot({
    title: post.title,
    slug: post.slug,
    category: post.category,
    content: articleContent,
    excerpt: post.excerpt,
    deck: post.deck,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    canonicalUrl: post.canonicalUrl,
    readingTime: post.readingTime,
  });
  const subtitle = post.deck?.trim() || truncateAtWordBoundary(seoSnapshot.seoDescription, 180);
  const isAffiliate = post.affiliateBrands.length > 0;
  const ctaPartnerIds = Array.from(
    new Set(storedCtas.buttons.flatMap((button) => (button.partnerId ? [button.partnerId] : []))),
  );
  const ctaPartnerLookup = await getAffiliatePartnerLookup(ctaPartnerIds);

  // Wire blog product cards to the affiliate catalogue: match each product block
  // to a catalog row and pass the live buy link + image + price down to the cards.
  const articleStyledBlocks = extractStyledBlocks(articleContent);
  const catalogProductCount = articleStyledBlocks.filter((block) => block.type === 'catalog-product').length;
  const productCatalogMap = await resolveBlogProductCatalogLinks(
    articleStyledBlocks.flatMap((block) =>
      block.type === 'product' || block.type === 'catalog-product'
        ? [{ brand: block.brand, productName: block.productName }]
        : [],
    ),
  );
  const serializedCtaPartners = Object.fromEntries(
    Array.from(ctaPartnerLookup.entries()).map(([partnerId, partner]) => [
      partnerId,
      {
        id: partner.id,
        slug: partner.slug,
        name: partner.name,
        network: partner.network,
        logoUrl: partner.logoUrl,
        baseUrl: partner.baseUrl,
        affiliatePid: partner.affiliatePid,
      },
    ]),
  );
  const hasAffiliateDisclosure = isAffiliate || storedCtas.buttons.some((button) => Boolean(button.partnerId));
  const displayDate = getPostDisplayDate(post);
  const shareUrl = seoSnapshot.canonicalUrl;
  const socialSnippets = generateSocialSnippets({
    title: post.title,
    excerpt: post.excerpt ?? post.deck,
    shareTitle: seoSnapshot.shareTitle,
    shareDescription: seoSnapshot.shareDescription,
    category: categoryLabel,
    content: articleContent,
  });
  const internalLinkPlan = buildBlogInternalLinkPlan({
    post: {
      slug: post.slug,
      title: post.title,
      category: post.category,
      content: articleContent,
      focusKeyword: post.focusKeyword,
    },
    relatedPosts: relatedPosts.map((relatedPost) => ({
      slug: relatedPost.slug,
      title: relatedPost.title,
      category: relatedPost.category,
      excerpt: relatedPost.excerpt,
    })),
  });
  const relatedPostsSection =
    relatedPosts.length > 0 ? (
      <section className="section-base border-t border-black/5" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Continue Reading</span>
            <H2 className="font-serif text-neutral-900">More from the Journal</H2>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <JournalCard
                key={relatedPost.id}
                title={relatedPost.title}
                slug={relatedPost.slug}
                coverImage={relatedPost.coverImage}
                category={relatedPost.category}
                dateLabel={formatArticleDate(getPostDisplayDate(relatedPost))}
                dateTime={getPostDisplayDate(relatedPost).toISOString()}
              />
            ))}
          </div>
        </div>
      </section>
    ) : null;
  const commentsSection = <PostCommentsSection postId={post.id} comments={post.comments} />;
  return (
    <BlogTrackingProvider value={{ postId: post.id, slug: post.slug, title: post.title }}>
      <BlogViewTracker postId={post.id} slug={post.slug} title={post.title} enabled={trackView} />

      <TMBCBlogTemplate
      newsletterCapture={newsletterCapture}
      featuredImageUrl={featuredImageUrl}
      title={post.title}
      categoryLabel={categoryLabel}
      subtitle={subtitle}
      authors={post.authors}
      publishDateLabel={formatArticleDate(displayDate)}
      publishDateIso={displayDate.toISOString()}
      readingTime={seoSnapshot.readingTime}
      affiliateDisclosure={undefined}
      body={
        <div className="lg:grid lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-12 2xl:grid-cols-[21rem_minmax(0,1fr)]">
          <BlogArticleCompass
            headings={seoSnapshot.outline}
            relatedPosts={relatedPosts.map((relatedPost) => ({
              slug: relatedPost.slug,
              title: relatedPost.title,
              category: relatedPost.category,
              excerpt: relatedPost.excerpt ? truncateAtWordBoundary(relatedPost.excerpt, 120) : null,
            }))}
          />
          <div className="tmbc-editorial-article-shell min-w-0">
            <PostContent
              postId={post.id}
              content={articleContent}
              className="tmbc-blog-post-content tmbc-blog--wide"
              afterFirstParagraph={hasAffiliateDisclosure ? <AffiliateDisclosure /> : undefined}
              ctaPartners={serializedCtaPartners}
              contextualInternalLinks={internalLinkPlan.contextualLinks}
              productCatalogMap={productCatalogMap}
            />
          </div>
        </div>
      }
      resources={
        attachedPdfResources.length > 0 ? (
          <div className="mt-16 space-y-4">
            {attachedPdfResources.map((media) => (
              <MarketingSurface key={media.id} className="tmbc-blog-soft-card">
                <H3 className="tracking-tight text-neutral-900">Downloadable Resource</H3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{media.fileName}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal/55">
                  PDF · {formatFileSize(media.fileSize)}
                </p>
                <a href={media.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm text-neutral-900">
                  <MotionCtaContent align="start" showArrow underline>
                    Download PDF
                  </MotionCtaContent>
                </a>
              </MarketingSurface>
            ))}
          </div>
        ) : resource ? (
          <MarketingSurface className="tmbc-blog-soft-card mt-16">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-charcoal/60">Resource</p>
              <H2 className="font-serif text-neutral-900">{resource.title}</H2>
              {resource.description ? <Body className="text-charcoal/70">{resource.description}</Body> : null}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900"
                >
                  <MotionCtaContent align="start" showArrow underline>
                    Download PDF
                  </MotionCtaContent>
                </a>
                {resource.fileSize ? <span className="text-charcoal/55">{resource.fileSize}</span> : null}
              </div>
            </div>
          </MarketingSurface>
        ) : undefined
      }
      gallery={
        galleryImages.length > 0 ? (
          <div className="tmbc-blog-gallery mt-16 space-y-4">
            <H3 className="tracking-tight text-neutral-900">Image Gallery</H3>
            <div className="tmbc-blog-gallery__grid grid gap-4 md:grid-cols-2">
              {galleryImages.map((image) => (
                <figure key={`gallery-${image.id}-${image.url}`} className="tmbc-blog-gallery__item">
                  <img
                    src={image.url}
                    alt={image.alt || post.title}
                    className="tmbc-blog-gallery__image"
                    loading="lazy"
                    decoding="async"
                  />
                  {image.alt ? <figcaption>{image.alt}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        ) : undefined
      }
      affiliateCta={
        catalogProductCount > 0 || post.affiliateBrands.length > 0 ? (
          <>
            <BlogCatalogProductRecap content={articleContent} productCatalogMap={productCatalogMap} />
            {post.affiliateBrands.length > 0 ? (
          <div className="blog-section-soft mt-16 px-6">
            <div className="space-y-4">
              <H2 className="font-serif text-neutral-900">Gear Picks / Brand Partners</H2>
              <Body className="text-charcoal/68">Mentioned because they are relevant to the decisions covered in this guide.</Body>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {post.affiliateBrands.map((brand) => {
                const fallbackLogo = getAffiliatePartnerLogo(brand.name);
                const logoSrc = brand.logoUrl?.trim() || fallbackLogo.src;
                const rawShopUrl = brand.shopUrl?.trim();
                if (!rawShopUrl && process.env.NODE_ENV !== 'production') {
                  console.warn(
                    `[affiliate] brand "${brand.name}" has no shopUrl — Shop CTA will not render`,
                  );
                }
                const href = rawShopUrl || undefined;
                const networkLabel = formatAffiliateNetworks(brand.networks);

                return (
                  <div
                    key={brand.id}
                    className="group tmbc-blog-soft-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <AffiliateLogoBadge src={logoSrc} alt="" size="card" syncWithGroup className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-medium text-neutral-900">{brand.name}</p>
                        {networkLabel ? <p className="mt-1 text-xs uppercase tracking-[0.16em] text-charcoal/55">{networkLabel}</p> : null}
                        <Body className="mt-2 text-sm text-charcoal/68">Selected for relevance to the guidance in this article.</Body>
                      </div>
                    </div>
                    {href ? (
                      <div className="mt-5">
                        <TrackedAffiliateLink
                          href={href}
                          ctaText={`Shop ${brand.name}`}
                          className="inline-flex items-center rounded-full border border-black/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-900 transition hover:border-black/20 hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                          aria-label={`Shop ${brand.name}`}
                          meta={{
                            context: 'brand_partner_card',
                            brandId: brand.id,
                            brandName: brand.name,
                            programId: brand.primaryProgram?.id ?? null,
                            network: brand.primaryProgram?.network ?? null,
                          }}
                        >
                          <MotionCtaContent>Shop {brand.name}</MotionCtaContent>
                        </TrackedAffiliateLink>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
            ) : null}
          </>
        ) : undefined
      }
      discussionSection={commentsSection}
      conversionCta={<BlogSoftCTA postId={post.id} postSlug={post.slug} postTitle={post.title} />}
      shareSection={
        <BlogShareBar
          title={seoSnapshot.shareTitle}
          description={seoSnapshot.shareDescription || subtitle || ''}
          url={shareUrl}
          imageUrl={featuredImageUrl}
          pinterestDescription={socialSnippets.pinterestDescription}
          instagramCaption={socialSnippets.instagramCaption}
          redditSummary={socialSnippets.redditSummary}
        />
      }
      relatedPosts={
        <>
          {relatedPostsSection}
        </>
      }
      />
    </BlogTrackingProvider>
  );
}
