import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { CarSeatStageProgressionItem } from '@/lib/guides/carSeatSystem';

export default function GuideStageProgression({
  id,
  title,
  description,
  items,
}: {
  id?: string;
  title: string;
  description?: string;
  items: CarSeatStageProgressionItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="rounded-[1.65rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffaf6_0%,#fbf4ec_100%)] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.05)] sm:p-6 md:rounded-[2rem] md:p-8"
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Stage-based flow</p>
        <h2 className="font-serif text-[1.85rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
        {description ? <p className="max-w-[72ch] text-sm leading-6 text-neutral-700 sm:text-[0.96rem] sm:leading-relaxed">{description}</p> : null}
      </div>

      <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:mt-6 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {items.map((item, index) => {
          const card = (
            <div className="group relative flex h-full flex-col rounded-[1.35rem] border border-black/6 bg-white/90 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] sm:rounded-[1.45rem] sm:p-5">
              {index > 0 ? (
                <div className="mb-4 hidden xl:block">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(196,156,94,0.1)] text-[var(--color-accent-dark)]">
                    -&gt;
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={item.icon} />
                </div>
                <span className="text-[0.62rem] uppercase tracking-[0.16em] text-black/42">{item.stageLabel}</span>
              </div>

              <h3 className="mt-4 font-serif text-[1.16rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.28rem]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{item.description}</p>
            </div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href} className="block min-w-[16rem] snap-start md:min-w-0 md:h-full">
              {card}
            </Link>
          ) : (
            <div key={item.id} className="min-w-[16rem] snap-start md:min-w-0 md:h-full">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
