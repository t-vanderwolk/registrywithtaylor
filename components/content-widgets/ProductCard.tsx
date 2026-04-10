import type { ReactNode } from 'react';
import BlogProductInsightCard from '@/components/blog/BlogProductInsightCard';

type ProductLink = {
  label: string;
  url: string;
};

export default function ProductCard({
  brand,
  productName,
  category,
  review,
  bestFor,
  standout,
  pros,
  affiliateLinks,
  imageUrl,
  imageAlt,
  position = 1,
}: {
  brand: string;
  productName: string;
  category?: string;
  review: ReactNode;
  bestFor: ReactNode;
  standout?: ReactNode;
  pros: ReactNode[];
  affiliateLinks: ProductLink[];
  imageUrl?: string | null;
  imageAlt?: string | null;
  position?: number | string;
}) {
  return (
    <BlogProductInsightCard
      name={productName}
      brand={brand}
      description={review}
      details={[
        { label: 'Best for', content: bestFor },
        { label: 'Standout', content: standout || pros[0] || 'Thoughtfully selected for this guide.' },
        {
          label: 'What to know',
          content:
            pros.length > 1 ? (
              <ul className="space-y-2">
                {pros.slice(0, 3).map((pro, index) => (
                  <li key={`${productName}-pro-${index}`} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]/58" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            ) : (
              'Use this as a grounding example, not as proof that every premium feature deserves a place in your shortlist.'
            ),
        },
      ]}
      links={affiliateLinks}
      imageSrc={imageUrl}
      imageAlt={imageAlt}
      category={category ?? 'Product Example'}
      position={position}
    />
  );
}
