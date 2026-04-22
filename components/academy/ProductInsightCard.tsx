import Image from 'next/image';
import DecisionTag from '@/components/academy/DecisionTag';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';
import { isRemoteImageUrl } from '@/lib/blog/images';
import type { DecisionTagLabel } from '@/lib/academy/decisionSupport';

type ProductInsightCardProps = {
  name: string;
  brand: string;
  description: string;
  problemItSolves: string;
  whenItFits: string;
  whenItDoesNotFit: string;
  affiliateUrl: string | null;
  category: string;
  position: number | string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  tag?: DecisionTagLabel;
};

function normalizeText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export default function ProductInsightCard({
  name,
  brand,
  description,
  problemItSolves,
  whenItFits,
  whenItDoesNotFit,
  affiliateUrl,
  imageSrc,
  imageAlt,
  tag,
}: ProductInsightCardProps) {
  const productName = normalizeText(name) || 'Guided example';
  const brandLabel = normalizeText(brand);
  const resolvedAffiliateUrl = normalizeText(affiliateUrl) || null;
  const resolvedImage = resolveProductCardImage({
    brand: brandLabel,
    productName,
    imageUrl: imageSrc,
    imageAlt,
  });
  const shouldSkipImageOptimization = resolvedImage ? isRemoteImageUrl(resolvedImage.src) : false;

  return (
    <article className="group h-full overflow-hidden rounded-[1.9rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)] shadow-[0_16px_38px_rgba(47,36,48,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(47,36,48,0.1)]">
      <div className="flex h-full flex-col">
        {resolvedImage ? (
          <div className="border-b border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(248,241,232,0.72)_100%)] p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-white/80">
              <Image
                src={resolvedImage.src}
                alt={resolvedImage.alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                className={`${resolvedImage.objectClassName} p-3 transition duration-300 group-hover:scale-[1.02]`}
                unoptimized={shouldSkipImageOptimization}
              />
            </div>
          </div>
        ) : null}

        <div className="flex h-full flex-col p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {tag ? <DecisionTag label={tag} /> : null}
              {brandLabel ? (
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/72">
                  {brandLabel}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-charcoal sm:text-[1.6rem]">
                {productName}
              </h3>
              <p className="text-[0.96rem] leading-7 text-neutral-700">
                {normalizeText(description) || 'A useful grounding example to make the decision feel more concrete in real life.'}
              </p>
            </div>

            <div className="space-y-4 rounded-[1.35rem] border border-[rgba(47,36,48,0.08)] bg-white/72 p-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/70">What problem it solves</p>
                <p className="mt-2 text-[0.95rem] leading-7 text-neutral-700">{problemItSolves}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/70">When it fits</p>
                <p className="mt-2 text-[0.95rem] leading-7 text-neutral-700">{whenItFits}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/70">When it does not</p>
                <p className="mt-2 text-[0.95rem] leading-7 text-neutral-700">{whenItDoesNotFit}</p>
              </div>
            </div>
          </div>

          {resolvedAffiliateUrl ? (
            <div className="mt-auto pt-6">
              <a
                href={resolvedAffiliateUrl}
                aria-label={`View option for ${productName}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition duration-200 hover:translate-x-1 hover:text-neutral-900"
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <span>View option</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
