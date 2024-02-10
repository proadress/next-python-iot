import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './app/lib/cookie';

export default async function middleware(request: NextRequest) {
  const token = getToken();
  console.log(process.env.VERCEL_URL);
  return NextResponse.json(process.env.VERCEL_URL);

  // if (token) {
  //   const res = await fetch(`${process.env.VERCEL_URL}/api/auth/user`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + token
  //     }
  //   })
  //   if (!res.ok) {
  //     return NextResponse.rewrite(new URL('/login', request.url));
  //   }
  // } else {
  //   return NextResponse.rewrite(new URL('/login', request.url));
  // }
}
//protected
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*', '/'],
}