import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function asSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGuidesIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : undefined;
  const nextParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(params ?? {})) {
    if (key === 'scope') {
      continue;
    }

    const value = asSingle(rawValue);
    if (value) {
      nextParams.set(key, value);
    }
  }

  redirect(nextParams.size > 0 ? `/admin/academy?${nextParams.toString()}` : '/admin/academy');
}
