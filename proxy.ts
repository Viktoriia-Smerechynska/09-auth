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

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      if (response && response.status === 200) {
        isAuthenticated = true;

        const setCookieHeaders = response.headers['set-cookie'];

        if (setCookieHeaders && setCookieHeaders.length > 0) {
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

  const finalResponse = NextResponse.next();

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
