import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCardRouter from '@/components/guides/GuideCardRouter';
import GuideCTA from '@/components/guides/GuideCTA';
import GuideSignOff from '@/components/guides/GuideSignOff';
import NextSteps, { type NextStepsLink } from '@/components/guides/NextSteps';
import type { GuideHubLink } from '@/lib/guides/hubs';

export default function GuideJourneyFooter({
  finalThought,
  takeaways = [],
  signOff,
  nextSteps,
  nextStepsTitle,
  nextStepsDescription,
  blogRecommendations = [],
  blogTitle = 'From the blog',
  blogDescription = 'Use these reads when you want narrower comparisons, buying timing, or a few practical product examples without reopening the whole question.',
  consultationEnabled = true,
  consultationHref,
  consultationLabel,
  consultationDescription,
  className = '',
}: {
  finalThought?: string;
  takeaways?: string[];
  signOff?: string;
  nextSteps: NextStepsLink[];
  nextStepsTitle?: string;
  nextStepsDescription?: string;
  blogRecommendations?: GuideHubLink[];
  blogTitle?: string;
  blogDescription?: string;
  consultationEnabled?: boolean;
  consultationHref?: string;
  consultationLabel?: string | null;
  consultationDescription?: string;
  className?: string;
}) {
  if (!finalThought && takeaways.length === 0 && nextSteps.length === 0 && blogRecommendations.length === 0 && !consultationEnabled && !signOff) {
    return null;
  }

  return (
    <div className={['space-y-8', className].filter(Boolean).join(' ')}>
      {finalThought ? (
        <section className="rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_45px_rgba(58,36,43,0.08)] md:p-8">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Final Thought</p>
          <p className="mt-4 text-base leading-8 text-[#4B3641] md:text-lg">{finalThought}</p>
        </section>
      ) : null}

      {takeaways.length > 0 ? (
        <GuideBulletSection
          eyebrow="Takeaways"
          title="Takeaways"
          description="If you only keep the short version, keep these."
          items={takeaways}
        />
      ) : null}

      {nextSteps.length > 0 ? (
        <NextSteps
          title={nextStepsTitle}
          description={nextStepsDescription}
          links={nextSteps}
        />
      ) : null}

      {blogRecommendations.length > 0 ? (
        <GuideCardRouter
          eyebrow="From the blog"
          title={blogTitle}
          description={blogDescription}
          cards={blogRecommendations.slice(0, 3)}
          ctaLabel="Read article"
        />
      ) : null}

      {consultationEnabled ? (
        <GuideCTA
          href={consultationHref}
          ctaLabel={consultationLabel}
          description={consultationDescription}
        />
      ) : null}

      {signOff ? <GuideSignOff signature={signOff} /> : null}
    </div>
  );
}
