import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';

export async function requireAdminSession(callbackUrl = '/admin') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return session;
}
