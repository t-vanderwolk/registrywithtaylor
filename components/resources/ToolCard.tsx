import Image from 'next/image';
import Link from 'next/link';

export type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

/**
 * The existing TMBC tool card (image + title + description + pill CTA), extracted
 * so the Resources hub and the tools index share one design.
 */
export default function ToolCard({ title, description, href, cta, image, imageAlt }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-[rgba(215,161,175,0.22)] bg-white shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(55,40,46,0.09)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{title}</h3>
        <p className="mt-2 flex-1 text-[0.92rem] leading-[1.6] text-neutral-600">{description}</p>
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-5 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-white transition group-hover:bg-[var(--color-cta-pink-hover)]">
          {cta}
          <span aria-hidden className="transition duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
