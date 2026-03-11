import { redirect } from 'next/navigation';

type AdminGuidePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGuideRedirectPage({ params }: AdminGuidePageProps) {
  const { id } = await params;
  redirect(`/admin/guides/${id}/edit`);
}
