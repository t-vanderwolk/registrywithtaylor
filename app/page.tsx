import HomeContent from '@/components/HomeContent';

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
  return <HomeContent />;
}
