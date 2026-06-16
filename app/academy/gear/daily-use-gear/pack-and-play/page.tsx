import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AcademySectionHeading } from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ClarityCallout from '@/components/academy/ClarityCallout';
import DecisionBlock from '@/components/academy/DecisionBlock';
import HowToDecideBlock from '@/components/academy/HowToDecideBlock';
import NextBestDecisionCard from '@/components/academy/NextBestDecisionCard';
import StartHere from '@/components/academy/StartHere';
import TaylorsNoteCard from '@/components/academy/TaylorsNoteCard';
import WhatDoesntMatterList from '@/components/academy/WhatDoesntMatterList';
import WhatMattersList from '@/components/academy/WhatMattersList';
import YouAreHereCard from '@/components/academy/YouAreHereCard';
import CategoryTag from '@/components/blog/CategoryTag';
import BlogDivider from '@/components/blog/BlogDivider';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import SiteShell from '@/components/SiteShell';
import {
  buildDailyUseGearAcademySubmoduleModule,
  getDailyUseGearAcademySubmoduleCards,
  getDailyUseGearAcademySubmoduleNavigation,
} from '@/lib/academy/dailyUseGearAcademy';
import {
  getConnectedAcademyPaths,
  getModuleDecisionStatement,
  getModuleWhyThisExists,
  getQuickCheckLines,
} from '@/lib/academy/decisionSupport';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import { buildAcademySignatureSystem } from '@/lib/academy/signatureSystem';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { getCaseStudiesForAcademyModule } from '@/lib/caseStudies';

const PATH = '/academy/gear/daily-use-gear/pack-and-play' as const;
const TITLE = 'Pack & Play';
const SUBHEAD =
  'What a pack and play actually is, which two types matter, and how to choose structured, travel, or both without buying the wrong kind of flexible.';
const DESCRIPTION =
  'A decision-first TMBC Academy module on pack and play vs travel crib choices, with clear type breakdowns, real-life usage logic, and intentional imagery.';
const HERO_IMAGE = '/assets/gearpath/travelcribcicco.png';
const HERO_ALT =
  'Portable travel crib set up in a real living space beside a family kitchen.';

const WHAT_IT_IS_PARAGRAPHS = [
  'A pack and play is not one exact product. It is a category of portable sleep-and-set-down spaces that includes sturdier playards and lighter travel cribs.',
  'That is why this section gets confusing so fast. Parents hear one label, then shop across products built for very different jobs.',
  'The calmer way to think about it is simple: some versions are built to stay mostly set up at home, and some are built to move often. Both can be useful. They are not interchangeable.',
] as const;

const HOW_IT_WORKS_PARAGRAPHS = [
  'Structured playards usually start with a raised newborn level. That can be a bassinet insert or an upper sleep surface that keeps baby easier to reach in the early stretch.',
  'Later, that top layer comes out and the lower level becomes the main sleep or play zone. If you expect one setup to do more than one stage, that transition matters.',
  'Travel cribs are usually simpler. Less equipment. Less storage. Less built-in help. That tradeoff can be great when portability is the real job.',
] as const;

const PRO_TIP_PARAGRAPHS = [
  'Look closely at access. A zipper door is helpful if you want older-baby or toddler access without constantly lifting them over the side.',
  'Storage is only a perk if this setup actually lives in one spot. If it is going in and out of the car, more built-in pieces usually means more annoyance.',
  'Fold it, lift it, and imagine doing that while tired. That little reality check saves a lot of optimism later.',
] as const;

const LIFESPAN_PARAGRAPHS = [
  'The newborn stage is where the raised sleep surface earns its keep. Your back will have opinions.',
  'Later, many families use the lower level as a play yard, a travel sleep setup, or a short-term containment zone in the main part of the house.',
  'That does not mean every family needs the same version for every stage. It means the lifespan question should be part of the decision from the start.',
] as const;

