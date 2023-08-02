import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { upload } from './config/gfsConfig'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/signin' || path === '/signup'

  const token = request.cookies.get('token')?.value || ''

  // if (path === '/api/uploads') {
  //   console.log('/api/uploads')

  // upload.single('file')
  // }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/signup', request.nextUrl))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/dashboard',
    '/edit/:path*',
    '/api/uploads',
  ],
}
