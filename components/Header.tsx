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

  const getLinkClassName = (href: string) => {
    const isActive = href === currentPath;

    return `link-underline pb-1 text-sm tracking-[0.2em] uppercase transition-colors duration-200 ${
      isActive
        ? 'text-charcoal underline decoration-black/15 underline-offset-8'
        : 'text-charcoal/70 hover:text-charcoal'
    }`;
  };

  return (
    <header className="site-header w-full border-b border-black/5 bg-[#F7F4EF]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-charcoal transition-colors duration-200 hover:text-charcoal/80"
          onClick={() => setOpen(false)}
        >
          Taylor-Made Baby Co.
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
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
          className="flex flex-col gap-1 text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal md:hidden"
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
            ? 'max-h-96 border-t border-black/5 opacity-100'
            : 'max-h-0 border-t border-transparent opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <nav
          id="mobile-navigation"
          className="flex flex-col gap-6 px-6 py-6"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === currentPath ? 'page' : undefined}
              className={getLinkClassName(link.href)}
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
