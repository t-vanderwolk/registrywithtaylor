'use client';

import { useEffect, useRef, useState } from 'react';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';

type ServiceLink = { label: string; url: string };

type BlogServiceCardProps = {
  /** Eyebrow describing the kind of offering (e.g. "Registry Platform", "Subscription"). */
  category?: string | null;
  brand?: string | null;
  name: string;
  tagline?: string | null;
  /** Free-text price so "$14.99/mo", "Free", "From $99/yr" all render cleanly. */
  price?: string | null;
  bestFor?: string | null;
  includes?: string[];
  links?: ServiceLink[];
  badge?: string | null;
  imageUrl?: string | null;
  position: number;
};

// Fade-and-rise the card in once it scrolls into view (respects reduced motion).
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function CheckMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.14" />
      <path d="M6 10.4l2.6 2.6L14.4 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function initials(text: string) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export default function BlogServiceCard({
  category,
  brand,
  name,
  tagline,
  price,
  bestFor,
  includes = [],
  links = [],
  badge,
  imageUrl,
  position,
}: BlogServiceCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const displayBrand = brand?.trim() || null;
  const fullName = displayBrand ? `${displayBrand} ${name}`.trim() : name.trim();
  const fallbackLabel = displayBrand || name;

  return (
    <div
      ref={ref}
      className={['blog-service-card not-prose', visible ? 'is-revealed' : ''].filter(Boolean).join(' ')}
    >
      <div className="blog-service-card__media">
        {badge ? <span className="blog-service-card__badge">{badge}</span> : null}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img loading="lazy" decoding="async" src={imageUrl} alt={fullName} className="blog-service-card__image" />
        ) : (
          <span className="blog-service-card__fallback" aria-hidden="true">
            {initials(fallbackLabel) || fallbackLabel}
          </span>
        )}
      </div>

      <div className="blog-service-card__body">
        {category ? <span className="blog-service-card__eyebrow">{category}</span> : null}
        {displayBrand ? <p className="blog-service-card__brand">{displayBrand}</p> : null}
        <p className="blog-service-card__title">{name}</p>
        {tagline ? <p className="blog-service-card__tagline">{tagline}</p> : null}

        {price ? (
          <p className="blog-service-card__price">
            {price}
          </p>
        ) : null}

        {includes.length > 0 ? (
          <div className="blog-service-card__includes">
            <span className="blog-service-card__includes-label">What&rsquo;s included</span>
            {includes.map((item, i) => (
              <span key={`include-${i}`} className="blog-service-card__include">
                <CheckMark />
                <span>{item}</span>
              </span>
            ))}
          </div>
        ) : null}

        {bestFor ? <p className="blog-service-card__bestfor">Best for: {bestFor}</p> : null}

        {links.length > 0 ? (
          <div className="blog-service-card__actions">
            {links.map((link, i) => (
              <TrackedAffiliateLink
                key={`link-${i}`}
                href={link.url}
                ctaText={link.label}
                ariaLabel={`${link.label} — ${fullName}`}
                className={`tool-btn tool-btn--${i === 0 ? 'primary' : 'secondary'} tool-btn--block flex items-center justify-center gap-2`}
                meta={{
                  product: fullName,
                  brand: displayBrand ?? name,
                  category: category ?? 'service',
                  position,
                  context: 'blog-service-card',
                }}
              >
                <span>{link.label} →</span>
              </TrackedAffiliateLink>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
