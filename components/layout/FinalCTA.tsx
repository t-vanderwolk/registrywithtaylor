import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import { Body, H2 } from '@/components/ui/MarketingHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type FinalCTAProps = {
  className?: string;
  title?: string;
  description?: string;
};

export default function FinalCTA({
  className = '',
  title = 'Figure out what actually fits.',
  description = 'One conversation can help you sort registry picks, gear decisions, nursery setup, and what can wait.',
}: FinalCTAProps) {
  const sectionClassName = [
    'relative z-10 border-t border-[rgba(0,0,0,0.06)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MarketingSection tone="blush" container="narrow" spacing="default" className={sectionClassName}>
      <RevealOnScroll>
        <div className="text-center space-y-8">
          <H2 className="font-serif text-[var(--text-primary)]">
            {title}
          </H2>

          <Body className="mx-auto max-w-2xl text-[var(--color-muted)]">
            {description}
          </Body>

          <div className="pt-4">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule Your Complimentary Consultation
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
}
