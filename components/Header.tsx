'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

type HeaderProps = {
  currentPath: string;
};

export default function Header({ currentPath }: HeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const authLink = isLoggedIn ? '/admin' : '/login';
  const authLabel = isLoggedIn ? 'Dashboard' : 'Login';

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          Taylor-Made Baby Planning
        </Link>

        <nav className="primary-nav">
          {navLinks.map((link) => {
            const isActive = link.href === currentPath;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={authLink}
            aria-current={authLink === pathname ? 'page' : undefined}
          >
            {authLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
