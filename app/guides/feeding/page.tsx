import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideFutureHubPage from '@/components/guides/GuideFutureHubPage';
import SiteShell from '@/components/SiteShell';
import { getFutureGuideHubConfig } from '@/lib/guides/educationHub';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const config = getFutureGuideHubConfig('feeding');

export const metadata = buildMarketingMetadata({
  title: 'Feeding Hub | Taylor-Made Baby Co.',
  description:
    'A calmer place to think through feeding gear, setup, and what matters now versus what can be decided later.',
  path: config.path,
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. feeding guide hub.',
});

export default function FeedingGuideHubPage() {
  return (
    <SiteShell currentPath={config.path}>
      <main className="site-main">
        <PageViewTracker path={config.path} pageType="guide" />
        <GuideFutureHubPage config={config} />
      </main>
    </SiteShell>
  );
}
