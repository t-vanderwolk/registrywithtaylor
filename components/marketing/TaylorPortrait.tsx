import Image from 'next/image';

/**
 * The portrait of Taylor.
 *
 * - `framed` (default): a capped-width editorial portrait with a white mat
 *   frame, soft offset blush accent, fixed 4:5 crop, and a centered credential
 *   chip. Used on the Contact page.
 * - `cutout`: the background-removed cutout floating on a soft blush halo with a
 *   silhouette drop-shadow, so she reads as an intentional, page-flowing figure.
 *   Used on the About page.
 */
export default function TaylorPortrait({
  priority = false,
  className = '',
  variant = 'framed',
}: {
  priority?: boolean;
  className?: string;
  variant?: 'framed' | 'cutout';
}) {
  if (variant === 'cutout') {
    return (
      <figure className={`group relative mx-auto w-full max-w-[25rem] ${className}`}>
        {/* Soft blush halo behind the cutout */}
        <div
          aria-hidden
          className="absolute inset-x-0 -top-3 bottom-10 -z-10 rounded-[2.75rem] bg-[radial-gradient(115%_92%_at_50%_16%,rgba(216,137,160,0.26),rgba(198,167,94,0.10)_52%,transparent_74%)]"
        />
        {/* Grounding shadow so she doesn't float */}
        <div
          aria-hidden
          className="absolute inset-x-12 bottom-5 -z-10 h-5 rounded-[50%] bg-[rgba(72,49,56,0.18)] blur-lg"
        />
        <Image
          src="/assets/taylor-cutout.webp"
          alt="Taylor Vanderwolk, baby registry consultant and Gugu Guru certified baby gear specialist"
          width={800}
          height={1074}
          sizes="(max-width: 768px) 80vw, 400px"
          className="w-full origin-bottom drop-shadow-[0_20px_28px_rgba(72,49,56,0.20)] transition-transform duration-[600ms] ease-out group-hover:-translate-y-1.5"
          priority={priority}
        />
        {/* Credential chip — overlay caption pinned to the lower edge */}
        <figcaption className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgba(216,137,160,0.42)] bg-white/95 px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-dark)] shadow-[0_10px_24px_rgba(72,49,56,0.18)] backdrop-blur">
          <span aria-hidden>✦</span>
          Gugu Guru Certified Specialist
        </figcaption>
      </figure>
    );
  }

  return (
    <div className={`group relative mx-auto w-full max-w-[19rem] ${className}`}>
      {/* Offset blush accent panel behind the portrait */}
      <div
        aria-hidden
        className="absolute -inset-2 -z-10 translate-x-2.5 translate-y-2.5 rounded-[1.9rem] bg-gradient-to-br from-[rgba(216,137,160,0.26)] via-[rgba(216,137,160,0.12)] to-[rgba(198,167,94,0.15)] transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1.5"
      />
      {/* White mat frame */}
      <div className="relative overflow-hidden rounded-[1.55rem] border border-[rgba(216,137,160,0.34)] bg-white p-1.5 shadow-[0_20px_46px_rgba(72,49,56,0.15)]">
        <Image
          src="/assets/taylor.webp"
          alt="Taylor Vanderwolk, baby registry consultant and Gugu Guru certified baby gear specialist"
          width={560}
          height={700}
          sizes="(max-width: 768px) 76vw, 304px"
          className="aspect-[4/5] w-full rounded-[1.2rem] object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
          priority={priority}
        />
        <div aria-hidden className="pointer-events-none absolute inset-1.5 rounded-[1.2rem] ring-1 ring-inset ring-white/40" />
      </div>
      {/* Centered credential chip */}
      <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgba(216,137,160,0.42)] bg-white/95 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-dark)] shadow-[0_8px_20px_rgba(72,49,56,0.14)] backdrop-blur">
        <span aria-hidden>✦</span>
        Gugu Guru Certified Specialist
      </span>
    </div>
  );
}
