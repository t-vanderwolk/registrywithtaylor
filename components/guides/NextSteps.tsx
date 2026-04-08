import {
  GUIDE_SECTION_FRAME_CLASSNAME,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
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
      <section className={GUIDE_SECTION_FRAME_CLASSNAME}>
        <GuideSectionHeading eyebrow="Next Steps" title={title} description={description} />

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
