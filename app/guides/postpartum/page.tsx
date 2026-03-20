import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideFutureHubPage from '@/components/guides/GuideFutureHubPage';
import SiteShell from '@/components/SiteShell';
import { getFutureGuideHubConfig } from '@/lib/guides/educationHub';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const config = getFutureGuideHubConfig('postpartum');

export const metadata = buildMarketingMetadata({
  title: 'Postpartum Hub | Taylor-Made Baby Co.',
  description:
    'A calmer place to prep for recovery, home support, and the first-weeks decisions that affect the whole household.',
  path: config.path,
  imagePath: '/assets/hero/hero-baby-editorial.jpg',
  imageAlt: 'Taylor-Made Baby Co. postpartum guide hub.',
});

export default function PostpartumGuideHubPage() {
  return (
    <SiteShell currentPath={config.path}>
      <main className="site-main">
        <PageViewTracker path={config.path} pageType="guide" />
        <GuideFutureHubPage config={config} />
      </main>
    </SiteShell>
  );
}
