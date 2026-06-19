import Link from 'next/link';
import SiteShell from '@/components/SiteShell';

export const metadata = {
  title: 'Page not found · Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell currentPath="/404">
      <main
        className="site-main flex min-h-[60vh] items-center justify-center px-6 py-20"
        style={{ backgroundColor: 'var(--color-ivory)' }}
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="font-script text-[2.4rem] leading-none text-[var(--color-accent-dark)]">
            Oh no
          </p>
          <h1 className="mt-3 font-serif text-[2.2rem] leading-tight tracking-[-0.03em] text-charcoal sm:text-[2.8rem]">
            We couldn&apos;t find that page.
          </h1>
          <p className="mx-auto mt-4 max-w-[42ch] text-[1rem] leading-[1.8] text-[var(--color-muted)]">
            The link may be old or the page may have moved. Let&apos;s get you back to
            something useful.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn btn--primary">
              Back to home
            </Link>
            <Link href="/academy" className="btn btn--secondary">
              Explore the Academy
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
