import Image from 'next/image';

type ServiceIconBadgeProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  size?: 'default' | 'card';
};

const sizeClasses = {
  default: 'h-[4.4rem] w-[4.4rem]',
  card: 'h-[8.8rem] w-[8.8rem]',
} as const;

const imageSizes = {
  default: '70px',
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
    <div
      className={[
        'flex items-center justify-center',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['relative', sizeClasses[size]].join(' ')}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={imageSizes[size]}
          className={['object-contain', imageClassName].filter(Boolean).join(' ')}
        />
      </div>
    </div>
  );
}
