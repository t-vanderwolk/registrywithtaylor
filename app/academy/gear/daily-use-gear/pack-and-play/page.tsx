import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AcademySectionHeading } from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import CategoryTag from '@/components/blog/CategoryTag';
import BlogDivider from '@/components/blog/BlogDivider';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import SiteShell from '@/components/SiteShell';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import { isRemoteImageUrl } from '@/lib/blog/images';
import type { AcademyBreadcrumbItem } from '@/lib/academy/content';

const PATH = '/academy/gear/daily-use-gear/pack-and-play' as const;
const TITLE = 'Pack & Play';
const SUBHEAD =
  'What a pack and play actually is, which two types matter, and how to choose structured, travel, or both without buying the wrong kind of flexible.';
const DESCRIPTION =
  'A decision-first TMBC Academy module on pack and play vs travel crib choices, with clear type breakdowns, real-life usage logic, and intentional imagery.';
const HERO_IMAGE = '/assets/gearpath/travelcribcicco.png';
const HERO_ALT =
  'Portable travel crib set up in a real living space beside a family kitchen.';

const BREADCRUMBS: AcademyBreadcrumbItem[] = [
  { label: 'Academy', href: '/academy' },
  { label: 'Gear', href: '/academy/gear' },
  { label: 'Daily Use Gear', href: '/academy/gear/daily-use-gear' },
  { label: TITLE },
];

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
    imageFit: 'cover' as const,
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

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
        {BREADCRUMBS.map((item, index) => (
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

function DecisionCard({
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
          Affiliate link placeholder
        </span>
      </div>
    </article>
  );
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

export default function DailyUseGearPackAndPlayPage() {
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: BREADCRUMBS,
      currentPath: PATH,
    }),
    buildAcademyLearningResourceStructuredData({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      breadcrumbs: BREADCRUMBS,
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
                <Breadcrumbs />
              </div>

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
                  current={4}
                  total={6}
                  label="You are in the Gear buildout phase"
                  stepLabel="Module 4 of 6"
                />
              </section>

              <section className="tmbc-blog-soft-card px-6 py-6 sm:px-7">
                <AcademySectionHeading
                  eyebrow="Orientation Note"
                  title="Pack and play is doing too much work as a phrase"
                  description={
                    <>
                      <p>
                        People use it as shorthand for a structured playard, a travel crib, a main-floor sleep setup,
                        and a backup sleep plan. Those are related ideas. They are not one identical product.
                      </p>
                      <p className="mt-4">
                        That is how families end up buying a heavy home-base setup for travel, or a lightweight travel
                        crib expecting it to replace a daily-use station with storage, changer, and newborn help.
                      </p>
                    </>
                  }
                />
              </section>

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="What It Is"
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
                  eyebrow="Two Types"
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
                  eyebrow="How It Works"
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
                  eyebrow="Pro Tips"
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
                  eyebrow="Lifespan"
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

              <section className="tmbc-editorial-article-shell">
                <AcademySectionHeading
                  eyebrow="Real Life"
                  title="What this often looks like in real houses"
                  description="The neatest answer on paper is not always the one that works best once the routine gets real."
                />
                <article className="tmbc-blog mt-6 max-w-none">
                  {REAL_LIFE_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
                <SectionFigure
                  src="/assets/nurserypath/bedsidepackandplay.png"
                  alt="Pack and play style sleep setup beside an adult bed in a bedroom."
                  caption="Sometimes this category is not about travel at all. Sometimes it is the sleep setup that makes a room-sharing plan work."
                />
              </section>

              <section className="space-y-6">
                <AcademySectionHeading
                  eyebrow="Decision Framework"
                  title="Make the choice the easy way"
                  description="You do not need a complicated scoring rubric here."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  {DECISION_CARDS.map((card) => (
                    <DecisionCard
                      key={card.title}
                      title={card.title}
                      result={card.result}
                      body={card.body}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <AcademySectionHeading
                  eyebrow="Taylor's Top Picks"
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

            </div>
          </article>
        </section>
      </main>
    </SiteShell>
  );
}
