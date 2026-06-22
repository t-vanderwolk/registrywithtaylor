'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './MemberLayout.module.scss';

const NAV_ITEMS = [
  { href: '/dashboard',           label: 'Home'    },
  { href: '/dashboard/academy',   label: 'Academy' },
  { href: '/dashboard/tools',     label: 'Tools'   },
  { href: '/book',        label: 'Consult' },
] as const;

function MemberNav({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <nav aria-label="Member navigation">
      <ul className={styles.navList}>
        {NAV_ITEMS.map(({ href, label }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                onClick={onClose}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          {/* Logo / wordmark */}
          <Link href="/dashboard" className={styles.wordmark} aria-label="Taylor-Made Baby Co. Dashboard">
            TMBC
          </Link>

          {/* Desktop nav */}
          <div className={styles.desktopNav}>
            <MemberNav pathname={pathname} />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign out
            </button>

            {/* Hamburger */}
            <button
              type="button"
              className={styles.hamburger}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barTopOpen : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barMidOpen : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barBotOpen : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <MemberNav pathname={pathname} onClose={() => setMenuOpen(false)} />
            <div className={styles.mobileActions}>
              <button
                type="button"
                className={styles.signOutBtn}
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
