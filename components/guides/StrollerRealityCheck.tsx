import type { StrollerRealityCheckCard } from '@/lib/guides/strollerHub';
import ProductCard from '@/components/ui/ProductCard';

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
    <section id={id} className="space-y-6 md:space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Reality check</p>
        <h2 className="font-serif text-[1.65rem] tracking-tight text-neutral-900 sm:text-2xl md:text-3xl lg:text-4xl">{title}</h2>
        <p className="max-w-[70ch] text-[0.95rem] leading-relaxed text-neutral-700 sm:text-[0.98rem]">
          The size decision is usually where stroller shopping stops being theoretical. A stroller can sound efficient online and still feel
          like too much once it lives in your trunk or hallway.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {cards.map((card, index) => (
          <ProductCard
            key={`${card.brand}-${card.productName}`}
            name={card.productName}
            brand={card.brand}
            description={card.review}
            pros={card.pros}
            affiliateUrl={null}
            imageSrc={card.imageUrl ?? null}
            imageAlt={card.imageAlt ?? null}
            category={card.category}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
