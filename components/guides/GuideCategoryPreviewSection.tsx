import Image from 'next/image';
import Link from 'next/link';
import PostContent from '@/components/blog/PostContent';
import GuideProductExampleCard from '@/components/guides/GuideProductExampleCard';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';

export type GuideCategoryPreviewExample = GuideProductExampleData;

export default function GuideCategoryPreviewSection({
  id,
  title,
  content,
  postId,
  imageSrc,
  imageAlt,
  examples = [],
  href,
  ctaLabel,
  examplesEyebrow = 'Example strollers',
  examplesDescription = 'These are visual anchors to help the category feel real before you open the deeper guide.',
}: {
  id: string;
  title: string;
  content: string;
  postId: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  examples?: GuideCategoryPreviewExample[];
  href?: string;
  ctaLabel?: string;
  examplesEyebrow?: string;
  examplesDescription?: string;
}) {
  const hasExamples = examples.length > 0;
  const hasCta = Boolean(href && ctaLabel);
  const hasVisual = Boolean(imageSrc?.trim());

  return (
    <section className="rounded-[1.45rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfb_0%,#fbf6f1_100%)] p-3.5 sm:p-6 md:rounded-[2rem] md:p-8">
      <div className={`grid gap-4 sm:gap-6 ${hasVisual ? 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_21rem]' : ''}`}>
        <div className="min-w-0">
          <h3
            id={id}
            className="scroll-mt-28 max-w-[18ch] font-serif text-[1.42rem] leading-[1.08] tracking-[-0.02em] text-neutral-900 sm:text-[1.92rem] md:text-[2.32rem]"
          >
            {title}
          </h3>

          <div className="mt-3.5 max-w-[42rem] sm:mt-4">
            <PostContent
              postId={postId}
              content={content}
              className="guide-post-content stroller-guide-content guide-post-content--subsection guide-hub-preview-content"
              variant="plain"
              highlightBrandWordmark={true}
            />
          </div>
        </div>

        {hasVisual ? (
          <div className="rounded-[1.2rem] border border-stone-200/70 bg-[#fcfaf7] p-2.5 sm:rounded-[1.75rem] sm:p-4 md:p-5">
            <div className="relative h-32 sm:h-44 md:h-60">
              <Image
                src={imageSrc!}
                alt={imageAlt?.trim() || title}
                fill
                sizes="(min-width: 1280px) 21rem, (min-width: 768px) 50vw, 100vw"
                className="object-contain object-center p-3"
              />
            </div>
          </div>
        ) : null}
      </div>

      {hasExamples || hasCta ? (
        <div className="mt-5 border-t border-stone-200/70 pt-5 sm:mt-8 sm:pt-8">
          {hasExamples ? (
            <>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">{examplesEyebrow}</p>
                  <p className="mt-1.5 max-w-[58ch] text-[1rem] leading-[1.74] text-neutral-700">{examplesDescription}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {examples.map((example) => (
                  <div key={`${title}-${example.name}`}>
                    <GuideProductExampleCard
                      name={example.name}
                      brand={example.brand}
                      productName={example.productName}
                      imageSrc={example.imageSrc}
                      imageAlt={example.imageAlt}
                      typeLabel={example.typeLabel}
                      bestFor={example.bestFor}
                      standout={example.standout}
                      whyItMatters={example.shortReview}
                      specGroups={example.specGroups}
                      notes={example.notes}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {hasCta ? (
            <Link
              href={href!}
              className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[rgba(215,161,175,0.28)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf6f1] sm:w-auto"
            >
              <span>{ctaLabel}</span>
              <span aria-hidden="true">-&gt;</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
