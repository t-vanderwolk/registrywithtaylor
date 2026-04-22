import ModuleLayout, { type ModuleLayoutData } from '@/components/academy/ModuleLayout';

export default function AcademyModuleRenderer({
  module,
}: {
  module: ModuleLayoutData;
}) {
  return <ModuleLayout module={module} />;
}
