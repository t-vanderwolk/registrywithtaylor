'use client';

import Link from 'next/link';
import LuxuryIconFrame from '@/components/ui/LuxuryIconFrame';
import { ACADEMY_ENABLED } from '@/lib/featureFlags';

const exploreLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  ...(ACADEMY_ENABLED ? [{ label: 'Academy', href: '/academy' }] : []),
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const resourceLinks = [
  { label: 'Stroller Quiz', href: '/tools/stroller-quiz' },
  { label: 'Stroller Finder', href: '/tools/stroller-finder' },
  { label: 'Travel System Tool', href: '/tools/travel-system' },
];

const legalLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book', href: '/book' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--color-border)] bg-[var(--color-paper)] pb-8 pt-12"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
          {/* Brand */}
          <div>
            <span className="block font-script text-[1.4rem] leading-none text-[var(--color-accent-dark)]">
              Taylor-Made
            </span>
            <span className="mt-1 block font-serif text-[0.64rem] uppercase tracking-[0.28em] text-charcoal/70">
              Baby Co.
            </span>
            <p className="mt-3 max-w-[24rem] text-[0.84rem] leading-6 text-[var(--color-muted)]">
              Baby gear guidance for expecting parents who want practical, expert help making registry,
              stroller, car seat, and nursery decisions.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">Explore</p>
            <nav className="mt-3 flex flex-col gap-2.5" aria-label="Footer explore">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-[0.84rem] text-[var(--color-muted)] transition duration-200 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Free tools */}
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">Free Tools</p>
            <nav className="mt-3 flex flex-col gap-2.5" aria-label="Footer free tools">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-[0.84rem] text-[var(--color-muted)] transition duration-200 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">Connect</p>
            <div className="mt-3 flex flex-col gap-3">
              <a
                href="mailto:taylor@taylormadebabyco.com"
                className="w-fit text-[0.84rem] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
              >
                taylor@taylormadebabyco.com
              </a>
              <a
                href="https://instagram.com/taylorbabyconcierge"
                aria-label="Taylor-Made Baby Co. on Instagram (@taylorbabyconcierge)"
                target="_blank"
                rel="noreferrer"
                className="group w-fit text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
              >
                <LuxuryIconFrame size="micro" className="text-[var(--color-accent-dark)]" syncWithGroup>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                  </svg>
                </LuxuryIconFrame>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-7 h-px bg-[var(--color-border)]" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer secondary navigation">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-muted)] transition duration-200 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="shrink-0 text-[0.78rem] text-[var(--color-muted)]">
            © {currentYear} Taylor-Made Baby Co.
          </p>
        </div>
      </div>
    </footer>
  );
}
