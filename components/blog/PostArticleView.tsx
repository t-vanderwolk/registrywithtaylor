import type { AffiliateBrandCard } from '@/lib/affiliateBrands';
import { formatAffiliateNetworks } from '@/lib/affiliateBrands';
import { extractStoredCtaButtons } from '@/lib/blog/ctaButtons';
import { BLOG_GUIDES_TITLE, getBlogCategoryLabel, type BlogCategory } from '@/lib/blogCategories';
import { sanitizeLegacyArticleContent } from '@/lib/blog/contentText';
import { toCondensedGuideCardTitle } from '@/lib/guides/presentation';
import { generateSocialSnippets } from '@/lib/blog/socialSnippets';
import { getPostDisplayDate, type PostStatusValue } from '@/lib/blog/postStatus';
import { getAffiliatePartnerLogo } from '@/lib/affiliatePartnerLogos';
import { formatFileSize, isImageMediaType, isPdfMediaType } from '@/lib/media';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getGuideLinksForBlogCategory } from '@/lib/marketing/siteContent';
import type { BlogAuthorProfile } from '@/lib/server/blogAuthors';
import { getAffiliatePartnerLookup } from '@/lib/server/affiliatePartners';
import AffiliateDisclosure from '@/components/blog/AffiliateDisclosure';
import BlogShareBar from '@/components/blog/BlogShareBar';
import BlogSoftCTA from '@/components/blog/BlogSoftCTA';
import BlogViewTracker from '@/components/blog/BlogViewTracker';
import JournalCard from '@/components/blog/JournalCard';
import PostContent from '@/components/blog/PostContent';
import TMBCBlogTemplate from '@/components/blog/TMBCBlogTemplate';
import GuideGrid from '@/components/marketing/GuideGrid';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import AffiliateLogoBadge from '@/components/ui/AffiliateLogoBadge';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { getBlogCategoryFallbackImage } from '@/lib/blog/images';

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
}: {
  post: PostArticleRecord;
  relatedPosts?: PostArticleRelatedPost[];
  trackView?: boolean;
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
  const subtitle = post.deck?.trim() || toExcerpt(post.excerpt, articleContent, 180);
  const isAffiliate = post.affiliateBrands.length > 0;
  const ctaPartnerIds = Array.from(
    new Set(storedCtas.buttons.flatMap((button) => (button.partnerId ? [button.partnerId] : []))),
  );
  const ctaPartnerLookup = await getAffiliatePartnerLookup(ctaPartnerIds);
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
  const shareUrl = post.canonicalUrl?.trim()
    ? /^https?:\/\//i.test(post.canonicalUrl)
      ? post.canonicalUrl
      : new URL(post.canonicalUrl, SITE_URL).toString()
    : `${SITE_URL}/blog/${post.slug}`;
  const socialSnippets = generateSocialSnippets({
    title: post.title,
    excerpt: post.excerpt ?? post.deck,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    category: categoryLabel,
    content: articleContent,
  });
  const relatedGuides = getGuideLinksForBlogCategory(post.category).map((guide) => ({
    ...guide,
    title: toCondensedGuideCardTitle(guide.slug, guide.title),
  }));
  const relatedGuidesSection =
    relatedGuides.length > 0 ? (
      <GuideGrid
        guides={relatedGuides}
        compact
        eyebrow="Keep exploring"
        title="Explore the guide pillars behind the decisions this article touches."
        description="These links connect fresh editorial reads back to the evergreen baby gear and baby-preparation hub."
        className="border-t border-black/5"
        showCardEyebrows={false}
        cardTextAlign="center"
      />
    ) : null;
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

  return (
    <>
      <BlogViewTracker postId={post.id} slug={post.slug} title={post.title} enabled={trackView} />

      <TMBCBlogTemplate
      featuredImageUrl={featuredImageUrl}
      title={post.title}
      categoryLabel={categoryLabel}
      subtitle={subtitle}
      authors={post.authors}
      publishDateLabel={formatArticleDate(displayDate)}
      publishDateIso={displayDate.toISOString()}
      readingTime={post.readingTime}
      affiliateDisclosure={
        hasAffiliateDisclosure ? <AffiliateDisclosure /> : undefined
      }
      body={
        <div className="tmbc-editorial-article-shell">
          <PostContent
            postId={post.id}
            content={articleContent}
            className="tmbc-blog-post-content mx-auto max-w-[72ch]"
            ctaPartners={serializedCtaPartners}
          />
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
                <a href={media.url} target="_blank" rel="noreferrer" className="link-underline mt-4 inline-block text-sm">
                  Download PDF →
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
                  <span className="link-underline">Download PDF</span>
                  <span aria-hidden className="ml-1">→</span>
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
        post.affiliateBrands.length > 0 ? (
          <div className="blog-section-soft mt-16 px-6">
            <div className="space-y-4">
              <H2 className="font-serif text-neutral-900">Gear Picks / Brand Partners</H2>
              <Body className="text-charcoal/68">Mentioned because they are relevant to the decisions covered in this guide.</Body>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {post.affiliateBrands.map((brand) => {
                const fallbackLogo = getAffiliatePartnerLogo(brand.name);
                const logoSrc = brand.logoUrl?.trim() || fallbackLogo.src;
                const href = brand.shopUrl?.trim() || brand.website?.trim();
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
                        <a
                          href={href}
                          target="_blank"
                          rel="sponsored nofollow noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-black/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-900 transition hover:border-black/20 hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                          aria-label={`Shop ${brand.name}`}
                        >
                          Shop {brand.name}
                        </a>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : undefined
      }
      conversionCta={<BlogSoftCTA postId={post.id} postSlug={post.slug} postTitle={post.title} />}
      shareSection={
        <BlogShareBar
          title={post.shareTitle?.trim() || post.title}
          description={post.shareDescription?.trim() || subtitle || ''}
          url={shareUrl}
          imageUrl={featuredImageUrl}
          pinterestDescription={socialSnippets.pinterestDescription}
          instagramCaption={socialSnippets.instagramCaption}
          redditSummary={socialSnippets.redditSummary}
        />
      }
      relatedPosts={
        <>
          {relatedGuidesSection}
          {relatedPostsSection}
        </>
      }
      />
    </>
  );
}
