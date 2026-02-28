import Link from 'next/link';

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
    <article
      className={[
        'flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-[#F5F2EE] p-10 shadow-sm transition-shadow duration-300 hover:shadow-md',
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

        <h3 className="font-serif text-2xl leading-tight tracking-tight text-neutral-900">
          <Link href={`/blog/${slug}`} className="transition-opacity duration-200 hover:opacity-80">
            {title}
          </Link>
        </h3>

        {excerpt && <p className="leading-relaxed text-charcoal/72">{excerpt}</p>}
      </div>

      <div className="pt-8">
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-sm uppercase tracking-[0.14em] text-neutral-800 underline decoration-black/10 underline-offset-4 transition-colors duration-200 hover:text-neutral-900 hover:decoration-black/30"
        >
          Read <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
