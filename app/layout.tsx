import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: {
    default: 'Taylor-Made Baby Planning — Modern Baby Preparation',
    template: '%s',
  },
  description:
    'Taylor-Made Baby Planning delivers calm, private guidance so expecting parents can prepare confidently without overwhelm.',
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
