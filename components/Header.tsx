'use client';
import { useState } from 'react';
import Link from 'next/link';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Guides', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

type HeaderProps = {
  currentPath: string;
};

export default function Header({ currentPath }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const getLinkClassName = (href: string, isMobile = false) => {
    const isActive = href === currentPath;

    return `link-underline pb-1 uppercase transition-colors duration-200 ${
      isMobile ? 'inline-flex min-h-[44px] items-center text-[0.95rem] tracking-[0.12em]' : 'text-sm tracking-[0.2em]'
    } ${
      isActive
        ? `text-charcoal underline decoration-black/15 ${isMobile ? 'underline-offset-4' : 'underline-offset-8'}`
        : 'text-charcoal/70 hover:text-charcoal'
    }`;
  };

  return (
    <header className="site-header w-full border-b border-black/5 bg-[#F7F4EF]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 md:px-10 md:py-5">
        <Link
          href="/"
          className="max-w-[11.5rem] font-serif text-[0.98rem] leading-tight tracking-[0.01em] text-charcoal transition-colors duration-200 hover:text-charcoal/80 sm:max-w-none sm:text-lg"
          onClick={() => setOpen(false)}
        >
          Taylor-Made Baby Co.
        </Link>

        <nav className="hidden items-center gap-8 lg:gap-10 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.href === currentPath ? 'page' : undefined}
                className={getLinkClassName(link.href)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          className="flex flex-col gap-1 p-1 text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Toggle menu"
        >
          <span
            className={`h-px w-6 bg-current transition-all duration-300 ${
              open ? 'translate-y-[5px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-current transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`h-px w-6 bg-current transition-all duration-300 ${
              open ? '-translate-y-[5px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden bg-[#F7F4EF] transition-all duration-300 md:hidden ${
          open
            ? 'max-h-[80svh] border-t border-black/5 opacity-100'
            : 'max-h-0 border-t border-transparent opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <nav
          id="mobile-navigation"
          className="flex flex-col gap-2 overflow-y-auto px-4 py-4 sm:px-6"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === currentPath ? 'page' : undefined}
              className={getLinkClassName(link.href, true)}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
