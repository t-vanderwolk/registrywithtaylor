import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearCategoryPage from '@/components/guides/DailyUseGearCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getDailyUseGearCategory, getDailyUseGearCategoryPath } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getDailyUseGearCategory('carriers');
const path = getDailyUseGearCategoryPath('carriers');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Daily Use Gear | Taylor-Made Baby Co.`,
  description:
    'Learn how to choose a baby carrier based on fit, comfort, everyday use, and real-life routine support instead of aesthetics alone.',
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function DailyUseGearCarriersPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="carriers" title={category.title} />
        <DailyUseGearCategoryPage slug="carriers" />
      </main>
    </SiteShell>
  );
}
