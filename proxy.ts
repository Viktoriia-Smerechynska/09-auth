// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = !!accessToken;
  let newCookiesToSet: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionData = await checkSession();

      if (sessionData) {
        isAuthenticated = true;

        const updatedAccessToken = cookieStore.get('accessToken')?.value;
        if (updatedAccessToken) {
          accessToken = updatedAccessToken;
        }
      }
    } catch (error) {
      console.error('Failed to refresh session in middleware proxy:', error);
      isAuthenticated = false;
    }
  }

  const isPrivateRoute = privateRoutes.some(route => currentPath.startsWith(route));
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  if (accessToken) {
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
