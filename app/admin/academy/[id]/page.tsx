import { redirect } from 'next/navigation';

type AdminAcademyModulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAcademyModuleRedirectPage({ params }: AdminAcademyModulePageProps) {
  const { id } = await params;
  redirect(`/admin/guides/${id}/edit`);
}
