import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { StrollerLifestyleMatch } from '@/lib/guides/strollerHub';

export default function GuideLifestyleSelector({
  id,
  title,
  items,
}: {
  id?: string;
  title: string;
  items: StrollerLifestyleMatch[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section id={id} className="space-y-6">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Lifestyle selector</p>
        <h2 className="font-serif text-[1.85rem] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="group flex h-full flex-col rounded-[1.35rem] border border-neutral-200 bg-white p-5 transition hover:border-[#D7A1AF] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(215,161,175,0.5)] focus-visible:ring-offset-4 sm:rounded-2xl sm:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF1F3] text-[var(--color-accent-dark)]">
              <GuideGlyph icon={item.icon} />
            </div>

            <h3 className="mt-4 font-serif text-[1.35rem] leading-tight tracking-tight text-neutral-900 sm:mt-5 sm:text-[1.55rem]">
              {item.title}
            </h3>

            <p className="mt-3 max-w-[40ch] text-sm leading-6 text-neutral-700 sm:leading-relaxed">{item.description}</p>

            <div className="mt-auto pt-5 sm:pt-6">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/80">Recommended</p>
              <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <span>{item.recommendation}</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  -&gt;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
