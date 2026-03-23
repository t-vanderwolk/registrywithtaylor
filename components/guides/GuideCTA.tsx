import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import { getGuideConsultationCta } from '@/lib/guides/experience';

export default function GuideCTA({
  title = 'Still unsure? Let’s build this together.',
  description = 'If the guide got you most of the way there but the final decision still feels sticky, book a consultation and we’ll sort it around your actual life.',
  href,
  ctaLabel,
}: {
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string | null;
}) {
  const consultationCta = getGuideConsultationCta(ctaLabel);

  return (
    <GuideCTARibbon
      eyebrow="Still unsure?"
      title={title}
      description={description}
      primaryCta={{
        href: href || consultationCta.href,
        label: consultationCta.label,
        variant: 'primary',
      }}
    />
  );
}
