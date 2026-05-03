import { redirect } from 'next/navigation';

type EditGuidePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditGuidePage({ params }: EditGuidePageProps) {
  const { id } = await params;
  redirect(`/admin/academy/${id}/edit`);
}
