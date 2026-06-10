import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import { canAccessAdminView } from '@/lib/server/apiAuth';
import { getDashboardPathForRole } from '@/lib/auth/roleRouting';

/**
 * Require any authenticated session. Redirects to /login if the visitor
 * is unauthenticated. Use this on member-facing pages (role: USER).
 * Admin and reviewer pages should still use requireAdminSession /
 * requireAdminViewSession respectively.
 */
export async function requireMemberSession(callbackUrl = '/dashboard') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

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
