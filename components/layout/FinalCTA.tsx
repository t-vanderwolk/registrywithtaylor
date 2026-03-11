import CTASection from '@/components/marketing/CTASection';

type FinalCTAProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  note?: string;
  ctaAnalyticsLabel?: string;
};

export default function FinalCTA({
  className = '',
  eyebrow = 'Ready when you are',
  title = 'Book a consultation when you want expert eyes on your baby gear plan.',
  description = 'One thoughtful conversation can help you sort registry strategy, gear decisions, nursery setup, and what can wait.',
  ctaLabel = 'Book a Consultation',
  ctaHref = '/consultation',
  note = 'Authority first. Consultation when you need it.',
  ctaAnalyticsLabel,
}: FinalCTAProps) {
  return (
    <CTASection
      className={className}
      eyebrow={eyebrow}
      title={title}
      description={description}
      primaryHref={ctaHref}
      primaryLabel={ctaLabel}
      primaryAnalyticsLabel={ctaAnalyticsLabel}
      note={note}
    />
  );
}
