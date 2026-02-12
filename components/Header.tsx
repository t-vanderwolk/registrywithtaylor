import Link from 'next/link';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

type HeaderProps = {
  currentPath: string;
};

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="site-header" role="banner">
      <div className="container site-header__wrapper">
        <Link className="site-header__brand" href="/">
          <span className="brand__name">Registry With Taylor</span>
        </Link>

        <nav
          className="primary-nav nav"
          id="primary-nav"
          role="navigation"
          aria-label="Primary"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          {navLinks.map((link) => {
            const isActive = link.href === currentPath;
            return (
              <Link
                key={link.href}
                className="nav-item primary-nav__link"
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          <span className="nav-toggle__icon" aria-hidden="true"></span>
          <span>Menu</span>
        </button>
      </div>
    </header>
  );
}
