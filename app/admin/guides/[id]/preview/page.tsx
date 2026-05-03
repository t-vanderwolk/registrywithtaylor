import { redirect } from 'next/navigation';

type AdminGuidePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGuidePreviewPage({ params }: AdminGuidePreviewPageProps) {
  const { id } = await params;
  redirect(`/admin/academy/${id}/preview`);
}
