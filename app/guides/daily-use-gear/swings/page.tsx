import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearCategoryPage from '@/components/guides/DailyUseGearCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getDailyUseGearCategory, getDailyUseGearCategoryPath } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getDailyUseGearCategory('swings');
const path = getDailyUseGearCategoryPath('swings');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Daily Use Gear | Taylor-Made Baby Co.`,
  description:
    'Understand swing types, footprint tradeoffs, and how to judge whether motion support belongs in your actual routine.',
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function DailyUseGearSwingsPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="swings" title={category.title} />
        <DailyUseGearCategoryPage slug="swings" />
      </main>
    </SiteShell>
  );
}
