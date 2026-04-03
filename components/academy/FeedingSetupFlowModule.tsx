import Image from 'next/image';
import Link from 'next/link';
import AcademyJourneyNavigator from '@/components/academy/AcademyJourneyNavigator';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import {
  FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS,
  FEEDING_SETUP_FLOW_BOTTLE_POINTS,
  FEEDING_SETUP_FLOW_BOTTLE_QUOTE,
  FEEDING_SETUP_FLOW_BUY_NOW,
  FEEDING_SETUP_FLOW_BUY_NOW_QUOTE,
  FEEDING_SETUP_FLOW_CLOSE,
  FEEDING_SETUP_FLOW_DECK,
  FEEDING_SETUP_FLOW_DO_NEED,
  FEEDING_SETUP_FLOW_DO_NOT_NEED,
  FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS,
  FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS,
  FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE,
  FEEDING_SETUP_FLOW_FUTURE_MODULES,
  FEEDING_SETUP_FLOW_GENTLE_NOTE,
  FEEDING_SETUP_FLOW_HERO_INTRO,
  FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS,
  FEEDING_SETUP_FLOW_MODULE_INTRO,
  FEEDING_SETUP_FLOW_NEEDS,
  FEEDING_SETUP_FLOW_PATHWAYS,
  FEEDING_SETUP_FLOW_PUMPING_CHECKLIST,
  FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS,
  FEEDING_SETUP_FLOW_PULL_QUOTE,
  FEEDING_SETUP_FLOW_SIMPLE_SETUP,
  FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS,
  FEEDING_SETUP_FLOW_TAKEAWAYS,
  FEEDING_SETUP_FLOW_WAIT_AND_SEE,
} from '@/lib/academy/feedingSetupFlowAcademy';
import { getAcademyModuleData } from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

type ConnectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
};

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#2F2430] sm:text-[2.65rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.05rem]">{description}</p>
      ) : null}
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#D986A2]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PullQuote({ children }: { children: string }) {
  return (
    <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,251,252,0.98)_0%,rgba(252,243,246,0.96)_100%)] px-6 py-6 shadow-[0_20px_48px_rgba(58,36,43,0.07)] sm:px-7 sm:py-7">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">TMBC takeaway</p>
      <p className="mt-4 font-serif text-[1.55rem] leading-[1.14] tracking-[-0.03em] text-[#2F2430] sm:text-[1.95rem]">
        {children}
      </p>
    </div>
  );
}

function ConnectionCard({ eyebrow, title, description, ctaLabel, href }: ConnectionCardProps) {
  const className =
    'flex h-full min-w-0 flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.94)_100%)] p-5 shadow-[0_18px_45px_rgba(58,36,43,0.08)] sm:p-6';

  const content = (
    <>
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
        {title}
      </h3>
      <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55]">{description}</p>
      <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[#8F4C62]">{ctaLabel}</span>
    </>
  );

  if (!href) {
    return <div className={`${className} opacity-80`}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={`${className} transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:shadow-[0_24px_56px_rgba(58,36,43,0.12)]`}
    >
      {content}
    </Link>
  );
}

