import Image from 'next/image';
import Link from 'next/link';
import PostContent from '@/components/blog/PostContent';
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
    <section className="rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfb_0%,#fbf6f1_100%)] p-6 md:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div className="min-w-0">
          <h3
            id={id}
            className="scroll-mt-28 font-serif text-2xl leading-[1.04] tracking-[-0.04em] text-neutral-900 md:text-3xl"
          >
            {title}
          </h3>

          <div className="mt-5 max-w-3xl">
            <PostContent
              postId={postId}
              content={content}
              className="guide-post-content stroller-guide-content guide-post-content--subsection"
              variant="plain"
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200/70 bg-[#fcfaf7] p-4 md:p-5">
          <div className="relative h-52 md:h-60">
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

      <div className="mt-8 border-t border-stone-200/70 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Example strollers</p>
            <p className="mt-2 text-sm leading-7 text-neutral-700">
              These are visual anchors to help the category feel real before you open the deeper guide.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {examples.map((example) => (
            <div
              key={`${title}-${example.name}`}
              className="min-w-[14rem] flex-1 rounded-[1.5rem] border border-stone-200/70 bg-white/90 p-4"
            >
              <div className="rounded-[1.2rem] border border-stone-200/70 bg-[#f8f3ed] p-3">
                <div className="relative h-28">
                  <Image
                    src={example.imageSrc}
                    alt={example.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 12rem"
                    className="object-contain object-center"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="mt-4 font-serif text-[1.15rem] leading-[1.1] tracking-[-0.02em] text-neutral-900">
                {example.name}
              </p>
            </div>
          ))}
        </div>

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition hover:text-[var(--color-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf6f1]"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}
