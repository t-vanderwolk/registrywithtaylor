import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { H2 } from '@/components/ui/MarketingHeading';

/** Shared chrome for the legal pages (Terms, Privacy, Refund). */
export default function LegalShell({
  currentPath,
  title,
  subtitle,
  effectiveDate,
  children,
}: {
  currentPath: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <SiteShell currentPath={currentPath}>
      <Hero eyebrow="Legal" title={title} subtitle={subtitle} />

      <MarketingSection className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-10 text-sm text-neutral-500">Effective {effectiveDate}</p>
        <div className="space-y-10 leading-relaxed text-neutral-700">{children}</div>
      </MarketingSection>
    </SiteShell>
  );
}

/** A numbered legal section with a heading. */
export function LegalSection({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section>
      <H2 className="mb-3 text-xl font-semibold text-charcoal">
        <span className="mr-2 text-[var(--color-accent-dark)]">{n}</span>
        {title}
      </H2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** A simple two-or-more column table used by several policy documents. */
export function LegalTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.9rem]">
        <thead>
          <tr className="border-b border-neutral-200">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 align-top font-semibold text-charcoal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-neutral-100 align-top">
              {cells.map((cell, j) => (
                <td key={j} className="py-3 pr-4 text-neutral-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** hello@ contact block reused at the foot of each policy. */
export function LegalContact() {
  return (
    <p>
      Taylor-Made Baby Co.
      <br />
      Email:{' '}
      <a
        href="mailto:hello@taylormadebabyco.com"
        className="text-[var(--color-accent-dark)] underline underline-offset-2"
      >
        hello@taylormadebabyco.com
      </a>
      <br />
      Website: taylormadebabyco.com
    </p>
  );
}
