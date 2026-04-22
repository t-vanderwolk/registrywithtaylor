import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildNurseryFurnitureAcademySubmoduleModule,
  type NurseryFurnitureCategorySlug,
} from '@/lib/academy/nurseryFurnitureAcademy';

export default async function NurseryFurnitureCategoryRoute({
  slug,
}: {
  slug: NurseryFurnitureCategorySlug;
}) {
  const module = buildNurseryFurnitureAcademySubmoduleModule(slug);

  return <AcademyModuleRenderer module={module} />;
}
