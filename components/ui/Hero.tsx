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
  contentClassName = '',
  innerClassName = '',
  innerStyle,
  showRibbon = true,
  fullBleed = true,
  showImage = true,
  staggerContent = false,
  ribbonEnhanced = false,
  ribbonClassName = '',
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
  contentClassName?: string;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  showRibbon?: boolean;
  fullBleed?: boolean;
  showImage?: boolean;
  staggerContent?: boolean;
  ribbonEnhanced?: boolean;
  ribbonClassName?: string;
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

  const staggerClass = staggerContent
    ? 'motion-safe:opacity-0 motion-safe:animate-[heroFadeUp_0.62s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none'
    : '';

  const staggerStyle = (delayMs: number): CSSProperties | undefined =>
    staggerContent
      ? {
          animationDelay: `${delayMs}ms`,
        }
      : undefined;

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
        <div
          className={`absolute left-0 w-full z-20 pointer-events-none ${
            ribbonEnhanced ? 'bottom-[-42px] md:bottom-[-54px]' : 'bottom-[-10px]'
          }`}
        >
          <RibbonDivider enhanced={ribbonEnhanced} className={ribbonClassName} decorative />
        </div>
      )}

      <div className={`hero-inner relative z-10 ${innerClassName}`.trim()} style={innerStyle}>
        <div
          className={`hero-content ${staggerContent ? '' : 'animate-hero-fade'} ${contentClassName}`.trim()}
          style={contentStyle}
        >
          {eyebrow && (
            <p className={`hero-eyebrow ${staggerClass}`.trim()} style={staggerStyle(120)}>
              {eyebrow}
            </p>
          )}

          <h1 className={`hero-title ${staggerClass}`.trim()} style={staggerStyle(220)}>
            {title}
          </h1>

          {subtitle && (
            <p className={`hero-subhead ${staggerClass}`.trim()} style={staggerStyle(320)}>
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className={`hero-cta-group ${staggerClass}`.trim()} style={staggerStyle(420)}>
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}

          {tagline && (
            <p className={`hero-tagline ${staggerClass}`.trim()} style={staggerStyle(500)}>
              {tagline}
            </p>
          )}
        </div>
      </div>

    </section>
  );
}
