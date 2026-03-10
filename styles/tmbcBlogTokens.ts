import type { CSSProperties } from 'react';

export const blogTokens = {
  colors: {
    ivory: '#FCF8F9',
    blush: '#F4C2C2',
    blushSoft: '#F8E4E8',
    rose: '#E89AAE',
    charcoal: '#2B2B2B',
    softText: '#6B6768',
  },
  typography: {
    headline: 'Playfair Display, serif',
    accent: 'Cormorant Garamond, serif',
    body: 'Inter, sans-serif',
  },
  spacing: {
    section: '80px',
    paragraph: '22px',
  },
  radius: {
    card: '20px',
  },
} as const;

export const blogTokenStyles: CSSProperties = {
  ['--tmbc-blog-ivory' as const]: blogTokens.colors.ivory,
  ['--tmbc-blog-blush' as const]: blogTokens.colors.blush,
  ['--tmbc-blog-blush-soft' as const]: blogTokens.colors.blushSoft,
  ['--tmbc-blog-rose' as const]: blogTokens.colors.rose,
  ['--tmbc-blog-charcoal' as const]: blogTokens.colors.charcoal,
  ['--tmbc-blog-soft-text' as const]: blogTokens.colors.softText,
  ['--tmbc-blog-headline' as const]: blogTokens.typography.headline,
  ['--tmbc-blog-accent' as const]: blogTokens.typography.accent,
  ['--tmbc-blog-body' as const]: blogTokens.typography.body,
  ['--tmbc-blog-section-spacing' as const]: blogTokens.spacing.section,
  ['--tmbc-blog-paragraph-spacing' as const]: blogTokens.spacing.paragraph,
  ['--tmbc-blog-card-radius' as const]: blogTokens.radius.card,
} as CSSProperties;
