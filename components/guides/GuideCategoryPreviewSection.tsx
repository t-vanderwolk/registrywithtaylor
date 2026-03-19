import Image from 'next/image';
import Link from 'next/link';
import PostContent from '@/components/blog/PostContent';
import GuideProductExampleCard from '@/components/guides/GuideProductExampleCard';
import type { StrollerPreviewExample } from '@/lib/guides/strollerHub';

export default function GuideCategoryPreviewSection({
  id,
  title,
  content,
  postId,
  imageSrc,
  imageAlt,
  examples,
  href,
  ctaLabel,
}: {
  id: string;
  title: string;
  content: string;
  postId: string;
  imageSrc: string;
  imageAlt: string;
  examples: StrollerPreviewExample[];
  href: string;
  ctaLabel: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfb_0%,#fbf6f1_100%)] p-4 sm:p-6 md:rounded-[2rem] md:p-8">
      <div className="grid gap-6 sm:gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div className="min-w-0">
          <h3
            id={id}
            className="scroll-mt-28 font-serif text-[1.75rem] leading-[1.04] tracking-tight text-neutral-900 sm:text-2xl md:text-3xl"
          >
            {title}
          </h3>

          <div className="mt-4 max-w-3xl sm:mt-5">
            <PostContent
              postId={postId}
              content={content}
              className="guide-post-content stroller-guide-content guide-post-content--subsection"
              variant="plain"
              highlightBrandWordmark={true}
            />
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-stone-200/70 bg-[#fcfaf7] p-3 sm:rounded-[1.75rem] sm:p-4 md:p-5">
          <div className="relative h-44 sm:h-52 md:h-60">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 21rem, (min-width: 768px) 50vw, 100vw"
              className="object-contain object-center p-3"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-stone-200/70 pt-6 sm:mt-8 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Example strollers</p>
            <p className="mt-2 text-sm leading-6 text-neutral-700 sm:leading-7">
              These are visual anchors to help the category feel real before you open the deeper guide.
            </p>
          </div>
        </div>

        <div className="mt-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 pr-1 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0 lg:pr-0">
          {examples.map((example) => (
            <div
              key={`${title}-${example.name}`}
              className="min-w-[12.75rem] snap-start flex-1 sm:min-w-[14rem]"
            >
              <GuideProductExampleCard name={example.name} imageSrc={example.imageSrc} imageAlt={example.imageAlt} />
            </div>
          ))}
        </div>

        <Link
          href={href}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-200/80 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-[rgba(196,156,94,0.28)] hover:text-[var(--color-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf6f1] sm:w-auto sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}
