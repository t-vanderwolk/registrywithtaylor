import type { ReactNode } from 'react';

export type TaylorsNoteProps = {
  children: ReactNode;
  tilt?: 'left' | 'right' | 'none';
  /** Hide the "XOXO, T" sign-off (e.g. when several notes cluster together). */
  signed?: boolean;
  className?: string;
};

/**
 * A notebook-style editorial aside in Taylor's handwriting, signed "XOXO, T".
 * Scatter these through the page for warmth.
 */
export default function TaylorsNote({ children, tilt = 'none', signed = true, className = '' }: TaylorsNoteProps) {
  const tiltClass = tilt === 'left' ? '-rotate-1' : tilt === 'right' ? 'rotate-1' : '';
  return (
    <figure
      className={`relative mx-auto max-w-xl rounded-[1.2rem] border border-[rgba(215,161,175,0.35)] bg-[#fffaf9] px-6 py-5 shadow-[0_10px_30px_rgba(184,116,138,0.10)] ${tiltClass} ${className}`.trim()}
    >
      <p className="academy-handwritten-aside !block text-[1.15rem] leading-[1.4] text-[#9c5c72]">{children}</p>
      {signed && (
        <figcaption className="mt-3 text-right font-handwritten-print text-[1.1rem] leading-tight text-[var(--color-cta-pink)]">
          XOXO,
          <br />T
        </figcaption>
      )}
    </figure>
  );
}
