import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import SiteShell from '@/components/SiteShell';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type InsightPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  createdAt: Date;
};

const formatInsightDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toInsightExcerpt = (excerpt: string | null, content: string, maxLength = 150) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

export default async function HomePage() {
  const insightPreviews = (await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      createdAt: true,
    },
  })) as InsightPreview[];

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          image="/assets/hero/hero-01.jpg"
          imageAlt=""
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Baby prep, simplified.
            </h1>

            <p className="hero-load-reveal hero-load-reveal--1 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              Because parenthood should start with confidence, not confusion.
            </p>

            <p className="hero-load-reveal hero-load-reveal--2 max-w-2xl text-sm text-neutral-600 leading-relaxed">
              Private baby planning · Registry strategy · Nursery &amp; gear guidance · Brand-trained expertise
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Private Consultation
              </Link>

              <Link
                href="/services"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Services
              </Link>
            </div>

            <p className="hero-load-reveal hero-load-reveal--4 text-sm uppercase tracking-[0.2em] text-charcoal/60">
              Private · Personalized · No pressure
            </p>
          </div>
        </Hero>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="py-24 md:py-28"
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-14 md:items-start">
            {/* LEFT COLUMN */}
            <div>
              <div className="mx-auto max-w-xl text-left">
                <h2 className="mb-6 text-center text-3xl font-serif md:text-left md:text-4xl">
                  There’s no shortage of advice.
                </h2>

                <div className="mb-10 space-y-8 md:space-y-10">
                  <RevealOnScroll delayMs={0}>
                    <p className="text-lg leading-relaxed mb-0">Most of it loud.</p>
                  </RevealOnScroll>
                  <RevealOnScroll delayMs={110}>
                    <p className="text-lg leading-relaxed mb-0">Some of it helpful.</p>
                  </RevealOnScroll>
                  <RevealOnScroll delayMs={220}>
                    <p className="text-lg leading-relaxed mb-0">Very little of it tailored to you.</p>
                  </RevealOnScroll>
                </div>

                <p className="text-lg leading-relaxed mb-8">
                  Between registry lists, social media trends, and well-meaning opinions, it’s easy to feel pressured to
                  buy everything immediately.
                </p>

                <p className="text-lg leading-relaxed mb-10">
                  Preparation shouldn’t feel reactive.
                  <br />
                  It should feel intentional.
                </p>

                <div className="mt-2 hidden border-t border-[var(--color-charcoal)]/10 pt-8 md:block">
                  <p className="text-base md:text-lg italic leading-relaxed text-[var(--color-charcoal)]/80">
                    So what does a baby planner actually do?
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="bg-[linear-gradient(180deg,#f9f4ef_0%,#f4ece5_100%)] rounded-[1.75rem] border border-[rgba(0,0,0,0.05)] p-8 md:p-10 shadow-[0_20px_45px_rgba(0,0,0,0.05)] text-center md:text-left">
              <h3 className="text-2xl font-serif mb-6">
                This is for you if you want preparation to feel calm.
              </h3>

              <RevealOnScroll className="checklist-reveal">
                <ul className="mx-auto max-w-md space-y-6 leading-relaxed text-base text-left md:mx-0">
                  <li className="home-check-item home-check-item--1 flex items-start gap-4">
                    <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                    <span>You want clarity before you start buying</span>
                  </li>
                  <li className="home-check-item home-check-item--2 flex items-start gap-4">
                    <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                    <span>You value thoughtful, design-aware decisions</span>
                  </li>
                  <li className="home-check-item home-check-item--3 flex items-start gap-4">
                    <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                    <span>Guidance over guesswork</span>
                  </li>
                  <li className="home-check-item home-check-item--4 flex items-start gap-4">
                    <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                    <span>Support without pressure</span>
                  </li>
                  <li className="home-check-item home-check-item--5 flex items-start gap-4">
                    <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                    <span>Preparation that feels calm</span>
                  </li>
                </ul>
              </RevealOnScroll>

            </div>
          </div>

          <div className="mt-8 border-t border-[var(--color-charcoal)]/10 pt-6 text-center md:hidden">
            <p className="text-base italic leading-relaxed text-[var(--color-charcoal)]/80">
              So what does a baby planner actually do?
            </p>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="py-20 md:py-24"
        >
          <div className="clarity-grid">
            <div className="clarity-left">
              <div className="space-y-8">
                <RevealOnScroll>
                  <div className="max-w-prose space-y-8">
                    <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 tracking-tight">
                      What Is a Baby Planner?
                    </h2>

                    <div className="space-y-6 text-base md:text-lg leading-relaxed md:leading-loose text-neutral-700">
                      <p>
                        A baby planner is like a wedding planner for early parenthood:
                        a steady guide for the practical side of preparation.
                      </p>

                      <p>
                        Your doctor handles medical care.
                        <br />
                        I handle practical preparation — registry strategy, nursery flow, and major gear decisions.
                      </p>

                      <p className="text-neutral-900 font-medium">
                        I help you sort what matters now, what can wait, and what truly fits your life.
                      </p>

                      <p>
                        Together, we replace overwhelm with a clear, personalized plan so you can prepare intentionally.
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>

                <p className="max-w-prose text-lg leading-relaxed md:leading-loose text-neutral-900 font-medium">
                  This isn’t about buying more.
                  <br />
                  It’s about choosing well.
                </p>
              </div>
            </div>

            <div className="h-full">
              <RevealOnScroll delayMs={180}>
                <div className="clarity-image-shell h-full">
                  <Image
                    src="/assets/editorial/growing-with-confidence.jpg"
                    alt="Growing with confidence editorial image"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Planning Overview — Stacked Editorial Journey */}
          <div className="mt-20 pt-16 md:mt-24 md:pt-20 border-t border-[rgba(0,0,0,0.08)]">
            {/* Section Intro */}
            <div className="mb-14 md:pl-4">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                A Thoughtful Path to Preparation
              </h2>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-[60ch]">
                How Families Typically Work With Me
              </p>
            </div>

            <div className="space-y-16 md:space-y-20">
              {/* -------- Pillar 01 -------- */}
              <div className="group transition-transform duration-300 hover:-translate-y-1">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Text Column */}
                  <div>
                    <RevealOnScroll>
                      <p className="block text-sm md:text-6xl font-serif tracking-[0.25em] md:tracking-normal text-[var(--color-blush)]/75 mb-3 md:mb-5">
                        01
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                        Registry Clarity
                      </h3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-[60ch]">
                        We begin by refining what truly belongs on your registry — guided by brand-trained insight,
                        lifestyle alignment, and long-term practicality.
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Brand-informed recommendations</li>
                        <li>• Clear “buy now vs later” prioritization</li>
                        <li>• Registry structure built around your real life</li>
                      </ul>
                    </RevealOnScroll>
                  </div>

                  {/* Image Column */}
                  <RevealOnScroll delayMs={330}>
                    <div className="relative">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                          src="/assets/editorial/registry.jpg"
                          alt="Curated baby registry planning session"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>

              <div className="border-t border-neutral-200" />

              {/* -------- Pillar 02 -------- */}
              <div className="group transition-transform duration-300 hover:-translate-y-1">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Image Column */}
                  <RevealOnScroll delayMs={330} className="order-2 md:order-1">
                    <div className="relative">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                          src="/assets/editorial/nursery.jpg"
                          alt="Calm and functional nursery design"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Text Column */}
                  <div className="order-1 md:order-2">
                    <RevealOnScroll>
                      <p className="block text-sm md:text-6xl font-serif tracking-[0.25em] md:tracking-normal text-[var(--color-blush)]/75 mb-3 md:mb-5">
                        02
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                        Home & Nursery Preparation
                      </h3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-[60ch]">
                        Next, we translate your vision into a space that feels calm,
                        functional, and ready for daily life with baby.
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Layout and furniture planning</li>
                        <li>• Safety-focused recommendations</li>
                        <li>• Sourcing and implementation guidance</li>
                      </ul>
                    </RevealOnScroll>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200" />

              {/* -------- Pillar 03 -------- */}
              <div className="group transition-transform duration-300 hover:-translate-y-1">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Text Column */}
                  <div>
                    <RevealOnScroll>
                      <p className="block text-sm md:text-6xl font-serif tracking-[0.25em] md:tracking-normal text-[var(--color-blush)]/75 mb-3 md:mb-5">
                        03
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                        Intentional Gear Planning
                      </h3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-[60ch]">
                        Finally, we design the daily systems — strollers, car seats, carriers —
                        chosen with longevity, safety, and real routines in mind.
                      </p>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Stroller + car seat strategy</li>
                        <li>• Real-world usage planning</li>
                        <li>• Streamlined daily systems</li>
                      </ul>
                    </RevealOnScroll>
                  </div>

                  {/* Image Column */}
                  <RevealOnScroll delayMs={330}>
                    <div className="relative">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                          src="/assets/editorial/gear.jpg"
                          alt="Thoughtfully selected baby gear essentials"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="btn btn--secondary min-h-[48px] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Full Services <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="relative overflow-visible py-24 md:py-28"
        >
          <p className="mt-6 text-sm text-center leading-relaxed text-[#a68449] md:hidden">
            Baby Gear Specialist · Brand-Trained Expertise · Private Planning for Modern Families
          </p>

          <div className="mt-6 hidden rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.05)] md:block">
            <div className="hidden md:grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
              <p>Baby Gear Specialist</p>
              <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand Trained Expertise</p>
              <p>Private Planning for Modern Families</p>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto text-center space-y-6">
            <RevealOnScroll>
              <p className="text-xl font-serif text-neutral-900">
                &ldquo;Taylor helped us feel calm, confident, and completely prepared. We invested in what mattered — and
                avoided what didn&rsquo;t.&rdquo;
              </p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <p className="text-sm text-neutral-600">
                — First-Time Parents
              </p>
            </RevealOnScroll>
          </div>

          <div className="mt-14 max-w-4xl mx-auto rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-[#F7F4EF] px-6 py-24 md:px-12 md:py-24 text-center">
            <h3 className="font-serif text-3xl md:text-4xl">
              A Personal Note from Taylor
            </h3>

            <RevealOnScroll>
              <div>
                <p className="mt-6 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
                  With years immersed in premium baby retail, national pilot programs, and independent consulting,
                  I&apos;ve guided families through registries, nursery builds, and real purchasing decisions.
                </p>

                <p className="mt-4 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
                  I translate product complexity into clear next steps, so you can choose what truly fits your home and
                  routine with confidence.
                </p>

                <p className="mt-4 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
                  Taylor-Made Baby Co. was created to replace overwhelm with clarity — so you can prepare intentionally,
                  not reactively.
                </p>
              </div>
            </RevealOnScroll>

            <div className="mt-8">
              <Link
                href="/about"
                className="btn btn--primary btn-underline-subtle min-h-[48px] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Meet Taylor <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

        </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="py-24 md:py-28"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {/* Left Editorial Intro */}
            <div className="space-y-6 md:max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
                From The Blog
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-6">
                Insights
              </h2>

              <p className="text-neutral-600 leading-relaxed">
                Honest, grounded conversations about baby gear,
                preparation, and making decisions with clarity —
                not pressure.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-neutral-300 px-8 py-3 text-sm tracking-wide text-[var(--color-charcoal)] transition-colors duration-200 hover:border-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] md:w-auto"
            >
              View All Articles →
            </Link>
          </div>

          <div className="mt-12 flex flex-col space-y-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            {insightPreviews.length > 0 ? (
              insightPreviews.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 90}>
                  <article className="group rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-[0_12px_26px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-[2px]">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] mb-3">
                      {formatInsightDate(post.createdAt)}
                    </p>
                    <h3 className="text-xl font-serif text-[var(--text-primary)] mb-3">{post.title}</h3>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                      {toInsightExcerpt(post.excerpt, post.content)}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-6 inline-flex min-h-[44px] items-center text-sm tracking-wide text-[var(--text-primary)] underline underline-offset-4 hover:opacity-70 transition"
                    >
                      Read
                      <span
                        aria-hidden
                        className="ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[3px]"
                      >
                        →
                      </span>
                    </Link>
                  </article>
                </RevealOnScroll>
              ))
            ) : (
              <p className="text-[var(--color-muted)]">No articles published yet.</p>
            )}
          </div>
        </MarketingSection>

        <FinalCTA className="!pt-24 !pb-28 md:!py-20" />
      </main>
    </SiteShell>
  );
}
