import Link from 'next/link';
import GuideProductExampleCard from '@/components/guides/GuideProductExampleCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';

export type ProductExampleGroupSection = {
  id: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  examples: GuideProductExampleData[];
};

export default function ProductExampleGroup({
  id,
  eyebrow,
  title,
  description,
  groups,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  groups: ProductExampleGroupSection[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section id={id} className="space-y-5 scroll-mt-28">
      <RevealOnScroll>
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[2.15rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-[3.25rem]">{title}</h2>
          {description ? (
            <p className="max-w-[64ch] text-[1rem] leading-8 text-neutral-700 sm:text-[1.08rem] sm:leading-8">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="space-y-5">
        {groups.map((group, index) => (
          <RevealOnScroll key={group.id} delayMs={index * 80}>
            <div className="rounded-[1.7rem] border border-stone-200/70 bg-white/94 p-5 shadow-[0_16px_38px_rgba(0,0,0,0.04)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-serif text-[1.55rem] leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-[1.72rem]">
                    {group.title}
                  </h3>
                  <p className="mt-2 max-w-[54ch] text-[1rem] leading-8 text-neutral-700">{group.description}</p>
                </div>

                {group.href && group.ctaLabel ? (
                  <Link
                    href={group.href}
                    className="inline-flex items-center gap-2 text-[1rem] font-medium text-[var(--color-accent-dark)]"
                  >
                    <span>{group.ctaLabel}</span>
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                ) : null}
              </div>

              <div className="mt-5 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {group.examples.map((example) => (
                  <GuideProductExampleCard
                    key={`${group.id}-${example.name}`}
                    name={example.name}
                    brand={example.brand}
                    productName={example.productName}
                    imageSrc={example.imageSrc}
                    imageAlt={example.imageAlt}
                    imageHref={example.affiliateUrl}
                    typeLabel={example.typeLabel}
                    whyItMatters={example.shortReview}
                    bestFor={example.bestFor}
                    standout={example.standout}
                    specGroups={example.specGroups}
                    notes={example.notes}
                  />
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
