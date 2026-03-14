import EditorialIllustration from '@/components/ui/EditorialIllustration';

type ServiceIconBadgeProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  size?: 'default' | 'addon' | 'card';
};

const illustrationScaleMap = {
  default: 'default',
  addon: 'addon',
  card: 'card',
} as const;

const imageSizes = {
  default: '70px',
  addon: '106px',
  card: '141px',
} as const;

export default function ServiceIconBadge({
  src,
  alt = '',
  className = '',
  imageClassName = '',
  size = 'default',
}: ServiceIconBadgeProps) {
  return (
    <EditorialIllustration
      src={src}
      alt={alt}
      decorative={alt.trim().length === 0}
      sizes={imageSizes[size]}
      scale={illustrationScaleMap[size]}
      className={className}
      imageClassName={imageClassName}
    />
  );
}