const REAL_LIFE_PARAGRAPHS = [
  'A lot of families end up happiest with two answers: one structured playard that stays home, and one lighter travel crib that leaves the house.',
  'That is not extra if the jobs are actually different. It is the same logic as having rain boots and running shoes. Both go on feet. They are not the same plan.',
  'If you want one item to cover everything, decide which compromise you mind less: more bulk or fewer features.',
] as const;

const TYPE_CARDS = [
  {
    title: 'Structured playard',
    label: 'Home base',
    imageSrc: '/assets/gearpath/packandplaygraco.png',
    imageAlt:
      'Structured pack and play with wheels, bassinet insert, changer, and storage organizer.',
    imageFit: 'contain' as const,
    paragraphs: [
      'This is the version that works hardest at home.',
      'Think wheels, bassinet, changer, storage, and a frame that is happier parked in one spot than hauled through an airport.',
      'It makes the most sense when you want a main-floor sleep and diapering station or a setup that stays ready every day.',
    ],
  },
  {
    title: 'Travel crib',
    label: 'Portable',
    imageSrc: '/assets/gearpath/travelcribcicco.png',
    imageAlt: 'Lightweight mesh travel crib set up in a home for portable everyday use.',
    imageFit: 'contain' as const,
    paragraphs: [
      'This is the lighter, simpler lane.',
      'Usually less bulky, easier to carry, and better when this setup will actually move between houses, trips, and closets.',
      'You give up some extras, but you gain a version of portable that feels more believable in real life.',
    ],
  },
] as const;

const DECISION_CARDS = [
  {
    title: 'Always set up',
    result: 'Choose structured',
    body:
      'If this will live in your bedroom, living room, or main floor every day, a structured playard usually makes more sense. The added bassinet, changer, wheels, and storage are useful when the setup stays put.',
  },
  {
    title: 'Actually portable',
    result: 'Choose travel',
    body:
      'If you care most about carry weight, fast setup, and moving it often, go with a travel crib. That is the lane built for real portability, not just theoretical portability on a box.',
  },
  {
    title: 'Different jobs',
    result: 'Choose both',
    body:
      'If you want one setup for daily home use and another for travel, both can be the smartest answer. One item does not need to pretend it loves every job.',
  },
] as const;

const TOP_PICK_GROUPS = [
  {
    title: 'For Daily Use at Home',
    cards: [
      {
        name: "Graco Pack 'n Play Care Suite",
        descriptor:
          'A structured pick with the features people usually mean when they say pack and play.',
        detail:
          'Best when you want a ready-to-go home station with a raised sleep surface, changer, and storage.',
        imageSrc: '/assets/gearpath/packandplaygraco.png',
        imageAlt:
          "Graco Pack 'n Play Care Suite with bassinet and changing attachment on a white background.",
      },
    ],
  },
  {
    title: 'For Travel',
    cards: [
      {
        name: 'Newton Baby Travel Crib & Play Yard',
        descriptor:
          'A travel-first option for families who want a dedicated portable sleep setup instead of a heavier home station.',
        detail:
          'Best when you want the travel lane to stay distinct from the everyday home-base lane.',
        imageSrc: '/assets/nurserypath/newtonnestcrib.png',
        imageAlt: 'Newton Baby Travel Crib & Play Yard in a calm bedroom setting.',
      },
    ],
  },
] as const;

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex min-w-0 flex-wrap items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="max-w-full break-words transition duration-200 hover:text-[#8F4C62]">
                {item.label}
              </Link>
            ) : (
              <span className="max-w-full break-words text-[#8F4C62]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SectionFigure({
  src,
  alt,
  caption,
  fit = 'cover',
}: {
  src: string;
  alt: string;
  caption: string;
  fit?: 'cover' | 'contain';
}) {
  const shouldSkipOptimization = isRemoteImageUrl(src);

  return (
    <figure className="mt-8">
      <div className="tmbc-blog-featured-frame relative aspect-[16/10] overflow-hidden p-4 sm:p-5">
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 896px, 100vw"
            className={fit === 'contain' ? 'object-contain' : 'object-cover'}
            unoptimized={shouldSkipOptimization}
          />
        </div>
      </div>
      <figcaption className="px-1 pt-4 text-[13px] leading-6 text-[var(--tmbc-blog-soft-text)]">
        {caption}
      </figcaption>
    </figure>
  );
}

