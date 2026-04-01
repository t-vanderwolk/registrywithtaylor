import type { Metadata } from 'next';
import NurseryFurnitureCategoryRoute from '@/components/academy/NurseryFurnitureCategoryRoute';
import SiteShell from '@/components/SiteShell';
import { getNurseryFurnitureCategory, getNurseryFurnitureCategoryPath } from '@/lib/academy/nurseryFurnitureAcademy';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import { getPublishedAcademyGuideForPath } from '@/lib/server/academyGuides';

const category = getNurseryFurnitureCategory('baby-proofing');
const path = getNurseryFurnitureCategoryPath('baby-proofing');

export async function generateMetadata(): Promise<Metadata> {
  const academyGuide = await getPublishedAcademyGuideForPath(path);

  return buildAcademyPageMetadata({
    defaultTitle: `${category.title} | Furniture That Actually Works | TMBC Baby Academy`,
    description: category.metadataDescription,
    path,
    imagePath: category.heroImageSrc,
    imageAlt: category.heroImageAlt,
    keywords: [
      category.title,
      category.description,
      ...category.types.slice(0, 2),
      ...category.whatActuallyMatters.slice(0, 2),
    ],
    guide: academyGuide,
  });
}

export default function NurseryFurnitureBabyProofingPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <NurseryFurnitureCategoryRoute slug="baby-proofing" />
      </main>
    </SiteShell>
  );
}
