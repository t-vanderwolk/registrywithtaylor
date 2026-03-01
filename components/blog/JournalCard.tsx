import Link from 'next/link';
import { Body, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';

type JournalCardProps = {
  title: string;
  slug: string;
  category: string;
  excerpt?: string | null;
  dateLabel: string;
  dateTime?: string;
  className?: string;
};

export default function JournalCard({
  title,
  slug,
  category,
  excerpt,
  dateLabel,
  dateTime,
  className = '',
}: JournalCardProps) {
  return (
    <MarketingSurface
      className={[
        'marketing-card-hover flex h-full flex-col justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="space-y-5">
        <p className="text-sm text-charcoal/55">
          {dateTime ? <time dateTime={dateTime}>{dateLabel}</time> : dateLabel}
        </p>

        <span className="block text-xs uppercase tracking-[0.2em] text-charcoal/50">
          {category}
        </span>

        <H3 className="font-serif leading-tight tracking-tight text-neutral-900">
          <Link href={`/blog/${slug}`} className="transition-opacity duration-200 hover:opacity-80">
            {title}
          </Link>
        </H3>

        {excerpt && <Body className="text-charcoal/72">{excerpt}</Body>}
      </div>

      <div className="pt-8">
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-sm uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900"
        >
          <span className="link-underline">Read</span>
          <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
    </MarketingSurface>
  );
}
