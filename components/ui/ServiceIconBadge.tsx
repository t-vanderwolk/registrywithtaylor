import Image from 'next/image';
import IconFrame from '@/components/ui/IconFrame';

type ServiceIconBadgeProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  size?: 'default' | 'addon' | 'card';
};

const sizeClasses = {
  default: 'h-[3rem] w-[3rem] md:h-[3.25rem] md:w-[3.25rem]',
  addon: 'h-[4.4rem] w-[4.4rem] md:h-[4.75rem] md:w-[4.75rem]',
  card: 'h-[5.8rem] w-[5.8rem] md:h-[6.2rem] md:w-[6.2rem]',
} as const;

const frameSizeMap = {
  default: 'lg',
  addon: 'hero',
  card: 'jumbo',
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
    <IconFrame
      size={frameSizeMap[size]}
      className={className}
      innerClassName={['relative', sizeClasses[size]].join(' ')}
      interactive
      syncWithGroup
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={imageSizes[size]}
        className={['object-contain luxury-icon-object', imageClassName].filter(Boolean).join(' ')}
      />
    </IconFrame>
  );
}
