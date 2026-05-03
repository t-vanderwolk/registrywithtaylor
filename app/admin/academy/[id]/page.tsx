import { redirect } from 'next/navigation';

type AdminAcademyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAcademyRedirectPage({ params }: AdminAcademyPageProps) {
  const { id } = await params;
  redirect(`/admin/academy/${id}/edit`);
}
