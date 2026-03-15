import Image from 'next/image';
import Link from 'next/link';
import BlogCardActions from '@/components/blog/BlogCardActions';
import CategoryTag from '@/components/blog/CategoryTag';
import { isRemoteImageUrl, resolveBlogCoverImage } from '@/lib/blog/images';
import { getBlogCategoryLabel } from '@/lib/blogCategories';

type BlogCardProps = {
  title: string;
  slug: string;
  category: string;
  coverImage?: string | null;
  excerpt?: string | null;
  dateLabel: string;
  dateTime?: string;
  readingTime?: number | null;
  authorName?: string;
  className?: string;
};

export default function BlogCard({
  title,
  slug,
  category,
  coverImage,
  excerpt,
  dateLabel,
  dateTime,
  readingTime,
  authorName = 'Taylor Vanderwolk',
  className = '',
}: BlogCardProps) {
  const coverImageSrc = resolveBlogCoverImage(coverImage, category);
  const shouldSkipOptimization = isRemoteImageUrl(coverImageSrc);

  return (
    <article className={['tmbc-blog-card group flex h-full flex-col', className].filter(Boolean).join(' ')}>
      <Link href={`/blog/${slug}`} className="tmbc-blog-card__media relative block w-full overflow-hidden rounded-xl">
        <div className="h-full w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,246,242,0.98)_100%)] p-3">
          <div className="relative h-full w-full">
            <Image
              src={coverImageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              loading="lazy"
              unoptimized={shouldSkipOptimization}
            />
          </div>
        </div>
      </Link>

      <div className="card-content flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--tmbc-blog-soft-text)]">
          <CategoryTag label={getBlogCategoryLabel(category)} />
          <span aria-hidden className="text-black/25">
            ·
          </span>
          <span>By {authorName}</span>
          {readingTime ? (
            <>
              <span aria-hidden className="text-black/25">
                ·
              </span>
              <span>{readingTime} min read</span>
            </>
          ) : null}
          <span aria-hidden className="text-black/25">
            ·
          </span>
          <span>{dateTime ? <time dateTime={dateTime}>{dateLabel}</time> : dateLabel}</span>
        </div>

        <h3 className="text-[var(--tmbc-blog-charcoal)]">
          <Link href={`/blog/${slug}`} className="transition-opacity duration-200 hover:opacity-80">
            {title}
          </Link>
        </h3>

        {excerpt ? <p className="mt-4 text-[15px] leading-7 text-[var(--tmbc-blog-soft-text)]">{excerpt}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex min-h-[44px] items-center text-sm uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)] transition-colors duration-200 hover:text-[var(--tmbc-blog-charcoal)]"
          >
            <span className="link-underline">Read Article</span>
            <span aria-hidden className="ml-1">→</span>
          </Link>
          <BlogCardActions slug={slug} title={title} />
        </div>
      </div>
    </article>
  );
}
