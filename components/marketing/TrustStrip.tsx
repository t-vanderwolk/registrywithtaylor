import Image from 'next/image';
import MarketingSection from '@/components/layout/MarketingSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';

type TrustStripItem = {
  title: string;
  description: string;
  logos?: readonly {
    src: string;
    alt: string;
    label: string;
    width: number;
    height: number;
  }[];
};

function authorityLogoClassName(label: string) {
  if (label === 'Lani Car Seat' || label === 'AZ Childproofers') {
    return 'max-h-10';
  }

  if (label === 'Baby Concierge') {
    return 'max-h-9';
  }

  if (label === 'Tot Squad') {
    return 'max-h-8';
  }

  if (label === 'Pottery Barn Kids') {
    return 'max-h-7';
  }

  if (label === 'Albee Baby') {
    return 'max-h-7';
  }

  return 'max-h-8';
}

export default function TrustStrip({
  items,
  eyebrow = 'Why families trust Taylor',
  title = 'Credibility that goes deeper than a registry checklist.',
  description = 'Taylor brings retail baby gear knowledge, nursery-planning perspective, concierge-level support, and real consultation experience to the decisions families tend to second-guess most.',
  className = '',
}: {
  items: readonly TrustStripItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <MarketingSection tone="white" spacing="default" className={className}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        contentWidthClassName="max-w-4xl"
      />

      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {items.map((item) => (
          <MarketingSurface
            key={item.title}
            className="flex h-full flex-col items-center text-center bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)] xl:min-h-[18rem] xl:p-6"
          >
            <div className="flex min-h-[7rem] items-center justify-center sm:min-h-[8.5rem] xl:min-h-[8.75rem]">
              <h3 className="mx-auto max-w-[12rem] font-serif text-[1.22rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-[1.28rem] xl:text-[1.16rem]">
                {item.title}
              </h3>
            </div>
            <p className="mt-auto max-w-none text-[0.95rem] leading-[1.7] text-neutral-700 sm:text-sm sm:leading-[1.75] xl:text-[0.92rem] xl:leading-[1.7]">
              {item.description}
            </p>
            {item.logos?.length ? (
              <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3 xl:pb-1">
                {item.logos.map((logo) => (
                  <div
                    key={logo.label}
                    className="flex min-h-[3.2rem] min-w-[5.75rem] items-center justify-center rounded-[1rem] border border-[rgba(0,0,0,0.06)] bg-white/92 px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] sm:min-h-[3.6rem] sm:min-w-[6.5rem] sm:px-3 sm:py-3 xl:min-h-[3.35rem] xl:min-w-[6rem]"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      sizes="(min-width: 1280px) 8rem, 32vw"
                      className={['h-auto w-auto object-contain', authorityLogoClassName(logo.label)].join(' ')}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </MarketingSurface>
        ))}
      </div>
    </MarketingSection>
  );
}
