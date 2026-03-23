import Link from 'next/link';
import GuideNextStep from '@/components/guides/GuideNextStep';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
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
            <GuideNextStep
              key={`${link.href}-${link.label}`}
              label={link.label}
              href={link.href}
              description={link.description}
              stage={link.stage}
            />
          ))}
        </div>

        <GuideHandwrittenNote
          className="mt-6"
          tone="linen"
          title="You can stop once the next move is obvious."
          description={
            <p>
              This does not need to become a full reading tour. Leave with the page that answers the decision in
              front of you, then let the rest wait its turn.
            </p>
          }
        />
      </section>
    </RevealOnScroll>
  );
}
