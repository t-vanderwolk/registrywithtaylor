import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import { canAccessAdminView } from '@/lib/server/apiAuth';
import { getDashboardPathForRole } from '@/lib/auth/roleRouting';

export async function requireAdminSession(callbackUrl = '/admin') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (session.user.role !== 'ADMIN') {
    redirect(getDashboardPathForRole(session.user.role));
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
