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
      <section className="rounded-[1.65rem] border border-stone-200/70 bg-white/94 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-5 md:rounded-[1.8rem] md:p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Fit check</p>
          <h2 className="font-serif text-[1.6rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl">{title}</h2>
          <p className="max-w-[72ch] text-[0.95rem] leading-6 text-neutral-700 sm:text-sm sm:leading-7">{description}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="rounded-[1.35rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f4_0%,#f8efe6_100%)] p-4 sm:p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">This is for you if</p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{fitSummary}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              {fitBullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-6 text-neutral-700">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] p-4 sm:p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">This may not be your best fit if</p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{notFitSummary}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              {notFitBullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-6 text-neutral-700">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {decisionLinks.length > 0 ? (
          <div className="mt-6 rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Keep moving</p>
            <div className="mt-3 flex flex-col gap-2">
              {decisionLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="text-sm font-medium text-[var(--color-accent-dark)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {signatureMoment ? (
          <div className="mt-6 rounded-[1.25rem] border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] px-4 py-3.5 sm:py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">TMBC note</p>
            <p className="mt-2 text-[0.94rem] leading-6 text-[var(--color-accent-dark)]/92 sm:text-[0.98rem] sm:leading-7">{signatureMoment}</p>
          </div>
        ) : null}
      </section>
    </RevealOnScroll>
  );
}
