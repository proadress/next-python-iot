import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './app/lib/cookie';

export async function middleware(req: NextRequest) {
  const token = getToken();

  if (token) {
    const res = await fetch(`${process.env.API_URL}/api/auth/user`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    if (!res.ok) {
      return NextResponse.redirect('/login')
    }
  } else {
    return NextResponse.redirect('/login')
  }
}
//protected
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*', '/'],
}