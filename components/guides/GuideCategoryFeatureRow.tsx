import Image from 'next/image';
import PostContent from '@/components/blog/PostContent';
import MarketingSurface from '@/components/ui/MarketingSurface';

export default function GuideCategoryFeatureRow({
  id,
  title,
  content,
  postId,
  imageSrc,
  imageAlt,
}: {
  id: string;
  title: string;
  content: string;
  postId: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <MarketingSurface className="rounded-[2rem] border border-black/6 bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6">
      <div className="mx-auto max-w-5xl">
        <h3
          id={id}
          className="scroll-mt-24 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)] md:text-[1.8rem]"
        >
          {title}
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <PostContent
              postId={postId}
              content={content}
              className="guide-post-content stroller-guide-content guide-post-content--subsection"
            />
          </div>

          <div className="md:sticky md:top-36">
            <div className="rounded-[1.7rem] border border-stone-200/70 bg-[linear-gradient(180deg,#f6efe8_0%,#fdfbf8_100%)] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
              <div className="relative flex h-56 items-center justify-center md:h-64">
                <div className="relative h-full w-full">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1024px) 20rem, (min-width: 768px) 18rem, 100vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingSurface>
  );
}
