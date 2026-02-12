import Link from 'next/link';
import { Body } from '@/components/Typography';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__wrapper">
        <Body className="body-copy--full">© 2026 Registry With Taylor. Built with care in Chicago.</Body>
        <nav className="footer-nav" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link key={link.href} className="footer-nav__link" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
