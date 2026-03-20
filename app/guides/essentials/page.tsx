import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideFutureHubPage from '@/components/guides/GuideFutureHubPage';
import SiteShell from '@/components/SiteShell';
import { getFutureGuideHubConfig } from '@/lib/guides/educationHub';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const config = getFutureGuideHubConfig('essentials');

export const metadata = buildMarketingMetadata({
  title: 'Baby Essentials Hub | Taylor-Made Baby Co.',
  description:
    'A calmer place to sort what you actually need, what can wait, and how to build a smarter baseline for baby prep.',
  path: config.path,
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. essentials guide hub.',
});

export default function EssentialsGuideHubPage() {
  return (
    <SiteShell currentPath={config.path}>
      <main className="site-main">
        <PageViewTracker path={config.path} pageType="guide" />
        <GuideFutureHubPage config={config} />
      </main>
    </SiteShell>
  );
}
