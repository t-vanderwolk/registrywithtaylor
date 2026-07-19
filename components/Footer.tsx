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
  { label: 'Compare Strollers', href: '/tools/compare' },
  { label: 'Travel System Tool', href: '/tools/travel-system' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Refund Policy', href: '/refund' },
  { label: 'Contact', href: '/contact' },
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
                href="mailto:info@taylormadebabyco.com"
                className="w-fit text-[0.84rem] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
              >
                info@taylormadebabyco.com
              </a>
              <a
                href="tel:+14807124347"
                className="w-fit text-[0.84rem] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
              >
                480-712-4347
              </a>
              <div className="flex items-center gap-3">
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
                <a
                  href="https://wa.me/14807124347"
                  aria-label="Chat with Taylor-Made Baby Co. on WhatsApp (480-712-4347)"
                  target="_blank"
                  rel="noreferrer"
                  className="group w-fit text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
                >
                  <LuxuryIconFrame size="micro" className="text-[var(--color-accent-dark)]" syncWithGroup>
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                      <path
                        fill="currentColor"
                        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-.99.24-3.35-.7-2.83-1.12-4.6-4.02-4.74-4.2-.14-.19-1.12-1.49-1.12-2.84 0-1.35.71-2.01.96-2.29.24-.28.53-.35.71-.35.18 0 .36.01.51.01.16.01.39-.06.6.46.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.09 1.53.72 1.79.85.26.14.43.21.5.33.07.12.07.68-.17 1.36Z"
                      />
                    </svg>
                  </LuxuryIconFrame>
                </a>
              </div>
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
