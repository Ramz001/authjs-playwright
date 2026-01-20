import { NextResponse } from 'next/server'
import { auth } from '@/features/auth/server'
import {
  PROTECTED_ROUTES,
  DEFAULT_UNAUTHENTICATED_REDIRECT,
} from '@features/auth/server'

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isListedProtectedRoute = PROTECTED_ROUTES.some((route) =>
    nextUrl.pathname.includes(route)
  )

  if (!session?.user && isListedProtectedRoute) {
    return NextResponse.redirect(
      new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, nextUrl)
    )
  }
})

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|offline|offline.html|~offline).*)',
}