function TypeCard({
  title,
  label,
  imageSrc,
  imageAlt,
  imageFit,
  paragraphs,
}: {
  title: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  imageFit: 'cover' | 'contain';
  paragraphs: readonly string[];
}) {
  const shouldSkipOptimization = isRemoteImageUrl(imageSrc);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)] shadow-[0_16px_38px_rgba(47,36,48,0.06)]">
      <div className="border-b border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,241,232,0.74)_100%)] p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-white/80">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
            unoptimized={shouldSkipOptimization}
          />
        </div>
      </div>

      <div className="flex h-full flex-col p-5 sm:p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{label}</p>
        <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
          {title}
        </h3>
        <div className="mt-4 space-y-3 text-[0.98rem] leading-8 text-[#5B4B55]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function ChoiceCard({
  title,
  result,
  body,
}: {
  title: string;
  result: string;
  body: string;
}) {
  return (
    <article className="h-full rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,247,250,0.94)_100%)] p-5 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:p-6">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">If</p>
      <h3 className="mt-3 font-serif text-[1.4rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
        {title}
      </h3>
      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Then</p>
      <p className="mt-2 text-[1.05rem] font-semibold leading-8 text-[#2F2430]">{result}</p>
      <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55]">{body}</p>
    </article>
  );
}

function TopPickCard({
  name,
  descriptor,
  detail,
  imageSrc,
  imageAlt,
}: {
  name: string;
  descriptor: string;
  detail: string;
  imageSrc: string;
  imageAlt: string;
}) {
  const shouldSkipOptimization = isRemoteImageUrl(imageSrc);

  return (
    <article className="group h-full overflow-hidden rounded-[1.9rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)] shadow-[0_16px_38px_rgba(47,36,48,0.06)]">
      <div className="border-b border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,241,232,0.74)_100%)] p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-white/80">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4"
            unoptimized={shouldSkipOptimization}
          />
        </div>
      </div>

      <div className="flex h-full flex-col p-5 sm:p-6">
        <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430]">
          {name}
        </h3>
        <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55]">{descriptor}</p>
        <p className="mt-4 text-[0.95rem] leading-7 text-[#5B4B55]">{detail}</p>
        <span className="mt-auto inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(215,161,175,0.24)] bg-white/82 px-4 py-2 text-center text-[0.68rem] uppercase tracking-[0.16em] text-[var(--tmbc-blog-soft-text)]">
          Product example
        </span>
      </div>
    </article>
  );
}

function uniqueItems(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim() ?? '')
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
}

function buildInlineScenarios(
  signatureScenarios: string[],
  caseStudies: ReturnType<typeof getCaseStudiesForAcademyModule>,
) {
  return uniqueItems([
    ...signatureScenarios,
    ...caseStudies.flatMap((study) => study.scenarios.slice(0, 1).map((scenario) => `${study.title}: ${scenario}`)),
  ]).slice(0, 3);
}

function buildProgressMessage(currentIndex: number, total: number) {
  if (currentIndex <= 0) {
    return 'You are early in the Daily Use Gear layer. The point is to buy the real job, not the most flexible-sounding label.';
  }

  if (currentIndex >= total - 1) {
    return "You've completed this layer. Let the next decision stay as specific as this one became.";
  }

  return `You've completed ${currentIndex} ${currentIndex === 1 ? 'layer' : 'layers'}. Now keep the next one smaller than the category label makes it sound.`;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildAcademyPageMetadata({
    defaultTitle: `${TITLE} | Daily Use Gear | TMBC Baby Academy`,
    description: DESCRIPTION,
    path: PATH,
    imagePath: HERO_IMAGE,
    imageAlt: HERO_ALT,
    keywords: [
      TITLE,
      'pack and play vs travel crib',
      'structured playard',
      'travel crib',
      'daily use gear',
    ],
  });
}

