import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuidesEducationHub from '@/components/guides/GuidesEducationHub';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'TMBC Education Hub | Taylor-Made Baby Co.',
  description:
    'Start with the TMBC Education Hub for calmer baby registry, stroller, car seat, nursery, travel, feeding, and postpartum guidance.',
  path: '/guides',
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. education hub for real-life baby prep.',
});

export default function GuidesIndexPage() {
  return (
    <SiteShell currentPath="/guides">
      <main className="site-main">
        <PageViewTracker path="/guides" pageType="guide" />
        <GuidesEducationHub />
      </main>
    </SiteShell>
  );
}
