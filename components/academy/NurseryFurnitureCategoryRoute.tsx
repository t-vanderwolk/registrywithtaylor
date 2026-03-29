import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import NurseryFurnitureCategoryPage from '@/components/academy/NurseryFurnitureCategoryPage';
import {
  buildNurseryFurnitureAcademySubmoduleModule,
  getNurseryFurnitureCategory,
  getNurseryFurnitureCategoryPath,
  type NurseryFurnitureCategorySlug,
} from '@/lib/academy/nurseryFurnitureAcademy';
import {
  getPublishedAcademyGuideForPath,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';

export default async function NurseryFurnitureCategoryRoute({
  slug,
}: {
  slug: NurseryFurnitureCategorySlug;
}) {
  const category = getNurseryFurnitureCategory(slug);
  const path = getNurseryFurnitureCategoryPath(slug);
  const academyGuide = await getPublishedAcademyGuideForPath(path);

  if (academyGuide) {
    const fallbackModule = buildNurseryFurnitureAcademySubmoduleModule(slug);
    const module = mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide);

    return (
      <AcademyModuleRenderer
        module={module}
        guide={academyGuide}
        fallbackSlug={`academy-nursery-furniture-${slug}`}
      />
    );
  }

  return (
    <>
      <PageViewTracker path={path} pageType="guide" slug={`academy-nursery-furniture-${slug}`} title={category.title} />
      <NurseryFurnitureCategoryPage slug={slug} />
    </>
  );
}
