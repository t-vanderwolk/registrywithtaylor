import Link from 'next/link';
import type { GuideHubDecisionItem } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';

export default function GuideDecisionHelper({
  id,
  title,
  description,
  items,
  variant = 'default',
  eyebrow,
  ctaLabel,
}: {
  id?: string;
  title: string;
  description?: string;
  items: GuideHubDecisionItem[];
  variant?: 'default' | 'stroller-hub';
  eyebrow?: string;
  ctaLabel?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  const isStrollerHub = variant === 'stroller-hub';

  return (
    <section
      id={id}
      className={
        isStrollerHub
          ? 'min-w-0 rounded-[1.75rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fbf1eb_100%)] p-4 sm:p-6 md:rounded-[2rem] md:p-8'
          : 'min-w-0 rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf1eb_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8'
      }
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          {eyebrow ?? 'Decision helper'}
        </p>
        <h2 className="font-serif text-[1.85rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
        {description ? <p className="max-w-[70ch] text-[0.96rem] leading-relaxed text-neutral-700 sm:text-sm sm:leading-7">{description}</p> : null}
      </div>

      <div className={`mt-5 grid min-w-0 gap-4 sm:mt-6 ${isStrollerHub ? 'md:grid-cols-2 2xl:grid-cols-3' : 'md:grid-cols-2'}`}>
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className={
              isStrollerHub
                ? 'group flex min-w-0 h-full flex-col rounded-[1.35rem] border border-stone-200/70 bg-white/92 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf1eb] sm:rounded-[1.6rem] sm:p-5'
                : 'group min-w-0 rounded-[1.4rem] border border-black/6 bg-white/88 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)]'
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-neutral-900 sm:text-sm sm:tracking-[0.12em]">{item.title}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-700 sm:leading-7">{item.description}</p>
            {isStrollerHub ? (
              <div className="mt-auto pt-5 text-sm font-semibold text-neutral-900 sm:pt-6">
                <span>{ctaLabel ?? 'Explore guide'}</span>
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  -&gt;
                </span>
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
