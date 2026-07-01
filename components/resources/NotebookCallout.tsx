import type { ReactNode } from 'react';

export type NotebookCalloutProps = {
  /** Handwritten label in the top-left, e.g. "Taylor's Note". */
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A notebook-page callout: a soft paper card with a ruled left margin and a
 * handwritten label. Used for longer editorial explanations.
 */
export default function NotebookCallout({ label = "Taylor's Note", title, children, className = '' }: NotebookCalloutProps) {
  return (
    <aside
      className={`relative overflow-hidden rounded-[1.3rem] border border-[rgba(215,161,175,0.4)] bg-[#fffaf9] p-6 shadow-[0_10px_30px_rgba(184,116,138,0.10)] ${className}`.trim()}
    >
      {/* ruled left margin */}
      <span aria-hidden className="pointer-events-none absolute inset-y-4 left-4 w-px bg-[rgba(216,137,160,0.35)]" />
      <div className="pl-5">
        {label && (
          <p className="font-handwritten-print text-[1.25rem] leading-none text-[var(--color-cta-pink)]">{label}</p>
        )}
        {title && (
          <h3 className="mt-2 font-serif text-[1.25rem] leading-[1.12] tracking-[-0.02em] text-neutral-900">{title}</h3>
        )}
        <div className="mt-2 text-[0.92rem] leading-[1.65] text-neutral-700 [&_p]:mb-3 [&_p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
