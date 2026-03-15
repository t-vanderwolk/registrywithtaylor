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
          ? 'rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fbf1eb_100%)] p-6 md:p-8'
          : 'rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf1eb_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8'
      }
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          {eyebrow ?? 'Decision helper'}
        </p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      <div className={`mt-6 grid gap-4 ${isStrollerHub ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}>
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className={
              isStrollerHub
                ? 'group flex h-full flex-col rounded-[1.6rem] border border-stone-200/70 bg-white/92 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf1eb]'
                : 'group rounded-[1.4rem] border border-black/6 bg-white/88 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)]'
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900">{item.title}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-neutral-700">{item.description}</p>
            {isStrollerHub ? (
              <div className="mt-auto pt-6 text-sm font-semibold text-neutral-900">
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
