import type { GuideHubIconKey } from '@/lib/guides/hubs';

function iconClasses(className?: string) {
  return `h-5 w-5 stroke-[1.8] ${className ?? ''}`.trim();
}

export default function GuideGlyph({
  icon,
  className,
}: {
  icon: GuideHubIconKey;
  className?: string;
}) {
  switch (icon) {
    case 'compact':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M5 9h8l3 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14v3" stroke="currentColor" strokeLinecap="round" />
          <path d="M16 13v4" stroke="currentColor" strokeLinecap="round" />
          <circle cx="8" cy="18" r="2" stroke="currentColor" />
          <circle cx="17" cy="18" r="2" stroke="currentColor" />
        </svg>
      );
    case 'plane':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="m3 13 18-7-5 13-3-4-4 2 1-4-7 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'terrain':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M3 18h5l3-5 4 3 2-4 4 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 6h18" stroke="currentColor" strokeLinecap="round" strokeDasharray="2 3" />
        </svg>
      );
    case 'double':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <rect x="4" y="5" width="6" height="8" rx="2" stroke="currentColor" />
          <rect x="14" y="5" width="6" height="8" rx="2" stroke="currentColor" />
          <path d="M7 13v5M17 13v5" stroke="currentColor" strokeLinecap="round" />
          <circle cx="7" cy="19" r="2" stroke="currentColor" />
          <circle cx="17" cy="19" r="2" stroke="currentColor" />
        </svg>
      );
    case 'carseat':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M8 6a4 4 0 0 1 8 0v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-4a6 6 0 0 1 2-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'convertible':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M7 5h10v6H7z" stroke="currentColor" />
          <path d="M7 11v8h10v-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m9 15 3-3 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="m4 12 8 4 8-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m4 16 8 4 8-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M12 4 6 6.5V12c0 4.1 2.4 6.8 6 8 3.6-1.2 6-3.9 6-8V6.5L12 4Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="m9.5 12 1.7 1.7 3.3-3.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'sleep':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M5 15a4 4 0 0 1 4-4h8a2 2 0 0 1 2 2v4H5v-2Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M7 11V9a2 2 0 0 1 2-2h3" stroke="currentColor" strokeLinecap="round" />
          <path d="M15 5h3l-2 2h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" strokeLinejoin="round" />
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <rect x="5" y="5" width="14" height="5" rx="1.5" stroke="currentColor" />
          <rect x="5" y="10" width="14" height="5" rx="1.5" stroke="currentColor" />
          <rect x="5" y="15" width="14" height="5" rx="1.5" stroke="currentColor" />
        </svg>
      );
    case 'small-space':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M4 9V5h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 9V5h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v4h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 15v4h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" />
          <path d="M8 4v4M16 4v4M4 10h16" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'road':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M9 4h6l3 16H6L9 4Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M12 7v2.5M12 12v2.5M12 17v1" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'bag':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M7 8V7a5 5 0 0 1 10 0v1" stroke="currentColor" strokeLinecap="round" />
          <path d="M5 8h14l-1 11H6L5 8Z" stroke="currentColor" strokeLinejoin="round" />
        </svg>
      );
    case 'checklist':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="m7 7 1.5 1.5L11 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m7 12 1.5 1.5L11 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m7 17 1.5 1.5L11 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 7h4M13 12h4M13 17h4" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'strategy':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M5 19 19 5" stroke="currentColor" strokeLinecap="round" />
          <path d="M8 5h11v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 8V5h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H19v16H8.5A2.5 2.5 0 0 0 6 21V5.5Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M6 5h11" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'stroller':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClasses(className)}>
          <path d="M6 7h5l4 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 13v3M16 13v3" stroke="currentColor" strokeLinecap="round" />
          <circle cx="9" cy="18" r="2" stroke="currentColor" />
          <circle cx="17" cy="18" r="2" stroke="currentColor" />
          <path d="M8 7V5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
  }
}
