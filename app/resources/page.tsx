import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Free Resources — Tools & Lessons | Taylor-Made Baby Co.',
  description:
    'Free baby-prep tools and lessons: the stroller quiz, the travel-system compatibility checker, the stroller finder, and complete preview lessons on registries, nurseries, and strollers.',
  path: '/resources',
  imagePath: '/assets/editorial/gear.jpg',
  imageAlt: 'Free baby gear tools and lessons from Taylor-Made Baby Co.',
});

type ResourceCard = {
  tag: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

const tools: ResourceCard[] = [
  {
    tag: 'Tool',
    title: 'Stroller Quiz',
    description: 'Answer a few questions about your life and get matched to the stroller category that actually fits.',
    href: '/tools/stroller-quiz',
    image: '/assets/editorial/gear.jpg',
    imageAlt: 'Stroller quiz',
  },
  {
    tag: 'Tool',
    title: 'Travel System Checker',
    description: 'See which car seats click into which stroller frames — no guesswork, no expensive mistakes.',
    href: '/tools/travel-system',
    image: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Travel system compatibility checker',
  },
  {
    tag: 'Tool',
    title: 'Stroller Finder',
    description: 'Browse every stroller by brand and type, with live prices and where to buy.',
    href: '/tools/stroller-finder',
    image: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller finder',
  },
];

const lessons: ResourceCard[] = [
  {
    tag: 'Free lesson',
    title: 'The Art of the Registry',
    description: 'Why most registries fail — and how to build one that actually supports your life.',
    href: '/learn/art-of-the-registry',
    image: '/assets/editorial/registry.jpg',
    imageAlt: 'The Art of the Registry lesson',
  },
  {
    tag: 'Free lesson',
    title: 'Nursery Foundations',
    description: 'What you actually need to set up a nursery: sleep, furniture, layout, storage, and safety.',
    href: '/learn/nursery-foundations',
    image: '/assets/nurserypath/nurseryplanning.png',
    imageAlt: 'Nursery Foundations lesson',
  },
  {
    tag: 'Free lesson',
    title: 'The Stroller Equation',
    description: 'How to choose the right stroller for your real life, across all six categories.',
    href: '/learn/stroller-foundations',
    image: '/assets/editorial/strollers.png',
    imageAlt: 'The Stroller Equation lesson',
  },
];

function CardGrid({ items }: { items: ResourceCard[] }) {
  return (
    <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
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
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">{c.tag}</p>
            <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{c.title}</h3>
            <p className="mt-2 flex-1 text-[0.92rem] leading-[1.6] text-neutral-600">{c.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--color-accent-dark)]">
              Open <span aria-hidden className="transition duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <SiteShell currentPath="/resources">
      <main className="site-main">
        <PageViewTracker path="/resources" pageType="other" />

        <Hero
          className="homepage-hero"
          eyebrow="Free Resources"
          title="Tools and free lessons"
          subtitle="A few things to help you think clearly before you buy — interactive tools and complete preview lessons, all free and no account required."
          primaryCta={{ label: 'Book a Registry Consult', href: '/book' }}
          image="/assets/editorial/gear.jpg"
          imageAlt="Baby gear planning resources"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Interactive tools"
            title="Get unstuck on the big gear decisions."
            description="Built to give you a clear next step in just a few minutes."
            contentWidthClassName="max-w-3xl"
          />
          <CardGrid items={tools} />
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="Free preview lessons"
            title="Three complete lessons, no account required."
            description="Real frameworks for registries, nurseries, and strollers — the same approach Taylor uses with clients."
            contentWidthClassName="max-w-3xl"
          />
          <CardGrid items={lessons} />
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
