import Image from 'next/image';
import Link from 'next/link';

type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  highlights?: string[];
  imageSrc: string;
  imageAlt: string;
};

export default function HeroSection({
  eyebrow = 'Taylor-Made Baby Co.',
  title,
  description,
  primaryCtaHref = '/consultation',
  primaryCtaLabel = 'Book a Consultation',
  secondaryCtaHref = '/guides',
  secondaryCtaLabel = 'Explore the Guides',
  highlights = [],
  imageSrc,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-[linear-gradient(180deg,#fbf7f2_0%,#f4ece3_100%)]">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(232,154,174,0.16)_0%,rgba(232,154,174,0)_70%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-16 lg:px-10">
        <div className="relative z-[1]">
          <p className="text-[0.78rem] uppercase tracking-[0.3em] text-[var(--color-accent-dark)]/80">
            {eyebrow}
          </p>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-script text-[2.2rem] leading-none text-[var(--color-accent-dark)] sm:text-[2.6rem]">
              Taylor&apos;s
            </span>
            <span className="pb-2 text-[0.72rem] uppercase tracking-[0.22em] text-black/45">
              trusted edit
            </span>
          </div>

          <h1 className="mt-4 max-w-[12ch] font-serif text-[2.95rem] leading-[0.95] tracking-[-0.055em] text-neutral-900 sm:text-[3.4rem] lg:text-[4.65rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-[40rem] text-[1.02rem] leading-8 text-neutral-700 md:text-[1.12rem]">
            {description}
          </p>

          {highlights.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(196,156,94,0.24)] bg-white/85 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-800 shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={primaryCtaHref} className="btn btn--primary w-full sm:w-auto">
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryCtaHref} className="btn btn--secondary w-full sm:w-auto">
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        <div className="relative z-[1]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-x-6 top-6 z-[1] flex flex-wrap gap-2">
              <span className="rounded-full bg-black/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white">
                Baby Gear Advisor
              </span>
              <span className="rounded-full bg-white/88 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-neutral-800">
                Baby Preparation Advisor
              </span>
            </div>

            <div className="relative aspect-[4/4.6] overflow-hidden sm:aspect-[4/4.2]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.18)_100%)]" />
            </div>
          </div>

          <div className="relative -mt-10 ml-auto max-w-[18rem] rounded-[1.6rem] border border-[rgba(196,156,94,0.2)] bg-white/92 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
              What Taylor helps you sort
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">
              Strollers, infant car seats, registry decisions, nursery setup, and the buying timeline that makes the
              whole process feel steadier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
