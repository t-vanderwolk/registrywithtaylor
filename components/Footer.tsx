'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Body } from '@/components/Typography';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

type FooterProps = {
  currentPath?: string;
};

export default function Footer({ currentPath = '' }: FooterProps) {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const authLink = isLoggedIn ? '/admin' : '/login';
  const authLabel = isLoggedIn ? 'Dashboard' : 'Login';
  const currentYear = new Date().getFullYear();
  const isHome = currentPath === '/';

  return (
    <footer
      className={`site-footer ${
        isHome
          ? '!border-t !border-[#e6d8cb] !bg-[#f6efe8] !py-10 md:!py-12'
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
        <Body className="body-copy--full">© {currentYear} Taylor-Made Baby Co. Built with care in Chicago.</Body>
        <nav className="footer-nav" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              className="footer-nav__link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="footer-nav__link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            href={authLink}
            aria-current={authLink === currentPath ? 'page' : undefined}
          >
            {authLabel}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
