import { redirect } from 'next/navigation';

type AdminAcademyPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function AdminAcademyPreviewPage({ params }: AdminAcademyPreviewPageProps) {
  const { id } = await params;
  redirect(`/admin/guides/${id}/preview`);
}
