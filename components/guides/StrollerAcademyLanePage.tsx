import Image from 'next/image';
import Link from 'next/link';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ComparisonTable from '@/components/guides/academy/ComparisonTable';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideProductExampleCard from '@/components/guides/GuideProductExampleCard';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import {
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
} from '@/lib/guides/experience';
import { getGuideSignOff } from '@/lib/guides/editorialSystem';
import { dedupeTextItems, normalizeGuideLinks } from '@/lib/guides/guideFlow';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';
import {
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
  type StrollerAcademyLane,
} from '@/lib/guides/strollerAcademy';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const STROLLER_SUBGUIDE_HERO = {
  src: '/assets/editorial/strollers.png',
  alt: 'Editorial stroller image for TMBC stroller lane guides.',
} as const;

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-[rgba(215,161,175,0.18)] bg-[rgba(255,251,252,0.9)] px-4 py-4 shadow-[0_10px_30px_rgba(58,36,43,0.06)]">
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[#A15B72]">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-[#2F2430]">{value}</p>
    </div>
  );
}

function NextStepCard({
  href,
  title,
  description,
  ctaLabel,
  eyebrow = 'Next Step',
}: {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(58,36,43,0.12)]"
    >
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.38rem] leading-[1.05] tracking-[-0.03em] text-[#2F2430] sm:text-[1.55rem]">{title}</h3>
      <p className="mt-3 text-[0.96rem] leading-7 text-[#5B4B55] sm:text-[0.98rem]">{description}</p>
      <span className="mt-auto pt-5 text-sm font-semibold text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

function buildLaneFitChecklistSections(lane: StrollerAcademyLane) {
  return [
    {
      title: 'Strong fit if',
      description: lane.worksForSummary,
      items: lane.worksForBullets.slice(0, 4).map((bullet) => ({
        label: bullet,
        status: 'check' as const,
      })),
    },
    {
      title: 'Pause and compare if',
      description: lane.notBestFitSummary,
      items: lane.notBestFitBullets.slice(0, 4).map((bullet) => ({
        label: bullet,
        status: 'watch' as const,
      })),
    },
  ];
}

function formatDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function StrollerAcademyLanePage({
  guide,
  sourceRoute,
  displayDate,
  readingTime,
}: {
  guide: GuideArticleRecord;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
}) {
  const lane = getStrollerAcademyLane(guide.slug);
  if (!lane) {
    return null;
  }

  const allLanes = getStrollerAcademyLanes();
  const laneIndex = allLanes.findIndex((entry) => entry.slug === lane.slug);
  const normalizedLaneIndex = laneIndex >= 0 ? laneIndex + 1 : 1;
  const compareLinks = lane.compareAgainst
    .map((slug) => getStrollerAcademyLane(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const comparisonRows = [lane, ...compareLinks].map((entry) => ({
    title: entry.title,
    bestFor: entry.bestFor,
    tradeoff: entry.tradeoff,
    everydayFeel: entry.everydayFeel,
    href: entry.href,
    isCurrent: entry.slug === lane.slug,
  }));
  const breadcrumbs = getGuideBreadcrumbs({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const blogRecommendations = getGuideBlogRecommendations({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const guideHeroImage = resolveGuideHeroImage({
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    topicCluster: guide.topicCluster,
    imageSrc: guide.heroImageUrl,
    imageAlt: guide.heroImageAlt,
  });
  const displayHeroImage = guideHeroImage.src
    ? guideHeroImage
    : STROLLER_SUBGUIDE_HERO;
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(displayHeroImage.src);
  const introParagraphs = dedupeTextItems(
    [
      lane.heroDescription,
      lane.worksForSummary,
      lane.signatureMoment,
      guide.excerpt?.trim(),
    ],
    3,
  );
  const whatPeopleGetWrong = dedupeTextItems(
    [
      'Choosing the lane for a hypothetical future instead of for the routine that already exists.',
      'Testing the showroom push and skipping the fold, the lift, and the trunk reality.',
      `Assuming ${lane.shortTitle.toLowerCase()} is automatically smarter because the category sounds more ambitious.`,
      lane.notBestFitSummary,
    ],
    4,
  );
  const takeaways = dedupeTextItems(
    [
      lane.worksForSummary,
      lane.notBestFitSummary,
      lane.buyNote,
      lane.signatureMoment,
    ],
    4,
  );
  const nextSteps = normalizeGuideLinks(
    [
      {
        href: '/academy/gear/stroller-foundations',
        label: 'Back to Stroller Foundations',
        description: 'Return to the main academy stroller module if you want the wider category map again.',
        stage: 'Start' as const,
      },
      ...(compareLinks[0]
        ? [
            {
              href: compareLinks[0].href,
              label: `Compare ${compareLinks[0].shortTitle}`,
              description: compareLinks[0].definition,
              stage: 'Compare' as const,
            },
          ]
        : []),
      {
        href: '/academy/gear/travel-systems',
        label: 'Open Travel Systems',
        description: 'Useful once compatibility and infant-seat questions start affecting the stroller decision.',
        stage: 'Refine' as const,
      },
      {
        href: '/academy/registry/where-to-register',
        label: 'Bring This Into Registry',
        description: 'Use the lane choice to keep the registry shortlist tighter and a lot less random.',
        stage: 'Refine' as const,
      },
    ],
    4,
  );
  const signOff = getGuideSignOff({
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
  });

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,rgba(215,161,175,0.16),transparent_28%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.28),transparent_30%),linear-gradient(180deg,#fdf8f5_0%,#fbf1f4_36%,#fffdfa_100%)]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
        <div className="space-y-12">
          <GuideBreadcrumbs items={breadcrumbs} />

          <section className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(252,247,249,0.98)_0%,rgba(251,245,239,0.98)_52%,rgba(255,251,252,0.98)_100%)] px-5 py-7 shadow-[0_26px_70px_rgba(58,36,43,0.10)] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.26)_0%,rgba(215,161,175,0)_72%)] blur-2xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(243,216,196,0.32)_0%,rgba(243,216,196,0)_72%)] blur-2xl" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-end">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">
                  TMBC Academy · Stroller Category
                </p>
                <h1 className="mt-4 max-w-[12ch] font-serif text-[2.3rem] leading-[0.96] tracking-[-0.05em] text-[#2F2430] sm:text-[3.3rem] md:text-[3.8rem]">
                  {lane.title}
                </h1>
                <p className="mt-5 max-w-[44rem] text-[1rem] leading-7 text-[#4B3641] sm:text-[1.08rem] sm:leading-8">
                  {lane.heroDescription || guide.excerpt?.trim()}
                </p>
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#8F4C62]">
                  Updated {formatDate(displayDate)} · {readingTime} min read
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="#lane-fit"
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62] sm:w-auto"
                  >
                    Review This Lane
                  </Link>
                  <Link
                    href={compareLinks[0]?.href || '/academy/gear/stroller-foundations'}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/82 px-6 py-3 text-center text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
                  >
                    {compareLinks[0] ? `Compare ${compareLinks[0].shortTitle}` : 'Back to Stroller Foundations'}
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <HeroStat label="Lane" value={`${normalizedLaneIndex} of ${allLanes.length}`} />
                  <HeroStat label="Best For" value={lane.bestFor} />
                  <HeroStat label="Tradeoff" value={lane.tradeoff} />
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(251,245,239,0.98),rgba(247,231,236,0.92))] shadow-[0_18px_42px_rgba(58,36,43,0.10)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={displayHeroImage.src}
                    alt={displayHeroImage.alt}
                    fill
                    sizes="(min-width: 1024px) 24rem, 100vw"
                    className="object-contain p-5 sm:p-8"
                    unoptimized={shouldSkipHeroImageOptimization}
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/86 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8">
            <AcademyProgressBar
              current={normalizedLaneIndex}
              total={allLanes.length}
              label="Stroller category guide progress"
            />
          </section>

          <section className="rounded-[1.95rem] border border-[rgba(215,161,175,0.18)] bg-white/90 px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Editorial Intro</p>
            <div className="mt-5 max-w-[46rem] space-y-5 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1.04rem] sm:leading-8">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
          <section className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Core Considerations</p>
              <h2 className="mt-3 font-serif text-[1.95rem] leading-[0.98] tracking-[-0.04em] text-[#2F2430] sm:text-[2.6rem]">
                What actually defines this lane
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {lane.lessons.map((lesson) => (
                <article
                  key={lesson.title}
                  className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#9F556D]">
                    <GuideGlyph icon={lane.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-[1.58rem] leading-[1.02] tracking-[-0.03em] text-[#2F2430] sm:text-[1.8rem]">
                    {lesson.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">{lesson.body}</p>
                </article>
              ))}
            </div>
          </section>

          <ExpertTipCallout
            eyebrow="Everyday Feel"
            title={lane.everydayFeel}
            body={lane.expertTip}
          />

          <section id="lane-fit" className="space-y-8">
            <ChecklistCardSet
              title={`What this lane means for you.`}
              description="Use this fit check before you let product pages start doing too much of the talking."
              sections={buildLaneFitChecklistSections(lane)}
            />
          </section>

          <ComparisonTable
            title={`Compare ${lane.shortTitle} against the closest neighboring lanes.`}
            description={lane.compareNote}
            rows={comparisonRows}
          />

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">What People Get Wrong</p>
              <h2 className="mt-3 font-serif text-[1.9rem] leading-[0.98] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                The mistakes that make a good lane feel wrong
              </h2>
              <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
                These are usually the reasons parents talk themselves out of the right category or buy more stroller than the week actually needs.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {whatPeopleGetWrong.map((item, index) => (
                <article
                  key={item}
                  className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">
                    Mistake {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[#4B3641] sm:text-[1rem] sm:leading-8">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <ChecklistCardSet
            title={`What to test before you buy ${lane.shortTitle}.`}
            description="This is the part that keeps the category grounded. The useful answers show up when the stroller meets a trunk, a doorway, and your actual setup."
            sections={lane.testSections}
          />

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Product Examples</p>
              <h2 className="mt-3 font-serif text-[1.9rem] leading-[0.98] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                Guided examples, not a ranking
              </h2>
              <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
                These examples make the lane more concrete. They are here to sharpen the fit, not to turn the page into a beauty contest with wheels.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {lane.productExamples.map((example, index) => (
                <GuideProductExampleCard
                  key={example.name}
                  name={example.name}
                  brand={example.brand}
                  productName={example.productName}
                  typeLabel={example.typeLabel}
                  whyItMatters={example.shortReview || lane.heroDescription}
                  bestFor={example.bestFor || lane.bestFor}
                  standout={example.standout || lane.everydayFeel}
                  specGroups={example.specGroups}
                  notes={example.notes}
                  pros={example.pros}
                  affiliateUrl={example.affiliateUrl}
                  imageSrc={example.imageSrc}
                  imageAlt={example.imageAlt}
                  category={`${lane.shortTitle} example`}
                  guide={guide.slug}
                  position={index + 1}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Takeaways</p>
              <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                Keep the short version
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {takeaways.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] px-5 py-5 text-[1rem] leading-8 text-[#4B3641]"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <ExpertTipCallout eyebrow="TMBC Buy Rule" title={lane.buyNote} body={lane.signatureMoment} />

          {blogRecommendations.length > 0 ? (
            <GuideCategoryCards
              eyebrow="From the Journal"
              title="Keep learning without reopening the whole question."
              description="Use these reads when you want narrower comparisons, buying timing, or a few practical examples without losing the lane logic."
              cards={blogRecommendations}
              ctaLabel="Read article"
            />
          ) : null}

          <section className="space-y-5">
            <ExpertTipCallout
              eyebrow="Work With Taylor"
              title={`This is where ${lane.shortTitle.toLowerCase()} gets easier to shortlist.`}
              body="If you want help turning this lane into a cleaner shortlist, travel-system plan, or registry decision, this is the right point to get tailored guidance."
            />
            {guide.consultationCtaEnabled !== false ? (
              <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-7">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Personal Guidance</p>
                <p className="mt-3 max-w-3xl text-base leading-8 text-[#5B4B55]">
                  Some stroller decisions need a calmer second opinion, especially when the lane choice touches your car seat plan, travel setup, or registry timing.
                </p>
                <div className="mt-5">
                  <GuideTrackedLink
                    guideId={guide.id}
                    href="/consultation"
                    event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                    sourceRoute={sourceRoute}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                    meta={{
                      ctaLabel: guide.consultationCtaLabel || 'Book a Consultation',
                      label: 'stroller_lane_consultation',
                    }}
                  >
                    {guide.consultationCtaLabel || 'Book a Consultation'}
                  </GuideTrackedLink>
                </div>
              </div>
            ) : null}
          </section>

          <SaveDecisionBar
            title={`Keep the ${lane.shortTitle} decision moving.`}
            description="Use the lane to save, compare, and validate the right options without slipping back into generic stroller browsing."
            actions={[
              { label: 'Back to Stroller Foundations', href: '/academy/gear/stroller-foundations' },
              compareLinks[0]
                ? { label: `Compare ${compareLinks[0].shortTitle}`, href: compareLinks[0].href }
                : { label: 'Compare Another Lane', href: '/academy/gear/stroller-foundations' },
              { label: 'Work with me', href: '/consultation' },
            ]}
          />

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Next Steps</p>
              <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                Keep the path moving
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {nextSteps.map((step) => (
                <NextStepCard
                  key={`${step.href}-${step.label}`}
                  href={step.href}
                  title={step.label}
                  description={step.description}
                  ctaLabel="Open step ->"
                  eyebrow={step.stage ?? 'Next Step'}
                />
              ))}
            </div>
          </section>

          {signOff ? (
            <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-7">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">From Taylor</p>
              <div className="mt-4 whitespace-pre-line text-base leading-8 text-[#4B3641]">{signOff}</div>
            </section>
          ) : null}

          {/* TODO: Replace compare/save/registry placeholders with live TMBC compare and registry wiring once those product actions exist. */}
        </div>
      </div>
    </div>
  );
}
