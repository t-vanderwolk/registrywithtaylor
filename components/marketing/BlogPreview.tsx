import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import EmbeddedEditorialImage from '@/components/ui/EmbeddedEditorialImage';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import { isRemoteImageUrl, resolveBlogCoverImage } from '@/lib/blog/images';
import { getBlogCategoryLabel, type BlogCategory } from '@/lib/blogCategories';

type BlogPreviewPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  coverImage: string | null;
  dateLabel: string;
  dateTime: string;
  readingTime: number | null;
  authorName?: string;
};

export default function BlogPreview({
  posts,
  eyebrow = 'From the Journal',
  title = 'Fresh thinking, product perspective, and decision guidance from Taylor.',
  description = 'Insights, guidance, and honest perspective from Taylor.',
  linkLabel = 'Visit the Journal',
  linkHref = '/blog',
  emptyMessage = 'Fresh editorial posts will appear here as the journal grows.',
  className = '',
}: {
  posts: BlogPreviewPost[];
  eyebrow?: string;
  title?: string;
  description?: string;
  linkLabel?: string;
  linkHref?: string;
  emptyMessage?: string;
  className?: string;
}) {
  return (
    <MarketingSection tone="white" spacing="default" className={className}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
        <SectionIntro
          align="left"
          spacing="tight"
          eyebrow={eyebrow}
          title={title}
          description={description}
          contentWidthClassName="max-w-[34rem]"
        />

        <Link
          href={linkHref}
          className="inline-flex min-h-[44px] items-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/52 transition-opacity duration-200 hover:opacity-75 md:justify-self-end"
        >
          {linkLabel}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const coverImageSrc = resolveBlogCoverImage(post.coverImage, post.category);
            const shouldSkipOptimization = isRemoteImageUrl(coverImageSrc);
            const categoryLabel = getBlogCategoryLabel(post.category);

            return (
              <RevealOnScroll key={post.id} delayMs={index * 80}>
                <article className="flex h-full flex-col rounded-[1.65rem] border border-[rgba(0,0,0,0.045)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,248,245,0.94)_100%)] p-5 shadow-[0_10px_24px_rgba(0,0,0,0.035)] transition-opacity duration-200 hover:opacity-[0.96]">
                  <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">{categoryLabel}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/48">
                    <span>{post.dateTime ? <time dateTime={post.dateTime}>{post.dateLabel}</time> : post.dateLabel}</span>
                    {post.readingTime ? (
                      <>
                        <span aria-hidden>·</span>
                        <span>{post.readingTime} min read</span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-3 max-w-[16ch] font-serif text-[1.32rem] leading-[1.08] tracking-[-0.028em] text-neutral-900">
                    <Link href={`/blog/${post.slug}`} className="transition-opacity duration-200 hover:opacity-80">
                      {post.title}
                    </Link>
                  </h3>

                  <Link href={`/blog/${post.slug}`} className="mt-4 block">
                    <EmbeddedEditorialImage
                      src={coverImageSrc}
                      alt={post.title}
                      fill
                      variant="cover"
                      aspectClassName="aspect-[4/2.15]"
                      sizes="(min-width: 1024px) 28vw, 100vw"
                      className="w-full"
                      loading="lazy"
                      unoptimized={shouldSkipOptimization}
                    />
                  </Link>

                  <p className="mt-4 max-w-none text-[0.94rem] leading-7 text-neutral-700 line-clamp-2">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex min-h-[44px] items-center pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-black/56"
                  >
                    Read More
                    <span aria-hidden className="ml-2">→</span>
                  </Link>
                </article>
              </RevealOnScroll>
            );
          })
        ) : (
          <div className="rounded-[1.55rem] border border-[rgba(0,0,0,0.05)] bg-white px-5 py-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.035)] lg:col-span-2">
            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-black/45">Journal update</p>
            <p className="mt-3 max-w-none text-sm leading-7 text-neutral-700">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </MarketingSection>
  );
}
