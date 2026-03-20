import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubIconKey } from '@/lib/guides/hubs';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export type DecisionHelperItem = {
  question: string;
  optionLabel?: string;
  result: string;
  href?: string;
  icon?: GuideHubIconKey;
  ctaLabel?: string;
};

export default function DecisionHelper({
  id,
  eyebrow = 'Decision helper',
  title,
  description,
  items,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: DecisionHelperItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section
        id={id}
        className="rounded-2xl border border-[rgba(215,161,175,0.22)] bg-[rgba(250,247,248,0.96)] p-6 shadow-sm md:p-8"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-2xl text-charcoal md:text-3xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p> : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const content = (
              <div className="flex h-full flex-col rounded-xl border border-[rgba(215,161,175,0.16)] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.12)] text-[var(--color-accent-dark)]">
                    <GuideGlyph icon={item.icon ?? 'strategy'} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/72">
                    {item.optionLabel ?? 'Start here'}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-[1.35rem] leading-[1.08] tracking-tight text-charcoal">{item.question}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-700">{item.result}</p>

                {item.href ? (
                  <div className="mt-auto pt-5 text-sm font-semibold text-charcoal">
                    <span>{item.ctaLabel ?? 'Open guide'}</span>
                    <span aria-hidden="true" className="ml-2">
                      -&gt;
                    </span>
                  </div>
                ) : null}
              </div>
            );

            return item.href ? (
              <Link key={`${item.question}-${item.href}`} href={item.href} className="min-h-[44px]">
                {content}
              </Link>
            ) : (
              <div key={item.question}>{content}</div>
            );
          })}
        </div>
      </section>
    </RevealOnScroll>
  );
}
