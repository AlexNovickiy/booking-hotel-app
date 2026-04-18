import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login', '/register'];
const privatePaths = ['/profile', '/host'];

export async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const sessionId = req.cookies.get('sessionId')?.value;
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isPrivatePath = privatePaths.some(path => pathname.startsWith(path));

  const isAuthenticated = !!(refreshToken || sessionId);

  // Если пользователь авторизован и пытается зайти на публичные страницы
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Если пользователь не авторизован и пытается зайти на приватные страницы
  if (!isAuthenticated && isPrivatePath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/host/:path*', '/login', '/register'],
};

// const middleware = () => {};

export default middleware;
