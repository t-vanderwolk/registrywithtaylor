import PageViewTracker from '@/components/analytics/PageViewTracker';
import NurseryFurnitureCategoryPage from '@/components/academy/NurseryFurnitureCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getNurseryFurnitureCategory, getNurseryFurnitureCategoryPath } from '@/lib/academy/nurseryFurnitureAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getNurseryFurnitureCategory('gliders');
const path = getNurseryFurnitureCategoryPath('gliders');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Furniture That Actually Works | TMBC Baby Academy`,
  description: category.metadataDescription,
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function NurseryFurnitureGlidersPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="academy-nursery-furniture-gliders" title={category.title} />
        <NurseryFurnitureCategoryPage slug="gliders" />
      </main>
    </SiteShell>
  );
}
