import { Suspense } from 'react';
import BookContent from '@/components/booking/BookContent';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Schedule Your Consultation — Taylor-Made Baby Co.',
  description:
    'Pick a time that works for you. Your free 30-minute consultation with Taylor is just one step away.',
  path: '/book',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Schedule a consultation with Taylor-Made Baby Co.',
});

export default function BookPage() {
  return (
    <SiteShell currentPath="/book">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <p className="text-sm text-neutral-400">Loading…</p>
            </div>
          }
        >
          <BookContent />
        </Suspense>
      </main>
    </SiteShell>
  );
}
