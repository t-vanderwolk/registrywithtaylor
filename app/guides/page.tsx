import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuidesEducationHub from '@/components/guides/GuidesEducationHub';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'TMBC Education Hub | Taylor-Made Baby Co.',
  description:
    'Use the TMBC Guide Hub as the calm starting point for registry, nursery, stroller, car seat, travel, daily use gear, feeding, and postpartum decisions.',
  path: '/learn',
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. education hub for real-life baby prep.',
});

export default function GuidesIndexPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main min-h-0">
        <PageViewTracker path="/learn" pageType="guide" />
        <GuidesEducationHub />
      </main>
    </SiteShell>
  );
}
