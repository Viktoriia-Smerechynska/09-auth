// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const currentPath = nextUrl.pathname;

  const hasSession = cookies.has('sessionToken') || cookies.getAll().length > 0;

  const isPrivateRoute = privateRoutes.some(route => currentPath.startsWith(route));
  if (isPrivateRoute && !hasSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
