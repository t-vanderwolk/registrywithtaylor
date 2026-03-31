import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: "You're in - Taylor-Made Baby Co.",
  description: "Your message has been received, and Taylor will be in touch shortly.",
  path: '/thank-you',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Thank you confirmation for Taylor-Made Baby Co.',
});

export default function ThankYouPage() {
  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <MarketingSection tone="white" spacing="default" container="narrow">
          <MarketingSurface className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] px-5 py-6 text-center sm:px-8 sm:py-8">
            <div className="mx-auto flex max-w-[24rem] flex-col items-center">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
                Message received
              </p>
              <h1 className="mt-3 font-serif text-[2.5rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3rem]">
                You&apos;re in.
              </h1>
              <p className="mt-4 text-base leading-8 text-neutral-700 sm:text-lg">
                I&apos;ll be in touch shortly. In the meantime, if you want a calm place to keep moving, the Academy is a very good next stop.
              </p>
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/academy" className="btn btn--primary">
                Visit the Academy
              </Link>
              <Link href="/" className="btn btn--secondary">
                Return Home
              </Link>
            </div>
          </MarketingSurface>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
