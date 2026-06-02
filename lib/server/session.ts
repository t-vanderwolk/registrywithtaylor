import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import { canAccessAdminView } from '@/lib/server/apiAuth';

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

export async function requireAdminViewSession(callbackUrl = '/admin') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!canAccessAdminView(session.user.role)) {
    redirect('/');
  }

  return session;
}
