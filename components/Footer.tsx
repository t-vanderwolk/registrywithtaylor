'use client';

import Link from 'next/link';
import LuxuryIconFrame from '@/components/ui/LuxuryIconFrame';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Academy', href: '/academy' },
  { label: 'Journal', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Consultation', href: '/consultation' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--color-border)] bg-[var(--color-paper)] pb-8 pt-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="block font-script text-[1.4rem] leading-none text-[var(--color-accent-dark)]">
              Taylor-Made
            </span>
            <span className="mt-1 block font-serif text-[0.64rem] uppercase tracking-[0.28em] text-charcoal/70">
              Baby Co.
            </span>
            <p className="mt-3 max-w-[22rem] text-[0.84rem] leading-6 text-[var(--color-muted)]">
              Expert baby gear guidance for modern families preparing for parenthood with clarity and confidence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:taylor@taylormadebabyco.com"
              className="text-[0.82rem] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
            >
              taylor@taylormadebabyco.com
            </a>
            <a
              href="https://instagram.com/taylorbabyconcierge"
              aria-label="Taylor-Made Baby Co. on Instagram (@taylorbabyconcierge)"
              target="_blank"
              rel="noreferrer"
              className="group text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-accent-dark)]"
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

        {/* Divider */}
        <div className="my-7 h-px bg-[var(--color-border)]" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
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
