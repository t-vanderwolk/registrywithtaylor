import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import EndBowDivider from '@/components/layout/EndBowDivider';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import ServiceFeatureRow from '@/components/home/ServiceFeatureRow';
import { Body, Lead, SectionTitle } from '@/components/Typography';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Co. — Modern Baby Preparation',
  description:
    'Taylor-Made Baby Co. delivers calm, private guidance so expecting parents can prepare confidently without overwhelm.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Co. hero background',
});

export default function HomePage() {
  const secondaryCtaClass =
    'btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';

  const features = [
    'Clarity First',
    'Calm Over Chaos',
    'Strategy > Trends',
    'Smart, Not Sprawling',
  ];
  const serviceOffers = [
    {
      label: 'Registry',
      title: 'Registry Curation',
      description: 'Build a registry that fits your space, routines, and priorities — without the overwhelm spiral.',
      bullets: ['Category-by-category clarity', 'Smart timing + what to skip'],
      image: '/assets/services/registry-guidance.jpg',
      alt: 'Registry planning editorial',
      href: '/services/registry',
    },
    {
      label: 'Nursery',
      title: 'Nursery & Home Setup',
      description: 'Create a calm flow from day one — layout, essentials, and systems that make life easier.',
      bullets: ['Space planning + must-haves', 'Organization that stays realistic'],
      image: '/assets/services/nursery-design.jpg',
      alt: 'Nursery design editorial',
      href: '/services/nursery',
    },
    {
      label: 'Lifestyle',
      title: 'Gear Planning & Personal Shopping',
      description: 'Research-backed guidance so you can choose well — for your car, your walk, your travel, your baby.',
      bullets: ['Shortlists tailored to you', 'Tradeoffs explained simply'],
      image: '/assets/services/personal-shopping.jpg',
      alt: 'Personal shopping editorial',
      href: '/services/personal-shopping',
    },
  ];

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          eyebrow="Taylor-Made Baby Co."
          title="Baby prep, simplified."
          subtitle="Because parenthood should start with confidence, not confusion."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          secondaryCta={{ label: 'View Services', href: '/services' }}
          tagline="Private · Personalized · No pressure"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Taylor-Made Baby Co. hero background"
          className="hero-bottom-fade hero-home-radial pb-16 z-20"
          showRibbon
          ribbonEnhanced
          contentStyle={{
            backgroundImage:
              'radial-gradient(circle at 24% 34%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.5) 44%, rgba(248,244,240,0.2) 72%, rgba(248,244,240,0) 100%)',
            borderRadius: '1.5rem',
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 2.8vw, 2rem)',
          }}
        />

        <MarketingSection
          tone="white"
          container="default"
          className="relative !pt-24 md:!pt-28"
        >
          <h2 className="section-title text-center">
            There’s a lot of advice out there.
          </h2>

          <p className="mt-6 text-[var(--color-muted)] max-w-xl mx-auto text-center">
            Most of it loud. Some of it helpful. Very little of it tailored to you.
          </p>

          <p className="mt-6 max-w-2xl mx-auto text-center">
            Between registry lists, social media trends, and well-meaning opinions,
            it’s easy to feel pressured to buy everything immediately.
          </p>

          <div className="mt-6 mx-auto w-16 h-px bg-[var(--color-border-soft)]" />
        </MarketingSection>

        <MarketingSection
          container="default"
          className="bg-[var(--color-ivory)] py-32"
        >
          <div className="clarity-grid mx-auto max-w-6xl">

            {/* LEFT COLUMN — Text (two stacked blocks) */}
            <div className="clarity-left">

              {/* TOP TEXT BLOCK: headline, body, CTA */}
              <div className="space-y-8 max-w-xl">
                <SectionTitle className="text-4xl lg:text-5xl leading-tight !mb-0">
                  What is a baby planner?
                </SectionTitle>

                <div className="space-y-6 text-lg leading-relaxed">
                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    Think of it like a wedding planner — but for life with a newborn.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    Your doctor handles the medical care.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    I handle the practical preparation.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    A baby planner helps you decide what you actually need, when you need it, and how it fits into your real life — from registry strategy and nursery layout to thoughtful purchasing timelines.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    It’s not about buying everything on the internet.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    It’s about building a plan that makes sense for your space, your routines, and your comfort level.
                  </Body>

                  <Body className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                    Because bringing home a baby is a life event — and no one hands you the playbook.
                  </Body>
                </div>

                <Lead className="!m-0 max-w-[62ch] text-[var(--color-muted)]">
                  That’s where calm, intentional planning comes in.
                </Lead>

                <Link
                  href="/how-it-works"
                  className={secondaryCtaClass}
                >
                  How It Works →
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN — Editorial Image (full height) */}
            <div className="clarity-image-col">
              <div className="clarity-image-shell">
                
                <Image
                  src="/assets/editorial/growing-with-confidence.jpg"
                  alt="Growing with confidence editorial image"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>

        </MarketingSection>

     {serviceOffers.map((service, index) => {
       const rhythmClass = index === 1 ? 'lg:-mt-10' : index === 2 ? 'lg:-mt-6' : '';

       return (
          <div key={service.title} className={rhythmClass}>
            <ServiceFeatureRow
              sectionHeader={index === 0 ? 'Service Preview' : undefined}
              eyebrow={service.label}
              title={service.title}
              description={service.description}
             bullets={service.bullets}
             image={service.image}
             alt={service.alt}
             href={service.href}
             tone={index % 2 === 0 ? 'ivoryWarm' : 'white'}
             reverse={index % 2 === 0}
             priority={index === 0}
           />
         </div>
       );
     })}

      {/* Founder Authority */}
      <MarketingSection
        tone="ivoryWarm"
        container="narrow"
        className="relative overflow-visible !pt-20 md:!pt-24"
      >
        <div className="mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            A Personal Note from Taylor
          </h3>

          <p className="mt-6 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
            After years in the baby gear industry — guiding families through registries,
            nursery builds, and major purchasing decisions — I saw how often preparation
            turned into pressure. 
          </p>

          <p className="mt-4 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
            Taylor-Made Baby Co. was created to replace overwhelm with clarity —
            so you can prepare intentionally, not reactively.
          </p>

          <div className="mt-8">
            <Link href="/about" className={secondaryCtaClass}>
              Meet Taylor <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 bottom-0 z-20 w-screen -translate-x-1/2 translate-y-0 md:translate-y-[4%]">
          <EndBowDivider className="origin-center scale-y-[0.8]" />
        </div>
      </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection
          tone="ivoryWarm"
          spacing="spacious"
          container="default"
          className="!border-t-0 !pt-12 md:!pt-16"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Editorial Intro */}
            <div className="space-y-6">

              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
                From The Blog
              </p>

              <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-tight">
                Thoughtful guidance for modern parents
              </h2>

              <p className="text-lg text-[var(--color-muted)] max-w-lg">
                Honest, grounded conversations about baby gear, 
                preparation, and making decisions with clarity — 
                not pressure.
              </p>

              <Link
                href="/blog"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View All Articles →
              </Link>

            </div>

            {/* Featured Article Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[rgba(0,0,0,0.05)] p-10 space-y-6">

              <h3 className="text-2xl font-serif text-[var(--text-primary)]">
                The Art of the Registry
              </h3>

              <p className="text-[var(--color-muted)] leading-relaxed">
                How to prepare for baby without overbuying, 
                overspending, or feeling overwhelmed.
              </p>

              <Link
                href="/blog/the-art-of-the-registry"
                className={secondaryCtaClass}
              >
                Read the Article →
              </Link>

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
              Begin with a complimentary consultation and move forward with clarity — grounded, intentional, and even a little exciting.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book Your Complimentary Consultation
              </Link>
            </div>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
