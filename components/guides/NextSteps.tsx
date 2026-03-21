import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideStageLabel } from '@/lib/guides/guideFlow';

export type NextStepsLink = {
  label: string;
  href: string;
  description: string;
  stage?: GuideStageLabel;
};

export default function NextSteps({
  title = 'Next Steps',
  description = 'Every guide should lead somewhere useful. Use these links to keep the decision moving instead of reopening the same question in a new tab.',
  links,
}: {
  title?: string;
  description?: string;
  links: NextStepsLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Next Steps</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
          <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="group rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)]"
            >
              {link.stage ? (
                <span className="inline-flex min-h-[32px] items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
                  {link.stage}
                </span>
              ) : null}
              <h3 className="mt-4 text-[1.22rem] font-medium leading-[1.1] tracking-[-0.02em] text-[#2F2430]">{link.label}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{link.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8F4C62]">
                <span>Open guide</span>
                <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
