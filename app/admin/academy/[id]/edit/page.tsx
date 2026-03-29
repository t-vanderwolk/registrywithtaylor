import { redirect } from 'next/navigation';

type EditAcademyModulePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EditAcademyModulePage({ params }: EditAcademyModulePageProps) {
  const { id } = await params;
  redirect(`/admin/guides/${id}/edit`);
}
