import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Registry With Taylor — Calm Registry & Planning Support',
  description: 'Virtual registry guidance, thoughtful planning, and calming support for modern parents.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-primary text-charcoal font-sans antialiased">
        {children}
        <Script src="/scripts/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
