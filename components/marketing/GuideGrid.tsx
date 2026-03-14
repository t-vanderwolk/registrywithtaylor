import Image from 'next/image';
import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import SectionIntro from '@/components/ui/SectionIntro';

export type GuideGridItem = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

type GuideGridProps = {
  guides: GuideGridItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  philosophyEyebrow?: string;
  philosophySteps?: string;
  philosophyDescription?: string;
  footerNote?: string;
  footerCtaHref?: string;
  footerCtaLabel?: string;
  columns?: 'three' | 'five';
  className?: string;
  compact?: boolean;
  showCardEyebrows?: boolean;
  cardTextAlign?: 'left' | 'center';
  id?: string;
};

export default function GuideGrid({
  guides,
  eyebrow = 'Baby Gear Guides',
  title = 'Start with the category you are deciding right now.',
  description = 'Use the guide hub like a calm editorial knowledge base: understand the landscape, compare the right options, and move forward with better judgment.',
  philosophyEyebrow,
  philosophySteps,
  philosophyDescription,
  footerNote,
  footerCtaHref,
  footerCtaLabel,
  columns = 'five',
  className = '',
  compact = false,
  showCardEyebrows = true,
  cardTextAlign = 'left',
  id,
}: GuideGridProps) {
  const gridClassName =
    columns === 'three'
      ? 'mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'
      : 'mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';

  return (
    <MarketingSection id={id} tone="white" spacing={compact ? 'default' : 'spacious'} className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      {philosophyEyebrow || philosophySteps || philosophyDescription ? (
        <div className="mx-auto mt-8 max-w-3xl text-center">
          {philosophyEyebrow ? (
            <p className="text-sm tracking-[0.08em] text-black/55">{philosophyEyebrow}</p>
          ) : null}
          {philosophySteps ? (
            <p className="mt-3 font-serif text-[1.45rem] leading-[1.15] tracking-[-0.03em] text-neutral-900 sm:text-[1.6rem]">
              {philosophySteps}
            </p>
          ) : null}
          {philosophyDescription ? (
            <p className="mt-3 max-w-none text-[0.98rem] leading-8 text-neutral-700">{philosophyDescription}</p>
          ) : null}
        </div>
      ) : null}

      <div className={gridClassName}>
        {guides.map((guide) => (
          <div key={guide.slug} className="flex h-full flex-col">
            {showCardEyebrows ? (
              <p className="mb-2 px-1 text-[0.72rem] uppercase tracking-[0.2em] text-black/48 sm:mb-3">{guide.eyebrow}</p>
            ) : null}
            <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.08)] sm:rounded-[1.8rem]">
              <Link href={`/guides/${guide.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={guide.imageSrc}
                  alt={guide.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 18vw, (min-width: 768px) 42vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>

              <div
                className={[
                  'flex h-full flex-col p-5 sm:p-6',
                  cardTextAlign === 'center' ? 'items-center text-center' : '',
                ].join(' ')}
              >
                <h3
                  className={[
                    'font-serif text-[1.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]',
                    cardTextAlign === 'center' ? 'mx-auto max-w-[12rem]' : '',
                  ].join(' ')}
                >
                  <Link href={`/guides/${guide.slug}`} className="transition-opacity duration-200 hover:opacity-80">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{guide.description}</p>
                <Link
                  href={`/guides/${guide.slug}`}
                  className={[
                    'mt-auto inline-flex min-h-[44px] items-center pt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]',
                    cardTextAlign === 'center' ? 'justify-center' : '',
                  ].join(' ')}
                >
                  Explore the Guide
                  <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>

      {footerNote ? (
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-[0.98rem] leading-8 text-neutral-700">{footerNote}</p>
          {footerCtaHref && footerCtaLabel ? (
            <Link href={footerCtaHref} className="btn btn--primary mt-6 w-full sm:w-auto">
              {footerCtaLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </MarketingSection>
  );
}