export default async function DailyUseGearPackAndPlayPage() {
  const module = buildDailyUseGearAcademySubmoduleModule('pack-and-play');
  const signatureSystem = buildAcademySignatureSystem(module, {
    decisionStatement: getModuleDecisionStatement(module),
    whyThisExists: getModuleWhyThisExists(module),
    quickCheckLines: getQuickCheckLines(module),
  });
  const submoduleCards = getDailyUseGearAcademySubmoduleCards();
  const navigation = getDailyUseGearAcademySubmoduleNavigation('pack-and-play');
  const currentIndex = submoduleCards.findIndex((card) => card.href === PATH);
  const completedSteps = currentIndex > 0 ? submoduleCards.slice(0, currentIndex) : [];
  const progressMessage = buildProgressMessage(currentIndex, submoduleCards.length);
  const connectedPaths = getConnectedAcademyPaths('gear');
  const caseStudies = getCaseStudiesForAcademyModule('pack-and-play', 'gear');
  const inlineScenarios = buildInlineScenarios(signatureSystem.scenarios.items, caseStudies);
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: module.breadcrumb,
      currentPath: PATH,
    }),
    buildAcademyLearningResourceStructuredData({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      breadcrumbs: module.breadcrumb,
      keywords: [
        TITLE,
        'pack and play vs travel crib',
        'Daily Use Gear',
      ],
      teaches: [
        'What a pack and play actually is',
        'The difference between a structured playard and a travel crib',
        'When structured, travel, or both makes the most sense',
        'How lifespan, portability, and setup friction affect the decision',
      ],
      learningResourceType: 'TMBC Academy Module',
    }),
  ];

  return (
    <SiteShell currentPath={PATH}>
      <main className="site-main min-h-0">
        <section className="section-base" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
          <AcademyStructuredData data={structuredData} />

          <article className="tmbc-blog-shell mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-6 md:pb-24 md:pt-12">
            <div className="space-y-12">
              <div className="pt-2">
                <Breadcrumbs items={module.breadcrumb} />
              </div>

              <YouAreHereCard
                trail={module.breadcrumb.map((item) => ({ title: item.label, href: item.href }))}
                progressLabel={`Module ${module.progress.current} of ${module.progress.total} in Daily Use Gear`}
                currentTitle={TITLE}
                currentStepLabel="Daily Use Gear submodule"
                completedSteps={completedSteps.map((card) => ({ title: card.title, href: card.href }))}
                nextStep={navigation.next ? { title: navigation.next.title, href: navigation.next.href } : null}
              />

              <header className="tmbc-blog-hero">
                <div className="tmbc-blog-hero__inner">
                  <div className="tmbc-blog-hero__eyebrow flex flex-wrap items-center gap-3">
                    <CategoryTag label="TMBC Academy" />
                    <CategoryTag label="Gear" />
                    <CategoryTag label="Daily Use Gear" />
                  </div>

                  <div className="tmbc-blog-hero__copy">
                    <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">
                      Module 4 of 6
                    </p>
                    <h1 className="text-[var(--tmbc-blog-charcoal)]">{TITLE}</h1>
                    <p className="excerpt">{SUBHEAD}</p>
                    <p className="academy-handwritten-aside mt-5">buy the job, not the label</p>
                    <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">
                      This module is here to make one thing obvious: the real decision is not whether you want a pack
                      and play. It is whether you need a structured playard, a travel crib, or both.
                    </p>
                    <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1rem]">
                      Once that part is clear, the category gets much less dramatic.
                    </p>
                  </div>

                  <div className="tmbc-blog-meta">
                    <span>Gear path</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                    <span>Decision first</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                    <span>Real-life use</span>
                  </div>

                  <div className="tmbc-blog-hero__divider">
                    <BlogDivider />
                  </div>
                </div>
              </header>

              <div className="tmbc-blog-featured-frame relative mb-10 aspect-[16/10] overflow-hidden p-4 sm:mb-12 sm:p-5">
                <div className="relative h-full w-full">
                  <Image
                    src={HERO_IMAGE}
                    alt={HERO_ALT}
                    fill
                    priority
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <section className="blog-section-soft px-4 sm:px-6">
                <AcademyProgressBar
                  current={module.progress.current}
                  total={module.progress.total}
                  label="You are in the Daily Use Gear buildout phase"
                  stepLabel={`Module ${module.progress.current} of ${module.progress.total}`}
                />
              </section>

              <div className="space-y-8">
                <TaylorsNoteCard
                  title={signatureSystem.taylorsNote.title}
                  body={signatureSystem.taylorsNote.body}
                  supportingLine={signatureSystem.taylorsNote.supportingLine}
                />

                <StartHere
                  title={signatureSystem.startHere.title}
                  description={signatureSystem.startHere.description}
                >
                  {signatureSystem.startHere.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </StartHere>

                <DecisionBlock
                  title={signatureSystem.decisionBlock.title}
                  description={signatureSystem.decisionBlock.description}
                  contrast={signatureSystem.decisionBlock.contrast}
                >
                  <div className="space-y-4 text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                    <p>
                      People use it as shorthand for a structured playard, a travel crib, a main-floor sleep setup,
                      and a backup sleep plan. Those are related ideas. They are not one identical product.
                    </p>
                    <p>
                      That is how families end up buying a heavy home-base setup for travel, or a lightweight travel
                      crib expecting it to replace a daily-use station with storage, changer, and newborn help.
                    </p>
                  </div>
                </DecisionBlock>

                <div className="grid gap-6 lg:grid-cols-2">
                  <WhatMattersList
                    title={signatureSystem.whatMatters.title}
                    items={signatureSystem.whatMatters.items}
                  />
                  <WhatDoesntMatterList
                    title={signatureSystem.whatDoesNotMatter.title}
                    items={signatureSystem.whatDoesNotMatter.items}
                  />
                </div>
              </div>

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="Decision Section"
                  title="What a pack and play actually is"
                  description="This is a category, not one universal product. Start there and the rest gets easier."
                />
                <article className="tmbc-blog mt-6 max-w-none">
                  {WHAT_IT_IS_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
                <SectionFigure
                  src="/assets/gearpath/packplaytravelcrib.png"
                  alt="Comparison lineup showing several portable sleep and play yard formats side by side."
                  caption="One label covers a few different product lanes. That is useful only if you separate the jobs first."
                />
              </section>

              <section className="space-y-6">
                <AcademySectionHeading
                  eyebrow="Decision Section"
                  title="The two versions that matter most"
                  description="This is the split that usually clarifies the entire category."
                />
                <div className="grid gap-6 md:grid-cols-2">
                  {TYPE_CARDS.map((card) => (
                    <TypeCard
                      key={card.title}
                      title={card.title}
                      label={card.label}
                      imageSrc={card.imageSrc}
                      imageAlt={card.imageAlt}
                      imageFit={card.imageFit}
                      paragraphs={card.paragraphs}
                    />
                  ))}
                </div>
              </section>

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="Supporting Context"
                  title="Why the stages matter"
                  description="A lot of the difference comes down to whether you need newborn convenience, lower-level use later, or just lighter portability."
                />
                <article className="tmbc-blog mt-6 max-w-none">
                  {HOW_IT_WORKS_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
                <SectionFigure
                  src="/assets/gearpath/packandplaygraco.png"
                  alt="Structured pack and play showing the raised newborn bassinet level above the lower playard level."
                  caption="The upper newborn setup and the lower later-stage setup are not the same job. That is why the details matter."
                  fit="contain"
                />
              </section>

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="Supporting Context"
                  title="Check the little details before they become daily annoyances"
                  description="This is one of those categories where friction gets loud quickly."
                />
                <article className="tmbc-blog mt-6 max-w-none">
                  {PRO_TIP_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
                <SectionFigure
                  src="/assets/nurserypath/packplaystorage.png"
                  alt="Structured playard with visible side access and lower storage shelf."
                  caption="A zipper door or lower storage can be genuinely useful. It is just not worth paying for if you will not use it."
                />
              </section>

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="Supporting Context"
                  title="This category changes as baby changes"
                  description="The right question is not just whether it works now. It is whether it still makes sense after the newborn stage ends."
                />
                <article className="tmbc-blog mt-6 max-w-none">
                  {LIFESPAN_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
                <SectionFigure
                  src="/assets/gearpath/toddlerpackandplay.png"
                  alt="Toddler using a mesh play yard in a home setting."
                  caption="Later-stage use matters too, especially if you expect this setup to keep earning space after the tiny-baby months."
                />
              </section>

              <HowToDecideBlock
                title="Choose structured, travel, or both based on the actual job"
                intro="You do not need a complicated scoring system here. You need the version of flexible that still feels believable in your routine."
                prioritize={[
                  {
                    condition: 'this setup will stay open in your bedroom, living room, or main floor most days',
                    recommendation:
                      'Prioritize a structured playard with the raised sleep surface or storage features you will genuinely use.',
                  },
                  {
                    condition: 'you will move it between houses, closets, or trips often enough to notice the carry every time',
                    recommendation:
                      'Prioritize a travel crib with a simpler fold, lighter carry, and fewer built-in extras.',
                  },
                  {
                    condition: 'home use and travel are two separate jobs in your week',
                    recommendation:
                      'Prioritize clarity over minimalism. Two answers can be more practical than one compromised answer.',
                  },
                ]}
                avoid={[
                  {
                    condition: 'you are buying the phrase "pack and play" without naming the actual use case',
                    recommendation:
                      'Avoid assuming every version handles home sleep, travel, and daily setup with equal grace.',
                  },
                  {
                    condition: 'the heavier version is already sounding annoying to fold, carry, or store',
                    recommendation:
                      'Avoid talking yourself into features you will resent every time the setup has to move.',
                  },
                  {
                    condition: 'you want one item to cover every stage and every location perfectly',
                    recommendation:
                      'Avoid shopping for a fantasy of universal versatility. Decide which compromise you mind less.',
                  },
                ]}
                scenarios={inlineScenarios}
              />

              <section className="space-y-6">
                <AcademySectionHeading
                  eyebrow="Decision Section"
                  title="When one answer becomes two jobs"
                  description="This is usually the part that makes the category click."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  {DECISION_CARDS.map((card) => (
                    <ChoiceCard
                      key={card.title}
                      title={card.title}
                      result={card.result}
                      body={card.body}
                    />
                  ))}
                </div>
                <div className="tmbc-blog-soft-card px-6 py-6 sm:px-7">
                  <div className="space-y-4 text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                    {REAL_LIFE_PARAGRAPHS.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>

              <ClarityCallout insight="You do not need the most versatile-sounding option. You need the one you will still like after the third fold of the day." />

              <section className="space-y-8">
                <AcademySectionHeading
                  eyebrow="Product Examples"
                  title="A short grid, on purpose"
                  description="You do not need twelve options here. You need a clean example of each lane."
                />

                <div className="space-y-10">
                  {TOP_PICK_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-5">
                      <div>
                        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">
                          {group.title}
                        </p>
                        <h3 className="mt-3 font-serif text-[1.7rem] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal)]">
                          {group.title}
                        </h3>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {group.cards.map((card) => (
                          <TopPickCard
                            key={card.name}
                            name={card.name}
                            descriptor={card.descriptor}
                            detail={card.detail}
                            imageSrc={card.imageSrc}
                            imageAlt={card.imageAlt}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <NextBestDecisionCard
                title="Now that this feels clearer, here is what matters next"
                description="Keep the Daily Use Gear sequence moving while this category is still sorted in your head."
                progressMessage={progressMessage}
                primary={
                  navigation.next
                    ? {
                        title: navigation.next.title,
                        description: navigation.next.description,
                        href: navigation.next.href,
                        ctaLabel: navigation.next.ctaLabel,
                      }
                    : null
                }
                secondary={{
                  title: navigation.hub.title,
                  description: navigation.hub.description,
                  href: navigation.hub.href,
                  ctaLabel: navigation.hub.ctaLabel,
                }}
                connectedPaths={connectedPaths}
              />
            </div>
          </article>
        </section>
      </main>
    </SiteShell>
  );
}
