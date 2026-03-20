import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function GuideDecisionBlock({
  title = 'Use this category as a fit check',
  description = 'The goal is not to admire the category. It is to figure out whether it actually makes daily life easier.',
  fitSummary,
  fitBullets,
  notFitSummary,
  notFitBullets,
  signatureMoment,
  decisionLinks = [],
}: {
  title?: string;
  description?: string;
  fitSummary: string;
  fitBullets: readonly string[];
  notFitSummary: string;
  notFitBullets: readonly string[];
  signatureMoment?: string | null;
  decisionLinks?: Array<{
    label: string;
    href: string;
  }>;
}) {
  return (
    <RevealOnScroll>
      <section className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Fit check</p>
          <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f4_0%,#f8efe6_100%)] p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">This is for you if</p>
            <p className="mt-3 text-base leading-relaxed text-neutral-700">{fitSummary}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              {fitBullets.map((bullet) => (
                <li key={bullet} className="text-base leading-relaxed text-neutral-700">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FCFAFB] p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-black/48">This may not be your best fit if</p>
            <p className="mt-3 text-base leading-relaxed text-neutral-700">{notFitSummary}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              {notFitBullets.map((bullet) => (
                <li key={bullet} className="text-base leading-relaxed text-neutral-700">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {decisionLinks.length > 0 ? (
          <div className="mt-6 rounded-xl border border-black/6 bg-[#FCFAFB] p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-black/48">Keep moving</p>
            <div className="mt-4 flex flex-col gap-3">
              {decisionLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="group flex min-h-[44px] items-center justify-between gap-4 rounded-xl border border-stone-200/70 bg-white px-4 py-3 text-base font-medium text-charcoal transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.22)] hover:shadow-sm"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-1">
                    -&gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {signatureMoment ? (
          <div className="mt-6 rounded-xl border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">TMBC note</p>
            <p className="mt-2 text-base leading-relaxed text-[var(--color-accent-dark)]/92">{signatureMoment}</p>
          </div>
        ) : null}
      </section>
    </RevealOnScroll>
  );
}
