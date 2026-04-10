import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildNurseryFurnitureAcademySubmoduleModule,
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
  const path = getNurseryFurnitureCategoryPath(slug);
  const academyGuide = await getPublishedAcademyGuideForPath(path);
  const fallbackModule = buildNurseryFurnitureAcademySubmoduleModule(slug);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;

  return (
    <AcademyModuleRenderer
      module={module}
      guide={academyGuide}
      fallbackSlug={`academy-nursery-furniture-${slug}`}
    />
  );
}