export default async function FeedingSetupFlowModule() {
  const module = await getAcademyModuleData('feeding-setup-flow');

  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: module.breadcrumb,
      currentPath: module.href,
    }),
    buildAcademyLearningResourceStructuredData({
      title: module.title,
      description: module.description,
      path: module.href,
      breadcrumbs: module.breadcrumb,
      keywords: [...module.decisionBullets, ...module.editorialLinks.map((link) => link.title)],
      teaches: [
        'The main feeding pathways and how flexible they can be.',
        'What tools each feeding pathway may require.',
        'What to buy now versus later.',
        'How pumping and bottles fit into real life.',
        'How to build the setup instead of the fantasy.',
      ],
      hasPart: [
        ...(module.previous
          ? [
              {
                href: module.previous.href,
                title: module.previous.title,
                description: module.previous.description,
              },
            ]
          : []),
        ...(module.related
          ? [
              {
                href: module.related.href,
                title: module.related.title,
                description: module.related.description,
              },
            ]
          : []),
        ...module.editorialLinks.map((link) => ({
          href: link.href,
          title: link.title,
          description: link.description,
        })),
      ],
      learningResourceType: 'TMBC Academy Module',
    }),
  ];

  const connectionCards: ConnectionCardProps[] = [
    ...(module.previous
      ? [
          {
            eyebrow: 'Previous Gear Module',
            title: module.previous.title,
            description: module.previous.description,
            ctaLabel: 'Review previous module ->',
            href: module.previous.href,
          },
        ]
      : []),
    ...FEEDING_SETUP_FLOW_FUTURE_MODULES.map((item) => ({
      eyebrow: 'Coming Soon',
      title: item.title,
      description: item.description,
      ctaLabel: 'Planned next layer',
    })),
    ...(module.related
      ? [
          {
            eyebrow: 'Postpartum Support',
            title: module.related.title,
            description: module.related.description,
            ctaLabel: 'Continue into postpartum ->',
            href: module.related.href,
          },
        ]
      : []),
    ...module.editorialLinks.map((link, index) => ({
      eyebrow: index === 0 ? 'Feeding Guide' : 'Registry Guide',
      title: link.title,
      description: link.description,
      ctaLabel: link.ctaLabel,
      href: link.href,
    })),
  ];

  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.68),transparent_28%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.22),transparent_30%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_34%,#fffdf8_100%)]">
      <AcademyStructuredData data={structuredData} />

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={module.breadcrumb} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 md:pb-12 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.99)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
            <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Gear Journey · Feeding</p>
              <h1 className="mt-4 max-w-[10ch] font-serif text-[2.35rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[4.15rem]">
                {module.title}
              </h1>
              <div className="mt-5 max-w-[38rem] space-y-3 text-[1rem] leading-8 text-[#4B3641] sm:text-[1.18rem] sm:leading-9">
                {FEEDING_SETUP_FLOW_DECK.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-6 max-w-[42rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55]">
                {FEEDING_SETUP_FLOW_HERO_INTRO.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/academy/gear"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,36,43,0.08)]"
                >
                  Back to Gear path
                </Link>
                <Link
                  href="#buy-now-vs-later"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(232,154,174,0.32)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98]"
                >
                  Buy now vs later
                </Link>
              </div>
            </div>

            <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(252,244,247,0.96)_0%,rgba(249,240,231,0.96)_100%)] p-5 sm:p-6 md:p-7">
              <div className="relative min-h-[18rem] flex-1 overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.14)] bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Image
                  src={module.imagePath}
                  alt={module.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="object-contain p-5 sm:p-7"
                />
              </div>

              <div className="mt-5 space-y-4">
                <PullQuote>{FEEDING_SETUP_FLOW_PULL_QUOTE}</PullQuote>
                <div className="rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">
                    Module {module.progress.current} of {module.progress.total}
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[#5B4B55]">
                    This is the bridge module that turns feeding from a product pile into a calmer system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-14 lg:px-10">
        <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-5 py-5 shadow-[0_20px_44px_rgba(58,36,43,0.08)] sm:px-6 sm:py-6">
          <AcademyProgressBar
            current={module.progress.current}
            total={module.progress.total}
            label="Gear path progress"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-5 pb-20 sm:px-8 md:space-y-14 md:pb-24 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_18px_40px_rgba(58,36,43,0.07)] sm:px-8 sm:py-8">
            <SectionHeader
              eyebrow="What This Module Is Really About"
              title="Prepared in a realistic way"
              description="This is not a module about being perfect. It is a module about understanding the jobs inside feeding before the registry or cart starts filling itself."
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_MODULE_INTRO.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <GuideHandwrittenNote
              eyebrow="Taylor's note"
              title="The goal is clarity, not commitment theater."
              description="You can plan for feeding without forcing yourself into one identity before the baby is even here."
              presentation="margin"
              size="compact"
              showEyebrow
              showSignoff={false}
            />
            <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Keep in view</p>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_GENTLE_NOTE}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Feeding Pathways"
            title="The main paths are more flexible than they look online"
            description="Start with the paths themselves before you start buying tools for all four at once."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {FEEDING_SETUP_FLOW_PATHWAYS.map((pathway) => (
              <article
                key={pathway.title}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.07)]"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Pathway</p>
                <h3 className="mt-4 font-serif text-[1.6rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430]">
                  {pathway.title}
                </h3>
                <div className="mt-4 space-y-3 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                  <p>{pathway.description}</p>
                  <p>{pathway.setup}</p>
                  <p>{pathway.appeal}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="What You May Need"
            title="Think in gear categories, not brands"
            description="Use may involve language on purpose here. This is the map, not the shopping list."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {FEEDING_SETUP_FLOW_NEEDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.94)_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]"
              >
                <h3 className="font-serif text-[1.5rem] leading-[1.06] tracking-[-0.04em] text-[#2F2430]">{card.title}</h3>
                <div className="mt-5">
                  <BulletList items={card.items} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="buy-now-vs-later" className="space-y-6 scroll-mt-24">
          <SectionHeader
            eyebrow="Buy Now Vs Later"
            title="Start with the first layer and leave room to learn"
            description="This is the section that saves the most money, shelf space, and emotional energy."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Buy now</p>
              <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-[#2F2430]">
                Build the starting point
              </h3>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_BUY_NOW} />
              </div>
            </article>

            <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Wait and see</p>
              <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-[#2F2430]">
                Let real use decide
              </h3>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_WAIT_AND_SEE} />
              </div>
            </article>
          </div>
          <PullQuote>{FEEDING_SETUP_FLOW_BUY_NOW_QUOTE}</PullQuote>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <SectionHeader
              eyebrow="Pumping In Real Life"
              title="A tool, not a whole personality"
              description="Pumping can help. It can also add time, parts, storage, and logistics fast."
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Think through</p>
            <h3 className="mt-4 font-serif text-[1.72rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430]">
              Where does pumping actually live?
            </h3>
            <div className="mt-6">
              <BulletList items={FEEDING_SETUP_FLOW_PUMPING_CHECKLIST} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <SectionHeader
              eyebrow="Bottles In Real Life"
              title="The bottle is one part. The system is the real category."
              description="This is where compatibility, cleanup, and daily rhythm matter more than a packaging promise."
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6">
              <BulletList items={FEEDING_SETUP_FLOW_BOTTLE_POINTS} />
            </div>
          </div>

          <div className="space-y-6">
            <PullQuote>{FEEDING_SETUP_FLOW_BOTTLE_QUOTE}</PullQuote>
            <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Helpful edit</p>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                When in doubt, buy enough to test the routine. Not enough to commit your entire counter to one theory.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Storage + Cleaning Basics"
            title="The glamorous part? No. The part that makes everything else work? Very much yes."
            description="A feeding setup gets easier when cleanup, storage, and dry-down space are obvious."
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <div className="space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Milk storage basics</p>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
                  Freshly expressed milk can generally be stored
                </h3>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS} />
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Simple setup</p>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
                  A realistic feeding cleanup setup may include
                </h3>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_SIMPLE_SETUP} />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] px-6 py-8 shadow-[0_26px_58px_rgba(58,36,43,0.09)] sm:px-8 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <div>
              <SectionHeader
                eyebrow="TMBC Framework"
                title="Build the setup, not the fantasy"
                description="The biggest feeding mistake is usually trying to solve for every hypothetical version of the future before you have any real data."
              />
              <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/90 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">You do not need</p>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_DO_NOT_NEED} />
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/90 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">You do need</p>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_DO_NEED} />
                </div>
              </article>
            </div>
          </div>

          <div className="mt-8">
            <PullQuote>{FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE}</PullQuote>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Final Thoughts"
            title="Calmer happens faster when the setup stays useful"
            description="You are allowed to start smaller than the internet suggests."
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)]">
            <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <div className="space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_TAKEAWAYS} />
              </div>
              <p className="mt-8 font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#2F2430]">
                {FEEDING_SETUP_FLOW_CLOSE}
              </p>
            </div>

            <GuideHandwrittenNote
              eyebrow="One more thing"
              title="Feeding gets lighter when the plan can flex."
              description="The strongest setup usually looks less like buying confidence and more like leaving yourself room to adapt without starting over."
              tone="white"
              showEyebrow
            />
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Next Steps"
            title="Keep this module connected to the rest of the system"
            description="This page is the bridge. These are the cleanest next stops once you know which part of feeding needs the deeper answer."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {connectionCards.map((card) => (
              <ConnectionCard key={`${card.eyebrow}-${card.title}`} {...card} />
            ))}
          </div>
        </section>

        <AcademyJourneyNavigator currentPathSlug="gear" currentModuleSlug={module.slug} />
      </div>
    </section>
  );
}
