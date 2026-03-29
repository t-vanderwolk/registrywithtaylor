import NurseryFurnitureCategoryRoute from '@/components/academy/NurseryFurnitureCategoryRoute';
import SiteShell from '@/components/SiteShell';
import { getNurseryFurnitureCategory, getNurseryFurnitureCategoryPath } from '@/lib/academy/nurseryFurnitureAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getNurseryFurnitureCategory('dressers-changing');
const path = getNurseryFurnitureCategoryPath('dressers-changing');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Furniture That Actually Works | TMBC Baby Academy`,
  description: category.metadataDescription,
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function NurseryFurnitureDressersChangingPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <NurseryFurnitureCategoryRoute slug="dressers-changing" />
      </main>
    </SiteShell>
  );
}
