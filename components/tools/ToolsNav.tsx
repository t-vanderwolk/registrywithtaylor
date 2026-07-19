import Link from 'next/link';

/**
 * Shared sub-navigation for the three free tools (Stroller Quiz, Stroller
 * Finder, Travel System Checker). Rendered at the top of every tool page so a
 * visitor can move between the tools and always see which one they're on — the
 * active tool is highlighted and marked aria-current, and the "All Free Tools"
 * link takes them back to the hub they came from.
 */

export type ToolKey = 'quiz' | 'finder' | 'compare' | 'checker';

const TOOLS: { key: ToolKey; href: string; label: string; blurb: string }[] = [
  { key: 'quiz', href: '/tools/stroller-quiz', label: 'Stroller Quiz', blurb: 'Find your match' },
  { key: 'finder', href: '/tools/stroller-finder', label: 'Stroller Finder', blurb: 'Browse by brand' },
  { key: 'compare', href: '/tools/compare', label: 'Compare Strollers', blurb: 'Side by side' },
  { key: 'checker', href: '/tools/travel-system', label: 'Travel System Checker', blurb: 'Car seat fit' },
];

export default function ToolsNav({ current }: { current: ToolKey }) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.06)] bg-white/75 backdrop-blur-sm">
      <nav
        aria-label="Free baby gear tools"
        className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link
          href="/resources"
          className="link-underline inline-flex items-center gap-1.5 self-start text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] sm:self-auto"
        >
          <span aria-hidden>←</span> All Free Tools
        </Link>

        <ul className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const isActive = tool.key === current;

            if (isActive) {
              return (
                <li key={tool.key}>
                  <span
                    aria-current="page"
                    className="inline-flex items-baseline gap-1.5 rounded-full bg-[var(--color-cta-pink)] px-4 py-2 text-white shadow-[0_6px_16px_rgba(216,137,160,0.28)]"
                  >
                    <span className="text-[0.82rem] font-semibold leading-none">{tool.label}</span>
                    <span className="hidden text-[0.68rem] font-medium text-white/80 sm:inline">· {tool.blurb}</span>
                  </span>
                </li>
              );
            }

            return (
              <li key={tool.key}>
                <Link
                  href={tool.href}
                  className="inline-flex items-baseline gap-1.5 rounded-full border border-[rgba(215,161,175,0.4)] bg-white px-4 py-2 text-neutral-700 transition hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)]"
                >
                  <span className="text-[0.82rem] font-semibold leading-none">{tool.label}</span>
                  <span className="hidden text-[0.68rem] font-medium text-neutral-400 sm:inline">· {tool.blurb}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
