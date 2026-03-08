import Link from 'next/link';
import { Body, H2 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type BlogSoftCTAProps = {
  className?: string;
};

export default function BlogSoftCTA({ className = '' }: BlogSoftCTAProps) {
  return (
    <MarketingSurface
      className={[
        'text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-2xl space-y-6">
          <span className="block text-xs uppercase tracking-[0.28em] text-charcoal/55">
            Baby Prep Support
          </span>
          <H2 className="font-serif leading-tight text-neutral-900">
            Still sorting registry and gear decisions?
          </H2>
          <Body className="mx-auto text-charcoal/75">
            I help families figure out what to buy, what to skip, and what can wait.
          </Body>
          <div className="pt-2">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSurface>
  );
}
