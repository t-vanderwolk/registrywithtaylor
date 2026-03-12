'use client';

import Link from 'next/link';
import { Body } from '@/components/Typography';
import LuxuryIconFrame from '@/components/ui/LuxuryIconFrame';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/guides' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#journey' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Consultation', href: '/consultation' },
];

type FooterProps = {
  currentPath?: string;
};

export default function Footer({ currentPath = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isHome = currentPath === '/';

  return (
    <footer
      className={`site-footer ${
        isHome
          ? '!border-t !border-[#e6d8cb] !bg-[#f6efe8]'
          : ''
      }`.trim()}
      role="contentinfo"
    >
      <div className={`container site-footer__wrapper ${isHome ? 'gap-4 md:gap-5' : ''}`.trim()}>
        {isHome && (
          <div
            aria-hidden="true"
            className="mb-1 h-px w-full bg-gradient-to-r from-transparent via-[#d9c8ba] to-transparent"
          />
        )}
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/50">Taylor-Made Baby Co.</p>
          <p className="body-copy--full text-sm leading-relaxed text-[var(--color-muted)]">
            Expert baby gear guidance for modern families preparing for parenthood with clarity and confidence.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4">
          <a
            className="inline-flex min-h-[44px] items-center text-sm text-[var(--color-muted)] hover:opacity-70 transition"
            href="mailto:taylor@taylormadebabyco.com"
          >
            <span className="link-underline">taylor@taylormadebabyco.com</span>
          </a>
          <a
            href="https://instagram.com/taylormadebabyco"
            aria-label="Taylor-Made Baby Co. on Instagram (@taylormadebabyco)"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-muted)] transition hover:opacity-70"
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
        <Body className="body-copy--full text-center sm:text-left">© {currentYear} Taylor-Made Baby Co. Built with care in Scottsdale.</Body>
        <nav className="footer-nav justify-center sm:justify-start" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              className="footer-nav__link inline-flex min-h-[44px] items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              href={link.href}
            >
              <span className="link-underline">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
