import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await hasSession();
  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith('/admin')) {
      if (!session || session.user.role !== 'admin') {
          return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  // Protect Profile Routes
  if (pathname.startsWith('/profile')) {
      if (!session) {
          return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  // Prevent logged-in users from visiting login/signup
  if ((pathname.startsWith('/login') || pathname.startsWith('/signup')) && session) {
      return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/login', '/signup'],
}
