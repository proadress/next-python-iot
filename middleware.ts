import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './app/lib/cookie';

export default async function middleware(request: NextRequest) {
  const token = getToken();
  console.log(process.env.API_URL);
  return NextResponse.json(process.env.API_URL);

  if (token) {
    const res = await fetch(`${process.env.API_URL}/api/auth/user`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
//protected
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*', '/'],
}