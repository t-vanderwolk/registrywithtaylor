'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ACADEMY_ENABLED } from '@/lib/featureFlags';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  ...(ACADEMY_ENABLED ? [{ label: 'Academy', href: '/academy' }] : []),
  { label: 'Journal', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Active free tools shown in the Resources dropdown.
const resourceTools: NavLink[] = [
  { label: 'Stroller Quiz', href: '/tools/stroller-quiz' },
  { label: 'Stroller Finder', href: '/tools/stroller-finder' },
  { label: 'Travel System Tool', href: '/tools/travel-system' },
];

type HeaderProps = {
  currentPath: string;
};

export default function Header({ currentPath }: HeaderProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'REVIEWER'
      ? '/admin'
      : '/dashboard';
  const dashboardLabel =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'REVIEWER'
      ? 'Admin'
      : 'My Academy';
  const headerRef = useRef<HTMLElement | null>(null);
  const isGuideRoute =
    currentPath === '/learn' ||
    currentPath.startsWith('/guides/') ||
    currentPath === '/academy' ||
    currentPath.startsWith('/academy/');
  const isActiveLink = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`);

  useEffect(() => {
    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-header-height',
        `${headerRef.current?.getBoundingClientRect().height ?? 0}px`,
      );
    };

    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncHeaderHeight();
          })
        : null;

    if (observer && headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeaderHeight);
    };
  }, [open]);

  const getLinkClassName = (href: string, isMobile = false) => {
    const isActive = isActiveLink(href);

    return `link-underline pb-1 uppercase transition-colors duration-200 ${
      isMobile ? 'inline-flex min-h-[44px] items-center text-[0.95rem] tracking-[0.12em]' : 'text-[0.72rem] tracking-[0.18em]'
    } ${
      isActive
        ? `text-charcoal underline decoration-black/15 ${isMobile ? 'underline-offset-4' : 'underline-offset-8'}`
        : 'text-charcoal/70 hover:text-charcoal'
    }`;
  };

  return (
    <>
      <header
        ref={headerRef}
        className="site-header w-full border-b border-black/6 bg-[#f7f4ef] shadow-[0_1px_0_rgba(0,0,0,0.03),0_14px_30px_rgba(41,30,35,0.04)]"
        style={{
          position: isGuideRoute ? 'sticky' : 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: isGuideRoute ? 50 : 60,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:px-10 md:py-4">
          <Link
            href="/"
            className="max-w-[11.5rem] transition-colors duration-200 hover:text-charcoal/80 sm:max-w-none"
            onClick={() => setOpen(false)}
          >
            <span className="block whitespace-nowrap font-script text-[1.55rem] leading-none text-[var(--color-accent-dark)] sm:text-[1.85rem]">
              Taylor-Made
            </span>
            <span className="mt-1 block font-serif text-[0.68rem] uppercase tracking-[0.28em] text-charcoal/80 sm:text-[0.74rem]">
              Baby Co.
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => {
              if (link.href === '/resources') {
                return (
                  <div key={link.href} className="group relative">
                    <Link
                      href="/resources"
                      aria-current={isActiveLink('/resources') ? 'page' : undefined}
                      className={`${getLinkClassName('/resources')} inline-flex items-center gap-1`}
                    >
                      {link.label}
                      <span aria-hidden className="text-[0.6rem] transition group-hover:translate-y-0.5">▾</span>
                    </Link>
                    <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="rounded-[1rem] border border-[rgba(215,161,175,0.22)] bg-white p-2 shadow-[0_18px_40px_rgba(41,30,35,0.12)]">
                        {resourceTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className="block rounded-[0.65rem] px-3 py-2.5 text-[0.78rem] tracking-[0.04em] text-charcoal/80 transition hover:bg-[rgba(243,226,232,0.6)] hover:text-charcoal"
                          >
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActiveLink(link.href) ? 'page' : undefined}
                  className={getLinkClassName(link.href)}
                >
                  {link.label}
                </Link>
              );
            })}

            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  className={getLinkClassName(dashboardHref)}
                >
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-[0.72rem] uppercase tracking-[0.18em] text-charcoal/60 transition-colors hover:text-charcoal"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className={getLinkClassName('/login')}>
                Sign in
              </Link>
            )}

            <Link
              href="/book"
              className="btn btn--primary min-h-[44px] px-5 py-2 text-[0.68rem] tracking-[0.18em]"
            >
              Book a Registry Consult
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-black/8 bg-white/60 p-1 text-charcoal shadow-[0_8px_20px_rgba(41,30,35,0.05)] backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal md:hidden"
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
          className={`overflow-hidden bg-[#f7f4ef] transition-all duration-300 md:hidden ${
            open
              ? 'max-h-[80svh] border-t border-black/5 opacity-100'
              : 'max-h-0 border-t border-transparent opacity-0 pointer-events-none'
          }`}
          aria-hidden={!open}
        >
          <nav
            id="mobile-navigation"
            className="flex flex-col gap-1.5 overflow-y-auto px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) =>
              link.href === '/resources' ? (
                <div key={link.href}>
                  <Link
                    href="/resources"
                    aria-current={isActiveLink('/resources') ? 'page' : undefined}
                    className={getLinkClassName('/resources', true)}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                  <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-black/10 pl-3">
                    {resourceTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="inline-flex min-h-[40px] items-center text-[0.85rem] tracking-[0.08em] text-charcoal/65 transition-colors hover:text-charcoal"
                        tabIndex={open ? 0 : -1}
                        onClick={() => setOpen(false)}
                      >
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActiveLink(link.href) ? 'page' : undefined}
                  className={getLinkClassName(link.href, true)}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}

            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  className={getLinkClassName(dashboardHref, true)}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }}
                  tabIndex={open ? 0 : -1}
                  className="inline-flex min-h-[44px] items-center text-[0.95rem] uppercase tracking-[0.12em] text-charcoal/60 transition-colors hover:text-charcoal"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={getLinkClassName('/login', true)}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}

            <Link
              href="/book"
              className="btn btn--primary mt-2 w-full justify-center"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              Book a Registry Consult
            </Link>
          </nav>
        </div>
      </header>

      {!isGuideRoute ? (
        <div
          aria-hidden="true"
          className="shrink-0"
          style={{ height: 'var(--site-header-height, 72px)' }}
        />
      ) : null}
    </>
  );
}
