import Image from 'next/image';
import Link from 'next/link';

type CTA = {
  label: string;
  href: string;
};

export default function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  tagline: _tagline,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  tagline?: string;
  image: string;
}) {
  return (
    <section className="hero-section">
      <div className="hero-media">
        <Image
          src={image}
          // Decorative hero background; all meaningful content is in text/CTAs.
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-inner">
        <div className="hero-content animate-hero-fade">
          {eyebrow && <p className="hero-eyebrow">{eyebrow}</p>}

          <h1 className="hero-title">{title}</h1>

          {subtitle && <p className="hero-subhead">{subtitle}</p>}

          {(primaryCta || secondaryCta) && (
            <div className="hero-cta-group">
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-secondary">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
