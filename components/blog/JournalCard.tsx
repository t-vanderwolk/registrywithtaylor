import Image from 'next/image';
import Link from 'next/link';
import { Body, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { resolveBlogCoverImage } from '@/lib/blog/images';
import { getBlogCategoryLabel } from '@/lib/blogCategories';

type JournalCardProps = {
  title: string;
  slug: string;
  category: string;
  coverImage?: string | null;
  excerpt?: string | null;
  dateLabel: string;
  dateTime?: string;
  className?: string;
};

export default function JournalCard({
  title,
  slug,
  category,
  coverImage,
  excerpt,
  dateLabel,
  dateTime,
  className = '',
}: JournalCardProps) {
  const coverImageSrc = resolveBlogCoverImage(coverImage);

  return (
    <MarketingSurface
      className={[
        'group marketing-card-hover flex h-full flex-col justify-between transition-[transform,box-shadow] duration-300 hover:shadow-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="space-y-6">
        <Link href={`/blog/${slug}`} className="relative block h-56 w-full overflow-hidden rounded-[22px] md:h-60">
          <Image
            src={coverImageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
            unoptimized
          />
        </Link>

        <div className="space-y-5">
          <p className="text-sm text-charcoal/55">
            {dateTime ? <time dateTime={dateTime}>{dateLabel}</time> : dateLabel}
          </p>

          <span className="block text-xs uppercase tracking-[0.2em] text-charcoal/50">
            {getBlogCategoryLabel(category)}
          </span>

          <H3 className="font-serif leading-tight tracking-tight text-neutral-900">
            <Link href={`/blog/${slug}`} className="transition-opacity duration-200 hover:opacity-80">
              {title}
            </Link>
          </H3>

          {excerpt && <Body className="text-charcoal/72">{excerpt}</Body>}
        </div>
      </div>

      <div className="pt-8">
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-sm uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900"
        >
          <span className="link-underline">Read Guide</span>
          <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
    </MarketingSurface>
  );
}
