import { NextResponse } from 'next/server'
import { auth } from '@shared/api/auth'
import { checkRouteAccess } from '@shared/utils/check-route-access'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user
  const routeAccess = checkRouteAccess(pathname, user)

  if (!routeAccess.success) {
    return NextResponse.redirect(
      new URL(
        routeAccess.reason === 'unauthenticated' ? '/' : '/403',
        req.nextUrl
      )
    )
  }
})

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|offline|offline.html|~offline).*)',
}
