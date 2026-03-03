import Script from 'next/script';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/marketing/metadata';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/logo.svg',
    shortcut: '/assets/logo.svg',
  },
  openGraph: {
    title: DEFAULT_SITE_TITLE,
    description:
      'Personalized registry and nursery planning for modern families. Thoughtful guidance and intentional preparation.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Calm, personalized baby planning so parenthood starts with confidence.',
    images: [DEFAULT_OG_IMAGE_PATH],
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
