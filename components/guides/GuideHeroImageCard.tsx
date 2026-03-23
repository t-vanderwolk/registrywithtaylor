import type { ReactNode } from 'react';
import Image from 'next/image';
import { isRemoteImageUrl } from '@/lib/blog/images';

export default function GuideHeroImageCard({
  src,
  alt,
  aspectClassName = 'aspect-[4/5]',
  objectClassName = 'object-cover',
  priority = false,
  overlaySlot,
}: {
  src: string;
  alt: string;
  aspectClassName?: string;
  objectClassName?: string;
  priority?: boolean;
  overlaySlot?: ReactNode;
}) {
  const shouldSkipImageOptimization = isRemoteImageUrl(src);

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-white shadow-[0_16px_44px_rgba(58,36,43,0.10)]">
      <div className={`relative ${aspectClassName}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 24rem, 100vw"
          className={objectClassName}
          unoptimized={shouldSkipImageOptimization}
        />
      </div>
      {overlaySlot}
    </div>
  );
}
