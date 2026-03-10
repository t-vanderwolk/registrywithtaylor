import LuxuryIconFrame from '@/components/ui/LuxuryIconFrame';

type AffiliateLogoBadgeSize = 'compact' | 'button' | 'card';

type AffiliateLogoBadgeProps = {
  src: string;
  alt?: string;
  size?: AffiliateLogoBadgeSize;
  className?: string;
  imageClassName?: string;
  interactive?: boolean;
  syncWithGroup?: boolean;
};

const frameSizeMap = {
  compact: 'md',
  button: 'md',
  card: 'lg',
} as const;

const imageSizeMap = {
  compact: 'h-7 w-7',
  button: 'h-7 w-7',
  card: 'h-10 w-10',
} as const;

export default function AffiliateLogoBadge({
  src,
  alt = '',
  size = 'button',
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
          'h-full w-full object-contain luxury-icon-object luxury-icon-object--partner',
          imageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        loading="lazy"
      />
    </LuxuryIconFrame>
  );
}
