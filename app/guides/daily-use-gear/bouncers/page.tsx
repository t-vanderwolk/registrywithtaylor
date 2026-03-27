import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearCategoryPage from '@/components/guides/DailyUseGearCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getDailyUseGearCategory, getDailyUseGearCategoryPath } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getDailyUseGearCategory('bouncers');
const path = getDailyUseGearCategoryPath('bouncers');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Daily Use Gear | Taylor-Made Baby Co.`,
  description:
    'Use the TMBC bouncer guide to compare simple bouncers, rocker hybrids, and what earns space in a real daily routine.',
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function DailyUseGearBouncersPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="bouncers" title={category.title} />
        <DailyUseGearCategoryPage slug="bouncers" />
      </main>
    </SiteShell>
  );
}
