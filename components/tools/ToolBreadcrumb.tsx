import Link from 'next/link';

/**
 * Shared in-tool breadcrumb (Home / Baby Gear Tools / <current>) used at the top
 * of every free tool, matching the Stroller Quiz page. "Baby Gear Tools" points
 * to the /resources hub where the free tools are surfaced.
 */
export default function ToolBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.16em] text-neutral-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="link-underline hover:text-[var(--color-accent-dark)]">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-neutral-300">
          /
        </li>
        <li>
          <Link href="/resources" className="link-underline hover:text-[var(--color-accent-dark)]">
            Baby Gear Tools
          </Link>
        </li>
        <li aria-hidden className="text-neutral-300">
          /
        </li>
        <li aria-current="page" className="text-[var(--color-accent-dark)]">
          {current}
        </li>
      </ol>
    </nav>
  );
}
