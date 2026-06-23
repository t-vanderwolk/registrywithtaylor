import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Free Baby Gear Tools | Taylor-Made Baby Co.',
  description:
    'Free baby-gear tools to narrow the noise before you book, buy, or add everything to your registry: the stroller quiz, the stroller finder, and the travel-system compatibility checker.',
  path: '/resources',
  imagePath: '/assets/hero/hero-04.jpg',
  imageAlt: 'Free baby gear tools from Taylor-Made Baby Co.',
});

type ToolCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

const tools: ToolCard[] = [
  {
    title: 'Stroller Quiz',
    description: 'Find the stroller category that actually fits your life.',
    href: '/tools/stroller-quiz',
    cta: 'Take the Quiz',
    image: '/assets/editorial/gear.jpg',
    imageAlt: 'Stroller quiz',
  },
  {
    title: 'Stroller Finder',
    description: 'Browse strollers by brand, type, price, and features.',
    href: '/tools/stroller-finder',
    cta: 'Browse Strollers',
    image: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller finder',
  },
  {
    title: 'Travel System Tool',
    description: 'Check stroller and infant car seat compatibility before you buy the wrong adapter.',
    href: '/tools/travel-system',
    cta: 'Check Compatibility',
    image: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Travel system compatibility checker',
  },
];

export default function ResourcesPage() {
  return (
    <SiteShell currentPath="/resources">
      <main className="site-main">
        <PageViewTracker path="/resources" pageType="other" />

        <Hero
          className="homepage-hero"
          eyebrow="Free Tools"
          title="Free Baby Gear Tools"
          subtitle="Not sure where to start? These tools are built to help you narrow the noise before you book, buy, or add everything to your registry."
          primaryCta={{ label: 'Book a Registry Consult', href: '/book' }}
          image="/assets/hero/hero-04.jpg"
          imageAlt="Baby gear planning tools"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Interactive tools"
            title="Get unstuck on the big gear decisions."
            description="Built to give you a clear next step in just a few minutes — free, no account required."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-[rgba(215,161,175,0.22)] bg-white shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(55,40,46,0.09)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{c.title}</h3>
                  <p className="mt-2 flex-1 text-[0.92rem] leading-[1.6] text-neutral-600">{c.description}</p>
                  <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-5 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-white transition group-hover:bg-[var(--color-cta-pink-hover)]">
                    {c.cta}
                    <span aria-hidden className="transition duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
              Want the calmer starting point?
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[2.4rem]">
              Get the Baby Prep Guide
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-7 text-neutral-600">
              A calm, practical starting point for expecting parents who want to make smarter registry,
              nursery, stroller, and gear decisions — without spiraling through 47 tabs and a TikTok
              comment section.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <NewsletterCapture />
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
