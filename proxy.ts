// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = !!accessToken;

  let newAccessToken: string | undefined = undefined;
  let newRefreshToken: string | undefined = undefined;
  let shouldClearCookies = false;

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      if (response && response.status === 200) {
        isAuthenticated = true;

        const rawSetCookie = response.headers['set-cookie'];

        if (rawSetCookie) {
          const setCookieHeaders = Array.isArray(rawSetCookie) ? rawSetCookie : [rawSetCookie];

          setCookieHeaders.forEach(cookieStr => {
            const parsed = parseSetCookie(cookieStr);

            if (parsed.name === 'accessToken') {
              newAccessToken = parsed.value;
            }
            if (parsed.name === 'refreshToken') {
              newRefreshToken = parsed.value;
            }
          });
        }
      } else {
        isAuthenticated = false;
        shouldClearCookies = true;
      }
    } catch (error) {
      console.error('Failed to refresh session in middleware proxy:', error);
      isAuthenticated = false;

      shouldClearCookies = true;
    }
  }

  const isPrivateRoute = privateRoutes.some(route => currentPath.startsWith(route));
  if (isPrivateRoute && !isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL('/sign-in', request.url));

    if (shouldClearCookies) {
      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.delete('refreshToken');
    }
    return redirectResponse;
  }

  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const finalResponse = NextResponse.next();

  if (shouldClearCookies) {
    finalResponse.cookies.delete('accessToken');
    finalResponse.cookies.delete('refreshToken');
    return finalResponse;
  }

  if (newAccessToken) {
    finalResponse.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  if (newRefreshToken) {
    finalResponse.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return finalResponse;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
