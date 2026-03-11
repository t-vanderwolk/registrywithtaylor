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
          <span className="block text-xs uppercase tracking-[0.28em] text-charcoal/55">Need expert guidance?</span>
          <H2 className="font-serif leading-tight text-neutral-900">
            Bring your baby gear questions to Taylor when the guide gets you close, but not all the way there.
          </H2>
          <Body className="mx-auto text-charcoal/75">
            The journal builds clarity. The consultation applies that clarity to your stroller, car seat, registry,
            nursery, and purchase-timing decisions.
          </Body>
          <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
            <Link
              href="/consultation"
              className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Book a Consultation
            </Link>
            <Link
              href="/guides"
              className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Explore the Guides
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSurface>
  );
}
