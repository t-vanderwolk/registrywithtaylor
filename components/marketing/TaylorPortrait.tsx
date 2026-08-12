import Image from 'next/image';

/**
 * The framed portrait of Taylor, used on the About and Contact pages so both
 * stay identical. A tidy, capped-width editorial portrait: white mat frame, a
 * soft offset blush accent, a fixed 4:5 crop, gentle hover, and a centered
 * credential chip.
 */
export default function TaylorPortrait({
  priority = false,
  className = '',
}: {
  priority?: boolean;
  className?: string;
}) {
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
