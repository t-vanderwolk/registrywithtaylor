import LuxuryIconFrame from '@/components/ui/LuxuryIconFrame';

type AffiliateLogoBadgeSize = 'compact' | 'button' | 'cta' | 'card';

type AffiliateLogoBadgeProps = {
  src: string;
  alt?: string;
  size?: AffiliateLogoBadgeSize;
  fit?: 'contain' | 'fill' | 'cover';
  className?: string;
  imageClassName?: string;
  interactive?: boolean;
  syncWithGroup?: boolean;
};

const frameSizeMap = {
  compact: 'md',
  button: 'md',
  cta: 'xl',
  card: 'lg',
} as const;

const imageSizeMap = {
  compact: 'h-7 w-7',
  button: 'h-7 w-7',
  cta: 'h-12 w-12',
  card: 'h-10 w-10',
} as const;

const fitClassMap = {
  contain: 'object-contain',
  fill: 'object-fill',
  cover: 'object-cover',
} as const;

export default function AffiliateLogoBadge({
  src,
  alt = '',
  size = 'button',
  fit = 'contain',
  className = '',
  imageClassName = '',
  interactive = true,
  syncWithGroup = false,
}: AffiliateLogoBadgeProps) {
  return (
    <LuxuryIconFrame
      size={frameSizeMap[size]}
      className={className}
      innerClassName={['relative flex items-center justify-center', imageSizeMap[size]].join(' ')}
      interactive={interactive}
      syncWithGroup={syncWithGroup}
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : 'true'}
        className={[
          'h-full w-full luxury-icon-object luxury-icon-object--partner',
          fitClassMap[fit],
          imageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        loading="lazy"
      />
    </LuxuryIconFrame>
  );
}
