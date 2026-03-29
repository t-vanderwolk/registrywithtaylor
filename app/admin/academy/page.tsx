import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminAcademyRedirectPage() {
  redirect('/admin/guides?scope=academy');
}
