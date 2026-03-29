import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function asSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAcademyNewRedirectPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : undefined;
  const path = asSingle(params?.path);
  redirect(path ? `/admin/guides/new?scope=academy&path=${encodeURIComponent(path)}` : '/admin/guides/new?scope=academy');
}
