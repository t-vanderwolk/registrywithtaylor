import { redirect } from 'next/navigation';

type AdminBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogPostRedirectPage({ params }: AdminBlogPostPageProps) {
  const { id } = await params;
  redirect(`/admin/blog/${id}/edit`);
}
