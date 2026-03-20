import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type HomeTransitionTone = 'white' | 'ivory' | 'blush' | 'linen';

const TONE_CLASSES: Record<HomeTransitionTone, string> = {
  white: 'bg-white',
  ivory: 'bg-[linear-gradient(180deg,#fbf7f3_0%,#f7f1ea_100%)]',
  blush: 'bg-[linear-gradient(180deg,#fff8f7_0%,#f9eff1_100%)]',
  linen: 'bg-[linear-gradient(180deg,#f8f4ee_0%,#f4eee6_100%)]',
};

export default function HomeTransitionSection({
  id,
  eyebrow,
  title,
  body,
  secondaryLine,
  cta,
  tone = 'white',
  titleClassName = '',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body: string;
  secondaryLine?: string;
  cta?: {
    href: string;
    label: string;
  };
  tone?: HomeTransitionTone;
  titleClassName?: string;
}) {
  return (
    <section id={id} className={`relative overflow-hidden py-20 md:py-24 ${TONE_CLASSES[tone]}`.trim()}>
      {tone === 'linen' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 12px), linear-gradient(rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px)',
            backgroundSize: '12px 12px',
          }}
        />
      ) : null}

      <div className="relative mx-auto max-w-4xl px-6">
        <RevealOnScroll>
          <div className="text-center">
            {eyebrow ? (
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">{eyebrow}</p>
            ) : null}
            <h2
              className={[
                'mx-auto mt-4 max-w-3xl font-serif text-[2rem] leading-[1.04] tracking-[-0.04em] text-neutral-900 sm:text-[2.45rem]',
                titleClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-8 text-neutral-700">{body}</p>
            {secondaryLine ? <p className="mx-auto mt-3 max-w-2xl text-[1rem] leading-8 text-neutral-700">{secondaryLine}</p> : null}
            {cta ? (
              <div className="mt-8">
                <Link
                  href={cta.href}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(196,156,94,0.16)] bg-white/78 px-5 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  {cta.label}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
