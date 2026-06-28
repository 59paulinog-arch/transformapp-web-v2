import { NextResponse } from 'next/server';

const PROTECTED = ['/dashboard', '/diary', '/notifications', '/profile', '/subscription', '/onboarding'];
const AUTH_ONLY  = ['/login', '/register', '/verify-otp', '/forgot-password'];

export function middleware(req) {
  const token    = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
