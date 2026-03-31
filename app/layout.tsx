import Script from 'next/script';
import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import AffiliateLinkTracker from '@/components/analytics/AffiliateLinkTracker';
import AnalyticsClickTracker from '@/components/analytics/AnalyticsClickTracker';
import AnalyticsRouteTracker from '@/components/analytics/AnalyticsRouteTracker';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_APPLE_ICON_PATH,
  SITE_FAVICON_PATH,
  SITE_ICON_192_PATH,
  SITE_ICON_512_PATH,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
} from '@/lib/marketing/metadata';
import './globals.css';
import Providers from './providers';

const googleAnalyticsId = 'G-57M7FFGXKC';
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO_URL,
        width: 1024,
        height: 1024,
      },
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: SITE_LOGO_URL,
          width: 1024,
          height: 1024,
        },
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: SITE_FAVICON_PATH, sizes: '48x48', type: 'image/png' },
      { url: SITE_ICON_192_PATH, sizes: '192x192', type: 'image/png' },
      { url: SITE_ICON_512_PATH, sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: SITE_FAVICON_PATH, sizes: '48x48', type: 'image/png' }],
    apple: [{ url: SITE_APPLE_ICON_PATH, sizes: '180x180', type: 'image/png' }],
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
    description:
      'Baby gear, registry, and nursery guidance for families who want to buy with purpose.',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }}
        />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />

            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  send_page_view: false
                });
              `}
            </Script>
          </>
        ) : null}
      </head>

      <body className="min-h-screen bg-gradient-primary text-charcoal font-sans antialiased">
        <Providers>{children}</Providers>

        {/* Analytics Trackers */}
        <Suspense fallback={null}>
          <AnalyticsRouteTracker />
          <AnalyticsClickTracker />
          <AffiliateLinkTracker />
        </Suspense>

        {/* Optional global script */}
        <Script src="/scripts/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
