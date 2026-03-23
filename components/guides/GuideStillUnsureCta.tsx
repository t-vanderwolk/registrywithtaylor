import GuideCTA from '@/components/guides/GuideCTA';

export default function GuideStillUnsureCta({
  href,
  ctaLabel,
  description,
}: {
  href?: string;
  ctaLabel?: string | null;
  description?: string;
}) {
  return (
    <GuideCTA
      href={href}
      ctaLabel={ctaLabel}
      description={
        description ||
        'If the guide got you close but the last call still feels sticky, book a consultation and sort the tradeoffs around your actual routine, space, and priorities.'
      }
    />
  );
}
