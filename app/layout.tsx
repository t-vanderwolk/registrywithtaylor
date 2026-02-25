import Script from 'next/script';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Taylor-Made Baby Co. | Private Baby Planning & Registry Consulting',
  description:
    'Bespoke baby planning services for modern families. Registry clarity, nursery strategy, and personalized gear guidance.',
  openGraph: {
    title: 'Taylor-Made Baby Co. | Private Baby Planning & Registry Consulting',
    description:
      'Bespoke baby planning services for modern families. Registry clarity, nursery strategy, and personalized gear guidance.',
    images: [
      {
        url: '/assets/hero/hero-01.jpg',
        alt: 'Taylor-Made Baby Co. hero image',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-primary text-charcoal font-sans antialiased">
        <Providers>{children}</Providers>
        <Script src="/scripts/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
