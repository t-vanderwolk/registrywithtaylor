import type { StrollerRealityCheckCard } from '@/lib/guides/strollerHub';

export default function StrollerRealityCheck({
  id,
  title,
  cards,
}: {
  id?: string;
  title: string;
  cards: StrollerRealityCheckCard[];
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section id={id} className="space-y-6">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Reality check</p>
        <h2 className="font-serif text-[1.85rem] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
        <p className="max-w-[70ch] text-[0.98rem] leading-relaxed text-neutral-700">
          The size decision is usually where stroller shopping stops being theoretical. A stroller can sound efficient online and still feel
          like too much once it lives in your trunk or hallway.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-stone-200/80 bg-white p-5 text-center shadow-[0_12px_30px_rgba(0,0,0,0.03)] sm:p-6"
          >
            <h3 className="font-serif text-[1.32rem] leading-tight tracking-tight text-neutral-900 sm:text-[1.55rem]">{card.title}</h3>

            <div className="mt-5 space-y-3">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/80">Pros</p>
              <ul className="space-y-2 text-sm leading-relaxed text-neutral-700">
                {card.pros.map((pro) => (
                  <li key={`${card.title}-${pro}`}>• {pro}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/80">Tradeoff</p>
              <p className="text-sm leading-relaxed text-neutral-700">{card.tradeoff}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
