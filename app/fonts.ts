/**
 * Self-hosted fonts via next/font/local.
 *
 * The .woff2 files are vendored in app/_fonts/ (sourced from the @fontsource
 * packages). Using next/font/local — rather than next/font/google — means the
 * production build never fetches from fonts.gstatic.com, so builds can no longer
 * fail on a transient Google Fonts network error. next/font still self-hosts,
 * preloads, and applies `font-display: swap`, so there is no external,
 * render-blocking request and no layout shift.
 *
 * Each font exposes a CSS variable that feeds the existing `--font-*` design
 * tokens in globals.css (see the `--font-*-next` references there), so nothing
 * else in the styling has to change.
 */
import localFont from 'next/font/local';

export const fontSerif = localFont({
  src: [
    { path: './_fonts/playfair-display-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './_fonts/playfair-display-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './_fonts/playfair-display-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-serif-next',
  display: 'swap',
});

export const fontAccent = localFont({
  src: [
    { path: './_fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './_fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './_fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './_fonts/cormorant-garamond-latin-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  variable: '--font-accent-next',
  display: 'swap',
  // Decorative/secondary — not needed for above-the-fold paint. Skipping preload
  // frees the critical path so the serif (H1) + sans (body) fonts and the CSS
  // load first, improving LCP. Still loads on demand via font-display: swap.
  preload: false,
});

export const fontSans = localFont({
  src: [
    { path: './_fonts/nunito-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './_fonts/nunito-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './_fonts/nunito-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './_fonts/nunito-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './_fonts/nunito-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-sans-next',
  display: 'swap',
});

export const fontScript = localFont({
  src: [{ path: './_fonts/great-vibes-latin-400-normal.woff2', weight: '400', style: 'normal' }],
  variable: '--font-script-next',
  display: 'swap',
  preload: false,
});

export const fontHandwritten = localFont({
  src: [
    { path: './_fonts/caveat-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './_fonts/caveat-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './_fonts/caveat-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-handwritten-next',
  display: 'swap',
  preload: false,
});

/** All five font CSS-variable classes, to apply once on <html>. */
export const fontVariables = [
  fontSerif.variable,
  fontAccent.variable,
  fontSans.variable,
  fontScript.variable,
  fontHandwritten.variable,
].join(' ');
