import ProductGuideCard from './ProductGuideCard';

interface GuideProductGridProps {
  modules: Array<{
    id: string;
    productName: string;
    description: string;
    imageUrl?: string;
    retailerLabel?: string;
    ctaLabel: string;
    destinationUrl: string;
    partnerId: string;
  }>;
  guideId: string;
  preview?: boolean;
}

export default function GuideProductGrid({ modules, guideId, preview = false }: GuideProductGridProps) {
  if (modules.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-charcoal mb-4">Recommended Products</h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Based on expert analysis and real parent feedback, these options consistently rank highest for quality and value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module) => (
            <ProductGuideCard
              key={module.id}
              productName={module.productName}
              description={module.description}
              imageUrl={module.imageUrl}
              retailerLabel={module.retailerLabel}
              ctaLabel={module.ctaLabel}
              destinationUrl={module.destinationUrl}
              guideId={guideId}
              partnerId={module.partnerId}
              preview={preview}
            />
          ))}
        </div>
      </div>
    </section>
  );
}