import Image from 'next/image';
import SiteShell from '@/components/SiteShell';
import HowItWorksAnalytics from '@/components/analytics/HowItWorksAnalytics';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import CTASection from '@/components/marketing/CTASection';
import ServiceCards from '@/components/marketing/ServiceCards';
import TrustStrip from '@/components/marketing/TrustStrip';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { servicePackages, trustStripItems } from '@/lib/marketing/siteContent';

export const metadata = buildMarketingMetadata({
  title: 'How It Works | Taylor-Made Baby Co.',
  description:
    'See how Taylor-Made Baby Co. helps expecting parents move from overwhelmed to clear on baby gear, registry decisions, nursery setup, and what to do next.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  bullets: string[];
};

type OutcomeCard = {
  title: string;
  description: string;
};

type SearchParams = Promise<{ error?: string }> | undefined;

const processSteps: ProcessStep[] = [
  {
    step: 'Step One',
    title: 'Start with your real questions',
    description:
      'This is where the noise starts to settle. Bring the registry questions, the stroller confusion, the nursery thoughts, and the feeling that everything suddenly sounds urgent.',
    bullets: [
      'Sort what feels most overwhelming right now',
      'Figure out which categories deserve attention first',
      'Get direction on gear, registry, nursery, and timing decisions',
      'Leave with a clearer next step',
    ],
  },
  {
    step: 'Step Two',
    title: 'Build a plan that fits your life',
    description:
      'Once the priorities are clear, the decisions get more practical. Your car, storage, layout, routines, budget, and daily life should shape the plan. Not someone else’s nursery reveal.',
    bullets: [
      'Narrow the shortlist',
      'Match recommendations to your home and routine',
      'Refine the registry without the clutter',
      'Make stroller and car seat decisions with real context',
    ],
  },
  {
    step: 'Step Three',
    title: 'Move forward with more confidence',
    description:
      'By the time baby arrives, the goal is not perfection. It is feeling prepared, knowing why you chose what you chose, and not panic-buying three things at 11:47 PM.',
    bullets: [
      'A registry that makes more sense',
      'A clearer purchasing timeline',
      'A nursery built for daily life',
      'More confidence in the big-ticket decisions',
    ],
  },
];

const outcomeCards: OutcomeCard[] = [
  {
    title: 'A registry with less filler',
    description: 'Know what belongs on the list, what can wait, and what never needed to be there in the first place.',
  },
  {
    title: 'Smarter buying decisions',
    description: 'Buy with a plan instead of reacting to every roundup, recommendation, or sale countdown.',
  },
  {
    title: 'A nursery that works',
    description: 'It does not need to look like Pinterest. It needs to work at 2:14 AM.',
  },
  {
    title: 'More confidence in baby gear',
    description: 'Make stroller, car seat, and everyday gear decisions with far less second-guessing.',
  },
];

const consultationHighlights = [
  'Bring the questions that keep reopening the same six tabs',
  'Get direction on stroller, car seat, nursery, registry, and timing decisions',
  'Figure out what deserves attention now and what can wait',
  'Leave with a calmer sense of what the next step should be',
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 pt-2 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4 text-sm leading-relaxed text-neutral-700 md:text-base">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function HowItWorksPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <SiteShell currentPath="/how-it-works">
      <HowItWorksAnalytics>
        <main className="site-main">
          <Hero
            className="homepage-hero"
            eyebrow="How It Works"
            title="A calmer way to make baby decisions."
            subtitle="The process is simple: start with your real questions, sort what actually matters, and move forward with a plan that fits your life."
            primaryCta={{ label: 'Book a Consultation', href: '#consultation-request' }}
            secondaryCta={{ label: 'Explore the Guides', href: '/guides' }}
            tagline="No 47-tab research sprint required."
            image="/assets/hero/hero-02.jpg"
            imageAlt="How it works planning process"
            contentClassName="homepage-hero-content"
            staggerContent
          />

          <TrustStrip
            items={trustStripItems}
            title="The process feels simple because the guidance behind it is not."
            description="Taylor brings hands-on baby gear experience, concierge support, nursery planning perspective, and private consultation work to the questions that tend to spiral fastest."
          />

          <MarketingSection tone="ivory" spacing="spacious">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
              <SectionIntro
                align="left"
                eyebrow="The process"
                title="Start with your real questions. Then build a plan around real life."
                description="You do not need a finished registry or strong opinions about travel systems before you reach out. Most parents do not. The goal is to reduce noise, not add homework."
                contentWidthClassName="max-w-2xl"
              />

              <MarketingSurface className="bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/45">What this should feel like</p>
                <p className="mt-6 max-w-none font-serif text-[1.7rem] leading-[1.2] tracking-[-0.03em] text-neutral-900">
                  Less second-guessing. Fewer expensive detours. A much clearer next step.
                </p>
                <p className="mt-5 max-w-none text-sm leading-7 text-neutral-700">
                  Baby prep does not need to look perfect. It needs to make sense when you are tired, busy, and trying
                  to choose what actually fits your home and routine.
                </p>
              </MarketingSurface>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-3">
              {processSteps.map((step) => (
                <MarketingSurface
                  key={step.title}
                  className="flex h-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)]"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
                    {step.step}
                  </p>
                  <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.08] tracking-[-0.035em] text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{step.description}</p>

                  <div className="mt-6 rounded-[1.4rem] border border-[rgba(0,0,0,0.06)] bg-white/88 p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">What this looks like</p>
                    <Checklist items={step.bullets} />
                  </div>
                </MarketingSurface>
              ))}
            </div>
          </MarketingSection>

          <MarketingSection tone="white" spacing="spacious" id="consultation-request">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start lg:gap-14">
              <div>
                <SectionIntro
                  align="left"
                  eyebrow="Start here"
                  title="The first step is a real conversation."
                  description="This is where families get out of research mode and into a clearer plan. Bring the questions, the half-formed shortlist, and the categories that keep reopening the same six tabs."
                  contentWidthClassName="max-w-2xl"
                />

                <Checklist items={consultationHighlights} />

                <p className="mt-8 max-w-2xl text-sm leading-7 text-neutral-600">
                  If it makes sense to keep going, Taylor can recommend the right next layer of support after the call.
                  If not, you still leave with more clarity than you had before.
                </p>

                <div className="mt-8 max-w-2xl overflow-hidden rounded-[1.8rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)] shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
                  <div className="group relative px-6 py-8 sm:px-8 sm:py-10">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[10%] bottom-[18%] top-[22%] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.34)_0%,rgba(232,154,174,0.16)_46%,transparent_78%)] blur-[68px] transition duration-300 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
                    />
                    <Image
                      src="/assets/editorial/welcome.png"
                      alt="Warm editorial image introducing the consultation conversation and next-step planning."
                      width={1386}
                      height={814}
                      sizes="(min-width: 1024px) 40rem, 100vw"
                      className="relative mx-auto h-auto w-full origin-bottom-left scale-[1.04] object-contain drop-shadow-[0_24px_40px_rgba(216,137,160,0.24)] saturate-[1.06] contrast-[1.05] transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07] group-hover:drop-shadow-[0_32px_52px_rgba(216,137,160,0.3)]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <MarketingSurface className="rounded-[2rem] bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f1ea_100%)] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.06)] md:p-10">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/45">Request a consultation</p>
                <h3 className="mt-4 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.035em] text-neutral-900">
                  Share what you want help with most.
                </h3>
                <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">
                  A few basics is enough. Taylor will follow up directly with next steps for your complimentary
                  session.
                </p>

                <div className="mt-8">
                  <ConsultationRequestForm
                    errorCode={params?.error ?? null}
                    returnPath="/how-it-works#consultation-request"
                    successPath="/consultation/confirmation"
                  />
                </div>
              </MarketingSurface>
            </div>
          </MarketingSection>

          <ServiceCards
            packages={servicePackages}
            eyebrow="Ways to Keep Going"
            title="If you want support beyond the first conversation, there is a next step for that."
            description="Some families need one clear answer. Some want a steadier plan for the full baby-prep picture. Both are normal."
          />

          <MarketingSection tone="white" spacing="spacious">
            <SectionIntro
              eyebrow="What families usually leave with"
              title="Usually not a longer shopping list."
              description="Usually a shorter one, a steadier timeline, and a much clearer sense of what to do next."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {outcomeCards.map((card) => (
                <MarketingSurface
                  key={card.title}
                  className="flex h-full flex-col items-center text-center bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]"
                >
                  <h3 className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{card.description}</p>
                </MarketingSurface>
              ))}
            </div>
          </MarketingSection>

          <CTASection
            title="Start with a conversation that makes the next decisions easier."
            description="Baby prep does not need to feel like guesswork. Start with clarity, then build from there."
            note="Start with confidence."
          />
        </main>
      </HowItWorksAnalytics>
    </SiteShell>
  );
}
