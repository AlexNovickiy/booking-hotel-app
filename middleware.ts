// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
// import { checkServerSession } from './lib/api/serverApi';
// import { parse } from 'cookie';

// const publicPaths = ['/login', '/register'];
// const privatePaths = ['/profile', '/host'];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const cookieStore = await cookies();
//   const refreshToken = cookieStore.get('refreshToken')?.value;
//   const accessToken = req
//     ? req.headers.get('authorization')?.split(' ')[1]
//     : null;
//   const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
//   const isPrivatePath = privatePaths.some(path => pathname.startsWith(path));

//   if (!accessToken) {
//     if (refreshToken) {
//       const response = await checkServerSession();
//       const setCookie = response?.headers['set-cookie'];
//       if (setCookie) {
//         const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//         for (const cookieString of cookiesArray) {
//           const parsedCookie = parse(cookieString);
//           const options = {
//             httpOnly: true,
//             expires: parsedCookie.Expires
//               ? new Date(parsedCookie.Expires)
//               : undefined,
//           };
//           if (parsedCookie['refreshToken']) {
//             cookieStore.set(
//               'refreshToken',
//               parsedCookie['refreshToken'],
//               options
//             );
//           }
//           if (parsedCookie['sessionId']) {
//             cookieStore.set('sessionId', parsedCookie['sessionId'], options);
//           }
//         }

//         if (isPublicPath) {
//           return NextResponse.redirect(new URL('/', req.url), {
//             headers: {
//               Authorization: response.headers.authorization,
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }

//         if (isPrivatePath) {
//           return NextResponse.next({
//             headers: {
//               Authorization: response.headers.authorization,
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//       }
//     }

//     if (isPublicPath) {
//       return NextResponse.next();
//     }

//     if (isPrivatePath) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }

//   if (isPublicPath) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   if (isPrivatePath) {
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ['/profile/:path*', '/host/:path*', '/login', '/register'],
// };

const middleware = () => {};

export default middleware;
