import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIX = '/dashboard'
const AUTH_ROUTES = ['/login', '/signup']

function isProtected(pathname: string): boolean {
  if (AUTH_ROUTES.includes(pathname)) return false  // login/signup skip
  return (
    pathname.startsWith(PROTECTED_PREFIX) ||
    /^\/[^/]+$/.test(pathname)  // /[username] pattern match karta hai
  )
}

/** Copies refreshed Supabase auth cookies onto any redirect response. */
function copyAuthCookies(
  from: NextResponse,
  to: NextResponse
): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, cookie)
  })
  return to
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[proxy] Missing Supabase env vars')
    return supabaseResponse
  }

  // WARNING: Do not add any logic between createServerClient and getUser().
  // Doing so risks breaking session refresh and causing random logouts.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()

  // On auth error, block protected routes — fail safe
  if (error && isProtected(pathname)) {
    console.error('[middleware] Auth error:', error.message)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return copyAuthCookies(supabaseResponse, NextResponse.redirect(loginUrl))
  }

  if (!user && isProtected(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return copyAuthCookies(supabaseResponse, NextResponse.redirect(loginUrl))
  }

  // Redirect authenticated users away from auth pages
  if (user && AUTH_ROUTES.includes(pathname)) {
    const next = request.nextUrl.searchParams.get('next')
    const destination = next?.startsWith('/') ? next : PROTECTED_PREFIX
    return copyAuthCookies(
      supabaseResponse,
      NextResponse.redirect(new URL(destination, request.url))
    )
  }

  // IMPORTANT: Always return supabaseResponse (or a copy with its cookies)
  // so the browser receives refreshed session tokens. Never return a plain
  // NextResponse.next() here — it will drop the refreshed cookies.
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|[a-zA-Z0-9]+\\.[a-zA-Z]+$).*)'],
}