import Script from 'next/script';
import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import AnalyticsClickTracker from '@/components/analytics/AnalyticsClickTracker';
import AnalyticsRouteTracker from '@/components/analytics/AnalyticsRouteTracker';
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

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

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
      'Personalized help with registries, strollers, car seats, nursery planning, and home prep.',
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
    description: 'Baby gear, registry, and nursery guidance for families who want to buy with purpose.',
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-primary text-charcoal font-sans antialiased">
        <Providers>{children}</Providers>
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <Suspense fallback={null}>
          <AnalyticsRouteTracker />
          <AnalyticsClickTracker />
        </Suspense>
        <Script src="/scripts/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
