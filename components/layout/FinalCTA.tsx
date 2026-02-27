import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type FinalCTAProps = {
  className?: string;
};

export default function FinalCTA({ className = '' }: FinalCTAProps) {
  const sectionClassName = [
    'relative z-10 border-t border-[rgba(0,0,0,0.06)] !pt-[clamp(4.5rem,7vw,6.5rem)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MarketingSection tone="blush" container="narrow" spacing="tight" className={sectionClassName}>
      <div className="text-center space-y-8">
        <RevealOnScroll>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
            Start with confidence.
          </h2>
        </RevealOnScroll>

        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
          Clear, calm preparation starts with one thoughtful conversation.
        </p>

        <RevealOnScroll delayMs={120}>
          <div className="pt-4">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule Your Complimentary Consultation
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </MarketingSection>
  );
}
