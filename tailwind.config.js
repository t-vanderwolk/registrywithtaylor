/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        tmbcBlush: 'var(--tmbc-blush)',
        tmbcRose: 'var(--tmbc-rose)',
        tmbcSoftPink: 'var(--tmbc-soft-pink)',
        blush: 'var(--tmbc-blush)',
        linenNav: 'var(--color-linen-nav)',
        ivory: 'var(--color-ivory)',
        softBlush: 'var(--color-soft-blush)',
        warmNeutral: 'var(--color-warm-neutral)',
        cardBg: 'var(--color-card-bg)',
        cardBorder: 'var(--color-card-border)',
        charcoal: '#3A3A3A',
        taupe: '#d6bfb7',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        accent: ['var(--font-accent)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body-lg': ['1.125rem', { lineHeight: '1.9rem' }],
        'section-title': ['clamp(1.9rem, 3.8vw, 2.8rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'hero-display': ['clamp(3rem, 6vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        card: '0 12px 30px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 18px 46px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        card: '2rem',
      },
      spacing: {
        'section-y': 'clamp(5rem, 10vw, 8rem)',
        'card-gap': 'clamp(2rem, 6vw, 3rem)',
      },
    },
  },
  safelist: [
    'section-ivory',
    'section-white',
    'section-beige',
    'section-spacing',
    'card-surface',
    'spacing-card-gap',
  ],
  plugins: [],
};
