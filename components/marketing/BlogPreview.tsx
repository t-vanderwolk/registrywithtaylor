import Image from 'next/image';
import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
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
    <MarketingSection tone="ivory" spacing="spacious" className={className}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
        <SectionIntro
          align="left"
          eyebrow={eyebrow}
          title={title}
          description={description}
          contentWidthClassName="max-w-[48rem]"
        />

        <Link
          href={linkHref}
          className="inline-flex min-h-[44px] items-center md:justify-self-end text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75"
        >
          {linkLabel}
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => {
            const coverImageSrc = resolveBlogCoverImage(post.coverImage, post.category);
            const shouldSkipOptimization = isRemoteImageUrl(coverImageSrc);
            const categoryLabel = getBlogCategoryLabel(post.category);

            return (
              <div key={post.id} className="flex h-full flex-col">
                <p className="mb-3 px-1 text-[0.72rem] uppercase tracking-[0.2em] text-black/48">{categoryLabel}</p>
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.85rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.08)]">
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/2.7] overflow-hidden">
                    <Image
                      src={coverImageSrc}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 28vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      unoptimized={shouldSkipOptimization}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,38,40,0)_45%,rgba(43,38,40,0.14)_100%)]" />
                  </Link>

                  <div className="flex h-full flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-black/50">
                      <span>{post.authorName ?? 'Taylor Vanderwolk'}</span>
                      <span aria-hidden>·</span>
                      <span>{post.dateTime ? <time dateTime={post.dateTime}>{post.dateLabel}</time> : post.dateLabel}</span>
                      {post.readingTime ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{post.readingTime} min read</span>
                        </>
                      ) : null}
                    </div>

                    <h3 className="mt-4 font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                      <Link href={`/blog/${post.slug}`} className="transition-opacity duration-200 hover:opacity-80">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-4 max-w-none text-[0.98rem] leading-8 text-neutral-700 line-clamp-4">{post.excerpt}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex min-h-[44px] items-center pt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]"
                    >
                      Read Article
                      <span aria-hidden className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.8rem] border border-[rgba(0,0,0,0.06)] bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.05)] lg:col-span-3">
            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-black/45">Journal update</p>
            <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </MarketingSection>
  );
}
