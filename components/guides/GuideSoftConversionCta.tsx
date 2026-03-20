import GuideCTARibbon from '@/components/guides/GuideCTARibbon';

export default function GuideSoftConversionCta({
  id,
  title,
  description,
  href,
  ctaLabel,
  primaryVariant = 'primary',
}: {
  id?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  primaryVariant?: 'primary' | 'secondary' | 'accent';
}) {
  return (
    <GuideCTARibbon
      id={id}
      eyebrow="Next step"
      title={title}
      description={description}
      primaryCta={{ href, label: ctaLabel, variant: primaryVariant }}
    />
  );
}
