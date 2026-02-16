import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import RibbonDivider from '@/components/layout/RibbonDivider';

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
  tagline,
  image,
  imageAlt = '',
  className = '',
  contentStyle,
  showRibbon = true,
  fullBleed = true,
  showImage = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  tagline?: string;
  image: string;
  imageAlt?: string;
  className?: string;
  contentStyle?: CSSProperties;
  showRibbon?: boolean;
  fullBleed?: boolean;
  showImage?: boolean;
}) {
  const sectionClassName = [
    'hero-section',
    'relative',
    'overflow-visible',
    fullBleed ? 'hero-section--full-bleed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={`${sectionClassName} min-h-[85vh]`}>
      {showImage && (
        <div className="hero-media absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : true}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* optional subtle darkening if needed */}
          <div className="hero-overlay absolute inset-0" />
        </div>
      )}

      {showRibbon && showImage && (
        <div className="absolute bottom-[-10px] left-0 w-full z-20 pointer-events-none">
          <RibbonDivider />
        </div>
      )}

      <div className="hero-inner relative z-10">
        <div className="hero-content animate-hero-fade" style={contentStyle}>
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

          {tagline && <p className="hero-tagline">{tagline}</p>}
        </div>
      </div>

      {/* ⬇️ CRITICAL: Bottom fade into ivory */}
      <div className="absolute bottom-0 left-0 w-full h-[160px] bg-gradient-to-b from-transparent via-[#f8f4f0]/30 to-[#f8f4f0]" />
    </section>
  );
}
