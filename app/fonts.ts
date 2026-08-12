/**
 * Self-hosted fonts via next/font/google.
 *
 * Replaces the render-blocking `<link rel="stylesheet">` to Google Fonts (which
 * cost ~2.5s of render-blocking time on mobile PSI). next/font downloads the
 * font files at build time, self-hosts them, injects a preload, and applies
 * `font-display: swap` — so there is no external, render-blocking request and no
 * layout shift.
 *
 * Each font exposes a CSS variable that feeds the existing `--font-*` design
 * tokens in globals.css (see the `--font-serif-next` etc. references there), so
 * nothing else in the styling has to change.
 */
import { Playfair_Display, Cormorant_Garamond, Nunito, Great_Vibes, Caveat } from 'next/font/google';

export const fontSerif = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif-next',
  display: 'swap',
});

export const fontAccent = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-accent-next',
  display: 'swap',
});

export const fontSans = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans-next',
  display: 'swap',
});

export const fontScript = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script-next',
  display: 'swap',
});

export const fontHandwritten = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-handwritten-next',
  display: 'swap',
});

/** All five font CSS-variable classes, to apply once on <html>. */
export const fontVariables = [
  fontSerif.variable,
  fontAccent.variable,
  fontSans.variable,
  fontScript.variable,
  fontHandwritten.variable,
].join(' ');
