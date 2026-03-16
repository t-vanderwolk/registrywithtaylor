import Image from 'next/image';
import GuideTrackedLink from './GuideTrackedLink';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { isRemoteImageUrl } from '@/lib/blog/images';

interface ProductGuideCardProps {
  productName: string;
  description: string;
  imageUrl?: string;
  retailerLabel?: string;
  ctaLabel: string;
  destinationUrl: string;
  guideId: string;
  partnerId: string;
  preview?: boolean;
}

export default function ProductGuideCard({
  productName,
  description,
  imageUrl,
  retailerLabel,
  ctaLabel,
  destinationUrl,
  guideId,
  partnerId,
  preview = false,
}: ProductGuideCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-neutral-50">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover"
            unoptimized={isRemoteImageUrl(imageUrl)}
          />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-serif text-charcoal mb-2">{productName}</h3>
          {retailerLabel && (
            <p className="text-sm uppercase tracking-wide text-neutral-500 font-medium">
              {retailerLabel}
            </p>
          )}
        </div>

        <p className="text-neutral-700 leading-relaxed">{description}</p>

        <GuideTrackedLink
          guideId={guideId}
          href={destinationUrl}
          event={GuideAnalyticsEvents.AFFILIATE_CLICK}
          sourceRoute={`/guides/${guideId}`}
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-lg transition-colors"
          track={!preview}
          meta={{
            productName,
            retailerLabel: retailerLabel || '',
            ctaLabel,
            partnerId,
          }}
        >
          {ctaLabel}
        </GuideTrackedLink>
      </div>
    </div>
  );
}