import Hero from '@/components/ui/Hero';
import SectionWrapper from '@/components/layout/SectionWrapper';
import SiteShell from '@/components/SiteShell';
import WhyAdvice from '@/components/home/WhyAdvice';
import ForYouIf from '@/components/home/ForYouIf';
import ServicesPreview from '@/components/home/ServicesPreview';
import FinalCTA from '@/components/home/FinalCTA';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Planning — Modern Baby Preparation',
  description:
    'Taylor-Made Baby Planning delivers calm, private guidance so expecting parents can prepare confidently without overwhelm.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Planning hero background',
});

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          eyebrow="Taylor-Made Baby Planning"
          title="Baby prep, simplified."
          subtitle="Because parenthood should start with confidence, not confusion."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          secondaryCta={{ label: 'View Services', href: '/services' }}
          tagline="Private · Personalized · No pressure"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Taylor-Made Baby Planning hero background"
          className="hero-bottom-fade hero-home-radial"
          contentStyle={{
            backgroundImage:
              'radial-gradient(circle at 24% 34%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.83) 44%, rgba(248,244,240,0.46) 72%, rgba(248,244,240,0) 100%)',
            borderRadius: '1.5rem',
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 2.8vw, 2rem)',
          }}
        />

        <SectionWrapper
          tone="ivoryWarm"
          className="!pt-[clamp(4.5rem,7vw,6.5rem)] !pb-[clamp(8rem,12vw,12rem)]"
        >
          <WhyAdvice />
        </SectionWrapper>

        <SectionWrapper tone="blush">
          <ForYouIf />
        </SectionWrapper>

        <SectionWrapper tone="neutral">
          <ServicesPreview />
        </SectionWrapper>

        <SectionWrapper tone="ivory">
          <FinalCTA />
        </SectionWrapper>
      </main>
    </SiteShell>
  );
}
