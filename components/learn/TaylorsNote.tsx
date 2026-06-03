import type { ReactNode } from 'react';

type TaylorsNoteProps = {
  children: ReactNode;
};

export default function TaylorsNote({ children }: TaylorsNoteProps) {
  return (
    <aside
      className="relative overflow-hidden rounded-[1.45rem] border border-[rgba(215,161,175,0.3)] bg-[linear-gradient(135deg,rgba(255,248,249,0.98)_0%,rgba(255,242,246,0.97)_100%)] px-6 py-7 shadow-[0_12px_32px_rgba(216,137,160,0.1)] sm:px-8 sm:py-8"
      aria-label="Taylor's personal note"
    >
      {/* Decorative accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.2)_0%,rgba(232,154,174,0)_72%)]"
      />

      <p className="relative text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]">
        Taylor&apos;s Note
      </p>

      {/* Handwritten signature line */}
      <p
        className="relative mt-2 font-handwritten-print text-[1.35rem] leading-none text-[var(--color-accent-dark)]/70 sm:text-[1.55rem]"
        aria-hidden="true"
      >
        a thought from me
      </p>

      <blockquote className="relative mt-5 space-y-4 text-[1rem] leading-[1.85] text-neutral-700 sm:text-[1.05rem]">
        {children}
      </blockquote>

      <p className="relative mt-5 font-handwritten-print text-[1.1rem] text-[var(--color-accent-dark)]">
        — Taylor
      </p>
    </aside>
  );
}
