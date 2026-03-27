import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearCategoryPage from '@/components/guides/DailyUseGearCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getDailyUseGearCategory, getDailyUseGearCategoryPath } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getDailyUseGearCategory('baby-bath');
const path = getDailyUseGearCategoryPath('baby-bath');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Daily Use Gear | Taylor-Made Baby Co.`,
  description:
    'Sort sink inserts, infant tubs, convertible bath setups, and what actually matters when choosing baby bath gear.',
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function DailyUseGearBabyBathPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="baby-bath" title={category.title} />
        <DailyUseGearCategoryPage slug="baby-bath" />
      </main>
    </SiteShell>
  );
}
