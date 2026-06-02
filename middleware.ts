import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function canAccessAdminView(role: string | undefined): boolean {
  return role === 'ADMIN' || role === 'REVIEWER';
}

function getDashboardPath(role: string | undefined): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'REVIEWER') return '/dashboard/reviewer';
  return '/';
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string | undefined;
    if (!canAccessAdminView(role)) {
      return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard/reviewer')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string | undefined;
    if (!canAccessAdminView(role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/reviewer/:path*'],
};
