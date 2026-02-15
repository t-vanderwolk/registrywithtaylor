import Hero from '@/components/ui/Hero';
import SectionWrapper from '@/components/layout/SectionWrapper';
import SiteShell from '@/components/SiteShell';
import WhyAdvice from '@/components/home/WhyAdvice';
import ForYouIf from '@/components/home/ForYouIf';
import ServicesPreview from '@/components/home/ServicesPreview';
import FinalCTA from '@/components/home/FinalCTA';

export const metadata = {
  metadataBase: new URL('https://taylormadebabyplanning.com'),
  title: 'Taylor-Made Baby Planning — Modern Baby Preparation',
  description:
    'Taylor-Made Baby Planning delivers calm, private guidance so expecting parents can prepare confidently without overwhelm.',
  openGraph: {
    title: 'Taylor-Made Baby Planning',
    description:
      'Calm, thoughtful baby preparation with private planning sessions tailored to your life.',
    url: 'https://taylormadebabyplanning.com',
    siteName: 'Taylor-Made Baby Planning',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://taylormadebabyplanning.com/assets/hero/hero-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Taylor-Made Baby Planning hero background',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taylor-Made Baby Planning',
    description:
      'Baby prep, simplified. Private guidance, clear next steps, and calm confidence for expecting parents.',
    images: ['https://taylormadebabyplanning.com/assets/hero/hero-01.jpg'],
  },
};

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
          className="hero-bottom-fade"
        />

        <SectionWrapper tone="ivory">
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
