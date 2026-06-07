import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function canAccessAdminView(role: string | undefined): boolean {
  return role === 'ADMIN' || role === 'REVIEWER';
}

function getDashboardPath(role: string | undefined): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'REVIEWER') return '/dashboard/reviewer';
  return '/';
}

/**
 * /learn routes that are always publicly accessible — no enrollment required.
 * Everything else under /learn is gated and redirects to /learn/waitlist.
 */
const LEARN_PUBLIC_PATHS = new Set([
  '/learn',
  '/learn/pricing',
  '/learn/waitlist',
  '/learn/art-of-the-registry',
  '/learn/nursery-foundations',
  '/learn/stroller-foundations',
  '/learn/registry-timeline',
]);

function isLearnGated(pathname: string): boolean {
  // Exact match on a public path → not gated
  if (LEARN_PUBLIC_PATHS.has(pathname)) return false;
  // Any /learn/* path that isn't in the public set → gated
  return pathname.startsWith('/learn/');
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin guard ────────────────────────────────────────────────────────────
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

  // ── Reviewer dashboard guard ───────────────────────────────────────────────
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

  // ── Academy module gate ────────────────────────────────────────────────────
  //
  // All /learn/[path]/[module] and deeper routes are gated behind enrollment.
  // Unauthenticated users are redirected to /learn/waitlist — never 401.
  //
  // The tmbc_enrolled cookie is set when a user purchases or is granted access.
  // During the waitlist phase (before launch) no cookie is ever issued, so
  // every gated page redirects to the waitlist.
  if (isLearnGated(pathname)) {
    const enrolled = req.cookies.get('tmbc_enrolled');
    if (!enrolled?.value) {
      return NextResponse.redirect(new URL('/learn/waitlist', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/reviewer/:path*',
    // Gate all /learn/* routes (the handler checks the public-path whitelist)
    '/learn/:path+',
  ],
};
