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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__wrapper">
        <Body className="body-copy--full">© {currentYear} Taylor-Made Baby Planning. Built with care in Chicago.</Body>
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
