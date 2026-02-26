import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import EndBowDivider from '@/components/layout/EndBowDivider';
import SiteShell from '@/components/SiteShell';
import prisma from '@/lib/prisma';

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
          showRibbon
          ribbonClassName="translate-y-1 md:translate-y-2"
          className="pb-20 md:pb-24"
          contentClassName="max-w-xl"
          image="/assets/hero/hero-01.jpg"
          imageAlt=""
        >
          <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] mb-6">
            Baby prep, simplified.
          </h1>

          <p className="text-lg md:text-xl text-neutral-700 max-w-[52ch]">
            Because parenthood should start with confidence, not confusion.
          </p>

          <p className="text-base text-neutral-600 mt-4 mb-10 max-w-2xl">
            Bespoke baby planning services · Registry · Nursery · Gear Strategy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule Your Complimentary Consultation
            </Link>

            <Link
              href="/services"
              className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              View Services
            </Link>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Private · Personalized · No pressure
          </p>
        </Hero>

        <section className="bg-white border-t border-b border-charcoal/5">
          <div className="grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
            <p>Baby Gear Specialist</p>
            <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand Trained Expertise</p>
            <p>Private Planning for Modern Families</p>
          </div>
        </section>

        {/* Advice Section */}
        <MarketingSection tone="white" container="wide" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-start">

            {/* LEFT COLUMN */}
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                There’s no shortage of advice.
              </h2>

              <p className="text-lg leading-relaxed mb-8">
                Most of it loud.
                <br />
                Some of it helpful.
                <br />
                Very little of it tailored to you.
              </p>

              <p className="text-lg leading-relaxed mb-8">
                Between registry lists, social media trends, and well-meaning opinions, it’s easy to feel pressured to
                buy everything immediately.
              </p>

              <p className="text-lg leading-relaxed mb-10">
                Preparation shouldn’t feel reactive.
                <br />
                It should feel intentional.
              </p>

              <div className="mt-2 pt-8 border-t border-[var(--color-charcoal)]/10">
                <p className="text-base md:text-lg italic leading-relaxed text-[var(--color-charcoal)]/80">
                  So what does a baby planner actually do?
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:max-w-[520px] bg-[var(--color-ivory)] rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-serif mb-6">
                This is for you if you want preparation to feel calm.
              </h3>

              <ul className="space-y-5 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>You want clarity before you start buying</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>You value thoughtful, design-aware decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Guidance over guesswork</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Support without pressure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Preparation that feels calm</span>
                </li>
              </ul>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection
          container="default"
          className="bg-[var(--color-ivory)] py-24 md:py-32"
        >
          <div className="clarity-grid mx-auto max-w-6xl">
            <div className="clarity-left">
              <div className="max-w-3xl mx-auto md:mx-0 space-y-8">
                <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 tracking-tight">
                  What Is a Baby Planner?
                </h2>

                <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
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

                  <p className="text-neutral-900 font-medium">
                    This isn’t about buying more.
                    <br />
                    It’s about choosing well.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="clarity-image-shell h-full">
                <Image
                  src="/assets/editorial/growing-with-confidence.jpg"
                  alt="Growing with confidence editorial image"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </MarketingSection>

        {/* Planning Overview — Stacked Editorial Journey */}

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="narrow"
          className="py-28 md:py-32"
        >
          <div className="max-w-3xl mx-auto">

            {/* Section Intro */}
            <div className="mb-20 md:pl-4">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                A Thoughtful Path to Preparation
              </h2>

              <p className="text-lg text-muted-foreground max-w-[60ch]">
                How Families Typically Work With Me
              </p>
            </div>

            {/* -------- Pillar 01 -------- */}
            <div className="mb-28 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Text Column */}
                <div>
                  <p className="text-6xl font-serif text-neutral-200 mb-5">
                    01
                  </p>

                  <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                    Registry Clarity
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    We begin by refining what truly belongs on your registry — guided by brand-trained insight,
                    lifestyle alignment, and long-term practicality.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Brand-informed recommendations</li>
                    <li>• Clear “buy now vs later” prioritization</li>
                    <li>• Registry structure built around your real life</li>
                  </ul>

                </div>

                {/* Image Column */}
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/registry.jpg"
                      alt="Curated baby registry planning session"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="border-t border-neutral-200 my-20" />


            {/* -------- Pillar 02 -------- */}
            <div className="mb-28 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Image Column */}
                <div className="relative order-2 md:order-1">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/nursery.jpg"
                      alt="Calm and functional nursery design"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Text Column */}
                <div className="order-1 md:order-2">
                  <p className="text-6xl font-serif text-neutral-200 mb-5">
                    02
                  </p>

                  <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                    Home & Nursery Preparation
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    Next, we translate your vision into a space that feels calm,
                    functional, and ready for daily life with baby.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Layout and furniture planning</li>
                    <li>• Safety-focused recommendations</li>
                    <li>• Sourcing and implementation guidance</li>
                  </ul>

                </div>

              </div>
            </div>

            <div className="border-t border-neutral-200 my-20" />


            {/* -------- Pillar 03 -------- */}
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Text Column */}
                <div>
                  <p className="text-6xl font-serif text-neutral-200 mb-5">
                    03
                  </p>

                  <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                    Intentional Gear Planning
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    Finally, we design the daily systems — strollers, car seats, carriers —
                    chosen with longevity, safety, and real routines in mind.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Stroller + car seat strategy</li>
                    <li>• Real-world usage planning</li>
                    <li>• Streamlined daily systems</li>
                  </ul>

                </div>

                {/* Image Column */}
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/gear.jpg"
                      alt="Thoughtfully selected baby gear essentials"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Full Services <span aria-hidden>→</span>
              </Link>
            </div>

          </div>
        </MarketingSection>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xl font-serif text-neutral-900">
            &ldquo;Taylor helped us feel calm, confident, and completely prepared. We invested in what mattered — and
            avoided what didn&rsquo;t.&rdquo;
          </p>
          <p className="text-sm text-neutral-600">
            — First-Time Parents
          </p>
        </div>
      </section>

      {/* Founder Authority */}
      <MarketingSection
        tone="ivory"
        container="narrow"
        className="group relative overflow-visible !pt-20 md:!pt-24"
      >
        <div className="mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            A Personal Note from Taylor
          </h3>

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

          <div className="mt-8">
            <Link
              href="/about"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Meet Taylor <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
          <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72] translate-y-1 md:translate-y-2" />
        </div>
      </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="!py-28 md:!py-32"
        >
          <div className="max-w-6xl mx-auto">

            {/* Left Editorial Intro */}
            <div className="space-y-6 pt-4 md:pt-8 max-w-md">

              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
                From The Blog
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-6">
                Insights
              </h2>

              <p className="text-neutral-600 leading-relaxed max-w-md">
                Honest, grounded conversations about baby gear, 
                preparation, and making decisions with clarity — 
                not pressure.
              </p>

              <Link
                href="/blog"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3 text-sm tracking-wide text-[var(--color-charcoal)] transition-colors duration-200 hover:border-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View All Articles →
              </Link>

            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {insightPreviews.length > 0 ? (
                insightPreviews.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] mb-2">
                      {formatInsightDate(post.createdAt)}
                    </p>
                    <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">{post.title}</h3>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      {toInsightExcerpt(post.excerpt, post.content)}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm tracking-wide underline underline-offset-4 hover:opacity-70 transition"
                    >
                      Read <span aria-hidden>→</span>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-[var(--color-muted)]">No articles published yet.</p>
              )}
            </div>

          </div>
        </MarketingSection>

        {/* Final Call To Action */}
        <MarketingSection tone="blush" container="narrow" spacing="spacious">
          <div className="text-center space-y-8">

            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
              Start with confidence.
            </h2>

            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              Clear, calm preparation starts with one thoughtful conversation.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Complimentary Consultation
              </Link>
            </div>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
